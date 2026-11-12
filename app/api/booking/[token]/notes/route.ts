import { NextResponse } from "next/server";
import {
  appendInternalOrderEvent,
  getInternalOrderByAnyReference,
  updateInternalOrderOps,
} from "@/lib/orders";

export const runtime = "nodejs";

const NO_STORE_HEADERS = { "Cache-Control": "no-store" } as const;
const MAX_BOOKING_TOKEN_LENGTH = 160;
const MAX_BOOKING_NOTES_LENGTH = 1000;
const TOKEN_FORMAT_PATTERN = /^[A-Za-z0-9._-]+$/;

type UpdateNotesBody = {
  notes?: unknown;
};

function sanitizeBookingToken(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (!trimmed || trimmed.length > MAX_BOOKING_TOKEN_LENGTH) return null;
  if (!TOKEN_FORMAT_PATTERN.test(trimmed)) return null;
  return trimmed;
}

function sanitizeBookingNotes(raw: string): string {
  // Normalize CRLF -> LF and strip ASCII control chars except newline (\n) and tab (\t)
  return raw
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim();
}

async function handleSaveBookingNotes(
  request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const resolvedParams = await params;
  const cleanToken = sanitizeBookingToken(resolvedParams?.token);
  if (!cleanToken) {
    return NextResponse.json(
      { ok: false, error: "Invalid booking token" },
      { status: 400, headers: NO_STORE_HEADERS },
    );
  }

  let body: UpdateNotesBody;
  try {
    const parsed = await request.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return NextResponse.json(
        { ok: false, error: "Invalid JSON body" },
        { status: 400, headers: NO_STORE_HEADERS },
      );
    }
    body = parsed as UpdateNotesBody;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400, headers: NO_STORE_HEADERS },
    );
  }

  if (typeof body.notes !== "string") {
    return NextResponse.json(
      { ok: false, error: "notes must be a string" },
      { status: 400, headers: NO_STORE_HEADERS },
    );
  }

  const sanitizedNotes = sanitizeBookingNotes(body.notes);
  if (sanitizedNotes.length > MAX_BOOKING_NOTES_LENGTH) {
    return NextResponse.json(
      {
        ok: false,
        error: `Notes must be ${MAX_BOOKING_NOTES_LENGTH} characters or fewer`,
      },
      { status: 400, headers: NO_STORE_HEADERS },
    );
  }

  const order = await getInternalOrderByAnyReference(cleanToken);
  if (!order) {
    return NextResponse.json(
      { ok: false, error: "Booking not found" },
      { status: 404, headers: NO_STORE_HEADERS },
    );
  }

  const updated = await updateInternalOrderOps(order.internalOrderId, {
    notes: sanitizedNotes,
  });
  if (!updated.ok) {
    return NextResponse.json(
      { ok: false, error: "Booking not found" },
      { status: 404, headers: NO_STORE_HEADERS },
    );
  }

  await appendInternalOrderEvent({
    internalOrderId: order.internalOrderId,
    eventType: "customer.booking_notes_updated",
    bookingStatus:
      typeof order.booking?.status === "string" ? order.booking.status : null,
    paymentStatus:
      typeof order.payment?.status === "string" ? order.payment.status : null,
    payload: {
      source: "public_booking_notes",
      notesLength: sanitizedNotes.length,
    },
  }).catch(() => undefined);

  return NextResponse.json(
    {
      ok: true,
      notes: sanitizedNotes,
    },
    { status: 200, headers: NO_STORE_HEADERS },
  );
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ token: string }> },
) {
  return handleSaveBookingNotes(request, context);
}

export async function POST(
  request: Request,
  context: { params: Promise<{ token: string }> },
) {
  return handleSaveBookingNotes(request, context);
}
