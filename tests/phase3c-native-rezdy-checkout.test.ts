import test from "node:test";
import assert from "node:assert/strict";
import {
  buildParrResellerReference,
  createParrRezdyBooking,
  getParrRezdyAvailabilityForDate,
  getParrRezdyBookingConfirmation,
  getParrRezdyStatelessQuote,
  getSafeRezdyStripePublishableKey,
  isParrNativeRezdyCheckoutEnabled,
  validateParrBookingInput,
  type FetchLike,
} from "../lib/rezdy/parrNativeRezdyService";

function jsonRes(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

test("1. Feature flag & Stripe key safety: never enabled on Production, rejects secret keys, accepts pk_ keys", () => {
  const prevEnv = process.env.VERCEL_ENV;
  const prevFlag = process.env.PARR_NATIVE_REZDY_CHECKOUT_ENABLED;
  const prevPk = process.env.REZDY_STRIPE_PUBLISHABLE_KEY;
  try {
    process.env.VERCEL_ENV = "production";
    process.env.PARR_NATIVE_REZDY_CHECKOUT_ENABLED = "true";
    assert.equal(
      isParrNativeRezdyCheckoutEnabled({ previewQueryFlag: "native_preview" }),
      false,
      "Must NEVER enable native checkout on Production during Phase 3"
    );

    process.env.VERCEL_ENV = "preview";
    process.env.PARR_NATIVE_REZDY_CHECKOUT_ENABLED = "false";
    assert.equal(isParrNativeRezdyCheckoutEnabled(), false, "Off by default without flag");
    assert.equal(isParrNativeRezdyCheckoutEnabled({ previewQueryFlag: "native_preview" }), true);

    process.env.REZDY_STRIPE_PUBLISHABLE_KEY = "sk_live_FAKE_SECRET_MUST_REJECT";
    assert.throws(() => getSafeRezdyStripePublishableKey(), /SECURITY_VIOLATION/);

    process.env.REZDY_STRIPE_PUBLISHABLE_KEY = "pk_test_1234567890abcdef";
    assert.equal(getSafeRezdyStripePublishableKey(), "pk_test_1234567890abcdef");
  } finally {
    if (prevEnv === undefined) delete process.env.VERCEL_ENV;
    else process.env.VERCEL_ENV = prevEnv;
    if (prevFlag === undefined) delete process.env.PARR_NATIVE_REZDY_CHECKOUT_ENABLED;
    else process.env.PARR_NATIVE_REZDY_CHECKOUT_ENABLED = prevFlag;
    if (prevPk === undefined) delete process.env.REZDY_STRIPE_PUBLISHABLE_KEY;
    else process.env.REZDY_STRIPE_PUBLISHABLE_KEY = prevPk;
  }
});

test("2. Single-vehicle quantity rule & separate party size validation", async () => {
  const multiVehQuote = await getParrRezdyStatelessQuote({
    vehicleSlug: "suv",
    startTimeLocal: "2027-11-30 16:30:00",
    optionLabel: "Group of 1",
    vehicleQuantity: 2,
  });
  assert.equal(multiVehQuote.ok, false);
  if (!multiVehQuote.ok) {
    assert.equal(multiVehQuote.code, "SINGLE_VEHICLE_ONLY");
    assert.equal(multiVehQuote.groupTransportationHref, "/red-rocks/group-transportation");
  }

  const badParty = validateParrBookingInput({
    vehicleSlug: "suv",
    sessionId: "523934254",
    startTimeLocal: "2027-11-30 16:30:00",
    optionLabel: "Group of 1",
    vehicleQuantity: 1,
    partySize: 8, // exceeds Suburban max 6
    firstName: "Alex",
    lastName: "Rider",
    email: "alex@example.com",
    phone: "720-555-0199",
    pickupAddress: "1850 Wazee St, Denver, CO",
    cardToken: "tok_visa123",
    idempotencyKey: "idem-party-check-01",
  });
  assert.equal(badParty.valid, false);
  assert.equal(badParty.code, "INVALID_PARTY_SIZE");
});

test("3. Option B quote reconciliation: $499+$19.96=$518.96 (SUV) and $699+$27.96=$726.96 (Van) pass; unexpected totals fail closed", async () => {
  const prevApiKey = process.env.REZDY_API_KEY;
  const prevParrSecret = process.env.PARR_SECRET;
  process.env.REZDY_API_KEY = "unit_test_rezdy_api_key";
  process.env.PARR_SECRET = "unit_test_parr_secret_phase3c_01";
  try {
    const optionBFetch: FetchLike = async (input, init) => {
      const u = String(input);
      if (u.includes("/availability?")) {
        return jsonRes({
          sessions: [
            {
              id: 523934254,
              productCode: "P94HN4",
              startTimeLocal: "2027-11-30 16:30:00",
              seatsAvailable: 1,
              priceOptions: [{ label: "Group of 1", price: 499, maxQuantity: 1 }],
            },
          ],
        });
      }
      if (u.includes("/bookings/quote")) {
        const body = JSON.parse(String(init?.body ?? "{}"));
        const code = body.items?.[0]?.productCode;
        if (code === "P94HN4") {
          return jsonRes({
            booking: {
              totalAmount: 518.96,
              totalDue: 518.96,
              totalCurrency: "USD",
              items: [{ amount: 499, subtotal: 518.96, totalItemTax: 19.96 }],
            },
          });
        }
        return jsonRes({
          booking: {
            totalAmount: 726.96,
            totalDue: 726.96,
            totalCurrency: "USD",
            items: [{ amount: 699, subtotal: 726.96, totalItemTax: 27.96 }],
          },
        });
      }
      throw new Error(`Unexpected URL: ${u}`);
    };

    const avail = await getParrRezdyAvailabilityForDate(
      { vehicleSlug: "suv", dateKey: "2027-11-30" },
      { fetchImpl: optionBFetch }
    );
    assert.equal(avail.available, true);
    assert.equal(avail.vehicleQuantityAllowed, 1);

    const suvQuote = await getParrRezdyStatelessQuote(
      {
        vehicleSlug: "suv",
        startTimeLocal: "2027-11-30 16:30:00",
        optionLabel: "Group of 1",
      },
      { fetchImpl: optionBFetch }
    );
    assert.equal(suvQuote.ok, true);
    if (suvQuote.ok) {
      assert.equal(suvQuote.quoteParityPassed, true);
      assert.equal(suvQuote.bookingFeeLabel, "Booking fee (4%)");
      assert.equal(/tax/i.test(suvQuote.bookingFeeLabel), false);
      assert.deepEqual(suvQuote.displayBreakdown, {
        vehicleLine: "Private Suburban: $499.00",
        bookingFeeLine: "Booking fee (4%): $19.96",
        totalChargedTodayLine: "Total charged today: $518.96",
      });
    }

    const vanQuote = await getParrRezdyStatelessQuote(
      {
        vehicleSlug: "van",
        startTimeLocal: "2027-11-30 16:30:00",
        optionLabel: "Group of 1",
      },
      { fetchImpl: optionBFetch }
    );
    assert.equal(vanQuote.ok, true);
    if (vanQuote.ok) {
      assert.equal(vanQuote.quoteParityPassed, true);
      assert.deepEqual(vanQuote.displayBreakdown, {
        vehicleLine: "Private Van: $699.00",
        bookingFeeLine: "Booking fee (4%): $27.96",
        totalChargedTodayLine: "Total charged today: $726.96",
      });
    }

    // Mismatch quote ($525.00 instead of $518.96) MUST fail closed (422) before touching POST /bookings!
    const mismatchFetch: FetchLike = async (input) => {
      const u = String(input);
      if (u.includes("/bookings?resellerReference=")) return jsonRes({ bookings: [] });
      if (u.includes("/bookings/quote")) {
        return jsonRes({
          booking: {
            totalAmount: 525,
            totalDue: 525,
            totalCurrency: "USD",
            items: [{ amount: 499, subtotal: 525, totalItemTax: 26 }],
          },
        });
      }
      throw new Error(`Unexpected URL: ${u}`);
    };

    const blockedBook = await createParrRezdyBooking(
      {
        vehicleSlug: "suv",
        sessionId: "523934254",
        startTimeLocal: "2027-11-30 16:30:00",
        optionLabel: "Group of 1",
        partySize: 5,
        firstName: "Alex",
        lastName: "Rider",
        email: "alex@example.com",
        phone: "720-555-0199",
        pickupAddress: "1850 Wazee St, Denver, CO",
        cardToken: "tok_visa123",
        idempotencyKey: "idem-quote-gate-block-01",
      },
      { fetchImpl: mismatchFetch }
    );
    assert.equal(blockedBook.ok, false);
    assert.equal(blockedBook.httpStatus, 422);
    if (!blockedBook.ok) {
      assert.equal(blockedBook.code, "QUOTE_TOTAL_MISMATCH");
    }
  } finally {
    if (prevApiKey === undefined) delete process.env.REZDY_API_KEY;
    else process.env.REZDY_API_KEY = prevApiKey;
    if (prevParrSecret === undefined) delete process.env.PARR_SECRET;
    else process.env.PARR_SECRET = prevParrSecret;
  }
});

test("4. Server booking creation, idempotency, duplicate-submit lock, timeout recovery, confirmation & decline handling ($518.96 / $726.96)", async () => {
  const prevApiKey = process.env.REZDY_API_KEY;
  const prevParrSecret = process.env.PARR_SECRET;
  process.env.REZDY_API_KEY = "unit_test_rezdy_api_key";
  process.env.PARR_SECRET = "unit_test_parr_secret_phase3c_02";
  try {
    let postBookingsCalls = 0;
    const storedBookings = new Map<string, Record<string, unknown>>();

    const happyFetch: FetchLike = async (input, init) => {
      const u = String(input);
      if (u.includes("/bookings/quote")) {
        return jsonRes({
          booking: {
            totalAmount: 518.96,
            totalDue: 518.96,
            totalCurrency: "USD",
            items: [{ amount: 499, subtotal: 518.96, totalItemTax: 19.96 }],
          },
        });
      }
      if (u.includes("/bookings?resellerReference=")) {
        const ref = new URL(u).searchParams.get("resellerReference") || "";
        const hit = storedBookings.get(ref);
        return jsonRes({ bookings: hit ? [hit] : [] });
      }
      if (u.includes("/bookings/") && (!init?.method || init.method === "GET")) {
        const orderNum = decodeURIComponent(new URL(u).pathname.split("/").pop() || "");
        const hit = Array.from(storedBookings.values()).find((b) => b.orderNumber === orderNum);
        return hit ? jsonRes({ booking: hit }) : jsonRes({ error: "Not found" }, 404);
      }
      if (u.endsWith(`/bookings?apiKey=unit_test_rezdy_api_key`) && init?.method === "POST") {
        postBookingsCalls += 1;
        const payload = JSON.parse(String(init.body));
        assert.equal(payload.items[0].quantities[0].value, 1, "Must submit quantity: 1");
        assert.equal(payload.items[0].amount, 499, "Submits base amount 499; Rezdy applies 4% booking fee ($19.96 -> $518.96)");
        assert.equal(payload.creditCard.cardToken, "tok_visa_valid");
        assert.equal(payload.sendNotifications, false);
        const created = {
          orderNumber: "RZD990011",
          resellerReference: payload.resellerReference,
          status: "CONFIRMED",
          totalAmount: 518.96,
          totalPaid: 518.96,
          totalDue: 0,
          totalCurrency: "USD",
          items: [
            {
              productCode: "P94HN4",
              productName: "Private Red Rocks Suburban (2027 Hidden Test)",
              startTimeLocal: "2027-11-30 16:30:00",
              amount: 499,
              subtotal: 518.96,
              totalItemTax: 19.96,
              quantities: [{ optionLabel: "Group of 1", value: 1 }],
            },
          ],
          fields: payload.fields,
        };
        storedBookings.set(payload.resellerReference, created);
        return jsonRes({ booking: created });
      }
      throw new Error(`Unhandled URL: ${u}`);
    };

    const basePayload = {
      vehicleSlug: "suv" as const,
      sessionId: "523934254",
      startTimeLocal: "2027-11-30 16:30:00",
      optionLabel: "Group of 1",
      partySize: 6,
      firstName: "Taylor",
      lastName: "Morrison",
      email: "taylor@example.com",
      phone: "303-555-0144",
      pickupAddress: "Union Station, 1701 Wynkoop St, Denver, CO",
      concertAndTripNotes: "Porter Robinson · King Soopers stop",
      cardToken: "tok_visa_valid",
      idempotencyKey: "idem-happy-flow-001",
    };

    const first = await createParrRezdyBooking(basePayload, { fetchImpl: happyFetch });
    assert.equal(first.ok, true);
    if (!first.ok) throw new Error("Expected first booking to succeed");
    assert.equal(first.idempotentRecovery, false);
    assert.equal(first.orderNumber, "RZD990011");
    assert.equal(first.totalPaid, 518.96);
    assert.equal(postBookingsCalls, 1);

    // Retry with identical idempotencyKey recovers existing booking WITHOUT calling POST /bookings again
    const second = await createParrRezdyBooking(basePayload, { fetchImpl: happyFetch });
    assert.equal(second.ok, true);
    if (!second.ok) throw new Error("Expected idempotent retry to succeed");
    assert.equal(second.idempotentRecovery, true);
    assert.equal(second.orderNumber, "RZD990011");
    assert.equal(second.totalPaid, 518.96);
    assert.equal(postBookingsCalls, 1, "Idempotent retry must NOT call POST /bookings a second time");

    // Confirmation retrieval works with valid HMAC signature and rejects tampered signature
    const confOk = await getParrRezdyBookingConfirmation(
      {
        orderNumber: first.orderNumber,
        resellerReference: first.resellerReference,
        sig: first.confirmationSig,
      },
      { fetchImpl: happyFetch }
    );
    assert.equal(confOk.ok, true);
    if (confOk.ok) {
      assert.equal(confOk.confirmation.partySize, "6");
      assert.equal(confOk.confirmation.totalPaid, 518.96);
    }

    const confBadSig = await getParrRezdyBookingConfirmation(
      {
        orderNumber: first.orderNumber,
        resellerReference: first.resellerReference,
        sig: "tampered_sig",
      },
      { fetchImpl: happyFetch }
    );
    assert.equal(confBadSig.ok, false);
    assert.equal(confBadSig.httpStatus, 401);

    // Concurrent duplicate-submit lock returns 409
    let releaseSlowFetch!: () => void;
    const slowPromise = new Promise<void>((r) => {
      releaseSlowFetch = r;
    });
    const slowFetch: FetchLike = async () => {
      await slowPromise;
      return jsonRes({ bookings: [] });
    };
    const p1 = createParrRezdyBooking(
      { ...basePayload, idempotencyKey: "idem-concurrent-lock-01" },
      { fetchImpl: slowFetch }
    );
    const p2 = await createParrRezdyBooking(
      { ...basePayload, idempotencyKey: "idem-concurrent-lock-01" },
      { fetchImpl: slowFetch }
    );
    assert.equal(p2.ok, false);
    assert.equal(p2.httpStatus, 409);
    if (!p2.ok) assert.equal(p2.code, "DUPLICATE_SUBMIT_IN_PROGRESS");
    releaseSlowFetch();
    await p1;

    // Upstream timeout AFTER Rezdy persisted the booking recovers cleanly!
    const timeoutIdem = "idem-timeout-recovery-01";
    const timeoutRef = buildParrResellerReference(timeoutIdem);
    let lookupCount = 0;
    const timeoutFetch: FetchLike = async (input, init) => {
      const u = String(input);
      if (u.includes("/bookings/quote")) {
        return jsonRes({
          booking: { totalAmount: 726.96, totalDue: 726.96, items: [{ amount: 699, subtotal: 726.96, totalItemTax: 27.96 }] },
        });
      }
      if (u.includes("/bookings?resellerReference=")) {
        lookupCount += 1;
        if (lookupCount === 1) return jsonRes({ bookings: [] });
        return jsonRes({
          bookings: [
            {
              orderNumber: "RZD990022",
              resellerReference: timeoutRef,
              status: "CONFIRMED",
              totalPaid: 726.96,
              items: [{ productCode: "PU8R6Y", startTimeLocal: "2027-11-30 16:30:00", quantities: [{ value: 1 }] }],
            },
          ],
        });
      }
      if (init?.method === "POST" && u.includes("/bookings")) {
        throw new Error("Rezdy HTTP 504: Gateway Timeout after upstream commit");
      }
      throw new Error(`Unexpected URL: ${u}`);
    };

    const recoveredVan = await createParrRezdyBooking(
      {
        ...basePayload,
        vehicleSlug: "van",
        optionLabel: "Group of 1",
        partySize: 9,
        idempotencyKey: timeoutIdem,
      },
      { fetchImpl: timeoutFetch }
    );
    assert.equal(recoveredVan.ok, true);
    if (recoveredVan.ok) {
      assert.equal(recoveredVan.idempotentRecovery, true);
      assert.equal(recoveredVan.orderNumber, "RZD990022");
      assert.equal(recoveredVan.totalPaid, 726.96);
    }

    // Safe card-decline failure behavior (no booking recorded -> returns 402 CARD_DECLINED)
    const declineFetch: FetchLike = async (input, init) => {
      const u = String(input);
      if (u.includes("/bookings/quote")) {
        return jsonRes({
          booking: { totalAmount: 518.96, totalDue: 518.96, items: [{ amount: 499, subtotal: 518.96, totalItemTax: 19.96 }] },
        });
      }
      if (u.includes("/bookings?resellerReference=")) return jsonRes({ bookings: [] });
      if (init?.method === "POST") throw new Error("Rezdy HTTP 422: Credit card declined - insufficient funds");
      throw new Error(`Unexpected URL: ${u}`);
    };
    const declined = await createParrRezdyBooking(
      { ...basePayload, idempotencyKey: "idem-declined-card-01" },
      { fetchImpl: declineFetch }
    );
    assert.equal(declined.ok, false);
    assert.equal(declined.httpStatus, 402);
    if (!declined.ok) assert.equal(declined.code, "CARD_DECLINED");
  } finally {
    if (prevApiKey === undefined) delete process.env.REZDY_API_KEY;
    else process.env.REZDY_API_KEY = prevApiKey;
    if (prevParrSecret === undefined) delete process.env.PARR_SECRET;
    else process.env.PARR_SECRET = prevParrSecret;
  }
});
