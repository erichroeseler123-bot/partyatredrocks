import Link from "next/link";
import { getMediaIndex } from "@/lib/media/getMediaIndex";
import { selectImageByPriority } from "@/lib/media/selectImage";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

export const metadata = {
  title: "Ball Arena Map | Denver Venue Layout 2026",
  description:
    "Ball Arena map showing stage, seating sections, entrances, parking, and transit for Denver shows.",
  alternates: { canonical: `${SITE}/venues/ball-arena/map` },
};

export default async function BallArenaMap() {
  const media = await getMediaIndex(2026);
  const mapImage = selectImageByPriority({
    spotifyImage: media?.venuesById?.["ball-arena"]?.sources?.spotifyImage ?? null,
    ticketmasterImage: media?.venuesById?.["ball-arena"]?.sources?.ticketmasterImage ?? null,
    seatgeekImage: media?.venuesById?.["ball-arena"]?.sources?.seatgeekImage ?? null,
    localAsset: media?.venuesById?.["ball-arena"]?.sources?.localAsset ?? null,
    fallback: "/images/venues/ball-arena-map.jpg",
  });

  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <div className="comic-hero">
          <div className="comic-kicker">Denver Venue Guide</div>
          <h1 className="comic-title">Ball Arena Map</h1>
          <p className="comic-copy">
            Large arena layout with seating sections, entrances, parking, and transit points for 2026 shows.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 mt-6 w-full px-4">
            <Link href="/find?venue=ball-arena&qty=2" className="comic-btn comic-btn-primary w-full sm:w-auto min-w-[200px] text-center">
              Book Shuttle - Easy Arrival
            </Link>
            <Link href="/venues/ball-arena/best-time-to-arrive" className="comic-btn comic-btn-secondary w-full sm:w-auto min-w-[200px] text-center">
              Best Time to Arrive
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center">
          <img
            src={mapImage}
            alt="Ball Arena Denver venue map showing stage, seating sections, entrances, parking, and transit"
            width={800}
            height={600}
            loading="lazy"
            decoding="async"
            className="max-w-full rounded-xl border border-white/20 mx-auto"
          />
          <p className="comic-copy mt-4 opacity-80">
            General venue layout (not event-specific). Check official site for show-day changes.
          </p>
        </div>

        <section className="comic-panel mt-8">
          <div className="comic-tag">Key Locations</div>
          <ul className="comic-copy mt-4 space-y-3 list-disc pl-6">
            <li><strong>Main Entrances</strong> - Multiple gates for quick entry on big shows.</li>
            <li><strong>Seating Sections</strong> - Lower bowl, upper bowl, and club levels.</li>
            <li><strong>Parking</strong> - Large venue lots with event-night pricing.</li>
            <li><strong>Rideshare Pickup</strong> - Designated zones near exits.</li>
            <li><strong>Transit</strong> - Limited RTD options compared with downtown venues.</li>
          </ul>
        </section>

        <section className="comic-panel mt-8">
          <div className="comic-tag">Related Ball Arena Guides</div>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 mt-4 justify-center">
            <Link href="/venues/ball-arena/best-time-to-arrive" className="comic-btn comic-btn-secondary">Best Time to Arrive</Link>
            <Link href="/venues/ball-arena/parking" className="comic-btn comic-btn-secondary">Parking</Link>
            <Link href="/venues/ball-arena/transportation" className="comic-btn comic-btn-secondary">Transportation</Link>
          </div>
        </section>
      </section>
    </main>
  );
}
