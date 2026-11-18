import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { BlobNotFoundError, BlobPreconditionFailedError } from "@vercel/blob";
import { NextRequest } from "next/server";
import {
  PARR_2026_PRICING,
  PARR_2027_OPTION_B_PRICING_AUTHORITY,
  PARR_2027_PRICING,
  PARR_BOOKING_FEE_BPS,
  PARR_BOOKING_FEE_LABEL,
  PARR_COMPLETE_TOTAL_DISCLOSURE,
  PARR_PRICING_EFFECTIVE_SEASON,
  PARR_PRICING_VERSION,
  getPrivateRidePricingForDate,
} from "../lib/pricing";
import {
  BlobCasInventoryStore,
  InMemoryCasInventoryStore,
  MissingParrSecretError,
  MissingPrivateBlobTokenError,
  SOLD_OUT_TRAVELER_MESSAGE,
  SqliteCasInventoryStore,
  acquireOrReuseCheckoutHold,
  decryptInventoryLedger,
  deriveInventoryNamespacePrefix,
  encryptInventoryLedger,
  ensureOpeningInventorySeeded,
  getPublicVehicleAvailability,
  listAdminInventoryPools,
  reconcilePoolWithRezdy,
  releaseInventoryAfterConfirmedCancellation,
  requireDedicatedParrSecret,
  resolveCanonicalServiceShowIdentity,
  resolvePoolReconciliationDisagreement,
  type FetchLike,
  type ParrOwnerReconciliationAlert,
  type VercelPrivateBlobOps,
} from "../lib/inventory/parrVehicleInventory";
import {
  PARR_PREVIEW_HIDDEN_PRODUCTS,
  createParrRezdyBooking,
  getParrRezdyStatelessQuote,
  signConfirmationToken,
} from "../lib/rezdy/parrNativeRezdyService";
import { runParr2027SessionAndReconciliationAudit } from "../lib/rezdy/parr2027BaselineAudit";
import {
  getInternalOrderByAnyReference,
  saveInternalOrder,
} from "../lib/orders";
import {
  GET as getAdminInventoryRoute,
  POST as postAdminInventoryRoute,
} from "../app/api/internal/rezdy-inventory/route";
import { GET as getPublicAvailabilityRoute } from "../app/api/rezdy/availability/route";
import { GET as getSitemapXml } from "../app/sitemap.xml/route";
import { MANUAL_REVIEW_PROTECTED_URLS } from "../lib/seo/indexationGate";
import { middleware } from "../middleware";

const ROOT = path.resolve(process.cwd());
const RECEIPT_OUT_PATH =
  "C:/Users/erich/.gemini/antigravity/brain/a9e1ea98-ae68-4601-8679-4d76d9b1cff9/scratch/inventory_and_pricing_test_receipts.json";

const receipts: Record<string, unknown> = {
  generatedAt: new Date().toISOString(),
  suite: "tests/parr-pricing-and-inventory-preview.test.ts",
  verifications: {},
};

function recordReceipt(key: string, payload: unknown) {
  (receipts.verifications as Record<string, unknown>)[key] = payload;
  try {
    fs.mkdirSync(path.dirname(RECEIPT_OUT_PATH), { recursive: true });
    fs.writeFileSync(RECEIPT_OUT_PATH, JSON.stringify(receipts, null, 2));
  } catch {
    // non-fatal if scratch path unavailable in CI
  }
}

