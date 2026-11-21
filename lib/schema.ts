import { PARR_2027_OPTION_B_PRICING_AUTHORITY } from "@/lib/pricing";

const SITE = "https://www.partyatredrocks.com";

export function getEventSchema(event: { artist?: string; date?: string; name?: string }) {
  const artistName = typeof event?.artist === "string" ? event.artist.trim() : "";
  return {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    name: event?.name || (artistName ? `${artistName} at Red Rocks Amphitheatre` : "Red Rocks Concert"),
    startDate: event?.date,
    location: {
      "@type": "MusicVenue",
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
    ...(artistName
      ? {
          performer: {
            "@type": "MusicGroup",
            name: artistName,
          },
        }
      : {}),
    subjectOf: {
      "@type": "Service",
      name: "Private Red Rocks Concert Transportation",
      provider: {
        "@type": "Organization",
        name: "Party at Red Rocks",
        url: SITE,
      },
      offers: {
        "@type": "AggregateOffer",
        url: `${SITE}/book/red-rocks-amphitheatre/private`,
        lowPrice: PARR_2027_OPTION_B_PRICING_AUTHORITY.suv.schemaPriceString,
        highPrice: PARR_2027_OPTION_B_PRICING_AUTHORITY.van.schemaPriceString,
        priceCurrency: "USD",
      },
    },
  };
}
