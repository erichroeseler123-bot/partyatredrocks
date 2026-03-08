import Link from "next/link";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

export const metadata = {
  title: "What to Wear to Red Rocks 2026 | Practical Concert Outfit Guide",
  description:
    "What to wear at Red Rocks for 2026 concerts. Layer strategy, footwear for stairs, weather-proof essentials, and post-show transport tips.",
  alternates: { canonical: `${SITE}/red-rocks/what-to-wear` },
};

export default function RedRocksWhatToWearPage() {
  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <div className="comic-hero">
          <div className="comic-kicker">Show Night Planning</div>
          <h1 className="comic-title">What to Wear at Red Rocks</h1>
          <p className="comic-copy">
            Red Rocks means stairs, wind, and late-night temperature drops. Dress for movement and weather shifts, not just pre-show photos.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 mt-4 sm:mt-6 w-full px-4">
            <Link href="/find" className="comic-btn comic-btn-primary w-full sm:w-auto min-w-[180px] text-center">
              Find a Ride
            </Link>
            <Link href="/red-rocks/weather" className="comic-btn comic-btn-secondary w-full sm:w-auto min-w-[180px] text-center">
              Weather Guide
            </Link>
            <Link href="/red-rocks/best-time-to-arrive" className="comic-btn comic-btn-secondary w-full sm:w-auto min-w-[180px] text-center">
              Arrival Timing
            </Link>
          </div>
        </div>

        <div className="comic-grid" style={{ marginTop: 32 }}>
          <article className="comic-panel">
            <div className="comic-tag">Layer System</div>
            <ul className="comic-copy mt-4 space-y-3 list-disc pl-6">
              <li>Breathable base layer for stair climbs.</li>
              <li>Mid-layer for post-sunset chill.</li>
              <li>Light shell for wind and quick rain.</li>
            </ul>
          </article>

          <article className="comic-panel">
            <div className="comic-tag">Footwear</div>
            <p className="comic-copy mt-4">
              Wear stable shoes with grip. You will walk inclines, stairs, and uneven surfaces pre-show and during exit.
            </p>
          </article>

          <article className="comic-panel">
            <div className="comic-tag">Carry Essentials</div>
            <ul className="comic-copy mt-4 space-y-3 list-disc pl-6">
              <li>Compact rain shell.</li>
              <li>Small backup layer for late set temperature drops.</li>
              <li>Charged phone and meetup plan for post-show pickup.</li>
            </ul>
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
            <Link href="/red-rocks/weather" className="comic-btn comic-btn-secondary w-full sm:w-auto min-w-[180px] text-center">
              Weather Forecasting Tips
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
