import { buildUnsplashImageSrc, buildUnsplashQuery } from "@/lib/unsplash";

export type ImagePriorityInput = {
  blobImage?: string | null;
  spotifyImage?: string | null;
  ticketmasterImage?: string | null;
  seatgeekImage?: string | null;
  localAsset?: string | null;
  fallback?: string | null;
  queryHint?: string | null;
};

export function selectImageByPriority(input: ImagePriorityInput): string {
  const candidate =
    input.blobImage ||
    input.spotifyImage ||
    input.ticketmasterImage ||
    input.seatgeekImage ||
    input.localAsset ||
    input.fallback ||
    null;

  return buildUnsplashImageSrc({
    query: buildUnsplashQuery(input.queryHint, candidate, input.fallback),
    src: candidate,
  });
}
