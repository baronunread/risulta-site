import { useState } from "react";
import { BarChart3, Check, Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const metrics: [string, string][] = [
  ["Unique visitors", "8,429"],
  ["Total visits", "10,241"],
  ["Total pageviews", "18,306"],
  ["Views per visit", "1.79"],
];
const reports: [string, [string, string][]][] = [
  [
    "Top pages",
    [
      ["/", "6,412"],
      ["/docs", "3,108"],
      ["/pricing", "1,927"],
    ],
  ],
  [
    "Top sources",
    [
      ["Direct / None", "4,986"],
      ["github.com", "2,741"],
      ["google.com", "1,804"],
    ],
  ],
];

export function App() {
  const [copied, setCopied] = useState(false);
  const page = window.location.hash;
  if (page === "#/features") return <FeaturesPage />;
  if (page === "#/compare") return <ComparePage />;
  if (page === "#/roadmap") {
    window.location.assign("https://github.com/baronunread/risulta/issues");
    return null;
  }
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
          <a href="#/features">Features</a>
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
        <div className="mt-8 flex gap-3">
          <Button asChild>
            <a href="#install">Install Risulta</a>
          </Button>
          <Button variant="outline" asChild>
            <a href="https://github.com/baronunread/risulta">
              <ExternalLink />
              Source code
            </a>
          </Button>
        </div>
      </section>
      <Card className="overflow-hidden">
        <CardHeader className="border-b bg-muted/40">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">
              <span className="mr-2 inline-block size-2 rounded-full bg-green-500" />
              Marketing site
            </CardTitle>
            <span className="text-xs text-muted-foreground">hello@example.com</span>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm text-muted-foreground">example.com</p>
              <h2 className="text-2xl font-semibold">Last 7 days</h2>
            </div>
            <span className="text-sm text-muted-foreground">
              3 current · Today · <strong className="text-foreground">7d</strong> · 30d
            </span>
          </div>
          <div className="mt-6 grid grid-cols-2 overflow-hidden rounded-lg border sm:grid-cols-4">
            {metrics.map(([label, value]) => (
              <div className="border-b p-4 last:border-0 sm:border-b-0 sm:border-r" key={label}>
                <p className="text-xs text-muted-foreground">{label}</p>
                <strong className="mt-2 block text-2xl font-medium tabular-nums">{value}</strong>
              </div>
            ))}
          </div>
          <svg
            className="mt-6 w-full"
            viewBox="0 0 900 180"
            role="img"
            aria-label="Example visitor chart"
          >
            <path className="stroke-border" fill="none" d="M0 30H900M0 90H900M0 150H900" />
            <path
              className="fill-muted"
              d="M0 146 C100 132 120 120 180 110 S280 125 350 87 S450 104 530 72 S650 100 720 58 S820 72 900 28 V150H0Z"
            />
            <path
              className="stroke-foreground"
              fill="none"
              strokeWidth="2"
              d="M0 146 C100 132 120 120 180 110 S280 125 350 87 S450 104 530 72 S650 100 720 58 S820 72 900 28"
            />
          </svg>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {reports.map(([title, entries]) => (
              <Card key={title}>
                <CardHeader className="py-4">
                  <CardTitle className="flex justify-between text-base">
                    {title}
                    <span className="text-xs font-normal text-muted-foreground">Visitors</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pb-4">
                  {entries.map(([label, value]) => (
                    <div className="flex justify-between text-sm" key={label}>
                      <span>{label}</span>
                      <strong className="tabular-nums">{value}</strong>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
      <section id="features" className="grid gap-6 py-24 md:grid-cols-2">
        <div>
          <p className="text-sm font-medium text-orange-600">Included</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight">What ships in the binary</h2>
        </div>
        <div className="grid gap-4">
          {[
            "Collector and dashboard",
            "Multiple websites",
            "Cookie-free visitor counts",
            "Auditable source",
          ].map((item) => (
            <Card key={item}>
              <CardHeader className="py-4">
                <CardTitle className="text-base">{item}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
      <section id="install" className="rounded-xl bg-primary p-8 text-primary-foreground sm:p-12">
        <p className="text-sm text-primary-foreground/70">Install</p>
        <h2 className="mt-3 text-4xl font-semibold">One command on Debian or Ubuntu</h2>
        <div className="mt-8 flex items-center justify-between gap-4 rounded-lg bg-background p-3 text-foreground">
          <code className="min-w-0 overflow-x-auto text-sm">
            curl -fsSL https://baronunread.github.io/risulta-site/install.sh | sudo sh
          </code>
          <Button size="sm" variant="secondary" onClick={copyInstallScript}>
            {copied ? <Check /> : <Copy />}
            {copied ? "Copied" : "Copy install script"}
          </Button>
        </div>
      </section>
    </main>
  );
}

function SiteHeader() {
  return (
    <header className="flex items-center justify-between">
      <a className="flex items-center gap-2 font-semibold" href="/">
        <BarChart3 className="size-5 text-orange-500" />
        Risulta
      </a>
      <nav className="flex gap-5 text-sm text-muted-foreground">
        <a href="#/features">Features</a>
        <a href="#/compare">Compare</a>
        <a href="#install">Install</a>
      </nav>
    </header>
  );
}

function FeaturesPage() {
  const groups: [string, string[]][] = [
    ["Reports", ["Summary", "Current visitors", "Breakdowns"]],
    ["Websites and access", ["Multiple websites", "Viewer accounts", "Per-site isolation"]],
    [
      "Why the tracker is 441 bytes compressed",
      ["Native browser APIs", "No identity package", "No bundled product suite"],
    ],
    ["Server operation", ["Runtime", "Storage", "Deployment"]],
  ];
  return (
    <main className="mx-auto max-w-6xl px-6 py-8 sm:px-10">
      <SiteHeader />
      <section className="py-20">
        <p className="text-sm font-medium text-orange-600">Features</p>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight">What the binary does</h1>
        <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
          Risulta covers pageview analytics, multi-site access, and basic server operations.
        </p>
      </section>
      <div className="space-y-12">
        {groups.map(([title, items]) => (
          <section key={title}>
            <h2 className="text-3xl font-semibold">{title}</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {items.map((item) => (
                <Card key={item}>
                  <CardHeader>
                    <CardTitle className="text-base">{item}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    Built into the focused, self-hosted analytics server.
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}

function ComparePage() {
  const rows: string[][] = [
    ["Risulta", "One self-hosted Linux executable", "Embedded SQLite", "441 B gzip"],
    ["Plausible CE", "Self-hosted container stack", "PostgreSQL and ClickHouse", "2.5 KB gzip"],
    ["Umami", "Node.js application or Docker image", "PostgreSQL", "Under 2 KB"],
    ["Fathom", "Managed service", "Vendor-hosted", "2 KB"],
  ];
  return (
    <main className="mx-auto max-w-6xl px-6 py-8 sm:px-10">
      <SiteHeader />
      <section className="py-20">
        <p className="text-sm font-medium text-orange-600">Comparison</p>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight">How Risulta differs</h1>
        <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
          A small, self-hosted analytics server with a deliberately narrow feature set.
        </p>
      </section>
      <Card>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full min-w-175 text-left text-sm">
            <thead className="border-b bg-muted/50 text-muted-foreground">
              <tr>
                <th className="p-4">Platform</th>
                <th className="p-4">Deployment</th>
                <th className="p-4">Storage</th>
                <th className="p-4">Tracker</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr className="border-b last:border-0" key={row[0]}>
                  {row.map((cell) => (
                    <td className="p-4" key={cell}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </main>
  );
}

export default App;
