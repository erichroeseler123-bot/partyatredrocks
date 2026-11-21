import redRocks2026Ledger from "@/data/shows/redrocks/2026.json";
import redRocks2027Ledger from "@/data/shows/redrocks/2027.json";

export type CanonicalRedRocksBookingShow = {
  id: string;
  title: string;
  dateKey: string;
  dateLabel: string;
  fullDateLabel: string;
  startTimeLabel: string;
  startLocal: string;
  supportLabel: string | null;
  artistNames: string[];
  showHref: string;
  sourceUrl: string | null;
  isPastShow: boolean;
};

type RawLedgerRow = {
  dateKey?: string;
  title?: string;
  support?: string;
  startLocal?: string;
  ticketUrl?: string | null;
  sourceUrl?: string | null;
  sourceId?: string | null;
  verifiedAt?: string | null;
};

function slugifyShowTitle(input = ""): string {
  return String(input)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function splitSupportList(raw: unknown): string[] {
  if (typeof raw !== "string") return [];
  return raw
    .replace(/^with\s+/i, "")
    .split(/,|\/|;|\+|\band\b/gi)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function getCurrentDenverDateKey(now: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Denver",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const year = parts.find((p) => p.type === "year")?.value ?? "2026";
  const month = parts.find((p) => p.type === "month")?.value ?? "01";
  const day = parts.find((p) => p.type === "day")?.value ?? "01";
  return `${year}-${month}-${day}`;
}

export function formatShortShowDate(dateKey: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) return dateKey;
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Denver",
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${dateKey}T12:00:00-07:00`));
}

export function formatFullShowDate(dateKey: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) return dateKey;
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Denver",
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${dateKey}T12:00:00-07:00`));
}

function formatShowStartTime(startLocal?: string): string {
  if (!startLocal || !/T\d{2}:\d{2}/.test(startLocal)) return "Time TBA";
  const parsed = new Date(startLocal.includes("-") && startLocal.length > 19 ? startLocal : `${startLocal}-06:00`);
  if (Number.isNaN(parsed.getTime())) {
    const [, timePart] = startLocal.split("T");
    const [hhRaw, mmRaw] = (timePart || "").split(":");
    const hh = Number(hhRaw);
    const mm = mmRaw || "00";
    if (!Number.isFinite(hh)) return "Time TBA";
    const suffix = hh >= 12 ? "PM" : "AM";
    const h12 = hh % 12 === 0 ? 12 : hh % 12;
    return `${h12}:${mm} ${suffix}`;
  }
  const [, timePart] = startLocal.split("T");
  const [hhRaw, mmRaw] = (timePart || "").split(":");
  const hh = Number(hhRaw);
  const mm = (mmRaw || "00").slice(0, 2);
  if (!Number.isFinite(hh)) return "Time TBA";
  const suffix = hh >= 12 ? "PM" : "AM";
  const h12 = hh % 12 === 0 ? 12 : hh % 12;
  return `${h12}:${mm} ${suffix}`;
}

export function normalizeSearchText(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function mapLedgerRowsToCanonicalShows(
  rows: RawLedgerRow[],
  year: number,
  todayDateKey: string
): CanonicalRedRocksBookingShow[] {
  const idCounts = new Map<string, number>();
  const out: CanonicalRedRocksBookingShow[] = [];

  for (const row of rows) {
    const dateKey = typeof row?.dateKey === "string" ? row.dateKey.trim() : "";
    const title = typeof row?.title === "string" ? row.title.trim() : "";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey) || !dateKey.startsWith(`${year}-`) || !title) {
      continue;
    }

    const baseSlug = slugifyShowTitle(title) || "event";
    const baseId = `rr-${dateKey}-${baseSlug}`;
    const nextCount = (idCounts.get(baseId) ?? 0) + 1;
    idCounts.set(baseId, nextCount);
    const id = nextCount === 1 ? baseId : `${baseId}-${nextCount}`;

    const supportActs = splitSupportList(row.support);
    const artistNames = [title, ...supportActs];
    const startLocal =
      typeof row.startLocal === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(row.startLocal.trim())
        ? row.startLocal.trim()
        : `${dateKey}T19:00:00`;

    out.push({
      id,
      title,
      dateKey,
      dateLabel: formatShortShowDate(dateKey),
      fullDateLabel: formatFullShowDate(dateKey),
      startTimeLabel: formatShowStartTime(startLocal),
      startLocal,
      supportLabel: typeof row.support === "string" && row.support.trim() ? row.support.trim() : null,
      artistNames,
      showHref: `/shows/${id}`,
      sourceUrl: typeof row.sourceUrl === "string" && row.sourceUrl.trim() ? row.sourceUrl.trim() : null,
      isPastShow: dateKey < todayDateKey,
    });
  }

  return out;
}

