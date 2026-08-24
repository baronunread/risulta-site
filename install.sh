#!/bin/sh
set -eu

REPOSITORY="${RISULTA_REPOSITORY:-baronunread/risulta}"
INSTALL_PATH="/usr/local/bin/risulta"
ENV_DIR="/etc/risulta"
ENV_FILE="$ENV_DIR/risulta.env"
DATA_DIR="/var/lib/risulta"
SERVICE_FILE="/etc/systemd/system/risulta.service"
PORT="${RISULTA_PORT:-}"

say() { printf '%s\n' "$*"; }
fail() { say "Error: $*" >&2; exit 1; }
prompt() {
  label="$1"; default="${2:-}"
  if [ -n "$default" ]; then printf '%s [%s]: ' "$label" "$default" > /dev/tty; else printf '%s: ' "$label" > /dev/tty; fi
  IFS= read -r answer < /dev/tty || fail "Unable to read from the terminal."
  if [ -z "$answer" ]; then answer="$default"; fi
  printf '%s' "$answer"
}
confirm() {
  label="$1"; default="${2:-y}"
  if [ "$default" = "y" ]; then suffix="Y/n"; else suffix="y/N"; fi
  printf '%s [%s]: ' "$label" "$suffix" > /dev/tty
  IFS= read -r answer < /dev/tty || fail "Unable to read from the terminal."
  answer="${answer:-$default}"
  case "$answer" in y|Y|yes|YES|Yes) return 0 ;; *) return 1 ;; esac
}
secret() {
  label="$1"
  printf '%s: ' "$label" > /dev/tty
  stty -echo < /dev/tty
  IFS= read -r answer < /dev/tty || { stty echo < /dev/tty; fail "Unable to read from the terminal."; }
  stty echo < /dev/tty
  printf '\n' > /dev/tty
  printf '%s' "$answer"
}
env_quote() {
  printf '%s' "$1" | sed 's/\\/\\\\/g; s/"/\\"/g'
}
saved_setting() {
  key="$1"
  [ -r "$ENV_FILE" ] || return 0
  sed -n "s/^${key}=\"\(.*\)\"$/\1/p" "$ENV_FILE" | tail -n 1
}
caddy_failure() {
  say ""
  say "Caddy could not start. Risulta and its administrator account are still installed."
  say "Caddy status:"
  systemctl status caddy --no-pager -l >&2 || true
  say "Recent Caddy logs:"
  journalctl -u caddy -n 50 --no-pager >&2 || true
  if command -v ss >/dev/null 2>&1; then
    say "Processes listening on web ports:"
    ss -ltnp '( sport = :80 or sport = :443 )' >&2 || true
  fi
  fail "Fix the Caddy error above, then rerun this installer; saved settings will be offered."
}

[ "$(id -u)" -eq 0 ] || fail "Run this installer as root: curl -fsSL <installer-url> | sudo sh"
[ -r /dev/tty ] || fail "An interactive terminal is required. Download the script first if needed."
command -v curl >/dev/null 2>&1 || fail "curl is required."
command -v systemctl >/dev/null 2>&1 || fail "Risulta currently requires a systemd-based Linux server."

case "$(uname -s)" in Linux) ;; *) fail "Only Linux servers are supported by this installer." ;; esac
case "$(uname -m)" in
  x86_64|amd64) artifact="risulta-linux-x64" ;;
  aarch64|arm64) artifact="risulta-linux-arm64" ;;
  *) fail "Unsupported CPU architecture: $(uname -m)" ;;
esac

say ""
say "Risulta installer"
say "Private web analytics in one binary."
say ""

fresh_install=1
if [ -f "$DATA_DIR/control.db" ]; then
  fresh_install=0
  say "Existing Risulta data and administrator found. They will not be replaced."
fi

saved_base_url="$(saved_setting RISULTA_BASE_URL)"
saved_proxy="$(saved_setting RISULTA_TRUST_PROXY)"
saved_port="$(saved_setting PORT)"
[ -n "$PORT" ] || PORT="${saved_port:-3000}"
case "$saved_proxy" in 1) ;; *) saved_proxy=0 ;; esac

