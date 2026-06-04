import { BOOKING_COPY } from "@/lib/bookingCopy";

export const SITE = "https://www.partyatredrocks.com";

export const SUBURBAN_PRICE = 399;
export const SUBURBAN_PRICE_LABEL = "$399";

export const SHARED_RIDE = {
  slug: "shared",
  title: BOOKING_COPY.labels.sharedRideTitle,
  heroEyebrow: BOOKING_COPY.labels.sharedBookingEyebrow,
  heroTitle: BOOKING_COPY.labels.sharedBookingTitle,
  heroCopy: BOOKING_COPY.copy.sharedRide,
  priceLabel: SUBURBAN_PRICE_LABEL,
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
    eyebrow: `${SUBURBAN_PRICE_LABEL} • Up to 6 guests`,
    body: "Private Suburban for smaller groups that want direct pickup, limo-lane access, and time to tailgate before the show.",
    priceLabel: SUBURBAN_PRICE_LABEL,
    dccProduct: "parr-suburban",
    ctaLabel: "Book Private Suburban",
  },
  {
    slug: "van",
    title: "Upgrade to Private Van",
    eyebrow: "$599 • Up to 10 Guests",
    body: "One vehicle, one pickup plan, limo-lane access, and one return timeline for groups that need more room.",
    priceLabel: "$599",
    dccProduct: "parr-van-10",
    ctaLabel: "Book Private Van",
  },
  {
    slug: "sprinter",
    title: "14 Passenger Sprinter",
    eyebrow: "$799 • Up to 14 Guests",
    body: "Best for larger groups that want more space, limo-lane access, and one vehicle for the full night.",
    priceLabel: "$799",
    dccProduct: "parr-sprinter-14",
    ctaLabel: "Start Sprinter Checkout",
  },
  {
    slug: "party-bus",
    title: "24 Passenger Party Bus",
    eyebrow: "$1199 • Up to 24 Guests",
    body: "Best for larger groups who want to tailgate, stay together, and make the ride part of the night.",
    priceLabel: "$1199",
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
