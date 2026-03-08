import Link from "next/link";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

export const metadata = {
  title: "Red Rocks Weather & Concert Night Forecast 2026 | What to Expect",
  description:
    "Red Rocks Amphitheatre weather guide for 2026 concerts. Typical temps, wind, rain risk, altitude effects, and how weather impacts your shuttle ride and arrival.",
  alternates: { canonical: `${SITE}/red-rocks/weather` },
};

export default function RedRocksWeatherPage() {
  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap max-w-4xl mx-auto">
        <div className="comic-hero text-center">
          <div className="comic-kicker">Red Rocks Planning Guide</div>
          <h1 className="comic-title">Red Rocks Weather & Concert Night Forecast 2026</h1>
          <p className="comic-copy text-xl mt-4">
            High altitude plus open-air venue means weather plays a big role. Here is what to expect for 2026 shows,
            how it affects arrival and parking, and why pre-booked shuttle rides are the smart move.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 mt-8">
            <Link href="/find" className="comic-btn comic-btn-primary min-w-[220px] text-center">
              Book Shuttle Ride →
            </Link>
          </div>
        </div>

        <section className="comic-panel mt-12">
          <div className="comic-tag">Typical Red Rocks Weather by Season</div>
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div>
              <h3 className="font-bold text-lg">Spring (April-May)</h3>
              <ul className="comic-copy mt-2 space-y-2">
                <li>Daytime: 50-70F (10-21C)</li>
                <li>Night: 30-50F (0-10C)</li>
                <li>Risk: Rain/snow possible, wind gusts</li>
                <li>Tips: Layer heavily; bring waterproof jacket</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg">Summer (June-August)</h3>
              <ul className="comic-copy mt-2 space-y-2">
                <li>Daytime: 70-90F (21-32C)</li>
                <li>Night: 50-70F (10-21C)</li>
                <li>Risk: Afternoon thunderstorms common</li>
                <li>Tips: Sunscreen, hat, light layers for night</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg">Fall (September-October)</h3>
              <ul className="comic-copy mt-2 space-y-2">
                <li>Daytime: 60-80F (15-27C)</li>
                <li>Night: 30-50F (0-10C)</li>
                <li>Risk: Cooling fast after sunset</li>
                <li>Tips: Warm jacket, gloves, beanie</li>
              </ul>
            </div>
          </div>
          <p className="comic-copy mt-6 text-center font-semibold">
            Altitude (6,450 ft) means 3-5F cooler than Denver and stronger wind exposure.
          </p>
        </section>

        <section className="comic-panel mt-8">
          <div className="comic-tag">How Weather Affects Your Concert Night</div>
          <ul className="comic-copy mt-4 space-y-4 list-disc pl-6">
            <li>
              <strong>Rain/Thunderstorms</strong> - shows usually continue; bring a poncho. Parking lots get messy,
              so shuttle reduces friction.
            </li>
            <li>
              <strong>Cold Nights</strong> - common after sunset; layers are essential. Shuttle keeps return transit
              warmer and easier.
            </li>
            <li>
              <strong>Wind</strong> - gusts can be strong; hats and gloves help. Shuttle pickup/drop-off limits
              long exposed walks.
            </li>
            <li>
              <strong>Altitude Effects</strong> - dehydration and fatigue hit faster. Pre-plan water and transport.
            </li>
          </ul>
          <div className="mt-6 text-center">
            <Link href="/find" className="comic-btn comic-btn-primary">
              Book Weather-Proof Shuttle Ride →
            </Link>
          </div>
        </section>

        <section className="comic-panel mt-12 text-center">
          <h2 className="comic-h3">Weather-Ready for Red Rocks?</h2>
          <p className="comic-copy mt-4">
            Check forecast 24-48 hours before your show and secure transport early to avoid weather and parking stress.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
            <Link href="/find" className="comic-btn comic-btn-primary min-w-[240px]">
              Book Ride Now →
            </Link>
            <Link href="/red-rocks/what-to-wear" className="comic-btn comic-btn-secondary min-w-[240px]">
              What to Wear Guide →
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
