import "server-only";

import type { NormalizedEvent } from "@/lib/events/schema";
import {
  getEventsCatalog,
  getMultiYearEventsCatalog,
  getUpcomingEventsCatalog,
} from "@/lib/events/getCatalog";

type RedRocksOpts = {
  allowBlob?: boolean;
  allowFallbackSeedData?: boolean;
};

export async function getRedRocksEvents(
  year: number,
  _opts?: RedRocksOpts
): Promise<NormalizedEvent[]> {
  return getEventsCatalog(year, "redrocks");
}

export async function getMultiYearRedRocksEvents(
  years?: number[]
): Promise<NormalizedEvent[]> {
  return getMultiYearEventsCatalog({
    scopes: ["redrocks"],
    years,
  });
}

export async function getUpcomingRedRocksEvents(opts?: {
  fromDateKey?: string;
  years?: number[];
  limit?: number;
}): Promise<NormalizedEvent[]> {
  return getUpcomingEventsCatalog({
    scopes: ["redrocks"],
    venueId: "red-rocks-amphitheatre",
    fromDateKey: opts?.fromDateKey,
    years: opts?.years,
    limit: opts?.limit,
  });
}
