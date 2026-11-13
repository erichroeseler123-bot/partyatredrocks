"use client";

import { useEffect } from "react";
import { trackNetworkEvent } from "@/lib/networkEvents";

export default function VerifiedBookingTelemetry({
  dedupeEventId,
  status,
  isGuestView,
  date,
}: {
  dedupeEventId: string;
  status: string;
  isGuestView: boolean;
  date?: string | null;
}) {
  useEffect(() => {
    if (isGuestView || status !== "confirmed" || !dedupeEventId) return;
    trackNetworkEvent({
      eventName: "booking_completed",
      eventId: dedupeEventId,
      entryPage: "/booking/[token]",
      travelIntent: "red-rocks-private-transfer",
      date: date && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : undefined,
      verifiedSource: "parr_internal_order_confirmed",
    });
  }, [dedupeEventId, status, isGuestView, date]);

  return null;
}
