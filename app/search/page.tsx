import Link from "next/link";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { VENUE_LEDGER_BY_SLUG } from "@/lib/venues/ledgerRegistry";
import SearchClient from "./SearchClient";

export const revalidate = 3600;

const SEARCH_SNAPSHOT_DIR = path.join(process.cwd(), "data", "snapshots", "search");

type SearchDoc = {
  eventKey: string;
  title: string;
  artistNames: string[];
  venueId: string;
  dateKey: string;
  tags?: string[];
};

type Props = { searchParams: Promise<{ q?: string }> };

async function readDocs(year = 2026): Promise<SearchDoc[]> {
  try {
    const raw = await readFile(path.join(SEARCH_SNAPSHOT_DIR, `all-${year}.search.json`), "utf8");
    const parsed = JSON.parse(raw) as { docs?: SearchDoc[] };
    return Array.isArray(parsed.docs) ? parsed.docs : [];
  } catch {
    return [];
  }
}

export default async function SearchPage({ searchParams }: Props) {
  const sp = await searchParams;
  const q = (sp.q || "").trim();
  const docs = await readDocs(2026);
  const rows = docs.map((doc) => ({
    ...doc,
    venueName: VENUE_LEDGER_BY_SLUG.get(doc.venueId)?.name || doc.venueId,
  }));

  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <div className="comic-hero">
          <div className="comic-kicker">Search</div>
          <h1 className="comic-title">Full Season Search</h1>
          <p className="comic-copy">Search artist, venue, or show title across the full 2026 snapshot season.</p>
          <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link className="comic-btn comic-btn-secondary" href="/calendar">
              Calendar
            </Link>
            <Link className="comic-btn comic-btn-secondary" href="/bands">
              Bands
            </Link>
            <Link className="comic-btn comic-btn-secondary" href="/venues">
              Venues
            </Link>
          </div>
        </div>

        <SearchClient initialQ={q} rows={rows} />
      </section>
    </main>
  );
}
