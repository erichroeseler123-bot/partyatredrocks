import { NextResponse } from "next/server";
import { isVaultEncryptionConfigured } from "@/lib/blobVault";
import { isOwnerSummaryRequestAuthorized } from "@/lib/internalApiAuth";
import { listInternalOrdersReadOnly, type InternalOrderRow } from "@/lib/orders";
import { getOrderFleetOwner } from "@/lib/parr/fleet";
import { getOrderPaymentState, getOrderWorkflowState } from "@/lib/parr/ops/status";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store",
};

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function readFiniteNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function isSyntheticTestOrder(order: InternalOrderRow): boolean {
  const customer = order.customer ?? {};
  const firstName = readString(customer.firstName).toLowerCase();
  const lastName = readString(customer.lastName).toLowerCase();
  const fullName = `${firstName} ${lastName}`.trim();
  const altName = readString(customer.name).toLowerCase();
  const email = readString(customer.email).toLowerCase();
  const notes = readString(order.notes).toLowerCase();
  const bookingNotes = readString(order.booking?.notes).toLowerCase();
  const ref = readString(order.rezdyBookingReference).toLowerCase();

  if (
    fullName.includes("[test]") ||
    altName.includes("[test]") ||
    email.includes("[test]") ||
    notes.includes("[test]") ||
    bookingNotes.includes("[test]") ||
    ref.includes("[test]")
  ) {
    return true;
  }

  if (email.endsWith("@example.com")) {
    return true;
  }

  return false;
}

function summarizeOwnerOrders28d(orders: InternalOrderRow[], now: Date = new Date()) {
  const windowStartMs = now.getTime() - 28 * 24 * 60 * 60 * 1000;

  const liveOrders28d = orders.filter((order) => {
    const createdMs = Date.parse(order.createdAt);
    if (Number.isNaN(createdMs) || createdMs < windowStartMs) {
      return false;
    }
    return !isSyntheticTestOrder(order);
  });

  let paidOrders = 0;
  let ownedGrossRevenueCents = 0;
  let needsReviewOrders = 0;
  let awaitingBalanceOrders = 0;

  for (const order of liveOrders28d) {
    const workflowState = getOrderWorkflowState(order);
    if (workflowState === "canceled") {
      continue;
    }

    const paymentState = getOrderPaymentState(order);
    const rawPaymentStatus = readString(order.payment?.status).toLowerCase();
    const totalDue = readFiniteNumber(order.payment?.totalDue);
    const totalPaid = readFiniteNumber(order.payment?.totalPaid);

    if (paymentState === "paid") {
      paidOrders += 1;
    }

    if (workflowState === "needs_review") {
      needsReviewOrders += 1;
    }

    if (
      paymentState === "unpaid" ||
      paymentState === "partial" ||
      rawPaymentStatus === "deposit_paid"
    ) {
      awaitingBalanceOrders += 1;
    }

    const owner = getOrderFleetOwner(order);
    if (owner !== "friend_fleet") {
      const collectedUsd =
        paymentState === "paid"
          ? totalPaid > 0
            ? totalPaid
            : totalDue > 0
              ? totalDue
              : 0
          : totalPaid > 0
            ? totalPaid
            : 0;
      ownedGrossRevenueCents += Math.round(collectedUsd * 100);
    }
  }

  return {
    ordersTotal: liveOrders28d.length,
    paidOrders,
    ownedGrossRevenueUsd: ownedGrossRevenueCents / 100,
    needsReviewOrders,
    awaitingBalanceOrders,
  };
}

export async function GET(request: Request) {
  if (!isOwnerSummaryRequestAuthorized(request)) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401, headers: NO_STORE_HEADERS },
    );
  }

  const now = new Date();
  const generatedAt = now.toISOString();
  const security = {
    opsAuthFailClosed: true,
    vaultEncryptionConfigured: isVaultEncryptionConfigured(),
  };

  try {
    const orders = await listInternalOrdersReadOnly();
    const metrics28d = summarizeOwnerOrders28d(orders, now);

    return NextResponse.json(
      {
        ok: true,
        siteId: "partyatredrocks",
        role: "direct_mor_transport",
        generatedAt,
        security,
        metrics28d,
      },
      { status: 200, headers: NO_STORE_HEADERS },
    );
  } catch {
    return NextResponse.json(
      {
        ok: false,
        degraded: true,
        siteId: "partyatredrocks",
        role: "direct_mor_transport",
        generatedAt,
        security,
        metrics28d: null,
      },
      { status: 200, headers: NO_STORE_HEADERS },
    );
  }
}
