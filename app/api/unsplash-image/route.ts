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

export async function GET(request: Request) {
  const apiKey = process.env.UNSPLASH_API_KEY || process.env.SPLASH_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ ok: false, error: "missing_unsplash_api_key" }, { status: 500 });
  }

  const url = new URL(request.url);
  const width = parseDimension(url.searchParams.get("w"), 1600);
  const height = parseDimension(url.searchParams.get("h"), 900);
  const quality = parseDimension(url.searchParams.get("qf"), 80);
  const query = buildUnsplashQuery(
    url.searchParams.get("q"),
    url.searchParams.get("alt"),
    url.searchParams.get("src"),
  );
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

  if (!response.ok) {
    return NextResponse.json(
      { ok: false, error: `unsplash_${response.status}`, query },
      { status: 502 },
    );
  }

  const data = (await response.json()) as UnsplashSearchResponse;
  const results = data.results || [];
  if (!results.length) {
    return NextResponse.json({ ok: false, error: "no_results", query }, { status: 404 });
  }

  const selected = results[hashString(query) % results.length];
  const imageUrl = new URL(selected.urls?.raw || selected.urls?.regular || selected.urls?.small || "");
  imageUrl.searchParams.set("auto", "format");
  imageUrl.searchParams.set("fit", "crop");
  imageUrl.searchParams.set("w", String(width));
  imageUrl.searchParams.set("h", String(height));
  imageUrl.searchParams.set("q", String(quality));

  return NextResponse.redirect(imageUrl, {
    status: 307,
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}