export function buildCanonicalRedRocksBookingCatalog(
  todayDateKey: string = getCurrentDenverDateKey(),
  extraShows: CanonicalRedRocksBookingShow[] = []
): CanonicalRedRocksBookingShow[] {
  const mapped: CanonicalRedRocksBookingShow[] = [
    ...mapLedgerRowsToCanonicalShows(
      Array.isArray(redRocks2026Ledger) ? (redRocks2026Ledger as RawLedgerRow[]) : [],
      2026,
      todayDateKey
    ),
    ...mapLedgerRowsToCanonicalShows(
      Array.isArray(redRocks2027Ledger) ? (redRocks2027Ledger as RawLedgerRow[]) : [],
      2027,
      todayDateKey
    ),
  ];

  const byId = new Map<string, CanonicalRedRocksBookingShow>();
  for (const show of mapped) {
    if (!byId.has(show.id)) byId.set(show.id, show);
  }
  for (const extra of extraShows) {
    byId.set(extra.id, {
      ...extra,
      isPastShow: extra.dateKey < todayDateKey,
    });
  }

  return Array.from(byId.values()).sort((a, b) => {
    const byDate = a.dateKey.localeCompare(b.dateKey);
    if (byDate !== 0) return byDate;
    const byTime = a.startLocal.localeCompare(b.startLocal);
    if (byTime !== 0) return byTime;
    return a.title.localeCompare(b.title);
  });
}

export type DateResolutionResult =
  | { kind: "empty" }
  | { kind: "single_future_show"; show: CanonicalRedRocksBookingShow }
  | { kind: "past_show"; show: CanonicalRedRocksBookingShow }
  | { kind: "multiple_shows"; dateKey: string; dateLabel: string; shows: CanonicalRedRocksBookingShow[] }
  | { kind: "past_unlisted_date"; dateKey: string; dateLabel: string }
  | { kind: "unannounced_date"; dateKey: string; dateLabel: string };

export function resolveRedRocksDateSelection(
  dateKey: string,
  catalog: CanonicalRedRocksBookingShow[],
  todayDateKey: string = getCurrentDenverDateKey()
): DateResolutionResult {
  const clean = (dateKey || "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(clean)) {
    return { kind: "empty" };
  }

  const matches = catalog.filter((item) => item.dateKey === clean);
  if (matches.length === 1) {
    const show = matches[0];
    if (show.isPastShow || show.dateKey < todayDateKey) {
      return { kind: "past_show", show: { ...show, isPastShow: true } };
    }
    return { kind: "single_future_show", show };
  }

  if (matches.length > 1) {
    return {
      kind: "multiple_shows",
      dateKey: clean,
      dateLabel: formatFullShowDate(clean),
      shows: matches,
    };
  }

  if (clean < todayDateKey) {
    return {
      kind: "past_unlisted_date",
      dateKey: clean,
      dateLabel: formatFullShowDate(clean),
    };
  }

  return {
    kind: "unannounced_date",
    dateKey: clean,
    dateLabel: formatFullShowDate(clean),
  };
}

