import { buildUnsplashImageSrc } from "@/lib/unsplash";
import type { MediaEntityType, MediaRequest, MediaSource, NodeImageAsset } from "@/lib/media/types";

function buildProviderImageAsset(source: MediaSource, src: string | null | undefined, alt: string): NodeImageAsset | null {
  if (!src) return null;
  const trimmed = src.trim();
  if (!trimmed) return null;
  return { src: trimmed, alt, source };
}

function resolvePreferredImage(
  assets: Array<NodeImageAsset | null | undefined>,
  priority: MediaSource[],
): NodeImageAsset | null {
  const candidates = assets.filter(Boolean) as NodeImageAsset[];
  if (!candidates.length) return null;

  for (const source of priority) {
    const match = candidates.find((asset) => asset.source === source);
    if (match) return match;
  }

  return candidates[0] || null;
}

function priorityForEntity(entityType: MediaEntityType): MediaSource[] {
  if (entityType === "show" || entityType === "artist") {
    return ["ticketmaster", "spotify", "seatgeek", "local", "unsplash"];
  }

  if (entityType === "venue") {
    return ["local", "ticketmaster", "seatgeek", "unsplash"];
  }

  return ["local", "unsplash", "ticketmaster", "spotify", "seatgeek"];
}

function normalizeTerm(value: string | null | undefined): string {
  return (value || "")
    .trim()
    .replace(/^unsplash:/, "")
    .replace(/^https?:\/\/[^/]+/i, " ")
    .replace(/[?#].*$/, " ")
    .replace(/\.(avif|gif|jpe?g|png|svg|webp)\b/gi, " ")
    .replace(/[_/\\-]+/g, " ")
    .replace(/[^a-zA-Z0-9\s&]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function dedupeTerms(values: Array<string | null | undefined>): string {
  const seen = new Set<string>();
  const terms: string[] = [];

  for (const value of values) {
    const normalized = normalizeTerm(value);
    if (!normalized) continue;
    const key = normalized.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    terms.push(normalized);
  }

  return terms.join(" ").trim();
}

function semanticQueryForEntity(request: MediaRequest): string {
  const hints = request.sourceHints || {};
  const title = String(hints.title || "").trim();
  const artistName = String(hints.artistName || "").trim();
  const venueName = String(hints.venueName || "").trim();
  const city = String(hints.city || "Denver Colorado").trim();
  const explicit = String(hints.queryHint || "").trim();

  switch (request.entityType) {
    case "artist":
      return dedupeTerms([explicit, artistName, "live music artist portrait concert photography"]);
    case "show":
      return dedupeTerms([explicit, artistName || title, venueName, city, "live concert crowd stage lights"]);
    case "venue":
      return dedupeTerms([explicit, venueName || title, city, "concert venue exterior crowd night"]);
    case "scene":
      return dedupeTerms([explicit, title, city, "live music scene concert crowd nightlife"]);
    case "guide":
      return dedupeTerms([explicit, title, venueName, city, "concert guide planning arrival nightlife"]);
    case "transport":
      return dedupeTerms([explicit, title, city, "concert pickup luxury sprinter suv nightlife"]);
    case "marketing":
      return dedupeTerms([explicit, title, city, "premium concert nightlife photography"]);
    default:
      return dedupeTerms([explicit, title, venueName, artistName, city, "concert nightlife"]);
  }
}

export function resolveMediaImage(request: MediaRequest): string {
  const hints = request.sourceHints || {};
  const alt =
    String(hints.alt || "").trim() ||
    String(hints.title || "").trim() ||
    String(hints.artistName || "").trim() ||
    String(hints.venueName || "").trim() ||
    request.slug;

  const preferred = resolvePreferredImage(
    [
      buildProviderImageAsset("ticketmaster", hints.ticketmasterImageUrl, alt),
      buildProviderImageAsset("spotify", hints.spotifyImageUrl, alt),
      buildProviderImageAsset("seatgeek", hints.seatgeekImageUrl, alt),
      buildProviderImageAsset("local", hints.localImageUrl, alt),
      buildProviderImageAsset("unsplash", hints.unsplashImageUrl, alt),
    ],
    priorityForEntity(request.entityType),
  );

  return buildUnsplashImageSrc({
    query: semanticQueryForEntity(request),
    src: preferred?.src,
    alt,
  });
}
