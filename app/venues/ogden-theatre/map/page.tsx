import Link from "next/link";
import { UnsplashImg } from "@/components/UnsplashImg";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

export const metadata = {
  title: "Ogden Theatre Map | Denver Venue Layout 2026",
  description:
    "Ogden Theatre map guidance showing entry flow, GA floor and balcony context, pickup logic, and nearby parking/transit notes.",
  alternates: { canonical: `${SITE}/venues/ogden-theatre/map` },
};

export default function OgdenMapPage() {
  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <div className="comic-hero">
          <div className="comic-kicker">Denver Venue Guide</div>
          <h1 className="comic-title">Ogden Theatre Map</h1>
          <p className="comic-copy">
            Quick map-first context for entry, floor movement, balcony positioning, and post-show pickup planning.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 mt-6 w-full px-4">
            <Link href="/find?venue=ogden-theatre&qty=2" className="comic-btn comic-btn-primary w-full sm:w-auto min-w-[200px] text-center">
              Book Shuttle - Easy Arrival
            </Link>
            <Link href="/venues/ogden-theatre/best-time-to-arrive" className="comic-btn comic-btn-secondary w-full sm:w-auto min-w-[200px] text-center">
              Best Time to Arrive
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center">
          <UnsplashImg
            src="/images/venues/fallback.jpg"
            query="ogden theatre denver venue map layout"
            alt="Ogden Theatre Denver venue map showing entry flow, floor and balcony zones, and nearby pickup context"
            width={800}
            height={600}
            loading="lazy"
            decoding="async"
            className="max-w-full rounded-xl border border-white/20 mx-auto"
          />
          <p className="comic-copy mt-4 opacity-80">
            General layout reference, not event-specific.
          </p>
        </div>

        <section className="comic-panel mt-8">
          <div className="comic-tag">Key Locations</div>
          <ul className="comic-copy mt-4 space-y-3 list-disc pl-6">
            <li><strong>Main Entrance:</strong> East Colfax front flow for scan and security.</li>
            <li><strong>GA Floor:</strong> early arrival improves positioning and sightlines.</li>
            <li><strong>Balcony:</strong> limited seating and higher demand on sold nights.</li>
            <li><strong>Pickup Strategy:</strong> use pre-agreed side-street meetup points.</li>
          </ul>
        </section>

        <section className="comic-panel mt-8">
          <div className="comic-tag">Related Ogden Guides</div>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 mt-4 justify-center">
            <Link href="/venues/ogden-theatre/best-time-to-arrive" className="comic-btn comic-btn-secondary">Best Time to Arrive</Link>
            <Link href="/venues/ogden-theatre/parking" className="comic-btn comic-btn-secondary">Parking</Link>
            <Link href="/venues/ogden-theatre/transportation" className="comic-btn comic-btn-secondary">Transportation</Link>
          </div>
        </section>
      </section>
    </main>
  );
}
