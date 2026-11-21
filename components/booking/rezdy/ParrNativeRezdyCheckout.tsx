"use client";

import Link from "next/link";
import Script from "next/script";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { RezdyBookingEmbed } from "./RezdyBookingEmbed";

type VehicleSlug = "suv" | "van";

type Props = {
  vehicleSlug: VehicleSlug;
  shortVehicleLabel: string;
  basePriceUsd: number;
  expectedBookingFeeUsd: number;
  expectedTotalChargedUsd: number;
  maxPartySize: number;
  initialDate?: string | null;
  initialArtist?: string | null;
  initialPartySize?: number | null;
  rezdyPublishableKey: string | null;
  allowClassicFallback?: boolean;
  fallbackEmbedProps: {
    page: string;
    surface: string;
    title: string;
    subtitle: string;
    productId: string;
    productName: string;
    rezdyUrl: string;
    eventMeta?: Record<string, string>;
  };
};

type StripeCardElement = {
  mount: (el: HTMLElement | string) => void;
  destroy?: () => void;
};
type StripeInstance = {
  elements: (opts?: Record<string, unknown>) => {
    create: (type: "card", opts?: Record<string, unknown>) => StripeCardElement;
  };
  createToken: (
    element: StripeCardElement,
    data?: { name?: string; email?: string }
  ) => Promise<{ token?: { id: string }; error?: { message?: string } }>;
};

declare global {
  interface Window {
    Stripe?: (publishableKey: string) => StripeInstance;
  }
}

type AvailabilitySession = {
  sessionId: string;
  startTimeLocal: string;
  endTimeLocal: string | null;
  seatsAvailable: number;
  optionLabel: string;
  optionPrice: number;
  maxQuantity: number;
};

type QuoteState = {
  totalDue: number;
  itemAmount: number;
  bookingFeeUsd: number;
  bookingFeeLabel: string;
  quoteParityPassed: boolean;
  blockedMessage: string | null;
};

type ConfirmationSummary = {
  orderNumber: string;
  status: string;
  productName: string;
  startTimeLocal: string;
  partySize: string | null;
  pickupAddress: string | null;
  totalPaid: number;
};

