import { PARR_2027_PRICING, SHUTTLE_PRICING } from "@/lib/pricing";
import { ACTIVE_PARR_VENUE_SLUGS } from "@/lib/servedVenues";

export const SITE_ORIGIN = "https://www.partyatredrocks.com";

export type ProtectedUrlEvidence = {
  path: string;
  sources: Array<"GSC_JUL_OCT_2026" | "AHREFS_NOV_2026_KEYWORDS" | "AHREFS_VERIFIED_BACKLINK">;
  baselineSummary: string;
  queriesOrAnchors: string[];
};

/**
 * Manual-Review Protection List (NOT an unconditional permanent-index allowlist).
 *
 * Policy:
 * - No URL in this dictionary may be automatically redirected, canonicalized elsewhere,
 *   or automatically switched to `noindex`.
 * - If a protected URL would otherwise fail an automated template/service gate, the gate
 *   preserves its current HTTP 200 + self-canonical + `index, follow` state and flags
 *   `flagForHumanReview: true` (`disposition: "manual_review_protected"`) for explicit
 *   owner review.
 */
export const MANUAL_REVIEW_PROTECTED_URLS: Record<string, ProtectedUrlEvidence> = {
  "/": {
    path: "/",
    sources: ["GSC_JUL_OCT_2026", "AHREFS_NOV_2026_KEYWORDS", "AHREFS_VERIFIED_BACKLINK"],
    baselineSummary:
      "797 GSC clicks (Jul-Oct 2026); Pos 1.1 'party at red rocks shuttle', Pos 4.4 'red rocks shuttle' (174 impr/wk); DR 86 atlasobscura.com, DR 77 colorado.com, DR 61 visitgolden.com, DR 33 destinationcommandcenter.com, DR 31 gosno.co.",
    queriesOrAnchors: [
      "party at red rocks shuttle",
      "party at red rocks",
      "red rocks shuttle",
      "red rocks limo services",
    ],
  },
  "/book/red-rocks-amphitheatre/private": {
    path: "/book/red-rocks-amphitheatre/private",
    sources: ["AHREFS_VERIFIED_BACKLINK"],
    baselineSummary: "Primary Tier-1 commercial private ride hub & DCC handoff target.",
    queriesOrAnchors: ["Secure Private Ride", "Party @ Red Rocks Private Ride"],
  },
  "/book/red-rocks-amphitheatre/private/suv": {
    path: "/book/red-rocks-amphitheatre/private/suv",
    sources: ["GSC_JUL_OCT_2026"],
    baselineSummary: "Primary Private Suburban ($499) booking option page.",
    queriesOrAnchors: ["red rocks private car service"],
  },
  "/book/red-rocks-amphitheatre/private/van": {
    path: "/book/red-rocks-amphitheatre/private/van",
    sources: ["GSC_JUL_OCT_2026"],
    baselineSummary: "Primary Private 10-Passenger Van ($699) booking option page.",
    queriesOrAnchors: ["red rocks private van"],
  },
  "/red-rocks": {
    path: "/red-rocks",
    sources: ["GSC_JUL_OCT_2026"],
    baselineSummary: "Approved Phase 2 indexable Red Rocks hub.",
    queriesOrAnchors: ["red rocks guide"],
  },
  "/red-rocks/concerts": {
    path: "/red-rocks/concerts",
    sources: ["GSC_JUL_OCT_2026"],
    baselineSummary: "Single canonical indexable Red Rocks concert-calendar destination.",
    queriesOrAnchors: ["red rocks concert schedule"],
  },
  "/red-rocks/what-to-wear": {
    path: "/red-rocks/what-to-wear",
    sources: ["GSC_JUL_OCT_2026", "AHREFS_NOV_2026_KEYWORDS"],
    baselineSummary: "33 GSC clicks (Aug-Oct 2026); Ahrefs Pos 1.0 'what to wear to red rocks concert in october'.",
    queriesOrAnchors: ["what to wear to red rocks concert in october"],
  },
  "/red-rocks/weather": {
    path: "/red-rocks/weather",
    sources: ["GSC_JUL_OCT_2026"],
    baselineSummary: "12 GSC clicks in Jul 2026; +7 clicks MoM in Sep 2026.",
    queriesOrAnchors: ["red rocks weather"],
  },
  "/red-rocks/post-concert-exit-guide": {
    path: "/red-rocks/post-concert-exit-guide",
    sources: ["GSC_JUL_OCT_2026"],
    baselineSummary: "Top growing GSC page (+4 clicks MoM in Oct 2026).",
    queriesOrAnchors: ["leaving red rocks after concert"],
  },
  "/red-rocks/map": {
    path: "/red-rocks/map",
    sources: ["GSC_JUL_OCT_2026"],
    baselineSummary: "Top growing GSC page (+2 clicks MoM in Oct 2026).",
    queriesOrAnchors: ["red rocks map"],
  },
  "/red-rocks/map/best-seats": {
    path: "/red-rocks/map/best-seats",
    sources: ["AHREFS_NOV_2026_KEYWORDS"],
    baselineSummary: "Ahrefs Pos 3.0 for 'red rocks parking lots map' (Vol 10).",
    queriesOrAnchors: ["red rocks parking lots map"],
  },
  "/red-rocks/seating-chart": {
    path: "/red-rocks/seating-chart",
    sources: ["AHREFS_NOV_2026_KEYWORDS"],
    baselineSummary: "Ahrefs Pos 2.0 for 'seating chart at red rocks' (Vol 20).",
    queriesOrAnchors: ["seating chart at red rocks"],
  },
  "/red-rocks/shuttle": {
    path: "/red-rocks/shuttle",
    sources: ["GSC_JUL_OCT_2026", "AHREFS_VERIFIED_BACKLINK"],
    baselineSummary: "GSC Pos 4.2 'best red rocks shuttle', Pos 4.4 'red rocks shuttle'; Visit Golden anchor target.",
    queriesOrAnchors: ["best red rocks shuttle", "red rocks shuttle", "shuttle to red rocks"],
  },
  "/red-rocks/car-service": {
    path: "/red-rocks/car-service",
    sources: ["GSC_JUL_OCT_2026", "AHREFS_NOV_2026_KEYWORDS"],
    baselineSummary: "GSC +4 clicks Jul 2026 'red rocks private car service'; Ahrefs Pos 4.0 'red rocks limo services'.",
    queriesOrAnchors: ["red rocks private car service", "red rocks limo services"],
  },
  "/red-rocks/group-transportation": {
    path: "/red-rocks/group-transportation",
    sources: ["GSC_JUL_OCT_2026"],
    baselineSummary: "GSC 6 clicks Oct 2026, Pos 8.0 'denver party bus to red rocks', Pos 13.0 'party bus to red rocks' (77 impr/wk).",
    queriesOrAnchors: ["party bus to red rocks", "denver party bus to red rocks", "red rocks party bus rental"],
  },
  "/red-rocks/transportation": {
    path: "/red-rocks/transportation",
    sources: ["GSC_JUL_OCT_2026"],
    baselineSummary: "GSC +7 clicks Jul 2026, +3 clicks Oct 2026, Pos 13.5 'red rocks transportation' (44 impr/wk).",
    queriesOrAnchors: ["red rocks transportation"],
  },
  "/red-rocks/wildlife": {
    path: "/red-rocks/wildlife",
    sources: ["AHREFS_VERIFIED_BACKLINK"],
    baselineSummary: "DR 33 dofollow editorial backlink from thewalkingmermaid.com.",
    queriesOrAnchors: ["Red Rocks wildlife"],
  },
  "/guide": {
    path: "/guide",
    sources: ["GSC_JUL_OCT_2026"],
    baselineSummary: "Approved Phase 2 indexable logistics guide hub.",
    queriesOrAnchors: ["red rocks logistics guide"],
  },
  "/guide/tailgating": {
    path: "/guide/tailgating",
    sources: ["AHREFS_VERIFIED_BACKLINK"],
    baselineSummary: "DR 30 editorial feature context from tailgatermagazine.com.",
    queriesOrAnchors: ["tailgating at red rocks"],
  },
  "/guide/transportation/shuttle-vs-uber": {
    path: "/guide/transportation/shuttle-vs-uber",
    sources: ["GSC_JUL_OCT_2026"],
    baselineSummary: "GSC Top Growing Page (+2 clicks MoM in Aug 2026).",
    queriesOrAnchors: ["red rocks shuttle vs uber"],
  },
  "/venues": {
    path: "/venues",
    sources: ["GSC_JUL_OCT_2026"],
    baselineSummary: "Approved Phase 2 indexable venues hub.",
    queriesOrAnchors: ["colorado concert venues"],
  },
  "/venues/red-rocks-amphitheatre": {
    path: "/venues/red-rocks-amphitheatre",
    sources: ["GSC_JUL_OCT_2026"],
    baselineSummary: "Core Red Rocks venue guide hub.",
    queriesOrAnchors: ["red rocks amphitheatre guide"],
  },
  "/venues/red-rocks-amphitheatre/what-to-wear": {
    path: "/venues/red-rocks-amphitheatre/what-to-wear",
    sources: ["GSC_JUL_OCT_2026"],
    baselineSummary: "GSC Top Growing Page (+5 clicks MoM in Sep 2026).",
    queriesOrAnchors: ["what to wear red rocks"],
  },
  "/venues/fiddlers-green-amphitheatre/best-time-to-arrive": {
    path: "/venues/fiddlers-green-amphitheatre/best-time-to-arrive",
    sources: ["GSC_JUL_OCT_2026"],
    baselineSummary: "GSC Top Growing Page (+4 clicks MoM in Aug 2026).",
    queriesOrAnchors: ["fiddler's green arrival time"],
  },
  "/venues/fiddlers-green-amphitheatre/concerts/august": {
    path: "/venues/fiddlers-green-amphitheatre/concerts/august",
    sources: ["AHREFS_NOV_2026_KEYWORDS"],
    baselineSummary: "Ahrefs Pos 6.0 for 'fiddler's green schedule' (Vol 200).",
    queriesOrAnchors: ["fiddler's green schedule"],
  },
  "/venues/ogden-theatre/concerts/april": {
    path: "/venues/ogden-theatre/concerts/april",
    sources: ["AHREFS_NOV_2026_KEYWORDS"],
    baselineSummary: "Ahrefs Pos 3.0 for 'ogden denver' (Vol 400).",
    queriesOrAnchors: ["ogden denver"],
  },
  "/venues/ogden-theatre/concerts/july": {
    path: "/venues/ogden-theatre/concerts/july",
    sources: ["AHREFS_NOV_2026_KEYWORDS"],
    baselineSummary: "Ahrefs Pos 9.0 for 'ogden theater schedule' (Vol 250).",
    queriesOrAnchors: ["ogden theater schedule"],
  },
  "/venues/ball-arena/concerts/december": {
    path: "/venues/ball-arena/concerts/december",
    sources: ["AHREFS_NOV_2026_KEYWORDS"],
    baselineSummary: "Ahrefs Pos 6.0 for 'concerts in denver in december' (Vol 70).",
    queriesOrAnchors: ["concerts in denver in december"],
  },
  "/venues/gothic-theatre/parking": {
    path: "/venues/gothic-theatre/parking",
    sources: ["AHREFS_NOV_2026_KEYWORDS"],
    baselineSummary: "Ahrefs Pos 6.0 for 'gothic theatre parking' (Vol 10).",
    queriesOrAnchors: ["gothic theatre parking"],
  },
  "/shows/rr-2026-07-03-deadrocks-xii-zeds-dead": {
    path: "/shows/rr-2026-07-03-deadrocks-xii-zeds-dead",
    sources: ["GSC_JUL_OCT_2026"],
    baselineSummary: "GSC Top Growing Page (+4 clicks MoM in Jul 2026).",
    queriesOrAnchors: ["deadrocks xii zeds dead"],
  },
  "/artists/cloonee/red-rocks-amphitheatre": {
    path: "/artists/cloonee/red-rocks-amphitheatre",
    sources: ["AHREFS_NOV_2026_KEYWORDS"],
    baselineSummary: "Ahrefs Pos 5.0 for 'cloonee boulder' — protected from automatic artist×venue consolidation.",
    queriesOrAnchors: ["cloonee boulder"],
  },
  "/artists/ruby-waters": {
    path: "/artists/ruby-waters",
    sources: ["AHREFS_NOV_2026_KEYWORDS"],
    baselineSummary: "Ahrefs Pos 7.0 for 'ruby waters denver' — protected from automatic club-only artist noindex.",
    queriesOrAnchors: ["ruby waters denver"],
  },
  "/artists/brit-floyd-the-wall": {
    path: "/artists/brit-floyd-the-wall",
    sources: ["AHREFS_NOV_2026_KEYWORDS"],
    baselineSummary: "Ahrefs Pos 10.0 for 'brit floyd red rocks 2023'.",
    queriesOrAnchors: ["brit floyd red rocks 2023"],
  },
  "/artists/cole-knight": {
    path: "/artists/cole-knight",
    sources: ["GSC_JUL_OCT_2026"],
    baselineSummary: "GSC May 2026 performance export (+3 clicks MoM).",
    queriesOrAnchors: ["cole knight red rocks"],
  },
  "/shows/rr-2026-05-19-kevin-gates": {
    path: "/shows/rr-2026-05-19-kevin-gates",
    sources: ["GSC_JUL_OCT_2026"],
    baselineSummary: "GSC May 2026 performance export (+3 clicks MoM).",
    queriesOrAnchors: ["kevin gates red rocks"],
  },
};

