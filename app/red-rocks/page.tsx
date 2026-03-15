import Link from "next/link";
import FAQBlock from "@/components/FAQBlock";
import { getFaqRowsWithGlobal } from "@/lib/faqs/getFaqs";
import { buildFaqPageJsonLd } from "@/lib/faqs/schema";
import type { HandoffSearchParams } from "@/lib/parrHandoff";
import { buildBookingHref } from "@/lib/parrHandoff";
import { RED_ROCKS_ENTITIES } from "@/lib/redRocksAuthority";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

export const metadata = {
  title: "Red Rocks Guide: Visiting, Concerts, Trails, Geology, Transportation",
  description:
    "Red Rocks visiting and concert guide with parking, trails, transportation, geology, wildlife, and planning basics.",
  alternates: { canonical: "/red-rocks" },
};

const clusterLinks = [
  { href: "/red-rocks/visiting-guide", tag: "Visit", title: "Visiting Guide", copy: "Hours, timing, weather, and what to bring." },
  { href: "/red-rocks/parking", tag: "Parking", title: "Parking Guide", copy: "Lot tradeoffs, stair effort, and exit timing." },
  { href: "/red-rocks/concert-guide", tag: "Concerts", title: "Concert Guide", copy: "Capacity, movement, and show-night basics." },
  { href: "/red-rocks/hiking-trails", tag: "Trails", title: "Hiking Trails", copy: "Route planning for first-time and repeat visitors." },
  { href: "/red-rocks/trading-post-trail", tag: "Trail Focus", title: "Trading Post Trail", copy: "A practical route profile with pacing notes." },
  { href: "/red-rocks/geology", tag: "Geology", title: "Why the Rocks Are Red", copy: "Fountain Formation and Front Range uplift context." },
  { href: "/red-rocks/wildlife", tag: "Wildlife", title: "Wildlife Guide", copy: "What you may see and how to observe safely." },
  { href: "/red-rocks/best-time-to-arrive", tag: "Timing", title: "Best Time to Arrive", copy: "Arrival windows by lot, stairs, and show-night timing." },
  { href: "/red-rocks/camping-nearby", tag: "Camping", title: "Camping Nearby", copy: "Where to stay and how to separate lodging from transport." },
  { href: "/red-rocks/transportation", tag: "Transportation", title: "How To Get To Red Rocks", copy: "Ride planning and post-show pickup details." },
  { href: "/red-rocks/map", tag: "Interactive", title: "Red Rocks Map", copy: "Trails, seating, geology, parking, and pickup points." },
  { href: "/red-rocks/faq", tag: "FAQ", title: "Red Rocks FAQ", copy: "High-intent answers for planning and logistics." },
] as const;

const CATEGORY_META = {
  transportation: { label: "Transportation", copy: "Getting there, pickup planning, and the ride back after the show." },
  concerts: { label: "Concerts", copy: "Show-night planning, seating, and concert basics." },
  hiking: { label: "Hiking", copy: "Trail pages with route notes and planning basics." },
  geology: { label: "Geology", copy: "Formation and history pages for Red Rocks." },
  wildlife: { label: "Wildlife", copy: "Nature pages covering birds, plants, and safety basics." },
  visiting: { label: "Visiting", copy: "General planning pages including timing, weather, and nearby camping." },
} as const;

