import Link from "next/link";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

export const metadata = {
  title: "Best Time to Arrive at Levitt Pavilion Denver | Denver Concert Tips 2026",
  description:
    "When to arrive at Levitt Pavilion Denver for 2026 shows. Timing windows by ticket type, parking buffer, and post-show exit strategy.",
  alternates: { canonical: `${SITE}/venues/levitt-pavilion-denver/best-time-to-arrive` },
};

export default function LevittBestTimeToArrivePage() {
  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <div className="comic-hero">
          <div className="comic-kicker">Denver Venue Guide</div>
          <h1 className="comic-title">Best Time to Arrive at Levitt Pavilion Denver</h1>
          <p className="comic-copy">
            Ruby Hill gets tight near doors on sold nights. A clear arrival window keeps parking and entry smooth.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 mt-6 w-full px-4">
            <Link href="/find?venue=levitt-pavilion-denver&qty=2" className="comic-btn comic-btn-primary w-full sm:w-auto min-w-[200px] text-center">
              Book Shuttle
            </Link>
            <Link href="/venues/levitt-pavilion-denver/parking" className="comic-btn comic-btn-secondary w-full sm:w-auto min-w-[200px] text-center">
              Parking Strategy
            </Link>
          </div>
        </div>

        <div className="comic-grid" style={{ marginTop: 32 }}>
          <article className="comic-panel">
            <div className="comic-tag">General Rule</div>
            <h2 className="comic-h3" style={{ marginTop: 12 }}>Arrive 60-90 minutes before doors</h2>
            <p className="comic-copy" style={{ marginTop: 8 }}>
              Build extra buffer for Ruby Hill traffic, parking search, and security line movement on peak nights.
            </p>
          </article>

          <article className="comic-panel">
            <div className="comic-tag">By Ticket Type</div>
            <ul className="comic-copy mt-4 space-y-4 list-disc pl-6">
              <li>
                <strong>GA Floor</strong> - 75-90 minutes before doors for better positioning.
              </li>
              <li>
                <strong>Reserved or balcony</strong> - 45-60 minutes before doors is usually enough.
              </li>
              <li>
                <strong>Shuttle or rideshare</strong> - Aim drop-off 60-75 minutes before doors.
              </li>
            </ul>
          </article>

          <article className="comic-panel">
            <div className="comic-tag">Post-Show Exit</div>
            <p className="comic-copy" style={{ marginTop: 12 }}>
              Exit demand spikes quickly near close. Set a side-street meetup before encore.
            </p>
            <div style={{ marginTop: 16 }}>
              <Link href="/find?venue=levitt-pavilion-denver&qty=2" className="comic-btn comic-btn-primary w-full text-center">
                Book Return Ride
              </Link>
            </div>
          </article>
        </div>

        <section className="comic-panel mt-8">
          <div className="comic-tag">Related Levitt Guides</div>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 mt-4 justify-center">
            <Link href="/venues/levitt-pavilion-denver/parking" className="comic-btn comic-btn-secondary">Parking</Link>
            <Link href="/venues/levitt-pavilion-denver/transportation" className="comic-btn comic-btn-secondary">Transportation</Link>
            <Link href="/venues/levitt-pavilion-denver/map" className="comic-btn comic-btn-secondary">Venue Map</Link>
          </div>
        </section>
      </section>
    </main>
  );
}
