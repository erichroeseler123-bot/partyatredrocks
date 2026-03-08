import Link from "next/link";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

export const metadata = {
  title: "Mission Ballroom Map Guide | Entrances, Pickup, Nearby Transit",
  description:
    "Mission Ballroom map overview with entrance flow, pickup zones, and nearby transit context for 2026 concert nights.",
  alternates: { canonical: `${SITE}/venues/mission-ballroom/map` },
};

const MAP_POINTS = [
  { name: "Main Entrance", layer: "entry", note: "Primary guest flow before doors and early support sets." },
  { name: "Recommended Pickup Block", layer: "pickup", note: "Use a pre-agreed curb point outside immediate exit compression." },
  { name: "Nearby Garage Cluster", layer: "parking", note: "Useful fallback when preferred parking is sold out." },
  { name: "38th & Blake Transit Access", layer: "transit", note: "Rail-linked option for car-free inbound and outbound movement." },
];

export default function MissionBallroomMapPage() {
  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <div className="comic-hero">
          <div className="comic-kicker">Venue Navigation</div>
          <h1 className="comic-title">Mission Ballroom Map Guide</h1>
          <p className="comic-copy">
            Use this map-first checklist to reduce arrival friction and coordinate a cleaner post-show exit.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 mt-6 w-full px-4">
            <Link href="/find?venue=mission-ballroom&qty=2" className="comic-btn comic-btn-primary w-full sm:w-auto min-w-[200px] text-center">
              Book Ride
            </Link>
            <Link href="/venues/mission-ballroom/transportation" className="comic-btn comic-btn-secondary w-full sm:w-auto min-w-[200px] text-center">
              Transportation Guide
            </Link>
          </div>
        </div>

        <section className="comic-panel" style={{ marginTop: 24 }}>
          <div className="comic-tag">Key Points</div>
          <div className="comic-grid" style={{ marginTop: 12 }}>
            {MAP_POINTS.map((point) => (
              <article key={point.name} className="comic-panel">
                <div className="comic-tag">{point.layer}</div>
                <h2 className="comic-h3" style={{ marginTop: 8 }}>
                  {point.name}
                </h2>
                <p className="comic-copy">{point.note}</p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