export function normalizeAuditPathname(pathname: string): string {
  const trimmed = pathname.trim().split("?")[0]?.split("#")[0] || "/";
  if (trimmed === "/") return "/";
  return trimmed.replace(/\/+$/, "");
}

export function getManualReviewProtectedEvidence(pathname: string): ProtectedUrlEvidence | null {
  const normalized = normalizeAuditPathname(pathname);
  return MANUAL_REVIEW_PROTECTED_URLS[normalized] ?? null;
}

export function isManualReviewProtectedPath(pathname: string): boolean {
  return getManualReviewProtectedEvidence(pathname) !== null;
}

/**
 * Active PARR-served venues where PARR offers either flagship Red Rocks private vehicles
 * or verified private group charter service across Mishawaka, Denver, and Boulder rooms.
 *
 * Explicitly excludes:
 * - `1stbank-center` (permanently closed Nov 2023, demolished 2024)
 * - Out-of-market Colorado Springs venues (`ford-amphitheater-colorado-springs`, `broadmoor-world-arena`, `black-sheep`)
 * - Unserved small bars / campus auditoriums (`ophelias`, `larimer-lounge`, `marquis-theater`, `chautauqua-auditorium`, `macky-auditorium`)
 */
export const PARR_SERVED_SECONDARY_VENUES = new Set<string>(
  ACTIVE_PARR_VENUE_SLUGS.filter((slug) => slug !== "red-rocks-amphitheatre")
);

