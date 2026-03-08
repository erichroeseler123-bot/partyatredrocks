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
    title: `${name} Transportation Guide | Shuttle vs Rideshare 2026`,
    description: `How to get to ${name}. Compare shuttle, rideshare, driving, and transit with a practical post-show exit strategy.`,
    alternates: { canonical: `${SITE}/venues/${slug}/transportation` },
  };
}

export default async function VenueTransportationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: rawSlug } = await params;
  const slug = normSlug(rawSlug);
  const venue = getVenue(slug);
  if (!venue) return notFound();

  const name = venueName(slug, venue);

  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <div className="comic-hero">
          <div className="comic-kicker">Venue Operations</div>
          <h1 className="comic-title">{name} Transportation Guide</h1>
          <p className="comic-copy">
            Compare transport options and set a pre-planned exit protocol so your group avoids post-show uncertainty.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 mt-6 w-full px-4">
            <Link href={`/find?venue=${encodeURIComponent(slug)}&qty=2`} className="comic-btn comic-btn-primary w-full sm:w-auto min-w-[200px] text-center">
              Book Shuttle - Predictable Return
            </Link>
            <Link href={`/venues/${encodeURIComponent(slug)}/best-time-to-arrive`} className="comic-btn comic-btn-secondary w-full sm:w-auto min-w-[200px] text-center">
              Best Time to Arrive
            </Link>
            <Link href={`/venues/${encodeURIComponent(slug)}/what-to-wear`} className="comic-btn comic-btn-secondary w-full sm:w-auto min-w-[200px] text-center">
              What to Wear
            </Link>
          </div>
        </div>

        <div className="comic-grid" style={{ marginTop: 32 }}>
          <article className="comic-panel">
            <div className="comic-tag">Shuttle (Recommended)</div>
            <p className="comic-copy mt-4">Fixed pricing, clear meetup instructions, and cleaner group exits after show close.</p>
            <p className="comic-copy mt-4 font-semibold">Best for: Groups and reliability.</p>
          </article>

          <article className="comic-panel">
            <div className="comic-tag">Uber / Lyft</div>
            <p className="comic-copy mt-4">Convenient outbound, but curb demand and surge can spike after encore.</p>
            <p className="comic-copy mt-4">Best for: Small groups with flexible timing.</p>
          </article>

          <article className="comic-panel">
            <div className="comic-tag">Driving</div>
            <p className="comic-copy mt-4">Works best with a pre-selected lot and realistic post-show egress expectations.</p>
            <p className="comic-copy mt-4">Best for: Schedule control.</p>
          </article>

          <article className="comic-panel">
            <div className="comic-tag">Transit</div>
            <p className="comic-copy mt-4">Transit can reduce parking friction on many nights when schedules align with show timing.</p>
            <p className="comic-copy mt-4">Best for: Car-free trips.</p>
          </article>
        </div>
      </section>
    </main>
  );
}
