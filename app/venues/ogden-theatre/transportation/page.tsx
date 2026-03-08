import Link from "next/link";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

export const metadata = {
  title: "Ogden Theatre Transportation Guide | Colfax Denver 2026",
  description:
    "How to get to Ogden Theatre on East Colfax. Compare shuttle, rideshare, driving, and transit for 2026 shows.",
  alternates: { canonical: `${SITE}/venues/ogden-theatre/transportation` },
};

export default function OgdenTransportationPage() {
  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <div className="comic-hero">
          <div className="comic-kicker">Denver Venue Guide</div>
          <h1 className="comic-title">Ogden Theatre Transportation Guide</h1>
          <p className="comic-copy">
            East Colfax has solid city access but inconsistent post-show curb flow. Choose your transport mode before doors.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 mt-6 w-full px-4">
            <Link href="/find?venue=ogden-theatre&qty=2" className="comic-btn comic-btn-primary w-full sm:w-auto min-w-[200px] text-center">
              Book Shuttle - Predictable Return
            </Link>
          </div>
        </div>

        <div className="comic-grid" style={{ marginTop: 32 }}>
          <article className="comic-panel">
            <div className="comic-tag">Shuttle</div>
            <p className="comic-copy mt-4">Fixed pricing, clear pickup logic, and less surge risk after the show.</p>
          </article>
          <article className="comic-panel">
            <div className="comic-tag">Uber / Lyft</div>
            <p className="comic-copy mt-4">Flexible but can spike and delay after encore on packed nights.</p>
          </article>
          <article className="comic-panel">
            <div className="comic-tag">Driving</div>
            <p className="comic-copy mt-4">Best when parking is pre-planned and your group accepts slower exits.</p>
          </article>
          <article className="comic-panel">
            <div className="comic-tag">Bus / Transit</div>
            <p className="comic-copy mt-4">Car-free option for many corridors with nearby stops on and around Colfax.</p>
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

