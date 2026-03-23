export type ImageType = "artist" | "venue" | "concert" | "genre" | "fleet";

type AudioDbArtistResponse = {
  artists?: Array<{
    strArtistThumb?: string | null;
  }>;
};

type WikipediaSummaryResponse = {
  thumbnail?: {
    source?: string;
  };
};

function hasUsableUrl(value: unknown): value is string {
  return typeof value === "string" && value.startsWith("http");
}

export async function getDynamicImage(
  type: ImageType,
  query = "",
  fallbackLocal?: string,
): Promise<string> {
  const normalizedQuery = query.trim().toLowerCase();
  const fallback = fallbackLocal || "/hero/hero-home.jpg";

  try {
    if (type === "artist" && query) {
      const res = await fetch(
        `https://www.theaudiodb.com/api/v1/json/2/search.php?s=${encodeURIComponent(query)}`,
        { cache: "force-cache" },
      );
      if (res.ok) {
        const data = (await res.json()) as AudioDbArtistResponse;
        const thumb = data.artists?.[0]?.strArtistThumb;
        if (hasUsableUrl(thumb)) return thumb;
      }
      return fallback;
    }

    if (type === "venue" && query) {
      // Keep Red Rocks hero/foundation visuals on known-good local media.
      if (normalizedQuery.includes("red rocks")) return fallback;

      const res = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`,
        { cache: "force-cache" },
      );
      if (res.ok) {
        const data = (await res.json()) as WikipediaSummaryResponse;
        if (hasUsableUrl(data.thumbnail?.source)) return data.thumbnail.source;
      }
      return fallback;
    }

    // Concert/genre/fleet should never rely on unstable random endpoints in production.
    return fallback;
  } catch {
    return fallback;
  }
}
