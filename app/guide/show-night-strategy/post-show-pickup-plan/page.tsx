import Link from "next/link";
import FAQBlock from "@/components/FAQBlock";
import { getFaqRowsWithGlobal } from "@/lib/faqs/getFaqs";
import { buildFaqPageJsonLd } from "@/lib/faqs/schema";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

export const metadata = {
  title: "Best Post-Show Pickup Plan at Red Rocks (2026)",
  description:
    "How to avoid getting stranded after Red Rocks: meet-point strategy, timing choices, and fallback plans for sold-out nights.",
  alternates: {
    canonical: "/guide/show-night-strategy/post-show-pickup-plan",
  },
};

export default async function Page() {
  const faqRows = await getFaqRowsWithGlobal("guide/post-show-pickup-plan.json");
  const faqJsonLd = buildFaqPageJsonLd(faqRows);
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Guide", item: `${SITE}/guide` },
      { "@type": "ListItem", position: 3, name: "Show-Night Strategy", item: `${SITE}/guide/show-night-strategy` },
      {
        "@type": "ListItem",
        position: 4,
        name: "Post-Show Pickup Plan",
        item: `${SITE}/guide/show-night-strategy/post-show-pickup-plan`,
      },
    ],
  };

  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

        <div className="comic-hero">
          <div className="comic-kicker">Exit Strategy</div>
          <h1 className="comic-title">Post-Show Pickup Plan</h1>
          <p className="comic-copy">
            Direct answer: decide your meet point and fallback before encore. The stranded window happens when groups make
            pickup decisions after the crowd is already moving.
          </p>
        </div>

        <div className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Execution Sequence</div>
          <ol className="comic-copy" style={{ marginTop: 10, paddingLeft: 18 }}>
            <li>Pick one specific meet point before the show starts.</li>
            <li>Share one fallback point if service drops.</li>
            <li>Text the plan before encore starts.</li>
            <li>Choose now: full encore vs faster exit.</li>
          </ol>
        </div>

        <div className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Next Actions</div>
          <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link className="comic-btn comic-btn-primary" href="/find">
              Book Ride
            </Link>
            <Link className="comic-btn comic-btn-secondary" href="/week/red-rocks">
              Check This Week
            </Link>
            <Link className="comic-btn comic-btn-secondary" href="/guide/transportation/shuttle-vs-uber">
              Shuttle vs Uber
            </Link>
            <Link className="comic-btn comic-btn-secondary" href="/guide/logistics/parking-lots">
              Parking Guide
            </Link>
          </div>
        </div>

        <div className="comic-grid" style={{ marginTop: 16 }}>
          <Link href="/guide/show-night-strategy" className="comic-panel block">
            <div className="comic-tag">Parent</div>
            <h2 className="comic-h3">Show-Night Strategy</h2>
            <p className="comic-copy">Parent strategy page for timing, weather pivots, and operations.</p>
          </Link>
          <Link href="/venues/red-rocks-amphitheatre" className="comic-panel block">
            <div className="comic-tag">Venue</div>
            <h2 className="comic-h3">Red Rocks Venue Page</h2>
            <p className="comic-copy">Use current show context to tighten pickup timing.</p>
          </Link>
          <Link href="/guide/red-rocks-intelligence-hub" className="comic-panel block">
            <div className="comic-tag">Hub</div>
            <h2 className="comic-h3">Red Rocks Intelligence Hub</h2>
            <p className="comic-copy">Broader venue knowledge that supports better exit planning.</p>
          </Link>
          <Link href="/venues/mission-ballroom" className="comic-panel block">
            <div className="comic-tag">Venue</div>
            <h2 className="comic-h3">Mission Ballroom</h2>
            <p className="comic-copy">Use the same pre-encore pickup discipline at major indoor rooms.</p>
          </Link>
          <Link href="/venues/fiddlers-green-amphitheatre" className="comic-panel block">
            <div className="comic-tag">Venue</div>
            <h2 className="comic-h3">Fiddler&apos;s Green</h2>
            <p className="comic-copy">Apply this exit sequence to sold-out amphitheatre nights.</p>
          </Link>
        </div>

        <FAQBlock title="Post-Show Pickup FAQ" rows={faqRows} />
      </section>
    </main>
  );
}
