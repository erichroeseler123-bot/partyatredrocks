import Link from "next/link";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { VENUE_LEDGER_BY_SLUG } from "@/lib/venues/ledgerRegistry";
import WeekSearchClient from "./WeekSearchClient";

export const revalidate = 3600;

const SITE = "https://www.partyatredrocks.com";
const SEARCH_SNAPSHOT_DIR = path.join(process.cwd(), "data", "snapshots", "search");

type SearchDoc = {
  eventKey: string;
  title: string;
  artistNames: string[];
  venueId: string;
  dateKey: string;
  tags?: string[];
};

type SearchSnapshot = {
  generatedAt?: string;
  year?: number;
  docs?: SearchDoc[];
};

type SearchRow = {
  eventKey: string;
  title: string;
  dateKey: string;
  venueSlug: string;
  venueName: string;
  artistNames: string[];
};

type Props = {
  searchParams: Promise<{ q?: string }>;
};

function todayDateKey() {
  return new Date().toISOString().slice(0, 10);
}

function plusDaysDateKey(days: number) {
  const dt = new Date();
  dt.setDate(dt.getDate() + days);
  return dt.toISOString().slice(0, 10);
}

async function readWeekRows(year = 2026): Promise<SearchRow[]> {
  try {
    const raw = await readFile(path.join(SEARCH_SNAPSHOT_DIR, `all-${year}.search.json`), "utf8");
    const parsed = JSON.parse(raw) as SearchSnapshot;
    const docs = Array.isArray(parsed.docs) ? parsed.docs : [];
    const start = todayDateKey();
    const end = plusDaysDateKey(7);

    return docs
      .filter((doc) => doc.dateKey >= start && doc.dateKey < end)
      .map((doc) => ({
        eventKey: doc.eventKey,
        title: doc.title,
        dateKey: doc.dateKey,
        venueSlug: doc.venueId,
        venueName: VENUE_LEDGER_BY_SLUG.get(doc.venueId)?.name ?? doc.venueId,
        artistNames: Array.isArray(doc.artistNames) ? doc.artistNames : [],
      }))
      .sort((a, b) => a.dateKey.localeCompare(b.dateKey));
  } catch {
    return [];
  }
}

export async function generateMetadata({ searchParams }: Props) {
  const sp = await searchParams;
  const q = (sp?.q || "").trim();

  const title = q
    ? `Search: ${q} — Concerts This Week | Party at Red Rocks`
    : "Search Artists — Concerts This Week | Party at Red Rocks";

  const description =
    "Search bands/artists and instantly see where they’re playing this week across our venue list. Open show details and book transportation.";

  const canonical = q ? `${SITE}/week/search?q=${encodeURIComponent(q)}` : `${SITE}/week/search`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function WeekSearchPage({ searchParams }: Props) {
  const sp = await searchParams;
  const q = (sp?.q || "").trim();
  const rows = await readWeekRows(2026);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SearchResultsPage",
    name: q ? `Artist Search: ${q}` : "Artist Search",
    url: q ? `${SITE}/week/search?q=${encodeURIComponent(q)}` : `${SITE}/week/search`,
    isPartOf: { "@type": "WebSite", name: "Party at Red Rocks", url: SITE },
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-16 text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="mb-8">
        <h1 className="text-4xl font-black">Search Artists</h1>
        <p className="mt-3 text-muted">Type a band/artist name and see where they’re playing this week.</p>

        <div className="mt-5 flex gap-3">
          <Link
            href="/week"
            className="px-3 py-2 rounded-full border border-soft text-xs font-bold uppercase tracking-widest text-white hover:border-soft"
          >
            Back to Week
          </Link>
          <Link
            href="/venues"
            className="px-3 py-2 rounded-full border border-soft text-xs font-bold uppercase tracking-widest text-white hover:border-soft"
          >
            Venues
          </Link>
        </div>
      </header>

      <WeekSearchClient initialQ={q} initialRows={rows} />
    </main>
  );
}
