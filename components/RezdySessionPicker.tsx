"use client";

import { useMemo, useState } from "react";

type UiProduct = {
  productCode: string;
  name: string;
  description: string | null;
  minPrice: number | null;
  maxPrice: number | null;
};

const DEFAULT_REZDY_CATALOG_ID = "617787";

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
  status?: {
    orderNumber?: string | null;
    bookingStatus?: string;
    paymentStatus?: "paid" | "unpaid" | "partial" | "unknown";
    totalDue?: number | null;
    totalPaid?: number | null;
  };
  paymentHandoff?: {
    mode?: "url" | "manual";
    url?: string;
    actionLabel?: string;
    operatorAction?: string;
  };
  internalOrderId?: string;
  error?: string;
};

type BookingOutcome =
  | {
      kind: "pending_request";
      title: string;
      detail: string;
      nextSteps: string;
    }
  | {
      kind: "request_sent_waiting";
      title: string;
      detail: string;
      nextSteps: string;
    }
  | {
      kind: "paid_confirmed";
      title: string;
      detail: string;
      nextSteps: string;
    };

export default function RezdySessionPicker({ initialDate = "", initialQty = 2 }: { initialDate?: string; initialQty?: number }) {
  const [products, setProducts] = useState<UiProduct[]>([]);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [sessions, setSessions] = useState<UiSession[]>([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedSessionKey, setSelectedSessionKey] = useState("");
  const [qty, setQty] = useState(initialQty);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [allowBooking, setAllowBooking] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [outcome, setOutcome] = useState<BookingOutcome | null>(null);
  const [paymentActionUrl, setPaymentActionUrl] = useState<string | null>(null);
  const [paymentActionLabel, setPaymentActionLabel] = useState<string>("Complete Payment");

  const selectedSession = useMemo(
    () => sessions.find((session) => session.sessionKey === selectedSessionKey) ?? null,
    [sessions, selectedSessionKey]
  );

  async function loadProducts() {
    setLoadingProducts(true);
    setMessage(null);
    try {
      const response = await fetch(`/api/rezdy/products?catalogId=${DEFAULT_REZDY_CATALOG_ID}`, {
        method: "GET",
        cache: "no-store",
      });
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

  async function createBooking() {
    if (!selectedProduct || !selectedSession) {
      setMessage("Select a product and session first.");
      return;
    }
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setMessage("Enter first name, last name, and email before booking.");
      return;
    }
    if (!allowBooking) {
      setMessage("Please confirm booking submission first.");
      return;
    }
    setSubmitting(true);
    setMessage(null);
    setOutcome(null);
    setPaymentActionUrl(null);
    setPaymentActionLabel("Complete Payment");
    try {
      const payload = {
        productCode: selectedProduct,
        startTimeLocal: selectedSession.startTimeLocal || undefined,
        endTimeLocal: selectedSession.endTimeLocal || undefined,
        qty,
        customer: { firstName, lastName, email },
        pickup: {
          location: "Find flow",
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
      const status = data.status;
      const due = typeof status?.totalDue === "number" ? status.totalDue : null;
      const paid = typeof status?.totalPaid === "number" ? status.totalPaid : null;
      const handoff = data.paymentHandoff;

      if (status?.paymentStatus === "unpaid") {
        if (handoff?.mode === "url" && typeof handoff.url === "string" && handoff.url.trim()) {
          setPaymentActionUrl(handoff.url);
          setPaymentActionLabel(handoff.actionLabel || "Complete Payment");
          setOutcome({
            kind: "request_sent_waiting",
            title: "Payment Request Sent / Waiting",
            detail: `Booking created for order ${status?.orderNumber || rezdyRef}. Amount still due: $${(due ?? 0).toFixed(2)}.`,
            nextSteps:
              "Use the payment link below to complete checkout. Your booking is not fully finalized until payment is completed.",
          });
          return;
        }
        setOutcome({
          kind: "pending_request",
          title: "Booking Created, Payment Request Pending",
          detail: `Booking created for order ${status?.orderNumber || rezdyRef}. Amount still due: $${(due ?? 0).toFixed(2)}.`,
          nextSteps:
            "What happens next: our team sends your Rezdy payment request from the dashboard. You will complete payment after that request is sent.",
        });
        return;
      }

      if (status?.paymentStatus === "partial") {
        if (handoff?.mode === "url" && typeof handoff.url === "string" && handoff.url.trim()) {
          setPaymentActionUrl(handoff.url);
          setPaymentActionLabel(handoff.actionLabel || "Complete Payment");
        }
        setOutcome({
          kind: "request_sent_waiting",
          title: "Payment Request Sent / Waiting",
          detail: `Booking created for order ${status?.orderNumber || rezdyRef}. Paid: $${(paid ?? 0).toFixed(2)}. Amount still due: $${(due ?? 0).toFixed(2)}.`,
          nextSteps:
            "Complete the remaining payment to finish confirmation. If no payment link is shown, our team will send or re-send the Rezdy payment request.",
        });
        return;
      }

      if (status?.paymentStatus === "paid") {
        setOutcome({
          kind: "paid_confirmed",
          title: "Paid and Confirmed",
          detail: `Order ${status?.orderNumber || rezdyRef} is fully paid. Total paid: $${(paid ?? 0).toFixed(2)}.`,
          nextSteps: `You are confirmed. Internal order reference: ${data.internalOrderId || "n/a"}.`,
        });
        return;
      }

      setMessage(
        `Booking submitted. Internal order: ${data.internalOrderId || "n/a"} | Rezdy ref: ${rezdyRef}. Booking status: ${status?.bookingStatus || "unknown"}.`
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Booking call failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="comic-panel" style={{ marginTop: 16 }}>
      <div className="comic-tag">Live Rezdy Sessions</div>
      <p className="comic-copy" style={{ marginTop: 8 }}>
        Load products, fetch live availability, choose a session, and submit a Rezdy-managed booking request.
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
        I understand this action submits a real Rezdy booking request.
      </label>

      <div style={{ marginTop: 10 }}>
        <button
          type="button"
          className="comic-btn comic-btn-primary"
          onClick={createBooking}
          disabled={submitting || !selectedSession || !selectedProduct}
        >
          {submitting ? "Creating booking..." : "Create booking"}
        </button>
      </div>

      {outcome ? (
        <div
          className="comic-panel"
          style={{
            marginTop: 10,
            borderColor:
              outcome.kind === "paid_confirmed"
                ? "rgba(16,185,129,.45)"
                : outcome.kind === "request_sent_waiting"
                  ? "rgba(56,189,248,.45)"
                  : "rgba(251,191,36,.45)",
          }}
        >
          <div className="comic-tag">{outcome.title}</div>
          <p className="comic-copy" style={{ marginTop: 8 }}>
            {outcome.detail}
          </p>
          <p className="comic-copy" style={{ marginTop: 6 }}>
            {outcome.nextSteps}
          </p>
        </div>
      ) : null}

      {message ? (
        <p className="comic-copy" style={{ marginTop: 10 }}>
          {message}
        </p>
      ) : null}

      {paymentActionUrl ? (
        <div style={{ marginTop: 10 }}>
          <a
            href={paymentActionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="comic-btn comic-btn-primary"
          >
            {paymentActionLabel}
          </a>
        </div>
      ) : null}
    </section>
  );
}
