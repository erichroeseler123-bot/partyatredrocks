import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { NextRequest } from "next/server";
import { middleware, isInternalOpsAuthorized } from "../middleware";
import { GET as getHealth } from "../app/api/health/route";
import { GET as getOwnerSummary } from "../app/api/internal/owner-summary/route";
import {
  GET as getInternalOrder,
  PATCH as patchInternalOrder,
} from "../app/api/internal/orders/[internalOrderId]/route";

function snapshotEnv(keys: string[]): Record<string, string | undefined> {
  const snap: Record<string, string | undefined> = {};
  for (const key of keys) {
    snap[key] = process.env[key];
  }
  return snap;
}

function restoreEnv(snap: Record<string, string | undefined>) {
  for (const [key, value] of Object.entries(snap)) {
    if (typeof value === "undefined") {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
}

const AUTH_ENV_KEYS = [
  "NODE_ENV",
  "VERCEL",
  "VERCEL_ENV",
  "INTERNAL_OPS_USER",
  "INTERNAL_OPS_PASS",
  "PARR_SECRET",
  "DCC_INTERNAL_API_SECRET",
  "DCC_PARR_WEBHOOK_TOKEN",
  "BLOB_READ_WRITE_TOKEN",
  "ORDER_DB_PATH",
  "ORDER_LOG_PATH",
];

test("middleware isInternalOpsAuthorized fails closed when INTERNAL_OPS_USER/PASS are unset in production, preview, and test", () => {
  const snap = snapshotEnv(AUTH_ENV_KEYS);
  try {
    delete process.env.INTERNAL_OPS_USER;
    delete process.env.INTERNAL_OPS_PASS;
    delete process.env.PARR_SECRET;

    for (const scenario of [
      { NODE_ENV: "production", VERCEL: "1" },
      { NODE_ENV: "production", VERCEL: undefined },
      { NODE_ENV: "test", VERCEL: undefined },
      { NODE_ENV: "development", VERCEL: "1" },
    ]) {
      (process.env as Record<string, string | undefined>).NODE_ENV = scenario.NODE_ENV;
      if (scenario.VERCEL === undefined) delete process.env.VERCEL;
      else process.env.VERCEL = scenario.VERCEL;

      for (const target of [
        "/internal/orders",
        "/admin/parr-inventory",
        "/admin/friend-fleet-inventory",
        "/api/internal/orders/ord_123",
      ]) {
        const req = new NextRequest(`https://partyatredrocks.com${target}`);
        assert.equal(isInternalOpsAuthorized(req), false, `expected fail-closed for ${target}`);
        const res = middleware(req);
        assert.equal(res.status, 401, `expected 401 for ${target}`);
      }
    }

    // Local non-Vercel development fallback still works when unset
    (process.env as Record<string, string | undefined>).NODE_ENV = "development";
    delete process.env.VERCEL;
    const localReq = new NextRequest("http://localhost:3000/internal/orders");
    assert.equal(isInternalOpsAuthorized(localReq), true);
  } finally {
    restoreEnv(snap);
  }
});

test("middleware accepts PARR_SECRET Bearer on /api/internal/* without leaking Basic Auth cookie, and Basic Auth on ops pages", () => {
  const snap = snapshotEnv(AUTH_ENV_KEYS);
  try {
    (process.env as Record<string, string | undefined>).NODE_ENV = "production";
    process.env.VERCEL = "1";
    process.env.INTERNAL_OPS_USER = "ops-admin";
    process.env.INTERNAL_OPS_PASS = "ops-pass-secret";
    process.env.PARR_SECRET = "parr-bearer-secret-999";

    // Wrong Bearer fails with 401 JSON
    const badApiRes = middleware(
      new NextRequest("https://partyatredrocks.com/api/internal/orders/ord_123", {
        headers: { authorization: "Bearer wrong-token" },
      }),
    );
    assert.equal(badApiRes.status, 401);

    // Valid Bearer succeeds on /api/internal/orders/* and does NOT set internal_ops_auth cookie
    const goodBearerRes = middleware(
      new NextRequest("https://partyatredrocks.com/api/internal/orders/ord_123", {
        headers: { authorization: "Bearer parr-bearer-secret-999" },
      }),
    );
    assert.equal(goodBearerRes.status, 200);
    assert.equal(goodBearerRes.headers.get("set-cookie"), null);

    // Bearer is not accepted on browser HTML page /internal/orders
    const htmlWithBearer = middleware(
      new NextRequest("https://partyatredrocks.com/internal/orders", {
        headers: { authorization: "Bearer parr-bearer-secret-999" },
      }),
    );
    assert.equal(htmlWithBearer.status, 401);

    // Valid Basic Auth succeeds on /internal/orders and sets internal_ops_auth cookie
    const basicToken = Buffer.from("ops-admin:ops-pass-secret", "utf8").toString("base64");
    const htmlWithBasic = middleware(
      new NextRequest("https://partyatredrocks.com/internal/orders", {
        headers: { authorization: `Basic ${basicToken}` },
      }),
    );
    assert.equal(htmlWithBasic.status, 200);
    assert.match(htmlWithBasic.headers.get("set-cookie") || "", /internal_ops_auth=/);
  } finally {
    restoreEnv(snap);
  }
});

test("/api/internal/orders/[internalOrderId] enforces route-level defense-in-depth auth", async () => {
  const snap = snapshotEnv(AUTH_ENV_KEYS);
  try {
    (process.env as Record<string, string | undefined>).NODE_ENV = "test";
    delete process.env.INTERNAL_OPS_USER;
    delete process.env.INTERNAL_OPS_PASS;
    delete process.env.PARR_SECRET;

    const getRes = await getInternalOrder(
      new Request("https://partyatredrocks.com/api/internal/orders/ord_test_1"),
      { params: Promise.resolve({ internalOrderId: "ord_test_1" }) },
    );
    assert.equal(getRes.status, 401);

    const patchRes = await patchInternalOrder(
      new Request("https://partyatredrocks.com/api/internal/orders/ord_test_1", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ notes: "unauthorized attempt" }),
      }),
      { params: Promise.resolve({ internalOrderId: "ord_test_1" }) },
    );
    assert.equal(patchRes.status, 401);
  } finally {
    restoreEnv(snap);
  }
});

