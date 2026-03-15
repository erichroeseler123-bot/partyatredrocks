import Link from "next/link";
import FAQBlock from "@/components/FAQBlock";
import { getFaqRowsWithGlobal } from "@/lib/faqs/getFaqs";
import { buildFaqPageJsonLd } from "@/lib/faqs/schema";
import { RED_ROCKS_ENTITIES } from "@/lib/redRocksAuthority";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

export const metadata = {
  title: "Red Rocks Geology: Why the Rocks Are Red",
  description:
    "Long-form Red Rocks geology guide: Fountain Formation sandstone, iron oxide coloration, uplift history, and regional context.",
  alternates: { canonical: "/red-rocks/geology" },
};

export default async function RedRocksGeologyPage() {
  const faqRows = await getFaqRowsWithGlobal("red-rocks/geology.json");
  const faqJsonLd = buildFaqPageJsonLd(faqRows);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Red Rocks", item: `${SITE}/red-rocks` },
      { "@type": "ListItem", position: 3, name: "Geology", item: `${SITE}/red-rocks/geology` },
    ],
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Red Rocks Geology: Why the Rocks Are Red",
    about: ["Fountain Formation", "Sandstone", "Iron Oxide", "Laramide Orogeny"],
    url: `${SITE}/red-rocks/geology`,
  };
  const geologyAuthorityPages = RED_ROCKS_ENTITIES.filter((p) => p.category === "geology");

  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
        {faqRows.length > 0 ? (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        ) : null}

        <div className="comic-hero">
          <div className="comic-kicker">Geology</div>
          <h1 className="comic-title">Why Red Rocks Are Red</h1>
          <p className="comic-copy">
            Red Rocks is one of the most recognizable geologic landmarks in the Front Range because its story is visible in the
            landscape. The venue sits within tilted sandstone layers associated with the Fountain Formation, where iron-rich
            minerals oxidized and produced the red coloration that defines the park. The result is not just scenic color. It is a
            readable record of deposition, uplift, and erosion over deep time.
          </p>
          <p className="comic-copy">
            Visitors often ask if Red Rocks was engineered to look this way. It was not. The amphitheatre performance space uses a
            natural geologic bowl framed by monoliths that were shaped by regional tectonics and long-term weathering. That is the
            core reason the venue feels different from constructed arenas.
          </p>
        </div>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Fountain Formation Basics</div>
          <p className="comic-copy" style={{ marginTop: 8 }}>
            The Fountain Formation is generally tied to sediment deposited from erosion of ancestral mountain systems hundreds of
            millions of years ago. Over long intervals, sand and gravel compacted into rock and preserved broad environmental
            transitions. In the Red Rocks area, those deposits later became exposed and tilted, making bedding orientation easy to
            see from trails and overlooks.
          </p>
          <p className="comic-copy">
            The red pigment most visitors notice comes largely from iron oxide. In practical terms, the rocks look red for the same
            broad chemical reason metal rusts red-brown. That oxidation signature is common across several Front Range landmarks,
            which is why places like Garden of the Gods and the Flatirons can share visual traits.
          </p>
          <p className="comic-copy">
            Even without advanced geology training, you can read clues in color banding, bedding tilt, and erosion patterns. Those
            features are part of what makes Red Rocks valuable as both a recreation site and a natural classroom.
          </p>
        </section>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Uplift and Erosion</div>
          <p className="comic-copy" style={{ marginTop: 8 }}>
            Regional uplift associated with mountain-building episodes helped expose older sedimentary layers and changed how water
            and weather carved the landscape. Over time, differential erosion left stronger rock units as prominent fins and
            monoliths while weaker materials wore back. That contrast is essential to the Red Rocks silhouette.
          </p>
          <p className="comic-copy">
            The amphitheatre setting works acoustically and visually because the geologic geometry creates a natural bowl with high
            sandstone walls. Human construction refined access and stage infrastructure, but the foundational form is geologic.
          </p>
          <p className="comic-copy">
            For visitors, this means Red Rocks is not just a concert destination. It is a geologic site where the venue experience
            depends directly on natural landform structure.
          </p>
        </section>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Field Notes For Visitors</div>
          <ul style={{ marginTop: 10, paddingLeft: 18 }}>
            <li className="comic-copy">Look for tilted bedding planes in exposed sandstone along trail sections.</li>
            <li className="comic-copy">Observe color variation where oxidation and moisture exposure differ.</li>
            <li className="comic-copy">Compare monolith edges and erosion forms from multiple viewpoints.</li>
            <li className="comic-copy">Use nearby Dinosaur Ridge as a complementary geologic and paleontologic stop.</li>
          </ul>
        </section>

        <div className="comic-grid" style={{ marginTop: 16 }}>
          <Link href="/red-rocks/hiking-trails" className="comic-panel block">
            <div className="comic-tag">Next</div>
            <h2 className="comic-h3">Hiking Trails</h2>
            <p className="comic-copy">Apply geologic context to route-level field observation.</p>
          </Link>
          <Link href="/red-rocks/visiting-guide" className="comic-panel block">
            <div className="comic-tag">Plan</div>
            <h2 className="comic-h3">Visiting Guide</h2>
            <p className="comic-copy">Pair terrain understanding with weather and timing guidance.</p>
          </Link>
          <Link href="/book?venue=red-rocks-amphitheatre" className="comic-panel block">
            <div className="comic-tag">Ride</div>
            <h2 className="comic-h3">Going To A Show?</h2>
            <p className="comic-copy">Use ride matching after route and timing are locked.</p>
          </Link>
        </div>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Geology Index</div>
          <p className="comic-copy" style={{ marginTop: 8 }}>
            Explore geology-specific Red Rocks pages including direct-answer long-tail topics.
          </p>
          <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
            {geologyAuthorityPages.map((page) => (
              <Link key={page.slug} href={`/red-rocks/${page.slug}`} className="comic-btn comic-btn-secondary">
                {page.title}
              </Link>
            ))}
          </div>
        </section>

        <FAQBlock title="Red Rocks Geology FAQ" rows={faqRows} />
      </section>
    </main>
  );
}
