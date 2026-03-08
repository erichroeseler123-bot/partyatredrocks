import type { NormalizedEvent } from "@/lib/events/schema";
import type { RedRocksAssetsSnapshot } from "@/lib/events/getRedRocksAssets";

export type DisplayEvent = {
  id: string;
  title: string;
  datetimeLocal: string;
  url?: string;
  image: string;
  performerName?: string;
  bookHref: string;
};

export function eventDateTimeLocal(event: NormalizedEvent): string {
  return event.startLocal ?? event.startAt ?? `${event.dateKey}T19:00:00`;
}

function resolveEventImage(event: NormalizedEvent, assets?: RedRocksAssetsSnapshot | null): string {
  const fromAssets = assets?.events?.[event.id];
  return fromAssets?.local ?? fromAssets?.remote ?? event.image ?? "/images/shows/fallback.jpg";
}

export function toDisplayEvent(
  event: NormalizedEvent,
  opts?: { assets?: RedRocksAssetsSnapshot | null }
): DisplayEvent {
  const eventId = event.sourceId ?? event.id;
  return {
    id: eventId,
    title: event.name,
    datetimeLocal: eventDateTimeLocal(event),
    url: event.ticketUrl ?? undefined,
    image: resolveEventImage(event, opts?.assets),
    performerName: event.artistNames[0] ?? undefined,
    bookHref: `/book?venue=red-rocks-amphitheatre&seatgeek_event=${encodeURIComponent(eventId)}`,
  };
}
