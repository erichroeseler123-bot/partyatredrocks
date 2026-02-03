// lib/events.ts
export interface RedRocksEvent {
  slug: string;
  artist: string;
  date: string;
  description: string;
  pickupDenver: string;
  pickupGolden: string;
}

export async function getRedRocksEvents(): Promise<RedRocksEvent[]> {
  // In a real build, you can fetch this from your 'shows' data or an API
  // For now, we define the 2026 anchors
  return [
    {
      slug: "crankdat-march-27",
      artist: "CRANKDAT",
      date: "2026-03-27T19:00:00",
      description: "Bass-heavy mechanics at the rocks. Don't miss the spring opener.",
      pickupDenver: "17:00",
      pickupGolden: "17:45"
    },
    {
      slug: "zac-brown-band-october",
      artist: "Zac Brown Band",
      date: "2026-10-19T19:00:00",
      description: "A two-night stand of country excellence. Expect cool October air.",
      pickupDenver: "16:30",
      pickupGolden: "17:15"
    }
  ];
}
