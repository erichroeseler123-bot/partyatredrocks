import Link from "next/link";
import FAQBlock from "@/components/FAQBlock";
import { getFaqRowsWithGlobal } from "@/lib/faqs/getFaqs";
import { buildFaqPageJsonLd } from "@/lib/faqs/schema";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

export const metadata = {
  title: "Camping Nearby Red Rocks",
  description:
    "Long-form guide to camping near Red Rocks, including nearby alternatives and how to separate lodging plans from show transport plans.",
  alternates: { canonical: "/red-rocks/camping-nearby" },
};

const coreLinks = [
  { href: "/red-rocks", label: "Hub" },
  { href: "/red-rocks/transportation", label: "Transportation" },
  { href: "/red-rocks/parking", label: "Parking" },
  { href: "/red-rocks/faq", label: "FAQ" },
] as const;

export default async function CampingNearbyPage() {
  const faqRows = await getFaqRowsWithGlobal("red-rocks/camping-nearby.json");
  const faqJsonLd = buildFaqPageJsonLd(faqRows);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Red Rocks", item: `${SITE}/red-rocks` },
      { "@type": "ListItem", position: 3, name: "Camping Nearby", item: `${SITE}/red-rocks/camping-nearby` },
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
          <div className="comic-kicker">Camping</div>
          <h1 className="comic-title">Camping Near Red Rocks: What Works and What Does Not</h1>
          <p className="comic-copy">
            Direct answer: overnight camping is not allowed inside Red Rocks Park. If your trip plan includes camping, you need a
            nearby campground plus a separate show-night transport plan. Treat those as two systems. Lodging solves sleep. Transport
            solves event timing and late-night return reliability.
          </p>
          <p className="comic-copy">
            Many visitors accidentally blend those decisions and end up with preventable friction after shows. The right approach is
            to choose camp location first for comfort and rules fit, then choose concert transport based on departure timing,
            return timing, and group size.
          </p>
        </div>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Nearby Camping Options</div>
          <p className="comic-copy" style={{ marginTop: 8 }}>
            Visitors commonly evaluate options around Golden Gate Canyon, Bear Creek Lake, and other Front Range campgrounds. The
            best choice depends on your route preference, reservation availability, quiet-hour rules, and how late your party will
            return on show nights.
          </p>
          <p className="comic-copy">
            Check campground policies before committing to concert-heavy itineraries. Some locations are better suited to early
            nights than late returns.
          </p>
          <ul style={{ marginTop: 10, paddingLeft: 18 }}>
            <li className="comic-copy">Golden Gate Canyon area options</li>
            <li className="comic-copy">Bear Creek Lake area options</li>
            <li className="comic-copy">Regional county and private campground alternatives</li>
          </ul>
        </section>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Show-Night Logistics From Camp</div>
          <p className="comic-copy" style={{ marginTop: 8 }}>
            Build your camp-to-show plan with explicit windows. Departure from camp should absorb traffic variability, and return
            plans should acknowledge that post-show egress can be slow. If your group is tired after the event, a clear transport
            plan matters even more.
          </p>
          <p className="comic-copy">
            For groups that want lower stress, pre-arranged transportation can remove most last-mile uncertainty. For groups that
            drive themselves, parking strategy should be set in advance with realistic walking expectations.
          </p>
          <p className="comic-copy">
            Keep safety practical: avoid ad-hoc route changes late at night and make sure every rider understands the return plan.
          </p>
        </section>

        <div className="comic-grid" style={{ marginTop: 16 }}>
          <Link href="/red-rocks/camping" className="comic-panel block">
            <div className="comic-tag">Related</div>
            <h2 className="comic-h3">Camping Overview</h2>
            <p className="comic-copy">High-level camping context for Red Rocks visitors.</p>
          </Link>
          <Link href="/red-rocks/visiting-guide" className="comic-panel block">
            <div className="comic-tag">Related</div>
            <h2 className="comic-h3">Visiting Guide</h2>
            <p className="comic-copy">Weather, timing, and what to carry for day and show plans.</p>
          </Link>
          <Link href="/book?venue=red-rocks-amphitheatre" className="comic-panel block">
            <div className="comic-tag">CTA</div>
            <h2 className="comic-h3">Book Show Transportation</h2>
            <p className="comic-copy">Choose transport mode after camping details are set.</p>
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

        <FAQBlock title="Camping Near Red Rocks FAQ" rows={faqRows} />
      </section>
    </main>
  );
}
