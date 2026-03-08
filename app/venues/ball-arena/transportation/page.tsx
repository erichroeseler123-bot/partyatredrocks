import Link from "next/link";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

export const metadata = {
  title: "Ball Arena Transportation Guide | Denver 2026",
  description:
    "How to get to Ball Arena in Denver. Shuttle vs Uber vs driving vs transit options for 2026 shows with post-show exit tips.",
  alternates: { canonical: `${SITE}/venues/ball-arena/transportation` },
};

export default function BallArenaTransportation() {
  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <div className="comic-hero">
          <div className="comic-kicker">Denver Venue Guide</div>
          <h1 className="comic-title">Ball Arena Transportation Guide</h1>
          <p className="comic-copy">
            Suburban arena with good highway access but high post-show demand. Compare options for 2026 shows.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 mt-6 w-full px-4">
            <Link href="/find?venue=ball-arena&qty=2" className="comic-btn comic-btn-primary w-full sm:w-auto min-w-[200px] text-center">
              Book Shuttle - Predictable Return
            </Link>
          </div>
        </div>

        <div className="comic-grid" style={{ marginTop: 32 }}>
          <article className="comic-panel">
            <div className="comic-tag">Shuttle (Recommended)</div>
            <p className="comic-copy mt-4">
              Fixed pricing, dedicated meetup and drop-off near venue. No surge, no parking stress.
            </p>
            <p className="comic-copy mt-4 font-semibold">Best for: Groups, late nights, reliability.</p>
            <div style={{ marginTop: 16 }}>
              <Link href="/find?venue=ball-arena&qty=2" className="comic-btn comic-btn-primary w-full text-center">
                Book Shuttle
              </Link>
            </div>
          </article>

          <article className="comic-panel">
            <div className="comic-tag">Uber / Lyft</div>
            <p className="comic-copy mt-4">
              Convenient outbound, but post-show surge is common. Designated pickup zones can still queue heavily.
            </p>
            <p className="comic-copy mt-4">Best for: Small groups, flexible timing.</p>
          </article>

          <article className="comic-panel">
            <div className="comic-tag">Driving / Parking</div>
            <p className="comic-copy mt-4">
              Venue lots are straightforward inbound but exits bottleneck on sellouts. Pre-booking reduces uncertainty.
            </p>
            <p className="comic-copy mt-4">Best for: Schedule control, pre-booked parking.</p>
          </article>

          <article className="comic-panel">
            <div className="comic-tag">Transit / RTD</div>
            <p className="comic-copy mt-4">
              RTD options are limited depending on show timing. Shuttle or driving is often more predictable.
            </p>
            <p className="comic-copy mt-4">Best for: Car-free if staying nearby.</p>
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
                  <td className="py-2 pr-4">Reliability, groups</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-2 pr-4 font-semibold">Uber/Lyft</td>
                  <td className="py-2 pr-4">Surge likely</td>
                  <td className="py-2 pr-4">Medium</td>
                  <td className="py-2 pr-4">Small groups</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-2 pr-4 font-semibold">Driving</td>
                  <td className="py-2 pr-4">Parking plus time</td>
                  <td className="py-2 pr-4">Lot-dependent</td>
                  <td className="py-2 pr-4">Control</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-semibold">Transit</td>
                  <td className="py-2 pr-4">Low</td>
                  <td className="py-2 pr-4">Limited</td>
                  <td className="py-2 pr-4">Car-free</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  );
}
