import { NextResponse } from "next/server";
import { rezdyCreateBooking, type RezdyBookPayload } from "@/lib/rezdy";
import { rezdyGetAvailability } from "@/lib/rezdy";
import { rezdyListProducts } from "@/lib/rezdy";
import { saveInternalOrder } from "@/lib/orders";

export const runtime = "nodejs";

type BookRequestBody = {
  productCode?: string;
  startTimeLocal?: string;
  endTimeLocal?: string;
  qty?: number;
  customer?: Record<string, unknown>;
  payment?: unknown;
  pickup?: Record<string, unknown>;
  rezdyBooking?: RezdyBookPayload;
};

type RezdyPriceOption = {
  id?: number;
  label?: string;
};

type RezdyProductMeta = {
  productCode?: string;
  priceOptions?: unknown[];
  quantityRequiredMin?: number;
  quantityRequiredMax?: number;
};

type BookingSummary = {
  orderNumber: string | null;
  bookingStatus: string;
  paymentStatus: "paid" | "unpaid" | "partial" | "unknown";
  totalDue: number | null;
  totalPaid: number | null;
};

type PaymentHandoff =
  | { mode: "url"; url: string; actionLabel: string }
  | { mode: "manual"; operatorAction: string };

function hasSeats(session: Record<string, unknown>, qty: number): boolean {
  const seats = typeof session.seatsAvailable === "number" ? session.seatsAvailable : null;
  if (seats === null) return true;
  return seats >= qty;
}

function sessionMatches(session: Record<string, unknown>, startTimeLocal: string | undefined): boolean {
  if (!startTimeLocal) return true;
  const local = typeof session.startTimeLocal === "string" ? session.startTimeLocal : null;
  const utc = typeof session.startTime === "string" ? session.startTime : null;
  return local === startTimeLocal || utc === startTimeLocal;
}

function sessionEndMatches(session: Record<string, unknown>, endTimeLocal: string | undefined): boolean {
  if (!endTimeLocal) return true;
  const local = typeof session.endTimeLocal === "string" ? session.endTimeLocal : null;
  const utc = typeof session.endTime === "string" ? session.endTime : null;
  return local === endTimeLocal || utc === endTimeLocal;
}

function clampQty(qty: number, product: RezdyProductMeta): number {
  const min = typeof product.quantityRequiredMin === "number" ? product.quantityRequiredMin : 1;
  const max = typeof product.quantityRequiredMax === "number" ? product.quantityRequiredMax : null;
  const atLeastMin = Math.max(min, qty);
  return max !== null ? Math.min(max, atLeastMin) : atLeastMin;
}

function firstPriceOption(product: RezdyProductMeta): RezdyPriceOption {
  const options = Array.isArray(product.priceOptions) ? (product.priceOptions as unknown[]) : [];
  const first = options[0];
  return first && typeof first === "object" ? (first as RezdyPriceOption) : {};
}

function buildBookingItems(input: {
  productCode: string;
  startTimeLocal?: string;
  endTimeLocal?: string;
  qty: number;
  product: RezdyProductMeta;
}) {
  const option = firstPriceOption(input.product);
  const quantityRow: Record<string, unknown> = { value: input.qty };
  if (typeof option.label === "string" && option.label.trim()) {
    quantityRow.optionLabel = option.label;
  }
  if (typeof option.id === "number") {
    quantityRow.optionId = option.id;
  }

  const item: Record<string, unknown> = {
    productCode: input.productCode,
    quantities: [quantityRow],
  };
  if (input.startTimeLocal) item.startTimeLocal = input.startTimeLocal;
  if (input.endTimeLocal) item.endTimeLocal = input.endTimeLocal;

  return [item];
}

function toNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function summarizeBooking(booking: Record<string, unknown>): BookingSummary {
  const totalDue = toNumber(booking.totalDue);
  const totalPaid = toNumber(booking.totalPaid);
  const bookingStatus = typeof booking.status === "string" ? booking.status : "pending_confirmation";
  const orderNumber = typeof booking.orderNumber === "string" ? booking.orderNumber : null;

  let paymentStatus: BookingSummary["paymentStatus"] = "unknown";
  if (totalDue !== null && totalPaid !== null) {
    if (totalPaid <= 0 && totalDue > 0) paymentStatus = "unpaid";
    else if (totalPaid >= totalDue) paymentStatus = "paid";
    else paymentStatus = "partial";
  }

  return { orderNumber, bookingStatus, paymentStatus, totalDue, totalPaid };
}

