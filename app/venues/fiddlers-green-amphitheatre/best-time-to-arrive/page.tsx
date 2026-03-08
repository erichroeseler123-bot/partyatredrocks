import Link from "next/link";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

export const metadata = {
  title: "Best Time to Arrive at Fiddler's Green Amphitheatre | Greenwood Village Concert Tips 2026",
  description:
    "When to arrive at Fiddler's Green Amphitheatre for 2026 shows. Recommended windows by ticket type, parking buffer, entry flow, and post-show exit plan.",
  alternates: { canonical: `${SITE}/venues/fiddlers-green-amphitheatre/best-time-to-arrive` },
};

export default function FiddlersGreenBestTimeToArrive() {
  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <div className="comic-hero">
          <div className="comic-kicker">Greenwood Village Venue Guide</div>
          <h1 className="comic-title">Best Time to Arrive at Fiddler's Green Amphitheatre</h1>
          <p className="comic-copy">
            Large outdoor amphitheatre means longer entry lines and parking pressure. Use this 2026 timing guide to arrive relaxed.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 mt-6 w-full px-4">
            <Link href="/find?venue=fiddlers-green-amphitheatre&qty=2" className="comic-btn comic-btn-primary w-full sm:w-auto min-w-[200px] text-center">
              Book Shuttle - Skip the Line
            </Link>
            <Link href="/venues/fiddlers-green-amphitheatre/parking" className="comic-btn comic-btn-secondary w-full sm:w-auto min-w-[200px] text-center">
              Parking Strategy
            </Link>
          </div>
        </div>

        <div className="comic-grid" style={{ marginTop: 32 }}>
          <article className="comic-panel">
            <div className="comic-tag">General Rule</div>
            <h2 className="comic-h3" style={{ marginTop: 12 }}>Arrive 90-150 minutes before doors</h2>
            <p className="comic-copy" style={{ marginTop: 8 }}>
              Doors typically open 60-90 minutes before show start. Add buffer for I-25 traffic, parking search, security, and lawn or GA positioning.
            </p>
          </article>

          <article className="comic-panel">
            <div className="comic-tag">By Ticket Type</div>
            <ul className="comic-copy mt-4 space-y-4 list-disc pl-6">
              <li><strong>Lawn / GA</strong> - 120-150 minutes before doors.</li>
              <li><strong>Reserved Seating</strong> - 90-120 minutes before doors.</li>
              <li><strong>Shuttle / Rideshare</strong> - Drop-off 90-120 minutes before doors.</li>
            </ul>
          </article>

          <article className="comic-panel">
            <div className="comic-tag">Post-Show Exit</div>
            <p className="comic-copy" style={{ marginTop: 12 }}>
              The venue empties steadily but I-25 and parking exits surge after encore. Pre-set meetup or rideshare pickup before final song.
            </p>
            <div style={{ marginTop: 16 }}>
              <Link href="/find?venue=fiddlers-green-amphitheatre&qty=2" className="comic-btn comic-btn-primary w-full text-center">
                Book Return Ride Now
              </Link>
            </div>
          </article>
        </div>

        <section className="comic-panel mt-8">
          <div className="comic-tag">Related Fiddler's Green Guides</div>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 mt-4 justify-center">
            <Link href="/venues/fiddlers-green-amphitheatre/parking" className="comic-btn comic-btn-secondary">Parking</Link>
            <Link href="/venues/fiddlers-green-amphitheatre/transportation" className="comic-btn comic-btn-secondary">Transportation</Link>
            <Link href="/venues/fiddlers-green-amphitheatre/map" className="comic-btn comic-btn-secondary">Venue Map</Link>
          </div>
        </section>
      </section>
    </main>
  );
}
