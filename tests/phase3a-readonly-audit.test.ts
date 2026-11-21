import test from "node:test";
import assert from "node:assert/strict";
import { GET, POST, PUT, DELETE } from "../app/api/internal/rezdy-phase3a-audit/route";

test("Phase 3A audit route blocks Production, requires auth in Preview, rejects writes, and redacts secrets/PII", async () => {
  const prevVercelEnv = process.env.VERCEL_ENV;
  const prevParrSecret = process.env.PARR_SECRET;
  const prevRezdyKey = process.env.REZDY_API_KEY;
  const origFetch = globalThis.fetch;

  try {
    process.env.PARR_SECRET = "unit_test_parr_secret_32_chars_ok";
    process.env.REZDY_API_KEY = "unit_test_rezdy_secret_key_do_not_leak";

    // 1. Blocked on Production (404)
    process.env.VERCEL_ENV = "production";
    const prodRes = await GET(
      new Request("https://www.partyatredrocks.com/api/internal/rezdy-phase3a-audit", {
        headers: { Authorization: `Bearer ${process.env.PARR_SECRET}` },
      })
    );
    assert.equal(prodRes.status, 404);

    // 2. Fails closed without auth on Preview (401)
    process.env.VERCEL_ENV = "preview";
    const unauthRes = await GET(
      new Request("https://preview.partyatredrocks.vercel.app/api/internal/rezdy-phase3a-audit")
    );
    assert.equal(unauthRes.status, 401);

    // 3. Rejects all write HTTP methods (405)
    assert.equal((await POST()).status, 405);
    assert.equal((await PUT()).status, 405);
    assert.equal((await DELETE()).status, 405);

    // 4. Executes ONLY GET calls against api.rezdy.com/v1 and strips secrets + PII
    const observedMethods: string[] = [];
    globalThis.fetch = (async (_input: RequestInfo | URL, init?: RequestInit) => {
      observedMethods.push(init?.method || "GET");
      return new Response(
        JSON.stringify({
          requestStatus: { success: true },
          products: [
            {
              productCode: "PTEST1",
              name: "Red Rocks Suburban",
              productType: "CHARTER",
              bookingMode: "INVENTORY",
              isApiBookingSupported: true,
              priceOptions: [{ id: 1, label: "Vehicle", price: 499, seatsUsed: 1 }],
            },
          ],
          bookings: [
            {
              orderNumber: "ORD123",
              status: "CONFIRMED",
              sendNotifications: true,
              customer: { firstName: "Jane", lastName: "Doe", email: "jane.doe@example.com", phone: "3035550199" },
              payments: [{ type: "CREDITCARD", recipient: "SUPPLIER", label: "RezdyPay 4242", amount: 499, currency: "USD" }],
              items: [{ productCode: "PTEST1", amount: 499, quantities: [{ optionLabel: "Vehicle", value: 1 }] }],
            },
          ],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }) as typeof fetch;

    const okRes = await GET(
      new Request("https://preview.partyatredrocks.vercel.app/api/internal/rezdy-phase3a-audit", {
        headers: { Authorization: `Bearer ${process.env.PARR_SECRET}` },
      })
    );
    assert.equal(okRes.status, 200);
    const bodyText = await okRes.text();

    assert.equal(observedMethods.every((m) => m === "GET"), true, "Every upstream Rezdy call must be GET");
    assert.equal(bodyText.includes("unit_test_rezdy_secret_key_do_not_leak"), false, "Must never expose REZDY_API_KEY");
    assert.equal(bodyText.includes("jane.doe@example.com"), false, "Must never expose customer email");
    assert.equal(bodyText.includes("3035550199"), false, "Must never expose customer phone");
    assert.equal(bodyText.includes("4242"), false, "Must redact digits in payment labels");
  } finally {
    globalThis.fetch = origFetch;
    if (prevVercelEnv === undefined) delete process.env.VERCEL_ENV;
    else process.env.VERCEL_ENV = prevVercelEnv;
    if (prevParrSecret === undefined) delete process.env.PARR_SECRET;
    else process.env.PARR_SECRET = prevParrSecret;
    if (prevRezdyKey === undefined) delete process.env.REZDY_API_KEY;
    else process.env.REZDY_API_KEY = prevRezdyKey;
  }
});
