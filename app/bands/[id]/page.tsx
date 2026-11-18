import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import {
  getDenverDateKey,
  getMultiYearArtistsCatalog,
  getMultiYearEventsCatalog,
} from "@/lib/events/getCatalog";
import {
  evaluateBandPageDisposition,
  isParrServedVenue,
} from "@/lib/seo/indexationGate";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function resolveBandContext(rawId: string) {
  const cleanId = decodeURIComponent(rawId).trim();
  const [artists, events] = await Promise.all([
    getMultiYearArtistsCatalog({ scope: "all" }),
    getMultiYearEventsCatalog({ scope: "all" }),
  ]);
  const matched =
    artists.find((a) => a.id === cleanId) ??
    artists.find((a) => slugify(a.name) === cleanId.replace(/^artist-/, ""));

  if (!matched) return null;

  const artistSlug = slugify(matched.name);
  const todayDenverKey = getDenverDateKey();
  const artistEvents = events.filter(
    (ev) =>
      ev.artists.includes(matched.id) ||
      ev.artistNames.some((n) => slugify(n) === artistSlug)
  );

  const upcomingRedRocksCount = artistEvents.filter(
    (ev) => ev.venueId === "red-rocks-amphitheatre" && ev.dateKey >= todayDenverKey
  ).length;
  const historicalRedRocksCount = artistEvents.filter(
    (ev) => ev.venueId === "red-rocks-amphitheatre" && ev.dateKey < todayDenverKey
  ).length;
  const upcomingServedSecondaryCount = artistEvents.filter(
    (ev) =>
      ev.venueId !== "red-rocks-amphitheatre" &&
      ev.dateKey >= todayDenverKey &&
      isParrServedVenue(ev.venueId)
  ).length;

  return {
    artist: matched,
    artistSlug,
    decision: evaluateBandPageDisposition({
      bandId: cleanId,
      artistSlug,
      upcomingRedRocksCount,
      historicalRedRocksCount,
      upcomingServedSecondaryCount,
    }),
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const ctx = await resolveBandContext(id);
  const cleanId = decodeURIComponent(id).trim();
  return {
    title: ctx ? `${ctx.artist.name} | Colorado Tour Archive | Party at Red Rocks` : "Artist Profile | Party at Red Rocks",
    alternates: { canonical: `https://www.partyatredrocks.com/bands/${encodeURIComponent(cleanId)}` },
    robots: {
      index: ctx ? ctx.decision.index : false,
      follow: ctx ? ctx.decision.follow : false,
    },
  };
}

export default async function BandConsolidationPage({ params }: Props) {
  const { id } = await params;
  const ctx = await resolveBandContext(id);
  if (!ctx) {
    return notFound();
  }

  if (ctx.decision.action === "not_found_404") {
    return notFound();
  }

  if (ctx.decision.action === "redirect_308" && ctx.decision.redirectDestination) {
    permanentRedirect(ctx.decision.redirectDestination);
  }

  // Thin club-only profile: render HTTP 200 with `noindex, follow` (never 308 into a noindex target)
  return (
    <main className="brand-page mx-auto max-w-4xl px-4 py-14 text-white">
      <div className="rounded-[28px] border border-white/12 bg-[#0d1424] p-8 shadow-xl">
        <div className="text-xs font-black uppercase tracking-[0.2em] text-[#8fd0ff]">
          Colorado Concert Archive
        </div>
        <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
          {ctx.artist.name}
        </h1>
        <p className="mt-3 text-base leading-7 text-white/78">
          View past Colorado club appearances for {ctx.artist.name} or browse verified 2027 Red Rocks Amphitheatre concerts with private group transportation.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={`/artists/${encodeURIComponent(ctx.artistSlug)}`}
            className="inline-flex min-h-11 items-center rounded-full border border-white/18 bg-white/8 px-6 text-xs font-bold uppercase tracking-[0.14em] text-white no-underline hover:bg-white/14"
          >
            View {ctx.artist.name} Concert History →
          </Link>
          <Link
            href="/red-rocks/concerts"
            className="inline-flex min-h-11 items-center rounded-full bg-[#ff6b3d] px-6 text-xs font-black uppercase tracking-[0.14em] text-white no-underline hover:bg-[#ff7f56]"
          >
            2027 Red Rocks Concert Schedule →
          </Link>
        </div>
      </div>
    </main>
  );
}
