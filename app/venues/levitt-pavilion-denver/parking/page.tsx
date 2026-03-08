import Link from "next/link";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

export const metadata = {
  title: "Levitt Pavilion Denver Parking Guide | Denver Ruby Hill Tips 2026",
  description:
    "Parking options for Levitt Pavilion Denver shows in 2026. Lot and street strategy, curb pressure, and why pre-booked rides reduce friction.",
  alternates: { canonical: `${SITE}/venues/levitt-pavilion-denver/parking` },
};

export default function LevittParkingPage() {
  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <div className="comic-hero">
          <div className="comic-kicker">Denver Venue Guide</div>
          <h1 className="comic-title">Levitt Pavilion Denver Parking Guide</h1>
          <p className="comic-copy">
            Ruby Hill parking can bottleneck fast on show nights. This guide helps you avoid late-stage parking drift.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 mt-6 w-full px-4">
            <Link href="/find?venue=levitt-pavilion-denver&qty=2" className="comic-btn comic-btn-primary w-full sm:w-auto min-w-[200px] text-center">
              Skip Parking - Book Shuttle
            </Link>
            <Link href="/venues/levitt-pavilion-denver/best-time-to-arrive" className="comic-btn comic-btn-secondary w-full sm:w-auto min-w-[200px] text-center">
              Best Arrival Time
            </Link>
          </div>
        </div>

        <div className="comic-grid" style={{ marginTop: 32 }}>
          <article className="comic-panel">
            <div className="comic-tag">Parking Options</div>
            <ul className="comic-copy mt-4 space-y-4 list-disc pl-6">
              <li>
                <strong>Nearby paid lots and garages</strong> - Availability varies by lineup and neighboring events.
              </li>
              <li>
                <strong>Street parking</strong> - Limited and enforcement-sensitive on busy nights.
              </li>
              <li>
                <strong>Pre-book parking</strong> - Reserving a spot cuts down circling near doors.
              </li>
            </ul>
          </article>

          <article className="comic-panel">
            <div className="comic-tag">Why Shuttle Often Wins</div>
            <p className="comic-copy mt-4">
              Fixed meetup, no lot search, and cleaner post-show regrouping on Ruby Hill.
            </p>
            <div style={{ marginTop: 16 }}>
              <Link href="/find?venue=levitt-pavilion-denver&qty=2" className="comic-btn comic-btn-primary w-full text-center">
                Book Shuttle Now
              </Link>
            </div>
          </article>

          <article className="comic-panel">
            <div className="comic-tag">Pro Tips</div>
            <ul className="comic-copy mt-4 space-y-3 list-disc pl-6">
              <li>Decide your exact parking target before departure.</li>
              <li>Add extra arrival buffer on sold-out nights.</li>
              <li>Use side-street pickup instructions post-show.</li>
              <li>Do not wait until encore to set meetup logistics.</li>
            </ul>
          </article>
        </div>

        <section className="comic-panel mt-8">
          <div className="comic-tag">Related Levitt Guides</div>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 mt-4 justify-center">
            <Link href="/venues/levitt-pavilion-denver/best-time-to-arrive" className="comic-btn comic-btn-secondary">Best Time to Arrive</Link>
            <Link href="/venues/levitt-pavilion-denver/transportation" className="comic-btn comic-btn-secondary">Transportation</Link>
            <Link href="/venues/levitt-pavilion-denver/map" className="comic-btn comic-btn-secondary">Venue Map</Link>
          </div>
        </section>
      </section>
    </main>
  );
}
