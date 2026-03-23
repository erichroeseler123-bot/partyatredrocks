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

type UnsplashSearchResponse = {
  results?: Array<{
    urls?: {
      regular?: string;
      small?: string;
      thumb?: string;
    };
  }>;
};

function hasUsableUrl(value: unknown): value is string {
  return typeof value === "string" && value.startsWith("http");
}

async function searchUnsplashImage(query: string): Promise<string | null> {
  const apiKey = process.env.UNSPLASH_API_KEY || process.env.SPLASH_API_KEY;
  if (!apiKey || !query) return null;

  const response = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape&client_id=${apiKey}`,
    {
      cache: "force-cache",
      next: { revalidate: 60 * 60 * 24 },
    },
  );
  if (!response.ok) return null;

  const data = (await response.json()) as UnsplashSearchResponse;
  const image =
    data.results?.[0]?.urls?.regular ||
    data.results?.[0]?.urls?.small ||
    data.results?.[0]?.urls?.thumb ||
    null;

  return hasUsableUrl(image) ? image : null;
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
      const unsplashImage = await searchUnsplashImage(query);
      if (unsplashImage) return unsplashImage;

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

    if (type === "concert" || type === "genre" || type === "fleet") {
      const unsplashImage = await searchUnsplashImage(query);
      if (unsplashImage) return unsplashImage;
    }

    return fallback;
  } catch {
    return fallback;
  }
}
