import Link from "next/link";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

export const metadata = {
  title: "Gothic Theatre Transportation Guide | Denver South Broadway 2026",
  description:
    "How to get to Gothic Theatre in 2026. Compare shuttle, rideshare, driving, and transit with post-show exit strategy.",
  alternates: { canonical: `${SITE}/venues/gothic-theatre/transportation` },
};

export default function GothicTransportationPage() {
  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <div className="comic-hero">
          <div className="comic-kicker">Denver Venue Guide</div>
          <h1 className="comic-title">Gothic Theatre Transportation Guide</h1>
          <p className="comic-copy">
            South Broadway access is simple inbound, but post-show curb demand builds quickly. Use this plan to stay predictable.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 mt-6 w-full px-4">
            <Link href="/find?venue=gothic-theatre&qty=2" className="comic-btn comic-btn-primary w-full sm:w-auto min-w-[200px] text-center">
              Book Shuttle - Predictable Return
            </Link>
          </div>
        </div>

        <div className="comic-grid" style={{ marginTop: 32 }}>
          <article className="comic-panel">
            <div className="comic-tag">Shuttle (Recommended)</div>
            <p className="comic-copy mt-4">
              Fixed pricing, designated meetup flow, and cleaner post-show grouping for larger parties.
            </p>
            <p className="comic-copy mt-4 font-semibold">Best for: Groups and reliability.</p>
            <div style={{ marginTop: 16 }}>
              <Link href="/find?venue=gothic-theatre&qty=2" className="comic-btn comic-btn-primary w-full text-center">
                Book Shuttle
              </Link>
            </div>
          </article>

          <article className="comic-panel">
            <div className="comic-tag">Uber / Lyft</div>
            <p className="comic-copy mt-4">Convenient outbound, but waits and surge can spike at close on stacked nights.</p>
            <p className="comic-copy mt-4">Best for: Small groups with flexible timing.</p>
          </article>

          <article className="comic-panel">
            <div className="comic-tag">Driving</div>
            <p className="comic-copy mt-4">Works best when your parking plan is fixed before arrival and you expect slower exit flow.</p>
            <p className="comic-copy mt-4">Best for: Schedule control.</p>
          </article>

          <article className="comic-panel">
            <div className="comic-tag">Transit</div>
            <p className="comic-copy mt-4">Transit routes and Broadway corridor links can reduce parking friction on busy shows.</p>
            <p className="comic-copy mt-4">Best for: Car-free nights.</p>
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
                  <td className="py-2 pr-4">Good when scheduled</td>
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
