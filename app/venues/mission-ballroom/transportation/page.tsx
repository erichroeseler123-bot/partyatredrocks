import Link from "next/link";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

export const metadata = {
  title: "Mission Ballroom Transportation Guide | Shuttle vs Uber vs Driving 2026",
  description:
    "How to get to Mission Ballroom in Denver. Compare shuttle, rideshare, driving, and transit options for 2026 shows.",
  alternates: { canonical: `${SITE}/venues/mission-ballroom/transportation` },
};

export default function MissionBallroomTransportationPage() {
  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <div className="comic-hero">
          <div className="comic-kicker">Denver Venue Guide</div>
          <h1 className="comic-title">Mission Ballroom Transportation Guide</h1>
          <p className="comic-copy">
            Mission Ballroom is transit-friendly, but post-show demand spikes are real. Compare options based on reliability and
            return predictability.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 mt-6 w-full px-4">
            <Link href="/find?venue=mission-ballroom&qty=2" className="comic-btn comic-btn-primary w-full sm:w-auto min-w-[200px] text-center">
              Book Shuttle - Predictable Return
            </Link>
          </div>
        </div>

        <div className="comic-grid" style={{ marginTop: 32 }}>
          <article className="comic-panel">
            <div className="comic-tag">Shuttle</div>
            <p className="comic-copy mt-4">Fixed pricing, defined meetup points, and less post-show uncertainty.</p>
          </article>
          <article className="comic-panel">
            <div className="comic-tag">Uber / Lyft</div>
            <p className="comic-copy mt-4">Flexible outbound, variable inbound with surge and wait-time volatility.</p>
          </article>
          <article className="comic-panel">
            <div className="comic-tag">Driving</div>
            <p className="comic-copy mt-4">Full control, but includes parking cost, curb congestion, and exit delays.</p>
          </article>
          <article className="comic-panel">
            <div className="comic-tag">Light Rail / Transit</div>
            <p className="comic-copy mt-4">Strong car-free option for many downtown and corridor routes.</p>
          </article>
        </div>

        <section className="comic-panel mt-8">
          <div className="comic-tag">Quick Comparison</div>
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="py-2 pr-4">Option</th>
                  <th className="py-2 pr-4">Cost Pattern</th>
                  <th className="py-2 pr-4">Post-Show Reliability</th>
                  <th className="py-2 pr-4">Best For</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/10">
                  <td className="py-2 pr-4 font-semibold">Shuttle</td>
                  <td className="py-2 pr-4">Fixed</td>
                  <td className="py-2 pr-4">High</td>
                  <td className="py-2 pr-4">Groups and predictable return</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-2 pr-4 font-semibold">Uber/Lyft</td>
                  <td className="py-2 pr-4">Variable surge</td>
                  <td className="py-2 pr-4">Medium</td>
                  <td className="py-2 pr-4">Flexible one-off trips</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-2 pr-4 font-semibold">Driving</td>
                  <td className="py-2 pr-4">Lot + time</td>
                  <td className="py-2 pr-4">Medium</td>
                  <td className="py-2 pr-4">Full schedule control</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-semibold">Transit</td>
                  <td className="py-2 pr-4">Low</td>
                  <td className="py-2 pr-4">Schedule-based</td>
                  <td className="py-2 pr-4">Car-free city access</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  );
}

