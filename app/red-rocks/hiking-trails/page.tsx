import Link from "next/link";
import FAQBlock from "@/components/FAQBlock";
import { getFaqRowsWithGlobal } from "@/lib/faqs/getFaqs";
import { buildFaqPageJsonLd } from "@/lib/faqs/schema";
import { RED_ROCKS_ENTITIES } from "@/lib/redRocksAuthority";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

export const metadata = {
  title: "Red Rocks Hiking Trails Guide",
  description:
    "Long-form Red Rocks hiking guide with route planning, difficulty context, altitude pacing, and show-day integration tips.",
  alternates: { canonical: "/red-rocks/hiking-trails" },
};

export default async function RedRocksHikingTrailsPage() {
  const faqRows = await getFaqRowsWithGlobal("red-rocks/hiking-trails.json");
  const faqJsonLd = buildFaqPageJsonLd(faqRows);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Red Rocks", item: `${SITE}/red-rocks` },
      { "@type": "ListItem", position: 3, name: "Hiking Trails", item: `${SITE}/red-rocks/hiking-trails` },
    ],
  };
  const trailAuthorityPages = RED_ROCKS_ENTITIES.filter((p) => p.category === "hiking");

  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
        {faqRows.length > 0 ? (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        ) : null}

        <div className="comic-hero">
          <div className="comic-kicker">Trails</div>
          <h1 className="comic-title">Red Rocks Hiking Trails: Practical Planning Guide</h1>
          <p className="comic-copy">
            Red Rocks trails are one of the strongest parts of the park experience, but they are often underestimated by visitors
            who are unfamiliar with elevation, dry air, and mixed surfaces. The right way to plan is simple: choose a route that
            fits your current conditioning, build pacing around altitude, and leave enough reserve energy if you are attending a
            concert the same evening.
          </p>
          <p className="comic-copy">
            First-time visitors should usually begin with Trading Post Trail. It gives strong scenery-to-effort value, clear route
            logic, and enough terrain variety to orient new hikers without requiring an all-day commitment.
          </p>
        </div>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Trail Selection Framework</div>
          <p className="comic-copy" style={{ marginTop: 8 }}>
            Choose your route by capacity, not ambition. Ask three questions first: what is your true fitness today, how does your
            group handle altitude, and what is your time window before weather or show obligations. If any answer is uncertain,
            select a shorter route and preserve margin.
          </p>
          <p className="comic-copy">
            Route difficulty at Red Rocks is often less about technical terrain and more about cumulative stress: sun exposure,
            repeated ups and downs, and lower-oxygen exertion. Visitors from sea level should assume that moderate routes can feel
            harder than expected and pace accordingly.
          </p>
          <p className="comic-copy">
            Keep route plans visible to everyone in your group before departure. Shared expectations prevent mid-route pace splits
            that create avoidable delays.
          </p>
        </section>

        <div className="comic-grid" style={{ marginTop: 16 }}>
          <article className="comic-panel">
            <div className="comic-tag">Trading Post Trail</div>
            <p className="comic-copy" style={{ marginTop: 8 }}>
              A common first-choice loop, often around 1.4 miles. Scenic, moderate, and practical for photography or short
              educational stops. Usually the best default when the goal is experience quality without overextending effort.
            </p>
          </article>
          <article className="comic-panel">
            <div className="comic-tag">Red Rocks Trail</div>
            <p className="comic-copy" style={{ marginTop: 8 }}>
              A longer multi-use corridor with broader network connections. Better for visitors who want additional mileage and have
              enough time buffer to absorb weather or pace changes.
            </p>
          </article>
          <article className="comic-panel">
            <div className="comic-tag">Planning Essentials</div>
            <p className="comic-copy" style={{ marginTop: 8 }}>
              Bring more water than expected, use sun protection early, and avoid peak heat windows when possible. Hydration and
              pace discipline matter more than speed.
            </p>
          </article>
        </div>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Hike + Concert Same Day</div>
          <p className="comic-copy" style={{ marginTop: 8 }}>
            Many visitors pair a daytime trail with an evening show. This works well when the hike is intentionally moderate and
            you preserve a recovery block before concert ingress. The mistake is treating the hike as a separate day and forgetting
            that Red Rocks concerts include substantial standing and stair movement.
          </p>
          <p className="comic-copy">
            Keep the day integrated: finish hiking early, rehydrate, eat, then transition to your concert arrival plan with enough
            time to avoid rushed parking or pickup coordination.
          </p>
          <p className="comic-copy">
            If your group shows early signs of altitude fatigue, downshift the itinerary. A slightly shorter trail and smoother
            concert night is usually better than forcing full distance and losing quality later.
          </p>
        </section>

        <div className="comic-grid" style={{ marginTop: 16 }}>
          <Link href="/red-rocks/trading-post-trail" className="comic-panel block">
            <div className="comic-tag">Trail Focus</div>
            <h2 className="comic-h3">Trading Post Trail</h2>
            <p className="comic-copy">Detailed route profile and time budgeting notes.</p>
          </Link>
          <Link href="/red-rocks/wildlife" className="comic-panel block">
            <div className="comic-tag">Related</div>
            <h2 className="comic-h3">Wildlife Guide</h2>
            <p className="comic-copy">What to watch for and how to observe responsibly.</p>
          </Link>
          <Link href="/red-rocks/visiting-guide" className="comic-panel block">
            <div className="comic-tag">Related</div>
            <h2 className="comic-h3">Visiting Guide</h2>
            <p className="comic-copy">Weather, altitude, and day-planning fundamentals.</p>
          </Link>
          <Link href="/find" className="comic-panel block">
            <div className="comic-tag">CTA</div>
            <h2 className="comic-h3">Going to a Show? Book a Ride</h2>
            <p className="comic-copy">Lock return logistics after your daytime route plan is set.</p>
          </Link>
        </div>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Trails Index</div>
          <p className="comic-copy" style={{ marginTop: 8 }}>
            Explore route-specific long-tail trail pages in the Red Rocks cluster.
          </p>
          <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
            {trailAuthorityPages.map((page) => (
              <Link key={page.slug} href={`/red-rocks/${page.slug}`} className="comic-btn comic-btn-secondary">
                {page.title}
              </Link>
            ))}
          </div>
        </section>

        <FAQBlock title="Red Rocks Hiking FAQ" rows={faqRows} />
      </section>
    </main>
  );
}