test("GET /api/health returns 200 direct_mor_transport health payload with Cache-Control: no-store", async () => {
  const res = await getHealth();
  assert.equal(res.status, 200);
  assert.equal(res.headers.get("cache-control"), "no-store");
  const body = await res.json();
  assert.equal(body.ok, true);
  assert.equal(body.service, "partyatredrocks");
  assert.equal(body.role, "direct_mor_transport");
  assert.equal(body.opsAuthFailClosed, true);
  assert.equal(typeof body.timestamp, "string");
  assert.equal(Number.isNaN(Date.parse(body.timestamp)), false);
});

test("GET /api/internal/owner-summary fails closed (401) without configured or matching secret", async () => {
  const snap = snapshotEnv(AUTH_ENV_KEYS);
  try {
    delete process.env.DCC_INTERNAL_API_SECRET;
    delete process.env.DCC_PARR_WEBHOOK_TOKEN;
    delete process.env.PARR_SECRET;

    const unconfiguredRes = await getOwnerSummary(
      new Request("https://partyatredrocks.com/api/internal/owner-summary", {
        headers: { "x-dcc-internal-secret": "anything" },
      }),
    );
    assert.equal(unconfiguredRes.status, 401);
    assert.equal(unconfiguredRes.headers.get("cache-control"), "no-store");
    assert.deepEqual(await unconfiguredRes.json(), { ok: false, error: "Unauthorized" });

    process.env.DCC_INTERNAL_API_SECRET = "dcc-parr-owner-secret";

    const missingHeaderRes = await getOwnerSummary(
      new Request("https://partyatredrocks.com/api/internal/owner-summary"),
    );
    assert.equal(missingHeaderRes.status, 401);

    const mismatchRes = await getOwnerSummary(
      new Request("https://partyatredrocks.com/api/internal/owner-summary", {
        headers: { authorization: "Bearer wrong-secret" },
      }),
    );
    assert.equal(mismatchRes.status, 401);
  } finally {
    restoreEnv(snap);
  }
});

