import type { InternalOrderRow } from "@/lib/orders";
import { getOrderFleetOwner } from "@/lib/parr/fleet";
import { getOrderPaymentState, getOrderWorkflowState } from "@/lib/parr/ops/status";

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function readFiniteNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

const SYNTHETIC_EMAIL_DOMAINS = [
  "@example.com",
  "@example.org",
  "@example.net",
  ".example",
  ".test",
  ".invalid",
  ".localhost",
];

const SYNTHETIC_EMAIL_PREFIX_RE = /^(?:test|qa|smoke|e2e|synthetic|codex|antigravity|noreply|no-reply)(?:[+._-]|@)/i;
const SYNTHETIC_TOKEN_RE = /(?:^|[^a-z0-9])(e2e|smoke|synthetic|qa|codex|antigravity)(?:$|[^a-z0-9])/i;
const SYNTHETIC_NAME_RE = /(?:^|[^a-z0-9])test(?:$|[^a-z0-9])|^(?:john|jane)\s+doe$/i;
const SYNTHETIC_ID_PREFIX_RE = /^(?:r-test-|test[-_]|synth[-_]|e2e[-_]|smoke[-_]|qa[-_])/i;

export function isSyntheticTestOrder(order: InternalOrderRow): boolean {
  const customer = order.customer ?? {};
  const firstName = readString(customer.firstName).toLowerCase();
  const lastName = readString(customer.lastName).toLowerCase();
  const fullName = `${firstName} ${lastName}`.trim();
  const altName = readString(customer.name).toLowerCase();
  const email = readString(customer.email).toLowerCase();
  const notes = readString(order.notes).toLowerCase();
  const bookingNotes = readString(order.booking?.notes).toLowerCase();
  const ref = readString(order.rezdyBookingReference).toLowerCase();
  const orderId = readString((order as Record<string, unknown>).orderId).toLowerCase();
  const internalOrderId = readString(order.internalOrderId).toLowerCase();
  const sessionKey = readString(order.sessionKey).toLowerCase();

  const allTextFields = [
    fullName,
    altName,
    email,
    notes,
    bookingNotes,
    ref,
    orderId,
    internalOrderId,
    sessionKey,
  ];

  if (allTextFields.some((field) => field.includes("[test]"))) {
    return true;
  }

  if (email) {
    if (
      SYNTHETIC_EMAIL_DOMAINS.some((suffix) => email.endsWith(suffix)) ||
      email.includes("@test.") ||
      SYNTHETIC_EMAIL_PREFIX_RE.test(email)
    ) {
      return true;
    }
  }

  if (
    SYNTHETIC_NAME_RE.test(fullName) ||
    SYNTHETIC_NAME_RE.test(altName)
  ) {
    return true;
  }

  if (
    SYNTHETIC_ID_PREFIX_RE.test(ref) ||
    SYNTHETIC_ID_PREFIX_RE.test(orderId) ||
    SYNTHETIC_ID_PREFIX_RE.test(internalOrderId) ||
    SYNTHETIC_ID_PREFIX_RE.test(sessionKey)
  ) {
    return true;
  }

  if (allTextFields.some((field) => field.length > 0 && SYNTHETIC_TOKEN_RE.test(field))) {
    return true;
  }

  return false;
}

const QUOTE_BOOKING_STATUSES = new Set(["quote", "open_quote", "quoted", "inquiry"]);
const HOLD_BOOKING_STATUSES = new Set(["hold", "on_hold", "held", "reserved_hold"]);

export type OwnerSummaryMetrics28d = {
  ordersTotal: number;
  genuineOrdersTotal: number;
  testRecordsExcluded: number;
  paidOrders: number;
  paidGrossSalesUsd: number;
  confirmedUnpaidOrders: number;
  pendingPaymentOrders: number;
  openQuotes: number;
  holds: number;
  awaitingBalanceOrders: number;
  awaitingBalanceGrossUsd: number;
  depositCollectedUsd: number;
  needsReviewOrders: number;
  grossSalesUsd: number;
  ownedGrossRevenueUsd: number;
  netOperatingRevenueUsd: null;
  affiliateCommissionsUsd: 0;
  accountingNote: string;
};

