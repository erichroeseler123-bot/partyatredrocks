import type { Metadata } from "next";
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
const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";
const DEFAULT_OG_IMAGE =
  `${SITE}/api/unsplash-image?q=red+rocks+amphitheatre+concert+night+denver+colorado&src=%2Fhero%2Fhero-home.jpg&alt=Red+Rocks+shuttle+transportation&w=1200&h=630`;

export const metadata: Metadata = {
  title: "Red Rocks Lineup This Week | Upcoming Shows and Ride Planning",
  description:
    "See the Red Rocks lineup this week, open show pages, and plan shuttle or private rides before show night.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: { canonical: `${SITE}/week/red-rocks` },
  openGraph: {
    title: "Red Rocks Lineup This Week | Upcoming Shows and Ride Planning",
    description:
      "See the Red Rocks lineup this week, open show pages, and plan shuttle or private rides before show night.",
    url: `${SITE}/week/red-rocks`,
    type: "website",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        alt: "Red Rocks concert lineup and shuttle planning",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Red Rocks Lineup This Week | Upcoming Shows and Ride Planning",
    description:
      "See the Red Rocks lineup this week, open show pages, and plan shuttle or private rides before show night.",
    images: [DEFAULT_OG_IMAGE],
  },
};

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
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Red Rocks lineup this week",
    description: "Weekly Red Rocks concert lineup with direct show pages and booking paths.",
    url: `${SITE}/week/red-rocks`,
    about: {
      "@type": "Place",
      name: "Red Rocks Amphitheatre",
      url: `${SITE}/venues/red-rocks-amphitheatre`,
    },
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Week", item: `${SITE}/week` },
      { "@type": "ListItem", position: 3, name: "Red Rocks", item: `${SITE}/week/red-rocks` },
    ],
  };
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Upcoming Red Rocks shows this week",
    itemListElement: events.slice(0, 24).map((event, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE}/shows/${encodeURIComponent(event.id)}`,
      name: event.name,
      item: {
        "@type": "MusicEvent",
        name: event.name,
        startDate: `${event.dateKey}T19:00:00`,
        url: `${SITE}/shows/${encodeURIComponent(event.id)}`,
        location: {
          "@type": "Place",
          name: "Red Rocks Amphitheatre",
          url: `${SITE}/venues/red-rocks-amphitheatre`,
        },
      },
    })),
  };
  const schemaJsonLd = [collectionJsonLd, breadcrumbJsonLd, itemListJsonLd];

  return (
    <WeekClient
      initialEvents={initialEvents}
      faqRows={faqRows}
      faqJsonLd={faqJsonLd}
      schemaJsonLd={schemaJsonLd}
    />
  );
}
