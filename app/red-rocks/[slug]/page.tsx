import Link from "next/link";
import { UnsplashImg } from "@/components/UnsplashImg";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { RED_ROCKS_ENTITIES, RED_ROCKS_ENTITY_BY_SLUG, RED_ROCKS_MAP_POINTS } from "@/lib/redRocksAuthority";
import TransportComparisonTable from "@/components/redrocks/TransportComparisonTable";
import type { HandoffSearchParams } from "@/lib/parrHandoff";
import { buildBookingHref } from "@/lib/parrHandoff";
import { getDynamicImage } from "@/lib/getDynamicImage";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";
type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<HandoffSearchParams>;
};
const TOPIC_GRAPH_LINKS = [
  { href: "/red-rocks/concerts", label: "Concerts" },
  { href: "/red-rocks/hiking-trails", label: "Hiking Trails" },
  { href: "/red-rocks/geology", label: "Geology" },
  { href: "/red-rocks/wildlife", label: "Wildlife" },
  { href: "/red-rocks/transportation", label: "Transportation" },
  { href: "/red-rocks/parking", label: "Parking" },
  { href: "/red-rocks/map", label: "Map" },
  { href: "/red-rocks/visiting-guide", label: "Visiting Guide" },
] as const;

const TRANSPORT_COMPARISON_BY_SLUG: Record<
  string,
  { title: string; rows: Array<{ mode: string; reliability: string; cost: string; bestFor: string }> }
> = {
  "red-rocks-shuttle": {
    title: "Shuttle vs Uber vs Driving",
    rows: [
      {
        mode: "Shuttle",
        reliability: "High post-show predictability",
        cost: "Fixed per-seat pricing",
        bestFor: "Most riders who want simple round-trip flow",
      },
      {
        mode: "Uber/Lyft",
        reliability: "Variable at peak release",
        cost: "Can surge significantly",
        bestFor: "Flexible one-off rides on lighter nights",
      },
      {
        mode: "Driving",
        reliability: "Depends on lot and exit congestion",
        cost: "Parking + time tradeoffs",
        bestFor: "People prioritizing full personal schedule control",
      },
    ],
  },
  "how-to-get-to-red-rocks": {
    title: "Best Way To Get There By Situation",
    rows: [
      {
        mode: "Shuttle",
        reliability: "Most consistent arrival/exit flow",
        cost: "Known upfront",
        bestFor: "Concert-first nights where return certainty matters",
      },
      {
        mode: "Uber/Lyft",
        reliability: "Good outbound, less stable return",
        cost: "Can increase sharply after encore",
        bestFor: "Smaller groups with flexible timing",
      },
      {
        mode: "Driving",
        reliability: "In your control but traffic sensitive",
        cost: "Parking effort + egress time",
        bestFor: "Visitors comfortable with lot strategy and walking",
      },
    ],
  },
  "post-concert-transportation": {
    title: "Post-Show Exit Mode Comparison",
    rows: [
      {
        mode: "Pre-booked Shuttle",
        reliability: "Highest when meetup is fixed",
        cost: "Predictable",
        bestFor: "Avoiding post-encore decision chaos",
      },
      {
        mode: "On-demand Rideshare",
        reliability: "Lower at peak release",
        cost: "Often highest after the show",
        bestFor: "Backup option with patience for delays",
      },
      {
        mode: "Self-Drive",
        reliability: "Exit speed varies by lot",
        cost: "Time-heavy rather than fee-heavy",
        bestFor: "Groups that accept slower lot egress",
      },
    ],
  },
};

export function generateStaticParams() {
  return RED_ROCKS_ENTITIES.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = RED_ROCKS_ENTITY_BY_SLUG.get(slug);
  if (!page) {
    return {
      title: "Red Rocks Guide",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `${SITE}/red-rocks/${page.slug}` },
  };
}

export default async function RedRocksAuthorityDetailPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const page = RED_ROCKS_ENTITY_BY_SLUG.get(slug);
  if (!page) notFound();
  const seatingOverviewImage = await getDynamicImage(
    "venue",
    "Red Rocks Amphitheatre seating overview",
    "/images/venues/red-rocks-amphitheatre.jpg",
  );

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Red Rocks", item: `${SITE}/red-rocks` },
      ...(page.parent
        ? [
            {
              "@type": "ListItem",
              position: 3,
              name: page.parent.replace("/red-rocks/", "").replaceAll("-", " "),
              item: `${SITE}${page.parent}`,
            },
            { "@type": "ListItem", position: 4, name: page.title, item: `${SITE}/red-rocks/${page.slug}` },
          ]
        : [{ "@type": "ListItem", position: 3, name: page.title, item: `${SITE}/red-rocks/${page.slug}` }]),
    ],
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.title,
    description: page.description,
    url: `${SITE}/red-rocks/${page.slug}`,
    about: ["Red Rocks", page.kicker, "Planning Guide"],
  };

  const touristAttractionJsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: "Red Rocks Amphitheatre",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Morrison",
      addressRegion: "CO",
      addressCountry: "US",
    },
    url: `${SITE}/red-rocks`,
  };

  const categoryEntityJsonLd =
    page.entityType === "HikingTrail"
      ? {
          "@context": "https://schema.org",
          "@type": "HikingTrail",
          name: page.title,
          description: page.description,
          geo: page.coordinates
            ? {
                "@type": "GeoCoordinates",
                latitude: page.coordinates.lat,
                longitude: page.coordinates.lng,
              }
            : undefined,
          isPartOf: {
            "@type": "TouristAttraction",
            name: "Red Rocks Amphitheatre",
            url: `${SITE}/red-rocks`,
          },
        }
      : page.entityType === "MusicEvent"
        ? {
            "@context": "https://schema.org",
            "@type": "MusicEvent",
            name: page.title,
            description: page.description,
            location: {
              "@type": "Place",
              name: "Red Rocks Amphitheatre",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Morrison",
                addressRegion: "CO",
                addressCountry: "US",
              },
              geo: page.coordinates
                ? {
                    "@type": "GeoCoordinates",
                    latitude: page.coordinates.lat,
                    longitude: page.coordinates.lng,
                  }
                : undefined,
            },
          }
        : null;

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map((row) => ({
      "@type": "Question",
      name: row.q,
      acceptedAnswer: { "@type": "Answer", text: row.a },
    })),
  };

  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(touristAttractionJsonLd) }} />
        {categoryEntityJsonLd ? (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(categoryEntityJsonLd) }} />
        ) : null}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

        <div className="comic-hero">
          <div className="comic-kicker">{page.kicker}</div>
          <h1 className="comic-title">{page.title}</h1>
          <p className="comic-copy">{page.intro}</p>
          <p className="comic-copy">{page.directAnswer}</p>
          <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link className="comic-btn comic-btn-secondary" href="/red-rocks">
              Red Rocks Hub
            </Link>
            <Link className="comic-btn comic-btn-secondary" href="/red-rocks/transportation">
              Transportation
            </Link>
            <Link className="comic-btn comic-btn-secondary" href="/red-rocks/parking">
              Parking
            </Link>
            <Link className="comic-btn comic-btn-secondary" href="/red-rocks/faq">
              FAQ
            </Link>
            <Link
              className="comic-btn comic-btn-primary"
              href={buildBookingHref({ target: "book", venue: "red-rocks-amphitheatre", searchParams: sp })}
            >
              {page.ctaText}
            </Link>
          </div>
        </div>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Fact Block</div>
          <div className="comic-grid" style={{ marginTop: 10 }}>
            {[
              ["Category", page.factBlock.category],
              ["Location", page.factBlock.location],
              ["Best For", page.factBlock.bestFor],
              ["Difficulty", page.factBlock.difficulty],
              ["Season", page.factBlock.season],
              ["Distance", page.factBlock.distance],
              ["Concert Relevance", page.factBlock.concertRelevance],
              ["Transportation Relevance", page.factBlock.transportationRelevance],
            ].map(([label, value]) => (
              <article key={label} className="comic-panel">
                <div className="comic-tag">{label}</div>
                <p className="comic-copy" style={{ marginTop: 8 }}>
                  {value}
                </p>
              </article>
            ))}
          </div>
        </section>

        {page.slug === "how-to-get-to-red-rocks" ? (
          <section className="comic-panel" style={{ marginTop: 16 }}>
            <div className="comic-tag">Quick Answer</div>
            <ul style={{ marginTop: 10, paddingLeft: 18 }}>
              <li className="comic-copy">Shuttle: strongest reliability for arrival and return.</li>
              <li className="comic-copy">Uber/Lyft: flexible booking, higher post-show variability.</li>
              <li className="comic-copy">Driving: independence with parking and exit tradeoffs.</li>
            </ul>
          </section>
        ) : null}

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Quick Facts</div>
          <div className="comic-grid" style={{ marginTop: 10 }}>
            {page.facts.map((fact) => (
              <article key={fact.label} className="comic-panel">
                <div className="comic-tag">{fact.label}</div>
                <p className="comic-copy" style={{ marginTop: 8 }}>
                  {fact.value}
                </p>
              </article>
            ))}
          </div>
        </section>

        {page.sections.map((section) => (
          <section key={section.heading} className="comic-panel" style={{ marginTop: 16 }}>
            <div className="comic-tag">{section.heading}</div>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="comic-copy" style={{ marginTop: 8 }}>
                {paragraph}
              </p>
            ))}
          </section>
        ))}

        {TRANSPORT_COMPARISON_BY_SLUG[page.slug] ? (
          <TransportComparisonTable
            title={TRANSPORT_COMPARISON_BY_SLUG[page.slug].title}
            rows={TRANSPORT_COMPARISON_BY_SLUG[page.slug].rows}
          />
        ) : null}

        {page.slug === "seating-chart" ? (
          <>
            <section className="comic-panel" style={{ marginTop: 16 }}>
              <div className="comic-tag">Best Seats By Goal</div>
              <div style={{ marginTop: 12, textAlign: "center" }}>
                <UnsplashImg
                  src={seatingOverviewImage}
                  query="red rocks amphitheatre seating overview"
                  alt="Red Rocks Amphitheatre seating bowl overview showing lower, mid, and upper sections with stage view"
                  width={800}
                  height={450}
                  loading="lazy"
                  decoding="async"
                  className="max-w-full rounded-xl border border-white/20 mx-auto"
                />
                <p className="comic-copy" style={{ marginTop: 8, opacity: 0.8 }}>
                  General seating layout reference (not event-specific).
                </p>
              </div>
              <div className="comic-grid" style={{ marginTop: 10 }}>
                <article className="comic-panel">
                  <div className="comic-tag">Balanced View + Effort</div>
                  <p className="comic-copy" style={{ marginTop: 8 }}>
                    Mid-bowl sections usually balance stage visibility with less stair load than upper rows.
                  </p>
                </article>
                <article className="comic-panel">
                  <div className="comic-tag">Maximum View</div>
                  <p className="comic-copy" style={{ marginTop: 8 }}>
                    Upper seating offers wide scenic views but requires higher stair effort and more pacing buffer.
                  </p>
                </article>
                <article className="comic-panel">
                  <div className="comic-tag">Faster Exit Priority</div>
                  <p className="comic-copy" style={{ marginTop: 8 }}>
                    If exit speed matters, pair seat choice with a pre-defined pickup plan before encore.
                  </p>
                </article>
                <article className="comic-panel">
                  <div className="comic-tag">Lower Mobility Strain</div>
                  <p className="comic-copy" style={{ marginTop: 8 }}>
                    Choose rows that reduce repeated climbing and add extra transition time between entry and set start.
                  </p>
                </article>
              </div>
            </section>

            <section className="comic-panel" style={{ marginTop: 16 }}>
              <div className="comic-tag">Map + Seating Navigation</div>
              <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                <Link href="/red-rocks/map" className="comic-btn comic-btn-secondary">
                  Interactive Map
                </Link>
                <Link href="/red-rocks/map/seating-chart" className="comic-btn comic-btn-secondary">
                  Seating Marker
                </Link>
                <Link href="/red-rocks/map/best-seats" className="comic-btn comic-btn-secondary">
                  Best Seats Marker
                </Link>
                <Link href="/red-rocks/best-time-to-arrive" className="comic-btn comic-btn-secondary">
                  Best Time to Arrive
                </Link>
                <Link href="/red-rocks/parking" className="comic-btn comic-btn-secondary">
                  Parking Strategy
                </Link>
              </div>
            </section>

            <section className="comic-panel" style={{ marginTop: 16 }}>
              <div className="comic-tag">Arrival &amp; Egress Strategy</div>
              <p className="comic-copy" style={{ marginTop: 8 }}>
                Seating choice is operational, not just visual. Higher rows need more stair buffer, and late arrival magnifies crowd friction.
                Lock a post-show meetup point before the headliner, especially if your group sits in split zones.
              </p>
              <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                <Link href="/red-rocks/transportation/post-show-pickup" className="comic-btn comic-btn-secondary">
                  Post-Show Pickup Plan
                </Link>
                <Link href="/red-rocks/transportation" className="comic-btn comic-btn-secondary">
                  Transportation Guide
                </Link>
                <Link
                  href={buildBookingHref({ target: "book", venue: "red-rocks-amphitheatre", searchParams: sp })}
                  className="comic-btn comic-btn-primary"
                >
                  Book a Ride
                </Link>
              </div>
            </section>
          </>
        ) : null}

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Query Intents This Page Targets</div>
          <ul style={{ marginTop: 10, paddingLeft: 18 }}>
            {page.queryIntents.map((query) => (
              <li key={query} className="comic-copy">
                {query}
              </li>
            ))}
          </ul>
        </section>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Reference Links</div>
          <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
            {page.referenceLinks.parentTopic ? (
              <Link href={page.referenceLinks.parentTopic} className="comic-btn comic-btn-secondary">
                Parent Topic
              </Link>
            ) : null}
            {page.referenceLinks.siblingPages.map((href) => {
              const label = href.replace("/red-rocks/", "").replaceAll("-", " ");
              return (
                <Link key={`sibling-${href}`} href={href} className="comic-btn comic-btn-secondary">
                  {label}
                </Link>
              );
            })}
            <Link href={page.referenceLinks.actionPage} className="comic-btn comic-btn-primary">
              Book a Ride
            </Link>
          </div>
        </section>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Related Entities</div>
          <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
            {page.referenceLinks.relatedEntities.map((href) => {
              const label = href.replace("/red-rocks/", "").replaceAll("-", " ");
              return (
                <Link key={href} href={href} className="comic-btn comic-btn-secondary">
                  {label}
                </Link>
              );
            })}
            <Link
              href={buildBookingHref({ target: "book", venue: "red-rocks-amphitheatre", searchParams: sp })}
              className="comic-btn comic-btn-primary"
            >
              Compare Ride Options
            </Link>
          </div>
        </section>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Reference Graph</div>
          <div style={{ marginTop: 10 }}>
            <p className="comic-copy">Red Rocks Topics</p>
            <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
              {TOPIC_GRAPH_LINKS.map((item) => (
                <Link key={item.href} href={item.href} className="comic-btn comic-btn-secondary">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <p className="comic-copy">Related Guides</p>
            <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Link href="/red-rocks/how-to-get-to-red-rocks" className="comic-btn comic-btn-secondary">
                How To Get To Red Rocks
              </Link>
              <Link href="/red-rocks/red-rocks-shuttle" className="comic-btn comic-btn-secondary">
                Red Rocks Shuttle Guide
              </Link>
              <Link href="/red-rocks/parking" className="comic-btn comic-btn-secondary">
                Red Rocks Parking Strategy
              </Link>
              <Link href="/red-rocks/transportation/post-show-pickup" className="comic-btn comic-btn-secondary">
                Post-Show Pickup Plan
              </Link>
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <p className="comic-copy">Explore Red Rocks Locations</p>
            <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
              {RED_ROCKS_MAP_POINTS.slice(0, 8).map((point) => (
                <Link key={point.id} href={`/red-rocks/map/${encodeURIComponent(point.id)}`} className="comic-btn comic-btn-secondary">
                  {point.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
