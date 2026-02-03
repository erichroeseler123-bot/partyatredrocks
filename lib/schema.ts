// lib/schema.ts
export function getEventSchema(event: any) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": `${event.artist} Shuttle - Party at Red Rocks`,
    "startDate": event.date,
    "location": {
      "@type": "Place",
      "name": "Red Rocks Amphitheatre",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "18300 W Alameda Pkwy",
        "addressLocality": "Morrison",
        "addressRegion": "CO",
        "postalCode": "80465"
      }
    },
    "offers": {
      "@type": "Offer",
      "url": "https://partyatredrocks.com/book-shuttle",
      "price": "55.00",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "performer": {
      "@type": "Person",
      "name": event.artist
    }
  };
}
