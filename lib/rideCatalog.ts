import { BOOKING_COPY } from "@/lib/bookingCopy";
import {
  PARR_2027_OPTION_B_PRICING_AUTHORITY,
  SUBURBAN_2027_USD,
  VAN_2027_USD,
} from "@/lib/pricing";

export const SITE = "https://www.partyatredrocks.com";

export const SUBURBAN_PRICE = SUBURBAN_2027_USD;
export const SUBURBAN_PRICE_LABEL = `$${SUBURBAN_2027_USD}`;
export const VAN_PRICE = VAN_2027_USD;
export const VAN_PRICE_LABEL = `$${VAN_2027_USD}`;

export const SUBURBAN_ALL_IN_TOTAL_LABEL =
  PARR_2027_OPTION_B_PRICING_AUTHORITY.suv.allInTotalFormatted;
export const SUBURBAN_BASE_FORMATTED =
  PARR_2027_OPTION_B_PRICING_AUTHORITY.suv.basePriceFormatted;
export const SUBURBAN_FEE_FORMATTED =
  PARR_2027_OPTION_B_PRICING_AUTHORITY.suv.bookingFeeFormatted;
export const SUBURBAN_ITEMIZED_LABEL =
  PARR_2027_OPTION_B_PRICING_AUTHORITY.suv.itemizedSummary;
export const SUBURBAN_APPROX_EACH_LABEL =
  PARR_2027_OPTION_B_PRICING_AUTHORITY.suv.approxMaxGroupEachFormatted;

export const VAN_ALL_IN_TOTAL_LABEL =
  PARR_2027_OPTION_B_PRICING_AUTHORITY.van.allInTotalFormatted;
export const VAN_BASE_FORMATTED =
  PARR_2027_OPTION_B_PRICING_AUTHORITY.van.basePriceFormatted;
export const VAN_FEE_FORMATTED =
  PARR_2027_OPTION_B_PRICING_AUTHORITY.van.bookingFeeFormatted;
export const VAN_ITEMIZED_LABEL =
  PARR_2027_OPTION_B_PRICING_AUTHORITY.van.itemizedSummary;
export const VAN_APPROX_EACH_LABEL =
  PARR_2027_OPTION_B_PRICING_AUTHORITY.van.approxMaxGroupEachFormatted;

export const SHARED_RIDE = {
  slug: "shared",
  title: BOOKING_COPY.labels.sharedRideTitle,
  heroEyebrow: BOOKING_COPY.labels.sharedBookingEyebrow,
  heroTitle: BOOKING_COPY.labels.sharedBookingTitle,
  heroCopy: BOOKING_COPY.copy.sharedRide,
  priceLabel: SUBURBAN_ALL_IN_TOTAL_LABEL,
  cardTitle: "Private Red Rocks Transportation",
  cardBody: BOOKING_COPY.copy.sharedRideCard,
} as const;

export const PRIVATE_RIDE_BENEFITS = [
  "Upper North limo-lane access",
  "Best fit for groups that want to tailgate before the show",
  BOOKING_COPY.trust.oneVehiclePlan,
  "Pickup details sent before your ride",
  "Return ride handled after the show",
] as const;

