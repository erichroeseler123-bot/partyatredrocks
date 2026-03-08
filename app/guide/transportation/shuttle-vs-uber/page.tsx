import Link from "next/link";
import FAQBlock from "@/components/FAQBlock";
import { getFaqRowsWithGlobal } from "@/lib/faqs/getFaqs";
import { buildFaqPageJsonLd } from "@/lib/faqs/schema";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

export const metadata = {
  title: "Red Rocks Shuttle vs Uber (2026): Price vs Reliability",
  description:
    "Head-to-head comparison of shuttle vs Uber at Red Rocks: reliability, pricing behavior, pickup friction, and post-show failure modes.",
  alternates: {
    canonical: "/guide/transportation/shuttle-vs-uber",
  },
};

export default async function Page() {
  const faqRows = await getFaqRowsWithGlobal("guide/shuttle-vs-uber.json");
  const faqJsonLd = buildFaqPageJsonLd(faqRows);
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Guide", item: `${SITE}/guide` },
      { "@type": "ListItem", position: 3, name: "Transportation", item: `${SITE}/guide/transportation` },
      { "@type": "ListItem", position: 4, name: "Shuttle vs Uber", item: `${SITE}/guide/transportation/shuttle-vs-uber` },
    ],
  };

  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

        <div className="comic-hero">
          <div className="comic-kicker">Transportation Comparison</div>
          <h1 className="comic-title">Shuttle vs Uber to Red Rocks</h1>
          <p className="comic-copy">
            Direct answer: rideshare is flexible inbound but unpredictable outbound. Shuttle is less flexible inbound but
            materially better for guaranteed post-show return.
          </p>
        </div>

        <div className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Decision Grid</div>
          <div className="overflow-x-auto" style={{ marginTop: 10 }}>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-2 pr-3">Option</th>
                  <th className="py-2 pr-3">Strongest Use</th>
                  <th className="py-2 pr-3">Primary Risk</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/5">
                  <td className="py-2 pr-3 font-semibold">Uber/Lyft</td>
                  <td className="py-2 pr-3">Inbound flexibility</td>
                  <td className="py-2 pr-3">Post-encore surge + pickup friction</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-2 pr-3 font-semibold">Shared Shuttle</td>
                  <td className="py-2 pr-3">Reliable round trip</td>
                  <td className="py-2 pr-3">Must align with departure timing</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-2 pr-3 font-semibold">Private SUV/Van</td>
                  <td className="py-2 pr-3">Control + comfort</td>
                  <td className="py-2 pr-3">Higher upfront cost</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link className="comic-btn comic-btn-primary" href="/find">
              Compare Ride Options
            </Link>
            <Link className="comic-btn comic-btn-secondary" href="/week/red-rocks">
              Red Rocks This Week
            </Link>
          </div>
        </div>

        <div className="comic-grid" style={{ marginTop: 16 }}>
          <Link href="/guide/transportation" className="comic-panel block">
            <div className="comic-tag">Hub</div>
            <h2 className="comic-h3">Transportation Hub</h2>
            <p className="comic-copy">Parent guide for all Red Rocks transport planning.</p>
          </Link>
          <Link href="/guide/show-night-strategy/post-show-pickup-plan" className="comic-panel block">
            <div className="comic-tag">After Show</div>
            <h2 className="comic-h3">Post-Show Pickup Plan</h2>
            <p className="comic-copy">Detailed extraction strategy once the encore ends.</p>
          </Link>
          <Link href="/venues/red-rocks-amphitheatre" className="comic-panel block">
            <div className="comic-tag">Venue</div>
            <h2 className="comic-h3">Red Rocks Venue Page</h2>
            <p className="comic-copy">Venue context and show schedule from snapshots.</p>
          </Link>
          <Link href="/guide/red-rocks-intelligence-hub" className="comic-panel block">
            <div className="comic-tag">Context</div>
            <h2 className="comic-h3">Red Rocks Intelligence Hub</h2>
            <p className="comic-copy">High-authority venue context that supports this comparison.</p>
          </Link>
          <Link href="/venues/mission-ballroom" className="comic-panel block">
            <div className="comic-tag">Venue</div>
            <h2 className="comic-h3">Mission Ballroom</h2>
            <p className="comic-copy">Apply the same return-risk framework to downtown venue nights.</p>
          </Link>
          <Link href="/venues/fiddlers-green-amphitheatre" className="comic-panel block">
            <div className="comic-tag">Venue</div>
            <h2 className="comic-h3">Fiddler&apos;s Green</h2>
            <p className="comic-copy">Compare surge/pickup behavior for another high-capacity amphitheatre.</p>
          </Link>
        </div>

        <FAQBlock title="Shuttle vs Uber FAQ" rows={faqRows} />
      </section>
    </main>
  );
}
