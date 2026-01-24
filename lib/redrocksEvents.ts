import { RED_ROCKS_2026 } from "@/data/redrocks-2026";
import seatgeek from "@/public/data/redrocks-events.json";

export type RedRocksEvent = {
  id: string;
  date: string;
  title: string;
  support?: string;
  image?: string | null;
  url?: string | null;
};

export function getRedRocksEvents(): RedRocksEvent[] {
  const byDate = new Map<string, RedRocksEvent>();

  // 1️⃣ Seed ALL known shows (your full master list)
  for (const show of RED_ROCKS_2026) {
    byDate.set(show.date, {
      id: show.date,
      date: show.date,
      title: show.title,          // ✅ FIXED
      support: show.support,
      image: null,
      url: null,
    });
  }

  // 2️⃣ Merge SeatGeek data where available (images + URLs)
  for (const sg of seatgeek as any[]) {
    const date = sg.datetime?.slice(0, 10);
    if (!date) continue;

    const existing = byDate.get(date);
    if (!existing) continue;

    byDate.set(date, {
      ...existing,
      image: sg.image ?? null,
      url: sg.url ?? null,
    });
  }

  // 3️⃣ Return sorted list
  return Array.from(byDate.values()).sort((a, b) =>
    a.date.localeCompare(b.date)
  );
}
