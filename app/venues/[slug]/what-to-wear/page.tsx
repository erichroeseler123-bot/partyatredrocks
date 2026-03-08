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
    title: `What to Wear at ${name} | Concert Outfit Guide 2026`,
    description: `What to wear to ${name} concerts in 2026. Layering, footwear, weather backup, and post-show ride readiness tips.`,
    alternates: { canonical: `${SITE}/venues/${slug}/what-to-wear` },
  };
}

export default async function VenueWhatToWearPage({
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
          <h1 className="comic-title">What to Wear at {name}</h1>
          <p className="comic-copy">
            Dress for movement, entry lines, and post-show weather shifts. Practical layering makes exits and pickups easier.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 mt-6 w-full px-4">
            <Link href={`/find?venue=${encodeURIComponent(slug)}&qty=2`} className="comic-btn comic-btn-primary w-full sm:w-auto min-w-[200px] text-center">
              Find a Ride
            </Link>
            <Link href={`/venues/${encodeURIComponent(slug)}/best-time-to-arrive`} className="comic-btn comic-btn-secondary w-full sm:w-auto min-w-[200px] text-center">
              Best Time to Arrive
            </Link>
            <Link href={`/venues/${encodeURIComponent(slug)}/transportation`} className="comic-btn comic-btn-secondary w-full sm:w-auto min-w-[200px] text-center">
              Transportation Guide
            </Link>
          </div>
        </div>

        <div className="comic-grid" style={{ marginTop: 32 }}>
          <article className="comic-panel">
            <div className="comic-tag">Layers</div>
            <ul className="comic-copy mt-4 space-y-3 list-disc pl-6">
              <li>Breathable base layer for entry and crowd heat.</li>
              <li>Mid-layer for post-sunset cooling.</li>
              <li>Light shell for wind or short precipitation.</li>
            </ul>
          </article>

          <article className="comic-panel">
            <div className="comic-tag">Footwear</div>
            <p className="comic-copy mt-4">
              Stable shoes with grip outperform fashion-first choices in lines, stairs, and post-show curb navigation.
            </p>
          </article>

          <article className="comic-panel">
            <div className="comic-tag">Carry Essentials</div>
            <ul className="comic-copy mt-4 space-y-3 list-disc pl-6">
              <li>Compact shell or layer for late-night temperature shift.</li>
              <li>Phone charged before doors for meetup coordination.</li>
              <li>Pickup plan set before encore.</li>
            </ul>
          </article>
        </div>
      </section>
    </main>
  );
}
