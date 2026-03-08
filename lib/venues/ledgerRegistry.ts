import venueRegistry from "@/data/venues.registry.json";

export type VenueLedgerRegistryEntry = {
  key: string;
  slug: string;
  name: string;
};

export const VENUE_LEDGER_REGISTRY: VenueLedgerRegistryEntry[] = (
  venueRegistry as VenueLedgerRegistryEntry[]
).slice();

export type VenueLedgerKey = (typeof VENUE_LEDGER_REGISTRY)[number]["key"];

export const VENUE_LEDGER_BY_KEY = new Map(
  VENUE_LEDGER_REGISTRY.map((entry) => [entry.key, entry] as const)
);

export const VENUE_LEDGER_BY_SLUG = new Map(
  VENUE_LEDGER_REGISTRY.map((entry) => [entry.slug, entry] as const)
);
