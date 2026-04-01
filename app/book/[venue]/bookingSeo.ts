import type { Metadata } from "next";
import { BOOKING_COPY } from "@/lib/bookingCopy";
import { bookingVisuals } from "@/lib/bookingVisuals";
import { PRIVATE_RIDE_OPTIONS, SHARED_RIDE, SITE } from "@/lib/rideCatalog";

function absoluteImageUrl(src: string) {
  return src.startsWith("http") ? src : `${SITE}${src}`;
}

export function buildVenueBookingMetadata(input: {
  venue: string;
  venueName: string;
  heroImage: string;
  heroAlt: string;
}): Metadata {
  const canonical = `${SITE}/book/${input.venue}`;
  const title =
    input.venue === "red-rocks-amphitheatre"
      ? "Red Rocks Shuttle from Denver | Shared Seats + Private SUVs"
      : `${input.venueName} Shuttle Booking`;
  const description =
    input.venue === "red-rocks-amphitheatre"
      ? "Book Red Rocks shuttle transportation with shared seats, private SUVs, vans, Sprinters, and a guaranteed ride home after the show."
      : `Choose the ride style that fits ${input.venueName}, then continue into the right booking path.`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      images: [{ url: absoluteImageUrl(input.heroImage), alt: input.heroAlt }],
    },
    twitter: {
      card: "summary_large_image",
      images: [absoluteImageUrl(input.heroImage)],
    },
  };
}

export function buildVenueBookingJsonLd(input: { venue: string; venueName: string }) {
  const bookingUrl = `${SITE}/book/${input.venue}`;
  const sharedUrl =
    input.venue === "red-rocks-amphitheatre"
      ? `${SITE}/book/${input.venue}/custom/shared`
      : bookingUrl;
  const privateUrl = `${SITE}/book/${input.venue}/private`;

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name:
      input.venue === "red-rocks-amphitheatre"
        ? "Red Rocks shuttle booking"
        : `${input.venueName} shuttle booking`,
    provider: {
      "@type": "LocalBusiness",
      name: "Party at Red Rocks",
      url: SITE,
      telephone: "+17203696292",
    },
    areaServed: ["Denver, CO", "Golden, CO", "Morrison, CO"],
    serviceType:
      input.venue === "red-rocks-amphitheatre"
        ? "Concert shuttle and private ride booking"
        : "Venue transportation booking",
    url: bookingUrl,
    description:
      input.venue === "red-rocks-amphitheatre"
        ? "Book shared Red Rocks shuttle seats or private SUVs, vans, Sprinters, and party buses with a guaranteed ride home."
        : `Choose the ride type that fits ${input.venueName}, then continue into the right booking path.`,
    offers: {
      "@type": "OfferCatalog",
      name: `${input.venueName} ride options`,
      itemListElement: [
        {
          "@type": "Offer",
          priceCurrency: "USD",
          price: SHARED_RIDE.priceLabel.replace("$", ""),
          url: sharedUrl,
          itemOffered: {
            "@type": "Service",
            name: `${input.venueName} shared shuttle`,
            description: SHARED_RIDE.cardBody,
          },
        },
        {
          "@type": "Offer",
          url: privateUrl,
          itemOffered: {
            "@type": "Service",
            name: `${input.venueName} private ride options`,
            description:
              input.venue === "red-rocks-amphitheatre"
                ? "Private SUVs, vans, Sprinters, and party buses with one vehicle for the full night."
                : `Private ride options for ${input.venueName}.`,
          },
        },
      ],
    },
  };
}

