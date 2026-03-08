import Link from "next/link";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

export const metadata = {
  title: "Fillmore Auditorium Parking Guide | Denver Colfax Tips 2026",
  description:
    "Parking options for Fillmore Auditorium shows in 2026. Lot and garage strategy, street parking constraints, and why pre-booked rides reduce friction.",
  alternates: { canonical: `${SITE}/venues/fillmore-auditorium/parking` },
};

export default function FillmoreParkingPage() {
  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <div className="comic-hero">
          <div className="comic-kicker">Denver Venue Guide</div>
          <h1 className="comic-title">Fillmore Auditorium Parking Guide</h1>
          <p className="comic-copy">
            East Colfax parking compresses quickly on concert nights. This guide keeps your arrival predictable and your exit cleaner.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 mt-6 w-full px-4">
            <Link href="/find?venue=fillmore-auditorium&qty=2" className="comic-btn comic-btn-primary w-full sm:w-auto min-w-[200px] text-center">
              Skip Parking - Book Shuttle
            </Link>
            <Link href="/venues/fillmore-auditorium/best-time-to-arrive" className="comic-btn comic-btn-secondary w-full sm:w-auto min-w-[200px] text-center">
              Best Arrival Time
            </Link>
          </div>
        </div>

        <div className="comic-grid" style={{ marginTop: 32 }}>
          <article className="comic-panel">
            <div className="comic-tag">Parking Options</div>
            <ul className="comic-copy mt-4 space-y-4 list-disc pl-6">
              <li>
                <strong>Nearby paid lots and garages</strong> - Typical event pricing around Colfax and Capitol Hill corridors. Reserve early when possible.
              </li>
              <li>
                <strong>Street parking</strong> - Limited and highly variable. Watch signage, permit zones, and tow restrictions.
              </li>
              <li>
                <strong>Pre-book options</strong> - Spot-based reservations reduce last-minute circling and arrival drift.
              </li>
            </ul>
          </article>

          <article className="comic-panel">
            <div className="comic-tag">Why Shuttle Often Wins</div>
            <p className="comic-copy mt-4">
              Fixed pickup, no lot search, and less post-show curb uncertainty on heavy nights.
            </p>
            <div style={{ marginTop: 16 }}>
              <Link href="/find?venue=fillmore-auditorium&qty=2" className="comic-btn comic-btn-primary w-full text-center">
                Book Shuttle Now
              </Link>
            </div>
          </article>

          <article className="comic-panel">
            <div className="comic-tag">Pro Tips</div>
            <ul className="comic-copy mt-4 space-y-3 list-disc pl-6">
              <li>Set your exact parking target before leaving home.</li>
              <li>Add extra buffer for stacked events in the Colfax corridor.</li>
              <li>Finalize post-show meetup before the headliner starts.</li>
              <li>Avoid making pickup decisions at last song close.</li>
            </ul>
          </article>
        </div>

        <section className="comic-panel mt-8">
          <div className="comic-tag">Related Fillmore Guides</div>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 mt-4 justify-center">
            <Link href="/venues/fillmore-auditorium/best-time-to-arrive" className="comic-btn comic-btn-secondary">
              Best Time to Arrive
            </Link>
            <Link href="/venues/fillmore-auditorium/transportation" className="comic-btn comic-btn-secondary">
              Transportation
            </Link>
            <Link href="/venues/fillmore-auditorium/map" className="comic-btn comic-btn-secondary">
              Venue Map
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
