import { NextResponse } from "next/server";
import { resolveBookingShowContext } from "@/lib/bookingContext";
import {
  attachSharedSquareOrder,
  cancelPendingSharedCheckout,
  createPendingSharedCheckout,
} from "@/lib/sharedInventory";
import { createSharedSquareOrder, squareApplicationId, squareLocationId } from "@/lib/square";
import { isSupportedPhoneCountry, normalizePhoneNumber } from "@/lib/phone";

export const runtime = "nodejs";

type Body = {
  venue?: string;
  date?: string;
  pickupHub?: string;
  qty?: number;
  artist?: string;
  event?: string;
  notes?: string;
  customer?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    phoneCountry?: string;
  };
};

function requiredString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const venue = requiredString(body.venue) || "red-rocks-amphitheatre";
  const date = requiredString(body.date);
  const pickupHub = body.pickupHub === "golden" ? "golden" : "denver";
  const firstName = requiredString(body.customer?.firstName);
  const lastName = requiredString(body.customer?.lastName);
  const email = requiredString(body.customer?.email);
  const phone = requiredString(body.customer?.phone);
  const phoneCountry = isSupportedPhoneCountry(body.customer?.phoneCountry) ? body.customer?.phoneCountry : "US";
  const qty = typeof body.qty === "number" && Number.isFinite(body.qty) ? body.qty : 1;
  const artist = requiredString(body.artist);
  const event = requiredString(body.event);

  if (!date) return NextResponse.json({ error: "Missing date" }, { status: 400 });
  if (!firstName || !lastName || !email || !phone) {
    return NextResponse.json({ error: "Missing customer details" }, { status: 400 });
  }

  const normalizedPhone = normalizePhoneNumber(phone, phoneCountry);
  if (!normalizedPhone) {
    return NextResponse.json({ error: "Enter a valid phone number with the correct country." }, { status: 400 });
  }

  let pending: Awaited<ReturnType<typeof createPendingSharedCheckout>> | null = null;

  try {
    const show = await resolveBookingShowContext({
      venueSlug: venue,
      dateKey: date,
      artistName: artist || null,
      event: event || null,
    });

    pending = await createPendingSharedCheckout({
      venue,
      date,
      pickupHub,
      qty,
      artist: show?.artistName || artist || null,
      event: event || show?.showId || null,
      show,
      notes: requiredString(body.notes) || null,
      customer: { firstName, lastName, email, phone: normalizedPhone.e164, phoneCountry: normalizedPhone.country },
    });

    const squareOrder = await createSharedSquareOrder({
      internalOrderId: pending.internalOrderId,
      title: show?.showTitle || `Red Rocks shared shuttle ${pickupHub}`,
      pickupHub,
      date,
      artist: show?.artistName || artist || null,
      quantity: qty,
      amountCents: pending.totalDueCents,
    });

    await attachSharedSquareOrder({
      internalOrderId: pending.internalOrderId,
      squareOrderId: squareOrder.squareOrderId,
      fallbackHold: {
        venue,
        date,
        pickupHub,
        qty,
        artist: show?.artistName || artist || null,
        createdAt: pending.createdAt,
        expiresAt: pending.expiresAt,
      },
    });

    return NextResponse.json({
      ok: true,
      internalOrderId: pending.internalOrderId,
      expiresAt: pending.expiresAt,
      squareOrderId: squareOrder.squareOrderId,
      squareApplicationId: squareApplicationId(),
      squareLocationId: squareLocationId(),
      availableAfterHold: pending.availableAfterHold,
      paymentProvider: "square",
      bookingStatus: "pending_payment",
      paymentStatus: "unpaid",
    });
  } catch (error) {
    if (pending?.internalOrderId) {
      await cancelPendingSharedCheckout(pending.internalOrderId, "cancelled").catch(() => undefined);
    }
    const message = error instanceof Error ? error.message : "Failed to start checkout";
    return NextResponse.json({ error: message }, { status: 409 });
  }
}
