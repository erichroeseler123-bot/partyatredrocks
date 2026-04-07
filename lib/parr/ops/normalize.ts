import type { InternalOrderRow } from "@/lib/orders";
import { PRIVATE_RIDE_OPTIONS } from "@/lib/rideCatalog";
import { getFleetOwnerLabel, getOrderFleetOwner, getOrderServiceDate } from "@/lib/parr/fleet";
import { getOrderPaymentState, getOrderWorkflowState } from "@/lib/parr/ops/status";
import type { OpsOrder } from "@/lib/parr/ops/types";

function stringValue(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function numberValue(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function parseSessionKey(sessionKey: string | null | undefined) {
  if (!sessionKey) return { serviceDate: null, departureLabel: "Unscheduled", pickupLabel: "Needs review" };
  const [date, lane] = sessionKey.split(":");
  return {
    serviceDate: date || null,
    departureLabel: lane ? lane.replace(/-/g, " ") : "Scheduled run",
    pickupLabel: lane ? lane.replace(/-/g, " ") : "Needs review",
  };
}

function getProductLabel(productCode: string | null | undefined) {
  if (!productCode) return "Unknown product";
  if (productCode === "shared-denver") return "Shared Shuttle - Denver";
  if (productCode === "shared-golden") return "Shared Shuttle - Golden";
  const privateMatch = PRIVATE_RIDE_OPTIONS.find((option) => option.dccProduct === productCode);
  if (privateMatch) return privateMatch.title;
  return productCode;
}

function getPickupLabel(order: InternalOrderRow, fallback: string) {
  const pickup = order.pickup ?? null;
  return (
    stringValue(pickup?.label) ||
    stringValue(pickup?.address) ||
    stringValue(pickup?.location) ||
    stringValue(pickup?.name) ||
    fallback
  );
}

function getSeats(order: InternalOrderRow) {
  const qty =
    numberValue(order.booking?.quantity) ||
    numberValue(order.booking?.qty) ||
    numberValue(order.payment?.quantity) ||
    numberValue(order.payment?.qty) ||
    numberValue(order.pickup?.qty) ||
    numberValue(order.rezdyBookingPayload?.qty);
  if (qty > 0) return Math.floor(qty);
  if ((order.productCode || "").startsWith("shared-")) return 1;
  return 1;
}

function getInventoryLabel(order: InternalOrderRow, productLabel: string) {
  return (
    stringValue(order.booking?.inventoryLabel) ||
    stringValue(order.pickup?.inventoryLabel) ||
    stringValue(order.rezdyBookingPayload?.inventoryLabel) ||
    productLabel
  );
}

export function normalizeInternalOrder(order: InternalOrderRow): OpsOrder {
  const parsedSession = parseSessionKey(order.sessionKey);
  const isShared = (order.productCode || "").startsWith("shared-");
  const fallbackServiceDate = getOrderServiceDate(order);
  const serviceDate = parsedSession.serviceDate || fallbackServiceDate || null;
  const departureLabel = parsedSession.serviceDate
    ? parsedSession.departureLabel
    : isShared
      ? "Unscheduled"
      : "Private Car";
  const pickupFallback = isShared ? parsedSession.pickupLabel : "Private pickup";
  const paymentState = getOrderPaymentState(order);
  const workflowState = getOrderWorkflowState(order);
  const totalDue = numberValue(order.payment?.totalDue);
  const totalPaid = numberValue(order.payment?.totalPaid);
  const customer = order.customer ?? {};
  const productLabel = getProductLabel(order.productCode);
  const fleetOwner = getOrderFleetOwner(order);

  return {
    orderId: order.internalOrderId,
    bookingToken: order.bookingToken ?? null,
    bookingReference:
      stringValue(order.booking?.orderNumber) || stringValue(order.rezdyBookingReference) || null,
    createdAt: order.createdAt,
    lastTouchedAt: order.lastTouchedAt ?? null,
    customerName:
      [stringValue(customer.firstName), stringValue(customer.lastName)].filter(Boolean).join(" ") ||
      stringValue(customer.name) ||
      stringValue(customer.email) ||
      "Unknown rider",
    customerEmail: stringValue(customer.email) || "n/a",
    customerPhone: stringValue(customer.mobile) || stringValue(customer.phone) || null,
    productCode: order.productCode ?? null,
    productLabel,
    inventoryLabel: getInventoryLabel(order, productLabel),
    fleetOwner,
    fleetOwnerLabel: getFleetOwnerLabel(fleetOwner),
    sessionKey: order.sessionKey ?? null,
    serviceDate,
    departureLabel,
    pickupLabel: getPickupLabel(order, pickupFallback),
    seats: getSeats(order),
    bookingStatus: stringValue(order.booking?.status) || "n/a",
    paymentState,
    workflowState,
    totalDue,
    totalPaid,
    handoffMode: stringValue(order.payment?.handoffMode),
    note: order.notes ?? null,
    followUpStatus: order.followUpStatus ?? "new",
    operatorPaymentStep: order.operatorPaymentStep ?? "none",
    paymentRequestSentAt: order.paymentRequestSentAt ?? null,
    source: order,
  };
}
