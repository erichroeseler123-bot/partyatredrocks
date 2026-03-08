import { NextResponse } from "next/server";
import { getRedRocksEvents } from "@/lib/events/getRedRocksEvents";

export const runtime = "nodejs";
export const revalidate = 300;

type LegacyTmEvent = {
  id: string;
  name: string;
  url: string | null;
  startLocal: string | null;
  venue: string | null;
  attractions: { name: string }[];
  image: string | null;
};

function asLegacyEvent(ev: Awaited<ReturnType<typeof getRedRocksEvents>>[number]): LegacyTmEvent {
  return {
    id: ev.sourceId ?? ev.id,
    name: ev.name,
    url: ev.ticketUrl,
    startLocal: ev.startLocal ?? ev.startAt,
    venue: "Red Rocks Amphitheatre",
    attractions: ev.artistNames.map((name) => ({ name })),
    image: ev.image,
  };
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const year = Number(url.searchParams.get("year") ?? "2026");
  const events = await getRedRocksEvents(year);
  return NextResponse.json({
    year,
    events: events.map(asLegacyEvent),
  });
}
