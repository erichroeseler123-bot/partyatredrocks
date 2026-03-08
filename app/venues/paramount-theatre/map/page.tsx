import Link from "next/link";
import { getMediaIndex } from "@/lib/media/getMediaIndex";
import { selectImageByPriority } from "@/lib/media/selectImage";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

export const metadata = {
  title: "Paramount Theatre Map | Denver Venue Layout 2026",
  description:
    "Paramount Theatre map showing stage orientation, GA areas, entry points, bars, and nearby pickup guidance.",
  alternates: { canonical: `${SITE}/venues/paramount-theatre/map` },
};

export default async function ParamountMapPage() {
  const media = await getMediaIndex(2026);
  const mapImage = selectImageByPriority({
    spotifyImage: media?.venuesById?.["paramount-theatre"]?.sources?.spotifyImage ?? null,
    ticketmasterImage: media?.venuesById?.["paramount-theatre"]?.sources?.ticketmasterImage ?? null,
    seatgeekImage: media?.venuesById?.["paramount-theatre"]?.sources?.seatgeekImage ?? null,
    localAsset: media?.venuesById?.["paramount-theatre"]?.sources?.localAsset ?? null,
    fallback: "/images/venues/paramount-theatre-map.jpg",
  });
  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <div className="comic-hero">
          <div className="comic-kicker">Denver Venue Guide</div>
          <h1 className="comic-title">Paramount Theatre Map</h1>
          <p className="comic-copy">Use this layout reference to plan entry flow, in-venue movement, and post-show meetup points.</p>
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 mt-6 w-full px-4">
            <Link href="/find?venue=paramount-theatre&qty=2" className="comic-btn comic-btn-primary w-full sm:w-auto min-w-[200px] text-center">
              Book Shuttle - Easy Exit Plan
            </Link>
            <Link href="/venues/paramount-theatre/best-time-to-arrive" className="comic-btn comic-btn-secondary w-full sm:w-auto min-w-[200px] text-center">
              Best Time to Arrive
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center">
          <img
            src={mapImage}
            alt="Paramount Theatre map showing stage orientation, entry points, bars, and pickup guidance"
            width={800}
            height={600}
            loading="lazy"
            decoding="async"
            className="max-w-full rounded-xl border border-white/20 mx-auto"
          />
          <p className="comic-copy mt-4 opacity-80">General layout reference only. Check event-specific instructions on your ticket details.</p>
        </div>

        <section className="comic-panel mt-8">
          <div className="comic-tag">Key Locations</div>
          <ul className="comic-copy mt-4 space-y-3 list-disc pl-6">
            <li>
              <strong>Main Entrance</strong> - downtown Denver front door with security and ticket scan queue.
            </li>
            <li>
              <strong>GA Floor</strong> - Standing room with early-entry advantage near stage.
            </li>
            <li>
              <strong>Bars</strong> - Core crowd points pre-headliner and between sets.
            </li>
            <li>
              <strong>Post-Show Pickup Blocks</strong> - Side-street meetups reduce curb congestion.
            </li>
          </ul>
        </section>

        <section className="comic-panel mt-8">
          <div className="comic-tag">Related Paramount Guides</div>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 mt-4 justify-center">
            <Link href="/venues/paramount-theatre/best-time-to-arrive" className="comic-btn comic-btn-secondary">Best Time to Arrive</Link>
            <Link href="/venues/paramount-theatre/parking" className="comic-btn comic-btn-secondary">Parking</Link>
            <Link href="/venues/paramount-theatre/transportation" className="comic-btn comic-btn-secondary">Transportation</Link>
          </div>
        </section>
      </section>
    </main>
  );
}
