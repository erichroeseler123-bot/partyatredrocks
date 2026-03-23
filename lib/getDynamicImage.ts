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
  const width = 1200;
  const height = 630;

  try {
    if (type === "artist" && query) {
      const res = await fetch(
        `https://theaudiodb.com/api/v1/json/2/search.php?s=${encodeURIComponent(query)}`,
        { cache: "force-cache" },
      );
      if (res.ok) {
        const data = (await res.json()) as AudioDbArtistResponse;
        const thumb = data.artists?.[0]?.strArtistThumb;
        if (hasUsableUrl(thumb)) return thumb;
      }
    }

    if (type === "venue" && query) {
      const res = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`,
        { cache: "force-cache" },
      );
      if (res.ok) {
        const data = (await res.json()) as WikipediaSummaryResponse;
        if (hasUsableUrl(data.thumbnail?.source)) return data.thumbnail.source;
      }
    }

    const unsplashQuery = query
      ? `${query},concert,night`
      : "red-rocks-amphitheatre,concert-crowd,shuttle-bus";

    return `https://source.unsplash.com/random/${width}x${height}/?${encodeURIComponent(unsplashQuery)}`;
  } catch {
    return fallbackLocal || "/hero/hero-home.jpg";
  }
}