export function searchRedRocksShows(
  query: string,
  catalog: CanonicalRedRocksBookingShow[],
  limit = 8
): CanonicalRedRocksBookingShow[] {
  const normQuery = normalizeSearchText(query || "");
  if (!normQuery) return [];
  const tokens = normQuery.split(" ").filter(Boolean);

  const scored: Array<{ show: CanonicalRedRocksBookingShow; score: number }> = [];

  for (const show of catalog) {
    const normTitle = normalizeSearchText(show.title);
    const normArtists = normalizeSearchText(show.artistNames.join(" "));
    const normDate = normalizeSearchText(`${show.dateKey} ${show.dateLabel} ${show.fullDateLabel}`);
    const combined = `${normTitle} ${normArtists} ${normDate}`;

    const allTokensMatch = tokens.every((tok) => combined.includes(tok));
    if (!allTokensMatch) continue;

    let score = show.isPastShow ? 0 : 1000;
    if (normTitle === normQuery) score += 500;
    else if (normTitle.startsWith(normQuery)) score += 350;
    else if (normTitle.split(" ").some((w) => w.startsWith(normQuery))) score += 250;
    else if (normTitle.includes(normQuery)) score += 180;
    else if (normArtists.includes(normQuery)) score += 120;
    else score += 60;

    scored.push({ show, score });
  }

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (a.show.isPastShow !== b.show.isPastShow) return a.show.isPastShow ? 1 : -1;
    return a.show.dateKey.localeCompare(b.show.dateKey);
  });

  return scored.slice(0, limit).map((s) => s.show);
}

export function resolveInitialRedRocksShow(
  params: {
    showId?: string | null;
    dateKey?: string | null;
    artist?: string | null;
  },
  catalog: CanonicalRedRocksBookingShow[],
  todayDateKey: string = getCurrentDenverDateKey()
): DateResolutionResult {
  const showId = (params.showId || "").trim();
  if (showId) {
    const exactById = catalog.find((s) => s.id === showId);
    if (exactById) {
      return exactById.isPastShow || exactById.dateKey < todayDateKey
        ? { kind: "past_show", show: { ...exactById, isPastShow: true } }
        : { kind: "single_future_show", show: exactById };
    }
  }

  const dateKey = (params.dateKey || "").trim();
  const artist = (params.artist || "").trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
    const dateRes = resolveRedRocksDateSelection(dateKey, catalog, todayDateKey);
    if (dateRes.kind === "multiple_shows" && artist) {
      const normArtist = normalizeSearchText(artist);
      const matched = dateRes.shows.find(
        (s) =>
          normalizeSearchText(s.title) === normArtist ||
          normalizeSearchText(s.title).includes(normArtist)
      );
      if (matched) {
        return matched.isPastShow
          ? { kind: "past_show", show: matched }
          : { kind: "single_future_show", show: matched };
      }
    }
    return dateRes;
  }

  if (artist) {
    const hits = searchRedRocksShows(artist, catalog, 5);
    const exact = hits.find((s) => normalizeSearchText(s.title) === normalizeSearchText(artist));
    if (exact) {
      return exact.isPastShow
        ? { kind: "past_show", show: exact }
        : { kind: "single_future_show", show: exact };
    }
  }

  return { kind: "empty" };
}

/**
 * Preview/QA-only helper: adds a second same-date event on 2027-03-27 ONLY when
 * explicitly requested via `?qa_multi_date=1` in non-production environments so
 * automated & visual QA can exercise multi-event date disambiguation without
 * adding unverified public show pages.
 */
export function buildPreviewQaMultiDateFixture(todayDateKey: string): CanonicalRedRocksBookingShow[] {
  const dateKey = "2027-03-27";
  return [
    {
      id: "rr-2027-03-27-daytime-session-qa",
      title: "Red Rocks Daytime Matinee Session (Preview QA)",
      dateKey,
      dateLabel: formatShortShowDate(dateKey),
      fullDateLabel: formatFullShowDate(dateKey),
      startTimeLabel: "12:00 PM",
      startLocal: "2027-03-27T12:00:00",
      supportLabel: "Afternoon Acoustic Showcase",
      artistNames: ["Red Rocks Daytime Matinee Session (Preview QA)", "Afternoon Acoustic Showcase"],
      showHref: "/red-rocks/concerts",
      sourceUrl: null,
      isPastShow: dateKey < todayDateKey,
    },
  ];
}
