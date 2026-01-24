import MASTER from "@/data/redrocks-2026";
import seatgeek from "@/public/data/redrocks-events.json";

type SeatGeekEvent = {
  title: string;
  datetime: string;
  image?: string | null;
  url?: string;
};

export function getRedRocksEvents() {
  const sgByTitle = new Map<string, SeatGeekEvent>();

  seatgeek.forEach((e: SeatGeekEvent) => {
    sgByTitle.set(e.title.toLowerCase(), e);
  });

  return MASTER.map(show => {
    const match = sgByTitle.get(show.event.toLowerCase());

    return {
      ...show,
      image: match?.image ?? null,
      ticketUrl: match?.url ?? null,
      source: match ? "seatgeek" : "manual",
    };
  });
}
