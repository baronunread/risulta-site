import { useState } from "react";
import {
  Activity,
  Check,
  CircleDot,
  Copy,
  DatabaseBackup,
  ExternalLink,
  FileDown,
  GitFork,
  Globe,
  ShieldCheck,
  Star,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/logo";

const VERSION = "v0.1.4";

export function App() {
  const [copied, setCopied] = useState(false);
  const copyInstallScript = async () => {
    await navigator.clipboard.writeText(
      "curl -fsSL https://raw.githubusercontent.com/baronunread/risulta/main/deploy/install.sh | sudo sh",
    );
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };
  return (
    <>
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-8 sm:px-10">
        <a className="flex items-center gap-2 font-semibold" href="/">
          <Logo className="size-5" />
          Risulta
        </a>
        <nav aria-label="Main navigation" className="hidden gap-5 text-sm text-muted-foreground sm:flex">
          <a href="#features">Features</a>
          <a href="#sproutboat">Sproutboat</a>
          <a href="#compare">Compare</a>
          <a href="#github">GitHub</a>
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-6 sm:px-10">
      <section className="relative overflow-hidden py-16 sm:py-20">
        <Logo className="pointer-events-none absolute -top-16 -right-24 -z-10 size-[26rem] text-foreground/[0.03] sm:size-[34rem]" />
        <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:items-center">
          <div className="min-w-0">
            <div className="fade-1 flex flex-wrap items-center gap-3 text-sm font-medium text-muted-foreground">
              <span>Self-hosted · Multi-site · AGPL-3.0</span>
              <a className="rounded-full border px-2.5 py-1 text-xs text-foreground transition hover:bg-accent" href={`https://github.com/baronunread/risulta/releases/tag/${VERSION}`}>
                {VERSION}
              </a>
            </div>
            <h1 className="mt-5 text-5xl font-semibold tracking-tight sm:text-6xl">
              The smallest self-hosted analytics you can run.
            </h1>
            <p className="fade-2 mt-6 max-w-md text-lg text-muted-foreground">
              A single 5.6 MB binary, no Docker, no database container, no Node runtime. Just the
              file and its data directory.
            </p>
            <div id="install" className="fade-3 mt-8 rounded-xl border bg-card p-4 shadow-sm">
              <p className="text-sm font-medium">Install or update on Debian or Ubuntu</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Downloads and verifies the latest release, then installs or updates the Risulta systemd
                service. Run the same command whenever you want the newest version.
              </p>
              <div className="mt-4 flex flex-col gap-3 rounded-lg bg-background p-3 text-foreground sm:flex-row sm:items-center sm:justify-between">
                <code className="min-w-0 overflow-x-auto whitespace-nowrap text-sm">
                  curl -fsSL https://raw.githubusercontent.com/baronunread/risulta/main/deploy/install.sh | sudo sh
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
            <div className="fade-3 mt-4 flex flex-wrap items-center gap-4">
              <Button variant="outline" asChild>
                <a href="https://github.com/baronunread/risulta">
                  <ExternalLink />
                  Source code
                </a>
              </Button>
              <p className="text-sm text-muted-foreground">
                AGPL-3.0 server and dashboard; MIT tracker script.
              </p>
            </div>
          </div>
          <div className="fade-3 lg:justify-self-end">
            <p className="text-right font-mono leading-none">
              <span className="text-7xl font-bold tracking-tight sm:text-8xl">5.6</span>
              <span className="ml-2 text-2xl font-semibold text-muted-foreground">MB</span>
            </p>
            <div className="mt-7 grid gap-2.5 lg:w-80">
              {[
                { name: "Risulta", value: "5.6 MB", pct: 4, self: true },
                { name: "GoatCounter", value: "~25 MB", pct: 19 },
                { name: "Plausible CE", value: "~58 MB*", pct: 45 },
                { name: "Umami", value: "~130 MB*", pct: 100 },
              ].map(({ name, value, pct, self }) => (
                <div key={name} className="grid grid-cols-[92px_1fr_68px] items-center gap-3">
                  <span className="text-sm text-muted-foreground">{name}</span>
                  <span className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <span
                      className={`block h-full rounded-full ${self ? "bg-foreground" : "bg-foreground/25"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </span>
                  <span className="text-right font-mono text-xs">{value}</span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-right text-xs text-muted-foreground/70">
              *Docker image, before adding a database
            </p>
          </div>
        </div>
      </section>
      <section className="reveal pb-24">
        <figure className="overflow-hidden rounded-xl border bg-card shadow-xl shadow-black/10">
          <div className="flex items-center gap-1.5 border-b bg-muted px-3 py-2.5">
            <span className="size-2.5 rounded-full bg-foreground/15" />
            <span className="size-2.5 rounded-full bg-foreground/15" />
            <span className="size-2.5 rounded-full bg-foreground/15" />
          </div>
          <img
            alt="Risulta dashboard: seven-day visitor trend, top pages, and traffic sources"
            className="block h-auto w-full"
            width={1600}
            height={1681}
            loading="lazy"
            decoding="async"
            src={`${import.meta.env.BASE_URL}risulta-dashboard.png`}
          />
        </figure>
      </section>
      <section id="sproutboat" className="reveal py-24">
        <div className="grid gap-8 md:grid-cols-[1fr_1fr] md:items-center">
          <div>
            <h2 className="max-w-lg text-4xl font-semibold tracking-tight">
              Built as a binary using Sproutboat.
            </h2>
            <p className="mt-4 max-w-lg text-muted-foreground">
              Risulta compiles from a Workers-style <code className="rounded bg-muted px-1.5 py-0.5 text-sm">fetch</code>{" "}
              handler straight into one native Linux binary through Porffor and Zig. No Node
              runtime, no Docker, no bundler config ships with it.
            </p>
            <p className="mt-4 max-w-lg text-muted-foreground">
              Sproutboat is the toolchain behind that build. Risulta is the real product proving it
              holds up: the same router, storage, and dashboard you can read end to end, running as
              one file.
            </p>
            <a
              className="mt-6 inline-flex items-center gap-1 text-sm font-medium underline decoration-muted-foreground/40 underline-offset-4 hover:decoration-foreground"
              href="https://sproutboat.com"
            >
              Read about sproutboat
              <ExternalLink className="size-3.5" />
            </a>
          </div>
          <div className="rounded-xl border bg-card p-6 font-mono text-sm leading-7 text-muted-foreground">
            <p className="text-foreground">src/index.js</p>
            <p className="mt-3">
              <span className="text-muted-foreground/70">export default</span> {"{"}
            </p>
            <p className="pl-4">fetch(request) {"{"}</p>
            <p className="pl-8">return routeRequest(request);</p>
            <p className="pl-4">{"}"},</p>
            <p>{"}"};</p>
            <p className="mt-4 text-muted-foreground/70"># sproutboat build --standalone</p>
            <p className="text-foreground">✓ dist/risulta-sprout, one file, no runtime</p>
          </div>
        </div>
        <div className="mt-16 grid grid-cols-1 rounded-xl border bg-card sm:grid-cols-3">
          {[
            { value: "5.6 MB", label: "About a fifth the size of the next-smallest self-hosted option", border: "border-b sm:border-b-0 sm:border-r" },
            { value: "~5.1 ms", label: "Median response time in a local ingest benchmark", border: "border-b sm:border-b-0 sm:border-r" },
            { value: "~100 ms", label: "Cold start, only on restart - it runs as a long-lived service", border: "" },
          ].map(({ value, label, border }) => (
            <div key={value} className={`p-6 ${border}`}>
              <p className="font-mono text-3xl font-semibold tracking-tight tabular-nums">{value}</p>
              <p className="mt-2 text-sm text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Measured with{" "}
          <a
            className="underline decoration-muted-foreground/40 underline-offset-4 hover:decoration-foreground"
            href="https://github.com/baronunread/risulta/blob/main/bench.mjs"
          >
            bench.mjs
          </a>{" "}
          against a same-machine loopback ingest run, 25 concurrent connections. Numbers move with
          hardware; the method is in the repo.
        </p>
      </section>
      <section id="features" className="reveal py-24">
        <p className="text-sm font-medium text-muted-foreground">Included</p>
        <h2 className="mt-4 max-w-lg text-4xl font-semibold tracking-tight">
          What ships in the binary
        </h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: Activity,
              title: "Collector and dashboard",
              description: "Track pageviews and review reports from the same small server.",
            },
            {
              icon: Globe,
              title: "Multiple websites",
              description: "Give every site its own tracker key, data store, and access rules.",
            },
            {
              icon: ShieldCheck,
              title: "Cookie-free visitor counts",
              description: "Anonymous, daily-scoped hashes instead of browser identifiers.",
            },
            {
              icon: Target,
              title: "Goals and funnels",
              description: "Define conversion events and follow drop-off across ordered steps.",
            },
            {
              icon: FileDown,
              title: "Exportable reports",
              description: "Bounded JSON and CSV reports with filters, dimensions, and pagination.",
            },
            {
              icon: DatabaseBackup,
              title: "Online backups",
              description: "One authenticated call snapshots SQLite with an integrity-checked manifest.",
            },
          ].map(({ icon: Icon, title, description }) => (
            <Card key={title}>
              <CardHeader className="gap-3 py-5">
                <div className="flex size-9 items-center justify-center rounded-lg border bg-accent">
                  <Icon className="size-4.5" />
                </div>
                <CardTitle className="text-base">{title}</CardTitle>
                <p className="text-sm leading-6 text-muted-foreground">{description}</p>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
      <section id="compare" className="reveal grid gap-6 border-t py-20 md:grid-cols-[1fr_1.5fr]">
        <div>
          <p className="text-sm font-medium text-muted-foreground">The difference</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight">
            No analytics stack to operate.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Risulta favors a focused executable and local storage over containers, hosted accounts,
            and a separate database service. It's a self-hosted alternative to Plausible, Umami,
            and GoatCounter without the open-core split.
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
      <section className="reveal rounded-2xl border bg-card px-8 py-14 text-center sm:px-16">
        <h2 className="text-4xl font-semibold tracking-tight">Run your own analytics today.</h2>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">
          One command on a Debian or Ubuntu box, and you have a dashboard with no third party
          reading your traffic.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button asChild>
            <a href="#install">
              <Copy />
              Get the install command
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a href="https://github.com/baronunread/risulta">
              <ExternalLink />
              Read the source first
            </a>
          </Button>
        </div>
      </section>
      <section id="github" className="reveal py-24">
        <p className="text-sm font-medium text-muted-foreground">Open source</p>
        <h2 className="mt-4 max-w-lg text-4xl font-semibold tracking-tight">
          All of it is open source.
        </h2>
        <p className="mt-4 max-w-lg text-muted-foreground">
          The server, dashboard, tracker, and installer all live in one public repository under
          AGPL-3.0 (the tracker script is MIT, so it's embeddable anywhere). Nothing is held back
          for a paid tier.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <a
            className="group flex flex-col gap-2 rounded-xl border p-5 transition hover:bg-accent"
            href="https://github.com/baronunread/risulta"
          >
            <GitFork className="size-4.5 text-muted-foreground" />
            <span className="font-medium">baronunread/risulta</span>
            <span className="text-sm text-muted-foreground">
              Tiny, privacy-friendly multi-site web analytics in one binary.
            </span>
          </a>
          <a
            className="group flex flex-col gap-2 rounded-xl border p-5 transition hover:bg-accent"
            href="https://github.com/baronunread/risulta/issues"
          >
            <CircleDot className="size-4.5 text-muted-foreground" />
            <span className="font-medium">Issues and roadmap</span>
            <span className="text-sm text-muted-foreground">
              What's tracked, what's next, and where to file a bug.
            </span>
          </a>
          <a
            className="group flex flex-col gap-2 rounded-xl border p-5 transition hover:bg-accent"
            href="https://github.com/baronunread/risulta/releases"
          >
            <Star className="size-4.5 text-muted-foreground" />
            <span className="font-medium">Releases</span>
            <span className="text-sm text-muted-foreground">
              Checksummed Linux x64 and arm64 binaries, one tag at a time.
            </span>
          </a>
        </div>
      </section>
      </main>
      <footer className="mx-auto flex max-w-6xl flex-col gap-6 border-t px-6 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-10">
        <div>
          <a className="flex items-center gap-2 font-semibold text-foreground" href="/">
            <Logo className="size-4" />
            Risulta
          </a>
          <p className="mt-1">
            Self-hosted web analytics in one binary, grown with{" "}
            <a className="underline underline-offset-2 hover:text-foreground" href="https://sproutboat.com">
              Sproutboat
            </a>
            . {VERSION}
          </p>
        </div>
        <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-5 gap-y-2">
          <a href="#features">Features</a>
          <a href="#compare">Compare</a>
          <a href="#github">GitHub</a>
          <a href="https://github.com/baronunread/risulta/issues">Issues</a>
          <a href="https://github.com/baronunread/risulta/releases">Releases</a>
        </nav>
        <span>© 2026 Andrea Bruno</span>
      </footer>
    </>
  );
}

export default App;