export function isParrServedVenue(venueSlug?: string | null): boolean {
  if (!venueSlug) return false;
  const clean = venueSlug.trim().toLowerCase();
  return clean === "red-rocks-amphitheatre" || PARR_SERVED_SECONDARY_VENUES.has(clean);
}

export function getParrVenueServiceSummary(venueSlug?: string | null): string | null {
  if (!venueSlug) return null;
  const clean = venueSlug.trim().toLowerCase();
  if (clean === "red-rocks-amphitheatre") {
    return `$518.96 total Private Suburban ($499.00 base + $19.96 Booking fee (4%), up to 6) / $726.96 total Private Van ($699.00 base + $27.96 Booking fee (4%), up to 10)`;
  }
  if (clean === "mishawaka-amphitheatre") {
    return `${SHUTTLE_PRICING.mishawaka.privateSuburban} private Suburban charter`;
  }
  if (PARR_SERVED_SECONDARY_VENUES.has(clean)) {
    return `${SHUTTLE_PRICING.denverBoulderOtherVenues.suburban} private group charter`;
  }
  return null;
}

/**
 * SeatGeek / snapshot title-split parser artifacts that are NOT distinct musical artists.
 * Mapped only after proving exact parent artist or parent show identity in snapshot data.
 */
export type ParserArtifactAction =
  | { isArtifact: false }
  | { isArtifact: true; action: "not_found"; reason: string }
  | { isArtifact: true; action: "redirect_308"; destination: string; reason: string };

const PARSER_ARTIFACT_ARTIST_SLUGS: Record<
  string,
  { action: "not_found" } | { action: "redirect_308"; destination: string; reason: string }
> = {
  "16": {
    action: "not_found",
  },
  "special-guest-the-cult": {
    action: "redirect_308",
    destination: "/artists/the-cult",
    reason: "Title-split prefix artifact of verified 2027 Red Rocks performer 'The Cult' (/artists/the-cult).",
  },
  "and-vanfleet": {
    action: "redirect_308",
    destination: "/shows/rr-2027-04-09-svdden-death",
    reason: "Title-split '& Vanfleet' support string from verified 2027 Red Rocks show rr-2027-04-09-svdden-death.",
  },
  "and-the-drowsy-lads": {
    action: "redirect_308",
    destination: "/shows/rr-2027-04-16-bilmuri",
    reason: "Title-split '& The Drowsy Lads' support string from verified 2027 Red Rocks show rr-2027-04-16-bilmuri.",
  },
};

