import test from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import { GET, PARTY_AT_RED_ROCKS_DCC_SITE_MANIFEST } from "../app/.well-known/dcc-site/route";
import { middleware } from "../middleware";

test("Party at Red Rocks /.well-known/dcc-site returns versioned dcc.site-manifest.v1 without secrets or autonomous booking", async () => {
  const res = GET();
  assert.equal(res.status, 200);
  const manifest = await res.json();
  assert.equal(manifest.schema, "dcc.site-manifest.v1");
  assert.equal(manifest.version, "1.0.0");
  assert.equal(manifest.site_id, "partyatredrocks");
  assert.equal(manifest.booking_authority.decision_authorization_mode, "shadow_only_no_side_effects");
  assert.equal(manifest.booking_authority.autonomous_booking_enabled, false);
  assert.equal(manifest.context_support.cookie_name, "parr_trip_ctx");
  assert.equal(manifest.privacy_and_security.exposes_secrets, false);
  assert.equal(manifest.privacy_and_security.exposes_commission_terms, false);
  assert.deepEqual(manifest, PARTY_AT_RED_ROCKS_DCC_SITE_MANIFEST);
});

test("Party at Red Rocks middleware redeems opaque ?ctx=dcc_ctx_... into Secure HttpOnly parr_trip_ctx cookie and strips URL PII", () => {
  const req = new NextRequest(
    "https://partyatredrocks.com/red-rocks/shuttle?ctx=dcc_ctx_brinkberry_parr_001&venue=red-rocks-amphitheatre&name=LeakName&cabin=1024"
  );
  const res = middleware(req);
  assert.equal(res.status, 302);
  const location = res.headers.get("location") || "";
  assert.equal(location, "https://partyatredrocks.com/red-rocks/shuttle?venue=red-rocks-amphitheatre");
  assert.ok(!location.includes("ctx="));
  assert.ok(!location.includes("LeakName"));
  assert.ok(!location.includes("cabin="));
  const setCookie = res.headers.get("set-cookie") || "";
  assert.ok(setCookie.includes("parr_trip_ctx=dcc_ctx_brinkberry_parr_001"));
  assert.ok(/HttpOnly/i.test(setCookie));
  assert.ok(/Secure/i.test(setCookie));
});