test("GET /api/internal/owner-summary returns zero-PII 28d metrics without mutating disk and filters synthetic orders", async () => {
  const snap = snapshotEnv(AUTH_ENV_KEYS);
  const tempDir = mkdtempSync(path.join(os.tmpdir(), "parr-owner-summary-"));
  const tempDbPath = path.join(tempDir, "nonexistent-orders.sqlite");
  const tempNdjsonPath = path.join(tempDir, "orders.ndjson");

  try {
    delete process.env.VERCEL;
    delete process.env.BLOB_READ_WRITE_TOKEN;
    process.env.DCC_INTERNAL_API_SECRET = "dcc-owner-secret-123";
    process.env.PARR_SECRET = "parr-vault-secret-456";
    process.env.ORDER_DB_PATH = tempDbPath;
    process.env.ORDER_LOG_PATH = tempNdjsonPath;

    const now = Date.now();
    const isoDaysAgo = (days: number) => new Date(now - days * 24 * 60 * 60 * 1000).toISOString();

    const fixtureRows = [
      // 1. Paid owned Suburban ($399)
      {
        internalOrderId: "ord_paid_suburban",
        createdAt: isoDaysAgo(2),
        rezdyBookingReference: "R-1001",
        productCode: "parr-suburban",
        customer: {
          firstName: "Jordan",
          lastName: "Rider",
          email: "jordan.rider@gmail.com",
          phone: "3035550199",
        },
        booking: { status: "confirmed", inventoryOwner: "parr" },
        payment: { status: "paid", totalDue: 399, totalPaid: 399 },
        pickup: { address: "1600 Glenarm Pl, Denver, CO" },
      },
      // 2. Partial / awaiting balance + needs_review owned Van ($200 paid of $599)
      {
        internalOrderId: "ord_partial_van",
        createdAt: isoDaysAgo(5),
        rezdyBookingReference: "R-1002",
        productCode: "parr-van-10",
        customer: {
          firstName: "Taylor",
          lastName: "Concert",
          email: "taylor.concert@yahoo.com",
          phone: "7205550144",
        },
        booking: { status: "pending_payment", inventoryOwner: "parr" },
        payment: { status: "partial", totalDue: 599, totalPaid: 200 },
        followUpStatus: "needs_review",
      },
      // 3. Paid friend_fleet overflow ($399 — counts in ordersTotal & paidOrders, NOT ownedGrossRevenueUsd)
      {
        internalOrderId: "ord_friend_fleet",
        createdAt: isoDaysAgo(7),
        rezdyBookingReference: "R-1003",
        productCode: "parr-suburban",
        customer: {
          firstName: "Casey",
          lastName: "Overflow",
          email: "casey.overflow@icloud.com",
        },
        booking: { status: "confirmed", inventoryOwner: "friend_fleet" },
        payment: { status: "paid", totalDue: 399, totalPaid: 399 },
      },
      // 4. Unpaid order ($399 due, $0 paid -> awaitingBalanceOrders)
      {
        internalOrderId: "ord_unpaid",
        createdAt: isoDaysAgo(1),
        rezdyBookingReference: "R-1004",
        productCode: "parr-suburban",
        customer: {
          firstName: "Morgan",
          lastName: "Pending",
          email: "morgan.pending@outlook.com",
        },
        booking: { status: "pending_payment", inventoryOwner: "parr" },
        payment: { status: "unpaid", totalDue: 399, totalPaid: 0 },
      },
      // 5. Synthetic @example.com order (excluded)
      {
        internalOrderId: "ord_synth_example",
        createdAt: isoDaysAgo(1),
        rezdyBookingReference: "R-TEST-1",
        productCode: "parr-suburban",
        customer: {
          firstName: "Smoke",
          lastName: "Check",
          email: "smoke@example.com",
        },
        booking: { status: "confirmed", inventoryOwner: "parr" },
        payment: { status: "paid", totalDue: 399, totalPaid: 399 },
      },
      // 6. Synthetic [TEST] order (excluded)
      {
        internalOrderId: "ord_synth_tag",
        createdAt: isoDaysAgo(1),
        rezdyBookingReference: "R-TEST-2",
        productCode: "parr-van-10",
        customer: {
          firstName: "[TEST] Synthetic",
          lastName: "Order",
          email: "ops@partyatredrocks.com",
        },
        booking: { status: "confirmed", inventoryOwner: "parr" },
        payment: { status: "paid", totalDue: 599, totalPaid: 599 },
      },
      // 7. Older than 28 days (excluded)
      {
        internalOrderId: "ord_old_45d",
        createdAt: isoDaysAgo(45),
        rezdyBookingReference: "R-0900",
        productCode: "parr-suburban",
        customer: {
          firstName: "Ancient",
          lastName: "Order",
          email: "ancient@gmail.com",
        },
        booking: { status: "confirmed", inventoryOwner: "parr" },
        payment: { status: "paid", totalDue: 399, totalPaid: 399 },
      },
    ];

    writeFileSync(
      tempNdjsonPath,
      fixtureRows.map((row) => JSON.stringify(row)).join("\n") + "\n",
      "utf8",
    );

    const res = await getOwnerSummary(
      new Request("https://partyatredrocks.com/api/internal/owner-summary", {
        headers: { "x-dcc-internal-secret": "dcc-owner-secret-123" },
      }),
    );

    assert.equal(res.status, 200);
    assert.equal(res.headers.get("cache-control"), "no-store");

    // Verify read-only behavior: nonexistent SQLite DB file was NOT created on disk
    assert.equal(existsSync(tempDbPath), false);

    const rawText = await res.text();
    const payload = JSON.parse(rawText);

    assert.equal(payload.ok, true);
    assert.equal(payload.siteId, "partyatredrocks");
    assert.equal(payload.role, "direct_mor_transport");
    assert.equal(typeof payload.generatedAt, "string");
    assert.deepEqual(payload.security, {
      opsAuthFailClosed: true,
      vaultEncryptionConfigured: true,
    });
    assert.deepEqual(payload.metrics28d, {
      ordersTotal: 4,
      genuineOrdersTotal: 4,
      testRecordsExcluded: 2,
      paidOrders: 2,
      paidGrossSalesUsd: 798,
      confirmedUnpaidOrders: 0,
      pendingPaymentOrders: 1,
      openQuotes: 0,
      holds: 0,
      awaitingBalanceOrders: 1,
      awaitingBalanceGrossUsd: 399,
      depositCollectedUsd: 200,
      needsReviewOrders: 1,
      grossSalesUsd: 998,
      ownedGrossRevenueUsd: 599,
      netOperatingRevenueUsd: null,
      affiliateCommissionsUsd: 0,
      accountingNote:
        "Gross merchant sales (grossSalesUsd, paidGrossSalesUsd, and ownedGrossRevenueUsd) reflect collected customer payments only — never uncollected balances, open quotes, or holds — and are not net operating revenue or profit.",
    });

    // Strictly verify zero PII leakage
    for (const forbidden of [
      "Jordan",
      "Taylor",
      "Casey",
      "Morgan",
      "gmail.com",
      "yahoo.com",
      "3035550199",
      "1600 Glenarm",
      "R-1001",
      "ord_paid_suburban",
    ]) {
      assert.equal(rawText.includes(forbidden), false, `leaked ${forbidden}`);
    }

    // Also verify Bearer authentication works with PARR_SECRET
    const bearerRes = await getOwnerSummary(
      new Request("https://partyatredrocks.com/api/internal/owner-summary", {
        headers: { authorization: "Bearer parr-vault-secret-456" },
      }),
    );
    assert.equal(bearerRes.status, 200);
  } finally {
    restoreEnv(snap);
    rmSync(tempDir, { recursive: true, force: true });
  }
});

