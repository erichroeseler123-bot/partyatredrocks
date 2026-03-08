import Link from "next/link";
import { RED_ROCKS_ENTITIES } from "@/lib/redRocksAuthority";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

export const metadata = {
  title: "Red Rocks Visiting Guide: What to Know Before You Go",
  description:
    "Planning a Red Rocks visit: best times, weather, altitude, parking, bag policy, and how to get to the venue.",
  alternates: { canonical: "/red-rocks/visiting-guide" },
};

export default function RedRocksVisitingGuidePage() {
  const visitingEntities = RED_ROCKS_ENTITIES.filter((entity) => entity.category === "visiting");

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Red Rocks", item: `${SITE}/red-rocks` },
      { "@type": "ListItem", position: 3, name: "Visiting Guide", item: `${SITE}/red-rocks/visiting-guide` },
    ],
  };

  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

        <div className="comic-hero">
          <div className="comic-kicker">Visiting Guide</div>
          <h1 className="comic-title">Plan Your Red Rocks Visit</h1>
          <p className="comic-copy">
            Best first move: decide if this is a daytime park visit, a concert night, or both. Your timing, packing list,
            and transportation plan change based on that choice.
          </p>
        </div>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Checklist</div>
          <ul style={{ marginTop: 10, paddingLeft: 18 }}>
            <li className="comic-copy">Best time to visit: shoulder hours for milder weather and lighter congestion.</li>
            <li className="comic-copy">Weather prep: layers, hydration, and sun protection are essential.</li>
            <li className="comic-copy">Altitude reality: stairs and walk distances feel harder than expected.</li>
            <li className="comic-copy">Bag/policy checks: verify current venue rules before departure.</li>
            <li className="comic-copy">Arrival timing: arrive early on sold-out show nights.</li>
          </ul>
        </section>

        <div className="comic-grid" style={{ marginTop: 16 }}>
          <Link href="/red-rocks/transportation" className="comic-panel block">
            <div className="comic-tag">Transport</div>
            <h2 className="comic-h3">How To Get To Red Rocks</h2>
          </Link>
          <Link href="/red-rocks/concerts" className="comic-panel block">
            <div className="comic-tag">Concerts</div>
            <h2 className="comic-h3">Concert Night Guide</h2>
          </Link>
          <Link href="/find" className="comic-panel block">
            <div className="comic-tag">CTA</div>
            <h2 className="comic-h3">Avoid Parking Chaos: Book Shuttle</h2>
          </Link>
        </div>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Visiting Topic Index</div>
          <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
            {visitingEntities.map((entity) => (
              <Link key={entity.slug} href={`/red-rocks/${entity.slug}`} className="comic-btn comic-btn-secondary">
                {entity.title}
              </Link>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