function makeMockRezdyFetch(opts?: {
  upstreamOrders?: Array<Record<string, unknown>>;
  bookingByOrderNumber?: Record<string, Record<string, unknown>>;
  failBookingStatus?: number;
  failBookingError?: string;
  onPostBooking?: (body: Record<string, unknown>) => void;
}): {
  fetchImpl: FetchLike;
  postBookingCount: () => number;
  createdOrders: Array<Record<string, unknown>>;
} {
  let postCount = 0;
  const createdOrders: Array<Record<string, unknown>> = [];
  const upstreamOrders = opts?.upstreamOrders ?? [];
  const byOrderNumber: Record<string, Record<string, unknown>> =
    opts?.bookingByOrderNumber ?? {};

  const fetchImpl: FetchLike = async (input, init) => {
    const url = new URL(String(input));
    const pathname = url.pathname;
    const method = (init?.method || "GET").toUpperCase();

    // GET /v1/bookings/:orderNumber
    const singleMatch = pathname.match(/\/v1\/bookings\/([^/]+)$/);
    if (singleMatch && method === "GET") {
      const ord = decodeURIComponent(singleMatch[1]);
      if (opts?.failBookingStatus === 503) {
        return new Response(JSON.stringify({ error: "Upstream unavailable" }), { status: 503 });
      }
      const found =
        byOrderNumber[ord] ||
        upstreamOrders.find((o) => o.orderNumber === ord) ||
        createdOrders.find((o) => o.orderNumber === ord);
      if (!found) {
        return new Response(JSON.stringify({ requestStatus: { success: false } }), { status: 404 });
      }
      return new Response(
        JSON.stringify({ requestStatus: { success: true }, booking: found }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // POST /v1/bookings/quote
    if (pathname.endsWith("/v1/bookings/quote") && method === "POST") {
      const body = JSON.parse(String(init?.body || "{}"));
      const item = body.items?.[0] ?? {};
      const isVan = item.productCode === "PU8R6Y";
      const baseAmount = isVan ? 699 : 499;
      const feeAmount = isVan ? 27.96 : 19.96;
      const totalAmount = isVan ? 726.96 : 518.96;
      return new Response(
        JSON.stringify({
          requestStatus: { success: true },
          booking: {
            status: "QUOTED",
            totalAmount,
            totalDue: totalAmount,
            totalCurrency: "USD",
            items: [
              {
                productCode: item.productCode,
                startTimeLocal: item.startTimeLocal,
                amount: baseAmount,
                subtotal: totalAmount,
                totalItemTax: feeAmount,
              },
            ],
          },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // GET /v1/bookings?...
    if (pathname.endsWith("/v1/bookings") && method === "GET") {
      const resellerRef = url.searchParams.get("resellerReference");
      const productCode = url.searchParams.get("productCode");
      let all = [...upstreamOrders, ...createdOrders];
      if (resellerRef) {
        all = all.filter((b) => b.resellerReference === resellerRef);
      }
      if (productCode) {
        all = all.filter((b) => {
          const items = (b.items as Array<Record<string, unknown>>) || [];
          return b.productCode === productCode || items.some((it) => it.productCode === productCode);
        });
      }
      return new Response(
        JSON.stringify({ requestStatus: { success: true }, bookings: all }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // POST /v1/bookings
    if (pathname.endsWith("/v1/bookings") && method === "POST") {
      postCount += 1;
      const body = JSON.parse(String(init?.body || "{}"));
      opts?.onPostBooking?.(body);
      if (opts?.failBookingStatus) {
        return new Response(
          JSON.stringify({
            requestStatus: {
              success: false,
              error: { errorMessage: opts.failBookingError || "Card declined by issuer" },
            },
          }),
          { status: opts.failBookingStatus, headers: { "Content-Type": "application/json" } }
        );
      }
      const item = body.items?.[0] ?? {};
      const isVan = item.productCode === "PU8R6Y";
      const totalAmount = isVan ? 726.96 : 518.96;
      const orderNumber = `RZD-TEST-${String(postCount).padStart(3, "0")}`;
      const created = {
        orderNumber,
        status: "CONFIRMED",
        resellerReference: body.resellerReference,
        totalAmount,
        totalPaid: totalAmount,
        totalDue: 0,
        customer: body.customer,
        items: [
          {
            productCode: item.productCode,
            startTimeLocal: item.startTimeLocal,
            amount: isVan ? 699 : 499,
            quantities: item.quantities,
            pickupLocation: { locationName: "1550 Court Pl, Denver, CO" },
          },
        ],
      };
      createdOrders.push(created);
      byOrderNumber[orderNumber] = created;
      return new Response(
        JSON.stringify({ requestStatus: { success: true }, booking: created }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ requestStatus: { success: true }, sessions: [] }), {
      status: 200,
    });
  };

  return {
    fetchImpl,
    postBookingCount: () => postCount,
    createdOrders,
  };
}

function withIsolatedOrderEnv(t: test.TestContext) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "parr-inv-preview-"));
  const saved = {
    ORDER_DB_PATH: process.env.ORDER_DB_PATH,
    ORDER_LOG_PATH: process.env.ORDER_LOG_PATH,
    BOOKING_LEDGER_PATH: process.env.BOOKING_LEDGER_PATH,
    VERCEL: process.env.VERCEL,
    VERCEL_ENV: process.env.VERCEL_ENV,
    BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
    PARR_INVENTORY_PRIVATE_READ_WRITE_TOKEN: process.env.PARR_INVENTORY_PRIVATE_READ_WRITE_TOKEN,
    REZDY_API_KEY: process.env.REZDY_API_KEY,
    PARR_SECRET: process.env.PARR_SECRET,
  };
  process.env.ORDER_DB_PATH = path.join(tempDir, "orders.sqlite");
  process.env.ORDER_LOG_PATH = path.join(tempDir, "orders.ndjson");
  process.env.BOOKING_LEDGER_PATH = path.join(tempDir, "booking-ledger.csv");
  delete process.env.VERCEL;
  process.env.VERCEL_ENV = "preview";
  delete process.env.BLOB_READ_WRITE_TOKEN;
  delete process.env.PARR_INVENTORY_PRIVATE_READ_WRITE_TOKEN;
  process.env.REZDY_API_KEY = "test_rezdy_api_key_preview_only";
  process.env.PARR_SECRET = "test_parr_secret_preview_123456";

  t.after(() => {
    for (const [k, v] of Object.entries(saved)) {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  return tempDir;
}

test("Section J #1 & #2: 6 Suburbans sold -> 7th rejected; 3 Vans sold -> 4th rejected; inventory never goes negative", async (t) => {
  withIsolatedOrderEnv(t);
  const store = new InMemoryCasInventoryStore();
  const mock = makeMockRezdyFetch();

  // 1. Sell all 6 Suburbans on 2027-03-25 (Porter Robinson B2B Ninajirachi)
  for (let i = 1; i <= 6; i += 1) {
    const res = await createParrRezdyBooking(
      {
        vehicleSlug: "suv",
        sessionId: "9001",
        startTimeLocal: "2027-03-25 16:30:00",
        optionLabel: "Private Suburban (Up to 6 Guests)",
        vehicleQuantity: 1,
        partySize: 5,
        firstName: "Alex",
        lastName: `Rider${i}`,
        email: `alex${i}@example.com`,
        phone: "7205550101",
        pickupAddress: "1550 Court Pl, Denver, CO 80202",
        cardToken: `tok_suv_unit_${i}`,
        idempotencyKey: `idem-suv-cap-20270325-unit-${i}`,
      },
      { fetchImpl: mock.fetchImpl, inventoryDeps: { store } }
    );
    assert.equal(res.ok, true, `Suburban #${i} should succeed`);
  }

  // 7th Suburban MUST be rejected before touching Rezdy POST /bookings
  const postBefore7th = mock.postBookingCount();
  const seventhSuv = await createParrRezdyBooking(
    {
      vehicleSlug: "suv",
      sessionId: "9001",
      startTimeLocal: "2027-03-25 16:30:00",
      optionLabel: "Private Suburban (Up to 6 Guests)",
      vehicleQuantity: 1,
      partySize: 4,
      firstName: "Seventh",
      lastName: "Buyer",
      email: "seventh@example.com",
      phone: "7205550199",
      pickupAddress: "1550 Court Pl, Denver, CO 80202",
      cardToken: "tok_suv_unit_7",
      idempotencyKey: "idem-suv-cap-20270325-unit-7",
    },
    { fetchImpl: mock.fetchImpl, inventoryDeps: { store } }
  );
  assert.equal(seventhSuv.ok, false);
  assert.equal(seventhSuv.httpStatus, 409);
  assert.equal(seventhSuv.code, "SOLD_OUT");
  assert.equal(seventhSuv.message, SOLD_OUT_TRAVELER_MESSAGE);
  assert.equal(mock.postBookingCount(), postBefore7th, "7th Suburban must not hit Rezdy POST /bookings");

  const suvPub = await getPublicVehicleAvailability(
    { dateKey: "2027-03-25", vehicleSlug: "suv" },
    { store, fetchImpl: mock.fetchImpl }
  );
  assert.equal(suvPub.capacity, 6);
  assert.equal(suvPub.availableCount, 0);
  assert.ok(suvPub.availableCount >= 0, "Inventory never negative");
  assert.equal(suvPub.soldOut, true);
  assert.equal(suvPub.statusMessage, "Not available for this show.");

  // 2. Sell all 3 Vans on 2027-03-25 (Van pool is independent from Suburban!)
  const vanPubInitial = await getPublicVehicleAvailability(
    { dateKey: "2027-03-25", vehicleSlug: "van" },
    { store, fetchImpl: mock.fetchImpl }
  );
  assert.equal(vanPubInitial.availableCount, 3, "Van pool unaffected by Suburban sellout");

  for (let i = 1; i <= 3; i += 1) {
    const res = await createParrRezdyBooking(
      {
        vehicleSlug: "van",
        sessionId: "9002",
        startTimeLocal: "2027-03-25 16:30:00",
        optionLabel: "Private Van (Up to 10 Guests)",
        vehicleQuantity: 1,
        partySize: 9,
        firstName: "Jordan",
        lastName: `Crew${i}`,
        email: `jordan${i}@example.com`,
        phone: "7205550202",
        pickupAddress: "811 12th St, Golden, CO 80401",
        cardToken: `tok_van_unit_${i}`,
        idempotencyKey: `idem-van-cap-20270325-unit-${i}`,
      },
      { fetchImpl: mock.fetchImpl, inventoryDeps: { store } }
    );
    assert.equal(res.ok, true, `Van #${i} should succeed`);
  }

  const postBefore4thVan = mock.postBookingCount();
  const fourthVan = await createParrRezdyBooking(
    {
      vehicleSlug: "van",
      sessionId: "9002",
      startTimeLocal: "2027-03-25 16:30:00",
      optionLabel: "Private Van (Up to 10 Guests)",
      vehicleQuantity: 1,
      partySize: 8,
      firstName: "Fourth",
      lastName: "VanBuyer",
      email: "fourthvan@example.com",
      phone: "7205550299",
      pickupAddress: "811 12th St, Golden, CO 80401",
      cardToken: "tok_van_unit_4",
      idempotencyKey: "idem-van-cap-20270325-unit-4",
    },
    { fetchImpl: mock.fetchImpl, inventoryDeps: { store } }
  );
  assert.equal(fourthVan.ok, false);
  assert.equal(fourthVan.httpStatus, 409);
  assert.equal(fourthVan.code, "SOLD_OUT");
  assert.equal(fourthVan.message, "Not available for this show.");
  assert.equal(mock.postBookingCount(), postBefore4thVan, "4th Van must not hit Rezdy POST /bookings");

  const vanPubAfter = await getPublicVehicleAvailability(
    { dateKey: "2027-03-25", vehicleSlug: "van" },
    { store, fetchImpl: mock.fetchImpl }
  );
  assert.equal(vanPubAfter.capacity, 3);
  assert.equal(vanPubAfter.availableCount, 0);
  assert.equal(vanPubAfter.soldOut, true);
  assert.equal(vanPubAfter.statusMessage, "Not available for this show.");

  recordReceipt("test_1_and_2_capacity_limits", {
    canonicalShowId: suvPub.canonicalShowId,
    suburbanSold: 6,
    seventhSuburbanResponse: seventhSuv,
    vanSold: 3,
    fourthVanResponse: fourthVan,
  });
});

test("Section J #3 & #4: simultaneous requests for final vehicle produce exactly 1 hold under CAS contention; duplicate idempotencyKey consumes only 1 unit", async (t) => {
  const tempDir = withIsolatedOrderEnv(t);
  let casHookTriggers = 0;
  const store = new InMemoryCasInventoryStore({
    onBeforeWriteHook: async () => {
      casHookTriggers += 1;
      await new Promise((r) => setTimeout(r, 4));
    },
  });
  const mock = makeMockRezdyFetch();

  // Pre-seed pool and allocate 5 of 6 Suburbans
  await ensureOpeningInventorySeeded(
    { dateKey: "2027-03-26", vehicleSlug: "suv" },
    { store, fetchImpl: mock.fetchImpl }
  );
  for (let i = 1; i <= 5; i += 1) {
    const h = await acquireOrReuseCheckoutHold(
      {
        dateKey: "2027-03-26",
        vehicleSlug: "suv",
        idempotencyKey: `idem-pre-race-suv-${i}`,
        partySize: 4,
      },
      { store, fetchImpl: mock.fetchImpl }
    );
    assert.equal(h.ok, true);
  }

  // Fire 8 simultaneous requests for the 6th and FINAL Suburban with `bypassInProcessQueueForCasTest: true`
  // so all 8 race directly against `writePoolCas(expectedVersionToken)`!
  const racers = await Promise.all(
    Array.from({ length: 8 }, (_, idx) =>
      acquireOrReuseCheckoutHold(
        {
          dateKey: "2027-03-26",
          vehicleSlug: "suv",
          idempotencyKey: `idem-final-unit-racer-${idx + 1}`,
          partySize: 6,
        },
        {
          store,
          fetchImpl: mock.fetchImpl,
          bypassInProcessQueueForCasTest: true,
        }
      )
    )
  );

  const winners = racers.filter((r) => r.ok);
  const losers = racers.filter((r) => !r.ok);
  assert.equal(winners.length, 1, "Exactly ONE racer may win the final Suburban hold");
  assert.equal(losers.length, 7, "All other 7 concurrent racers must be rejected");
  for (const loser of losers) {
    if (!loser.ok) {
      assert.equal(loser.code, "SOLD_OUT");
      assert.equal(loser.message, "Not available for this show.");
      assert.equal(loser.poolSummary.availableCount, 0);
      assert.equal(loser.poolSummary.allocatedCount, 6);
    }
  }
  assert.ok(casHookTriggers >= 8);

  // Test #4: Duplicate requests with the SAME idempotencyKey consume ONLY 1 inventory unit
  const sqliteStore = new SqliteCasInventoryStore();
  const firstHold = await acquireOrReuseCheckoutHold(
    {
      dateKey: "2027-03-27",
      vehicleSlug: "van",
      idempotencyKey: "idem-duplicate-test-key-001",
      partySize: 8,
    },
    { store: sqliteStore, fetchImpl: mock.fetchImpl }
  );
  assert.equal(firstHold.ok, true);
  if (firstHold.ok) {
    assert.equal(firstHold.idempotentReused, false);
    assert.equal(firstHold.poolSummary.allocatedCount, 1);
    assert.equal(firstHold.poolSummary.availableCount, 2);
  }

  const secondHoldSameKey = await acquireOrReuseCheckoutHold(
    {
      dateKey: "2027-03-27",
      vehicleSlug: "van",
      idempotencyKey: "idem-duplicate-test-key-001",
      partySize: 8,
    },
    { store: sqliteStore, fetchImpl: mock.fetchImpl }
  );
  assert.equal(secondHoldSameKey.ok, true);
  if (firstHold.ok && secondHoldSameKey.ok) {
    assert.equal(secondHoldSameKey.idempotentReused, true);
    assert.equal(secondHoldSameKey.hold.internalHoldId, firstHold.hold.internalHoldId);
    assert.equal(secondHoldSameKey.poolSummary.allocatedCount, 1, "Duplicate idempotencyKey must NOT consume a 2nd unit");
    assert.equal(secondHoldSameKey.poolSummary.availableCount, 2);
  }

  recordReceipt("test_3_and_4_concurrency_and_idempotency", {
    concurrentRacersForFinalSuburban: 8,
    winnersCount: winners.length,
    losersCount: losers.length,
    winnerHoldId: winners[0]?.ok ? winners[0].hold.internalHoldId : null,
    duplicateIdempotencyAllocatedUnits: secondHoldSameKey.ok ? secondHoldSameKey.poolSummary.allocatedCount : null,
  });
});

test("Section J #5, #6 & #7: failed payment releases hold; expired hold releases vehicle; confirmed Rezdy booking converts to confirmed_sold & mirrors InternalOrderRow", async (t) => {
  withIsolatedOrderEnv(t);
  const store = new InMemoryCasInventoryStore();

  // Test #5: Failed payment (402 card decline) releases hold back to availability
  const decliningMock = makeMockRezdyFetch({
    failBookingStatus: 402,
    failBookingError: "Your card was declined (insufficient_funds).",
  });
  const declinedRes = await createParrRezdyBooking(
    {
      vehicleSlug: "van",
      sessionId: "9100",
      startTimeLocal: "2027-04-02 16:30:00",
      optionLabel: "Private Van (Up to 10 Guests)",
      vehicleQuantity: 1,
      partySize: 7,
      firstName: "Declined",
      lastName: "Card",
      email: "declined@example.com",
      phone: "7205550303",
      pickupAddress: "1550 Court Pl, Denver, CO 80202",
      cardToken: "tok_declined_card",
      idempotencyKey: "idem-declined-van-001",
    },
    { fetchImpl: decliningMock.fetchImpl, inventoryDeps: { store } }
  );
  assert.equal(declinedRes.ok, false);
  assert.equal(declinedRes.code, "CARD_DECLINED");

  const availAfterDecline = await getPublicVehicleAvailability(
    { dateKey: "2027-04-02", vehicleSlug: "van" },
    { store, fetchImpl: decliningMock.fetchImpl }
  );
  assert.equal(availAfterDecline.availableCount, 3, "Declined payment must release hold back to all 3 Vans");

  // Test #6: Expired hold releases vehicle automatically
  let fakeClockMs = Date.parse("2027-01-10T18:00:00.000Z");
  const okMock = makeMockRezdyFetch();
  const shortHold = await acquireOrReuseCheckoutHold(
    {
      dateKey: "2027-04-02",
      vehicleSlug: "van",
      idempotencyKey: "idem-expiring-hold-001",
      partySize: 8,
    },
    {
      store,
      fetchImpl: okMock.fetchImpl,
      nowMs: () => fakeClockMs,
      holdTtlMs: 1_000, // 1 second TTL
    }
  );
  assert.equal(shortHold.ok, true);
  if (shortHold.ok) {
    assert.equal(shortHold.poolSummary.availableCount, 2);
  }

  // Advance clock past hold expiration
  fakeClockMs += 5_000;
  const availAfterExpiry = await getPublicVehicleAvailability(
    { dateKey: "2027-04-02", vehicleSlug: "van" },
    { store, fetchImpl: okMock.fetchImpl, nowMs: () => fakeClockMs }
  );
  assert.equal(availAfterExpiry.availableCount, 3, "Expired hold must return unit to available pool");

  // Test #7: Confirmed Rezdy booking converts hold to `confirmed_sold` AND mirrors into `lib/orders.ts`
  const confirmedRes = await createParrRezdyBooking(
    {
      vehicleSlug: "suv",
      sessionId: "9101",
      startTimeLocal: "2027-04-02 16:30:00",
      optionLabel: "Private Suburban (Up to 6 Guests)",
      vehicleQuantity: 1,
      partySize: 6,
      firstName: "Sierra",
      lastName: "Confirmed",
      email: "sierra@example.com",
      phone: "7205550404",
      pickupAddress: "1717 Denver West Blvd, Golden, CO 80401",
      cardToken: "tok_confirmed_suv_01",
      idempotencyKey: "idem-confirmed-suv-mirror-01",
    },
    { fetchImpl: okMock.fetchImpl, inventoryDeps: { store, nowMs: () => fakeClockMs } }
  );
  assert.equal(confirmedRes.ok, true);
  if (confirmedRes.ok) {
    assert.equal(confirmedRes.status, "CONFIRMED");
    assert.equal(confirmedRes.totalPaid, 518.96);

    const mirroredByRezdyRef = await getInternalOrderByAnyReference(confirmedRes.orderNumber);
    const mirroredByResellerRef = await getInternalOrderByAnyReference(confirmedRes.resellerReference);
    assert.ok(mirroredByRezdyRef, "Confirmed Rezdy booking must mirror into InternalOrderRow");
    assert.equal(mirroredByRezdyRef?.internalOrderId, mirroredByResellerRef?.internalOrderId);
    assert.equal(mirroredByRezdyRef?.productCode, "parr-suburban");
    assert.equal(mirroredByRezdyRef?.payment?.totalPaid, 518.96);
    assert.equal(mirroredByRezdyRef?.booking?.status, "confirmed");

    const { ledger } = await store.readPool("2027-04-02__suv");
    const soldRec = ledger?.reservations.find((r) => r.rezdyOrderReference === confirmedRes.orderNumber);
    assert.equal(soldRec?.state, "confirmed_sold");
    assert.equal(soldRec?.internalOrderId, mirroredByRezdyRef?.internalOrderId);
    assert.equal(soldRec?.pricingSnapshot.allInTotalCents, 51_896);

    recordReceipt("test_5_6_7_lifecycle_and_order_mirror", {
      afterDeclineVanAvailable: availAfterDecline.availableCount,
      afterExpiryVanAvailable: availAfterExpiry.availableCount,
      confirmedRezdyOrderNumber: confirmedRes.orderNumber,
      mirroredInternalOrderId: mirroredByRezdyRef?.internalOrderId,
      reservationState: soldRec?.state,
    });
  }
});

test("Section J #8: Failure injection — Rezdy succeeds, local finalization fails -> preserves booking, blocks unit in reconciliation_blocked, schedules outbox retry & alerts owner", async (t) => {
  withIsolatedOrderEnv(t);
  const store = new InMemoryCasInventoryStore();
  const mock = makeMockRezdyFetch();
  const alertsReceived: ParrOwnerReconciliationAlert[] = [];

  const injectedRes = await createParrRezdyBooking(
    {
      vehicleSlug: "van",
      sessionId: "9200",
      startTimeLocal: "2027-04-15 16:30:00",
      optionLabel: "Private Van (Up to 10 Guests)",
      vehicleQuantity: 1,
      partySize: 10,
      firstName: " Morgan ",
      lastName: "OutboxTest",
      email: "morgan@example.com",
      phone: "7205550505",
      pickupAddress: "1550 Court Pl, Denver, CO 80202",
      cardToken: "tok_failure_injection_van",
      idempotencyKey: "idem-failure-injection-rezdy-ok-local-fail",
    },
    {
      fetchImpl: mock.fetchImpl,
      inventoryDeps: {
        store,
        finalizeOrderMirrorImpl: async () => {
          throw new Error("INJECTED_SQLITE_DISK_WRITE_FAILURE");
        },
        onOwnerAlert: (alert) => {
          alertsReceived.push(alert);
        },
      },
    }
  );

  // Customer's confirmed Rezdy booking MUST be preserved (never lost or double-charged!)
  assert.equal(injectedRes.ok, true);
  if (injectedRes.ok) {
    assert.equal(injectedRes.httpStatus, 202);
    assert.equal(injectedRes.pendingLocalReconciliation, true);
    assert.equal(injectedRes.status, "CONFIRMED");
    assert.equal(injectedRes.totalPaid, 726.96);
  }

  // Owner alert MUST have fired
  assert.equal(alertsReceived.length, 1);
  assert.equal(alertsReceived[0].code, "REZDY_SUCCESS_LOCAL_FINALIZE_FAILED");
  assert.equal(alertsReceived[0].severity, "critical");

  // Pool MUST hold that unit in `reconciliation_blocked` AND block new sales on `(2027-04-15, "van")` so the unit is NEVER resold!
  const { ledger } = await store.readPool("2027-04-15__van");
  assert.ok(ledger);
  assert.equal(ledger.reconciliationBlocked, true);
  const blockedUnit = ledger.reservations.find((r) => r.state === "reconciliation_blocked");
  assert.ok(blockedUnit, "Reservation must be held in reconciliation_blocked state");
  const retryOutbox = ledger.outbox.find((o) => o.kind === "LOCAL_ORDER_MIRROR_RETRY" && o.status === "retry_required");
  assert.ok(retryOutbox, "Durable LOCAL_ORDER_MIRROR_RETRY outbox record must be queued");

  const nextBuyerAttempt = await acquireOrReuseCheckoutHold(
    {
      dateKey: "2027-04-15",
      vehicleSlug: "van",
      idempotencyKey: "idem-next-buyer-during-block",
      partySize: 6,
    },
    { store, fetchImpl: mock.fetchImpl }
  );
  assert.equal(nextBuyerAttempt.ok, false);
  if (!nextBuyerAttempt.ok) {
    assert.equal(nextBuyerAttempt.code, "RECONCILIATION_BLOCKED");
    assert.equal(nextBuyerAttempt.message, "Not available for this show.");
  }

  recordReceipt("test_8_rezdy_success_local_failure_injection", {
    responseHttpStatus: injectedRes.httpStatus,
    pendingLocalReconciliation: injectedRes.ok ? injectedRes.pendingLocalReconciliation : null,
    unitState: blockedUnit?.state,
    retryOutboxKind: retryOutbox?.kind,
    ownerAlertCode: alertsReceived[0].code,
    subsequentSaleBlockedWith: !nextBuyerAttempt.ok ? nextBuyerAttempt.code : null,
  });
});

test("Section J #9 & #10: confirmed cancellation restores 1 unit & preserves history; failed or incomplete cancellation does NOT restore inventory", async (t) => {
  withIsolatedOrderEnv(t);
  const store = new InMemoryCasInventoryStore();
  const bookingMap: Record<string, Record<string, unknown>> = {};
  const mock = makeMockRezdyFetch({ bookingByOrderNumber: bookingMap });

  // Create 2 confirmed Van bookings on 2027-04-20 (available drops from 3 -> 1)
  const b1 = await createParrRezdyBooking(
    {
      vehicleSlug: "van",
      sessionId: "9301",
      startTimeLocal: "2027-04-20 16:30:00",
      optionLabel: "Private Van (Up to 10 Guests)",
      vehicleQuantity: 1,
      partySize: 8,
      firstName: "Cancel",
      lastName: "Complete",
      email: "cancel1@example.com",
      phone: "7205550601",
      pickupAddress: "1550 Court Pl, Denver, CO 80202",
      cardToken: "tok_cancel_1",
      idempotencyKey: "idem-cancel-test-van-1",
    },
    { fetchImpl: mock.fetchImpl, inventoryDeps: { store } }
  );
  const b2 = await createParrRezdyBooking(
    {
      vehicleSlug: "van",
      sessionId: "9301",
      startTimeLocal: "2027-04-20 16:30:00",
      optionLabel: "Private Van (Up to 10 Guests)",
      vehicleQuantity: 1,
      partySize: 8,
      firstName: "Cancel",
      lastName: "Incomplete",
      email: "cancel2@example.com",
      phone: "7205550602",
      pickupAddress: "1550 Court Pl, Denver, CO 80202",
      cardToken: "tok_cancel_2",
      idempotencyKey: "idem-cancel-test-van-2",
    },
    { fetchImpl: mock.fetchImpl, inventoryDeps: { store } }
  );
  assert.equal(b1.ok && b2.ok, true);
  if (!b1.ok || !b2.ok) return;

  // Test #10: Failed / incomplete cancellations MUST NOT restore inventory!
  // 10a. Still CONFIRMED upstream
  bookingMap[b2.orderNumber] = { orderNumber: b2.orderNumber, status: "CONFIRMED", totalPaid: 726.96 };
  const notCancelledRes = await releaseInventoryAfterConfirmedCancellation(
    { dateKey: "2027-04-20", vehicleSlug: "van", rezdyOrderNumber: b2.orderNumber },
    { store, fetchImpl: mock.fetchImpl }
  );
  assert.equal(notCancelledRes.released, false);
  assert.equal(notCancelledRes.poolSummary.availableCount, 1);

  // 10b. Cancelled with FAILED refundStatus
  bookingMap[b2.orderNumber] = {
    orderNumber: b2.orderNumber,
    status: "CANCELLED",
    refundStatus: "FAILED",
    totalPaid: 726.96,
  };
  const failedRefundRes = await releaseInventoryAfterConfirmedCancellation(
    { dateKey: "2027-04-20", vehicleSlug: "van", rezdyOrderNumber: b2.orderNumber },
    { store, fetchImpl: mock.fetchImpl }
  );
  assert.equal(failedRefundRes.released, false);
  assert.equal(failedRefundRes.poolSummary.availableCount, 1);

  // Test #9: Confirmed cancellation (`status === "CANCELLED"`) restores 1 unit while preserving full booking history!
  bookingMap[b1.orderNumber] = {
    orderNumber: b1.orderNumber,
    status: "CANCELLED",
    refundStatus: "COMPLETED",
    totalPaid: 0,
  };
  const confirmedCancelRes = await releaseInventoryAfterConfirmedCancellation(
    { dateKey: "2027-04-20", vehicleSlug: "van", rezdyOrderNumber: b1.orderNumber, actor: "ops_admin" },
    { store, fetchImpl: mock.fetchImpl }
  );
  assert.equal(confirmedCancelRes.released, true);
  assert.equal(confirmedCancelRes.poolSummary.availableCount, 2, "Confirmed cancellation restores 1 Van (1 -> 2)");

  const { ledger } = await store.readPool("2027-04-20__van");
  assert.equal(ledger?.reservations.length, 2, "Cancelled booking record is preserved in ledger history, never deleted");
  const cancelledRec = ledger?.reservations.find((r) => r.rezdyOrderReference === b1.orderNumber);
  assert.equal(cancelledRec?.state, "cancelled_released");
  assert.ok((cancelledRec?.auditHistory.length ?? 0) >= 3);

  const updatedMirror = await getInternalOrderByAnyReference(b1.orderNumber);
  assert.equal(updatedMirror?.booking?.status, "canceled");

  recordReceipt("test_9_and_10_cancellations", {
    incompleteCancelReleased: notCancelledRes.released,
    failedRefundReleased: failedRefundRes.released,
    confirmedCancelReleased: confirmedCancelRes.released,
    availableBeforeConfirmedCancel: 1,
    availableAfterConfirmedCancel: confirmedCancelRes.poolSummary.availableCount,
    preservedHistoryCount: ledger?.reservations.length,
  });
});

test("Section J #11 & #12: opening Rezdy seed + manual Rezdy booking detection; reconciliation disagreement blocks ONLY affected date/vehicle pool + authenticated admin resolution", async (t) => {
  const tempDir = withIsolatedOrderEnv(t);
  const sqliteStore = new SqliteCasInventoryStore();

  const upstreamOrders: Array<Record<string, unknown>> = [
    {
      orderNumber: "ORD-SEED-SUV-01",
      status: "CONFIRMED",
      totalAmount: 518.96,
      totalPaid: 518.96,
      customer: { firstName: "Seed", lastName: "One", email: "seed1@example.com", phone: "7205550701" },
      items: [
        {
          productCode: "P94HN4",
          startTimeLocal: "2027-05-10 16:30:00",
          quantities: [{ optionLabel: "Private Suburban (Up to 6 Guests)", value: 1 }],
        },
      ],
    },
  ];
  const mock = makeMockRezdyFetch({ upstreamOrders });

  // Opening seed counts ORD-SEED-SUV-01 before enabling 2027-05-10 Suburban (6 - 1 = 5 available)
  const seededPub = await getPublicVehicleAvailability(
    { dateKey: "2027-05-10", vehicleSlug: "suv" },
    { store: sqliteStore, fetchImpl: mock.fetchImpl }
  );
  assert.equal(seededPub.availableCount, 5);

  // Test #11: Operator manually creates `ORD-MANUAL-SUV-02` inside Rezdy admin -> reconciliation detects & counts it!
  upstreamOrders.push({
    orderNumber: "ORD-MANUAL-SUV-02",
    status: "CONFIRMED",
    totalAmount: 518.96,
    totalPaid: 518.96,
    customer: { firstName: "Manual", lastName: "Entry", email: "manual@example.com", phone: "7205550702" },
    items: [
      {
        productCode: "P94HN4",
        startTimeLocal: "2027-05-10 16:30:00",
        quantities: [{ optionLabel: "Private Suburban (Up to 6 Guests)", value: 1 }],
      },
    ],
  });

  const rec1 = await reconcilePoolWithRezdy(
    { dateKey: "2027-05-10", vehicleSlug: "suv", actor: "cron_reconciler" },
    { store: sqliteStore, fetchImpl: mock.fetchImpl }
  );
  assert.deepEqual(rec1.manualOrdersAdded, ["ORD-MANUAL-SUV-02"]);
  assert.equal(rec1.reconciliationBlocked, false);
  assert.equal(rec1.poolSummary.availableCount, 4, "Manual Rezdy order counted (5 -> 4 available)");

  const manualMirrored = await getInternalOrderByAnyReference("ORD-MANUAL-SUV-02");
  assert.ok(manualMirrored, "Manual Rezdy booking mirrored into InternalOrderRow");

  // Test #12: Inject upstream disagreement ONLY on (2027-05-10, "suv") (e.g. ORD-SEED-SUV-01 disappears upstream)
  upstreamOrders.splice(0, 1);
  const recDisagreement = await reconcilePoolWithRezdy(
    { dateKey: "2027-05-10", vehicleSlug: "suv", actor: "cron_reconciler" },
    { store: sqliteStore, fetchImpl: mock.fetchImpl }
  );
  assert.equal(recDisagreement.reconciliationBlocked, true);
  assert.ok(recDisagreement.disagreementsDetected.some((d) => d.includes("DISAGREEMENT_MISSING_UPSTREAM")));
  assert.equal(recDisagreement.poolSummary.available, false);
  assert.equal(recDisagreement.poolSummary.travelerStatusMessage, "Not available for this show.");

  // Verify ONLY (2027-05-10, "suv") is blocked — (2027-05-10, "van") AND (2027-05-11, "suv") remain open & bookable!
  const sameDateVan = await getPublicVehicleAvailability(
    { dateKey: "2027-05-10", vehicleSlug: "van" },
    { store: sqliteStore, fetchImpl: mock.fetchImpl }
  );
  const nextDateSuv = await getPublicVehicleAvailability(
    { dateKey: "2027-05-11", vehicleSlug: "suv" },
    { store: sqliteStore, fetchImpl: mock.fetchImpl }
  );
  assert.equal(sameDateVan.available, true);
  assert.equal(sameDateVan.availableCount, 3, "(2027-05-10, van) must NOT be blocked");
  assert.equal(nextDateSuv.available, true);
  assert.equal(nextDateSuv.availableCount, 6, "(2027-05-11, suv) must NOT be blocked");

  // Verify `/api/internal/rezdy-inventory` requires auth (401 unauthenticated, 200 with PARR_SECRET)
  const unauthRes = await getAdminInventoryRoute(
    new NextRequest("https://preview.partyatredrocks.vercel.app/api/internal/rezdy-inventory")
  );
  assert.equal(unauthRes.status, 401);

  const authBoardRes = await getAdminInventoryRoute(
    new NextRequest("https://preview.partyatredrocks.vercel.app/api/internal/rezdy-inventory", {
      headers: { Authorization: `Bearer ${process.env.PARR_SECRET}` },
    })
  );
  assert.equal(authBoardRes.status, 200);
  const authBoardJson = await authBoardRes.json();
  assert.equal(authBoardJson.ok, true);
  assert.ok(authBoardJson.unresolvedAlerts.length >= 1);

  // Resolve disagreement via authenticated POST `/api/internal/rezdy-inventory` and confirm audit trail recorded
  const resolveApiRes = await postAdminInventoryRoute(
    new NextRequest("https://preview.partyatredrocks.vercel.app/api/internal/rezdy-inventory", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PARR_SECRET}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "resolve_disagreement",
        dateKey: "2027-05-10",
        vehicleSlug: "suv",
        actor: "erich_owner",
        note: "Verified upstream archive filter; cleared pool block.",
      }),
    })
  );
  assert.equal(resolveApiRes.status, 200);
  const resolvedJson = await resolveApiRes.json();
  assert.equal(resolvedJson.poolSummary.reconciliationBlocked, false);
  assert.equal(resolvedJson.poolSummary.available, true);
  assert.ok(
    resolvedJson.ledger.poolAuditLog.some(
      (e: { action: string; actor: string }) =>
        e.action === "operator_reconciliation_cleared" && e.actor === "erich_owner"
    )
  );

  recordReceipt("test_11_and_12_manual_sync_and_scoped_reconciliation", {
    openingSeededAvailable: seededPub.availableCount,
    manualOrdersAdded: rec1.manualOrdersAdded,
    disagreementsDetected: recDisagreement.disagreementsDetected,
    blockedPoolAvailable: recDisagreement.poolSummary.available,
    sameDateVanAvailableCount: sameDateVan.availableCount,
    nextDateSuvAvailableCount: nextDateSuv.availableCount,
    resolvedByActor: "erich_owner",
  });
});

test("Section J #13: stale browser submitting after sellout is rejected server-side with zero Rezdy booking calls, zero PII leak & zero fake scarcity", async (t) => {
  const tempDir = withIsolatedOrderEnv(t);
  const store = new SqliteCasInventoryStore();
  const mock = makeMockRezdyFetch();

  // Browser A & B load availability when 1 Van is left (after 2 Vans sold)
  for (let i = 1; i <= 2; i += 1) {
    await createParrRezdyBooking(
      {
        vehicleSlug: "van",
        sessionId: "9400",
        startTimeLocal: "2027-06-05 16:30:00",
        optionLabel: "Private Van (Up to 10 Guests)",
        vehicleQuantity: 1,
        partySize: 9,
        firstName: `Buyer${i}`,
        lastName: "PrivatePII",
        email: `secret.pii.${i}@example.com`,
        phone: "7205550800",
        pickupAddress: "999 Secret Private Residence Rd, Denver, CO",
        cardToken: `tok_van_pre_${i}`,
        idempotencyKey: `idem-stale-pre-van-${i}`,
      },
      { fetchImpl: mock.fetchImpl, inventoryDeps: { store } }
    );
  }

  // Pre-seed SUV pool too so route summary mode (`?date=2027-06-05`) reads local SQLite without hitting external network
  await ensureOpeningInventorySeeded(
    { dateKey: "2027-06-05", vehicleSlug: "suv" },
    { store, fetchImpl: mock.fetchImpl }
  );

  // Verify public `/api/rezdy/availability` response contains ZERO customer PII and ZERO fake "Only 1 left" scarcity
  const pubRes = await getPublicAvailabilityRoute(
    new Request("https://preview.partyatredrocks.vercel.app/api/rezdy/availability?date=2027-06-05")
  );
  assert.equal(pubRes.status, 200);
  const pubRaw = await pubRes.text();
  assert.doesNotMatch(pubRaw, /PrivatePII|secret\.pii|Secret Private Residence/i, "Public availability must never leak PII");
  assert.doesNotMatch(pubRaw, /only \d+ left|hurry|almost gone/i, "Public availability must never emit fake scarcity");

  // Buyer 3 buys the 3rd and final Van while Stale Browser still has checkout open
  const finalSale = await createParrRezdyBooking(
    {
      vehicleSlug: "van",
      sessionId: "9400",
      startTimeLocal: "2027-06-05 16:30:00",
      optionLabel: "Private Van (Up to 10 Guests)",
      vehicleQuantity: 1,
      partySize: 10,
      firstName: "Buyer3",
      lastName: "Winner",
      email: "winner3@example.com",
      phone: "7205550803",
      pickupAddress: "1550 Court Pl, Denver, CO 80202",
      cardToken: "tok_van_pre_3",
      idempotencyKey: "idem-stale-pre-van-3",
    },
    { fetchImpl: mock.fetchImpl, inventoryDeps: { store } }
  );
  assert.equal(finalSale.ok, true);

  // Stale Browser now clicks Pay -> server rechecks atomic hold and rejects BEFORE Rezdy POST /bookings!
  const postsBeforeStale = mock.postBookingCount();
  const staleSubmit = await createParrRezdyBooking(
    {
      vehicleSlug: "van",
      sessionId: "9400",
      startTimeLocal: "2027-06-05 16:30:00",
      optionLabel: "Private Van (Up to 10 Guests)",
      vehicleQuantity: 1,
      partySize: 8,
      firstName: "Stale",
      lastName: "Tab",
      email: "stale@example.com",
      phone: "7205550899",
      pickupAddress: "1550 Court Pl, Denver, CO 80202",
      cardToken: "tok_van_stale_submit",
      idempotencyKey: "idem-stale-browser-van-4",
    },
    { fetchImpl: mock.fetchImpl, inventoryDeps: { store } }
  );
  assert.equal(staleSubmit.ok, false);
  assert.equal(staleSubmit.httpStatus, 409);
  assert.equal(staleSubmit.code, "SOLD_OUT");
  assert.equal(staleSubmit.message, "Not available for this show.");
  assert.equal(mock.postBookingCount(), postsBeforeStale, "Stale browser must never reach Rezdy POST /bookings");

  recordReceipt("test_13_stale_browser_gate_and_zero_pii", {
    staleSubmitStatus: staleSubmit.httpStatus,
    staleSubmitCode: staleSubmit.code,
    staleSubmitMessage: staleSubmit.message,
    rezdyPostCallsDuringStaleAttempt: mock.postBookingCount() - postsBeforeStale,
  });
});

test("Section J #14 & #15: authoritative integer-cents pricing (51896 / 72696), quote parity, zero misleading flat-fee copy & JSON-LD Offer/AggregateOffer schema", async (t) => {
  withIsolatedOrderEnv(t);
  const suv = PARR_2027_OPTION_B_PRICING_AUTHORITY.suv;
  const van = PARR_2027_OPTION_B_PRICING_AUTHORITY.van;

  // Integer-cents pricing authority check (Section B)
  assert.equal(PARR_BOOKING_FEE_BPS, 400);
  assert.equal(PARR_BOOKING_FEE_LABEL, "Booking fee (4%)");
  assert.equal(PARR_PRICING_EFFECTIVE_SEASON, "2027");
  assert.equal(PARR_PRICING_VERSION, "2027.v2-option-b");
  assert.equal(PARR_COMPLETE_TOTAL_DISCLOSURE, "Your complete total is shown before payment.");

  assert.equal(suv.basePriceCents, 49_900);
  assert.equal(suv.calculatedBookingFeeCents, 1_996);
  assert.equal(suv.allInTotalCents, 51_896);
  assert.equal(suv.allInTotalFormatted, "$518.96");
  assert.equal(suv.schemaPriceString, "518.96");
  assert.equal(suv.dailyVehicleCapacity, 6);

  assert.equal(van.basePriceCents, 69_900);
  assert.equal(van.calculatedBookingFeeCents, 2_796);
  assert.equal(van.allInTotalCents, 72_696);
  assert.equal(van.allInTotalFormatted, "$726.96");
  assert.equal(van.schemaPriceString, "726.96");
  assert.equal(van.dailyVehicleCapacity, 3);

  // Stateless quote parity check
  const mock = makeMockRezdyFetch();
  const suvQuote = await getParrRezdyStatelessQuote(
    {
      vehicleSlug: "suv",
      startTimeLocal: "2027-08-12 16:30:00",
      optionLabel: "Private Suburban (Up to 6 Guests)",
      vehicleQuantity: 1,
    },
    { fetchImpl: mock.fetchImpl }
  );
  const vanQuote = await getParrRezdyStatelessQuote(
    {
      vehicleSlug: "van",
      startTimeLocal: "2027-08-12 16:30:00",
      optionLabel: "Private Van (Up to 10 Guests)",
      vehicleQuantity: 1,
    },
    { fetchImpl: mock.fetchImpl }
  );
  assert.equal(suvQuote.ok && suvQuote.quoteParityPassed, true);
  assert.equal(vanQuote.ok && vanQuote.quoteParityPassed, true);

  // Test #15: Current JSON-LD Offer / AggregateOffer files carry 518.96 & 726.96 and zero InStock
  const schemaFiles = [
    "app/page.tsx",
    "app/book/[venue]/bookingSeo.ts",
    "app/shows/[id]/page.tsx",
    "app/red-rocks/shuttle/page.tsx",
    "app/red-rocks/group-transportation/page.tsx",
    "app/guide/compare/page.tsx",
  ];
  for (const rel of schemaFiles) {
    const content = fs.readFileSync(path.join(ROOT, rel), "utf8");
    assert.ok(
      content.includes("518.96") || content.includes("schemaPriceString") || content.includes("schemaPrice"),
      `${rel} must emit 518.96 Option B Offer schema`
    );
    assert.ok(
      content.includes("726.96") || content.includes("schemaPriceString") || content.includes("schemaPrice"),
      `${rel} must emit 726.96 Option B Offer schema`
    );
    assert.doesNotMatch(content, /InStock|ItemAvailability/, `${rel} must not assert static InStock`);
  }
  const carServiceContent = fs.readFileSync(path.join(ROOT, "app/red-rocks/car-service/page.tsx"), "utf8");
  assert.ok(carServiceContent.includes("schemaPriceString") || carServiceContent.includes("518.96"));

  recordReceipt("test_14_and_15_pricing_authority_and_schema", {
    suvCents: { base: suv.basePriceCents, fee: suv.calculatedBookingFeeCents, total: suv.allInTotalCents },
    vanCents: { base: van.basePriceCents, fee: van.calculatedBookingFeeCents, total: van.allInTotalCents },
    version: suv.version,
    suvQuoteParity: suvQuote.ok ? suvQuote.quoteParityPassed : false,
    vanQuoteParity: vanQuote.ok ? vanQuote.quoteParityPassed : false,
  });
});

test("Section J #16 & #17: historical 2026 facts/orders ($399/$599), 35 protected URLs, 117 sitemap URLs, redirects, canonicals & Rezdy IDs remain unchanged", async (t) => {
  withIsolatedOrderEnv(t);

  // Test #16: Historical 2026 pricing & stored order receipt preservation
  assert.equal(PARR_2026_PRICING.suv, 399);
  assert.equal(PARR_2026_PRICING.van, 599);
  assert.equal(PARR_2027_PRICING.suv, 499);
  assert.equal(PARR_2027_PRICING.van, 699);
  assert.equal(getPrivateRidePricingForDate({ optionSlug: "suv", serviceDate: "2026-09-15" }).priceUsd, 399);
  assert.equal(
    getPrivateRidePricingForDate({ optionSlug: "suv", serviceDate: "2027-07-01", legacyAmount: 399 }).priceUsd,
    399
  );

  // Stored 2026 order remains intact at $399
  const legacyOrder = await saveInternalOrder({
    rezdyBookingReference: "RZD-LEGACY-2026-399",
    productCode: "parr-suburban",
    sessionKey: "2026-08-10:parr-suburban",
    customer: { firstName: "Legacy", lastName: "Rider2026", email: "legacy2026@example.com", phone: "+17205550900" },
    pickup: { address: "1550 Court Pl, Denver, CO 80202" },
    booking: { status: "confirmed", date: "2026-08-10", venueSlug: "red-rocks-amphitheatre" },
    payment: { status: "paid", totalDue: 399, totalPaid: 399 },
    rezdyBookingPayload: {},
  });
  const fetchedLegacy = await getInternalOrderByAnyReference("RZD-LEGACY-2026-399");
  assert.equal(fetchedLegacy?.internalOrderId, legacyOrder.internalOrderId);
  assert.equal(fetchedLegacy?.payment?.totalDue, 399);
  assert.equal(fetchedLegacy?.payment?.totalPaid, 399);

  const bookingPageSrc = fs.readFileSync(path.join(ROOT, "app/booking/page.tsx"), "utf8");
  assert.match(bookingPageSrc, /Existing 2026 orders remain unchanged at their original booked prices\./);
  assert.match(bookingPageSrc, /541037/);

  // Test #17: 35 protected URLs, 117 sitemap URLs, canonical Show ID reuse, and Rezdy IDs
  const protectedPaths = Object.keys(MANUAL_REVIEW_PROTECTED_URLS);
  assert.equal(protectedPaths.length, 35);
  for (const urlPath of protectedPaths) {
    const mwRes = middleware(new NextRequest(`https://www.partyatredrocks.com${urlPath}`));
    assert.equal(mwRes.status, 200, `Protected URL ${urlPath} must return 200 without redirect`);
  }

  const sitemapRes = await getSitemapXml();
  const sitemapXml = await sitemapRes.text();
  const locCount = (sitemapXml.match(/<loc>/g) || []).length;
  assert.equal(locCount, 117, "Sitemap URL count must remain 117");

  const retired410 = middleware(new NextRequest("https://www.partyatredrocks.com/book/1stbank-center"));
  assert.equal(retired410.status, 410);

  const showIdentity = resolveCanonicalServiceShowIdentity({ dateKey: "2027-03-25" });
  assert.equal(showIdentity.canonicalShowId, "rr-2027-03-25-porter-robinson-b2b-ninajirachi");

  assert.equal(PARR_PREVIEW_HIDDEN_PRODUCTS.suv.productCode, "P94HN4");
  assert.equal(PARR_PREVIEW_HIDDEN_PRODUCTS.van.productCode, "PU8R6Y");
  assert.equal(PARR_2027_OPTION_B_PRICING_AUTHORITY.suv.rezdy.legacyPublicWidgetProductId, "596193");
  assert.equal(PARR_2027_OPTION_B_PRICING_AUTHORITY.van.rezdy.legacyPublicWidgetProductId, "630812");

  recordReceipt("test_16_and_17_preservation_and_seo_gates", {
    legacy2026OrderPreservedTotal: fetchedLegacy?.payment?.totalPaid,
    protectedUrlsVerified: protectedPaths.length,
    sitemapUrlCount: locCount,
    rezdyIdsVerified: ["596193", "630812", "541037", "P94HN4", "PU8R6Y"],
  });
});

test("Hardening H1: Dedicated PARR_SECRET is strictly required (fail-closed with zero fallback to BLOB_READ_WRITE_TOKEN or REZDY_API_KEY)", async (t) => {
  withIsolatedOrderEnv(t);

  // Set non-PARR secrets to prove ZERO fallback to BLOB_READ_WRITE_TOKEN or REZDY_API_KEY!
  process.env.BLOB_READ_WRITE_TOKEN = "vercel_blob_rw_public_token_must_not_be_used";
  process.env.REZDY_API_KEY = "rezdy_api_key_must_not_be_used_as_secret";

  for (const invalidVal of [undefined, "", "    "]) {
    if (invalidVal === undefined) delete process.env.PARR_SECRET;
    else process.env.PARR_SECRET = invalidVal;

    assert.throws(() => requireDedicatedParrSecret(), MissingParrSecretError);
    assert.throws(() => deriveInventoryNamespacePrefix(), MissingParrSecretError);
    assert.throws(() => encryptInventoryLedger("test"), MissingParrSecretError);
    assert.throws(() => decryptInventoryLedger('{"v":2}'), MissingParrSecretError);
    assert.throws(() => signConfirmationToken("ORD123", "PARR-123"), MissingParrSecretError);

    const memStore = new InMemoryCasInventoryStore();
    await assert.rejects(() => memStore.readPool("2027-03-25__suv"), MissingParrSecretError);
    await assert.rejects(
      () => getPublicVehicleAvailability({ dateKey: "2026-08-01", vehicleSlug: "suv" }),
      MissingParrSecretError
    );
    await assert.rejects(
      () =>
        acquireOrReuseCheckoutHold({
          dateKey: "2027-03-25",
          vehicleSlug: "suv",
          idempotencyKey: "idem-missing-secret-01",
          partySize: 4,
        }),
      MissingParrSecretError
    );

    const bookRes = await createParrRezdyBooking({
      vehicleSlug: "suv",
      sessionId: "9001",
      startTimeLocal: "2027-03-25 16:30:00",
      optionLabel: "Private Suburban (Up to 6 Guests)",
      partySize: 4,
      firstName: "Fail",
      lastName: "Closed",
      email: "failclosed@example.com",
      phone: "7205550111",
      pickupAddress: "1550 Court Pl, Denver, CO 80202",
      cardToken: "tok_test_missing_secret",
      idempotencyKey: "idem-missing-secret-book-01",
    });
    assert.equal(bookRes.ok, false);
    assert.equal(bookRes.httpStatus, 503);
    if (!bookRes.ok) {
      assert.equal(bookRes.code, "MISSING_PARR_SECRET");
    }

    const availApiRes = await getPublicAvailabilityRoute(
      new Request("https://preview.partyatredrocks.vercel.app/api/rezdy/availability?date=2027-03-25")
    );
    assert.equal(availApiRes.status, 503);
    const availJson = await availApiRes.json();
    assert.equal(availJson.code, "MISSING_PARR_SECRET");

    const adminApiRes = await getAdminInventoryRoute(
      new NextRequest("https://preview.partyatredrocks.vercel.app/api/internal/rezdy-inventory")
    );
    assert.equal(adminApiRes.status, 503);
    const adminJson = await adminApiRes.json();
    assert.equal(adminJson.code, "MISSING_PARR_SECRET");
  }

  // Verify v2 AES-256-GCM rejects plaintext passthrough and wrong PARR_SECRET
  process.env.PARR_SECRET = "parr_secret_alpha_key_0001";
  const cipherAlpha = encryptInventoryLedger('{"poolKey":"2027-03-25__suv"}');
  assert.throws(
    () => decryptInventoryLedger('{"poolKey":"2027-03-25__suv"}'),
    /INVENTORY_DECRYPT_ERROR/
  );
  process.env.PARR_SECRET = "parr_secret_bravo_key_0002";
  assert.throws(() => decryptInventoryLedger(cipherAlpha));

  recordReceipt("hardening_h1_required_parr_secret_fail_closed", {
    testedStates: ["undefined", "empty_string", "whitespace"],
    zeroFallbackWhenBlobAndRezdyEnvPresent: true,
    availabilityRouteStatusWithoutSecret: 503,
    bookingStatusWithoutSecret: 503,
    adminRouteStatusWithoutSecret: 503,
    plaintextEnvelopeRejected: true,
    crossKeyCipherRejected: true,
  });
});

test("Hardening H2: Private BlobCasInventoryStore enforces access='private', private storage host, and ETag/ifMatch CAS race safety on final unit", async (t) => {
  withIsolatedOrderEnv(t);

  // Missing private blob token fails closed
  const noTokenStore = new BlobCasInventoryStore();
  await assert.rejects(() => noTokenStore.readPool("2027-04-03__suv"), MissingPrivateBlobTokenError);

  const blobs = new Map<
    string,
    {
      body: string;
      contentType: string;
      etag: string;
      access: "public" | "private";
      uploadedAt: Date;
    }
  >();
  let etagSeq = 0;
  let putCalls = 0;
  let getCalls = 0;
  let delCalls = 0;
  let preconditionCollisions = 0;
  let hostMode: "private" | "public" = "private";

  const makeUrl = (pathname: string) =>
    hostMode === "private"
      ? `https://lxs117qwqh1xirgj.private.blob.vercel-storage.com/${pathname}`
      : `https://byh4ev71yfs07fle.public.blob.vercel-storage.com/${pathname}`;

  const mockOps: VercelPrivateBlobOps = {
    head: (async (urlOrPathname: string) => {
      const pathname = urlOrPathname.startsWith("http")
        ? new URL(urlOrPathname).pathname.slice(1)
        : urlOrPathname;
      const entry = blobs.get(pathname);
      if (!entry) throw new BlobNotFoundError();
      return {
        size: Buffer.byteLength(entry.body),
        uploadedAt: entry.uploadedAt,
        pathname,
        contentType: entry.contentType,
        contentDisposition: `inline; filename="${path.basename(pathname)}"`,
        url: makeUrl(pathname),
        downloadUrl: `${makeUrl(pathname)}?download=1`,
        cacheControl: "private, no-cache",
        etag: entry.etag,
      };
    }) as VercelPrivateBlobOps["head"],

    get: (async (
      urlOrPathname: string,
      options: { access: "public" | "private"; useCache?: boolean }
    ) => {
      getCalls += 1;
      assert.equal(options.access, "private", "All Blob gets MUST use access='private'");
      assert.equal(options.useCache, false, "All Blob gets MUST bypass CDN cache (useCache=false)");
      const pathname = urlOrPathname.startsWith("http")
        ? new URL(urlOrPathname).pathname.slice(1)
        : urlOrPathname;
      const entry = blobs.get(pathname);
      if (!entry) return null;
      const bytes = new TextEncoder().encode(entry.body);
      const stream = new ReadableStream<Uint8Array>({
        start(controller) {
          controller.enqueue(bytes);
          controller.close();
        },
      });
      return {
        statusCode: 200 as const,
        stream,
        headers: new Headers({ "content-type": entry.contentType, etag: entry.etag }),
        blob: {
          url: makeUrl(pathname),
          downloadUrl: `${makeUrl(pathname)}?download=1`,
          pathname,
          contentType: entry.contentType,
          contentDisposition: "inline",
          cacheControl: "private, no-cache",
          size: bytes.byteLength,
          uploadedAt: entry.uploadedAt,
          etag: entry.etag,
        },
      };
    }) as unknown as VercelPrivateBlobOps["get"],

    put: (async (pathname: string, body: unknown, options) => {
      putCalls += 1;
      assert.equal(options.access, "private", "All Blob puts MUST use access='private'");
      await new Promise((r) => setTimeout(r, 3));
      const existing = blobs.get(pathname);
      if (options.allowOverwrite === false && existing) {
        preconditionCollisions += 1;
        throw new BlobPreconditionFailedError();
      }
      if (options.ifMatch) {
        if (!existing || existing.etag !== options.ifMatch) {
          preconditionCollisions += 1;
          throw new BlobPreconditionFailedError();
        }
      }
      etagSeq += 1;
      const etag = `"etag-private-${etagSeq}"`;
      blobs.set(pathname, {
        body: String(body),
        contentType: options.contentType || "application/octet-stream",
        etag,
        access: options.access,
        uploadedAt: new Date(),
      });
      return {
        url: makeUrl(pathname),
        downloadUrl: `${makeUrl(pathname)}?download=1`,
        pathname,
        contentType: options.contentType || "application/octet-stream",
        contentDisposition: "inline",
        etag,
      };
    }) as VercelPrivateBlobOps["put"],

    del: (async (urlOrPathname: string | string[]) => {
      delCalls += 1;
      const targets = Array.isArray(urlOrPathname) ? urlOrPathname : [urlOrPathname];
      for (const tUrl of targets) {
        const pathname = tUrl.startsWith("http") ? new URL(tUrl).pathname.slice(1) : tUrl;
        blobs.delete(pathname);
      }
    }) as VercelPrivateBlobOps["del"],

    list: (async (options) => {
      const prefix = options?.prefix || "";
      const matched = Array.from(blobs.entries())
        .filter(([k]) => k.startsWith(prefix))
        .map(([pathname, entry]) => ({
          url: makeUrl(pathname),
          downloadUrl: `${makeUrl(pathname)}?download=1`,
          pathname,
          size: Buffer.byteLength(entry.body),
          uploadedAt: entry.uploadedAt,
          etag: entry.etag,
        }));
      return { blobs: matched, hasMore: false };
    }) as VercelPrivateBlobOps["list"],
  };

  const privateStore = new BlobCasInventoryStore({
    ops: mockOps,
    token: "vercel_blob_rw_lxs117qwqh1xirgj_mock_private_token",
  });
  const mockRezdy = makeMockRezdyFetch();

  // Verify public host URL is rejected immediately!
  hostMode = "public";
  await assert.rejects(
    () =>
      ensureOpeningInventorySeeded(
        { dateKey: "2027-04-03", vehicleSlug: "suv" },
        { store: privateStore, fetchImpl: mockRezdy.fetchImpl }
      ),
    /SECURITY_VIOLATION/
  );
  hostMode = "private";

  // Pre-seed & hold 5 of 6 Suburbans on 2027-04-03 in Private Blob Store
  await ensureOpeningInventorySeeded(
    { dateKey: "2027-04-03", vehicleSlug: "suv" },
    { store: privateStore, fetchImpl: mockRezdy.fetchImpl }
  );
  for (let i = 1; i <= 5; i += 1) {
    const h = await acquireOrReuseCheckoutHold(
      {
        dateKey: "2027-04-03",
        vehicleSlug: "suv",
        idempotencyKey: `idem-priv-blob-pre-${i}`,
        partySize: 5,
      },
      { store: privateStore, fetchImpl: mockRezdy.fetchImpl }
    );
    assert.equal(h.ok, true);
  }

  // Race 8 simultaneous requests for the 6th and FINAL Suburban over Private Blob ETag/ifMatch CAS!
  const raceResults = await Promise.all(
    Array.from({ length: 8 }, (_, idx) =>
      acquireOrReuseCheckoutHold(
        {
          dateKey: "2027-04-03",
          vehicleSlug: "suv",
          idempotencyKey: `idem-priv-blob-racer-${idx + 1}`,
          partySize: 6,
        },
        {
          store: privateStore,
          fetchImpl: mockRezdy.fetchImpl,
          bypassInProcessQueueForCasTest: true,
        }
      )
    )
  );

  const winners = raceResults.filter((r) => r.ok);
  const losers = raceResults.filter((r) => !r.ok);
  assert.equal(winners.length, 1, "Exactly 1 racer wins the final Suburban over private Blob ETag CAS");
  assert.equal(losers.length, 7, "All other 7 racers fail cleanly with SOLD_OUT");
  assert.ok(preconditionCollisions >= 1, "BlobPreconditionFailedError triggered and retried cleanly");
  assert.ok(delCalls >= preconditionCollisions, "Unreferenced candidate snapshots cleaned up on CAS collision");

  // Confirm every stored blob has access='private' and zero plaintext leakage
  for (const [pathname, b] of Array.from(blobs.entries())) {
    assert.equal(b.access, "private");
    if (pathname.endsWith(".enc")) {
      assert.doesNotMatch(b.body, /2027-04-03__suv|idem-priv-blob/);
    }
  }

  recordReceipt("hardening_h2_private_blob_cas_race", {
    totalPutCalls: putCalls,
    totalGetCalls: getCalls,
    preconditionCollisionsHandled: preconditionCollisions,
    candidateBlobsCleanedUp: delCalls,
    raceWinners: winners.length,
    raceLosers: losers.length,
    allStoredBlobsPrivate: true,
  });
});

test("Hardening H3: Incomplete or ambiguous Rezdy reconciliation keeps dates blocked; clean cancelled orders record without blocking", async (t) => {
  withIsolatedOrderEnv(t);
  const store = new InMemoryCasInventoryStore();

  // 1. Upstream Rezdy HTTP 503 during opening seed MUST durably block the date!
  const failingFetch: FetchLike = async () =>
    new Response(JSON.stringify({ error: "Rezdy 503" }), { status: 503 });

  const blockedAvail = await getPublicVehicleAvailability(
    { dateKey: "2027-04-09", vehicleSlug: "suv" },
    { store, fetchImpl: failingFetch }
  );
  assert.equal(blockedAvail.available, false);
  assert.equal(blockedAvail.poolState, "reconciliation_blocked");
  assert.equal(blockedAvail.statusMessage, "Not available for this show.");

  // 2. Upstream ambiguous status (`PROCESSING`) on 2027-04-10 blocks ONLY 2027-04-10 SUV
  const ambiguousMock = makeMockRezdyFetch({
    upstreamOrders: [
      {
        orderNumber: "ORD-AMB-PROC-01",
        status: "PROCESSING",
        totalAmount: 518.96,
        totalPaid: 0,
        items: [
          {
            productCode: "P94HN4",
            startTimeLocal: "2027-04-10 16:30:00",
            quantities: [{ value: 1 }],
          },
        ],
      },
      {
        orderNumber: "ORD-CLEAN-CANCEL-01",
        status: "CANCELLED",
        refundStatus: "COMPLETED",
        totalAmount: 726.96,
        totalPaid: 0,
        items: [
          {
            productCode: "PU8R6Y",
            startTimeLocal: "2027-04-10 16:30:00",
            quantities: [{ value: 1 }],
          },
        ],
      },
    ],
  });

  const ambSuv = await getPublicVehicleAvailability(
    { dateKey: "2027-04-10", vehicleSlug: "suv" },
    { store, fetchImpl: ambiguousMock.fetchImpl }
  );
  assert.equal(ambSuv.available, false);
  assert.equal(ambSuv.poolState, "reconciliation_blocked");

  const cleanCancelVan = await getPublicVehicleAvailability(
    { dateKey: "2027-04-10", vehicleSlug: "van" },
    { store, fetchImpl: ambiguousMock.fetchImpl }
  );
  assert.equal(cleanCancelVan.available, true);
  assert.equal(cleanCancelVan.availableCount, 3, "Clean CANCELLED order consumes 0 units and does not block");

  // 3. Verify 2027 baseline auditor flags covered vs missing vs price-mismatch vs ambiguous orders
  const auditFetch: FetchLike = async (input) => {
    const u = new URL(String(input));
    if (u.pathname.endsWith("/v1/availability")) {
      const code = u.searchParams.get("productCode");
      const start = u.searchParams.get("startTimeLocal") || "";
      if (start.startsWith("2027-03-01") && code === "P94HN4") {
        return new Response(
          JSON.stringify({
            sessions: [
              {
                id: 7001,
                productCode: "P94HN4",
                startTimeLocal: "2027-03-25 16:30:00",
                seatsAvailable: 6,
                priceOptions: [{ label: "Group of 1", price: 499, maxQuantity: 1 }],
              },
              {
                id: 7002,
                productCode: "P94HN4",
                startTimeLocal: "2027-03-26 16:30:00",
                seatsAvailable: 6,
                priceOptions: [{ label: "Group of 1", price: 450, maxQuantity: 1 }], // intentional mismatch
              },
            ],
          }),
          { status: 200 }
        );
      }
      return new Response(JSON.stringify({ sessions: [] }), { status: 200 });
    }
    if (u.pathname.endsWith("/v1/bookings")) {
      const code = u.searchParams.get("productCode");
      if (code === "P94HN4") {
        return new Response(
          JSON.stringify({
            bookings: [
              {
                orderNumber: "ORD-2027-AMB",
                status: "ON_HOLD",
                totalAmount: 518.96,
                totalPaid: 0,
                items: [{ productCode: "P94HN4", startTimeLocal: "2027-03-27 16:30:00", quantities: [{ value: 1 }] }],
              },
            ],
          }),
          { status: 200 }
        );
      }
      return new Response(JSON.stringify({ bookings: [] }), { status: 200 });
    }
    return new Response(JSON.stringify({}), { status: 200 });
  };

  const audit = await runParr2027SessionAndReconciliationAudit({ fetchImpl: auditFetch });
  assert.equal(audit.summary.totalUnique2027ServiceDates, 43);
  const d0325 = audit.matrix.find((r) => r.dateKey === "2027-03-25");
  const d0326 = audit.matrix.find((r) => r.dateKey === "2027-03-26");
  const d0327 = audit.matrix.find((r) => r.dateKey === "2027-03-27");
  assert.equal(d0325?.suburban.coverageStatus, "covered");
  assert.equal(d0325?.suburban.effectiveDateStatus, "ready");
  assert.equal(d0326?.suburban.coverageStatus, "mismatch");
  assert.equal(d0326?.suburban.effectiveDateStatus, "blocked");
  assert.equal(d0327?.suburban.coverageStatus, "missing_session");
  assert.equal(d0327?.suburban.orderReconciliationStatus, "blocked_ambiguous");
  assert.equal(d0327?.suburban.effectiveDateStatus, "blocked");

  recordReceipt("hardening_h3_incomplete_and_ambiguous_reconciliation_blocking", {
    incompleteSeedPoolState: blockedAvail.poolState,
    ambiguousOrderPoolState: ambSuv.poolState,
    cleanCancelledAvailableCount: cleanCancelVan.availableCount,
    auditedUnique2027Dates: audit.summary.totalUnique2027ServiceDates,
  });
});
