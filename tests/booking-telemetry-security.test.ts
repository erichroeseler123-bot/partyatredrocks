import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { sanitizeTelemetryEventId, sanitizeTelemetryPath } from "../lib/networkEvents";

test("sanitizeTelemetryPath normalizes all tokenized customer routes", () => {
  assert.equal(sanitizeTelemetryPath("/booking/abc-123-secret-token"), "/booking/[token]");
  assert.equal(sanitizeTelemetryPath("/booking/abc-123-secret-token?view=guest"), "/booking/[token]");
  assert.equal(sanitizeTelemetryPath("/pay-balance/tok-999"), "/pay-balance/[token]");
  assert.equal(sanitizeTelemetryPath("/pay/tok-999"), "/pay/[token]");
  assert.equal(sanitizeTelemetryPath("/quote/tok-999"), "/quote/[token]");
  assert.equal(sanitizeTelemetryPath("/manage/tok-999"), "/manage/[token]");
  assert.equal(sanitizeTelemetryPath("/book/red-rocks-amphitheatre/private/suv"), "/book/red-rocks-amphitheatre/private/suv");
});

test("sanitizeTelemetryEventId blocks raw booking-prefixed event IDs and allows HMAC event IDs", () => {
  assert.equal(sanitizeTelemetryEventId("parr_booking_secret_token_123"), undefined);
  assert.equal(sanitizeTelemetryEventId("gosno_booking_uuid_456"), undefined);
  assert.equal(sanitizeTelemetryEventId("parr_evt_0123456789abcdef01234567"), "parr_evt_0123456789abcdef01234567");
});

test("VerifiedBookingTelemetry and booking page never expose raw token or misattribute Event.organizer", () => {
  const telemetrySrc = fs.readFileSync(
    path.join(process.cwd(), "components/booking/VerifiedBookingTelemetry.tsx"),
    "utf8",
  );
  assert.equal(telemetrySrc.includes("parr_booking_"), false);
  assert.equal(telemetrySrc.includes("/booking/${"), false);
  assert.equal(telemetrySrc.includes('entryPage: "/booking/[token]"'), true);

  const bookingPageSrc = fs.readFileSync(
    path.join(process.cwd(), "app/booking/[token]/page.tsx"),
    "utf8",
  );
  assert.equal(bookingPageSrc.includes("createHmac('sha256'"), true);
  assert.equal(bookingPageSrc.includes("dedupeEventId={telemetryDedupeId}"), true);
  assert.equal(bookingPageSrc.includes("'@type': 'Service'"), true);
  // Event schema must not list PARR as Event.organizer
  const eventBlock = bookingPageSrc.slice(
    bookingPageSrc.indexOf("const eventSchema"),
    bookingPageSrc.indexOf("const transportServiceSchema"),
  );
  assert.equal(eventBlock.includes("organizer:"), false);
});
