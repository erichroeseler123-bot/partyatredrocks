import { BOOKING_COPY } from "@/lib/bookingCopy";

export const SITE = "https://www.partyatredrocks.com";

export const SHARED_RIDE = {
  slug: "shared",
  title: BOOKING_COPY.labels.sharedRideTitle,
  heroEyebrow: BOOKING_COPY.labels.sharedBookingEyebrow,
  heroTitle: BOOKING_COPY.labels.sharedBookingTitle,
  heroCopy: BOOKING_COPY.copy.sharedRide,
  priceLabel: "$59",
  cardTitle: "Per-Person Shuttle Seats",
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
    title: "Private SUV",
    eyebrow: "$499 • Up to 6 Guests",
    body: "Private ride for smaller groups that want limo-lane access and time to tailgate before the show.",
    priceLabel: "$499",
    dccProduct: "parr-suburban",
    ctaLabel: "Start SUV Checkout",
  },
  {
    slug: "van",
    title: "10 Passenger Van",
    eyebrow: "$599 • Up to 10 Guests",
    body: "One vehicle, one pickup plan, limo-lane access, and one return timeline for groups that need more room.",
    priceLabel: "$599",
    dccProduct: "parr-van-10",
    ctaLabel: "Start Van Checkout",
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

export function getPrivateRideOption(slug: string): PrivateRideOption | undefined {
  return PRIVATE_RIDE_OPTIONS.find((option) => option.slug === slug);
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
