import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import venuesJson from "@/data/venues.json";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

type VenueRec = {
  name?: string;
  city?: string;
  state?: string;
};

function normSlug(s: string) {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

function getVenue(slug: string): VenueRec | null {
  const v = (venuesJson as Record<string, VenueRec>)[slug];
  return v ?? null;
}

function venueName(slug: string, v: VenueRec | null) {
  return v?.name ?? slug.replace(/-/g, " ");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = normSlug(rawSlug);
  const venue = getVenue(slug);
  if (!venue) return {};
  const name = venueName(slug, venue);

  return {
    title: `Best Time to Arrive at ${name} | Concert Timing Guide 2026`,
    description: `When to arrive at ${name} for 2026 shows. Practical arrival windows, parking buffer guidance, and post-show meetup planning.`,
    alternates: { canonical: `${SITE}/venues/${slug}/best-time-to-arrive` },
  };
}

export default async function VenueBestTimeToArrivePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: rawSlug } = await params;
  const slug = normSlug(rawSlug);
  const venue = getVenue(slug);
  if (!venue) return notFound();

  const name = venueName(slug, venue);
  const city = venue.city ?? "Denver";

  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <div className="comic-hero">
          <div className="comic-kicker">Venue Operations</div>
          <h1 className="comic-title">Best Time to Arrive at {name}</h1>
          <p className="comic-copy">
            Arrival windows at {name} can tighten quickly around doors. Use this baseline guide to reduce parking friction and avoid late entry stress in {city}.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 mt-6 w-full px-4">
            <Link href={`/find?venue=${encodeURIComponent(slug)}&qty=2`} className="comic-btn comic-btn-primary w-full sm:w-auto min-w-[200px] text-center">
              Book Shuttle
            </Link>
            <Link href={`/venues/${encodeURIComponent(slug)}/transportation`} className="comic-btn comic-btn-secondary w-full sm:w-auto min-w-[200px] text-center">
              Transportation Guide
            </Link>
            <Link href={`/venues/${encodeURIComponent(slug)}/what-to-wear`} className="comic-btn comic-btn-secondary w-full sm:w-auto min-w-[200px] text-center">
              What to Wear
            </Link>
          </div>
        </div>

        <div className="comic-grid" style={{ marginTop: 32 }}>
          <article className="comic-panel">
            <div className="comic-tag">General Rule</div>
            <h2 className="comic-h3" style={{ marginTop: 12 }}>
              Arrive 60-90 minutes before doors
            </h2>
            <p className="comic-copy" style={{ marginTop: 8 }}>
              Build additional buffer on sold-out nights for security line movement, parking search time, and venue ingress bottlenecks.
            </p>
          </article>

          <article className="comic-panel">
            <div className="comic-tag">Ticket Type Buffer</div>
            <ul className="comic-copy mt-4 space-y-3 list-disc pl-6">
              <li>
                <strong>GA floors:</strong> 75-90 minutes before doors.
              </li>
              <li>
                <strong>Reserved seating:</strong> 45-60 minutes before doors.
              </li>
              <li>
                <strong>Shuttle/rideshare:</strong> target drop-off 60-75 minutes before doors.
              </li>
            </ul>
          </article>

          <article className="comic-panel">
            <div className="comic-tag">Post-Show Exit</div>
            <p className="comic-copy mt-4">
              Set your pickup block before encore. The highest failure pattern is deciding transportation only after final song close.
            </p>
            <div style={{ marginTop: 16 }}>
              <Link href={`/find?venue=${encodeURIComponent(slug)}&qty=2`} className="comic-btn comic-btn-primary w-full text-center">
                Book Return Ride
              </Link>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
