import type { NormalizedEvent } from "@/lib/events/schema";

export function getDenverDateKey(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Denver",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function resolveUpcomingYears(fromDateKey?: string, explicitYears?: number[]): number[] {
  if (Array.isArray(explicitYears) && explicitYears.length > 0) {
    const valid = Array.from(new Set(explicitYears.filter((year) => Number.isInteger(year) && year >= 2000 && year <= 2100)));
    if (valid.length > 0) {
      return valid.sort((a, b) => a - b);
    }
  }

  const effectiveDateKey = fromDateKey && /^\d{4}-\d{2}-\d{2}$/.test(fromDateKey)
    ? fromDateKey
    : getDenverDateKey();
  const baseYear = Number(effectiveDateKey.slice(0, 4));
  const currentYear = Number.isInteger(baseYear) && baseYear >= 2000 && baseYear <= 2100
    ? baseYear
    : new Date().getUTCFullYear();

  return [currentYear, currentYear + 1];
}

export function compareEventsChronologically(a: NormalizedEvent, b: NormalizedEvent): number {
  const dateCompare = a.dateKey.localeCompare(b.dateKey);
  if (dateCompare !== 0) return dateCompare;

  const startA = a.startLocal ?? a.startAt ?? "";
  const startB = b.startLocal ?? b.startAt ?? "";
  const startCompare = startA.localeCompare(startB);
  if (startCompare !== 0) return startCompare;

  const nameCompare = a.name.localeCompare(b.name);
  if (nameCompare !== 0) return nameCompare;

  return a.id.localeCompare(b.id);
}

export function dedupeAndSortEvents(events: NormalizedEvent[]): NormalizedEvent[] {
  const byId = new Map<string, NormalizedEvent>();
  for (const event of events) {
    if (!event?.id || !event?.dateKey) continue;
    const existing = byId.get(event.id);
    if (!existing) {
      byId.set(event.id, event);
      continue;
    }
    byId.set(event.id, {
      ...existing,
      ...event,
      sourceUrl: event.sourceUrl ?? existing.sourceUrl ?? null,
      ticketUrl: event.ticketUrl ?? existing.ticketUrl ?? null,
      verifiedAt: event.verifiedAt ?? existing.verifiedAt ?? null,
      image: event.image ?? existing.image ?? null,
    });
  }
  return Array.from(byId.values()).sort(compareEventsChronologically);
}

export type SelectUpcomingEventsOptions = {
  fromDateKey?: string;
  venueId?: string;
  limit?: number;
};

export function selectUpcomingEvents(
  events: NormalizedEvent[],
  opts?: SelectUpcomingEventsOptions
): NormalizedEvent[] {
  const fromDateKey =
    opts?.fromDateKey && /^\d{4}-\d{2}-\d{2}$/.test(opts.fromDateKey)
      ? opts.fromDateKey
      : getDenverDateKey();
  const venueId = opts?.venueId?.trim() || null;

  const filtered = dedupeAndSortEvents(events).filter((event) => {
    if (event.dateKey < fromDateKey) return false;
    if (venueId && event.venueId !== venueId) return false;
    return true;
  });

  if (typeof opts?.limit === "number" && opts.limit >= 0) {
    return filtered.slice(0, opts.limit);
  }
  return filtered;
}
