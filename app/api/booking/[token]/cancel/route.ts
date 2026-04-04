import { NextResponse } from "next/server";

import { getInternalOrderByBookingToken } from "@/lib/orders";
import { cancelSharedBookingByInternalOrderId } from "@/lib/sharedInventory";

export const runtime = "nodejs";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const order = await getInternalOrderByBookingToken(token);

  if (!order) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  const rideType = typeof order.booking?.rideType === "string" ? order.booking.rideType : null;
  if (rideType !== "shared") {
    return NextResponse.json(
      { error: "Private rides are not cancelled online. Text 720-369-6292 and we will handle it." },
      { status: 400 }
    );
  }

  const result = await cancelSharedBookingByInternalOrderId(order.internalOrderId);

  if (!result.ok) {
    if (result.reason === "cutoff_passed") {
      return NextResponse.json({ error: "This booking can no longer be cancelled online." }, { status: 400 });
    }
    if (result.reason === "expired") {
      return NextResponse.json({ error: "This booking is no longer active and cannot be cancelled online." }, { status: 400 });
    }
    if (result.reason === "not_found") {
      return NextResponse.json(
        { error: "We could not find the live shuttle reservation for this booking. Text 720-369-6292 and we will handle it." },
        { status: 404 }
      );
    }
    return NextResponse.json({ error: "Unable to cancel booking online. Text 720-369-6292 and we will handle it." }, { status: 400 });
  }

  const payment = result.order?.payment && typeof result.order.payment === "object"
    ? result.order.payment as Record<string, unknown>
    : {};
  const refundStatus = typeof payment.refundStatus === "string"
    ? payment.refundStatus
    : result.alreadyCancelled
      ? "initiated"
      : result.refundEligible
        ? "initiated"
        : "ineligible";

  return NextResponse.json({
    ok: true,
    alreadyCancelled: result.alreadyCancelled,
    refundStatus,
    refundEligible: refundStatus === "initiated",
  });
}
