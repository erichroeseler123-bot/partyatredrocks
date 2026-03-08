import Link from "next/link";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

export const metadata = {
  title: "Best Time to Arrive at Fillmore Auditorium | Denver Concert Tips 2026",
  description:
    "When to arrive at Fillmore Auditorium for 2026 shows. Practical timing windows by ticket type, parking friction, and post-show exit planning.",
  alternates: { canonical: `${SITE}/venues/fillmore-auditorium/best-time-to-arrive` },
};

export default function FillmoreBestTimeToArrivePage() {
  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <div className="comic-hero">
          <div className="comic-kicker">Denver Venue Guide</div>
          <h1 className="comic-title">Best Time to Arrive at Fillmore Auditorium</h1>
          <p className="comic-copy">
            Fillmore entry lines compress quickly on sold nights. A small arrival buffer prevents most show-night friction.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 mt-6 w-full px-4">
            <Link href="/find?venue=fillmore-auditorium&qty=2" className="comic-btn comic-btn-primary w-full sm:w-auto min-w-[200px] text-center">
              Book Shuttle
            </Link>
            <Link href="/venues/fillmore-auditorium/parking" className="comic-btn comic-btn-secondary w-full sm:w-auto min-w-[200px] text-center">
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
              Add buffer for Colfax congestion, security checks, and line movement at peak arrival.
            </p>
          </article>
          <article className="comic-panel">
            <div className="comic-tag">By Show Type</div>
            <ul className="comic-copy mt-4 space-y-3 list-disc pl-6">
              <li>GA-heavy nights: 75 to 90 minutes before doors.</li>
              <li>Reserved/assigned nights: 45 to 60 minutes is usually enough.</li>
              <li>Shuttle/rideshare users: lock meetup before doors.</li>
            </ul>
          </article>
          <article className="comic-panel">
            <div className="comic-tag">Post-Show Exit</div>
            <p className="comic-copy" style={{ marginTop: 12 }}>
              Decide pickup location before encore. Colfax curb demand spikes fast after final song.
            </p>
            <div style={{ marginTop: 16 }}>
              <Link href="/find?venue=fillmore-auditorium&qty=2" className="comic-btn comic-btn-primary w-full text-center">
                Book Return Ride
              </Link>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}

