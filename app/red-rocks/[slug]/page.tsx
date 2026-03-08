import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { RED_ROCKS_ENTITIES, RED_ROCKS_ENTITY_BY_SLUG } from "@/lib/redRocksAuthority";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";
type Props = { params: Promise<{ slug: string }> };

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
    alternates: { canonical: `/red-rocks/${page.slug}` },
  };
}

export default async function RedRocksAuthorityDetailPage({ params }: Props) {
  const { slug } = await params;
  const page = RED_ROCKS_ENTITY_BY_SLUG.get(slug);
  if (!page) notFound();

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
            <Link className="comic-btn comic-btn-primary" href="/find">
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
              Find a Ride
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
            <Link href="/find" className="comic-btn comic-btn-primary">
              Compare Ride Options
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
