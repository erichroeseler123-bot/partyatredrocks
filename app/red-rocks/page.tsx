import Link from "next/link";
import FAQBlock from "@/components/FAQBlock";
import { getFaqRowsWithGlobal } from "@/lib/faqs/getFaqs";
import { buildFaqPageJsonLd } from "@/lib/faqs/schema";
import { RED_ROCKS_ENTITIES } from "@/lib/redRocksAuthority";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

export const metadata = {
  title: "Red Rocks Authority Hub: Visiting, Concerts, Trails, Geology, Transportation",
  description:
    "Canonical Red Rocks hub with long-form planning guidance for parking, concerts, trails, geology, wildlife, camping alternatives, and transportation.",
  alternates: { canonical: "/red-rocks" },
};

const clusterLinks = [
  { href: "/red-rocks/visiting-guide", tag: "Visit", title: "Visiting Guide", copy: "Hours, timing, weather, and what to bring." },
  { href: "/red-rocks/parking", tag: "Parking", title: "Parking Strategy", copy: "Lot tradeoffs, stair effort, and exit timing." },
  { href: "/red-rocks/concert-guide", tag: "Concerts", title: "Concert Guide", copy: "Capacity, movement, and show-night logistics." },
  { href: "/red-rocks/hiking-trails", tag: "Trails", title: "Hiking Trails", copy: "Route planning for first-time and repeat visitors." },
  { href: "/red-rocks/trading-post-trail", tag: "Trail Focus", title: "Trading Post Trail", copy: "A practical route profile with pacing notes." },
  { href: "/red-rocks/geology", tag: "Geology", title: "Why the Rocks Are Red", copy: "Fountain Formation and Front Range uplift context." },
  { href: "/red-rocks/wildlife", tag: "Wildlife", title: "Wildlife Guide", copy: "What you may see and how to observe safely." },
  { href: "/red-rocks/camping-nearby", tag: "Camping", title: "Camping Nearby", copy: "Where to stay and how to separate lodging from transport." },
  { href: "/red-rocks/transportation", tag: "Transportation", title: "How To Get To Red Rocks", copy: "Ride planning and post-show pickup logic." },
  { href: "/red-rocks/map", tag: "Interactive", title: "Red Rocks Map", copy: "Visual layer for trails, seating, geology, parking, and pickup points." },
  { href: "/red-rocks/faq", tag: "FAQ", title: "Red Rocks FAQ", copy: "High-intent answers for planning and logistics." },
] as const;

const CATEGORY_META = {
  transportation: { label: "Transportation", copy: "Money pages and conversion-intent transport planning." },
  concerts: { label: "Concerts", copy: "Show-night planning, seating, and experience optimization pages." },
  hiking: { label: "Hiking", copy: "Route-level trail pages with pacing and planning notes." },
  geology: { label: "Geology", copy: "Formation and history pages answering high-intent educational queries." },
  wildlife: { label: "Wildlife", copy: "Nature-focused long-tail pages for birds, plants, and safety intent." },
  visiting: { label: "Visiting", copy: "Trip-planning pages including camping-adjacent and best-time guidance." },
} as const;

export default async function RedRocksHubPage() {
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
          <div className="comic-kicker">Red Rocks Authority Hub</div>
          <h1 className="comic-title">The Complete Red Rocks Planning Hub</h1>
          <p className="comic-copy">
            Red Rocks planning works best when you treat it as a full trip system, not just a concert ticket. This hub is the
            central map for that system. It connects daytime visit planning, geology and trail context, show-night timing,
            transportation choices, parking tradeoffs, and post-encore pickup execution. If you are building one dependable plan
            for your group, this is where every piece ties together.
          </p>
          <p className="comic-copy">
            Most visitors search one question at a time: what time should I arrive, where do I park, can I hike before the show,
            or why do rides get chaotic at close. Those are all connected decisions. Arrival timing changes lot options. Lot
            options change stair effort. Stair effort changes energy and pacing. Pacing changes whether your post-show pickup plan
            succeeds. This hub is designed to make those dependencies clear so you can avoid the common failure pattern of
            improvising at the busiest point of the night.
          </p>
          <p className="comic-copy">
            Use the navigation cards below as a cluster, not as isolated articles. Start with your intent. If your goal is a day
            visit, begin with hiking and geology and then confirm weather and park timing. If your goal is a concert night, begin
            with parking, concert logistics, and transportation in that order. If your goal is both, use the trail pages to plan a
            shorter daytime route that preserves energy for evening stairs and venue movement.
          </p>
          <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link className="comic-btn comic-btn-primary" href="/find">
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
          <div className="comic-tag">How To Use This Hub</div>
          <p className="comic-copy" style={{ marginTop: 8 }}>
            Step one is to lock your date and purpose. Are you coming for a specific show, a daytime hike, or both? Step two is
            to select your operational constraints: who is in your group, how much stair effort is realistic, and how much time
            buffer you can add before doors. Step three is to choose your outbound and return transportation path before you are on
            property. That single decision removes most post-show friction.
          </p>
          <p className="comic-copy">
            This cluster intentionally includes both authority content and commercial planning links. Authority content helps you
            understand the venue and environment. Planning links help you execute the trip. When both layers are in one system,
            you do not need to open ten browser tabs and reconcile conflicting advice.
          </p>
          <p className="comic-copy">
            If you are coordinating family or friends, send this hub first. Let everyone review the same baseline assumptions.
            Shared assumptions around arrival, pickup location, and post-show regrouping are what prevent group fragmentation when
            crowds peak.
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
          <div className="comic-tag">Authority Pages By Category</div>
          <p className="comic-copy" style={{ marginTop: 8 }}>
            These generated long-tail pages target precise search intent and funnel readers into transportation planning.
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
            Priority one is timing. Red Rocks flow degrades quickly near peak arrival and peak exit windows. Priority two is route
            design: parking and pickup paths are not interchangeable, and every option has tradeoffs between walking effort and
            departure speed. Priority three is weather and altitude readiness, which affects both comfort and movement pace.
          </p>
          <p className="comic-copy">
            Keep your plan explicit: departure time, arrival target, regroup point, return trigger, and backup communication method.
            If your group does not agree on those five items in advance, post-show chaos usually decides for you.
          </p>
          <p className="comic-copy">
            When you are ready to convert planning into action, use /find to choose the ride model that fits your group size,
            budget, and control requirements.
          </p>
        </section>

        <FAQBlock title="Red Rocks Hub FAQ" rows={faqRows} />
      </section>
    </main>
  );
}
