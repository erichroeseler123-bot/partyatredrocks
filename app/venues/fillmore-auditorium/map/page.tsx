import Link from "next/link";
import { UnsplashImg } from "@/components/UnsplashImg";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

export const metadata = {
  title: "Fillmore Auditorium Map | Denver Venue Layout 2026",
  description:
    "Fillmore Auditorium map showing stage, GA floor, balcony, bars, entrances, and nearby parking or transit for Denver shows.",
  alternates: { canonical: `${SITE}/venues/fillmore-auditorium/map` },
};

export default function FillmoreMap() {
  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <div className="comic-hero">
          <div className="comic-kicker">Denver Venue Guide</div>
          <h1 className="comic-title">Fillmore Auditorium Map</h1>
          <p className="comic-copy">
            Classic Denver venue layout - GA floor, balcony, bars, entrances, and nearby parking or transit points.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 mt-6 w-full px-4">
            <Link href="/find?venue=fillmore-auditorium&qty=2" className="comic-btn comic-btn-primary w-full sm:w-auto min-w-[200px] text-center">
              Book Shuttle - Easy Arrival
            </Link>
            <Link href="/venues/fillmore-auditorium/best-time-to-arrive" className="comic-btn comic-btn-secondary w-full sm:w-auto min-w-[200px] text-center">
              Best Time to Arrive
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center">
          <UnsplashImg
            src="/images/venues/fillmore-auditorium-map.jpg"
            query="fillmore auditorium denver venue map layout"
            alt="Fillmore Auditorium Denver venue map showing stage, GA floor, balcony seating, bars, entrances, and nearby parking"
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
            <li>
              <strong>Main Entrance</strong> - 1510 Clarkson St (front, ticket scan and security).
            </li>
            <li>
              <strong>GA Floor</strong> - Standing room, stage-front access benefits from early arrival.
            </li>
            <li>
              <strong>Balcony</strong> - Limited seating, stairs from main floor.
            </li>
            <li>
              <strong>Bars</strong> - Multiple full bars throughout the venue.
            </li>
            <li>
              <strong>Preferred Parking</strong> - Nearby lots (add-on or on-site depending on show).
            </li>
            <li>
              <strong>Rideshare Pickup</strong> - Side streets are usually cleaner than front-door curb.
            </li>
          </ul>
        </section>

        <section className="comic-panel mt-8">
          <div className="comic-tag">Related Fillmore Guides</div>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 mt-4 justify-center">
            <Link href="/venues/fillmore-auditorium/best-time-to-arrive" className="comic-btn comic-btn-secondary">
              Best Time to Arrive
            </Link>
            <Link href="/venues/fillmore-auditorium/parking" className="comic-btn comic-btn-secondary">
              Parking
            </Link>
            <Link href="/venues/fillmore-auditorium/transportation" className="comic-btn comic-btn-secondary">
              Transportation
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
