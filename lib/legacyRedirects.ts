export type LegacyRedirectTarget = {
  pathname: string;
  hash?: string;
};

/**
 * Owner-approved collapsed single-hop 308 permanent redirects (Phase 2 Decision #1).
 * Note: `/find` is handled dynamically so legitimate query/attribution parameters are preserved.
 */
export const COLLAPSED_SINGLE_HOP_REDIRECTS: Record<string, LegacyRedirectTarget> = {
  "/party-bus-to-red-rocks": { pathname: "/red-rocks/group-transportation" },
  "/sprinter": { pathname: "/book/red-rocks-amphitheatre/private", hash: "van-upgrade" },
};

/**
 * Owner-approved 11 historical WordPress/Wix/legacy 404 routes mapped 1:1 to exact topical successors
 * with single-hop 308 permanent redirects and zero homepage catch-alls (Phase 2 Decision #2).
 */
export const HISTORICAL_404_SUCCESSOR_REDIRECTS: Record<string, LegacyRedirectTarget> = {
  "/red-rocks-schedule": { pathname: "/red-rocks/concerts" },
  "/transportation-services": { pathname: "/red-rocks/shuttle" },
  "/red-rocks-shuttle": { pathname: "/red-rocks/shuttle" },
  "/shared-shuttle": { pathname: "/red-rocks/shuttle" },
  "/private-shuttle": { pathname: "/book/red-rocks-amphitheatre/private" },
  "/denver-marriott-west": { pathname: "/guide/local/denver-pickups" },
  "/guide/local/denver-pickup-locations": { pathname: "/guide/local/denver-pickups" },
  "/guide/tailgate": { pathname: "/guide/tailgating" },
  "/rain": { pathname: "/red-rocks/weather" },
  "/venues/fiddlers-green": { pathname: "/venues/fiddlers-green-amphitheatre" },
  "/venues/mishawaka": { pathname: "/venues/mishawaka-amphitheatre" },
};

/**
 * Additional pre-existing legacy Wix/guide redirects preserved in single-hop form.
 */
export const PRESERVED_LEGACY_ROUTE_REDIRECTS: Record<string, LegacyRedirectTarget> = {
  "/mishawaka-private-transportation": {
    pathname: "/venues/mishawaka-amphitheatre",
    hash: "private-transportation",
  },
  "/la-quinta-fairfield": { pathname: "/guide/local/denver-pickups", hash: "hotel-pickup" },
  "/upper-north": { pathname: "/guide/local/denver-pickups", hash: "private-pickup" },
  "/tubing": { pathname: "/guide" },
  "/hiking-at-red-rocks": { pathname: "/guide" },
  "/guide/post-encore-strategy": { pathname: "/guide/show-night-strategy/post-show-pickup-plan" },
  "/guide/bag-policy-2026": { pathname: "/guide/logistics/bag-policy" },
  "/guide/sheraton-pickup": { pathname: "/guide/local/denver-pickups", hash: "downtown-pickup" },
  "/concert-guide": { pathname: "/red-rocks/concert-guide" },
  "/red-rocks-concert-guide": { pathname: "/red-rocks/concert-guide" },
  "/general-7": { pathname: "/" },
};

export const ALL_LEGACY_STATIC_REDIRECTS: Record<string, LegacyRedirectTarget> = {
  ...PRESERVED_LEGACY_ROUTE_REDIRECTS,
  ...COLLAPSED_SINGLE_HOP_REDIRECTS,
  ...HISTORICAL_404_SUCCESSOR_REDIRECTS,
};

export function lookupLegacyStaticRedirect(rawPathname: string): LegacyRedirectTarget | null {
  if (!rawPathname || rawPathname === "/") return null;
  const normalized = rawPathname.endsWith("/")
    ? rawPathname.slice(0, -1).toLowerCase()
    : rawPathname.toLowerCase();
  return ALL_LEGACY_STATIC_REDIRECTS[normalized] || ALL_LEGACY_STATIC_REDIRECTS[rawPathname] || null;
}
