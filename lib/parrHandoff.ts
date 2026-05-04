export const DCC_ORIGIN =
  process.env.NEXT_PUBLIC_DCC_ORIGIN || "https://destinationcommandcenter.com";

export const PARR_CANONICAL_HANDOFFS = {
  shuttles: "/shuttles",
  book: "/book",
} as const;

export const DCC_HANDOFF_QUERY_KEYS = [
  "dcc_handoff_id",
  "handoff_id",
  "dcc_return",
  "venue",
  "date",
  "event",
  "artist",
  "qty",
  "source",
  "source_slug",
  "source_page",
  "decision_corridor",
  "decision_state",
  "decision_action",
  "decision_option",
  "decision_product",
  "decision_cta",
  "decision_entry",
  "decision_surface",
  "destination_surface",
  "decision_policy",
  "topic",
  "subtype",
  "requested_lane",
  "resolved_lane",
  "product_slug",
  "rank",
  "widget_id",
  "widget_placement",
  "satellite",
  "partner_satellite",
  "partner_reason",
  "partner_handoff_id",
] as const;

const DCC_SHARED_PASSTHROUGH_KEYS = ["pickupHub", "city", "requests"] as const;

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

export function buildDccRedRocksBookingHref({
  searchParams,
  overrides,
}: {
  searchParams?: HandoffSearchParams;
  overrides?: Partial<Record<DccHandoffQueryKey, string | number | null | undefined>>;
} = {}) {
  const query = pickDccHandoffParams(searchParams, {
    ...overrides,
    venue: "red-rocks-amphitheatre",
  });

  query.delete("venue");

  for (const key of DCC_SHARED_PASSTHROUGH_KEYS) {
    const rawValue = firstValue(searchParams, key);
    if (!rawValue) continue;
    query.set(key, rawValue);
  }

  return appendQuery("/book/red-rocks-amphitheatre/custom/shared", query);
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
    const sharedPath = normalizedVenue === "red-rocks-amphitheatre"
      ? `/book/${normalizedVenue}/custom/shared`
      : `/book/${normalizedVenue}/shared`;
    return appendQuery(sharedPath, query);
  }

  if (target === "private") {
    return appendQuery(`/book/${normalizedVenue}/private`, query);
  }

  if (target === "shared-product") {
    const sharedPath = normalizedVenue === "red-rocks-amphitheatre"
      ? `/book/${normalizedVenue}/custom/shared`
      : `/book/${normalizedVenue}/shared`;
    return appendQuery(sharedPath, query);
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
