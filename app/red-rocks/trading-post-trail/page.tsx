import Link from "next/link";
import FAQBlock from "@/components/FAQBlock";
import { getFaqRowsWithGlobal } from "@/lib/faqs/getFaqs";
import { buildFaqPageJsonLd } from "@/lib/faqs/schema";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

export const metadata = {
  title: "Trading Post Trail at Red Rocks",
  description:
    "Long-form Trading Post Trail guide: route profile, pacing, weather considerations, and how to pair trail visits with concerts.",
  alternates: { canonical: "/red-rocks/trading-post-trail" },
};

const coreLinks = [
  { href: "/red-rocks", label: "Hub" },
  { href: "/red-rocks/transportation", label: "Transportation" },
  { href: "/red-rocks/parking", label: "Parking" },
  { href: "/red-rocks/faq", label: "FAQ" },
] as const;

export default async function TradingPostTrailPage() {
  const faqRows = await getFaqRowsWithGlobal("red-rocks/trading-post-trail.json");
  const faqJsonLd = buildFaqPageJsonLd(faqRows);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Red Rocks", item: `${SITE}/red-rocks` },
      { "@type": "ListItem", position: 3, name: "Trading Post Trail", item: `${SITE}/red-rocks/trading-post-trail` },
    ],
  };

  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
        {faqRows.length > 0 ? (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        ) : null}

        <div className="comic-hero">
          <div className="comic-kicker">Trail Focus</div>
          <h1 className="comic-title">Trading Post Trail: Best First Hike at Red Rocks</h1>
          <p className="comic-copy">
            Trading Post Trail is usually the most practical first hike at Red Rocks because it combines scenery, geologic context,
            and manageable distance in one loop. Most visitors can complete it comfortably with modest pacing and basic hydration,
            which is why it works for short daytime visits and for pre-show add-on plans.
          </p>
          <p className="comic-copy">
            The route is often described as roughly 1.4 miles, with moderate effort for most hikers. Conditions, pace, weather, and
            stop frequency can make total time vary, so it is better to budget a flexible window than chase a rigid clock.
          </p>
        </div>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Route Planning</div>
          <p className="comic-copy" style={{ marginTop: 8 }}>
            Start with your desired experience mode: fast loop, photography pace, or geology-focused walk. That decision controls
            your true duration more than nominal mileage. If this is your first visit, slower pacing usually gives better value
            because you can read terrain, signage, and viewpoints without rushing transitions.
          </p>
          <p className="comic-copy">
            Bring water even on short loops. Dry conditions and sun load can increase fatigue quickly. If your plan includes an
            evening show, treat hydration and energy conservation as part of the concert logistics plan.
          </p>
          <p className="comic-copy">
            Keep footwear and layering practical. Terrain can vary in traction and exposure depending on weather.
          </p>
        </section>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">When To Hike</div>
          <p className="comic-copy" style={{ marginTop: 8 }}>
            Early morning and late afternoon windows are often more comfortable than peak midday heat in warmer months. These
            windows also improve experience quality for groups that want less crowding and a steadier pace.
          </p>
          <p className="comic-copy">
            If you are hiking on show day, finish early enough to reset before venue operations ramp. Build time for food,
            hydration, transit, and regrouping so your evening plan is not rushed.
          </p>
          <p className="comic-copy">
            In uncertain weather, keep the loop optional. It is better to shorten or skip than to compress your entire day into a
            low-margin schedule.
          </p>
        </section>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">At A Glance</div>
          <ul style={{ marginTop: 10, paddingLeft: 18 }}>
            <li className="comic-copy">Distance: about 1.4 miles, loop format.</li>
            <li className="comic-copy">Difficulty: generally moderate for most visitors.</li>
            <li className="comic-copy">Best use: first-visit orientation and scenic context.</li>
            <li className="comic-copy">Show-day fit: strong, if completed early with recovery time.</li>
          </ul>
        </section>

        <div className="comic-grid" style={{ marginTop: 16 }}>
          <Link href="/red-rocks/hiking-trails" className="comic-panel block">
            <div className="comic-tag">Related</div>
            <h2 className="comic-h3">All Hiking Trails</h2>
            <p className="comic-copy">Compare Trading Post with longer route options.</p>
          </Link>
          <Link href="/red-rocks/visiting-guide" className="comic-panel block">
            <div className="comic-tag">Related</div>
            <h2 className="comic-h3">Visiting Guide</h2>
            <p className="comic-copy">Weather, altitude, and overall day-visit strategy.</p>
          </Link>
          <Link href="/find" className="comic-panel block">
            <div className="comic-tag">CTA</div>
            <h2 className="comic-h3">Show Transportation Options</h2>
            <p className="comic-copy">Lock evening transportation after trail planning.</p>
          </Link>
        </div>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Cluster Navigation</div>
          <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
            {coreLinks.map((item) => (
              <Link key={item.href} href={item.href} className="comic-btn comic-btn-secondary">
                {item.label}
              </Link>
            ))}
          </div>
        </section>

        <FAQBlock title="Trading Post Trail FAQ" rows={faqRows} />
      </section>
    </main>
  );
}
