export type ImagePriorityInput = {
  blobImage?: string | null;
  spotifyImage?: string | null;
  ticketmasterImage?: string | null;
  seatgeekImage?: string | null;
  localAsset?: string | null;
  fallback?: string | null;
};

export function selectImageByPriority(input: ImagePriorityInput): string {
  return (
    input.blobImage ||
    input.spotifyImage ||
    input.ticketmasterImage ||
    input.seatgeekImage ||
    input.localAsset ||
    input.fallback ||
    "/images/shows/fallback.jpg"
  );
}
