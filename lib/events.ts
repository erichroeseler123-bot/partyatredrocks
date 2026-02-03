// lib/events.ts
export interface RedRocksEvent {
  slug: string;
  artist: string;
  date: string;
  description: string;
  image: string; // Required to match your metadata needs
  pickupDenver: string;
  pickupGolden: string;
}

export async function getRedRocksEvents(): Promise<RedRocksEvent[]> {
  return [
    {
      slug: "crankdat-march-27",
      artist: "CRANKDAT",
      date: "2026-03-27T19:00:00",
      description: "Bass-heavy mechanics at the rocks. Don't miss the spring opener with the high-energy sounds of Crankdat.",
      image: "/venues/rrsite.jpg", 
      pickupDenver: "17:00",
      pickupGolden: "17:45"
    },
    {
      slug: "zac-brown-band-october",
      artist: "Zac Brown Band",
      date: "2026-10-19T19:00:00",
      description: "A two-night stand of country excellence. Expect cool October air and a career-spanning setlist.",
      image: "/venues/rrsite.jpg", 
      pickupDenver: "16:30",
      pickupGolden: "17:15"
    }
  ];
}