export const OWNER_SUMMARY_ACCOUNTING_NOTE =
  "Gross merchant sales (grossSalesUsd, paidGrossSalesUsd, and ownedGrossRevenueUsd) reflect collected customer payments only — never uncollected balances, open quotes, or holds — and are not net operating revenue or profit.";

export function summarizeOwnerOrders28d(
  orders: InternalOrderRow[],
  now: Date = new Date()
): OwnerSummaryMetrics28d {
  const windowStartMs = now.getTime() - 28 * 24 * 60 * 60 * 1000;

  let testRecordsExcluded = 0;
  let genuineOrdersTotal = 0;
  let paidOrders = 0;
  let paidGrossSalesCents = 0;
  let confirmedUnpaidOrders = 0;
  let pendingPaymentOrders = 0;
  let openQuotes = 0;
  let holds = 0;
  let awaitingBalanceOrders = 0;
  let awaitingBalanceGrossCents = 0;
  let depositCollectedCents = 0;
  let needsReviewOrders = 0;
  let grossSalesCents = 0;
  let ownedGrossRevenueCents = 0;

  for (const order of orders) {
    const createdMs = Date.parse(order.createdAt);
    if (Number.isNaN(createdMs) || createdMs < windowStartMs) {
      continue;
    }

    if (isSyntheticTestOrder(order)) {
      testRecordsExcluded += 1;
      continue;
    }

    const workflowState = getOrderWorkflowState(order);
    if (workflowState === "canceled") {
      continue;
    }

    const bookingStatus = readString(order.booking?.status).toLowerCase();
    if (QUOTE_BOOKING_STATUSES.has(bookingStatus)) {
      openQuotes += 1;
      continue;
    }

    if (HOLD_BOOKING_STATUSES.has(bookingStatus)) {
      holds += 1;
      continue;
    }

    genuineOrdersTotal += 1;

    const paymentState = getOrderPaymentState(order);
    const rawPaymentStatus = readString(order.payment?.status).toLowerCase();
    const totalDue = Math.max(0, readFiniteNumber(order.payment?.totalDue));
    const totalPaid = Math.max(0, readFiniteNumber(order.payment?.totalPaid));

    if (workflowState === "needs_review") {
      needsReviewOrders += 1;
    }

    const isPaidInFull = paymentState === "paid";
    const isDepositOrPartial =
      !isPaidInFull &&
      (paymentState === "partial" || rawPaymentStatus === "deposit_paid" || totalPaid > 0);

    let collectedUsd = 0;

    if (isPaidInFull) {
      paidOrders += 1;
      collectedUsd = totalPaid > 0 ? totalPaid : totalDue > 0 ? totalDue : 0;
      paidGrossSalesCents += Math.round(collectedUsd * 100);
    } else if (isDepositOrPartial) {
      awaitingBalanceOrders += 1;
      collectedUsd = totalPaid;
      const remainingBalanceUsd = Math.max(0, totalDue - totalPaid);
      depositCollectedCents += Math.round(collectedUsd * 100);
      awaitingBalanceGrossCents += Math.round(remainingBalanceUsd * 100);
    } else if (bookingStatus === "confirmed") {
      confirmedUnpaidOrders += 1;
    } else {
      pendingPaymentOrders += 1;
    }

    const collectedCents = Math.round(collectedUsd * 100);
    grossSalesCents += collectedCents;

    const owner = getOrderFleetOwner(order);
    if (owner !== "friend_fleet") {
      ownedGrossRevenueCents += collectedCents;
    }
  }

  return {
    ordersTotal: genuineOrdersTotal,
    genuineOrdersTotal,
    testRecordsExcluded,
    paidOrders,
    paidGrossSalesUsd: paidGrossSalesCents / 100,
    confirmedUnpaidOrders,
    pendingPaymentOrders,
    openQuotes,
    holds,
    awaitingBalanceOrders,
    awaitingBalanceGrossUsd: awaitingBalanceGrossCents / 100,
    depositCollectedUsd: depositCollectedCents / 100,
    needsReviewOrders,
    grossSalesUsd: grossSalesCents / 100,
    ownedGrossRevenueUsd: ownedGrossRevenueCents / 100,
    netOperatingRevenueUsd: null,
    affiliateCommissionsUsd: 0,
    accountingNote: OWNER_SUMMARY_ACCOUNTING_NOTE,
  };
}
