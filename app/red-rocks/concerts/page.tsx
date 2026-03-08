import Link from "next/link";
import { RED_ROCKS_ENTITIES } from "@/lib/redRocksAuthority";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

export const metadata = {
  title: "Red Rocks Concert Night Guide",
  description:
    "How to plan a Red Rocks concert night: entry timing, stairs/seating reality, post-show pickup strategy, and ride options.",
  alternates: { canonical: "/red-rocks/concerts" },
};

export default function RedRocksConcertsPage() {
  const concertEntities = RED_ROCKS_ENTITIES.filter((entity) => entity.category === "concerts");

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Red Rocks", item: `${SITE}/red-rocks` },
      { "@type": "ListItem", position: 3, name: "Concerts", item: `${SITE}/red-rocks/concerts` },
    ],
  };

  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

        <div className="comic-hero">
          <div className="comic-kicker">Concert Guide</div>
          <h1 className="comic-title">Red Rocks Concert Night Strategy</h1>
          <p className="comic-copy">
            Concert nights are an operations challenge: lot entry, stair effort, weather shifts, and post-encore congestion.
            The best outcomes come from pre-committed timing and pickup plans.
          </p>
        </div>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">High-Impact Decisions</div>
          <ul style={{ marginTop: 10, paddingLeft: 18 }}>
            <li className="comic-copy">Arrive earlier than your normal city-venue habit.</li>
            <li className="comic-copy">Expect stair effort and altitude fatigue, especially for upper sections.</li>
            <li className="comic-copy">Do not improvise post-show pickup after encore.</li>
            <li className="comic-copy">Use one known meetup plan for your entire group.</li>
          </ul>
        </section>

        <div className="comic-grid" style={{ marginTop: 16 }}>
          <Link href="/week/red-rocks" className="comic-panel block">
            <div className="comic-tag">Lineup</div>
            <h2 className="comic-h3">This Week At Red Rocks</h2>
          </Link>
          <Link href="/red-rocks/transportation/post-show-pickup" className="comic-panel block">
            <div className="comic-tag">Exit</div>
            <h2 className="comic-h3">Post-Show Pickup Plan</h2>
          </Link>
          <Link href="/find" className="comic-panel block">
            <div className="comic-tag">CTA</div>
            <h2 className="comic-h3">Book A Red Rocks Ride</h2>
          </Link>
        </div>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Concert Topic Index</div>
          <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
            {concertEntities.map((entity) => (
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
