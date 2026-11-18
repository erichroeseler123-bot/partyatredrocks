import type { Metadata } from "next";
import { BOOKING_COPY } from "@/lib/bookingCopy";
import { bookingVisuals } from "@/lib/bookingVisuals";
import { PARR_2027_OPTION_B_PRICING_AUTHORITY } from "@/lib/pricing";

const SITE = "https://www.partyatredrocks.com";
const SUV = PARR_2027_OPTION_B_PRICING_AUTHORITY.suv;
const VAN = PARR_2027_OPTION_B_PRICING_AUTHORITY.van;

function absoluteImageUrl(src: string) {
  return src.startsWith("http") ? src : `${SITE}${src}`;
}

export function buildSharedBookingMetadata(path: string): Metadata {
  const imageUrl = absoluteImageUrl(bookingVisuals.private.imageSrc);

  return {
    title: `Private Red Rocks Transportation | ${SUV.allInTotalFormatted} Suburban & ${VAN.allInTotalFormatted} Van Total`,
    description: BOOKING_COPY.meta.sharedBookingDescription,
    robots: { index: false, follow: true },
    alternates: { canonical: `${SITE}/book/red-rocks-amphitheatre/private` },
    openGraph: {
      title: `Private Red Rocks Transportation | ${SUV.allInTotalFormatted} Suburban & ${VAN.allInTotalFormatted} Van Total`,
      description: BOOKING_COPY.meta.sharedBookingDescription,
      url: `${SITE}${path}`,
      type: "website",
      images: [
        {
          url: imageUrl,
          alt: bookingVisuals.private.imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Private Red Rocks Transportation | ${SUV.allInTotalFormatted} Suburban & ${VAN.allInTotalFormatted} Van Total`,
      description: BOOKING_COPY.meta.sharedBookingDescription,
      images: [imageUrl],
    },
  };
}

export function buildSharedBookingJsonLd(path: string) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Private Red Rocks Concert Transportation",
      serviceType: "Private concert transportation",
      provider: {
        "@type": "Organization",
        "@id": `${SITE}/#organization`,
        name: "Party at Red Rocks",
        url: SITE,
        logo: `${SITE}/brand/red-rocks-shuttle.png`,
        telephone: "+1-720-369-6292",
        email: "hello@partyatredrocks.com",
      },
      areaServed: [
        { "@type": "City", name: "Denver, CO" },
        { "@type": "City", name: "Golden, CO" },
        { "@type": "City", name: "Morrison, CO" },
      ],
      url: `${SITE}${path}`,
      image: absoluteImageUrl(bookingVisuals.private.imageSrc),
      description: BOOKING_COPY.meta.privateBookingDescription,
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "2027 Private Red Rocks Vehicle Pricing",
        itemListElement: [
          {
            "@type": "Offer",
            priceCurrency: "USD",
            price: SUV.schemaPriceString,
            url: `${SITE}/book/red-rocks-amphitheatre/private/suv`,
            itemOffered: {
              "@type": "Service",
              name: "Private Suburban to Red Rocks (Up to 6)",
            },
          },
          {
            "@type": "Offer",
            priceCurrency: "USD",
            price: VAN.schemaPriceString,
            url: `${SITE}/book/red-rocks-amphitheatre/private/van`,
            itemOffered: {
              "@type": "Service",
              name: "Private Van to Red Rocks (Up to 10)",
            },
          },
        ],
      },
    },
  ];
}