function extractPaymentUrl(booking: Record<string, unknown>): string | null {
  const directCandidates = [
    "paymentUrl",
    "paymentLink",
    "checkoutUrl",
    "invoiceUrl",
    "customerPaymentUrl",
  ];
  for (const key of directCandidates) {
    const value = booking[key];
    if (typeof value === "string" && /^https?:\/\//i.test(value)) return value;
  }

  const fields = Array.isArray(booking.fields) ? booking.fields : [];
  for (const row of fields) {
    if (!row || typeof row !== "object") continue;
    const rec = row as Record<string, unknown>;
    const label = typeof rec.label === "string" ? rec.label.toLowerCase() : "";
    const value = typeof rec.value === "string" ? rec.value : "";
    if (value && /^https?:\/\//i.test(value) && /(pay|invoice|checkout|payment)/i.test(label)) {
      return value;
    }
  }

  return null;
}

function resolvePaymentHandoff(booking: Record<string, unknown>, summary: BookingSummary): PaymentHandoff {
  const paymentUrl = extractPaymentUrl(booking);
  if (paymentUrl && (summary.paymentStatus === "unpaid" || summary.paymentStatus === "partial")) {
    return {
      mode: "url",
      url: paymentUrl,
      actionLabel: "Complete Payment",
    };
  }
  return {
    mode: "manual",
    operatorAction: "Send payment request from Rezdy dashboard for this order.",
  };
}

export async function POST(request: Request) {
  let body: BookRequestBody;
  try {
    body = (await request.json()) as BookRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Payload must be an object" }, { status: 400 });
  }

  const productCode = typeof body.productCode === "string" ? body.productCode : "";
  if (!productCode) {
    return NextResponse.json({ error: "Missing productCode in booking payload" }, { status: 400 });
  }

  if (typeof body.payment !== "undefined") {
    return NextResponse.json(
      { error: "Client payment payload is not accepted. Payment state is managed by Rezdy." },
      { status: 400 }
    );
  }

  const requestedQty = typeof body.qty === "number" && Number.isFinite(body.qty) && body.qty > 0 ? body.qty : 1;

  let productMeta: RezdyProductMeta | null = null;
  try {
    const productQuery = new URLSearchParams();
    productQuery.set("productCode", productCode);
    const products = await rezdyListProducts(productQuery);
    productMeta = (products.find((p) => p.productCode === productCode) || null) as RezdyProductMeta | null;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Product lookup failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
  if (!productMeta) {
    return NextResponse.json({ error: "Selected product no longer exists" }, { status: 409 });
  }
  const qty = clampQty(requestedQty, productMeta);

  const availabilityQuery = new URLSearchParams();
  availabilityQuery.set("productCode", productCode);
  if (body.startTimeLocal) availabilityQuery.set("startTimeLocal", body.startTimeLocal);
  if (body.endTimeLocal) availabilityQuery.set("endTimeLocal", body.endTimeLocal);
  availabilityQuery.set("qty", String(qty));

  let sessions: Array<Record<string, unknown>> = [];
  try {
    sessions = (await rezdyGetAvailability(availabilityQuery)) as Array<Record<string, unknown>>;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Availability check failed";
    return NextResponse.json({ error: message }, { status: 409 });
  }

  const matching = sessions.filter(
    (session) => sessionMatches(session, body.startTimeLocal) && sessionEndMatches(session, body.endTimeLocal)
  );
  const session = matching.find((candidate) => hasSeats(candidate, qty));
  if (!session) {
    return NextResponse.json({ error: "Selected session is no longer available" }, { status: 409 });
  }

  const rezdyBookingPayload: RezdyBookPayload = {
    ...((body.rezdyBooking || {}) as Record<string, unknown>),
    productCode,
    items: buildBookingItems({
      productCode,
      startTimeLocal: body.startTimeLocal,
      endTimeLocal: body.endTimeLocal,
      qty,
      product: productMeta,
    }),
  };
  if (body.startTimeLocal && typeof rezdyBookingPayload.startTimeLocal !== "string") {
    rezdyBookingPayload.startTimeLocal = body.startTimeLocal;
  }
  if (body.endTimeLocal && typeof rezdyBookingPayload.endTimeLocal !== "string") {
    rezdyBookingPayload.endTimeLocal = body.endTimeLocal;
  }

  try {
    const booking = await rezdyCreateBooking(rezdyBookingPayload);
    const bookingRef =
      typeof booking.bookingCode === "string"
        ? booking.bookingCode
        : typeof booking.orderNumber === "string"
          ? booking.orderNumber
          : null;
    const summary = summarizeBooking(booking as Record<string, unknown>);
    const paymentHandoff = resolvePaymentHandoff(booking as Record<string, unknown>, summary);

    const saved = await saveInternalOrder({
      rezdyBookingReference: bookingRef,
      rezdyBookingPayload: rezdyBookingPayload as Record<string, unknown>,
      productCode,
      sessionKey: body.startTimeLocal || null,
      customer: body.customer || null,
      booking: {
        status: summary.bookingStatus,
        orderNumber: summary.orderNumber,
      },
      payment: {
        provider: "rezdy",
        status: summary.paymentStatus,
        totalDue: summary.totalDue,
        totalPaid: summary.totalPaid,
        source: "rezdy_managed",
        handoffMode: paymentHandoff.mode,
        handoffUrl: paymentHandoff.mode === "url" ? paymentHandoff.url : null,
        operatorAction:
          paymentHandoff.mode === "manual" ? paymentHandoff.operatorAction : null,
      },
      pickup: body.pickup || null,
    });

    return NextResponse.json({
      orderNumber: summary.orderNumber,
      bookingStatus: summary.bookingStatus,
      paymentStatus: summary.paymentStatus,
      totalPaid: summary.totalPaid,
      totalDue: summary.totalDue,
      paymentHandoff,
      internalOrderId: saved.internalOrderId,
      internalCreatedAt: saved.createdAt,
      booking,
      status: summary,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create Rezdy booking";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