saved_domain=""
case "$saved_base_url" in
  https://*) saved_domain="${saved_base_url#https://}" ;;
  http://*) saved_domain="${saved_base_url#http://}"; saved_domain="${saved_domain%:$PORT}" ;;
esac

reuse_settings=0
if [ -n "$saved_domain" ]; then
  if [ "$saved_proxy" = "1" ]; then saved_caddy_label="yes"; else saved_caddy_label="no"; fi
  say "Saved configuration: domain $saved_domain, port $PORT, Caddy $saved_caddy_label."
  if confirm "Keep these settings?" y; then reuse_settings=1; fi
fi

if [ "$reuse_settings" -eq 1 ]; then
  domain="$saved_domain"
  use_caddy="$saved_proxy"
else
  domain="$(prompt "Analytics domain (for example, stats.example.com)" "$saved_domain")"
  case "$domain" in
    ""|*://*|*/*|*:*|*' '*|*'{'*|*'}'*) fail "Enter a hostname only, without a scheme, port, path, or spaces." ;;
  esac

  use_caddy=0
  caddy_default="y"
  [ "$saved_proxy" = "0" ] && caddy_default="n"
  if confirm "Configure Caddy and automatic HTTPS for $domain?" "$caddy_default"; then use_caddy=1; fi
fi

if [ "$fresh_install" -eq 1 ]; then
  admin_email="$(prompt "Administrator email")"
  case "$admin_email" in *@*.*) ;; *) fail "Enter a valid administrator email." ;; esac
  admin_password="$(secret "Administrator password (12 characters or more)")"
  [ "${#admin_password}" -ge 12 ] || fail "The administrator password must contain at least 12 characters."
  admin_password_again="$(secret "Confirm administrator password")"
  [ "$admin_password" = "$admin_password_again" ] || fail "The passwords do not match."
fi

if [ "$use_caddy" -eq 1 ]; then
  base_url="https://$domain"
  listen_host="127.0.0.1"
else
  base_url="http://$domain:$PORT"
  listen_host="0.0.0.0"
fi

tmp_dir="$(mktemp -d /tmp/risulta-install.XXXXXX)"
cleanup() { rm -rf "$tmp_dir"; }
trap cleanup EXIT HUP INT TERM
download_base="https://github.com/$REPOSITORY/releases/latest/download"

say ""
say "Downloading $artifact…"
curl --proto '=https' --tlsv1.2 -fsSL "$download_base/$artifact" -o "$tmp_dir/$artifact"
curl --proto '=https' --tlsv1.2 -fsSL "$download_base/$artifact.sha256" -o "$tmp_dir/$artifact.sha256"
(
  cd "$tmp_dir"
  if command -v sha256sum >/dev/null 2>&1; then
    sha256sum -c "$artifact.sha256"
  elif command -v shasum >/dev/null 2>&1; then
    expected="$(awk '{print $1}' "$artifact.sha256")"
    actual="$(shasum -a 256 "$artifact" | awk '{print $1}')"
    [ "$expected" = "$actual" ] || fail "The downloaded binary failed checksum verification."
  else
    fail "sha256sum or shasum is required to verify the download."
  fi
)

if ! id risulta >/dev/null 2>&1; then
  useradd --system --home-dir "$DATA_DIR" --shell /usr/sbin/nologin risulta
fi
install -d -m 0750 -o risulta -g risulta "$DATA_DIR" "$ENV_DIR"
install -m 0755 "$tmp_dir/$artifact" "$INSTALL_PATH"

umask 077
env_tmp="$tmp_dir/risulta.env"
{
  printf 'HOST="%s"\n' "$(env_quote "$listen_host")"
  printf 'PORT="%s"\n' "$(env_quote "$PORT")"
  printf 'DATA_DIR="%s"\n' "$(env_quote "$DATA_DIR")"
  printf 'RISULTA_BASE_URL="%s"\n' "$(env_quote "$base_url")"
  printf 'RISULTA_TRUST_PROXY="%s"\n' "$use_caddy"
  printf 'RISULTA_MAX_OPEN_SITES="32"\n'
  if [ "$fresh_install" -eq 1 ]; then
    printf 'RISULTA_ADMIN_EMAIL="%s"\n' "$(env_quote "$admin_email")"
    printf 'RISULTA_ADMIN_PASSWORD="%s"\n' "$(env_quote "$admin_password")"
  fi
} > "$env_tmp"
install -m 0600 "$env_tmp" "$ENV_FILE"

