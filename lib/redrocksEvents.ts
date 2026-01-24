import { RED_ROCKS_2026 } from "@/data/redrocks-2026";
import seatgeek from "@/public/data/redrocks-events.json";

type SeatGeekEvent = {
  title: string;
  datetime: string;
  image?: string | null;
  url?: string;
};

export function getRedRocksEvents() {
  const sgByTitle = new Map<string, SeatGeekEvent>();

  (seatgeek as SeatGeekEvent[]).forEach((e) => {
    sgByTitle.set(e.title.toLowerCase(), e);
  });

  return RED_ROCKS_2026.map((show) => {
    const match = sgByTitle.get(show.event.toLowerCase());

    return {
      ...show,
      image: match?.image ?? null,
      ticketUrl: match?.url ?? null,
      source: match ? "seatgeek" : "manual",
    };
  });
}
