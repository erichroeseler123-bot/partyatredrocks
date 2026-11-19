import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import zlib from "node:zlib";
import ts from "typescript";
import {
  isSuppressedInternalParrPath,
  sanitizeParrAnalyticsPath,
} from "../lib/analyticsV2Client";
import {
  deriveParrOutcomeLogicalEventId,
  emitParrVerifiedBookingOutcomeAfterResponse,
  flushParrAnalyticsAfterTasksForTest,
  setParrAnalyticsFetchForTest,
} from "../lib/analyticsV2Server";

test("PARR Analytics v2: compiled client SDK stays <= 3,072 bytes gzipped", () => {
  const rawTs = fs.readFileSync(path.join(process.cwd(), "lib/analyticsV2Client.ts"), "utf8");
  const transpiledJs = ts.transpileModule(rawTs, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
  }).outputText;
  const gz = zlib.gzipSync(Buffer.from(transpiledJs, "utf8"));
  assert.ok(gz.byteLength <= 3072, `Expected <= 3072 bytes gzipped, got ${gz.byteLength}`);
});

test("PARR Analytics v2: redacts tokenized booking, pay-balance, order, quote, and confirmation paths and suppresses ops routes", () => {
  assert.equal(sanitizeParrAnalyticsPath("/booking/tok_secret_999?view=guest"), "/booking/[token]");
  assert.equal(sanitizeParrAnalyticsPath("/booking"), "/booking");
  assert.equal(sanitizeParrAnalyticsPath("/pay-balance/tok_bal_888"), "/pay-balance/[token]");
  assert.equal(
    sanitizeParrAnalyticsPath("/book/red-rocks-amphitheatre/shared/success?internalOrderId=ORD-1&transactionId=TX-2"),
    "/book/red-rocks-amphitheatre/shared/success",
  );
  assert.equal(sanitizeParrAnalyticsPath("/order/ORD-555"), "/order/[token]");
  assert.equal(sanitizeParrAnalyticsPath("/confirmation/CONF-777"), "/confirmation/[token]");

  assert.equal(isSuppressedInternalParrPath("/internal/orders"), true);
  assert.equal(isSuppressedInternalParrPath("/admin/parr-inventory"), true);
  assert.equal(isSuppressedInternalParrPath("/manager/marriott-west"), true);
  assert.equal(isSuppressedInternalParrPath("/book/red-rocks-amphitheatre"), false);
});

test("PARR Analytics v2: derives deterministic outcome IDs with zero raw internalOrderId and stays < 5ms during 503 collector outage", async () => {
  const id1 = deriveParrOutcomeLogicalEventId("ord_private_abc123", "confirmed_paid");
  const id2 = deriveParrOutcomeLogicalEventId("ord_private_abc123", "confirmed_paid");
  assert.equal(id1, id2);
  assert.equal(id1.includes("ord_private_abc123"), false);

  const bodies: string[] = [];
  try {
    setParrAnalyticsFetchForTest(async (_url, init) => {
      bodies.push(String(init?.body || ""));
      await new Promise((r) => setTimeout(r, 120));
      return new Response(JSON.stringify({ ok: false }), { status: 503 });
    });

    const t0 = performance.now();
    emitParrVerifiedBookingOutcomeAfterResponse({
      internalOrderId: "ord_private_abc123",
      outcomeType: "confirmed_paid",
      grossAmountUsd: 495,
      dccHandoffId: "hnd_rr_01",
      productCode: "parr-private-suv",
    });
    const syncMs = performance.now() - t0;
    assert.ok(syncMs < 5, `Expected < 5ms sync cost, got ${syncMs}ms`);

    await flushParrAnalyticsAfterTasksForTest();
    assert.equal(bodies.length, 2);
    assert.equal(bodies[0]!.includes("ord_private_abc123"), false);
    const parsed0 = JSON.parse(bodies[0]!);
    assert.equal(parsed0.events[0].logicalEventId, id1);
    assert.equal(parsed0.events[0].grossAmountUsd, 495);
  } finally {
    setParrAnalyticsFetchForTest(null);
  }
});