cat > "$SERVICE_FILE" <<'UNIT'
[Unit]
Description=Risulta web analytics
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=risulta
Group=risulta
EnvironmentFile=/etc/risulta/risulta.env
ExecStart=/usr/local/bin/risulta
Restart=on-failure
RestartSec=3
TimeoutStopSec=10
StateDirectory=risulta
WorkingDirectory=/var/lib/risulta
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/var/lib/risulta

[Install]
WantedBy=multi-user.target
UNIT

systemctl daemon-reload
systemctl enable --now risulta

ready=0
attempt=0
while [ "$attempt" -lt 30 ]; do
  if curl -fsS "http://127.0.0.1:$PORT/healthz" >/dev/null 2>&1; then ready=1; break; fi
  attempt=$((attempt + 1))
  sleep 1
done
if [ "$ready" -ne 1 ]; then
  systemctl status risulta --no-pager >&2 || true
  fail "Risulta did not become healthy. Review: journalctl -u risulta"
fi

if [ "$fresh_install" -eq 1 ]; then
  credentials_free="$tmp_dir/risulta.env.clean"
  grep -v '^RISULTA_ADMIN_' "$ENV_FILE" > "$credentials_free"
  install -m 0600 "$credentials_free" "$ENV_FILE"
  admin_password=""
  admin_password_again=""
  systemctl restart risulta
fi

if [ "$use_caddy" -eq 1 ]; then
  if ! command -v caddy >/dev/null 2>&1; then
    say ""
    say "Caddy is not installed. Installing the official stable package…"
    command -v apt-get >/dev/null 2>&1 || fail "Automatic Caddy installation currently supports Debian and Ubuntu. Install Caddy, then run this script again."
    apt-get update
    apt-get install -y debian-keyring debian-archive-keyring apt-transport-https curl gnupg
    curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor --yes -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
    curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' -o /etc/apt/sources.list.d/caddy-stable.list
    chmod o+r /usr/share/keyrings/caddy-stable-archive-keyring.gpg /etc/apt/sources.list.d/caddy-stable.list
    apt-get update
    if ! apt-get install -y caddy; then
      command -v caddy >/dev/null 2>&1 || fail "The Caddy package could not be installed."
      say "The package installed Caddy but its initial service start failed; applying the Risulta configuration before retrying."
    fi
  fi

  install -d -m 0755 /etc/caddy/sites
  caddy_site="/etc/caddy/sites/risulta.caddy"
  {
    printf '%s {\n' "$domain"
    printf '\tencode zstd gzip\n'
    printf '\treverse_proxy 127.0.0.1:%s\n' "$PORT"
    printf '}\n'
  } > "$caddy_site"
  if [ ! -f /etc/caddy/Caddyfile ]; then
    printf 'import sites/*\n' > /etc/caddy/Caddyfile
  elif ! grep -Eq '^[[:space:]]*import[[:space:]]+sites/\*' /etc/caddy/Caddyfile; then
    printf '\nimport sites/*\n' >> /etc/caddy/Caddyfile
  fi
  caddy validate --config /etc/caddy/Caddyfile
  systemctl enable caddy
  if ! systemctl reload-or-restart caddy; then caddy_failure; fi
fi

say ""
say "Risulta is ready."
say "Dashboard: $base_url"
if [ "$use_caddy" -eq 1 ]; then
  say "Caddy: configured for automatic HTTPS"
  say "Make sure the DNS A/AAAA record for $domain points to this server."
else
  say "Caddy: skipped; Risulta is listening on $listen_host:$PORT"
  say "Put a TLS reverse proxy in front of this port before using it on the public internet."
fi
say "Service status: systemctl status risulta"
say "Logs: journalctl -u risulta"
