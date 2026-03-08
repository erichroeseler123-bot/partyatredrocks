import { NextResponse } from "next/server";
import { getRedRocksEvents } from "@/lib/events/getRedRocksEvents";

export const runtime = "nodejs";
export const revalidate = 300;

function toNumericId(input: string): number {
  const parsed = Number(input);
  if (Number.isFinite(parsed)) return parsed;
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const year = Number(url.searchParams.get("year") ?? "2026");
  const events = await getRedRocksEvents(year);

  return NextResponse.json({
    year,
    events: events.map((ev) => ({
      id: toNumericId(ev.sourceId ?? ev.id),
      title: ev.name,
      datetime_local: ev.startLocal ?? ev.startAt ?? `${ev.dateKey}T19:00:00`,
      url: ev.ticketUrl ?? undefined,
      image: ev.image ?? null,
      performer: ev.artistNames[0]
        ? {
            name: ev.artistNames[0],
            image: ev.image ?? null,
          }
        : null,
    })),
  });
}
