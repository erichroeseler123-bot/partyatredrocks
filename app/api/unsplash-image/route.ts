import { NextResponse } from "next/server";
import { buildUnsplashQuery } from "@/lib/unsplash";

export const revalidate = 86400;

type UnsplashSearchResponse = {
  results?: Array<{
    id: string;
    urls?: {
      raw?: string;
      regular?: string;
      small?: string;
    };
  }>;
};

type PexelsSearchResponse = {
  photos?: Array<{
    id: number;
    src?: {
      original?: string;
      large2x?: string;
      large?: string;
      medium?: string;
    };
  }>;
};

const FALLBACK_IMAGE_POOLS = {
  concert: [
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f",
    "https://images.unsplash.com/photo-1501386761578-eac5c94b800a",
    "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2",
  ],
  vehicle: [
    "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d",
    "https://images.unsplash.com/photo-1502877338535-766e1452684a",
    "https://images.unsplash.com/photo-1494976388531-d1058494cdd8",
  ],
  venue: [
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    "https://images.unsplash.com/photo-1548574505-5e239809ee19",
    "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3",
  ],
} as const;

function parseDimension(value: string | null, fallback: number) {
  const parsed = Number.parseInt(value || "", 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return parsed;
}

function hashString(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function fallbackPoolForQuery(query: string) {
  const normalized = query.toLowerCase();
  if (
    normalized.includes("shuttle") ||
    normalized.includes("suv") ||
    normalized.includes("van") ||
    normalized.includes("sprinter") ||
    normalized.includes("bus") ||
    normalized.includes("transport")
  ) {
    return FALLBACK_IMAGE_POOLS.vehicle;
  }

  if (
    normalized.includes("venue") ||
    normalized.includes("amphitheatre") ||
    normalized.includes("amphitheater") ||
    normalized.includes("map") ||
    normalized.includes("parking") ||
    normalized.includes("guide")
  ) {
    return FALLBACK_IMAGE_POOLS.venue;
  }

  return FALLBACK_IMAGE_POOLS.concert;
}

function fallbackImageUrl(query: string, width: number, height: number, quality: number) {
  const pool = fallbackPoolForQuery(query);
  const imageUrl = new URL(pool[hashString(query) % pool.length]);
  imageUrl.searchParams.set("auto", "format");
  imageUrl.searchParams.set("fit", "crop");
  imageUrl.searchParams.set("w", String(width));
  imageUrl.searchParams.set("h", String(height));
  imageUrl.searchParams.set("q", String(quality));
  return imageUrl;
}

function redirectTo(url: URL) {
  return NextResponse.redirect(url, {
    status: 307,
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}

async function resolveUnsplashImage(
  query: string,
  width: number,
  height: number,
  quality: number,
): Promise<URL | null> {
  const apiKey = process.env.UNSPLASH_API_KEY || process.env.SPLASH_API_KEY;
  if (!apiKey) return null;

  const orientation = width === height ? "squarish" : width > height ? "landscape" : "portrait";
  const response = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=8&orientation=${orientation}&content_filter=high&order_by=relevant`,
    {
      headers: {
        Authorization: `Client-ID ${apiKey}`,
        "Accept-Version": "v1",
      },
      cache: "force-cache",
      next: { revalidate },
    },
  );

  if (!response.ok) return null;

  const data = (await response.json()) as UnsplashSearchResponse;
  const results = data.results || [];
  if (!results.length) return null;

  const selected = results[hashString(query) % results.length];
  const rawUrl = selected.urls?.raw || selected.urls?.regular || selected.urls?.small;
  if (!rawUrl) return null;

  const imageUrl = new URL(rawUrl);
  imageUrl.searchParams.set("auto", "format");
  imageUrl.searchParams.set("fit", "crop");
  imageUrl.searchParams.set("w", String(width));
  imageUrl.searchParams.set("h", String(height));
  imageUrl.searchParams.set("q", String(quality));
  return imageUrl;
}

async function resolvePexelsImage(
  query: string,
  width: number,
  height: number,
  quality: number,
): Promise<URL | null> {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) return null;

  const response = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=8&orientation=${width > height ? "landscape" : width === height ? "square" : "portrait"}`,
    {
      headers: {
        Authorization: apiKey,
      },
      cache: "force-cache",
      next: { revalidate },
    },
  );

  if (!response.ok) return null;

  const data = (await response.json()) as PexelsSearchResponse;
  const photos = data.photos || [];
  if (!photos.length) return null;

  const selected = photos[hashString(`pexels:${query}`) % photos.length];
  const rawUrl =
    selected.src?.large2x ||
    selected.src?.large ||
    selected.src?.medium ||
    selected.src?.original;
  if (!rawUrl) return null;

  const imageUrl = new URL(rawUrl);
  imageUrl.searchParams.set("auto", "compress");
  imageUrl.searchParams.set("fit", "crop");
  imageUrl.searchParams.set("w", String(width));
  imageUrl.searchParams.set("h", String(height));
  imageUrl.searchParams.set("q", String(quality));
  return imageUrl;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const width = parseDimension(url.searchParams.get("w"), 1600);
  const height = parseDimension(url.searchParams.get("h"), 900);
  const quality = parseDimension(url.searchParams.get("qf"), 80);
  const query = buildUnsplashQuery(
    url.searchParams.get("q"),
    url.searchParams.get("alt"),
    url.searchParams.get("src"),
  );

  try {
    const unsplashImage = await resolveUnsplashImage(query, width, height, quality);
    if (unsplashImage) return redirectTo(unsplashImage);

    const pexelsImage = await resolvePexelsImage(query, width, height, quality);
    if (pexelsImage) return redirectTo(pexelsImage);
  } catch {
    // Fall through to deterministic CDN fallback.
  }

  return redirectTo(fallbackImageUrl(query, width, height, quality));
}