export function evaluateParserArtifactSlug(artistSlug: string): ParserArtifactAction {
  const clean = artistSlug.trim().toLowerCase();
  const hit = PARSER_ARTIFACT_ARTIST_SLUGS[clean];
  if (!hit) return { isArtifact: false };
  if (hit.action === "not_found") {
    return {
      isArtifact: true,
      action: "not_found",
      reason: "Age-restriction '(16+)' string split from event title, not a musical artist.",
    };
  }
  return {
    isArtifact: true,
    action: "redirect_308",
    destination: hit.destination,
    reason: hit.reason,
  };
}

export function isNonArtistParserLabel(rawName: string): boolean {
  const slug = rawName
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return Boolean(PARSER_ARTIFACT_ARTIST_SLUGS[slug]);
}

/**
 * 1stBank Center (Broomfield, CO) separate disposition policy:
 * - Venue permanently closed in November 2023 and was demolished in 2024.
 * - `/venues/1stbank-center` is retained at HTTP 200 as a truthful historical venue closure
 *   reference page (never redirected to /venues or /red-rocks/concerts).
 * - The 17 empty schedule/parking/map/monthly subpages and `/book/1stbank-center` have zero
 *   GSC impressions, zero Ahrefs rankings, zero backlinks, and zero events -> HTTP 410 Gone.
 */
export function evaluateFirstBankCenterPath(pathname: string):
  | { matched: false }
  | { matched: true; status: 200; disposition: "historical_venue_closure_200"; index: true; follow: true }
  | { matched: true; status: 410; disposition: "demolished_venue_subpage_410"; reason: string } {
  const norm = normalizeAuditPathname(pathname).toLowerCase();
  if (norm === "/venues/1stbank-center") {
    return {
      matched: true,
      status: 200,
      disposition: "historical_venue_closure_200",
      index: true,
      follow: true,
    };
  }
  if (norm.startsWith("/venues/1stbank-center/") || norm === "/book/1stbank-center") {
    return {
      matched: true,
      status: 410,
      disposition: "demolished_venue_subpage_410",
      reason:
        "1stBank Center closed permanently in Nov 2023 and was demolished in 2024; subpage has 0 events, 0 GSC impressions, and 0 backlinks.",
    };
  }
  return { matched: false };
}

/**
 * Strict 7-Point Gate for Future Indexable Red Rocks Show Pages (Requirement 3).
 * Note: A start time alone NEVER substitutes for an official primary source URL.
 */
export type FutureRedRocksShowGateInput = {
  id: string;
  title?: string | null;
  venueSlug?: string | null;
  dateKey?: string | null;
  todayDenverKey: string;
  performers?: string[];
  officialSourceUrl?: string | null;
  ticketUrl?: string | null;
  hasExplicitStartTime: boolean;
  hasExplicitDoorTime: boolean;
  bookingHref?: string | null;
  hasOperatorLogisticsSection: boolean;
  hasHonestTimeLabel: boolean;
};

export type FutureRedRocksShowGateResult = {
  passesAll: boolean;
  checks: {
    verifiedArtistVenueDate: boolean;
    officialPrimarySourceUrl: boolean;
    realParrServiceMapping: boolean;
    truthfulStartingPriceProvenance: boolean;
    functionalBookingDestination: boolean;
    usefulOperatorLogisticsContent: boolean;
    honestDoorShowTimeLabel: boolean;
  };
  failedReasons: string[];
};

const OFFICIAL_RED_ROCKS_SOURCE_HOSTS = new Set([
  "www.redrocksonline.com",
  "redrocksonline.com",
  "www.axs.com",
  "axs.com",
]);

export function isVerifiedOfficialRedRocksSourceUrl(rawUrl?: string | null): boolean {
  if (!rawUrl || typeof rawUrl !== "string") return false;
  try {
    const parsed = new URL(rawUrl.trim());
    if (parsed.protocol !== "https:") return false;
    if (!OFFICIAL_RED_ROCKS_SOURCE_HOSTS.has(parsed.hostname.toLowerCase())) return false;
    return parsed.pathname.length > 8; // must be a specific event listing, not bare homepage
  } catch {
    return false;
  }
}

export function evaluateFutureRedRocksShowGate(
  input: FutureRedRocksShowGateInput
): FutureRedRocksShowGateResult {
  const cleanPerformers = (input.performers ?? [])
    .map((p) => p.trim())
    .filter((p) => Boolean(p) && !isNonArtistParserLabel(p));

  const isRedRocks =
    input.venueSlug === "red-rocks-amphitheatre" || input.venueSlug === "redrocks";
  const validDate =
    typeof input.dateKey === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(input.dateKey) &&
    input.dateKey >= input.todayDenverKey;

  const verifiedArtistVenueDate = Boolean(
    input.title?.trim() && cleanPerformers.length > 0 && isRedRocks && validDate
  );

  // Start time alone is NEVER accepted as a substitute for an official primary source URL.
  const officialPrimarySourceUrl =
    isVerifiedOfficialRedRocksSourceUrl(input.officialSourceUrl) ||
    isVerifiedOfficialRedRocksSourceUrl(input.ticketUrl);

  const realParrServiceMapping = isRedRocks && Boolean(getParrVenueServiceSummary("red-rocks-amphitheatre"));

  const truthfulStartingPriceProvenance =
    Number.isFinite(PARR_2027_PRICING.suv) &&
    PARR_2027_PRICING.suv === 499 &&
    Number.isFinite(PARR_2027_PRICING.van) &&
    PARR_2027_PRICING.van === 699;

  const functionalBookingDestination =
    typeof input.bookingHref === "string" &&
    input.bookingHref.startsWith("/book/red-rocks-amphitheatre/private");

  const usefulOperatorLogisticsContent = Boolean(input.hasOperatorLogisticsSection);
  const honestDoorShowTimeLabel = Boolean(input.hasHonestTimeLabel);

  const checks = {
    verifiedArtistVenueDate,
    officialPrimarySourceUrl,
    realParrServiceMapping,
    truthfulStartingPriceProvenance,
    functionalBookingDestination,
    usefulOperatorLogisticsContent,
    honestDoorShowTimeLabel,
  };

  const failedReasons: string[] = [];
  if (!checks.verifiedArtistVenueDate) failedReasons.push("Missing verified artist, Red Rocks venue, or future ISO date.");
  if (!checks.officialPrimarySourceUrl) failedReasons.push("Missing verified official primary source URL (redrocksonline.com / AXS event URL).");
  if (!checks.realParrServiceMapping) failedReasons.push("Missing real PARR private vehicle service mapping.");
  if (!checks.truthfulStartingPriceProvenance) failedReasons.push("Missing canonical 2027 starting price provenance.");
  if (!checks.functionalBookingDestination) failedReasons.push("Missing functional /book/red-rocks-amphitheatre/private destination.");
  if (!checks.usefulOperatorLogisticsContent) failedReasons.push("Missing PARR-specific Red Rocks logistics and pickup content.");
  if (!checks.honestDoorShowTimeLabel) failedReasons.push("Missing honest door/showtime label.");

  return {
    passesAll: failedReasons.length === 0,
    checks,
    failedReasons,
  };
}

