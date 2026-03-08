import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import RedRocksInteractiveMap from "@/components/redrocks/RedRocksInteractiveMap";
import { RED_ROCKS_MAP_POINT_BY_ID, RED_ROCKS_MAP_POINTS } from "@/lib/redRocksAuthority";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";
type Props = { params: Promise<{ slug: string }> };

const LAYER_GUIDANCE: Record<
  (typeof RED_ROCKS_MAP_POINTS)[number]["layer"],
  { pros: string[]; cons: string[]; best: string }
> = {
  trails: {
    pros: ["Clear route context before arrival", "Better pace planning for altitude and stairs"],
    cons: ["Trail effort can be underestimated at show-night pace", "Weather shifts can change comfort quickly"],
    best: "Day visitors combining park exploration with light logistics planning.",
  },
  seating: {
    pros: ["Shows relative stage/seating effort", "Helps set realistic arrival and stair timing"],
    cons: ["Exact row conditions vary by event setup", "Late arrivals increase movement friction"],
    best: "Concert nights where seating movement and pacing matter.",
  },
  geology: {
    pros: ["Adds location context around key formations", "Helps first-time visitors orient quickly"],
    cons: ["Not a replacement for trail signage", "Geology points are context, not navigation instructions"],
    best: "Visitors wanting venue knowledge before event day.",
  },
  parking: {
    pros: ["Clarifies lot strategy before departure", "Supports exit planning before encore"],
    cons: ["Lots fill dynamically by demand", "Real-time conditions can shift by show size and weather"],
    best: "Drivers choosing between arrival convenience and exit speed.",
  },
  shuttle: {
    pros: ["Sets pickup expectations pre-show", "Reduces post-encore decision chaos"],
    cons: ["Requires pre-commitment to meetup logic", "Late changes can add regroup delays"],
    best: "Riders who want predictable return flow after the show.",
  },
};

function layerLabel(layer: (typeof RED_ROCKS_MAP_POINTS)[number]["layer"]) {
  switch (layer) {
    case "trails":
      return "Trails";
    case "seating":
      return "Seating";
    case "geology":
      return "Geology";
    case "parking":
      return "Parking";
    case "shuttle":
      return "Shuttle Pickup";
  }
}

export function generateStaticParams() {
  return RED_ROCKS_MAP_POINTS.map((point) => ({ slug: point.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const point = RED_ROCKS_MAP_POINT_BY_ID.get(slug);
  if (!point) return { title: "Red Rocks Map Location", robots: { index: false, follow: false } };

  return {
    title: `${point.name} | Red Rocks Map Guide`,
    description: `${point.name} on the Red Rocks map: overview, arrival strategy, and transportation links for show-night planning.`,
    alternates: { canonical: `${SITE}/red-rocks/map/${point.id}` },
  };
}

export default async function RedRocksMapLocationPage({ params }: Props) {
  const { slug } = await params;
  const point = RED_ROCKS_MAP_POINT_BY_ID.get(slug);
  if (!point) notFound();

  const guidance = LAYER_GUIDANCE[point.layer];
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Red Rocks", item: `${SITE}/red-rocks` },
      { "@type": "ListItem", position: 3, name: "Map", item: `${SITE}/red-rocks/map` },
      { "@type": "ListItem", position: 4, name: point.name, item: `${SITE}/red-rocks/map/${point.id}` },
    ],
  };

  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
        <div className="comic-hero">
          <div className="comic-kicker">{layerLabel(point.layer)}</div>
          <h1 className="comic-title">{point.name}</h1>
          <p className="comic-copy">{point.blurb}</p>
          <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link href="/red-rocks/map" className="comic-btn comic-btn-secondary">
              Back to Map
            </Link>
            <Link href="/red-rocks/transportation" className="comic-btn comic-btn-secondary">
              Transportation Guide
            </Link>
            <Link href="/red-rocks/parking" className="comic-btn comic-btn-secondary">
              Parking Guide
            </Link>
            <Link href="/find" className="comic-btn comic-btn-primary">
              Find a Ride
            </Link>
          </div>
        </div>

        <RedRocksInteractiveMap points={RED_ROCKS_MAP_POINTS} initialSelectedId={point.id} />

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Pros &amp; Cons</div>
          <div className="comic-grid" style={{ marginTop: 10 }}>
            <article className="comic-panel">
              <div className="comic-tag">Pros</div>
              <ul style={{ marginTop: 10, paddingLeft: 18 }}>
                {guidance.pros.map((row) => (
                  <li key={row} className="comic-copy">
                    {row}
                  </li>
                ))}
              </ul>
            </article>
            <article className="comic-panel">
              <div className="comic-tag">Cons</div>
              <ul style={{ marginTop: 10, paddingLeft: 18 }}>
                {guidance.cons.map((row) => (
                  <li key={row} className="comic-copy">
                    {row}
                  </li>
                ))}
              </ul>
            </article>
          </div>
          <p className="comic-copy" style={{ marginTop: 10 }}>
            Best fit: {guidance.best}
          </p>
        </section>
      </section>
    </main>
  );
}
