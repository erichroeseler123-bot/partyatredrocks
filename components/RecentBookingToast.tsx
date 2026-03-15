"use client";

import { X } from "lucide-react";
import { useRecentBookings } from "@/lib/useRecentBookings";
import { recentBookingLabel } from "@/lib/recentBookings";

export function RecentBookingToast() {
  const enabled = process.env.NEXT_PUBLIC_ENABLE_RECENT_BOOKING_TOAST === "true";
  const { booking, dismiss } = useRecentBookings();

  if (!enabled || !booking) return null;

  return (
    <div className="pointer-events-none fixed inset-x-4 bottom-4 z-[60] flex justify-center sm:inset-x-auto sm:right-4 sm:justify-end">
      <div className="pointer-events-auto flex max-w-[360px] items-start gap-3 rounded-[20px] border border-white/12 bg-[rgba(11,18,36,0.94)] px-4 py-3 shadow-[0_24px_80px_rgba(0,0,0,0.42)] backdrop-blur">
        <div className="min-w-0">
          <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#ffb07c]">
            Recent Booking
          </div>
          <div className="mt-1 text-sm leading-6 text-white/88">{recentBookingLabel(booking)}</div>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/6 text-white/78 transition hover:bg-white/10 hover:text-white"
          aria-label="Dismiss recent booking notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