export type GatePageDecision = {
  action: "render_200" | "redirect_308" | "gone_410" | "not_found_404";
  index: boolean;
  follow: boolean;
  canonicalPath: string;
  redirectDestination?: string;
  disposition:
    | "manual_review_protected"
    | "manual_review_service_preserved"
    | "indexable_future_red_rocks_show"
    | "historical_red_rocks_show"
    | "thin_historical_red_rocks_show_noindex"
    | "incomplete_future_show_noindex"
    | "thin_past_secondary_show_noindex"
    | "indexable_red_rocks_artist"
    | "thin_club_only_artist_noindex"
    | "thin_band_profile_noindex"
    | "consolidated_duplicate_308"
    | "thin_artist_venue_noindex"
    | "served_venue_preserved"
    | "thin_unserved_venue_noindex"
    | "historical_venue_closure_200"
    | "demolished_venue_subpage_410"
    | "parser_artifact_404";
  flagForHumanReview: boolean;
  reason: string;
};

export const CURATED_HISTORICAL_RED_ROCKS_NOTES: Record<string, string> = {
  "rr-2026-07-03-deadrocks-xii-zeds-dead":
    "Deadrocks XII Night 2 continued Zeds Dead's signature Independence Day-week multi-night Red Rocks tradition in Morrison, pairing heavy bass production with midsummer Upper North Lot tailgating crowds.",
  "rr-2026-07-02-deadrocks-xii-zeds-dead":
    "Deadrocks XII Night 1 opened Zeds Dead's annual July Red Rocks two-night run ahead of the July 3 finale.",
  "rr-2026-05-19-kevin-gates":
    "Kevin Gates headlined this mid-May spring hip-hop evening at Red Rocks Amphitheatre (6,450 ft), where post-sunset Morrison canyon temperatures regularly drop 15–20°F.",
};

