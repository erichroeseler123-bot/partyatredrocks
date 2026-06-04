import type { Metadata } from "next";
import { BOOKING_COPY } from "@/lib/bookingCopy";
import { bookingVisuals } from "@/lib/bookingVisuals";
import { PUBLIC_PRIVATE_RIDE_OPTIONS, SITE, SUBURBAN_PRICE_RANGE_LABEL } from "@/lib/rideCatalog";

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
      ? "Private Red Rocks Transportation | Suburban + Van Upgrade"
      : `${input.venueName} Transportation Booking`;
  const description =
    input.venue === "red-rocks-amphitheatre"
      ? "Book private Red Rocks transportation with a Private Suburban or private van upgrade and a guaranteed ride home after the show."
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
  const privateUrl = `${SITE}/book/${input.venue}/private`;

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name:
      input.venue === "red-rocks-amphitheatre"
        ? "Private Red Rocks transportation booking"
        : `${input.venueName} transportation booking`,
    provider: {
      "@type": "LocalBusiness",
      name: "Party at Red Rocks",
      url: SITE,
      telephone: "+17203696292",
    },
    areaServed: ["Denver, CO", "Golden, CO", "Morrison, CO"],
    serviceType:
      input.venue === "red-rocks-amphitheatre"
        ? "Private concert transportation booking"
        : "Venue transportation booking",
    url: bookingUrl,
    description:
      input.venue === "red-rocks-amphitheatre"
        ? "Book Private Suburban transportation or upgrade to a private van with a guaranteed ride home."
        : `Choose the ride type that fits ${input.venueName}, then continue into the right booking path.`,
    offers: {
      "@type": "OfferCatalog",
      name: `${input.venueName} ride options`,
      itemListElement: PUBLIC_PRIVATE_RIDE_OPTIONS.map((option) => ({
        "@type": "Offer",
        url: `${privateUrl}/${option.slug}`,
        itemOffered: {
          "@type": "Service",
          name: `${input.venueName} ${option.title}`,
          description: option.body,
        },
      })),
    },
  };
}

export function buildPrivateBookingMetadata(venue: string): Metadata {
  const canonical = `${SITE}/book/${venue}/private`;
  const title = `Private Red Rocks Transportation | Suburban ${SUBURBAN_PRICE_RANGE_LABEL} + Van Upgrade`;
  return {
    title,
    description: BOOKING_COPY.meta.privateBookingDescription,
    alternates: { canonical },
    openGraph: {
      title,
      description: BOOKING_COPY.meta.privateBookingDescription,
      url: canonical,
      type: "website",
      images: [{ url: absoluteImageUrl(bookingVisuals.private.imageSrc), alt: bookingVisuals.private.imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: BOOKING_COPY.meta.privateBookingDescription,
      images: [absoluteImageUrl(bookingVisuals.private.imageSrc)],
    },
  };
}

export function buildPrivateBookingJsonLd(input: { venue: string; quantity: number }) {
  return {
    "@context": "https://schema.org",
    "@type": ["Service", "TaxiService"],
    name: "Private Red Rocks transportation",
    provider: {
      "@type": "LocalBusiness",
      name: "Party at Red Rocks",
      url: SITE,
      telephone: "+17203696292",
    },
    areaServed: ["Denver, CO", "Golden, CO", "Morrison, CO"],
    serviceType: "Private concert transportation",
    url: `${SITE}/book/${input.venue}/private`,
    description: "Private Red Rocks transportation from Denver with a Private Suburban and private van upgrade option.",
    offers: {
      "@type": "OfferCatalog",
      name: "Private Red Rocks vehicle pricing",
      itemListElement: PUBLIC_PRIVATE_RIDE_OPTIONS.map((option) => ({
        "@type": "Offer",
        priceCurrency: "USD",
        price: option.slug === "suv" ? "399" : option.priceLabel.replace("$", ""),
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
        name: "Do private Red Rocks rides have guaranteed return service?",
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
          text: "Larger groups can upgrade from the Private Suburban to the private van when they need more room.",
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
  const option = PUBLIC_PRIVATE_RIDE_OPTIONS.find((entry) => entry.slug === input.optionSlug);

  return {
    "@context": "https://schema.org",
    "@type": "Offer",
    priceCurrency: "USD",
    price: input.optionSlug === "suv" ? "399" : input.optionPriceLabel.replace("$", ""),
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
      serviceType: "Private concert transportation",
    },
    potentialAction: option
      ? {
          "@type": "ReserveAction",
          target: `${SITE}/book/${input.venue}/private/${option.slug}?qty=${qty}`,
        }
      : undefined,
  };
}
