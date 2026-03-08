import { getRedRocksEvents } from "@/lib/events/getRedRocksEvents";
import { getRedRocksAssets } from "@/lib/events/getRedRocksAssets";
import { toDisplayEvent } from "@/lib/events/presentation";
import { getEnrichedArtistsCatalog } from "@/lib/events/getCatalog";
import { getFaqRowsWithGlobal } from "@/lib/faqs/getFaqs";
import { buildFaqPageJsonLd } from "@/lib/faqs/schema";
import { getProbableSetlist } from "@/lib/setlists";
import { getRedRocks7DayForecast } from "@/lib/weather";
import WeekClient, { type WeekEvent } from "./WeekClient";

export const revalidate = 3600;

function inNextSevenDays(dateKey: string): boolean {
  const d = new Date(`${dateKey}T00:00:00`);
  if (Number.isNaN(d.getTime())) return false;
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 7);
  return d >= start && d < end;
}

export default async function RedRocksLineupPage() {
  const [events, assets, faqRows, enrichedArtists, forecastByDate] = await Promise.all([
    getRedRocksEvents(2026),
    getRedRocksAssets(2026),
    getFaqRowsWithGlobal("week/red-rocks.json"),
    getEnrichedArtistsCatalog(2026, "all"),
    getRedRocks7DayForecast(),
  ]);

  const artistThumbnails = Object.fromEntries(
    enrichedArtists
      .filter((row) => row.name && row.spotifyImage)
      .map((row) => [row.name.trim().toLowerCase(), row.spotifyImage as string])
  );

  const nextSevenArtists = Array.from(
    new Set(
      events
        .filter((event) => inNextSevenDays(event.dateKey))
        .map((event) => event.artistNames[0])
        .filter((name): name is string => typeof name === "string" && name.trim().length > 0)
    )
  ).slice(0, 16);

  const setlistRows = await Promise.all(
    nextSevenArtists.map(async (artistName) => {
      const songs = await getProbableSetlist(artistName).catch(() => null);
      const top = Array.isArray(songs)
        ? songs
            .map((song) => {
              if (song && typeof song === "object" && "name" in song) {
                const name = (song as { name?: unknown }).name;
                return typeof name === "string" ? name : null;
              }
              return null;
            })
            .filter((name): name is string => !!name)
            .slice(0, 5)
        : [];
      return [artistName.trim().toLowerCase(), top] as const;
    })
  );
  const setlistByArtist = Object.fromEntries(setlistRows);

  const initialEvents: WeekEvent[] = events.map((event) => {
    const out = toDisplayEvent(event, { assets, artistThumbnails });
    if (inNextSevenDays(event.dateKey)) {
      const weather = forecastByDate[event.dateKey];
      if (weather) out.weather = weather;
      const artistKey = (event.artistNames[0] ?? "").trim().toLowerCase();
      const setlist = artistKey ? setlistByArtist[artistKey] : [];
      if (Array.isArray(setlist) && setlist.length > 0) out.setlistPreview = setlist;
    }
    return out;
  });
  const faqJsonLd = buildFaqPageJsonLd(faqRows);

  return <WeekClient initialEvents={initialEvents} faqRows={faqRows} faqJsonLd={faqJsonLd} />;
}