export function buildPrivateBookingMetadata(venue: string): Metadata {
  const canonical = `${SITE}/book/${venue}/private`;
  return {
    title: "Private Red Rocks Shuttle from Denver | $499 SUV - $799 Sprinter - Guaranteed Return",
    description: BOOKING_COPY.meta.privateBookingDescription,
    alternates: { canonical },
    openGraph: {
      title: "Private Red Rocks Shuttle from Denver | $499 SUV - $799 Sprinter - Guaranteed Return",
      description: BOOKING_COPY.meta.privateBookingDescription,
      url: canonical,
      type: "website",
      images: [{ url: absoluteImageUrl(bookingVisuals.private.imageSrc), alt: bookingVisuals.private.imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Private Red Rocks Shuttle from Denver | $499 SUV - $799 Sprinter - Guaranteed Return",
      description: BOOKING_COPY.meta.privateBookingDescription,
      images: [absoluteImageUrl(bookingVisuals.private.imageSrc)],
    },
  };
}

export function buildPrivateBookingJsonLd(input: { venue: string; quantity: number }) {
  return {
    "@context": "https://schema.org",
    "@type": ["Service", "TaxiService"],
    name: "Red Rocks private shuttle service",
    provider: {
      "@type": "LocalBusiness",
      name: "Party at Red Rocks",
      url: SITE,
      telephone: "+17203696292",
    },
    areaServed: ["Denver, CO", "Golden, CO", "Morrison, CO"],
    serviceType: "Private concert shuttle service",
    url: `${SITE}/book/${input.venue}/private`,
    description: "Private Red Rocks transportation from Denver with fixed-price SUVs, vans, Sprinters, and party buses.",
    offers: {
      "@type": "OfferCatalog",
      name: "Private Red Rocks vehicle pricing",
      itemListElement: PRIVATE_RIDE_OPTIONS.map((option) => ({
        "@type": "Offer",
        priceCurrency: "USD",
        price: option.priceLabel.replace("$", ""),
        url: `${SITE}/book/${input.venue}/private/${option.slug}?qty=${input.quantity}`,
        itemOffered: {
          "@type": "Service",
          name: option.title,
          description: option.body,
        },
      })),
    },
  };
}

export function buildPrivateFaqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How late do private Red Rocks rides run?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Private rides run through the end of the show, with return pickup handled after the concert lets out.",
        },
      },
      {
        "@type": "Question",
        name: "Can my private ride stop at a liquor store?",
        acceptedAnswer: {
          "@type": "Answer",
          text: BOOKING_COPY.faq.liquorStop,
        },
      },
      {
        "@type": "Question",
        name: "What time is pickup for private Red Rocks rides?",
        acceptedAnswer: {
          "@type": "Answer",
          text: BOOKING_COPY.faq.privatePickupTime,
        },
      },
      {
        "@type": "Question",
        name: "Do private Red Rocks shuttles have guaranteed return service?",
        acceptedAnswer: {
          "@type": "Answer",
          text: BOOKING_COPY.faq.privateReturn,
        },
      },
      {
        "@type": "Question",
        name: "Which private vehicle is best for larger groups?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Larger groups usually choose the 10-passenger van, 14-passenger Sprinter, or 24-passenger party bus depending on headcount and how much room they want.",
        },
      },
    ],
  };
}

export function buildPrivateOptionMetadata(input: {
  venue: string;
  optionSlug: string;
  optionTitle: string;
  optionBody: string;
  optionPriceLabel: string;
}): Metadata {
  const canonical = `${SITE}/book/${input.venue}/private/${input.optionSlug}`;
  return {
    title: `${input.optionTitle} to Red Rocks | ${input.optionPriceLabel} Private Booking`,
    description: `${input.optionTitle} for Red Rocks. ${input.optionBody}`,
    alternates: { canonical },
    openGraph: {
      title: `${input.optionTitle} to Red Rocks | ${input.optionPriceLabel} Private Booking`,
      description: `${input.optionTitle} for Red Rocks. ${input.optionBody}`,
      url: canonical,
      type: "website",
      images: [{ url: absoluteImageUrl(bookingVisuals.private.imageSrc), alt: bookingVisuals.private.imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      images: [absoluteImageUrl(bookingVisuals.private.imageSrc)],
    },
  };
}

export function buildPrivateOptionJsonLd(input: {
  venue: string;
  optionSlug: string;
  optionTitle: string;
  optionBody: string;
  optionPriceLabel: string;
  quantity: number;
}) {
  const qty = Number.isFinite(input.quantity) && input.quantity > 0 ? Math.floor(input.quantity) : 1;
  const option = PRIVATE_RIDE_OPTIONS.find((entry) => entry.slug === input.optionSlug);

  return {
    "@context": "https://schema.org",
    "@type": "Offer",
    priceCurrency: "USD",
    price: input.optionPriceLabel.replace("$", ""),
    url: `${SITE}/book/${input.venue}/private/${input.optionSlug}`,
    availability: "https://schema.org/InStock",
    itemOffered: {
      "@type": ["Service", "TaxiService"],
      name: `${input.optionTitle} to Red Rocks`,
      description: input.optionBody,
      provider: {
        "@type": "LocalBusiness",
        name: "Party at Red Rocks",
        url: SITE,
        telephone: "+17203696292",
      },
      areaServed: ["Denver, CO", "Golden, CO", "Morrison, CO"],
      serviceType: "Private concert shuttle service",
    },
    potentialAction: option
      ? {
          "@type": "ReserveAction",
          target: `${SITE}/book/${input.venue}/private/${option.slug}?qty=${qty}`,
        }
      : undefined,
  };
}
