export const DCC_ORIGIN =
  process.env.NEXT_PUBLIC_DCC_ORIGIN || "https://destinationcommandcenter.com";

export const PARR_CANONICAL_HANDOFFS = {
  shuttles: "/shuttles",
  book: "/book",
  redRocksBook: "/book?venue=red-rocks-amphitheatre",
  redRocksShared: "/book/red-rocks-amphitheatre/shared",
  redRocksPrivate: "/book/red-rocks-amphitheatre/private",
} as const;

export const DCC_HANDOFF_QUERY_KEYS = [
  "venue",
  "date",
  "event",
  "artist",
  "qty",
  "source",
] as const;

export type DccHandoffQueryKey = (typeof DCC_HANDOFF_QUERY_KEYS)[number];
export type HandoffSearchParams = Record<string, string | string[] | undefined>;

const VENUE_SLUG_ALIASES: Record<string, string> = {
  redrocks: "red-rocks-amphitheatre",
  "red-rocks": "red-rocks-amphitheatre",
  "red-rocks-amphitheater": "red-rocks-amphitheatre",
  cervantes: "cervantes-masterpiece",
  "cervantes-masterpiece-ballroom": "cervantes-masterpiece",
};

function firstValue(
  searchParams: HandoffSearchParams | undefined,
  key: string,
): string | undefined {
  if (!searchParams) return undefined;
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] : value;
}

export function normalizeVenueSlug(slug?: string | null) {
  if (!slug) return undefined;
  const normalized = slug.trim().toLowerCase();
  return VENUE_SLUG_ALIASES[normalized] || normalized;
}

export function pickDccHandoffParams(
  searchParams?: HandoffSearchParams,
  overrides?: Partial<Record<DccHandoffQueryKey, string | number | null | undefined>>,
) {
  const query = new URLSearchParams();

  for (const key of DCC_HANDOFF_QUERY_KEYS) {
    const override = overrides?.[key];
    const rawValue =
      override === null || override === undefined
        ? firstValue(searchParams, key)
        : String(override);

    if (!rawValue) continue;

    if (key === "venue") {
      const venue = normalizeVenueSlug(rawValue);
      if (venue) query.set(key, venue);
      continue;
    }

    query.set(key, rawValue);
  }

  return query;
}

function appendQuery(path: string, query: URLSearchParams) {
  const search = query.toString();
  return search ? `${path}?${search}` : path;
}

type BuildBookingHrefArgs = {
  target: "book" | "venue" | "shared" | "private" | "shared-product" | "private-option" | "shuttles";
  venue?: string | null;
  productCode?: string;
  option?: string;
  searchParams?: HandoffSearchParams;
  overrides?: Partial<Record<DccHandoffQueryKey, string | number | null | undefined>>;
};

export function buildBookingHref({
  target,
  venue,
  productCode,
  option,
  searchParams,
  overrides,
}: BuildBookingHrefArgs) {
  const query = pickDccHandoffParams(searchParams, {
    ...overrides,
    venue: venue ?? overrides?.venue ?? firstValue(searchParams, "venue"),
  });

  const normalizedVenue =
    normalizeVenueSlug(venue || query.get("venue")) || "red-rocks-amphitheatre";

  if (target === "book") {
    query.set("venue", normalizedVenue);
    return appendQuery(PARR_CANONICAL_HANDOFFS.book, query);
  }

  if (target === "shuttles") {
    return appendQuery(PARR_CANONICAL_HANDOFFS.shuttles, query);
  }

  query.delete("venue");

  if (target === "venue") {
    return appendQuery(`/book/${normalizedVenue}`, query);
  }

  if (target === "shared") {
    return appendQuery(`/book/${normalizedVenue}/shared`, query);
  }

  if (target === "private") {
    return appendQuery(`/book/${normalizedVenue}/private`, query);
  }

  if (target === "shared-product") {
    return appendQuery(
      `/book/${normalizedVenue}/shared/${encodeURIComponent(productCode || "")}`,
      query,
    );
  }

  return appendQuery(
    `/book/${normalizedVenue}/private/${encodeURIComponent(option || "")}`,
    query,
  );
}

export function buildVenueRequestHref({
  venue,
  searchParams,
  overrides,
}: {
  venue?: string | null;
  searchParams?: HandoffSearchParams;
  overrides?: Partial<Record<DccHandoffQueryKey, string | number | null | undefined>>;
}) {
  const query = pickDccHandoffParams(searchParams, {
    ...overrides,
    venue: venue ?? overrides?.venue ?? firstValue(searchParams, "venue"),
  });
  return appendQuery("/book-all-venue", query);
}
