import { resolveMediaImage } from "@/lib/media/resolver";
import type { MediaEntityType } from "@/lib/media/types";

export type ImagePriorityInput = {
  blobImage?: string | null;
  spotifyImage?: string | null;
  ticketmasterImage?: string | null;
  seatgeekImage?: string | null;
  localAsset?: string | null;
  fallback?: string | null;
  queryHint?: string | null;
  alt?: string | null;
  title?: string | null;
  artistName?: string | null;
  venueName?: string | null;
  entityType?: MediaEntityType;
};

export function selectImageByPriority(input: ImagePriorityInput): string {
  return resolveMediaImage({
    entityType: input.entityType || "show",
    slug: input.title || input.artistName || input.venueName || input.queryHint || "image",
    sourceHints: {
      queryHint: input.queryHint,
      alt: input.alt,
      title: input.title,
      artistName: input.artistName,
      venueName: input.venueName,
      localImageUrl: input.blobImage || input.localAsset || input.fallback || undefined,
      spotifyImageUrl: input.spotifyImage || undefined,
      ticketmasterImageUrl: input.ticketmasterImage || undefined,
      seatgeekImageUrl: input.seatgeekImage || undefined,
    },
  });
}
