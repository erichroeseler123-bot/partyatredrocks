import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { getMultiYearArtistsCatalog } from "@/lib/events/getCatalog";
import {
  evaluateParserArtifactSlug,
  isManualReviewProtectedPath,
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

async function resolveBandTarget(rawId: string) {
  const cleanId = decodeURIComponent(rawId).trim();
  const artists = await getMultiYearArtistsCatalog({ scope: "all" });
  const matched =
    artists.find((a) => a.id === cleanId) ??
    artists.find((a) => slugify(a.name) === cleanId.replace(/^artist-/, ""));

  if (!matched) return null;
  return {
    artist: matched,
    artistSlug: slugify(matched.name),
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: "Artist Profile | Party at Red Rocks",
    alternates: { canonical: `https://www.partyatredrocks.com/bands/${encodeURIComponent(id)}` },
    robots: { index: false, follow: true },
  };
}

export default async function BandConsolidationPage({ params }: Props) {
  const { id } = await params;
  const bandPath = `/bands/${encodeURIComponent(id)}`;

  // Manual-review protection check first
  if (isManualReviewProtectedPath(bandPath)) {
    return notFound();
  }

  const resolved = await resolveBandTarget(id);
  if (!resolved) {
    return notFound();
  }

  const artifact = evaluateParserArtifactSlug(resolved.artistSlug);
  if (artifact.isArtifact) {
    if (artifact.action === "not_found") {
      return notFound();
    }
    permanentRedirect(artifact.destination);
  }

  // Proven 1:1 duplicate consolidation: single-hop HTTP 308 -> /artists/[artist]
  permanentRedirect(`/artists/${encodeURIComponent(resolved.artistSlug)}`);
}
