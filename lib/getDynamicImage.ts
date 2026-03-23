export type ImageType = "artist" | "venue" | "concert" | "genre" | "fleet";
import { buildUnsplashImageSrc, buildUnsplashQuery } from "@/lib/unsplash";

export async function getDynamicImage(
  type: ImageType,
  query = "",
  fallbackLocal?: string,
): Promise<string> {
  const baseQuery = buildUnsplashQuery(query, fallbackLocal);
  const typeHints: Record<ImageType, string> = {
    artist: "live music artist portrait concert",
    venue: "concert venue crowd lights",
    concert: "concert crowd stage lights",
    genre: "live music scene crowd",
    fleet: "concert transportation sprinter van shuttle",
  };

  return buildUnsplashImageSrc({
    query: `${baseQuery} ${typeHints[type]}`.trim(),
    src: fallbackLocal || undefined,
  });
}
