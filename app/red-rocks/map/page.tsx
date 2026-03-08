import Link from "next/link";
import RedRocksInteractiveMap from "@/components/redrocks/RedRocksInteractiveMap";
import { RED_ROCKS_MAP_POINTS } from "@/lib/redRocksAuthority";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

export const metadata = {
  title: "Red Rocks Interactive Map | Trails, Seating, Parking, Shuttle",
  description:
    "Interactive Red Rocks map with layered views for trails, seating zones, geology features, parking lots, and shuttle pickup points.",
  alternates: { canonical: "/red-rocks/map" },
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
            <Link className="comic-btn comic-btn-primary" href="/find">
              Book Ride
            </Link>
          </div>
        </div>

        <RedRocksInteractiveMap points={RED_ROCKS_MAP_POINTS} />
      </section>
    </main>
  );
}
