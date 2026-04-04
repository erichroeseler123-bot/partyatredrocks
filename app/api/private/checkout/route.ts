import { NextResponse } from "next/server";
import { saveInternalOrder, updateInternalOrderPaymentById } from "@/lib/orders";
import { appendRecentBooking } from "@/lib/recentBookingsStore";
import { createPrivateSquareOrder } from "@/lib/square";
import {
  getDccSatelliteContext,
  postDccSatelliteEvent,
  type DccSatelliteContext,
} from "@/lib/dccSatellite";
import {
  getPrivateRideOption,
  type PrivateRideSlug,
} from "@/lib/rideCatalog";
import { isSupportedPhoneCountry, normalizePhoneNumber } from "@/lib/phone";

export const runtime = "nodejs";

type CheckoutRequest = {
  venue?: string;
  option?: string;
  qty?: number;
  date?: string;
  artist?: string;
  guestCount?: number | null;
  pickupAddress?: string;
  notes?: string;
  sourcePath?: string;
  searchParams?: Record<string, string | string[] | undefined>;
  customer?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    phoneCountry?: string;
  };
};

function cleanString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function cleanOptional(value: unknown) {
  const trimmed = cleanString(value);
  return trimmed || null;
}

function asPositiveInt(value: unknown, fallback = 1) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.floor(parsed);
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as CheckoutRequest | null;
  if (!body) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const venue = cleanString(body.venue);
  const optionSlug = cleanString(body.option) as PrivateRideSlug;
  const rideOption = getPrivateRideOption(optionSlug);
  if (venue !== "red-rocks-amphitheatre" || !rideOption) {
    return NextResponse.json({ error: "Invalid private ride option." }, { status: 400 });
  }

  const firstName = cleanString(body.customer?.firstName);
  const lastName = cleanString(body.customer?.lastName);
  const email = cleanString(body.customer?.email).toLowerCase();
  const rawPhone = cleanString(body.customer?.phone);
  const phoneCountry = isSupportedPhoneCountry(body.customer?.phoneCountry)
    ? body.customer?.phoneCountry
    : "US";

  if (!firstName || !lastName || !email || !isEmail(email)) {
    return NextResponse.json({ error: "Enter your name and a valid email address." }, { status: 400 });
  }

  const normalizedPhone = normalizePhoneNumber(rawPhone, phoneCountry);
  if (!normalizedPhone) {
    return NextResponse.json({ error: "Enter a valid phone number." }, { status: 400 });
  }

  const qty = asPositiveInt(body.qty, 1);
  const guestCount = body.guestCount ? asPositiveInt(body.guestCount, 1) : null;
  const sourcePath = cleanOptional(body.sourcePath) || `/book/${venue}/private/${rideOption.slug}`;
  const totalDue = Number(rideOption.priceLabel.replace(/[^0-9.]/g, "")) * qty;
  const searchParams = body.searchParams;
  const satelliteContext = getDccSatelliteContext(searchParams);

  const created = await saveInternalOrder({
    rezdyBookingReference: null,
    productCode: rideOption.dccProduct,
    sessionKey: null,
    customer: {
      firstName,
      lastName,
      email,
      phone: normalizedPhone.e164,
      phoneDisplay: normalizedPhone.national,
      phoneCountry,
    },
    booking: {
      status: "pending_payment",
      venueSlug: venue,
      rideType: "private",
      productSlug: rideOption.slug,
      productTitle: rideOption.title,
      date: cleanOptional(body.date),
      artist: cleanOptional(body.artist),
      quantity: qty,
      guestCount,
      pickupAddress: cleanOptional(body.pickupAddress),
    },
    rezdyBookingPayload: {
      venueSlug: venue,
      option: rideOption.slug,
      date: cleanOptional(body.date),
      artist: cleanOptional(body.artist),
      qty,
      guestCount,
      pickupAddress: cleanOptional(body.pickupAddress),
      notes: cleanOptional(body.notes),
      sourcePath,
    },
    payment: {
      status: "unpaid",
      totalDue,
      totalPaid: 0,
      dccHandoffId: satelliteContext.handoffId || null,
      handoffMode: "embedded_square",
      handoffUrl: null,
      operatorAction: "Traveler completing embedded private checkout on Party at Red Rocks.",
    },
    pickup: {
      address: cleanOptional(body.pickupAddress),
    },
  });

  const squareOrder = await createPrivateSquareOrder({
    internalOrderId: created.internalOrderId,
    dccHandoffId: satelliteContext.handoffId || null,
    title: `${rideOption.title} private ride`,
    vehicleLabel: rideOption.title,
    date: cleanOptional(body.date),
    artist: cleanOptional(body.artist),
    quantity: qty,
    amountCents: Math.round(totalDue * 100),
  });

  await updateInternalOrderPaymentById(created.internalOrderId, {
    paymentStatus: "unpaid",
    paymentPatch: {
      totalDue,
      totalPaid: 0,
      dccHandoffId: satelliteContext.handoffId || null,
      handoffMode: "embedded_square",
      handoffUrl: null,
      operatorAction: "Traveler completing embedded private checkout on Party at Red Rocks.",
      squareOrderId: squareOrder.squareOrderId,
    },
    eventType: "internal.order.private_checkout_started",
    payload: {
      internalOrderId: created.internalOrderId,
      squareOrderId: squareOrder.squareOrderId,
    },
  }).catch(() => undefined);

  await appendRecentBooking({
    city: "Denver",
    rideType: "private",
    productLabel: rideOption.title,
    quantity: qty,
    createdAt: created.createdAt,
  }).catch(() => undefined);

  const eventBase = {
    searchParams,
    context: satelliteContext as Partial<DccSatelliteContext>,
    sourcePath,
    externalReference: created.internalOrderId,
    traveler: {
      email,
      phone: normalizedPhone.e164,
      name: `${firstName} ${lastName}`.trim(),
      partySize: guestCount ?? undefined,
    },
    booking: {
      venueSlug: venue,
      eventDate: cleanOptional(body.date) || undefined,
      quantity: qty,
      currency: "USD",
      amount: totalDue,
      productSlug: rideOption.slug,
    },
    metadata: {
      square_order_id: squareOrder.squareOrderId,
      pickup_address: cleanOptional(body.pickupAddress) || undefined,
      artist: cleanOptional(body.artist) || undefined,
    },
  } as const;

  await postDccSatelliteEvent({
    ...eventBase,
    eventType: "lead_captured",
    status: "captured",
    stage: "private_booking_form",
  }).catch(() => undefined);

  await postDccSatelliteEvent({
    ...eventBase,
    eventType: "booking_started",
    status: "started",
    stage: "embedded_square_checkout",
  }).catch(() => undefined);

  return NextResponse.json({
    internalOrderId: created.internalOrderId,
    bookingToken: created.bookingToken,
    squareOrderId: squareOrder.squareOrderId,
  });
}
