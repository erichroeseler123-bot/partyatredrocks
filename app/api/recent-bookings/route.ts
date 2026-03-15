import { NextResponse } from "next/server";
import type { RecentBooking } from "@/lib/recentBookings";
import { listRecentBookings } from "@/lib/recentBookingsStore";

export const runtime = "nodejs";

type RecentBookingResponse = {
  enabled: boolean;
  bookings: RecentBooking[];
};

export async function GET() {
  const enabled = process.env.NEXT_PUBLIC_ENABLE_RECENT_BOOKING_TOAST === "true";
  const bookings = await listRecentBookings().catch(() => []);

  const response: RecentBookingResponse = {
    enabled,
    bookings,
  };

  return NextResponse.json(response, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
