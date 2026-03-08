import Link from "next/link";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

export const metadata = {
  title: "Red Rocks Concert Weather Guide 2026 | What To Expect",
  description:
    "Red Rocks weather planning for concert nights in 2026. Temperature swings, rain and wind prep, and transport tips before and after the show.",
  alternates: { canonical: `${SITE}/red-rocks/weather` },
};

export default function RedRocksWeatherPage() {
  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <div className="comic-hero">
          <div className="comic-kicker">Show Night Planning</div>
          <h1 className="comic-title">Red Rocks Weather Guide</h1>
          <p className="comic-copy">
            Red Rocks weather can swing fast after sunset. Plan layers, precipitation backup, and your ride strategy before doors.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 mt-4 sm:mt-6 w-full px-4">
            <Link href="/find" className="comic-btn comic-btn-primary w-full sm:w-auto min-w-[180px] text-center">
              Find a Ride
            </Link>
            <Link href="/red-rocks/what-to-wear" className="comic-btn comic-btn-secondary w-full sm:w-auto min-w-[180px] text-center">
              What to Wear
            </Link>
            <Link href="/red-rocks/best-time-to-arrive" className="comic-btn comic-btn-secondary w-full sm:w-auto min-w-[180px] text-center">
              Arrival Timing
            </Link>
          </div>
        </div>

        <div className="comic-grid" style={{ marginTop: 32 }}>
          <article className="comic-panel">
            <div className="comic-tag">Temperature Swings</div>
            <p className="comic-copy mt-4">
              Even warm Denver afternoons can become cool at altitude after dark. Bring one warm layer minimum for late sets and post-show pickup.
            </p>
          </article>

          <article className="comic-panel">
            <div className="comic-tag">Wind and Rain</div>
            <p className="comic-copy mt-4">
              Wind gusts and short rain bursts happen throughout the season. Pack a compact rain shell and avoid bulky umbrellas in crowded rows.
            </p>
          </article>

          <article className="comic-panel">
            <div className="comic-tag">Transport Impact</div>
            <p className="comic-copy mt-4">
              Weather spikes increase rideshare waits and surge. Pre-booked rides reduce uncertainty when conditions deteriorate near close.
            </p>
            <div style={{ marginTop: 16 }}>
              <Link href="/find" className="comic-btn comic-btn-primary w-full text-center">
                Book Return Ride
              </Link>
            </div>
          </article>
        </div>

        <section className="comic-panel" style={{ marginTop: 32 }}>
          <div className="comic-tag">Related Guides</div>
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 mt-4 sm:mt-6 w-full px-4">
            <Link href="/red-rocks/what-to-wear" className="comic-btn comic-btn-secondary w-full sm:w-auto min-w-[180px] text-center">
              What to Wear
            </Link>
            <Link href="/red-rocks/parking" className="comic-btn comic-btn-secondary w-full sm:w-auto min-w-[180px] text-center">
              Parking Strategy
            </Link>
            <Link href="/red-rocks/transportation" className="comic-btn comic-btn-secondary w-full sm:w-auto min-w-[180px] text-center">
              Transportation Guide
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
