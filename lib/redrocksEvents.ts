import { getRedRocksEvents as getNormalizedEvents } from "@/lib/events/getRedRocksEvents";

export type RedRocksEvent = {
  id: string;
  date: string;
  title: string;
  support?: string;
  image?: string | null;
  url?: string | null;
};

export async function getRedRocksEvents(year = 2026): Promise<RedRocksEvent[]> {
  const events = await getNormalizedEvents(year);
  return events.map((ev) => ({
    id: ev.id,
    date: ev.dateKey,
    title: ev.name,
    support: ev.artistNames.slice(1).join(", ") || undefined,
    image: ev.image,
    url: ev.ticketUrl,
  }));
}
