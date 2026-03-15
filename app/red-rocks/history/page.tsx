import Link from "next/link";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

export const metadata = {
  title: "Red Rocks History: From Ancient Landscape to Modern Venue",
  description:
    "Red Rocks history overview: Indigenous context, early tourism era, Denver ownership, and amphitheatre construction timeline.",
  alternates: { canonical: "/red-rocks/history" },
};

export default function RedRocksHistoryPage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Red Rocks", item: `${SITE}/red-rocks` },
      { "@type": "ListItem", position: 3, name: "History", item: `${SITE}/red-rocks/history` },
    ],
  };

  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

        <div className="comic-hero">
          <div className="comic-kicker">History</div>
          <h1 className="comic-title">Red Rocks Through Time</h1>
          <p className="comic-copy">
            Before modern concerts, this landscape had cultural significance for Indigenous communities. The modern amphitheatre era followed early tourism,
            Denver acquisition, and major construction work completed in 1941.
          </p>
        </div>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Timeline Highlights</div>
          <ul style={{ marginTop: 10, paddingLeft: 18 }}>
            <li className="comic-copy">Pre-venue era: long-standing Indigenous presence and use.</li>
            <li className="comic-copy">Late 1800s / early 1900s: tourism and performance experimentation.</li>
            <li className="comic-copy">1928: Denver ownership period begins.</li>
            <li className="comic-copy">1936–1941: amphitheatre construction era.</li>
          </ul>
        </section>

        <div className="comic-grid" style={{ marginTop: 16 }}>
          <Link href="/red-rocks/geology" className="comic-panel block">
            <div className="comic-tag">Related</div>
            <h2 className="comic-h3">Geology Background</h2>
          </Link>
          <Link href="/red-rocks/visiting-guide" className="comic-panel block">
            <div className="comic-tag">Related</div>
            <h2 className="comic-h3">Visiting Guide</h2>
          </Link>
          <Link href="/book?venue=red-rocks-amphitheatre" className="comic-panel block">
            <div className="comic-tag">CTA</div>
            <h2 className="comic-h3">Book Concert Transportation</h2>
          </Link>
        </div>
      </section>
    </main>
  );
}
