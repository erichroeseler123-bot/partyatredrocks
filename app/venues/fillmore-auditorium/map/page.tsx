import Link from "next/link";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

export const metadata = {
  title: "Fillmore Auditorium Map | Denver Venue Layout 2026",
  description:
    "Fillmore Auditorium map overview with stage flow, entry points, bars, and nearby pickup and parking guidance for Denver shows.",
  alternates: { canonical: `${SITE}/venues/fillmore-auditorium/map` },
};

export default function FillmoreMapPage() {
  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <div className="comic-hero">
          <div className="comic-kicker">Denver Venue Guide</div>
          <h1 className="comic-title">Fillmore Auditorium Map</h1>
          <p className="comic-copy">
            Use this layout overview to plan entry flow, in-venue movement, and your post-show meetup.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 mt-6 w-full px-4">
            <Link href="/find?venue=fillmore-auditorium&qty=2" className="comic-btn comic-btn-primary w-full sm:w-auto min-w-[200px] text-center">
              Book Shuttle - Easy Exit Plan
            </Link>
            <Link href="/venues/fillmore-auditorium/best-time-to-arrive" className="comic-btn comic-btn-secondary w-full sm:w-auto min-w-[200px] text-center">
              Best Time to Arrive
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center">
          <img
            src="/images/venues/fillmore-auditorium-map.jpg"
            alt="Fillmore Auditorium Denver map showing entry flow, stage orientation, bars, and nearby pickup guidance"
            width={800}
            height={600}
            loading="lazy"
            decoding="async"
            className="max-w-full rounded-xl border border-white/20 mx-auto"
          />
          <p className="comic-copy mt-4 opacity-80">General layout reference only. Verify event-specific instructions on your ticket details.</p>
        </div>

        <section className="comic-panel mt-8">
          <div className="comic-tag">Key Locations</div>
          <ul className="comic-copy mt-4 space-y-3 list-disc pl-6">
            <li>
              <strong>Main Entry</strong> - East Colfax side flow with security and ticket scan queues.
            </li>
            <li>
              <strong>Floor and Balcony Zones</strong> - Traffic concentrates near stage approaches during support set transitions.
            </li>
            <li>
              <strong>Bar Areas</strong> - High-volume points before headliner start and during main breaks.
            </li>
            <li>
              <strong>Post-Show Pickup Blocks</strong> - Use pre-planned side-street meetup instructions to avoid curb compression.
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
