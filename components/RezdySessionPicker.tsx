"use client";

import { useMemo, useState } from "react";

type UiProduct = {
  productCode: string;
  name: string;
  description: string | null;
  minPrice: number | null;
  maxPrice: number | null;
};

type UiSession = {
  sessionKey: string;
  startTimeLocal: string | null;
  endTimeLocal: string | null;
  seatsAvailable: number | null;
  priceLabel: string | null;
};

type BookResponse = {
  booking?: {
    bookingCode?: string;
    orderNumber?: string;
    [key: string]: unknown;
  };
  internalOrderId?: string;
  error?: string;
};

export default function RezdySessionPicker({ initialDate = "", initialQty = 2 }: { initialDate?: string; initialQty?: number }) {
  const [products, setProducts] = useState<UiProduct[]>([]);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [sessions, setSessions] = useState<UiSession[]>([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedSessionKey, setSelectedSessionKey] = useState("");
  const [qty, setQty] = useState(initialQty);
  const [firstName, setFirstName] = useState("Test");
  const [lastName, setLastName] = useState("User");
  const [email, setEmail] = useState("test@example.com");
  const [allowBooking, setAllowBooking] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const selectedSession = useMemo(
    () => sessions.find((session) => session.sessionKey === selectedSessionKey) ?? null,
    [sessions, selectedSessionKey]
  );

  async function loadProducts() {
    setLoadingProducts(true);
    setMessage(null);
    try {
      const response = await fetch("/api/rezdy/products", { method: "GET", cache: "no-store" });
      const data = (await response.json()) as { products?: UiProduct[]; error?: string };
      if (!response.ok) throw new Error(data?.error || "Failed to load products");
      const rows = Array.isArray(data.products) ? data.products : [];
      setProducts(rows);
      if (!selectedProduct && rows[0]?.productCode) setSelectedProduct(rows[0].productCode);
      setProductsLoaded(true);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to load products");
    } finally {
      setLoadingProducts(false);
    }
  }

  async function loadAvailability() {
    if (!selectedProduct) {
      setMessage("Select a Rezdy product first.");
      return;
    }
    setLoadingSessions(true);
    setMessage(null);
    setSelectedSessionKey("");
    try {
      const query = new URLSearchParams();
      query.set("productCode", selectedProduct);
      query.set("qty", String(qty));
      if (initialDate) query.set("startTimeLocal", initialDate);
      const response = await fetch(`/api/rezdy/availability?${query.toString()}`, { method: "GET", cache: "no-store" });
      const data = (await response.json()) as { sessions?: UiSession[]; error?: string };
      if (!response.ok) throw new Error(data?.error || "Failed to load availability");
      const rows = Array.isArray(data.sessions) ? data.sessions : [];
      setSessions(rows);
      if (rows[0]?.sessionKey) setSelectedSessionKey(rows[0].sessionKey);
      if (!rows.length) setMessage("No sessions returned for this selection.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to load availability");
    } finally {
      setLoadingSessions(false);
    }
  }

  async function createTestBooking() {
    if (!selectedProduct || !selectedSession) {
      setMessage("Select a product and session first.");
      return;
    }
    if (!allowBooking) {
      setMessage("Please confirm test booking creation first.");
      return;
    }
    setSubmitting(true);
    setMessage(null);
    try {
      const payload = {
        productCode: selectedProduct,
        startTimeLocal: selectedSession.startTimeLocal || undefined,
        qty,
        customer: { firstName, lastName, email },
        payment: {
          provider: "stripe",
          paymentIntentId: `pi_test_${Date.now()}`,
          status: "succeeded",
          amount: 0,
          currency: "USD",
        },
        pickup: {
          location: "Find flow test",
          dateHint: initialDate || null,
        },
        rezdyBooking: { firstName, lastName, email },
      };

      const response = await fetch("/api/rezdy/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as BookResponse;
      if (!response.ok) throw new Error(data?.error || "Booking call failed");
      const rezdyRef = data.booking?.bookingCode || data.booking?.orderNumber || "unknown";
      setMessage(`Booked. Internal order: ${data.internalOrderId || "n/a"} | Rezdy ref: ${rezdyRef}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Booking call failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="comic-panel" style={{ marginTop: 16 }}>
      <div className="comic-tag">Live Rezdy Sessions (Beta)</div>
      <p className="comic-copy" style={{ marginTop: 8 }}>
        Load products, fetch live availability, choose a session, and send a test booking payload to `/api/rezdy/book`.
      </p>

      <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button type="button" className="comic-btn comic-btn-secondary" onClick={loadProducts} disabled={loadingProducts}>
          {loadingProducts ? "Loading products..." : "Load products"}
        </button>
        <button type="button" className="comic-btn comic-btn-primary" onClick={loadAvailability} disabled={loadingSessions || !productsLoaded}>
          {loadingSessions ? "Loading sessions..." : "Load availability"}
        </button>
      </div>

      <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
        <label className="comic-copy">
          Product
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="w-full rounded-xl border border-white/25 bg-black/30 px-3 py-3 text-sm text-white outline-none focus:border-white/50"
          >
            <option value="">Select product</option>
            {products.map((product) => (
              <option key={product.productCode} value={product.productCode}>
                {product.name} ({product.productCode})
              </option>
            ))}
          </select>
        </label>

        <label className="comic-copy">
          Quantity
          <input
            type="number"
            min={1}
            max={14}
            value={qty}
            onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
            className="w-full rounded-xl border border-white/25 bg-black/30 px-3 py-3 text-sm text-white outline-none focus:border-white/50"
          />
        </label>
      </div>

      {sessions.length > 0 ? (
        <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
          {sessions.map((session) => (
            <label key={session.sessionKey} className="comic-panel" style={{ padding: 12 }}>
              <input
                type="radio"
                name="rezdy-session"
                value={session.sessionKey}
                checked={selectedSessionKey === session.sessionKey}
                onChange={() => setSelectedSessionKey(session.sessionKey)}
              />
              <span className="comic-copy" style={{ marginLeft: 8 }}>
                {session.startTimeLocal || "time tbd"} {session.priceLabel ? `• ${session.priceLabel}` : ""}
                {session.seatsAvailable !== null ? ` • ${session.seatsAvailable} seats` : ""}
              </span>
            </label>
          ))}
        </div>
      ) : null}

      <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
        <input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First name"
          className="w-full rounded-xl border border-white/25 bg-black/30 px-3 py-3 text-sm text-white outline-none focus:border-white/50"
        />
        <input
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last name"
          className="w-full rounded-xl border border-white/25 bg-black/30 px-3 py-3 text-sm text-white outline-none focus:border-white/50"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full rounded-xl border border-white/25 bg-black/30 px-3 py-3 text-sm text-white outline-none focus:border-white/50"
        />
      </div>

      <label className="comic-copy" style={{ marginTop: 10, display: "block" }}>
        <input
          type="checkbox"
          checked={allowBooking}
          onChange={(e) => setAllowBooking(e.target.checked)}
          style={{ marginRight: 8 }}
        />
        I understand this test action can create a real Rezdy booking.
      </label>

      <div style={{ marginTop: 10 }}>
        <button
          type="button"
          className="comic-btn comic-btn-primary"
          onClick={createTestBooking}
          disabled={submitting || !selectedSession || !selectedProduct}
        >
          {submitting ? "Creating booking..." : "Create test booking"}
        </button>
      </div>

      {message ? (
        <p className="comic-copy" style={{ marginTop: 10 }}>
          {message}
        </p>
      ) : null}
    </section>
  );
}

