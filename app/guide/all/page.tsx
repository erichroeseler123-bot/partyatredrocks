import Link from "next/link";
import { readdirSync, statSync, existsSync } from "fs";
import path from "path";

export const runtime = "nodejs"; // allows fs
export const dynamic = "force-dynamic"; // avoids static caching issues

export const metadata = {
  title: "All Red Rocks Guides (Authority Index)",
  description:
    "A complete index of Red Rocks authority guides: transportation, policies, logistics, and show-night strategy.",
};

type Item = {
  href: string;
  title: string;
  group: string;
};

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function shouldSkipDir(name: string) {
  // Skip dynamic segments like [slug], route groups like (group), and private dirs
  if (name.includes("[") || name.includes("]")) return true; // [slug]
  if (name.startsWith("(") && name.endsWith(")")) return true; // (marketing)
  if (name.startsWith("_")) return true; // _components, _drafts, etc
  if (name === "api") return true; // never list API routes
  return false;
}

function scanRoutes(rootAbs: string, baseHref: string, group: string): Item[] {
  if (!existsSync(rootAbs)) return [];
  const items: Item[] = [];

  for (const entry of readdirSync(rootAbs)) {
    if (shouldSkipDir(entry)) continue;

    const full = path.join(rootAbs, entry);
    if (!statSync(full).isDirectory()) continue;

    const pageFile = path.join(full, "page.tsx");
    if (!existsSync(pageFile)) continue;

    // Avoid accidentally linking to placeholders
    const href = `${baseHref}/${entry}`.replace(/\/+/g, "/");
    items.push({ href, title: titleFromSlug(entry), group });
  }

  return items.sort((a, b) => a.title.localeCompare(b.title));
}

export default function AllGuidesIndex() {
  const appRoot = process.cwd();

  const transportationAbs = path.join(appRoot, "app", "red-rocks", "transportation");
  const guideLogisticsAbs = path.join(appRoot, "app", "guide", "logistics");
  const guideEventsAbs = path.join(appRoot, "app", "guide", "events");

  // “Known” pages (manual anchors)
  const pinned: Item[] = [
    { href: "/red-rocks/transportation", title: "Red Rocks Transportation (Hub)", group: "Core Hubs" },
    { href: "/guide/logistics/policies", title: "Policies (Bag / Entry / Etc.)", group: "Core Pages" },
    { href: "/guide/logistics/weather-prep", title: "Weather Prep", group: "Core Pages" },
    { href: "/guide/logistics/sold-out-survival", title: "Sold-Out Survival", group: "Core Pages" },
  ];

  // Auto-discovered pages (dynamic routes like /guide/events/[slug] will be skipped)
  const transportationLeaves = scanRoutes(
    transportationAbs,
    "/red-rocks/transportation",
    "Transportation (Deep Pages)"
  );

  const logistics = scanRoutes(guideLogisticsAbs, "/guide/logistics", "Logistics");
  const events = scanRoutes(guideEventsAbs, "/guide/events", "Event Guides");

  const all: Item[] = [...pinned, ...transportationLeaves, ...logistics, ...events];

  // Stable group ordering (so it doesn’t reshuffle)
  const groupOrder = ["Core Hubs", "Core Pages", "Transportation (Deep Pages)", "Logistics", "Event Guides"];
  const groups = groupOrder.filter((g) => all.some((x) => x.group === g));

  return (
    <main className="min-h-screen bg-surface text-white px-6 py-20">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <h1 className="text-5xl md:text-6xl font-black tracking-tight">All Guides</h1>
          <p className="mt-4 text-lg text-soft max-w-3xl">
            This is your authority index (internal sitemap). Add pages and they’ll show up here automatically.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/guide"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-soft pill hover:pill-soft transition"
            >
              Back to Guide Hub →
            </Link>
            <Link href="/book-shuttle" className="btn-primary">
              Book Red Rocks Shuttle — $59/pp →
            </Link>
          </div>
        </header>

        {groups.map((g) => (
          <section key={g} className="mt-12">
            <h2 className="text-2xl font-black">{g}</h2>

            <div className="mt-5 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {all
                .filter((x) => x.group === g)
                .map((x) => (
                  <Link
                    key={x.href}
                    href={x.href}
                    className="block p-6 bg-surface-strong rounded-2xl border border-soft hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="text-xl font-black">{x.title}</div>
                    <div className="mt-3 text-sm text-soft underline decoration-white/20 hover:decoration-white/60">
                      Open →
                    </div>
                  </Link>
                ))}
            </div>
          </section>
        ))}

        <footer className="mt-16 pt-10 border-t border-soft text-sm text-muted">
          Tip: add an “All Guides” button on <span className="text-strong">/guide</span>.
        </footer>
      </div>
    </main>
  );
}
