import type { Metadata } from "next";
import { BOOKING_COPY } from "@/lib/bookingCopy";
import { bookingVisuals } from "@/lib/bookingVisuals";

const SITE = "https://www.partyatredrocks.com";

function absoluteImageUrl(src: string) {
  return src.startsWith("http") ? src : `${SITE}${src}`;
}

export function buildSharedBookingMetadata(path: string): Metadata {
  const imageUrl = absoluteImageUrl(bookingVisuals.shared.imageSrc);

  return {
    title: "Red Rocks Shuttle from Denver and Golden | Book Shared Seats",
    description: BOOKING_COPY.meta.sharedBookingDescription,
    alternates: { canonical: `${SITE}${path}` },
    openGraph: {
      title: "Red Rocks Shuttle from Denver and Golden | Book Shared Seats",
      description: BOOKING_COPY.meta.sharedBookingDescription,
      url: `${SITE}${path}`,
      type: "website",
      images: [
        {
          url: imageUrl,
          alt: bookingVisuals.shared.imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Red Rocks Shuttle from Denver and Golden | Book Shared Seats",
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
      name: "Red Rocks Shared Shuttle Seats",
      serviceType: "Shared Red Rocks shuttle service",
      provider: {
        "@type": "LocalBusiness",
        name: "Party at Red Rocks",
        url: SITE,
        telephone: "+17203696292",
        email: "contact@partyatredrocks.com",
      },
      areaServed: [
        { "@type": "City", name: "Denver, CO" },
        { "@type": "City", name: "Golden, CO" },
        { "@type": "City", name: "Morrison, CO" },
      ],
      url: `${SITE}${path}`,
      image: absoluteImageUrl(bookingVisuals.shared.imageSrc),
      description: "Shared shuttle seats from Denver and Golden to Red Rocks with fixed pricing and a guaranteed ride home after the show.",
      offers: {
        "@type": "Offer",
        priceCurrency: "USD",
        price: "59",
        url: `${SITE}${path}`,
        availability: "https://schema.org/InStock",
        itemOffered: {
          "@type": "Service",
          name: "Red Rocks Shared Shuttle Seats",
        },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Where do shared riders get picked up?",
          acceptedAnswer: {
          "@type": "Answer",
            text: "Shared riders choose Denver or Golden pickup, then receive a fixed shuttle plan tied to that city.",
          },
        },
        {
          "@type": "Question",
          name: "When does the shuttle leave?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The shuttle pickup time is always one hour before doors open.",
          },
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "BusTrip",
      name: "Shared Shuttle to Red Rocks",
      provider: {
        "@type": "Organization",
        name: "Party at Red Rocks",
        url: SITE,
      },
      itinerary: {
        "@type": "ItemList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            item: {
              "@type": "Place",
              name: "Denver Pickup",
              address: {
                "@type": "PostalAddress",
                streetAddress: "1550 Court Pl",
                addressLocality: "Denver",
                addressRegion: "CO",
                postalCode: "80202",
                addressCountry: "US",
              },
            },
          },
          {
            "@type": "ListItem",
            position: 2,
            item: {
              "@type": "Place",
              name: "Golden Pickup",
              address: {
                "@type": "PostalAddress",
                streetAddress: "1177 12th St",
                addressLocality: "Golden",
                addressRegion: "CO",
                postalCode: "80401",
                addressCountry: "US",
              },
            },
          },
          {
            "@type": "ListItem",
            position: 3,
            item: {
              "@type": "Place",
              name: "Red Rocks Amphitheatre",
              address: {
                "@type": "PostalAddress",
                streetAddress: "18300 W Alameda Pkwy",
                addressLocality: "Morrison",
                addressRegion: "CO",
                postalCode: "80465",
                addressCountry: "US",
              },
            },
          },
        ],
      },
      offers: {
        "@type": "Offer",
        url: `${SITE}${path}`,
        price: "59.00",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
    },
  ];
}
