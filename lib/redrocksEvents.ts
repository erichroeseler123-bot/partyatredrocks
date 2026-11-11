import {
  getMultiYearRedRocksEvents,
  getRedRocksEvents as getNormalizedEvents,
  getUpcomingRedRocksEvents as getNormalizedUpcomingEvents,
} from "@/lib/events/getRedRocksEvents";
import type { NormalizedEvent } from "@/lib/events/schema";

export type RedRocksEvent = {
  id: string;
  date: string;
  title: string;
  support?: string;
  image?: string | null;
  url?: string | null;
  sourceUrl?: string | null;
};

function mapRedRocksEvent(ev: NormalizedEvent): RedRocksEvent {
  return {
    id: ev.id,
    date: ev.dateKey,
    title: ev.name,
    support: ev.artistNames.slice(1).join(", ") || undefined,
    image: ev.image,
    url: ev.ticketUrl,
    sourceUrl: ev.sourceUrl ?? null,
  };
}

export async function getRedRocksEvents(year = 2026): Promise<RedRocksEvent[]> {
  const events = await getNormalizedEvents(year);
  return events.map(mapRedRocksEvent);
}

export async function getAllRedRocksEvents(years?: number[]): Promise<RedRocksEvent[]> {
  const events = await getMultiYearRedRocksEvents(years);
  return events.map(mapRedRocksEvent);
}

export async function getUpcomingRedRocksSchedule(opts?: {
  fromDateKey?: string;
  years?: number[];
}): Promise<RedRocksEvent[]> {
  const events = await getNormalizedUpcomingEvents(opts);
  return events.map(mapRedRocksEvent);
}
