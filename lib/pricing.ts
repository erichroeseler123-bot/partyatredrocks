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
export type ParrAuthoritativeVehicleSlug = "suv" | "van";

/**
 * Preserved 2027 base vehicle amounts (USD) for standalone Square fallback & historical comparisons.
 * Current 2027 Rezdy-backed bookable surfaces MUST consume `PARR_2027_OPTION_B_PRICING_AUTHORITY`
 * below so the intentional 4% Booking fee and all-in total ($518.96 / $726.96) are never omitted.
 */
export const SUBURBAN_2027_USD = PARR_2027_PRICING.suv;
export const VAN_2027_USD = PARR_2027_PRICING.van;

export const PARR_BOOKING_FEE_BPS = 400 as const; // 4.00% = 400 basis points
export const PARR_BOOKING_FEE_RATE_PCT = 4 as const;
export const PARR_BOOKING_FEE_LABEL = "Booking fee (4%)" as const;
export const PARR_PRICING_EFFECTIVE_SEASON = "2027" as const;
export const PARR_PRICING_VERSION = "2027.v2-option-b" as const;
export const PARR_COMPLETE_TOTAL_DISCLOSURE = "Your complete total is shown before payment." as const;

export type ParrAuthoritativeVehiclePricing = {
  slug: ParrAuthoritativeVehicleSlug;
  dccProductCode: "parr-suburban" | "parr-van-10";
  shortLabel: string;
  displayName: string;
  maxGuests: number;
  dailyVehicleCapacity: number;
  effectiveSeason: typeof PARR_PRICING_EFFECTIVE_SEASON;
  version: typeof PARR_PRICING_VERSION;
  basePriceCents: number;
  bookingFeeBps: number;
  bookingFeeRatePct: number;
  bookingFeeLabel: typeof PARR_BOOKING_FEE_LABEL;
  calculatedBookingFeeCents: number;
  allInTotalCents: number;
  basePriceUsd: number;
  bookingFeeUsd: number;
  allInTotalUsd: number;
  basePriceFormatted: string;
  bookingFeeFormatted: string;
  allInTotalFormatted: string;
  schemaPriceString: string;
  approxMaxGroupEachCents: number;
  approxMaxGroupEachFormatted: string;
  itemizedSummary: string;
  rezdy: {
    previewProductCode: "P94HN4" | "PU8R6Y";
    previewInternalCode: "PARR_2027_SUBURBAN_API_TEST" | "PARR_2027_VAN_API_TEST";
    legacyPublicWidgetProductId: "596193" | "630812";
    legacyPublicProductCode: "P0U1MY" | "PJM9GD";
  };
};

function buildAuthoritativeVehiclePricing(input: {
  slug: ParrAuthoritativeVehicleSlug;
  dccProductCode: "parr-suburban" | "parr-van-10";
  shortLabel: string;
  displayName: string;
  maxGuests: number;
  dailyVehicleCapacity: number;
  basePriceCents: number;
  rezdy: ParrAuthoritativeVehiclePricing["rezdy"];
}): ParrAuthoritativeVehiclePricing {
  const calculatedBookingFeeCents = Math.round(
    (input.basePriceCents * PARR_BOOKING_FEE_BPS) / 10_000
  );
  const allInTotalCents = input.basePriceCents + calculatedBookingFeeCents;
  const basePriceUsd = input.basePriceCents / 100;
  const bookingFeeUsd = calculatedBookingFeeCents / 100;
  const allInTotalUsd = allInTotalCents / 100;
  const basePriceFormatted = `$${basePriceUsd.toFixed(2)}`;
  const bookingFeeFormatted = `$${bookingFeeUsd.toFixed(2)}`;
  const allInTotalFormatted = `$${allInTotalUsd.toFixed(2)}`;
  const schemaPriceString = allInTotalUsd.toFixed(2);
  const approxMaxGroupEachCents = Math.round(allInTotalCents / input.maxGuests);
  const approxDollars = Math.round(approxMaxGroupEachCents / 100);
  const approxMaxGroupEachFormatted = `approximately $${approxDollars} each for ${input.maxGuests}`;

  return {
    slug: input.slug,
    dccProductCode: input.dccProductCode,
    shortLabel: input.shortLabel,
    displayName: input.displayName,
    maxGuests: input.maxGuests,
    dailyVehicleCapacity: input.dailyVehicleCapacity,
    effectiveSeason: PARR_PRICING_EFFECTIVE_SEASON,
    version: PARR_PRICING_VERSION,
    basePriceCents: input.basePriceCents,
    bookingFeeBps: PARR_BOOKING_FEE_BPS,
    bookingFeeRatePct: PARR_BOOKING_FEE_RATE_PCT,
    bookingFeeLabel: PARR_BOOKING_FEE_LABEL,
    calculatedBookingFeeCents,
    allInTotalCents,
    basePriceUsd,
    bookingFeeUsd,
    allInTotalUsd,
    basePriceFormatted,
    bookingFeeFormatted,
    allInTotalFormatted,
    schemaPriceString,
    approxMaxGroupEachCents,
    approxMaxGroupEachFormatted,
    itemizedSummary: `${basePriceFormatted} base + ${bookingFeeFormatted} ${PARR_BOOKING_FEE_LABEL}`,
    rezdy: input.rezdy,
  };
}