function createClientIdempotencyKey(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `parr-chk-${crypto.randomUUID()}`;
  }
  return `parr-chk-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

export function ParrNativeRezdyCheckout({
  vehicleSlug,
  shortVehicleLabel,
  basePriceUsd,
  expectedBookingFeeUsd,
  expectedTotalChargedUsd,
  maxPartySize,
  initialDate,
  initialArtist,
  initialPartySize,
  rezdyPublishableKey,
  allowClassicFallback = true,
  fallbackEmbedProps,
}: Props) {
  const [useFallbackWidget, setUseFallbackWidget] = useState(false);
  const [selectedDate, setSelectedDate] = useState(initialDate || "");
  const [availState, setAvailState] = useState<"idle" | "loading" | "available" | "sold_out" | "error">(
    initialDate ? "loading" : "idle"
  );
  const [session, setSession] = useState<AvailabilitySession | null>(null);
  const [quote, setQuote] = useState<QuoteState | null>(null);
  const [availError, setAvailError] = useState<string | null>(null);

  const defaultPartySize =
    typeof initialPartySize === "number" && initialPartySize >= 1 && initialPartySize <= maxPartySize
      ? initialPartySize
      : Math.min(4, maxPartySize);

  const [partySize, setPartySize] = useState<number>(defaultPartySize);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [tripNotes, setTripNotes] = useState(initialArtist ? `Artist / Event: ${initialArtist}` : "");

  const [stripeLoaded, setStripeLoaded] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "submitting" | "confirmed">("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<ConfirmationSummary | null>(null);

  // Stable idempotency key per selected date + vehicle so retries never double-charge
  const idempotencyKeyRef = useRef<string>(createClientIdempotencyKey());
  const inFlightLockRef = useRef<boolean>(false);
  const availabilityRequestRef = useRef(0);
  const cardMountRef = useRef<HTMLDivElement | null>(null);
  const stripeRef = useRef<StripeInstance | null>(null);
  const cardElementRef = useRef<StripeCardElement | null>(null);

  const partyOptions = useMemo(
    () => Array.from({ length: maxPartySize }, (_, i) => i + 1),
    [maxPartySize]
  );

  const loadAvailabilityAndQuote = useCallback(
    async (dateKey: string) => {
      const requestId = ++availabilityRequestRef.current;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
        setAvailState("idle");
        setSession(null);
        setQuote(null);
        return;
      }
      setAvailState("loading");
      setAvailError(null);
      setSession(null);
      setQuote(null);
      idempotencyKeyRef.current = createClientIdempotencyKey();

      try {
        const qs = new URLSearchParams({
          vehicle: vehicleSlug,
          date: dateKey,
        });
        if (typeof window !== "undefined") {
          const cur = new URLSearchParams(window.location.search);
          const qso = cur.get("qa_sold_out");
          if (qso) qs.set("qa_sold_out", qso);
        }
        const res = await fetch(
          `/api/rezdy/availability?${qs.toString()}`,
          { cache: "no-store" }
        );
        const data = await res.json();
        if (requestId !== availabilityRequestRef.current) return;
        if (!res.ok || !data.ok) {
          throw new Error(data.error || "Unable to check availability.");
        }
        if (!data.available || !data.session) {
          setAvailState("sold_out");
          return;
        }

        const sess = data.session as AvailabilitySession;
        setSession(sess);

        const qRes = await fetch("/api/rezdy/quote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            vehicleSlug,
            startTimeLocal: sess.startTimeLocal,
            optionLabel: sess.optionLabel,
            vehicleQuantity: 1,
          }),
        });
        const qData = await qRes.json();
        if (requestId !== availabilityRequestRef.current) return;
        if (!qRes.ok || !qData.ok) {
          throw new Error(qData.message || qData.error || "Unable to verify vehicle quote.");
        }

        setQuote({
          totalDue: Number(qData.totalDue),
          itemAmount: Number(qData.itemAmount),
          bookingFeeUsd: Number(qData.bookingFeeUsd),
          bookingFeeLabel: String(qData.bookingFeeLabel || "Booking fee (4%)"),
          quoteParityPassed: Boolean(qData.quoteParityPassed),
          blockedMessage: qData.blockedMessage ?? null,
        });
        setAvailState("available");
      } catch (err) {
        if (requestId !== availabilityRequestRef.current) return;
        setAvailState("error");
        setAvailError(err instanceof Error ? err.message : "Could not check vehicle availability.");
      }
    },
    [vehicleSlug]
  );

  useEffect(() => {
    if (selectedDate && /^\d{4}-\d{2}-\d{2}$/.test(selectedDate)) {
      void loadAvailabilityAndQuote(selectedDate);
    }
  }, [selectedDate, loadAvailabilityAndQuote]);

  useEffect(() => {
    if (
      !rezdyPublishableKey ||
      !stripeLoaded ||
      availState !== "available" ||
      !quote?.quoteParityPassed ||
      !cardMountRef.current ||
      !window.Stripe
    ) {
      return;
    }

    if (!stripeRef.current) {
      stripeRef.current = window.Stripe(rezdyPublishableKey);
    }
    const elements = stripeRef.current.elements();
    const card = elements.create("card", {
      style: {
        base: {
          color: "#ffffff",
          fontFamily: "system-ui, -apple-system, sans-serif",
          fontSize: "16px",
          "::placeholder": { color: "rgba(255,255,255,0.45)" },
        },
      },
    });
    card.mount(cardMountRef.current);
    cardElementRef.current = card;

    return () => {
      card.destroy?.();
      cardElementRef.current = null;
    };
  }, [rezdyPublishableKey, stripeLoaded, availState, quote?.quoteParityPassed]);

  if (useFallbackWidget && allowClassicFallback) {
    return (
      <div>
        <div className="mb-4 flex items-center justify-between rounded-2xl border border-white/14 bg-white/5 px-4 py-3 text-xs text-white/80">
          <span>Showing classic Rezdy booking widget fallback.</span>
          <button
            type="button"
            onClick={() => setUseFallbackWidget(false)}
            className="font-bold text-[#ffb07c] underline hover:text-white"
          >
            Return to Native Preview Checkout
          </button>
        </div>
        <RezdyBookingEmbed {...fallbackEmbedProps} />
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (inFlightLockRef.current || submitStatus === "submitting") return;
    if (!session || !quote?.quoteParityPassed || session.startTimeLocal.slice(0, 10) !== selectedDate) return;

    if (!stripeRef.current || !cardElementRef.current) {
      setSubmitError(
        "Secure payment tokenizer is not ready yet. Please wait a moment or switch to the classic booking widget."
      );
      return;
    }

    inFlightLockRef.current = true;
    setSubmitStatus("submitting");
    setSubmitError(null);

    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
      const tokRes = await stripeRef.current.createToken(cardElementRef.current, {
        name: fullName,
        email: email.trim(),
      });

      if (tokRes.error || !tokRes.token?.id) {
        setSubmitError(tokRes.error?.message || "Please check your card details and try again.");
        setSubmitStatus("idle");
        inFlightLockRef.current = false;
        return;
      }

      const bookRes = await fetch("/api/rezdy/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleSlug,
          sessionId: session.sessionId,
          startTimeLocal: session.startTimeLocal,
          optionLabel: session.optionLabel,
          vehicleQuantity: 1,
          partySize,
          firstName,
          lastName,
          email,
          phone,
          pickupAddress,
          concertAndTripNotes: tripNotes,
          cardToken: tokRes.token.id,
          idempotencyKey: idempotencyKeyRef.current,
        }),
      });

      const bookData = await bookRes.json();
      if (!bookRes.ok || !bookData.ok) {
        if (bookData.code === "SOLD_OUT" || bookData.code === "RECONCILIATION_BLOCKED") {
          setAvailState("sold_out");
          setSession(null);
          setSubmitError("Not available for this show.");
        } else {
          setSubmitError(
            bookData.message ||
              "Your payment could not be completed. No booking was finalized—please check your card or switch to the classic widget."
          );
        }
        setSubmitStatus("idle");
        inFlightLockRef.current = false;
        return;
      }

      const confRes = await fetch(
        `/api/rezdy/confirmation?orderNumber=${encodeURIComponent(bookData.orderNumber)}&ref=${encodeURIComponent(bookData.resellerReference)}&sig=${encodeURIComponent(bookData.confirmationSig)}`,
        { cache: "no-store" }
      );
      const confData = await confRes.json();
      if (confRes.ok && confData.ok && confData.confirmation) {
        setConfirmation(confData.confirmation);
      } else {
        setConfirmation({
          orderNumber: bookData.orderNumber,
          status: bookData.status,
          productName: shortVehicleLabel,
          startTimeLocal: session.startTimeLocal,
          partySize: String(partySize),
          pickupAddress,
          totalPaid: bookData.totalPaid,
        });
      }
      setSubmitStatus("confirmed");
    } catch {
      setSubmitError(
        "A network interruption occurred. Click submit once more to safely check whether your reservation completed (duplicate charges are blocked automatically)."
      );
      setSubmitStatus("idle");
    } finally {
      inFlightLockRef.current = false;
    }
  }

  const activeBase = quote ? quote.itemAmount : basePriceUsd;
  const activeFee = quote ? quote.bookingFeeUsd : expectedBookingFeeUsd;
  const activeTotal = quote ? quote.totalDue : expectedTotalChargedUsd;

  if (submitStatus === "confirmed" && confirmation) {
    return (
      <section
        data-testid="parr-native-confirmation"
        className="rounded-[28px] border border-emerald-400/35 bg-emerald-500/10 p-6 text-white sm:p-8"
      >
        <div className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300">
          Reservation Confirmed · Rezdy Order #{confirmation.orderNumber}
        </div>
        <h3 className="mt-2 text-2xl font-black sm:text-3xl">{confirmation.productName}</h3>
        <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-xl border border-white/12 bg-black/25 p-3">
            <dt className="text-xs uppercase tracking-wider text-white/60">Service Date</dt>
            <dd className="mt-1 font-bold">{confirmation.startTimeLocal.slice(0, 10)}</dd>
          </div>
          <div className="rounded-xl border border-white/12 bg-black/25 p-3">
            <dt className="text-xs uppercase tracking-wider text-white/60">Vehicle &amp; Party Size</dt>
            <dd className="mt-1 font-bold">1 Private Vehicle · {confirmation.partySize || partySize} Guests</dd>
          </div>
          <div className="rounded-xl border border-white/12 bg-black/25 p-3 sm:col-span-2">
            <dt className="text-xs uppercase tracking-wider text-white/60">Pickup Address</dt>
            <dd className="mt-1 font-bold">{confirmation.pickupAddress || pickupAddress}</dd>
          </div>
          <div className="rounded-xl border border-white/12 bg-black/25 p-3 sm:col-span-2">
            <dt className="text-xs uppercase tracking-wider text-white/60">Total Paid Today</dt>
            <dd className="mt-1 text-lg font-black text-emerald-200">${confirmation.totalPaid.toFixed(2)} USD</dd>
          </div>
        </dl>
      </section>
    );
  }

  return (
    <section
      data-testid="parr-native-rezdy-checkout"
      className="rounded-[28px] border border-white/12 bg-[#0d162c] p-5 text-white shadow-2xl sm:p-7"
    >
      {rezdyPublishableKey ? (
        <Script
          src="https://js.stripe.com/v3/"
          strategy="afterInteractive"
          onLoad={() => setStripeLoaded(true)}
        />
      ) : null}

      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="text-[11px] font-black uppercase tracking-[0.2em] text-[#ffb07c]">
            Reserve Your Private Ride · 1 Dedicated Vehicle
          </div>
          <h3 className="mt-1 text-2xl font-black text-white sm:text-3xl">
            ${activeTotal.toFixed(2)} Total — {shortVehicleLabel}
          </h3>
          <p className="mt-1 text-xs text-white/75">
            Includes ${activeBase.toFixed(2)} vehicle rate + ${activeFee.toFixed(2)} Booking fee (4%)
          </p>
        </div>
        {allowClassicFallback ? <button
          type="button"
          data-testid="switch-to-classic-widget-btn"
          onClick={() => setUseFallbackWidget(true)}
          className="rounded-full border border-white/20 bg-white/8 px-4 py-2 text-xs font-bold text-white/85 transition hover:bg-white/15"
        >
          Use Classic Rezdy Widget Fallback
        </button> : null}
      </div>

      {/* Upfront itemized breakdown visible immediately before selecting a date or entering payment */}
      <div
        data-testid="parr-upfront-price-breakdown"
        className="mt-4 rounded-2xl border border-white/16 bg-black/35 p-4"
      >
        <div className="text-xl font-black text-[#ffb07c] sm:text-2xl">
          Total charged today: ${activeTotal.toFixed(2)}
        </div>
        <div className="mt-1.5 space-y-0.5 text-sm text-white/85">
          <div>{shortVehicleLabel}: ${activeBase.toFixed(2)}</div>
          <div>Booking fee (4%): ${activeFee.toFixed(2)}</div>
        </div>
        <div className="mt-2 border-t border-white/12 pt-2 text-xs text-white/70">
          Your complete total is shown before payment.
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-[#8fd0ff]/25 bg-[#8fd0ff]/10 px-4 py-3 text-xs leading-5 text-white/88">
        <strong>Single-Vehicle Checkout:</strong> Reserves <strong>1 private vehicle</strong> (up to {maxPartySize}{" "}
        passengers) with Upper North Lot tailgating chairs, cooler, speaker, ice, and waiting driver. Need 2+ vehicles
        or 11+ passengers?{" "}
        <Link href="/red-rocks/group-transportation" className="font-bold text-[#ffb07c] underline hover:text-white">
          Request Multi-Vehicle Group Transportation →
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-white/80">
            1. Select Concert / Service Date
            <input
              type="date"
              required
              value={selectedDate}
              onChange={(ev) => setSelectedDate(ev.target.value)}
              className="mt-2 w-full rounded-xl border border-white/18 bg-black/35 px-3.5 py-2.5 text-sm font-medium text-white"
            />
          </label>

          <label className="block text-xs font-bold uppercase tracking-wider text-white/80">
            2. Party Size (1–{maxPartySize} Guests · 1 Vehicle)
            <select
              required
              value={partySize}
              onChange={(ev) => setPartySize(Number(ev.target.value))}
              className="mt-2 w-full rounded-xl border border-white/18 bg-black/35 px-3.5 py-2.5 text-sm font-medium text-white"
            >
              {partyOptions.map((n) => (
                <option key={n} value={n} className="bg-[#0b1224] text-white">
                  {n} {n === 1 ? "Guest" : "Guests"} (1 Private Vehicle)
                </option>
              ))}
            </select>
          </label>
        </div>

        {availState === "loading" ? (
          <div className="rounded-xl border border-white/12 bg-white/5 p-4 text-sm text-white/75">
            Checking real-time vehicle inventory and Rezdy quote for {selectedDate}…
          </div>
        ) : null}

        {availState === "sold_out" ? (
          <div
            data-testid="checkout-sold-out-banner"
            role="status"
            className="rounded-xl border border-amber-400/40 bg-amber-500/15 p-4 text-sm text-amber-100"
          >
            <div className="text-base font-black text-white">Not available for this show.</div>
            <p className="mt-1 text-xs leading-5 text-amber-100/90 sm:text-sm">
              {shortVehicleLabel} inventory is not available for <strong>{selectedDate}</strong>. Select another concert date or check whether another private vehicle class is open.
            </p>
          </div>
        ) : null}

        {availState === "error" && availError ? (
          <div className="rounded-xl border border-rose-400/35 bg-rose-500/12 p-4 text-sm text-rose-100">
            {availError}{" "}
            {allowClassicFallback ? <button
              type="button"
              onClick={() => setUseFallbackWidget(true)}
              className="font-bold underline"
            >
              Open classic Rezdy widget
            </button> : <span>Please try again shortly or contact us for help.</span>}
          </div>
        ) : null}

        {availState === "available" && quote && !quote.quoteParityPassed ? (
          <div
            data-testid="quote-parity-hold-banner"
            className="rounded-xl border border-amber-400/40 bg-amber-500/15 p-4 text-sm leading-6 text-amber-100"
          >
            <strong>Quote Parity Hold:</strong> {quote.blockedMessage}
          </div>
        ) : null}

        {availState === "available" && session && quote?.quoteParityPassed ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-white/80">
                First Name
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(ev) => setFirstName(ev.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-white/18 bg-black/35 px-3.5 py-2.5 text-sm text-white"
                />
              </label>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/80">
                Last Name
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(ev) => setLastName(ev.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-white/18 bg-black/35 px-3.5 py-2.5 text-sm text-white"
                />
              </label>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/80">
                Email
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(ev) => setEmail(ev.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-white/18 bg-black/35 px-3.5 py-2.5 text-sm text-white"
                />
              </label>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/80">
                Mobile Phone (Driver Dispatch)
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(ev) => setPhone(ev.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-white/18 bg-black/35 px-3.5 py-2.5 text-sm text-white"
                />
              </label>
            </div>

            <label className="block text-xs font-bold uppercase tracking-wider text-white/80">
              Exact Pickup Address (Denver / Golden / Morrison Hotel, Airbnb, or Home)
              <input
                type="text"
                required
                placeholder="e.g. The Maven Hotel, 1850 Wazee St, Denver, CO"
                value={pickupAddress}
                onChange={(ev) => setPickupAddress(ev.target.value)}
                className="mt-1.5 w-full rounded-xl border border-white/18 bg-black/35 px-3.5 py-2.5 text-sm text-white"
              />
            </label>

            <label className="block text-xs font-bold uppercase tracking-wider text-white/80">
              Concert / Artist &amp; Optional Grocery Stop Notes
              <input
                type="text"
                value={tripNotes}
                onChange={(ev) => setTripNotes(ev.target.value)}
                className="mt-1.5 w-full rounded-xl border border-white/18 bg-black/35 px-3.5 py-2.5 text-sm text-white"
              />
            </label>

            <div
              data-testid="parr-prepayment-price-breakdown"
              className="rounded-2xl border border-white/16 bg-black/35 p-4"
            >
              <div className="text-xl font-black text-[#ffb07c] sm:text-2xl">
                Total charged today: ${quote.totalDue.toFixed(2)}
              </div>
              <div className="mt-1.5 space-y-0.5 text-sm text-white/85">
                <div>{shortVehicleLabel}: ${quote.itemAmount.toFixed(2)}</div>
                <div>Booking fee (4%): ${quote.bookingFeeUsd.toFixed(2)}</div>
              </div>
              <p className="mt-2 border-t border-white/12 pt-2 text-xs text-white/75">
                Your complete total is shown before payment. Round-trip private vehicle with Upper North Lot tailgating gear and on-site waiting driver. Concert tickets and optional driver gratuity excluded.
              </p>
            </div>

            {!rezdyPublishableKey ? (
              <div
                data-testid="missing-stripe-pk-notice"
                className="rounded-xl border border-amber-400/35 bg-amber-500/12 p-4 text-xs leading-5 text-amber-100"
              >
                Secure payment is temporarily unavailable. Please try again shortly or contact us for help.
              </div>
            ) : (
              <div>
                <div className="mb-1.5 text-xs font-bold uppercase tracking-wider text-white/80">
                  Card Details (Encrypted via RezdyPay / Stripe)
                </div>
                <div
                  ref={cardMountRef}
                  className="rounded-xl border border-white/20 bg-black/45 px-4 py-3.5"
                />
              </div>
            )}

            {submitError ? (
              <div className="rounded-xl border border-rose-400/40 bg-rose-500/15 p-3.5 text-xs leading-5 text-rose-100">
                {submitError}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={!rezdyPublishableKey || submitStatus === "submitting" || session?.startTimeLocal.slice(0, 10) !== selectedDate}
              className="w-full rounded-full bg-[#ff6b3d] px-6 py-3.5 text-sm font-black uppercase tracking-[0.14em] text-white shadow-lg transition hover:bg-[#ff7f56] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitStatus === "submitting"
                ? "Confirming Reservation…"
                : `Pay $${quote.totalDue.toFixed(2)} & Reserve ${shortVehicleLabel}`}
            </button>
          </>
        ) : null}
      </form>
    </section>
  );
}
