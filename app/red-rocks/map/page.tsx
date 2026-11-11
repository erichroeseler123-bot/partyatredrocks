import Image from "next/image";
import Link from "next/link";
import RedRocksInteractiveMap from "@/components/redrocks/RedRocksInteractiveMap";
import { RED_ROCKS_MAP_POINTS } from "@/lib/redRocksAuthority";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";
const MAP_OVERVIEW_IMAGE = "/images/red-rocks/red-rocks-amphitheater-from-top.jpg";

export const metadata = {
  title: "Red Rocks Interactive Map | Trails, Seating, Parking, Shuttle",
  description:
    "Interactive Red Rocks map with layered views for trails, seating zones, geology features, parking lots, and shuttle pickup points.",
  alternates: { canonical: "/red-rocks/map" },
  openGraph: {
    title: "Red Rocks Interactive Map | Trails, Seating, Parking, Shuttle",
    description:
      "Interactive Red Rocks map with layered views for trails, seating zones, geology features, parking lots, and private pickup points.",
    url: `${SITE}/red-rocks/map`,
    type: "article",
    images: [
      {
        url: `${SITE}${MAP_OVERVIEW_IMAGE}`,
        alt: "Top-plaza overlook view down Red Rocks Amphitheatre rows toward Ship Rock, Creation Rock, and the Denver basin",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Red Rocks Interactive Map | Trails, Seating, Parking, Shuttle",
    description:
      "Interactive Red Rocks map with layered views for trails, seating zones, geology features, parking lots, and private pickup points.",
    images: [`${SITE}${MAP_OVERVIEW_IMAGE}`],
  },
};

export default function RedRocksMapPage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Red Rocks", item: `${SITE}/red-rocks` },
      { "@type": "ListItem", position: 3, name: "Interactive Map", item: `${SITE}/red-rocks/map` },
    ],
  };

  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

        <div className="comic-hero">
          <div className="comic-kicker">Visual Knowledge Layer</div>
          <h1 className="comic-title">Red Rocks Interactive Map</h1>
          <p className="comic-copy">
            Explore core Red Rocks planning layers in one map: trails, seating, geology formations, parking strategy, and shuttle pickup zones.
          </p>
          <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link className="comic-btn comic-btn-secondary" href="/red-rocks">
              Red Rocks Hub
            </Link>
            <Link className="comic-btn comic-btn-secondary" href="/red-rocks/transportation">
              Transportation
            </Link>
            <Link className="comic-btn comic-btn-primary" href="/book?venue=red-rocks-amphitheatre">
              Book Ride
            </Link>
          </div>
        </div>

        <section className="comic-panel overflow-hidden" style={{ marginTop: 16, marginBottom: 16 }}>
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/15">
              <Image
                src={MAP_OVERVIEW_IMAGE}
                alt="Top-plaza overlook view down Red Rocks Amphitheatre rows toward Ship Rock, Creation Rock, and the Denver basin"
                fill
                unoptimized
                priority
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="space-y-4">
              <div className="comic-tag">Elevation & Lot Orientation</div>
              <h2 className="comic-h3">Read the elevation before choosing your lot</h2>
              <ul className="comic-copy space-y-3 list-disc pl-5">
                <li>
                  <strong>Upper North / Top Circle (Row 70 Level):</strong> Highest elevation access directly behind the top concourse where private Suburbans and 10-passenger vans stage — minimal stairs into the bowl.
                </li>
                <li>
                  <strong>Upper South &amp; Trading Post Corridor:</strong> Mid-elevation lot and ramp path near the historic Trading Post and south gates.
                </li>
                <li>
                  <strong>Lower North &amp; Lower South Lots:</strong> Fastest post-show highway exit toward Morrison Rd and C-470, paired with the steepest uphill climb to the seating bowl.
                </li>
              </ul>
            </div>
          </div>
        </section>

        <RedRocksInteractiveMap points={RED_ROCKS_MAP_POINTS} />

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Explore Red Rocks Locations</div>
          <div className="comic-grid" style={{ marginTop: 10 }}>
            {RED_ROCKS_MAP_POINTS.map((point) => (
              <Link key={point.id} href={`/red-rocks/map/${encodeURIComponent(point.id)}`} className="comic-panel block">
                <div className="comic-tag">{point.layer}</div>
                <h2 className="comic-h3" style={{ marginTop: 8 }}>
                  {point.name}
                </h2>
                <p className="comic-copy">{point.blurb}</p>
              </Link>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
