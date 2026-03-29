const DEFAULT_QUERY = "red rocks amphitheatre concert night denver colorado";

function cleanText(value: string) {
  return value
    .toLowerCase()
    .replace(/^unsplash:/, "")
    .replace(/^https?:\/\/[^/]+/i, " ")
    .replace(/[?#].*$/, " ")
    .replace(/\.(avif|gif|jpe?g|png|svg|webp)\b/g, " ")
    .replace(/[_/\\-]+/g, " ")
    .replace(/[^a-z0-9\s]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function mapKnownTerms(value: string) {
  const text = cleanText(value);
  if (!text) return "";

  const replacements: Array<[RegExp, string]> = [
    [/\bred rocks\b|\brrsite\b|\bhero home\b|\bog default\b|\bfallback\b/, "red rocks amphitheatre concert night denver colorado"],
    [/\bhero guides\b|\bguide\b|\bparking\b|\bpolicy\b|\bpickup\b|\btransportation\b/, "red rocks concert planning transportation denver"],
    [/\bshuttle\b|\bsprinter\b|\bfleet\b|\bvan\b/, "concert shuttle sprinter van denver night"],
    [/\bvip suv\b|\bprivate suv\b|\bsuburban\b/, "private suv concert transportation denver night"],
    [/\bparty bus\b/, "party bus concert transportation night denver"],
    [/\bjam\b/, "jam band concert crowd colorado"],
    [/\bedm\b|\bbass\b/, "edm concert lasers crowd denver"],
    [/\bhip hop\b|\bhiphop\b|\brap\b/, "hip hop concert stage denver"],
    [/\bmetal\b/, "metal concert crowd denver"],
    [/\bbluegrass\b|\bamericana\b/, "bluegrass concert colorado"],
    [/\bindie\b|\balternative\b/, "indie concert denver"],
    [/\bcountry\b/, "country concert colorado"],
    [/\breggae\b/, "reggae concert crowd"],
    [/\bpunk\b/, "punk concert denver"],
    [/\blatin\b/, "latin concert denver"],
    [/\bmap\b/, "denver venue district streets aerial"],
  ];

  for (const [pattern, replacement] of replacements) {
    if (pattern.test(text)) return replacement;
  }

  return text;
}

export function buildUnsplashQuery(...parts: Array<string | null | undefined>) {
  for (const part of parts) {
    if (!part) continue;
    const mapped = mapKnownTerms(part);
    if (mapped) return mapped;
  }
  return DEFAULT_QUERY;
}

type BuildUnsplashImageSrcInput = {
  query?: string | null;
  src?: string | null;
  alt?: string | null;
  width?: number | null;
  height?: number | null;
  quality?: number | null;
};

export function buildUnsplashImageSrc(input: BuildUnsplashImageSrcInput = {}) {
  const src = typeof input.src === "string" ? input.src.trim() : "";
  if (src && !src.startsWith("unsplash:")) {
    return src;
  }

  const params = new URLSearchParams();
  const primaryQuery = buildUnsplashQuery(input.query, input.alt);
  const fallbackQuery = src ? buildUnsplashQuery(src) : DEFAULT_QUERY;
  params.set("q", primaryQuery || fallbackQuery);
  if (src) params.set("src", src);
  if (input.alt) params.set("alt", input.alt);
  if (input.width) params.set("w", String(input.width));
  if (input.height) params.set("h", String(input.height));
  if (input.quality) params.set("qf", String(input.quality));
  return `/api/unsplash-image?${params.toString()}`;
}

export function semanticUnsplashSrc(query: string) {
  return `unsplash:${query}`;
}
