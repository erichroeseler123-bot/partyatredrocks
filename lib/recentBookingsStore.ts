import "server-only";

import { blobReadJson, blobWriteJson } from "@/lib/blobJson";
import type { RecentBooking } from "@/lib/recentBookings";
import { recentBookingKey } from "@/lib/recentBookings";

const RECENT_BOOKINGS_PATH = "cache/recent-bookings.json";
const MAX_RECENT_BOOKINGS = 20;

type RecentBookingFeed = {
  updatedAt: string;
  bookings: RecentBooking[];
};

function isRideType(value: unknown): value is RecentBooking["rideType"] {
  return value === "shared" || value === "private";
}

function normalizeRecentBooking(value: unknown): RecentBooking | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  const city = typeof row.city === "string" ? row.city.trim() : "";
  const rideType = row.rideType;
  const createdAt = typeof row.createdAt === "string" ? row.createdAt : "";
  if (!city || !isRideType(rideType) || !createdAt || !Number.isFinite(Date.parse(createdAt))) {
    return null;
  }

  const productLabel =
    typeof row.productLabel === "string" && row.productLabel.trim() ? row.productLabel.trim() : undefined;
  const quantity =
    typeof row.quantity === "number" && Number.isFinite(row.quantity) && row.quantity > 0
      ? Math.round(row.quantity)
      : undefined;

  return {
    city,
    rideType,
    productLabel,
    quantity,
    createdAt,
  };
}

function normalizeFeed(value: unknown): RecentBookingFeed {
  if (!value || typeof value !== "object") {
    return { updatedAt: new Date(0).toISOString(), bookings: [] };
  }

  const row = value as Record<string, unknown>;
  const updatedAt =
    typeof row.updatedAt === "string" && Number.isFinite(Date.parse(row.updatedAt))
      ? row.updatedAt
      : new Date(0).toISOString();
  const bookings = Array.isArray(row.bookings)
    ? row.bookings.map(normalizeRecentBooking).filter((item): item is RecentBooking => item !== null)
    : [];

  return { updatedAt, bookings };
}

export async function listRecentBookings(): Promise<RecentBooking[]> {
  const feed = await blobReadJson<RecentBookingFeed>(RECENT_BOOKINGS_PATH, { revalidateSeconds: 0 }).catch(
    () => null
  );
  return normalizeFeed(feed).bookings;
}

export async function appendRecentBooking(booking: RecentBooking): Promise<void> {
  const normalized = normalizeRecentBooking(booking);
  if (!normalized) return;

  const current = normalizeFeed(
    await blobReadJson<RecentBookingFeed>(RECENT_BOOKINGS_PATH, { revalidateSeconds: 0 }).catch(() => null)
  );
  const next = [normalized, ...current.bookings].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const deduped: RecentBooking[] = [];
  const seen = new Set<string>();

  for (const row of next) {
    const key = recentBookingKey(row);
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(row);
    if (deduped.length >= MAX_RECENT_BOOKINGS) break;
  }

  await blobWriteJson(
    RECENT_BOOKINGS_PATH,
    {
      updatedAt: new Date().toISOString(),
      bookings: deduped,
    },
    { cacheControlMaxAge: 60 }
  );
}
