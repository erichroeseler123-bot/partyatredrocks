import Link from "next/link";
import type { HandoffSearchParams } from "@/lib/parrHandoff";
import { buildBookingHref } from "@/lib/parrHandoff";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

export const metadata = {
  title: "Red Rocks Weather & Concert Night Forecast 2026 | What to Expect",
  description:
    "Red Rocks Amphitheatre weather guide for 2026 concerts. Typical temps, wind, rain risk, altitude effects, and how weather can affect your private ride and arrival plan.",
  alternates: { canonical: `${SITE}/red-rocks/weather` },
};

export default async function RedRocksWeatherPage({
  searchParams,
}: {
  searchParams: Promise<HandoffSearchParams>;
}) {
  const sp = await searchParams;
  const privateHref = buildBookingHref({
    target: "private",
    venue: "red-rocks-amphitheatre",
    searchParams: sp,
  });

  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap max-w-4xl mx-auto">
        <div className="comic-hero text-center">
          <div className="comic-kicker">Red Rocks Planning Guide</div>
          <h1 className="comic-title">Red Rocks Weather & Concert Night Forecast 2026</h1>
          <p className="comic-copy text-xl mt-4">
            High altitude plus an open-air venue means weather plays a big role. Here is what to expect for 2026 shows,
            how it affects arrival and parking, and why having your private ride arranged before show night can remove one more variable.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 mt-8">
            <Link href={privateHref} className="comic-btn comic-btn-primary min-w-[220px] text-center">
              Book Private Ride →
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
            Altitude (6,450 ft) means conditions can feel different from Denver, especially after sunset and in wind.
          </p>
        </section>

        <section className="comic-panel mt-8">
          <div className="comic-tag">How Weather Affects Your Concert Night</div>
          <ul className="comic-copy mt-4 space-y-4 list-disc pl-6">
            <li>
              <strong>Rain/Thunderstorms</strong> - bring appropriate weather gear and watch venue alerts. Wet lots and changing conditions can add friction to arrival and departure.
            </li>
            <li>
              <strong>Cold Nights</strong> - common after sunset; layers are essential. Having your private vehicle waiting through the show gives your group a known return plan.
            </li>
            <li>
              <strong>Wind</strong> - gusts can be strong; hats and gloves help. Door-to-door private transportation can reduce unnecessary exposed walking.
            </li>
            <li>
              <strong>Altitude Effects</strong> - dehydration and fatigue can hit faster. Pre-plan water and transport.
            </li>
          </ul>
          <div className="mt-6 text-center">
            <Link href={privateHref} className="comic-btn comic-btn-primary">
              See Private Ride Options →
            </Link>
          </div>
        </section>

        <section className="comic-panel mt-12 text-center">
          <h2 className="comic-h3">Weather-Ready for Red Rocks?</h2>
          <p className="comic-copy mt-4">
            Check the forecast before your show and lock in your transport plan early so weather does not become a post-show transportation problem too.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
            <Link href={privateHref} className="comic-btn comic-btn-primary min-w-[240px]">
              Book Private Ride →
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
