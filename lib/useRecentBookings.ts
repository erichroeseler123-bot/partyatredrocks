"use client";

import { useEffect, useRef, useState } from "react";
import type { RecentBooking } from "@/lib/recentBookings";
import { recentBookingKey } from "@/lib/recentBookings";

type RecentBookingResponse = {
  enabled: boolean;
  bookings: RecentBooking[];
};

const POLL_MS = 90000;
const FRESH_MS = 30 * 60 * 1000;

export function useRecentBookings() {
  const [booking, setBooking] = useState<RecentBooking | null>(null);
  const [dismissedKey, setDismissedKey] = useState<string | null>(null);
  const seenKeys = useRef(new Set<string>());

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_ENABLE_RECENT_BOOKING_TOAST !== "true") return;

    let cancelled = false;
    let timeoutId: number | undefined;

    async function poll() {
      try {
        const res = await fetch("/api/recent-bookings", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as RecentBookingResponse;
        if (!data.enabled || cancelled) return;

        const fresh = data.bookings.find((item) => {
          const ts = Date.parse(item.createdAt);
          if (!Number.isFinite(ts)) return false;
          const key = recentBookingKey(item);
          if (seenKeys.current.has(key) || dismissedKey === key) return false;
          return Date.now() - ts <= FRESH_MS;
        });

        if (fresh) {
          const key = recentBookingKey(fresh);
          seenKeys.current.add(key);
          setBooking(fresh);
        }
      } catch {
        // Keep the dormant system silent until a real feed exists.
      } finally {
        if (!cancelled) {
          timeoutId = window.setTimeout(poll, POLL_MS);
        }
      }
    }

    void poll();

    return () => {
      cancelled = true;
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [dismissedKey]);

  useEffect(() => {
    if (!booking) return;
    const timeout = window.setTimeout(() => setBooking(null), 5500);
    return () => window.clearTimeout(timeout);
  }, [booking]);

  function dismiss() {
    if (!booking) return;
    setDismissedKey(recentBookingKey(booking));
    setBooking(null);
  }

  return { booking, dismiss };
}
