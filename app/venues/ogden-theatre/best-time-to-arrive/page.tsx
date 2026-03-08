import Link from "next/link";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

export const metadata = {
  title: "Best Time to Arrive at Ogden Theatre | Denver Concert Tips 2026",
  description:
    "When to arrive at Ogden Theatre on Colfax for 2026 shows. Recommended windows by ticket type, parking tips, and post-show exit strategy.",
  alternates: { canonical: `${SITE}/venues/ogden-theatre/best-time-to-arrive` },
};

export default function OgdenBestTimeToArrivePage() {
  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <div className="comic-hero">
          <div className="comic-kicker">Denver Venue Guide</div>
          <h1 className="comic-title">Best Time to Arrive at Ogden Theatre</h1>
          <p className="comic-copy">
            Colfax timing matters. Arrive too late and you absorb parking and entry friction. Arrive with a buffer and your night
            runs cleaner.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 mt-6 w-full px-4">
            <Link href="/find?venue=ogden-theatre&qty=2" className="comic-btn comic-btn-primary w-full sm:w-auto min-w-[200px] text-center">
              Book Shuttle - Skip the Hunt
            </Link>
            <Link href="/venues/ogden-theatre/parking" className="comic-btn comic-btn-secondary w-full sm:w-auto min-w-[200px] text-center">
              Parking Strategy
            </Link>
          </div>
        </div>

        <div className="comic-grid" style={{ marginTop: 32 }}>
          <article className="comic-panel">
            <div className="comic-tag">General Rule</div>
            <h2 className="comic-h3" style={{ marginTop: 12 }}>
              Arrive 60 to 90 minutes before doors
            </h2>
            <p className="comic-copy" style={{ marginTop: 8 }}>
              Add buffer for Colfax corridor traffic, parking search, security check, and floor positioning if your show is GA.
            </p>
          </article>

          <article className="comic-panel">
            <div className="comic-tag">By Ticket Type</div>
            <ul className="comic-copy mt-4 space-y-4 list-disc pl-6">
              <li><strong>GA floor:</strong> 75 to 90 minutes before doors for better sightline positioning.</li>
              <li><strong>Balcony / reserved:</strong> 45 to 60 minutes before doors on most nights.</li>
              <li><strong>Shuttle / rideshare:</strong> target drop-off 60 to 75 minutes before doors.</li>
            </ul>
          </article>

          <article className="comic-panel">
            <div className="comic-tag">Post-Show Exit</div>
            <p className="comic-copy" style={{ marginTop: 12 }}>
              The venue clears quickly, then curb demand spikes. Set your meetup before encore to avoid split-party confusion.
            </p>
            <div style={{ marginTop: 16 }}>
              <Link href="/find?venue=ogden-theatre&qty=2" className="comic-btn comic-btn-primary w-full text-center">
                Book Return Ride
              </Link>
            </div>
          </article>
        </div>

        <section className="comic-panel mt-8">
          <div className="comic-tag">Related Ogden Guides</div>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 mt-4 justify-center">
            <Link href="/venues/ogden-theatre/parking" className="comic-btn comic-btn-secondary">Parking</Link>
            <Link href="/venues/ogden-theatre/transportation" className="comic-btn comic-btn-secondary">Transportation</Link>
            <Link href="/venues/ogden-theatre/map" className="comic-btn comic-btn-secondary">Venue Map</Link>
          </div>
        </section>
      </section>
    </main>
  );
}

