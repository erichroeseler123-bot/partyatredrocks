import Link from "next/link";
import FAQBlock from "@/components/FAQBlock";
import { getFaqRowsWithGlobal } from "@/lib/faqs/getFaqs";
import { buildFaqPageJsonLd } from "@/lib/faqs/schema";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

export const metadata = {
  title: "Red Rocks Weather + Altitude Guide (2026)",
  description:
    "Weather, wind, lightning protocol, and altitude prep for Red Rocks concerts. Includes planning links to venue details, weekly lineup, and ride booking.",
  alternates: {
    canonical: "/guide/logistics/weather-prep",
  },
};

export default async function WeatherPrep() {
  const faqRows = await getFaqRowsWithGlobal("guide/weather-prep.json");
  const faqJsonLd = buildFaqPageJsonLd(faqRows);
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Guide", item: `${SITE}/guide` },
      { "@type": "ListItem", position: 3, name: "Logistics", item: `${SITE}/guide/logistics` },
      { "@type": "ListItem", position: 4, name: "Weather Prep", item: `${SITE}/guide/logistics/weather-prep` },
    ],
  };

  return (
    <main className="min-h-screen bg-[#050816] px-4 pb-14 pt-24 text-white sm:px-6 lg:px-8">
      <section className="mx-auto flex max-w-[1240px] flex-col gap-8">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

        <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,16,32,0.98),rgba(6,9,18,0.96))] p-8 shadow-[0_40px_120px_rgba(0,0,0,0.45)] sm:p-10 lg:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(76,201,240,0.16),transparent_30%),radial-gradient(circle_at_top_right,rgba(255,176,124,0.14),transparent_28%)]" />
          <div className="relative max-w-3xl">
          <div className="inline-flex items-center rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#4cc9f0]">
            Weather + Altitude
          </div>
          <h1 className="mt-5 text-[2.5rem] font-black uppercase leading-[0.94] tracking-[-0.04em] sm:text-[4rem] lg:text-[5rem]">
            Red Rocks Weather Prep Guide
          </h1>
          <p className="mt-5 max-w-3xl text-[15px] leading-7 text-white/74 sm:text-lg">
            Direct answer: Red Rocks weather can shift quickly at elevation, and cold/wind feels stronger after sunset.
            Plan layers, water, and your exit route before gates.
          </p>
          <p className="mt-4 text-sm leading-6 text-white/70">
            Primary forecast source:{" "}
            <a href="https://forecast.weather.gov/MapClick.php?lat=39.6653&lon=-105.2069" target="_blank" rel="noreferrer">
              NWS Morrison Point Forecast
            </a>
            .
          </p>
          </div>
        </section>

        <section className="rounded-[26px] border border-white/10 bg-[#0b1224] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)] sm:p-8">
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#4cc9f0]">Layer Matrix</div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-2 pr-3">Forecasted Low</th>
                  <th className="py-2 pr-3">Base Setup</th>
                  <th className="py-2 pr-3">Operational Note</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/5">
                  <td className="py-2 pr-3">60°F+</td>
                  <td className="py-2 pr-3">Light layer + water</td>
                  <td className="py-2 pr-3">High elevation still dehydrates quickly</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-2 pr-3">45–55°F</td>
                  <td className="py-2 pr-3">Jacket + wind layer</td>
                  <td className="py-2 pr-3">Wind channels through rows after dark</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-2 pr-3">Below 40°F</td>
                  <td className="py-2 pr-3">Thermal + hat + gloves</td>
                  <td className="py-2 pr-3">Plan a fast, warm post-show route</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-[26px] border border-white/10 bg-[#0b1224] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)] sm:p-8">
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#4cc9f0]">Lightning Rule</div>
          <p className="mt-4 text-sm leading-6 text-white/74">
            Shows are generally rain-or-shine, but active lightning can trigger temporary hold and movement protocols.
            Keep your pickup plan specific before encore in case cellular service degrades.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-white/6 px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-white/10" href="/guide/show-night-strategy/post-show-pickup-plan">
              Pickup Plan
            </Link>
            <Link className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-white/6 px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-white/10" href="/guide/logistics/parking-lots">
              Parking Guide
            </Link>
            <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#3df3ff] px-6 text-sm font-black uppercase tracking-[0.16em] text-[#08111e] transition hover:bg-[#62f6ff]" href="/book?venue=red-rocks-amphitheatre">
              Book a Ride
            </Link>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Link href="/guide/red-rocks-intelligence-hub" className="rounded-[26px] border border-white/10 bg-[#0b1224] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(0,0,0,0.42)]">
            <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#ffb07c]">Guide</div>
            <h2 className="mt-3 text-2xl font-black uppercase tracking-[-0.03em] text-white">Red Rocks Guide</h2>
            <p className="mt-3 text-sm leading-6 text-white/70">History, elevation, trails, and full venue context.</p>
          </Link>
          <Link href="/venues/red-rocks-amphitheatre" className="rounded-[26px] border border-white/10 bg-[#0b1224] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(0,0,0,0.42)]">
            <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#ffb07c]">Venue</div>
            <h2 className="mt-3 text-2xl font-black uppercase tracking-[-0.03em] text-white">Red Rocks Venue Page</h2>
            <p className="mt-3 text-sm leading-6 text-white/70">Current shows and venue logistics.</p>
          </Link>
          <Link href="/week/red-rocks" className="rounded-[26px] border border-white/10 bg-[#0b1224] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(0,0,0,0.42)]">
            <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#ffb07c]">This Week</div>
            <h2 className="mt-3 text-2xl font-black uppercase tracking-[-0.03em] text-white">This Week at Red Rocks</h2>
            <p className="mt-3 text-sm leading-6 text-white/70">Live lineup context to pair with weather planning.</p>
          </Link>
          <Link href="/venues/mission-ballroom" className="rounded-[26px] border border-white/10 bg-[#0b1224] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(0,0,0,0.42)]">
            <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#ffb07c]">Venue</div>
            <h2 className="mt-3 text-2xl font-black uppercase tracking-[-0.03em] text-white">Mission Ballroom</h2>
            <p className="mt-3 text-sm leading-6 text-white/70">Indoor venue nights still benefit from weather-linked pickup timing.</p>
          </Link>
          <Link href="/venues/fiddlers-green-amphitheatre" className="rounded-[26px] border border-white/10 bg-[#0b1224] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(0,0,0,0.42)]">
            <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#ffb07c]">Venue</div>
            <h2 className="mt-3 text-2xl font-black uppercase tracking-[-0.03em] text-white">Fiddler&apos;s Green</h2>
            <p className="mt-3 text-sm leading-6 text-white/70">Weather and wind impact pickup flow at outdoor amphitheatre exits.</p>
          </Link>
        </section>

        <FAQBlock title="Weather + Altitude FAQ" rows={faqRows} />
      </section>
    </main>
  );
}
