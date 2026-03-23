import type { NormalizedEvent } from "@/lib/events/schema";
import type { RedRocksAssetsSnapshot } from "@/lib/events/getRedRocksAssets";
import { resolveMediaImage } from "@/lib/media/resolver";

export type DisplayEvent = {
  id: string;
  title: string;
  datetimeLocal: string;
  url?: string;
  image: string;
  performerName?: string;
  thumbnail?: string;
  weather?: {
    highF: number;
    lowF: number;
    precipChance?: number;
  };
  setlistPreview?: string[];
  bookHref: string;
};

export function eventDateTimeLocal(event: NormalizedEvent): string {
  return event.startLocal ?? event.startAt ?? `${event.dateKey}T19:00:00`;
}

function resolveEventImage(event: NormalizedEvent, assets?: RedRocksAssetsSnapshot | null): string {
  const fromAssets = assets?.events?.[event.id];
  const source = fromAssets?.local ?? fromAssets?.remote ?? event.image ?? null;
  return resolveMediaImage({
    entityType: "show",
    slug: event.id,
    sourceHints: {
      title: event.name,
      artistName: event.artistNames[0] || undefined,
      venueName: event.venueId,
      queryHint: `${event.artistNames[0] || event.name} ${event.venueId} concert`,
      localImageUrl: source,
      alt: event.name,
      seatgeekImageUrl: event.image || undefined,
    },
  });
}

export function toDisplayEvent(
  event: NormalizedEvent,
  opts?: { assets?: RedRocksAssetsSnapshot | null; artistThumbnails?: Record<string, string> }
): DisplayEvent {
  const eventId = event.id;
  const seatgeekEventId = event.sourceId ?? event.id;
  const artistKey = (event.artistNames[0] ?? "").trim().toLowerCase();
  return {
    id: eventId,
    title: event.name,
    datetimeLocal: eventDateTimeLocal(event),
    url: event.ticketUrl ?? undefined,
    image: resolveEventImage(event, opts?.assets),
    performerName: event.artistNames[0] ?? undefined,
    thumbnail: artistKey
      ? resolveMediaImage({
          entityType: "artist",
          slug: artistKey,
          sourceHints: {
            title: event.artistNames[0],
            artistName: event.artistNames[0],
            spotifyImageUrl: opts?.artistThumbnails?.[artistKey],
            alt: event.artistNames[0],
            queryHint: `${event.artistNames[0]} live music artist portrait`,
          },
        })
      : undefined,
    bookHref: `/book?venue=red-rocks-amphitheatre&seatgeek_event=${encodeURIComponent(seatgeekEventId)}`,
  };
}
