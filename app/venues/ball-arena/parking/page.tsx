import Link from "next/link";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

export const metadata = {
  title: "Ball Arena Parking Guide | Denver Tips 2026",
  description:
    "Parking options at Ball Arena for 2026 shows. Venue lots, nearby garages, tips to avoid hassle, and shuttle or rideshare alternatives.",
  alternates: { canonical: `${SITE}/venues/ball-arena/parking` },
};

export default function BallArenaParking() {
  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <div className="comic-hero">
          <div className="comic-kicker">Denver Venue Guide</div>
          <h1 className="comic-title">Ball Arena Parking Guide</h1>
          <p className="comic-copy">
            Large venue with ample lots but high demand on big nights. Pre-book or shuttle to avoid stress.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 mt-6 w-full px-4">
            <Link href="/find?venue=ball-arena&qty=2" className="comic-btn comic-btn-primary w-full sm:w-auto min-w-[200px] text-center">
              Skip Parking - Book Shuttle
            </Link>
            <Link href="/venues/ball-arena/best-time-to-arrive" className="comic-btn comic-btn-secondary w-full sm:w-auto min-w-[200px] text-center">
              Best Arrival Time
            </Link>
          </div>
        </div>

        <div className="comic-grid" style={{ marginTop: 32 }}>
          <article className="comic-panel">
            <div className="comic-tag">Parking Options</div>
            <ul className="comic-copy mt-4 space-y-4 list-disc pl-6">
              <li><strong>Venue Lots</strong> - Typical paid event lots with high demand on major tours.</li>
              <li><strong>Nearby Denver Garages/Lots</strong> - Usually available within a short walk depending on lineup.</li>
              <li><strong>Street Parking</strong> - Limited around arena and not ideal on event nights.</li>
            </ul>
          </article>

          <article className="comic-panel">
            <div className="comic-tag">Why Shuttle Often Wins</div>
            <p className="comic-copy mt-4">
              No lot hunt, no surge, fixed meetup. Post-show I-25 traffic and lot exit delays are easier to avoid.
            </p>
            <div style={{ marginTop: 16 }}>
              <Link href="/find?venue=ball-arena&qty=2" className="comic-btn comic-btn-primary w-full text-center">
                Book Shuttle Now
              </Link>
            </div>
          </article>

          <article className="comic-panel">
            <div className="comic-tag">Pro Tips</div>
            <ul className="comic-copy mt-4 space-y-3 list-disc pl-6">
              <li>Pre-buy parking add-on for headliner nights when possible.</li>
              <li>Use advance parking reservations when available.</li>
              <li>Set post-show pickup at designated zones or nearby side streets.</li>
              <li>Arrive early for lot entry because queues build quickly.</li>
            </ul>
          </article>
        </div>

        <section className="comic-panel mt-8">
          <div className="comic-tag">Related Ball Arena Guides</div>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 mt-4 justify-center">
            <Link href="/venues/ball-arena/best-time-to-arrive" className="comic-btn comic-btn-secondary">Best Time to Arrive</Link>
            <Link href="/venues/ball-arena/transportation" className="comic-btn comic-btn-secondary">Transportation</Link>
            <Link href="/venues/ball-arena/map" className="comic-btn comic-btn-secondary">Venue Map</Link>
          </div>
        </section>
      </section>
    </main>
  );
}
