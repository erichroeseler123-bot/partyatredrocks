import Link from "next/link";
import WeekSearchClient from "./WeekSearchClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SITE = "https://www.partyatredrocks.com";

type Props = {
  searchParams: Promise<{ q?: string }>;
};

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
        <p className="mt-3 text-muted">
          Type a band/artist name and see where they’re playing this week.
        </p>

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

      <WeekSearchClient initialQ={q} />
    </main>
  );
}