export default async function RedRocksHubPage({
  searchParams,
}: {
  searchParams: Promise<HandoffSearchParams>;
}) {
  const sp = await searchParams;
  const faqRows = await getFaqRowsWithGlobal("red-rocks/hub.json");
  const faqJsonLd = buildFaqPageJsonLd(faqRows);

  const touristAttractionJsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: "Red Rocks Amphitheatre",
    description:
      "Natural sandstone amphitheatre in Morrison, Colorado known for concerts, trail access, and geologic landmarks.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Morrison",
      addressRegion: "CO",
      addressCountry: "US",
    },
    url: `${SITE}/red-rocks`,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Red Rocks", item: `${SITE}/red-rocks` },
    ],
  };

  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(touristAttractionJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
        {faqRows.length > 0 ? (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        ) : null}

        <div className="comic-hero">
          <div className="comic-kicker">Red Rocks guide</div>
          <h1 className="comic-title">Plan Your Red Rocks Night</h1>
          <p className="comic-copy">
            Use this page to plan parking, timing, transportation, trails, and the rest of your Red Rocks visit in one place.
          </p>
          <p className="comic-copy">
            Most visitors start with one question: when to arrive, where to park, what to bring, or how to get home after the show.
            The pages below cover those decisions directly.
          </p>
          <p className="comic-copy">
            If you are coming for a concert, start with parking, transportation, and concert planning. If you are visiting during the day,
            start with trails, geology, and timing.
          </p>
          <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link
              className="comic-btn comic-btn-primary"
              href={buildBookingHref({
                target: "book",
                venue: "red-rocks-amphitheatre",
                searchParams: sp,
              })}
            >
              Book Shuttle
            </Link>
            <Link className="comic-btn comic-btn-secondary" href="/week/red-rocks">
              This Week at Red Rocks
            </Link>
            <Link className="comic-btn comic-btn-secondary" href="/venues/red-rocks-amphitheatre">
              Venue Schedule
            </Link>
          </div>
        </div>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Featured Jam Event</div>
          <h2 className="comic-h3" style={{ marginTop: 10 }}>
            Phish at Folsom Field 2026
          </h2>
          <p className="comic-copy" style={{ marginTop: 8 }}>
            Dates, transportation options, and planning details for the Boulder run.
          </p>
          <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link href="/phish-folsom" className="comic-btn comic-btn-secondary">
              View Event Guide
            </Link>
            <Link href="/dead-and-company-red-rocks" className="comic-btn comic-btn-secondary">
              Dead & Company Guide
            </Link>
            <Link
              href={buildBookingHref({
                target: "book",
                venue: "red-rocks-amphitheatre",
                searchParams: sp,
              })}
              className="comic-btn comic-btn-primary"
            >
              Book Ride
            </Link>
          </div>
        </section>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">How To Use This Guide</div>
          <p className="comic-copy" style={{ marginTop: 8 }}>
            Pick the pages that match your trip. Concert nights usually start with parking, transportation, and timing. Daytime visits
            usually start with trails, geology, and weather.
          </p>
          <p className="comic-copy">
            If you are riding instead of driving, book before show night so pickup details and the return ride are already covered.
          </p>
          <p className="comic-copy">
            If you are coordinating a group, share the same arrival and pickup plan with everyone before the show.
          </p>
        </section>

        <div className="comic-grid" style={{ marginTop: 16 }}>
          {clusterLinks.map((link) => (
            <Link key={link.href} href={link.href} className="comic-panel block">
              <div className="comic-tag">{link.tag}</div>
              <h2 className="comic-h3" style={{ marginTop: 10 }}>
                {link.title}
              </h2>
              <p className="comic-copy" style={{ marginTop: 8 }}>
                {link.copy}
              </p>
            </Link>
          ))}
        </div>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Pages By Category</div>
          <p className="comic-copy" style={{ marginTop: 8 }}>
            Browse the Red Rocks pages by topic.
          </p>
          <div style={{ marginTop: 10, display: "grid", gap: 12 }}>
            {Object.entries(CATEGORY_META).map(([category, meta]) => {
              const pages = RED_ROCKS_ENTITIES.filter((p) => p.category === category);
              return (
                <article key={category} className="comic-panel">
                  <div className="comic-tag">{meta.label}</div>
                  <p className="comic-copy" style={{ marginTop: 8 }}>
                    {meta.copy}
                  </p>
                  <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {pages.map((entity) => (
                      <Link key={entity.slug} href={`/red-rocks/${entity.slug}`} className="comic-btn comic-btn-secondary">
                        {entity.title}
                      </Link>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Planning Priorities</div>
          <p className="comic-copy" style={{ marginTop: 8 }}>
            Start with timing. Arrival time affects parking, walking distance, and how rushed the night feels. Then decide whether you
            are driving or riding, and plan for weather after sunset.
          </p>
          <p className="comic-copy">
            Make sure your group knows when to leave, where to regroup, and how you are getting home after the show.
          </p>
          <p className="comic-copy">
            When you are ready to book a ride, start with the shuttle page or go straight into booking.
          </p>
        </section>

        <FAQBlock title="Red Rocks Hub FAQ" rows={faqRows} />
      </section>
    </main>
  );
}
