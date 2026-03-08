import { getRedRocksEvents } from "@/lib/events/getRedRocksEvents";
import { getRedRocksAssets } from "@/lib/events/getRedRocksAssets";
import { toDisplayEvent } from "@/lib/events/presentation";
import { getFaqRowsWithGlobal } from "@/lib/faqs/getFaqs";
import { buildFaqPageJsonLd } from "@/lib/faqs/schema";
import WeekClient, { type WeekEvent } from "./WeekClient";

export const revalidate = 3600;

export default async function RedRocksLineupPage() {
  const [events, assets, faqRows] = await Promise.all([
    getRedRocksEvents(2026),
    getRedRocksAssets(2026),
    getFaqRowsWithGlobal("week/red-rocks.json"),
  ]);
  const initialEvents: WeekEvent[] = events.map((event) => toDisplayEvent(event, { assets }));
  const faqJsonLd = buildFaqPageJsonLd(faqRows);

  return <WeekClient initialEvents={initialEvents} faqRows={faqRows} faqJsonLd={faqJsonLd} />;
}
