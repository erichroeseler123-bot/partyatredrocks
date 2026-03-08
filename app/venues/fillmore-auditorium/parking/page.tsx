import Link from "next/link";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

export const metadata = {
  title: "Fillmore Auditorium Parking Guide | Denver Tips 2026",
  description:
    "Parking near Fillmore Auditorium for 2026 shows. Options, costs, tips to avoid hassle, and why shuttle or rideshare is often easier.",
  alternates: { canonical: `${SITE}/venues/fillmore-auditorium/parking` },
};

export default function FillmoreParking() {
  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <div className="comic-hero">
          <div className="comic-kicker">Denver Venue Guide</div>
          <h1 className="comic-title">Fillmore Auditorium Parking Guide</h1>
          <p className="comic-copy">
            Colfax parking tightens fast on big nights. Preferred lot sells out early - here is the 2026 breakdown and better alternatives.
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
                <strong>Preferred Venue Lot</strong> - Typical add-on near show date. Closest option, fills fastest.
              </li>
              <li>
                <strong>Nearby Paid Lots or Garages</strong> - Usually available within a short walk depending on show demand.
              </li>
              <li>
                <strong>Street Parking</strong> - Limited, and towing or permit enforcement can apply on event nights.
              </li>
            </ul>
          </article>

          <article className="comic-panel">
            <div className="comic-tag">Why Shuttle Often Wins</div>
            <p className="comic-copy mt-4">No lot hunt, no surge, fixed meetup. Post-show Colfax curb competition is real.</p>
            <div style={{ marginTop: 16 }}>
              <Link href="/find?venue=fillmore-auditorium&qty=2" className="comic-btn comic-btn-primary w-full text-center">
                Book Shuttle Now
              </Link>
            </div>
          </article>

          <article className="comic-panel">
            <div className="comic-tag">Pro Tips</div>
            <ul className="comic-copy mt-4 space-y-3 list-disc pl-6">
              <li>Pre-book parking when available for headliner nights.</li>
              <li>Use advance garage reservations when possible.</li>
              <li>Transit routes can reduce parking friction on high-demand nights.</li>
              <li>Use side-street pickup instructions instead of venue-front curb waits.</li>
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
