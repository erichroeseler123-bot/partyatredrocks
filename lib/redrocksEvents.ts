import { RED_ROCKS_2026 } from "@/data/redrocks-2026";
import seatgeek from "@/public/data/redrocks-events.json";

export type RedRocksEvent = {
  id?: number;
  date: string;
  title: string;
  support?: string;
  image?: string | null;
  url?: string | null;
};

export function getRedRocksEvents(): RedRocksEvent[] {
  const byDate = new Map<string, RedRocksEvent>();

  // 1️⃣ Seed with master schedule (ALL shows)
  for (const show of RED_ROCKS_2026) {
    byDate.set(show.date, {
      date: show.date,
      title: show.event,
      support: show.support,
      image: null,
      url: null,
    });
  }

  // 2️⃣ Merge SeatGeek data (images + ticket links)
  for (const sg of seatgeek as any[]) {
    const date = sg.datetime?.slice(0, 10);
    if (!date || !byDate.has(date)) continue;

    const existing = byDate.get(date)!;
    existing.image = sg.image ?? existing.image;
    existing.url = sg.url ?? existing.url;
    existing.id = sg.id;
  }

  // 3️⃣ Return sorted
  return Array.from(byDate.values()).sort((a, b) =>
    a.date.localeCompare(b.date)
  );
}
