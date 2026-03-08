import "server-only";

import type { NormalizedEvent } from "@/lib/events/schema";
import { getEventsCatalog } from "@/lib/events/getCatalog";

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
