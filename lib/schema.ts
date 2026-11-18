import { SUBURBAN_2027_USD, VAN_2027_USD } from "@/lib/pricing";

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
        lowPrice: String(SUBURBAN_2027_USD),
        highPrice: String(VAN_2027_USD),
        priceCurrency: "USD",
      },
    },
  };
}
