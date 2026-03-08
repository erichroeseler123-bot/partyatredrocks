import Link from "next/link";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

export const metadata = {
  title: "Mission Ballroom Parking Guide | Denver Concert Tips 2026",
  description:
    "Parking near Mission Ballroom in Denver for 2026 shows. Options, costs, and how to avoid post-show friction.",
  alternates: { canonical: `${SITE}/venues/mission-ballroom/parking` },
};

export default function MissionBallroomParkingPage() {
  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <div className="comic-hero">
          <div className="comic-kicker">Denver Venue Guide</div>
          <h1 className="comic-title">Mission Ballroom Parking Guide</h1>
          <p className="comic-copy">
            Parking around Mission Ballroom can tighten fast on big nights. Use this guide to reduce lot hunting and late-entry
            risk.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 mt-6 w-full px-4">
            <Link href="/find?venue=mission-ballroom&qty=2" className="comic-btn comic-btn-primary w-full sm:w-auto min-w-[200px] text-center">
              Skip Parking - Book Ride
            </Link>
            <Link href="/venues/mission-ballroom/best-time-to-arrive" className="comic-btn comic-btn-secondary w-full sm:w-auto min-w-[200px] text-center">
              Best Arrival Time
            </Link>
          </div>
        </div>

        <div className="comic-grid" style={{ marginTop: 32 }}>
          <article className="comic-panel">
            <div className="comic-tag">Parking Options</div>
            <ul className="comic-copy mt-4 space-y-3 list-disc pl-6">
              <li>Preferred venue lots are closest and fill first on headliner nights.</li>
              <li>Nearby RiNo garages and private lots usually work when booked ahead.</li>
              <li>Street parking can be limited and enforcement is active during events.</li>
            </ul>
          </article>
          <article className="comic-panel">
            <div className="comic-tag">Operational Reality</div>
            <p className="comic-copy mt-4">
              Even when entry is smooth, post-show curb pressure can offset any parking savings. Pre-booked transport is usually
              lower stress for groups.
            </p>
            <div style={{ marginTop: 16 }}>
              <Link href="/find?venue=mission-ballroom&qty=2" className="comic-btn comic-btn-primary w-full text-center">
                Book Shuttle or Car
              </Link>
            </div>
          </article>
        </div>

        <section className="comic-panel mt-8">
          <div className="comic-tag">Related Guides</div>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 mt-4 justify-center">
            <Link href="/venues/mission-ballroom/best-time-to-arrive" className="comic-btn comic-btn-secondary">Best Time to Arrive</Link>
            <Link href="/venues/mission-ballroom/transportation" className="comic-btn comic-btn-secondary">Transportation</Link>
            <Link href="/venues/mission-ballroom/map" className="comic-btn comic-btn-secondary">Venue Map</Link>
          </div>
        </section>
      </section>
    </main>
  );
}