test("ownerSummary strictly separates synthetic test patterns, confirmed-unpaid, open quotes, holds, deposits, and never counts uncollected balances as revenue", async () => {
  const { isSyntheticTestOrder, summarizeOwnerOrders28d } = await import("@/lib/parr/ops/ownerSummary");
  const now = new Date("2026-11-11T16:00:00.000Z");
  const createdAt = "2026-11-10T16:00:00.000Z";

  const syntheticSamples = [
    { internalOrderId: "s1", createdAt, customer: { email: "runner@example.org", firstName: "Alex", lastName: "One" } },
    { internalOrderId: "s2", createdAt, customer: { email: "runner@example.net", firstName: "Alex", lastName: "Two" } },
    { internalOrderId: "s3", createdAt, customer: { email: "probe@test.local", firstName: "Alex", lastName: "Three" } },
    { internalOrderId: "s4", createdAt, customer: { email: "real@domain.com", firstName: "E2E", lastName: "Verifier" } },
    { internalOrderId: "s5", createdAt, customer: { email: "real@domain.com", firstName: "QA", lastName: "Bot" } },
    { internalOrderId: "s6", createdAt, customer: { email: "real@domain.com", firstName: "Codex", lastName: "Check" } },
    { internalOrderId: "s7", createdAt, customer: { email: "real@domain.com", firstName: "Antigravity", lastName: "Probe" } },
    { internalOrderId: "s8", createdAt, customer: { email: "real@domain.com", firstName: "Synthetic", lastName: "Order" } },
    { internalOrderId: "s9", createdAt, customer: { email: "real@domain.com", firstName: "Jane", lastName: "Doe" } },
  ];

  for (const row of syntheticSamples) {
    assert.equal(isSyntheticTestOrder(row as never), true, `expected ${row.internalOrderId} to be synthetic`);
  }

  // Real customers whose names/notes contain substrings like "qa" inside "chautauqua"/"square" or "testa" must NOT be flagged
  const genuineEdgeSamples = [
    {
      internalOrderId: "g_paid",
      createdAt,
      productCode: "parr-suburban",
      customer: { firstName: "Nick", lastName: "Testa", email: "nick.testa@chautauqua-denver.org" },
      notes: "Pickup near Union Square hotel lobby",
      booking: { status: "confirmed", inventoryOwner: "parr" },
      payment: { status: "paid", totalDue: 399, totalPaid: 399 },
    },
    {
      internalOrderId: "g_confirmed_unpaid",
      createdAt,
      productCode: "parr-van-10",
      customer: { firstName: "Elena", lastName: "Vasquez", email: "elena.v@proton.me" },
      booking: { status: "confirmed", inventoryOwner: "parr" },
      payment: { status: "unpaid", totalDue: 599, totalPaid: 0 },
    },
    {
      internalOrderId: "g_deposit",
      createdAt,
      productCode: "parr-van-10",
      customer: { firstName: "Marcus", lastName: "Reed", email: "mreed@company.co" },
      booking: { status: "confirmed", inventoryOwner: "parr" },
      payment: { status: "deposit_paid", totalDue: 599, totalPaid: 199 },
    },
    {
      internalOrderId: "g_quote",
      createdAt,
      productCode: "parr-suburban",
      customer: { firstName: "Hannah", lastName: "Cole", email: "hcole@company.co" },
      booking: { status: "quote", inventoryOwner: "parr" },
      payment: { status: "unpaid", totalDue: 399, totalPaid: 0 },
    },
    {
      internalOrderId: "g_hold",
      createdAt,
      productCode: "parr-suburban",
      customer: { firstName: "Devon", lastName: " Brooks", email: "dbrooks@company.co" },
      booking: { status: "on_hold", inventoryOwner: "parr" },
      payment: { status: "unpaid", totalDue: 399, totalPaid: 0 },
    },
    {
      internalOrderId: "g_canceled",
      createdAt,
      productCode: "parr-suburban",
      customer: { firstName: "Sam", lastName: "Canceled", email: "scanceled@company.co" },
      booking: { status: "canceled", inventoryOwner: "parr" },
      payment: { status: "unpaid", totalDue: 399, totalPaid: 0 },
    },
  ];

  for (const row of genuineEdgeSamples) {
    assert.equal(isSyntheticTestOrder(row as never), false, `expected ${row.internalOrderId} to be genuine`);
  }

  const summary = summarizeOwnerOrders28d(
    [...syntheticSamples, ...genuineEdgeSamples] as never[],
    now
  );

  assert.equal(summary.testRecordsExcluded, syntheticSamples.length);
  assert.equal(summary.openQuotes, 1);
  assert.equal(summary.holds, 1);
  assert.equal(summary.genuineOrdersTotal, 3);
  assert.equal(summary.ordersTotal, 3);
  assert.equal(summary.paidOrders, 1);
  assert.equal(summary.paidGrossSalesUsd, 399);
  assert.equal(summary.confirmedUnpaidOrders, 1);
  assert.equal(summary.pendingPaymentOrders, 0);
  assert.equal(summary.awaitingBalanceOrders, 1);
  assert.equal(summary.depositCollectedUsd, 199);
  assert.equal(summary.awaitingBalanceGrossUsd, 400);
  // Gross sales & ownedGrossRevenueUsd strictly equal collected $399 + $199 = $598 (never uncollected $599 or $400)
  assert.equal(summary.grossSalesUsd, 598);
  assert.equal(summary.ownedGrossRevenueUsd, 598);
  assert.equal(summary.netOperatingRevenueUsd, null);
  assert.equal(summary.affiliateCommissionsUsd, 0);
  assert.match(summary.accountingNote, /not net operating revenue or profit/i);
});
