import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import venuesJson from "@/data/venues.json";

type VenueRec = {
  name?: string;
  city?: string;
  state?: string;

  // your data may use either style
  seatgeekSlug?: string;
  seatgeek_slug?: string;

  seatgeekId?: string;
  seatgeek_id?: string;

  neighborhood?: string;
  loc?: string;
};

const VENUES = venuesJson as Record<string, VenueRec>;

function getVenue(slug: string) {
  const v = VENUES[slug];
  if (!v) return null;

  const name = v.name ?? slug.replace(/-/g, " ");
  const city = v.city ?? "Denver";
  const state = v.state ?? "CO";
  const loc = v.neighborhood ?? v.loc ?? "";

  const seatgeekSlug = v.seatgeekSlug ?? (v as any).seatgeek_slug;
  const seatgeekId = v.seatgeekId ?? (v as any).seatgeek_id;

  return { slug, name, city, state, loc, seatgeekSlug, seatgeekId };
}

export const dynamic = "force-static";

export function generateStaticParams() {
  return Object.keys(VENUES).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const v = getVenue(slug);
  if (!v) return {};

  return {
    title: `${v.name} Shuttle + Pickup Plan`,
    description: `Professional transport and post-show waiting service for ${v.name}. Fixed pricing, pro drivers, and guaranteed post-show return.`,
    alternates: { canonical: `/venues/${slug}` },
    openGraph: {
      title: `${v.name} Shuttle + Pickup Plan`,
      description: `Pickup strategy, timing, and ride options for ${v.name}.`,
      url: `/venues/${slug}`,
    },
  };
}

export default async function VenuePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const v = getVenue(slug);
  if (!v) return notFound();

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8 shadow-[0_22px_70px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-white/80">
              Venue Intel
              {v.loc ? <span className="text-white/60">• {v.loc}</span> : null}
            </div>
            <h1 className="mt-4 text-3xl md:text-5xl font-black tracking-tight">
              {v.name}
            </h1>
            <p className="mt-3 text-white/70">
              {v.city}, {v.state} • Pickup timing, routing, and post-show return strategy.
            </p>

            {(v.seatgeekSlug || v.seatgeekId) ? (
              <p className="mt-2 text-xs text-white/45">
                Data keys: {v.seatgeekSlug ? `seatgeekSlug=${v.seatgeekSlug}` : null}
                {v.seatgeekSlug && v.seatgeekId ? " • " : null}
                {v.seatgeekId ? `seatgeekId=${v.seatgeekId}` : null}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/shuttles/all-venue"
              className="inline-flex items-center justify-center rounded-full border border-white/14 bg-white/5 px-6 py-3 text-[12px] font-black uppercase tracking-[0.22em] text-white/90 transition hover:bg-white/10"
            >
              All-Venue Shuttle
            </Link>
            <Link
              href="/book-all-venue"
              className="inline-flex items-center justify-center rounded-full bg-neon-blue px-6 py-3 text-[12px] font-black uppercase tracking-[0.22em] text-black transition hover:bg-white"
            >
              Book Now
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6">
            <div className="text-[11px] font-black uppercase tracking-[0.22em] text-white/60">
              Pickup Strategy
            </div>
            <p className="mt-3 text-sm text-white/75">
              Recommended pickup windows + where to stage so you’re not stuck in surge traffic after the show.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6">
            <div className="text-[11px] font-black uppercase tracking-[0.22em] text-white/60">
              Return Plan
            </div>
            <p className="mt-3 text-sm text-white/75">
              Post-show waiting + a clean meet-up protocol so your group gets out fast.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6">
            <div className="text-[11px] font-black uppercase tracking-[0.22em] text-white/60">
              Schedule & Intel
            </div>
            <p className="mt-3 text-sm text-white/75">
              Next step: wire events here from SeatGeek/TM via your existing <code className="text-white/80">lib/seatgeek.ts</code> or the Worker.
            </p>
            <Link
              href="/other-venues"
              className="mt-4 inline-flex text-sm font-bold text-white/80 hover:text-white"
            >
              Browse other venues →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
