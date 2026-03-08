import Link from "next/link";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

export const metadata = {
  title: "Ogden Theatre Parking Guide | Denver Colfax Tips 2026",
  description:
    "Parking options for Ogden Theatre shows in 2026. Preferred lot, nearby garages, and ways to avoid post-show friction.",
  alternates: { canonical: `${SITE}/venues/ogden-theatre/parking` },
};

export default function OgdenParkingPage() {
  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <div className="comic-hero">
          <div className="comic-kicker">Denver Venue Guide</div>
          <h1 className="comic-title">Ogden Theatre Parking Guide</h1>
          <p className="comic-copy">
            Colfax parking tightens quickly on popular nights. Use pre-booking and arrival buffers to avoid missing the opener.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 mt-6 w-full px-4">
            <Link href="/find?venue=ogden-theatre&qty=2" className="comic-btn comic-btn-primary w-full sm:w-auto min-w-[200px] text-center">
              Skip Parking - Book Shuttle
            </Link>
            <Link href="/venues/ogden-theatre/best-time-to-arrive" className="comic-btn comic-btn-secondary w-full sm:w-auto min-w-[200px] text-center">
              Best Arrival Time
            </Link>
          </div>
        </div>

        <div className="comic-grid" style={{ marginTop: 32 }}>
          <article className="comic-panel">
            <div className="comic-tag">Parking Options</div>
            <ul className="comic-copy mt-4 space-y-4 list-disc pl-6">
              <li><strong>Preferred lot behind venue:</strong> usually paid add-on and limited capacity.</li>
              <li><strong>Nearby lots/garages:</strong> often available with advance reservation apps.</li>
              <li><strong>Street parking:</strong> limited and enforcement-sensitive on heavy nights.</li>
            </ul>
          </article>

          <article className="comic-panel">
            <div className="comic-tag">Why Shuttle Often Wins</div>
            <p className="comic-copy mt-4">
              Parking plus exit delay can outweigh cost savings. Shuttle removes curb scramble and gives a planned return path.
            </p>
            <div style={{ marginTop: 16 }}>
              <Link href="/find?venue=ogden-theatre&qty=2" className="comic-btn comic-btn-primary w-full text-center">
                Book Shuttle Now
              </Link>
            </div>
          </article>

          <article className="comic-panel">
            <div className="comic-tag">Pro Tips</div>
            <ul className="comic-copy mt-4 space-y-3 list-disc pl-6">
              <li>Reserve paid parking early for high-demand artists.</li>
              <li>Set a backup lot before leaving home.</li>
              <li>Use side-street meetup logic for faster post-show pickup.</li>
            </ul>
          </article>
        </div>

        <section className="comic-panel mt-8">
          <div className="comic-tag">Related Ogden Guides</div>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 mt-4 justify-center">
            <Link href="/venues/ogden-theatre/best-time-to-arrive" className="comic-btn comic-btn-secondary">Best Time to Arrive</Link>
            <Link href="/venues/ogden-theatre/transportation" className="comic-btn comic-btn-secondary">Transportation</Link>
            <Link href="/venues/ogden-theatre/map" className="comic-btn comic-btn-secondary">Venue Map</Link>
          </div>
        </section>
      </section>
    </main>
  );
}

