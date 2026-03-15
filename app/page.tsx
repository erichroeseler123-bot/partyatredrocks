import type { Metadata } from "next";
import HomeSections from "@/components/home/HomeSections";
import { blobReadJson } from "@/lib/blobJson";
import { SCENES } from "@/data/scenes";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Party at Red Rocks | Concert Shuttles + Private SUVs",
  description:
    "Fixed-price concert shuttles and private SUVs from Denver to Red Rocks and major Colorado venues. No surge. Clear pickup. Guaranteed ride home.",
  alternates: { canonical: "https://www.partyatredrocks.com/" },
};

type ScenePayload = {
  events?: Array<{
    id: number;
    title: string;
    datetime_local: string;
    datetime_utc?: string;
    url?: string;
    performers?: Array<{ name?: string; image?: string }>;
    venue?: { siteSlug?: string; siteName?: string };
  }>;
};

function toTime(e: { datetime_local?: string } | string) {
  const s = typeof e === "string" ? e : (e?.datetime_local ?? "");
  const t = Date.parse(s);
  return Number.isFinite(t) ? t : 0;
}


async function getHomeEvents() {
  const slugs = SCENES.map((s: any) => s.slug);

  const payloads = await Promise.all(
    slugs.map((scene) =>
      blobReadJson<ScenePayload>(`cache/scene/${scene}.json`, {
        revalidateSeconds: 300,
      }).catch(() => null)
    )
  );

  const all = payloads.flatMap((p) => p?.events ?? []);

  const byId = new Map<number, (typeof all)[number]>();
  for (const e of all) if (e?.id) byId.set(e.id, e);

  const now = Date.now();

  return Array.from(byId.values())
    .filter((e) => toTime(e) >= now)
    .sort((a, b) => toTime(a) - toTime(b))
    .slice(0, 6);
}

export default async function HomePage() {
  const events = await getHomeEvents();
  return <HomeSections events={events} />;
}