export function normalizeBaseArtistKey(rawName: string): string {
  return rawName
    .toLowerCase()
    .replace(/^deadrocks\s+[ivx]+\s*[-–:]\s*/i, "")
    .replace(/\s*[-–:]\s*(the wall|dark side of the moon|big bootie world|cyclops rocks.*|mister whatever|idols world tour|30th anniversary|day and night tour|rise of the roach tour|the forty year anomaly).*$/i, "")
    .replace(/\s+presents\s+.*$/i, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function extractDistinctBilledActs(title: string, performers?: string[]): string[] {
  const clean = (performers ?? [])
    .map((p) => p.trim())
    .filter((p) => Boolean(p) && !isNonArtistParserLabel(p));
  if (clean.length >= 2) return clean;
  // Detect multi-artist co-headline titles collapsed into one SeatGeek string
  if (/,/.test(title) || /\s+(&|and|with|b2b|x)\s+/i.test(title)) {
    const parts = title
      .split(/,|\s+(?:with|b2b)\s+/i)
      .map((s) => s.trim())
      .filter((s) => s.length >= 2 && !isNonArtistParserLabel(s));
    if (parts.length >= 2) return parts;
  }
  return clean;
}

export function evaluateHistoricalRedRocksShowQualification(input: {
  id: string;
  title?: string | null;
  performers?: string[];
  companionRunShowIds?: string[];
  verifiedFutureArtistShowIds?: string[];
  setlistSongCount?: number;
}): {
  qualifiesForIndex: boolean;
  distinctSignals: string[];
} {
  const signals: string[] = [];
  if (CURATED_HISTORICAL_RED_ROCKS_NOTES[input.id]) {
    signals.push("curated_historical_residency_note");
  }
  const billedActs = extractDistinctBilledActs(input.title || "", input.performers);
  if (billedActs.length >= 2) {
    signals.push(`verified_multi_artist_bill_${billedActs.length}`);
  }
  if ((input.companionRunShowIds?.length ?? 0) > 0) {
    signals.push(`multi_night_red_rocks_run_${(input.companionRunShowIds?.length ?? 0) + 1}_nights`);
  }
  if ((input.verifiedFutureArtistShowIds?.length ?? 0) > 0) {
    signals.push(`verified_future_return_dates_${input.verifiedFutureArtistShowIds?.length}`);
  }
  if ((input.setlistSongCount ?? 0) > 0) {
    signals.push(`archived_setlist_songs_${input.setlistSongCount}`);
  }
  return {
    qualifiesForIndex: signals.length > 0,
    distinctSignals: signals,
  };
}

export function evaluateShowPageDisposition(input: {
  id: string;
  title?: string | null;
  venueSlug?: string | null;
  dateKey?: string | null;
  todayDenverKey: string;
  performers?: string[];
  officialSourceUrl?: string | null;
  ticketUrl?: string | null;
  hasExplicitStartTime: boolean;
  hasExplicitDoorTime: boolean;
  bookingHref?: string | null;
  hasOperatorLogisticsSection: boolean;
  hasHonestTimeLabel: boolean;
  hasDistinctHistoricalContent?: boolean;
}): GatePageDecision {
  const pathname = `/shows/${encodeURIComponent(input.id)}`;
  const protectedHit = getManualReviewProtectedEvidence(pathname);
  const isRedRocks =
    input.venueSlug === "red-rocks-amphitheatre" || input.venueSlug === "redrocks";
  const isPast = Boolean(input.dateKey && input.dateKey < input.todayDenverKey);

  if (protectedHit) {
    return {
      action: "render_200",
      index: true,
      follow: true,
      canonicalPath: pathname,
      disposition: "manual_review_protected",
      flagForHumanReview: true,
      reason: `Manual-review protected URL (${protectedHit.baselineSummary})`,
    };
  }

  if (!isPast && isRedRocks) {
    const gate = evaluateFutureRedRocksShowGate(input);
    if (gate.passesAll) {
      return {
        action: "render_200",
        index: true,
        follow: true,
        canonicalPath: pathname,
        disposition: "indexable_future_red_rocks_show",
        flagForHumanReview: false,
        reason: "Passes all 7 future Red Rocks show publication/indexation requirements.",
      };
    }
    return {
      action: "render_200",
      index: false,
      follow: true,
      canonicalPath: pathname,
      disposition: "incomplete_future_show_noindex",
      flagForHumanReview: true,
      reason: gate.failedReasons.join(" "),
    };
  }

  if (isPast && isRedRocks) {
    const qualifies = input.hasDistinctHistoricalContent ?? false;
    if (qualifies) {
      return {
        action: "render_200",
        index: true,
        follow: true,
        canonicalPath: pathname,
        disposition: "historical_red_rocks_show",
        flagForHumanReview: false,
        reason:
          "Completed historical Red Rocks show with verified distinct lineup, multi-night residency, or 2027 return-date archive context.",
      };
    }
    return {
      action: "render_200",
      index: false,
      follow: true,
      canonicalPath: pathname,
      disposition: "thin_historical_red_rocks_show_noindex",
      flagForHumanReview: false,
      reason:
        "Completed single-artist Red Rocks stub without distinct lineup, setlist, multi-night run, or future return-date archive content; held at 200 noindex, follow until enriched.",
    };
  }

  if (!isPast && isParrServedVenue(input.venueSlug)) {
    return {
      action: "render_200",
      index: true,
      follow: true,
      canonicalPath: pathname,
      disposition: "manual_review_service_preserved",
      flagForHumanReview: true,
      reason: "Upcoming concert at a PARR-served Front Range venue preserved for manual review.",
    };
  }

  return {
    action: "render_200",
    index: false,
    follow: true,
    canonicalPath: pathname,
    disposition: "thin_past_secondary_show_noindex",
    flagForHumanReview: false,
    reason: "Completed or unserved secondary-venue club show without traffic/backlinks or active PARR service.",
  };
}

export function evaluateArtistPageDisposition(input: {
  artistSlug: string;
  upcomingRedRocksCount: number;
  historicalRedRocksCount: number;
  upcomingServedSecondaryCount: number;
}): GatePageDecision {
  const pathname = `/artists/${encodeURIComponent(input.artistSlug)}`;
  const protectedHit = getManualReviewProtectedEvidence(pathname);
  if (protectedHit) {
    return {
      action: "render_200",
      index: true,
      follow: true,
      canonicalPath: pathname,
      disposition: "manual_review_protected",
      flagForHumanReview: true,
      reason: `Manual-review protected URL (${protectedHit.baselineSummary})`,
    };
  }

  const artifactCheck = evaluateParserArtifactSlug(input.artistSlug);
  if (artifactCheck.isArtifact) {
    if (artifactCheck.action === "not_found") {
      return {
        action: "not_found_404",
        index: false,
        follow: false,
        canonicalPath: pathname,
        disposition: "parser_artifact_404",
        flagForHumanReview: false,
        reason: artifactCheck.reason,
      };
    }
    return {
      action: "redirect_308",
      index: false,
      follow: true,
      canonicalPath: artifactCheck.destination,
      redirectDestination: artifactCheck.destination,
      disposition: "consolidated_duplicate_308",
      flagForHumanReview: false,
      reason: artifactCheck.reason,
    };
  }

  if (input.upcomingRedRocksCount > 0 || input.historicalRedRocksCount > 0) {
    return {
      action: "render_200",
      index: true,
      follow: true,
      canonicalPath: pathname,
      disposition: "indexable_red_rocks_artist",
      flagForHumanReview: false,
      reason: "Artist has verified Red Rocks concert history or confirmed 2027 Red Rocks dates.",
    };
  }

  if (input.upcomingServedSecondaryCount > 0) {
    return {
      action: "render_200",
      index: true,
      follow: true,
      canonicalPath: pathname,
      disposition: "manual_review_service_preserved",
      flagForHumanReview: true,
      reason: "Artist has upcoming dates at a PARR-served Front Range charter venue; preserved for manual review.",
    };
  }

  return {
    action: "render_200",
    index: false,
    follow: true,
    canonicalPath: pathname,
    disposition: "thin_club_only_artist_noindex",
    flagForHumanReview: false,
    reason: "Club-only past artist with zero Red Rocks shows, zero upcoming served shows, and zero GSC/backlink signals.",
  };
}

/**
 * Evaluates `/bands/[id]` consolidation while guaranteeing NO 308 redirect ever terminates
 * on a `noindex` or non-200 page (SEO Production Gate 4).
 */
export function evaluateBandPageDisposition(input: {
  bandId: string;
  artistSlug: string;
  upcomingRedRocksCount: number;
  historicalRedRocksCount: number;
  upcomingServedSecondaryCount: number;
}): GatePageDecision {
  const pathname = `/bands/${encodeURIComponent(input.bandId)}`;
  const protectedHit = getManualReviewProtectedEvidence(pathname);
  if (protectedHit) {
    return {
      action: "render_200",
      index: true,
      follow: true,
      canonicalPath: pathname,
      disposition: "manual_review_protected",
      flagForHumanReview: true,
      reason: `Manual-review protected URL (${protectedHit.baselineSummary})`,
    };
  }

  const artifactCheck = evaluateParserArtifactSlug(input.artistSlug);
  if (artifactCheck.isArtifact) {
    if (artifactCheck.action === "not_found") {
      return {
        action: "not_found_404",
        index: false,
        follow: false,
        canonicalPath: pathname,
        disposition: "parser_artifact_404",
        flagForHumanReview: false,
        reason: artifactCheck.reason,
      };
    }
    return {
      action: "redirect_308",
      index: false,
      follow: true,
      canonicalPath: artifactCheck.destination,
      redirectDestination: artifactCheck.destination,
      disposition: "consolidated_duplicate_308",
      flagForHumanReview: false,
      reason: artifactCheck.reason,
    };
  }

  const targetArtistDecision = evaluateArtistPageDisposition({
    artistSlug: input.artistSlug,
    upcomingRedRocksCount: input.upcomingRedRocksCount,
    historicalRedRocksCount: input.historicalRedRocksCount,
    upcomingServedSecondaryCount: input.upcomingServedSecondaryCount,
  });

  if (targetArtistDecision.action === "render_200" && targetArtistDecision.index) {
    const target = `/artists/${encodeURIComponent(input.artistSlug)}`;
    return {
      action: "redirect_308",
      index: false,
      follow: true,
      canonicalPath: target,
      redirectDestination: target,
      disposition: "consolidated_duplicate_308",
      flagForHumanReview: false,
      reason: "Exact 1:1 duplicate of indexable HTTP 200 canonical /artists/[artist] profile; consolidated via 1-hop 308.",
    };
  }

  return {
    action: "render_200",
    index: false,
    follow: true,
    canonicalPath: pathname,
    disposition: "thin_band_profile_noindex",
    flagForHumanReview: false,
    reason:
      "Thin club-only /bands/[id] profile kept at HTTP 200 noindex, follow (never 308-redirected into a noindex /artists/[artist] page).",
  };
}

export function evaluateArtistVenuePageDisposition(input: {
  artistSlug: string;
  venueSlug: string;
  distinctVenueCountForArtist: number;
  artistHasRedRocksShow: boolean;
  upcomingAtVenueCount: number;
}): GatePageDecision {
  const pathname = `/artists/${encodeURIComponent(input.artistSlug)}/${encodeURIComponent(input.venueSlug)}`;
  const protectedHit = getManualReviewProtectedEvidence(pathname);
  if (protectedHit) {
    return {
      action: "render_200",
      index: true,
      follow: true,
      canonicalPath: pathname,
      disposition: "manual_review_protected",
      flagForHumanReview: true,
      reason: `Manual-review protected URL (${protectedHit.baselineSummary})`,
    };
  }

  if (input.venueSlug === "1stbank-center") {
    return {
      action: "gone_410",
      index: false,
      follow: false,
      canonicalPath: pathname,
      disposition: "demolished_venue_subpage_410",
      flagForHumanReview: false,
      reason: "1stBank Center permanently closed and demolished.",
    };
  }

  const artifactCheck = evaluateParserArtifactSlug(input.artistSlug);
  if (artifactCheck.isArtifact) {
    if (artifactCheck.action === "not_found") {
      return {
        action: "not_found_404",
        index: false,
        follow: false,
        canonicalPath: pathname,
        disposition: "parser_artifact_404",
        flagForHumanReview: false,
        reason: artifactCheck.reason,
      };
    }
    return {
      action: "redirect_308",
      index: false,
      follow: true,
      canonicalPath: artifactCheck.destination,
      redirectDestination: artifactCheck.destination,
      disposition: "consolidated_duplicate_308",
      flagForHumanReview: false,
      reason: artifactCheck.reason,
    };
  }

  // True duplicate consolidation: When a Red Rocks artist's ONLY venue in the catalog is Red Rocks
  // (or the URL is /artists/{artist}/red-rocks-amphitheatre where /artists/{artist} already leads with
  // the exact same Red Rocks shows), consolidate 1-hop 308 to the canonical /artists/{artist} hub.
  if (
    input.venueSlug === "red-rocks-amphitheatre" &&
    input.artistHasRedRocksShow
  ) {
    const target = `/artists/${encodeURIComponent(input.artistSlug)}`;
    return {
      action: "redirect_308",
      index: false,
      follow: true,
      canonicalPath: target,
      redirectDestination: target,
      disposition: "consolidated_duplicate_308",
      flagForHumanReview: false,
      reason: "True duplicate of canonical Red Rocks artist page /artists/[artist]; consolidated via 1-hop 308.",
    };
  }

  // Preserve upcoming served-venue combinations for manual review
  if (input.upcomingAtVenueCount > 0 && isParrServedVenue(input.venueSlug)) {
    return {
      action: "render_200",
      index: true,
      follow: true,
      canonicalPath: pathname,
      disposition: "manual_review_service_preserved",
      flagForHumanReview: true,
      reason: "Upcoming show at PARR-served secondary venue preserved for manual review.",
    };
  }

  return {
    action: "render_200",
    index: false,
    follow: true,
    canonicalPath: pathname,
    disposition: "thin_artist_venue_noindex",
    flagForHumanReview: false,
    reason: "Thin past secondary-club artist×venue permutation without unique content or search signals.",
  };
}

export function evaluateVenuePageDisposition(venueSlug: string, subpage?: string): GatePageDecision {
  const cleanVenue = venueSlug.trim().toLowerCase();
  const pathname = subpage ? `/venues/${cleanVenue}/${subpage}` : `/venues/${cleanVenue}`;
  const protectedHit = getManualReviewProtectedEvidence(pathname);
  if (protectedHit) {
    return {
      action: "render_200",
      index: true,
      follow: true,
      canonicalPath: pathname,
      disposition: "manual_review_protected",
      flagForHumanReview: true,
      reason: `Manual-review protected URL (${protectedHit.baselineSummary})`,
    };
  }

  const fb = evaluateFirstBankCenterPath(pathname);
  if (fb.matched) {
    if (fb.status === 200) {
      return {
        action: "render_200",
        index: true,
        follow: true,
        canonicalPath: pathname,
        disposition: "historical_venue_closure_200",
        flagForHumanReview: true,
        reason: "Truthful historical closure reference page for demolished 1stBank Center.",
      };
    }
    return {
      action: "gone_410",
      index: false,
      follow: false,
      canonicalPath: pathname,
      disposition: "demolished_venue_subpage_410",
      flagForHumanReview: false,
      reason: fb.reason,
    };
  }

  if (isParrServedVenue(cleanVenue)) {
    return {
      action: "render_200",
      index: true,
      follow: true,
      canonicalPath: pathname,
      disposition: "served_venue_preserved",
      flagForHumanReview: cleanVenue !== "red-rocks-amphitheatre",
      reason: `Active PARR-served venue (${getParrVenueServiceSummary(cleanVenue)}).`,
    };
  }

  return {
    action: "render_200",
    index: false,
    follow: true,
    canonicalPath: pathname,
    disposition: "thin_unserved_venue_noindex",
    flagForHumanReview: false,
    reason: "Secondary venue without an active PARR transportation offering or search/backlink signals.",
  };
}

/**
 * Generates authentic, season-aware Red Rocks transportation & tailgating logistics copy
 * for verified future Red Rocks show pages.
 */
export function buildRedRocksShowLogisticsGuidance(input: {
  dateKey: string;
  startLocal?: string | null;
  hasExplicitTime: boolean;
  hasExplicitDoorTime: boolean;
}) {
  const monthNum = Number.parseInt(input.dateKey.split("-")[1] ?? "6", 10);

  let weatherNote =
    "Red Rocks sits at 6,450 feet in open Morrison foothill terrain—pack a wind/rain shell even after a warm Denver afternoon, as canyon temperatures commonly drop 15–20°F after sunset.";
  if (monthNum <= 4 || monthNum >= 10) {
    weatherNote =
      "Early-spring and late-fall Red Rocks nights at 6,450 feet regularly dip into the 30s–40s°F after dark with brisk foothill wind. Bring insulated layers, gloves, and closed-toe shoes—and stash extra heavy coats safely inside your locked private Suburban or Van during the set.";
  } else if (monthNum === 5 || monthNum === 9) {
    weatherNote =
      "Shoulder-season nights in May and September swing from sunny 70s°F at tailgate time into the 40s–50s°F by encore. Keep a warm mid-layer and rain shell in your vehicle and grab what you need before walking into the amphitheatre.";
  } else {
    weatherNote =
      "Summer afternoons in Morrison can pass 85°F before brief Front Range thunderstorms roll through around doors. Hydrate early at the tailgate, bring a breathable rain shell, and leave coolers and extra bags locked in your private vehicle during the show.";
  }

  let timeGuidance =
    "Official door and showtime hours have not yet been split on the venue calendar—confirm final door times on redrocksonline.com during show week.";
  let pickupWindowGuidance =
    "Most private groups schedule Denver/Golden hotel or Airbnb pickup 2.5 to 3 hours before listed event time to enjoy 90+ minutes of relaxed Upper North Lot tailgating before walking in.";

  if (input.hasExplicitTime && input.startLocal) {
    const dt = new Date(input.startLocal);
    if (!Number.isNaN(dt.getTime())) {
      const formattedTime = dt.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      });
      timeGuidance = input.hasExplicitDoorTime
        ? `Listed event time: ${formattedTime} MT.`
        : `Official listing time: ${formattedTime} MT (separate door vs. showtime split not yet posted—verify final door time on redrocksonline.com before show night).`;
      pickupWindowGuidance = `With a ${formattedTime} MT listed start, most Denver-area groups schedule door-to-door pickup 2.5–3 hours prior so you arrive in the Upper North Lot with unhurried tailgating time before entry.`;
    }
  } else {
    timeGuidance =
      "Doors & showtime: TBA on official Red Rocks venue listing (verify on redrocksonline.com closer to show night).";
  }

  return {
    timeGuidance,
    pickupWindowGuidance,
    upperNorthTailgateGuidance:
      "Your Private Suburban ($518.96 total: $499.00 base + $19.96 Booking fee (4%), up to 6 guests) or 10-Passenger Van ($726.96 total: $699.00 base + $27.96 Booking fee (4%), up to 10 guests) stages in the Upper North Lot—Red Rocks' premier top-of-venue party lot—stocked with folding chairs, a cooler with fresh ice, and a Bluetooth speaker, plus one optional grocery/liquor stop en route. Your complete total is shown before payment.",
    postEncoreExitGuidance:
      "Your driver and vehicle stay at Red Rocks throughout the entire concert. After the encore, walk back to your waiting vehicle at the top lot instead of hiking down to the Jurassic Lot rideshare queue or waiting out post-show surge pricing.",
    weatherNote,
  };
}