/**
 * Single authoritative 2027 Option B pricing & capacity definition (integer cents).
 * - Suburban: 49900 base + 1996 (4% Booking fee) = 51896 ($518.96 total), 6 vehicles/date
 * - Van:      69900 base + 2796 (4% Booking fee) = 72696 ($726.96 total), 3 vehicles/date
 */
export const PARR_2027_OPTION_B_PRICING_AUTHORITY: Readonly<
  Record<ParrAuthoritativeVehicleSlug, Readonly<ParrAuthoritativeVehiclePricing>>
> = Object.freeze({
  suv: Object.freeze(
    buildAuthoritativeVehiclePricing({
      slug: "suv",
      dccProductCode: "parr-suburban",
      shortLabel: "Private Suburban",
      displayName: "Private Suburban (Up to 6 Guests)",
      maxGuests: 6,
      dailyVehicleCapacity: 6,
      basePriceCents: 49_900,
      rezdy: {
        previewProductCode: "P94HN4",
        previewInternalCode: "PARR_2027_SUBURBAN_API_TEST",
        legacyPublicWidgetProductId: "596193",
        legacyPublicProductCode: "P0U1MY",
      },
    })
  ),
  van: Object.freeze(
    buildAuthoritativeVehiclePricing({
      slug: "van",
      dccProductCode: "parr-van-10",
      shortLabel: "Private Van",
      displayName: "Private 10-Passenger Van (Up to 10 Guests)",
      maxGuests: 10,
      dailyVehicleCapacity: 3,
      basePriceCents: 69_900,
      rezdy: {
        previewProductCode: "PU8R6Y",
        previewInternalCode: "PARR_2027_VAN_API_TEST",
        legacyPublicWidgetProductId: "630812",
        legacyPublicProductCode: "PJM9GD",
      },
    })
  ),
});

export const SUBURBAN_2027_BOOKING_FEE_CENTS =
  PARR_2027_OPTION_B_PRICING_AUTHORITY.suv.calculatedBookingFeeCents;
export const SUBURBAN_2027_ALL_IN_TOTAL_CENTS =
  PARR_2027_OPTION_B_PRICING_AUTHORITY.suv.allInTotalCents;
export const SUBURBAN_2027_BOOKING_FEE_USD =
  PARR_2027_OPTION_B_PRICING_AUTHORITY.suv.bookingFeeUsd;
export const SUBURBAN_2027_ALL_IN_TOTAL_USD =
  PARR_2027_OPTION_B_PRICING_AUTHORITY.suv.allInTotalUsd;

export const VAN_2027_BOOKING_FEE_CENTS =
  PARR_2027_OPTION_B_PRICING_AUTHORITY.van.calculatedBookingFeeCents;
export const VAN_2027_ALL_IN_TOTAL_CENTS =
  PARR_2027_OPTION_B_PRICING_AUTHORITY.van.allInTotalCents;
export const VAN_2027_BOOKING_FEE_USD =
  PARR_2027_OPTION_B_PRICING_AUTHORITY.van.bookingFeeUsd;
export const VAN_2027_ALL_IN_TOTAL_USD =
  PARR_2027_OPTION_B_PRICING_AUTHORITY.van.allInTotalUsd;

export function getAuthoritativeOptionBPricing(
  slug: ParrAuthoritativeVehicleSlug
): Readonly<ParrAuthoritativeVehiclePricing> {
  return PARR_2027_OPTION_B_PRICING_AUTHORITY[slug];
}

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
      roundTripLabel: `$${rounded} round-trip`,
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
    roundTripLabel:
      !use2026 && (slug === "suv" || slug === "van")
        ? `${PARR_2027_OPTION_B_PRICING_AUTHORITY[slug].allInTotalFormatted} total (${PARR_2027_OPTION_B_PRICING_AUTHORITY[slug].itemizedSummary})`
        : `$${priceUsd} round-trip`,
    season: use2026 ? "2026" : "2027",
  };
}

export const PARR_VALUE_PROPOSITION = {
  headline: "Upfront all-in vehicle total—round-trip, tailgating, and on-site wait included",
  summary:
    "Your private Red Rocks transportation includes round-trip service, Denver-area pickup, coordinated arrival, tailgating time and setup, a driver and vehicle that remain at Red Rocks throughout the show, and your return ride home. Your complete total is shown before payment.",
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
    suburban: `${PARR_2027_OPTION_B_PRICING_AUTHORITY.suv.allInTotalFormatted} total (${PARR_2027_OPTION_B_PRICING_AUTHORITY.suv.itemizedSummary})`,
    van10: `${PARR_2027_OPTION_B_PRICING_AUTHORITY.van.allInTotalFormatted} total (${PARR_2027_OPTION_B_PRICING_AUTHORITY.van.itemizedSummary})`,
  },
  mishawaka: {
    privateSuburban: "$599 round-trip",
  },
  denverBoulderOtherVenues: {
    suburban: "$250 flat round-trip (up to 6-7 passengers)",
  },
} as const;
