import { useState } from "react";
import { BarChart3, Check, Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export function App() {
  const [copied, setCopied] = useState(false);
  const copyInstallScript = async () => {
    await navigator.clipboard.writeText(
      "curl -fsSL https://baronunread.github.io/risulta-site/install.sh | sudo sh",
    );
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };
  return (
    <main className="mx-auto max-w-6xl px-6 py-8 sm:px-10">
      <header className="flex items-center justify-between">
        <a className="flex items-center gap-2 font-semibold" href="/">
          <BarChart3 className="size-5 text-orange-500" />
          Risulta
        </a>
        <nav className="flex gap-5 text-sm text-muted-foreground">
          <a href="#features">Features</a>
          <a href="#why">Why Risulta</a>
          <a href="https://github.com/baronunread/risulta/issues">Roadmap</a>
          <a href="#install">Install</a>
        </nav>
      </header>
      <section className="py-24">
        <p className="text-sm font-medium text-orange-600">
          Self-hosted · Multi-site · Open source
        </p>
        <h1 className="mt-5 max-w-3xl text-5xl font-semibold tracking-tight sm:text-7xl">
          Web analytics you run yourself.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          One Linux binary serves the dashboard, collects pageviews, and keeps multiple websites in
          SQLite. No cookies or external database.
        </p>
        <div id="install" className="mt-8 max-w-2xl rounded-xl border bg-card p-4 shadow-sm">
          <p className="text-sm font-medium">Install or update on Debian or Ubuntu</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Downloads and verifies the latest release, then installs or updates the Risulta systemd
            service. Run the same command whenever you want the newest version.
          </p>
          <div className="mt-4 flex flex-col gap-3 rounded-lg bg-background p-3 text-foreground sm:flex-row sm:items-center sm:justify-between">
            <code className="min-w-0 break-all text-sm">
              curl -fsSL https://baronunread.github.io/risulta-site/install.sh | sudo sh
            </code>
            <Button
              className="w-full shrink-0 justify-center sm:w-34"
              size="sm"
              variant="secondary"
              onClick={copyInstallScript}
            >
              {copied ? <Check /> : <Copy />}
              {copied ? "Copied" : "Copy command"}
            </Button>
          </div>
        </div>
        <div className="mt-4">
          <Button variant="outline" asChild>
            <a href="https://github.com/baronunread/risulta">
              <ExternalLink />
              Source code
            </a>
          </Button>
        </div>
      </section>
      <figure className="overflow-hidden rounded-xl border bg-card shadow-2xl shadow-black/20">
        <img
          alt="Risulta dashboard with seven-day visitor trends, top pages, and traffic sources"
          className="block h-auto w-full"
          src={`${import.meta.env.BASE_URL}risulta-dashboard.png`}
        />
      </figure>
      <section id="features" className="grid gap-6 py-24 md:grid-cols-2">
        <div>
          <p className="text-sm font-medium text-orange-600">Included</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight">What ships in the binary</h2>
        </div>
        <div className="grid gap-4">
          {[
            [
              "Collector and dashboard",
              "Track pageviews and review reports from the same small server.",
            ],
            [
              "Multiple websites",
              "Give every site its own tracker key, data store, and access rules.",
            ],
            [
              "Cookie-free visitor counts",
              "Use anonymous, daily-scoped hashes instead of browser identifiers.",
            ],
            ["Auditable source", "Read the complete server and tracker code on GitHub."],
          ].map(([title, description]) => (
            <Card key={title}>
              <CardHeader className="py-4">
                <CardTitle className="text-base">{title}</CardTitle>
                <p className="text-sm leading-6 text-muted-foreground">{description}</p>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
      <section id="why" className="border-y py-16">
        <h2 className="max-w-2xl text-4xl font-semibold tracking-tight">
          Everything important stays in one small system.
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {[
            [
              "Reports that answer the basics",
              "Unique visitors, visits, pageviews, views per visit, current visitors, top pages, and top sources across Today, 7-day, and 30-day ranges.",
            ],
            [
              "Multi-site by design",
              "Every website has a separate tracker key and SQLite database. Administrators see all sites; viewers can be limited to selected sites.",
            ],
            [
              "Privacy without cookies",
              "The tracker sends pageviews only. Daily server-side salts create anonymous visitor hashes without cookies or cross-day identity.",
            ],
            [
              "One binary, durable storage",
              "The server includes the dashboard, collector, authentication, and SQLite. WAL mode and per-site databases keep operational boundaries simple.",
            ],
            [
              "Security built into routine flows",
              "Password hashes, expiring secure sessions, CSRF validation, same-origin form checks, and login rate limiting are part of the application.",
            ],
            [
              "Deployment that stays understandable",
              "The installer supports Debian and Ubuntu on x64 and arm64, verifies release checksums, creates a systemd service, and can configure Caddy HTTPS.",
            ],
          ].map(([title, description]) => (
            <div className="border-t pt-5" key={title}>
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </section>
      <section id="compare" className="grid gap-6 py-20 md:grid-cols-[1fr_1.5fr]">
        <div>
          <p className="text-sm font-medium text-orange-600">The difference</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight">
            No analytics stack to operate.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Risulta favors a focused executable and local storage over containers, hosted accounts,
            and a separate database service.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ["One executable", "Dashboard, collector, and authentication together."],
            ["Embedded SQLite", "No PostgreSQL, ClickHouse, or managed database."],
            ["Small tracker", "A pageview-only script without a product suite."],
          ].map(([title, description]) => (
            <div className="border-t pt-5" key={title}>
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </section>
      <footer className="mt-24 flex flex-col gap-6 border-t py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div>
          <a className="font-semibold text-foreground" href="/">
            Risulta
          </a>
          <p className="mt-1">Private web analytics in one binary.</p>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-2">
          <a href="#features">Features</a>
          <a href="#compare">Why Risulta</a>
          <a href="https://github.com/baronunread/risulta/issues">Roadmap</a>
          <a href="https://github.com/baronunread/risulta">Source</a>
          <a href="https://github.com/baronunread/risulta/releases">Releases</a>
        </nav>
        <span>© 2026 Andrea Bruno</span>
      </footer>
    </main>
  );
}

export default App;
