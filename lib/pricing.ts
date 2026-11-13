export const PARR_2026_PRICING = {
  suv: 399,
  van: 599,
  sprinter: 799,
  "party-bus": 1199,
} as const;

export const PARR_2027_PRICING = {
  suv: 499,
  van: 699,
  sprinter: 799,
  "party-bus": 1199,
} as const;

export type PrivatePricingSlug = keyof typeof PARR_2027_PRICING;

export const SUBURBAN_2027_USD = PARR_2027_PRICING.suv;
export const VAN_2027_USD = PARR_2027_PRICING.van;

export function isLegacy2026ServiceDate(serviceDate?: string | null): boolean {
  const trimmed = typeof serviceDate === "string" ? serviceDate.trim() : "";
  if (!trimmed) return false;
  const isoMatch = /^(\d{4})-\d{2}-\d{2}/.exec(trimmed);
  if (isoMatch) {
    return Number(isoMatch[1]) <= 2026;
  }
  const parsed = Date.parse(trimmed);
  if (!Number.isNaN(parsed)) {
    return new Date(parsed).getUTCFullYear() <= 2026;
  }
  return false;
}

export function getPrivateRidePricingForDate(input: {
  optionSlug: string;
  serviceDate?: string | null;
  legacyAmount?: number | null;
}): {
  priceUsd: number;
  priceLabel: string;
  roundTripLabel: string;
  season: "2027" | "2026" | "preserved";
} {
  if (
    typeof input.legacyAmount === "number" &&
    Number.isFinite(input.legacyAmount) &&
    input.legacyAmount > 0
  ) {
    const rounded = Math.round(input.legacyAmount);
    return {
      priceUsd: rounded,
      priceLabel: `$${rounded}`,
      roundTripLabel: `$${rounded} flat round-trip`,
      season: "preserved",
    };
  }

  const slug = (
    input.optionSlug in PARR_2027_PRICING ? input.optionSlug : "suv"
  ) as PrivatePricingSlug;
  const use2026 = isLegacy2026ServiceDate(input.serviceDate);
  const priceUsd = use2026 ? PARR_2026_PRICING[slug] : PARR_2027_PRICING[slug];

  return {
    priceUsd,
    priceLabel: `$${priceUsd}`,
    roundTripLabel: `$${priceUsd} flat round-trip`,
    season: use2026 ? "2026" : "2027",
  };
}

export const PARR_VALUE_PROPOSITION = {
  headline: "One flat vehicle price—round-trip, tailgating, and on-site wait included",
  summary:
    "Your private Red Rocks transportation includes round-trip service, Denver-area pickup, coordinated arrival, tailgating time and setup, a driver and vehicle that remain at Red Rocks throughout the show, and your return ride home—all for one flat vehicle price.",
  tailgatingSummary:
    "Tailgating setup includes chairs, cooler, ice, speaker, and time to tailgate before the show, staging in the Upper North Lot (Red Rocks' primary pre-show tailgating and party area).",
  tailgatingItems: [
    "Chairs",
    "Cooler",
    "Ice",
    "Speaker",
    "Time to tailgate before the show",
    "Upper North Lot staging (Red Rocks' primary pre-show tailgating and party area)",
  ],
  flowSteps: [
    "Pickup",
    "Optional grocery/liquor stop",
    "Upper North Lot arrival",
    "Chairs, cooler, ice & speaker",
    "Tailgate",
    "Concert while vehicle waits",
    "Same vehicle home",
  ],
  exclusions: [
    "Concert admission",
    "Optional purchases",
    "Gratuity",
    "Additional unplanned stops",
  ],
  exclusionsSummary:
    "Excludes concert admission, optional purchases, gratuity, and additional unplanned stops.",
} as const;

export const SHUTTLE_PRICING = {
  redRocks: {
    suburban: `$${SUBURBAN_2027_USD} flat round-trip`,
    van10: `$${VAN_2027_USD} flat round-trip`,
  },
  mishawaka: {
    privateSuburban: "$599 round-trip",
  },
  denverBoulderOtherVenues: {
    suburban: "$250 flat round-trip (up to 6-7 passengers)",
  },
} as const;
