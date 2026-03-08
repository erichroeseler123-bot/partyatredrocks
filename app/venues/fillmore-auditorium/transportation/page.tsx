import Link from "next/link";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

export const metadata = {
  title: "Fillmore Auditorium Transportation Guide | Denver 2026",
  description:
    "How to get to Fillmore Auditorium. Shuttle vs Uber vs driving vs transit options for 2026 shows, with post-show exit tips.",
  alternates: { canonical: `${SITE}/venues/fillmore-auditorium/transportation` },
};

export default function FillmoreTransportation() {
  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <div className="comic-hero">
          <div className="comic-kicker">Denver Venue Guide</div>
          <h1 className="comic-title">Fillmore Auditorium Transportation Guide</h1>
          <p className="comic-copy">
            Colfax location offers good transit but high post-show demand. Compare options for 2026 shows.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 mt-6 w-full px-4">
            <Link href="/find?venue=fillmore-auditorium&qty=2" className="comic-btn comic-btn-primary w-full sm:w-auto min-w-[200px] text-center">
              Book Shuttle - Predictable Return
            </Link>
          </div>
        </div>

        <div className="comic-grid" style={{ marginTop: 32 }}>
          <article className="comic-panel">
            <div className="comic-tag">Shuttle (Recommended)</div>
            <p className="comic-copy mt-4">Fixed cost, dedicated meetup and drop-off near venue. No surge, no parking stress.</p>
            <p className="comic-copy mt-4 font-semibold">Best for: Groups, late nights, reliability.</p>
            <div style={{ marginTop: 16 }}>
              <Link href="/find?venue=fillmore-auditorium&qty=2" className="comic-btn comic-btn-primary w-full text-center">
                Book Shuttle
              </Link>
            </div>
          </article>

          <article className="comic-panel">
            <div className="comic-tag">Uber / Lyft</div>
            <p className="comic-copy mt-4">Convenient outbound, but post-show surge is common and waits can spike.</p>
            <p className="comic-copy mt-4">Best for: Small groups, flexible timing.</p>
          </article>

          <article className="comic-panel">
            <div className="comic-tag">Driving / Parking</div>
            <p className="comic-copy mt-4">Driving works best when parking is pre-selected and you account for slower exit flow.</p>
            <p className="comic-copy mt-4">Best for: Schedule control, pre-booked parking.</p>
          </article>

          <article className="comic-panel">
            <div className="comic-tag">Bus / Transit</div>
            <p className="comic-copy mt-4">Transit access is viable on many nights and avoids venue-area parking constraints.</p>
            <p className="comic-copy mt-4">Best for: Car-free, avoiding traffic.</p>
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
                  <td className="py-2 pr-4 font-semibold">Bus</td>
                  <td className="py-2 pr-4">Low</td>
                  <td className="py-2 pr-4">Good (schedule)</td>
                  <td className="py-2 pr-4">No car needed</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  );
}
