import Link from "next/link";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

export const metadata = {
  title: "Best Time to Arrive at Mission Ballroom | Denver Concert Guide",
  description:
    "Best arrival timing for Mission Ballroom shows in 2026. Door timing, parking windows, transit buffer, and post-show pickup strategy.",
  alternates: { canonical: `${SITE}/venues/mission-ballroom/best-time-to-arrive` },
};

export default function MissionBallroomBestTimeToArrivePage() {
  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <div className="comic-hero">
          <div className="comic-kicker">Mission Ballroom Timing</div>
          <h1 className="comic-title">Best Time to Arrive at Mission Ballroom</h1>
          <p className="comic-copy">
            Mission Ballroom runs smoother than many larger venues, but arrival timing still determines your parking stress and
            post-show exit quality.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 mt-6 w-full px-4">
            <Link href="/find?venue=mission-ballroom&qty=2" className="comic-btn comic-btn-primary w-full sm:w-auto min-w-[200px] text-center">
              Book Ride
            </Link>
            <Link href="/venues/mission-ballroom/parking" className="comic-btn comic-btn-secondary w-full sm:w-auto min-w-[200px] text-center">
              Parking Guide
            </Link>
            <Link href="/venues/mission-ballroom/transportation" className="comic-btn comic-btn-secondary w-full sm:w-auto min-w-[200px] text-center">
              Transportation Guide
            </Link>
          </div>
        </div>

        <div className="comic-grid" style={{ marginTop: 32 }}>
          <article className="comic-panel">
            <div className="comic-tag">General Rule</div>
            <p className="comic-copy mt-4">
              Arrive 90 to 120 minutes before set time on standard nights. For sold-out or high-demand shows, target 2 to 2.5
              hours early to avoid curb and lot compression.
            </p>
          </article>
          <article className="comic-panel">
            <div className="comic-tag">If You Drive</div>
            <p className="comic-copy mt-4">
              Preferred and nearby lots fill quickly. If you are not pre-booked, arrive early enough to absorb a 10 to 20 minute
              lot search and short walk.
            </p>
          </article>
          <article className="comic-panel">
            <div className="comic-tag">If You Use Rideshare/Shuttle</div>
            <p className="comic-copy mt-4">
              Pre-set pickup and post-show meetup points before doors. Mission exits quickly, which means surge pressure starts
              early after encore.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}

