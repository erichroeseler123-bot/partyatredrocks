export type ImageType = "artist" | "venue" | "concert" | "genre" | "fleet";
import { resolveMediaImage } from "@/lib/media/resolver";

export async function getDynamicImage(
  type: ImageType,
  query = "",
  fallbackLocal?: string,
): Promise<string> {
  const entityType = (() => {
    if (type === "artist") return "artist";
    if (type === "venue") return "venue";
    if (type === "genre") return "scene";
    if (type === "fleet") return "transport";
    return "show";
  })();

  return resolveMediaImage({
    entityType,
    slug: query || type,
    sourceHints: {
      title: query,
      queryHint: query,
      localImageUrl: fallbackLocal || undefined,
      alt: query || type,
    },
  });
}
