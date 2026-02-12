export const runtime = "nodejs";

type MBSearchArtist = {
  id: string;
  name: string;
  score?: number;
  disambiguation?: string;
  type?: string;
  country?: string;
  area?: { name?: string };
  "life-span"?: { begin?: string; end?: string; ended?: boolean };
};

type MBTag = { name: string; count?: number };
type MBGenre = { name: string; count?: number };

type MBArtistDetail = {
  id: string;
  name: string;
  disambiguation?: string;
  type?: string;
  country?: string;
  area?: { name?: string };
  "life-span"?: { begin?: string; end?: string; ended?: boolean };
  tags?: MBTag[];
  genres?: MBGenre[];
  relations?: Array<{ type?: string; url?: { resource?: string } }>;
};

type MBReleaseGroup = {
  id: string;
  title: string;
  "primary-type"?: string;
  "first-release-date"?: string;
};

type MBReleaseGroupResp = {
  "release-groups"?: MBReleaseGroup[];
};

type MBRecording = {
  id: string;
  title: string;
  length?: number;
  "first-release-date"?: string;
};

type MBRecordingResp = {
  recordings?: MBRecording[];
};

type MBWork = {
  id: string;
  title: string;
  type?: string;
  language?: string;
};

type MBWorkResp = {
  works?: MBWork[];
};

function cleanName(name: string) {
  return (name || "")
    .replace(/\s+\(\d+\+\)\s*$/g, "")
    .replace(/\s+-\s+.*$/g, "")
    .trim();
}

function pickUrl(relations: MBArtistDetail["relations"] | undefined, type: string) {
  const r = relations?.find((x) => (x.type || "").toLowerCase() === type.toLowerCase());
  return r?.url?.resource || null;
}

async function mbFetchJSON<T>(url: string, cacheSeconds: number) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "User-Agent": "partyatredrocks/1.0 (MusicBrainz; contact: admin@partyatredrocks.com)",
      },
      next: { revalidate: cacheSeconds },
    });

    const text = await res.text().catch(() => "");
    if (!res.ok) return { ok: false as const, status: res.status, body: text.slice(0, 500) };

    return { ok: true as const, status: res.status, json: JSON.parse(text) as T };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "fetch failed";
    return { ok: false as const, status: 0, body: msg };
  } finally {
    clearTimeout(timeout);
  }
}

async function mbFetchWithRetry<T>(url: string, cacheSeconds: number) {
  const waits = [0, 450, 900];
  let last: Awaited<ReturnType<typeof mbFetchJSON<T>>> | null = null;

  for (const w of waits) {
    if (w) await new Promise((r) => setTimeout(r, w));
    const out = await mbFetchJSON<T>(url, cacheSeconds);
    last = out;

    if (out.ok) return out;
    if ([429, 500, 502, 503, 504].includes(out.status)) continue;
    return out;
  }

  return last!;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const raw = searchParams.get("name") || "";
  const name = cleanName(raw);

  if (!name) return Response.json({ error: "Missing name" }, { status: 400 });

  const cacheSeconds = 60 * 60 * 24;

  // 1) search artists
  const searchUrl =
    "https://musicbrainz.org/ws/2/artist/?" +
    new URLSearchParams({
      query: `artist:"${name}"`,
      fmt: "json",
      limit: "5",
    }).toString();

  const s = await mbFetchWithRetry<{ artists?: MBSearchArtist[] }>(searchUrl, cacheSeconds);

  if (!s.ok) {
    return Response.json(
      { found: false, name, error: "MusicBrainz search failed", detail: s.body },
      { status: 200, headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } }
    );
  }

  const candidates: MBSearchArtist[] = s.json.artists || [];
  const best: MBSearchArtist | undefined = candidates.sort(
    (a: MBSearchArtist, b: MBSearchArtist) => (b.score || 0) - (a.score || 0)
  )[0];

  if (!best?.id) {
    return Response.json(
      { found: false, name },
      { status: 200, headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } }
    );
  }

  const mbid = best.id;

  // 2) artist detail
  const detailUrl =
    "https://musicbrainz.org/ws/2/artist/" +
    encodeURIComponent(mbid) +
    "?" +
    new URLSearchParams({
      fmt: "json",
      inc: "tags+genres+url-rels",
    }).toString();

  const d = await mbFetchWithRetry<MBArtistDetail>(detailUrl, cacheSeconds);

  if (!d.ok) {
    return Response.json(
      { found: true, mbid, name: best.name, score: best.score ?? null, partial: true },
      { status: 200, headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } }
    );
  }

  const detail = d.json;

  // 3) releases (release-groups)
  const rgUrl =
    "https://musicbrainz.org/ws/2/release-group?" +
    new URLSearchParams({
      artist: mbid,
      type: "album|ep|single",
      limit: "12",
      fmt: "json",
    }).toString();

  const rg = await mbFetchWithRetry<MBReleaseGroupResp>(rgUrl, cacheSeconds);

  // 4) recordings (tracks)
  const recUrl =
    "https://musicbrainz.org/ws/2/recording?" +
    new URLSearchParams({
      artist: mbid,
      limit: "12",
      fmt: "json",
    }).toString();

  const rec = await mbFetchWithRetry<MBRecordingResp>(recUrl, cacheSeconds);

  // 5) works (often empty; still safe)
  const worksUrl =
    "https://musicbrainz.org/ws/2/work?" +
    new URLSearchParams({
      artist: mbid,
      limit: "10",
      fmt: "json",
    }).toString();

  const works = await mbFetchWithRetry<MBWorkResp>(worksUrl, cacheSeconds);

  const payload = {
    found: true as const,
    mbid: detail.id,
    name: detail.name,
    disambiguation: detail.disambiguation || null,
    type: detail.type || null,
    country: detail.country || null,
    area: detail.area?.name || null,
    lifeSpan: detail["life-span"] || null,
    tags: (detail.tags || []).slice(0, 12).map((t: MBTag) => t.name),
    genres: (detail.genres || []).slice(0, 10).map((g: MBGenre) => g.name),
    urls: {
      youtube: pickUrl(detail.relations, "youtube"),
      instagram: pickUrl(detail.relations, "instagram"),
      spotify: pickUrl(detail.relations, "spotify"),
      bandcamp: pickUrl(detail.relations, "bandcamp"),
      appleMusic: pickUrl(detail.relations, "apple music"),
      soundcloud: pickUrl(detail.relations, "soundcloud"),
      wikipedia: pickUrl(detail.relations, "wikipedia"),
      officialHomepage: pickUrl(detail.relations, "official homepage"),
    },
    score: best.score ?? null,

    releases: (rg.ok ? rg.json["release-groups"] || [] : []).slice(0, 12).map((x: MBReleaseGroup) => ({
      id: x.id,
      title: x.title,
      type: x["primary-type"] || null,
      firstReleaseDate: x["first-release-date"] || null,
    })),

    recordings: (rec.ok ? rec.json.recordings || [] : []).slice(0, 12).map((x: MBRecording) => ({
      id: x.id,
      title: x.title,
      lengthMs: x.length ?? null,
      firstReleaseDate: x["first-release-date"] || null,
    })),

    works: (works.ok ? works.json.works || [] : []).slice(0, 10).map((x: MBWork) => ({
      id: x.id,
      title: x.title,
      type: x.type || null,
      language: x.language || null,
    })),
  };

  return Response.json(payload, {
    status: 200,
    headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
  });
}
