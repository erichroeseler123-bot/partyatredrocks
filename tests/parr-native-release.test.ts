import test from "node:test";
import assert from "node:assert/strict";
import { InMemoryCasInventoryStore, getPublicVehicleAvailability } from "../lib/inventory/parrVehicleInventory";
import { createParrRezdyBooking, isFullyPaidRezdyConfirmation, type FetchLike } from "../lib/rezdy/parrNativeRezdyService";

test("A confirmed status without settled money never counts as a paid purchase", () => {
  const paid = { orderNumber: "RPAID", status: "CONFIRMED", totalPaid: 518.96, totalDue: 0, totalCurrency: "USD" };
  assert.equal(isFullyPaidRezdyConfirmation(paid, 518.96), true);
  for (const patch of [{ totalPaid: 0 }, { totalPaid: undefined }, { totalPaid: 100 }, { totalPaid: 600 }, { totalAmount: 600 }, { totalDue: 10 }, { status: "PROCESSING" }, { totalCurrency: "EUR" }]) {
    assert.equal(isFullyPaidRezdyConfirmation({ ...paid, ...patch }, 518.96), false);
  }
});

test("Production leaves unpaid supplier orders blocked and requests customer notifications", async (t) => {
  const saved = { ...process.env };
  t.after(() => { process.env = saved; });
  process.env.PARR_SECRET = "release-test-secret";
  process.env.REZDY_API_KEY = "release-test-key";
  process.env.VERCEL_ENV = "production";
  const store = new InMemoryCasInventoryStore();
  let posted = 0;
  const fetchImpl: FetchLike = async (input, init) => {
    const url = new URL(String(input));
    if (url.pathname.endsWith("/availability")) return Response.json({ sessions: [{
      id: 123456, startTimeLocal: "2027-05-13 16:30:00", seatsAvailable: 6,
      priceOptions: [{ label: "Group of 1", price: 499 }],
    }] });
    if (url.pathname.endsWith("/bookings/quote")) return Response.json({ booking: {
      totalAmount: 518.96, totalDue: 518.96, items: [{ amount: 499, totalItemTax: 19.96 }],
    } });
    if (init?.method === "POST") {
      posted++;
      const body = JSON.parse(String(init.body));
      assert.equal(body.sendNotifications, true);
      return Response.json({ booking: { orderNumber: "RUNPAID", status: "CONFIRMED", totalPaid: 0, totalDue: 518.96 } });
    }
    return Response.json({ bookings: [] });
  };
  const payload = {
    vehicleSlug: "suv" as const, sessionId: "123456", startTimeLocal: "2027-05-13 16:30:00", optionLabel: "Group of 1",
    partySize: 2, firstName: "Test", lastName: "Rider", email: "test@example.com", phone: "3035550100",
    pickupAddress: "Test pickup, Denver", cardToken: "tok_test_release", idempotencyKey: "release-unpaid-test-1",
  };
  const stale = await createParrRezdyBooking({ ...payload, sessionId: "999999" }, { fetchImpl, inventoryDeps: { store, skipOpeningRezdyFetch: true } });
  assert.equal(stale.ok, false);
  assert.equal(stale.httpStatus, 409);
  assert.equal(posted, 0);
  const result = await createParrRezdyBooking(payload, { fetchImpl, inventoryDeps: { store, skipOpeningRezdyFetch: true } });
  assert.equal(posted, 1);
  assert.equal(result.ok, false);
  assert.equal(result.httpStatus, 503);
  const remaining = await getPublicVehicleAvailability({ dateKey: "2027-05-13", vehicleSlug: "suv" }, { store, skipOpeningRezdyFetch: true });
  assert.equal(remaining.available, false);
  assert.equal(remaining.poolState, "reconciliation_blocked");
});

test("Availability refresh counts a later manual legacy reservation and uses supported date filters", async (t) => {
  const saved = { ...process.env };
  t.after(() => { process.env = saved; });
  process.env.PARR_SECRET = "release-refresh-secret";
  process.env.REZDY_API_KEY = "release-test-key";
  const store = new InMemoryCasInventoryStore();
  let manualOrder = false;
  const fetchImpl: FetchLike = async (input) => {
    const url = new URL(String(input));
    assert.ok(url.searchParams.has("minTourStartTime"));
    assert.ok(url.searchParams.has("maxTourStartTime"));
    assert.ok(url.searchParams.get("minDateCreated")!.startsWith("1970-"));
    assert.equal(url.searchParams.has("minTourStartDate"), false);
    return Response.json({ bookings: manualOrder && url.searchParams.get("productCode") === "P0U1MY" ? [{
      orderNumber: "RLEGACY", status: "CONFIRMED", totalAmount: 414.96, totalPaid: 414.96,
      items: [{ productCode: "P0U1MY", startTimeLocal: "2027-05-13 00:00:00", quantities: [{ value: 1 }] }],
    }] : [] });
  };
  const deps = { store, fetchImpl, finalizeOrderMirrorImpl: async () => ({ internalOrderId: "legacy", bookingToken: "test", created: false }) };
  const before = await getPublicVehicleAvailability({ dateKey: "2027-05-13", vehicleSlug: "suv" }, deps);
  assert.equal(before.availableCount, 6);
  manualOrder = true;
  const after = await getPublicVehicleAvailability({ dateKey: "2027-05-13", vehicleSlug: "suv" }, deps);
  assert.equal(after.availableCount, 5);
});
