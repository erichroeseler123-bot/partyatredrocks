import test from "node:test";
import assert from "node:assert/strict";
import {
  FORBIDDEN_LIVE_PRODUCT_CODES,
  assertProductCodeAllowedForPhase3bWrite,
} from "../lib/rezdy/phase3bHiddenProductsAndTaxAudit";
import { GET, POST } from "../app/api/internal/rezdy-phase3b-setup/route";

test("Phase 3B guard blocks mutating any live PARR/GoSno product code and enforces Preview + Auth boundaries", async () => {
  for (const code of Array.from(FORBIDDEN_LIVE_PRODUCT_CODES)) {
    assert.throws(
      () => assertProductCodeAllowedForPhase3bWrite(code),
      /SAFETY_VIOLATION/
    );
  }
  assert.doesNotThrow(() => assertProductCodeAllowedForPhase3bWrite("PNEW27"));

  const prevVercelEnv = process.env.VERCEL_ENV;
  const prevSecret = process.env.PARR_SECRET;
  try {
    process.env.PARR_SECRET = "test_secret_32_characters_minimum_ok";
    process.env.VERCEL_ENV = "production";

    const prodRes = await POST(
      new Request("https://www.partyatredrocks.com/api/internal/rezdy-phase3b-setup", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.PARR_SECRET}` },
      })
    );
    assert.equal(prodRes.status, 404, "Must return 404 on Production");

    process.env.VERCEL_ENV = "preview";
    const unauthRes = await GET(
      new Request("https://preview.partyatredrocks.vercel.app/api/internal/rezdy-phase3b-setup")
    );
    assert.equal(unauthRes.status, 401, "Must return 401 without auth");
  } finally {
    if (prevVercelEnv === undefined) delete process.env.VERCEL_ENV;
    else process.env.VERCEL_ENV = prevVercelEnv;
    if (prevSecret === undefined) delete process.env.PARR_SECRET;
    else process.env.PARR_SECRET = prevSecret;
  }
});
