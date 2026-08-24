# Risulta site

The static, multi-page website and interactive Linux installer for
[Risulta](https://github.com/baronunread/risulta).

It is written in semantic HTML and plain CSS, with one small inline script that
updates the installer URL to match the deployed origin. There is no framework,
package installation, build step, or client application runtime.

## Preview

```sh
python3 -m http.server 8080
```

Open <http://localhost:8080>. The site has no build step or runtime dependency.

Pages include the home page, detailed features, platform comparisons, public
roadmap, privacy information, and terms.

## Installer

The production command is:

```sh
curl -fsSL https://baronunread.github.io/risulta-site/install.sh | sudo sh
```

The installer supports Debian and Ubuntu on Linux x64 or arm64. It downloads
the matching binary and checksum from the latest `baronunread/risulta` GitHub
release. Set `RISULTA_REPOSITORY=owner/repository` to test another release
repository.

It creates `/usr/local/bin/risulta`, a locked-down `risulta` system user,
`/var/lib/risulta`, `/etc/risulta/risulta.env`, and a hardened systemd service.
On a fresh installation it asks for the first administrator credentials, waits
for successful bootstrap, and then removes their plaintext values from disk.
Rerunning it preserves the database and administrator, detects the saved domain,
port, and Caddy choice, and offers to reuse those settings.

If Caddy setup is selected, the installer uses the official stable Debian
package and writes only `/etc/caddy/sites/risulta.caddy`. It adds a single
`import sites/*` line to the main Caddyfile when needed, validates the complete
configuration, and reloads Caddy.
If Caddy cannot start, Risulta remains installed and running; the installer
prints Caddy's status, recent journal entries, and any processes occupying ports
80 or 443 before explaining how to retry.

## Publish

GitHub Pages deploys on pushes to `main`. For a custom domain, configure it in
the repository’s Pages settings; the command shown on the page automatically
uses the site’s current HTTPS origin.
