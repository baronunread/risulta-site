# Risulta site

The static, multi-page website for [Risulta](https://github.com/baronunread/risulta).

The installer source is maintained in the app repository at
`deploy/install.sh` and published at `/install.sh` by the Pages site. Copy the
updated installer into `public/install.sh` when publishing app installer
changes.

## Preview

```sh
npm run build
python3 -m http.server 8080 --directory dist
```

Open <http://localhost:8080>. The generated site is static and has no server runtime dependency.

Pages include the home page, detailed features, and platform comparisons. The
public roadmap links directly to the application repository's GitHub Issues.

## Installer

The production command is:

```sh
curl -fsSL https://risulta.dev/install.sh | sudo sh
```

The installer supports Debian and Ubuntu on Linux x64 or arm64. It downloads
the matching binary and checksum from the latest `baronunread/risulta` GitHub
release. Set `RISULTA_REPOSITORY=owner/repository` to test another release
repository.

After installing, update a server with `sudo risulta update`. Use
`sudo risulta update --channel nightly` to opt into nightly releases.

Before replacing the binary, it shows the installed and available versions and
exits without changes when they match. Downloads, checksum verification, and
service startup use terminal progress indicators when the installer is run from
an interactive terminal.

It creates `/usr/local/bin/risulta-sprout`, a locked-down `risulta-sprout`
system user, `/var/lib/risulta-sprout`, `/etc/risulta-sprout/risulta-sprout.env`,
and a hardened systemd service. It also installs `/usr/local/bin/risulta` for
stable and nightly updates.
On a fresh installation it asks for the first administrator credentials, waits
for successful bootstrap, and then removes their plaintext values from disk.
Rerunning it preserves the database and administrator, detects the saved domain,
port, and Caddy choice, and offers to reuse those settings.

The installer supports an existing reverse proxy or direct HTTP for private
and development networks.

Use `sudo risulta update` for subsequent stable updates. Use
`sudo risulta update --channel nightly` to opt into nightlies. The selected
channel is saved on the server.

## Publish

GitHub Pages deploys on pushes to `main`. For a custom domain, configure it in
the repository’s Pages settings; the command shown on the page automatically
uses the site’s current HTTPS origin.
