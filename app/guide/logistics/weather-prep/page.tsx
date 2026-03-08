import Link from "next/link";
import FAQBlock from "@/components/FAQBlock";
import { getFaqRowsWithGlobal } from "@/lib/faqs/getFaqs";
import { buildFaqPageJsonLd } from "@/lib/faqs/schema";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

export const metadata = {
  title: "Red Rocks Weather + Altitude Guide (2026)",
  description:
    "Weather, wind, lightning protocol, and altitude prep for Red Rocks concerts. Includes planning links to venue, weekly lineup, and ride booking.",
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
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

        <div className="comic-hero">
          <div className="comic-kicker">Weather + Altitude</div>
          <h1 className="comic-title">Red Rocks Weather Prep Guide</h1>
          <p className="comic-copy">
            Direct answer: Red Rocks weather can shift quickly at elevation, and cold/wind feels stronger after sunset.
            Plan layers, water, and your exit route before gates.
          </p>
          <p className="comic-copy">
            Primary forecast source:{" "}
            <a href="https://forecast.weather.gov/MapClick.php?lat=39.6653&lon=-105.2069" target="_blank" rel="noreferrer">
              NWS Morrison Point Forecast
            </a>
            .
          </p>
        </div>

        <div className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Layer Matrix</div>
          <div className="overflow-x-auto" style={{ marginTop: 10 }}>
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
        </div>

        <div className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Lightning Rule</div>
          <p className="comic-copy">
            Shows are generally rain-or-shine, but active lightning can trigger temporary hold and movement protocols.
            Keep your pickup plan specific before encore in case cellular service degrades.
          </p>
          <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link className="comic-btn comic-btn-secondary" href="/guide/show-night-strategy/post-show-pickup-plan">
              Pickup Plan
            </Link>
            <Link className="comic-btn comic-btn-secondary" href="/guide/logistics/parking-lots">
              Parking Guide
            </Link>
            <Link className="comic-btn comic-btn-primary" href="/find">
              Book a Ride
            </Link>
          </div>
        </div>

        <div className="comic-grid" style={{ marginTop: 16 }}>
          <Link href="/guide/red-rocks-intelligence-hub" className="comic-panel block">
            <div className="comic-tag">Hub</div>
            <h2 className="comic-h3">Red Rocks Intelligence Hub</h2>
            <p className="comic-copy">History, elevation, trails, and full venue context.</p>
          </Link>
          <Link href="/venues/red-rocks-amphitheatre" className="comic-panel block">
            <div className="comic-tag">Venue</div>
            <h2 className="comic-h3">Red Rocks Venue Page</h2>
            <p className="comic-copy">Current shows and venue logistics.</p>
          </Link>
          <Link href="/week/red-rocks" className="comic-panel block">
            <div className="comic-tag">Week</div>
            <h2 className="comic-h3">This Week at Red Rocks</h2>
            <p className="comic-copy">Live lineup context to pair with weather planning.</p>
          </Link>
          <Link href="/venues/mission-ballroom" className="comic-panel block">
            <div className="comic-tag">Venue</div>
            <h2 className="comic-h3">Mission Ballroom</h2>
            <p className="comic-copy">Indoor venue nights still benefit from weather-linked pickup timing.</p>
          </Link>
          <Link href="/venues/fiddlers-green-amphitheatre" className="comic-panel block">
            <div className="comic-tag">Venue</div>
            <h2 className="comic-h3">Fiddler&apos;s Green</h2>
            <p className="comic-copy">Weather and wind impact pickup flow at outdoor amphitheatre exits.</p>
          </Link>
        </div>

        <FAQBlock title="Weather + Altitude FAQ" rows={faqRows} />
      </section>
    </main>
  );
}
