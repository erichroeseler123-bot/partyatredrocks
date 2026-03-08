import Link from "next/link";
import FAQBlock from "@/components/FAQBlock";
import { getFaqRowsWithGlobal } from "@/lib/faqs/getFaqs";
import { buildFaqPageJsonLd } from "@/lib/faqs/schema";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

export const metadata = {
  title: "Red Rocks Parking Guide (2026): Lots, Walking Cost, Exit Strategy",
  description:
    "Red Rocks parking guide with lot tradeoffs, hike reality, and post-show exit planning. Includes direct links to venue intel, weekly lineup, and ride booking.",
  alternates: {
    canonical: "/guide/logistics/parking-lots",
  },
};

export default async function ParkingLots() {
  const faqRows = await getFaqRowsWithGlobal("guide/parking-lots.json");
  const faqJsonLd = buildFaqPageJsonLd(faqRows);
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Guide", item: `${SITE}/guide` },
      { "@type": "ListItem", position: 3, name: "Logistics", item: `${SITE}/guide/logistics` },
      { "@type": "ListItem", position: 4, name: "Parking Lots", item: `${SITE}/guide/logistics/parking-lots` },
    ],
  };

  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

        <div className="comic-hero">
          <div className="comic-kicker">Red Rocks Parking</div>
          <h1 className="comic-title">Which Lot Is Best at Red Rocks?</h1>
          <p className="comic-copy">
            Direct answer: the best lot depends on whether you optimize for easier entry or faster exit. Most first-timers
            underestimate the stair and elevation cost from lower lots.
          </p>
          <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link className="comic-btn comic-btn-primary" href="/find">
              Find Ride Options
            </Link>
            <Link className="comic-btn comic-btn-secondary" href="/week/red-rocks">
              This Week at Red Rocks
            </Link>
          </div>
        </div>

        <div className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Lot Tradeoffs</div>
          <div className="overflow-x-auto" style={{ marginTop: 10 }}>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-2 pr-3">Lot</th>
                  <th className="py-2 pr-3">Best For</th>
                  <th className="py-2 pr-3">Main Cost</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/5">
                  <td className="py-2 pr-3 font-semibold">Upper North / Top Area</td>
                  <td className="py-2 pr-3">Easier entry at show start</td>
                  <td className="py-2 pr-3">Fills early on high-demand nights</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-2 pr-3 font-semibold">Lower South</td>
                  <td className="py-2 pr-3">Potentially cleaner outbound flow</td>
                  <td className="py-2 pr-3">Longer uphill approach before the show</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="comic-copy" style={{ marginTop: 10 }}>
            Validate lot timing with the{" "}
            <a href="https://www.redrocksonline.com/plan-your-visit/getting-here/" target="_blank" rel="noreferrer">
              official venue parking guidance
            </a>{" "}
            before show night.
          </p>
        </div>

        <div className="comic-grid" style={{ marginTop: 16 }}>
          <Link href="/guide/red-rocks-intelligence-hub" className="comic-panel block">
            <div className="comic-tag">Hub</div>
            <h2 className="comic-h3">Red Rocks Intelligence Hub</h2>
            <p className="comic-copy">Full venue context: elevation, layout, day-visit details, and planning links.</p>
          </Link>
          <Link href="/venues/red-rocks-amphitheatre" className="comic-panel block">
            <div className="comic-tag">Venue</div>
            <h2 className="comic-h3">Red Rocks Venue Page</h2>
            <p className="comic-copy">Upcoming shows, venue details, and logistics in one place.</p>
          </Link>
          <Link href="/guide/show-night-strategy/post-show-pickup-plan" className="comic-panel block">
            <div className="comic-tag">Exit</div>
            <h2 className="comic-h3">Post-Show Pickup Plan</h2>
            <p className="comic-copy">How to avoid the stranded window after encore.</p>
          </Link>
          <Link href="/guide/transportation/shuttle-vs-uber" className="comic-panel block">
            <div className="comic-tag">Compare</div>
            <h2 className="comic-h3">Shuttle vs Uber</h2>
            <p className="comic-copy">Reliability and post-show risk comparison for Red Rocks transportation.</p>
          </Link>
          <Link href="/venues/mission-ballroom" className="comic-panel block">
            <div className="comic-tag">Venue</div>
            <h2 className="comic-h3">Mission Ballroom</h2>
            <p className="comic-copy">Use the same parking + pickup framework on dense urban venue nights.</p>
          </Link>
          <Link href="/venues/fiddlers-green-amphitheatre" className="comic-panel block">
            <div className="comic-tag">Venue</div>
            <h2 className="comic-h3">Fiddler&apos;s Green</h2>
            <p className="comic-copy">Outdoor amphitheatre exit and pickup planning with similar show-night surges.</p>
          </Link>
        </div>

        <FAQBlock title="Red Rocks Parking FAQ" rows={faqRows} />
      </section>
    </main>
  );
}