export const PRIVATE_RIDE_OPTIONS = [
  {
    slug: "suv",
    title: "Private Suburban",
    eyebrow: `${SUBURBAN_ALL_IN_TOTAL_LABEL} total • Up to 6 guests`,
    body: "Private Suburban for smaller groups that want direct pickup, limo-lane access, and time to tailgate before the show.",
    priceLabel: SUBURBAN_ALL_IN_TOTAL_LABEL,
    basePriceLabel: SUBURBAN_BASE_FORMATTED,
    bookingFeeLabel: SUBURBAN_FEE_FORMATTED,
    itemizedLabel: SUBURBAN_ITEMIZED_LABEL,
    schemaPrice: PARR_2027_OPTION_B_PRICING_AUTHORITY.suv.schemaPriceString,
    dccProduct: "parr-suburban",
    ctaLabel: "Book Private Suburban",
  },
  {
    slug: "van",
    title: "Upgrade to Private Van",
    eyebrow: `${VAN_ALL_IN_TOTAL_LABEL} total • Up to 10 Guests`,
    body: "One vehicle, one pickup plan, Upper North Lot tailgating setup, and one return timeline for groups that need more room.",
    priceLabel: VAN_ALL_IN_TOTAL_LABEL,
    basePriceLabel: VAN_BASE_FORMATTED,
    bookingFeeLabel: VAN_FEE_FORMATTED,
    itemizedLabel: VAN_ITEMIZED_LABEL,
    schemaPrice: PARR_2027_OPTION_B_PRICING_AUTHORITY.van.schemaPriceString,
    dccProduct: "parr-van-10",
    ctaLabel: "Book Private Van",
  },
  {
    slug: "sprinter",
    title: "14 Passenger Sprinter",
    eyebrow: "$799 • Up to 14 Guests",
    body: "Best for larger groups that want more space, limo-lane access, and one vehicle for the full night.",
    priceLabel: "$799",
    basePriceLabel: "$799.00",
    bookingFeeLabel: null,
    itemizedLabel: "$799 custom quote",
    schemaPrice: "799.00",
    dccProduct: "parr-sprinter-14",
    ctaLabel: "Start Sprinter Checkout",
  },
  {
    slug: "party-bus",
    title: "24 Passenger Party Bus",
    eyebrow: "$1199 • Up to 24 Guests",
    body: "Best for larger groups who want to tailgate, stay together, and make the ride part of the night.",
    priceLabel: "$1199",
    basePriceLabel: "$1199.00",
    bookingFeeLabel: null,
    itemizedLabel: "$1199 custom quote",
    schemaPrice: "1199.00",
    dccProduct: "parr-party-bus-24",
    ctaLabel: "Start Party Bus Checkout",
  },
] as const;

export type PrivateRideOption = (typeof PRIVATE_RIDE_OPTIONS)[number];
export type PrivateRideSlug = PrivateRideOption["slug"];

export const PUBLIC_PRIVATE_RIDE_OPTIONS = [PRIVATE_RIDE_OPTIONS[0], PRIVATE_RIDE_OPTIONS[1]] as const;

export type PublicPrivateRideOption = (typeof PUBLIC_PRIVATE_RIDE_OPTIONS)[number];
export type PublicPrivateRideSlug = PublicPrivateRideOption["slug"];

export function getPrivateRideOption(slug: string): PrivateRideOption | undefined {
  return PRIVATE_RIDE_OPTIONS.find((option) => option.slug === slug);
}

export function getPublicPrivateRideOption(slug: string): PublicPrivateRideOption | undefined {
  return PUBLIC_PRIVATE_RIDE_OPTIONS.find((option) => option.slug === slug);
}

export function isPublicPrivateRideSlug(slug: string): slug is PublicPrivateRideSlug {
  return slug === "suv" || slug === "van";
}

export function getSuburbanDisplayPrice(vehicleNumber: number) {
  void vehicleNumber;
  return `$${SUBURBAN_PRICE}`;
}

export function buildDccPrivateCheckoutHref(product: PrivateRideSlug, quantity = 1) {
  const option = getPrivateRideOption(product);
  if (!option) return `${SITE}/book/red-rocks-amphitheatre/private`;
  const qty = Number.isFinite(quantity) && quantity > 0 ? Math.floor(quantity) : 1;
  return `https://www.destinationcommandcenter.com/book?route=parr-private&product=${option.dccProduct}&qty=${qty}`;
}

export function buildParrPrivateCheckoutHref(product: PrivateRideSlug, quantity = 1) {
  const option = getPrivateRideOption(product);
  if (!option) return `/book/red-rocks-amphitheatre/private`;
  const qty = Number.isFinite(quantity) && quantity > 0 ? Math.floor(quantity) : 1;
  const query = new URLSearchParams({ qty: String(qty) });
  return `/book/red-rocks-amphitheatre/private/${option.slug}?${query.toString()}`;
}
