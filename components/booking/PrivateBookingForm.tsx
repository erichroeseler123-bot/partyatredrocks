"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PHONE_COUNTRY_OPTIONS, normalizePhoneNumber, type SupportedPhoneCountry } from "@/lib/phone";

type SearchParams = Record<string, string | string[] | undefined>;

type PrivateRideOptionForm = {
  slug: string;
  title: string;
  priceLabel: string;
  body: string;
  eyebrow?: string;
};

type Props = {
  venue: string;
  option: PrivateRideOptionForm;
  searchParams?: SearchParams;
  sourcePath: string;
  squareAppId: string;
  squareLocationId: string;
  squareSdkUrl: string;
};

type SubmitState = {
  loading: boolean;
  error: string | null;
};

type CheckoutState = {
  internalOrderId: string;
  bookingToken: string;
  squareOrderId: string;
  totalDue: number;
};

type SquareCard = {
  attach: (selector: string) => Promise<void>;
  tokenize: () => Promise<{ status: string; token?: string; errors?: Array<{ message?: string }> }>;
  destroy?: () => Promise<void> | void;
};

declare global {
  interface Window {
    Square?: {
      payments: (appId: string, locationId: string) => {
        card: () => Promise<SquareCard>;
      };
    };
  }
}

let squareScriptPromise: Promise<void> | null = null;

function loadSquareSdk(src: string) {
  if (typeof window === "undefined") return Promise.reject(new Error("Square SDK requires a browser."));
  if (window.Square) return Promise.resolve();
  if (squareScriptPromise) return squareScriptPromise;

  squareScriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[data-square-sdk="${src}"]`) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Failed to load Square SDK.")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.dataset.squareSdk = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Square SDK."));
    document.head.appendChild(script);
  });

  return squareScriptPromise;
}

function firstValue(searchParams: SearchParams | undefined, key: string) {
  const value = searchParams?.[key];
  return Array.isArray(value) ? value[0] : value;
}

function StepLabel({ step, title }: { step: number; title: string }) {
  return (
    <div className="flex items-center gap-2 text-[15px] font-black uppercase tracking-[0.18em] text-[#ffb07c] sm:text-[16px]">
      <span aria-hidden="true" className="text-lg leading-none text-[#ffb07c] sm:text-xl">
        *
      </span>
      <span>{`Step ${step} - ${title}`}</span>
    </div>
  );
}

function ProcessingNotice({ message }: { message: string }) {
  return (
    <div className="rounded-[20px] border border-cyan-300/30 bg-cyan-400/10 px-4 py-4 text-sm text-cyan-50">
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-1" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-cyan-200 animate-pulse" />
          <span className="h-2.5 w-2.5 rounded-full bg-cyan-200 animate-pulse [animation-delay:150ms]" />
          <span className="h-2.5 w-2.5 rounded-full bg-cyan-200 animate-pulse [animation-delay:300ms]" />
        </span>
        <div>
          <div className="text-[11px] font-black uppercase tracking-[0.18em] text-cyan-100/80">Processing</div>
          <div className="mt-1 font-semibold text-white">{message}</div>
        </div>
      </div>
    </div>
  );
}

export function PrivateBookingForm({
  venue,
  option,
  searchParams,
  sourcePath,
  squareAppId,
  squareLocationId,
  squareSdkUrl,
}: Props) {
  const initialDate = firstValue(searchParams, "date") || "";
  const initialArtist = firstValue(searchParams, "artist") || "";
  const initialQty = Math.max(1, Number(firstValue(searchParams, "qty")) || 1);

  const [date, setDate] = useState(initialDate);
  const [artist, setArtist] = useState(initialArtist);
  const [vehicleQty, setVehicleQty] = useState(initialQty);
  const [guestCount, setGuestCount] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>({ loading: false, error: null });
  const [processingMessage, setProcessingMessage] = useState<string | null>(null);
  const [checkoutState, setCheckoutState] = useState<CheckoutState | null>(null);
  const [cardReady, setCardReady] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);
  const cardRef = useRef<SquareCard | null>(null);
  const cardMountedRef = useRef(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneCountry: "US" as SupportedPhoneCountry,
    phone: "",
    notes: "",
  });

  useEffect(() => {
    let active = true;

    async function initSquareCard() {
      try {
        await loadSquareSdk(squareSdkUrl);
        if (!active) return;
        const payments = window.Square?.payments(squareAppId, squareLocationId);
        if (!payments) throw new Error("Square payments unavailable.");
        const card = await payments.card();
        if (!active) return;
        await card.attach("#private-square-card-container");
        if (!active) {
          await card.destroy?.();
          return;
        }
        cardRef.current = card;
        cardMountedRef.current = true;
        setCardReady(true);
        setCardError(null);
      } catch (error) {
        if (!active) return;
        setCardReady(false);
        setCardError(error instanceof Error ? error.message : "Failed to load secure card entry.");
      }
    }

    if (!cardMountedRef.current && squareAppId && squareLocationId && squareSdkUrl) {
      void initSquareCard();
    }

    return () => {
      active = false;
    };
  }, [squareAppId, squareLocationId, squareSdkUrl]);

  const estimatedTotalLabel = useMemo(() => {
    const price = Number(option.priceLabel.replace(/[^0-9.]/g, ""));
    if (!Number.isFinite(price) || price <= 0) return option.priceLabel;
    return `$${price * vehicleQty}`;
  }, [option.priceLabel, vehicleQty]);

  async function handleSubmit() {
    if (!pickupAddress.trim()) {
      setSubmitState({ loading: false, error: "Enter your pickup address or hotel for the private ride." });
      return;
    }

    const normalizedPhone = normalizePhoneNumber(formData.phone, formData.phoneCountry);
    if (!normalizedPhone) {
      setSubmitState({ loading: false, error: "Enter a valid phone number with the correct country." });
      return;
    }
    if (!cardRef.current || !cardReady) {
      setSubmitState({ loading: false, error: cardError || "Secure card entry is still loading." });
      return;
    }

    setSubmitState({ loading: true, error: null });

    try {
      setProcessingMessage("We are starting your secure private checkout...");

      let activeCheckout = checkoutState;
      if (!activeCheckout) {
        const response = await fetch("/api/private/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            venue,
            option: option.slug,
            qty: vehicleQty,
            date,
            artist,
            guestCount: guestCount ? Number(guestCount) : null,
            pickupAddress,
            notes: formData.notes,
            sourcePath,
            searchParams,
            customer: {
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
              phone: formData.phone,
              phoneCountry: formData.phoneCountry,
            },
          }),
        });

        const data = (await response.json().catch(() => null)) as
          | { error?: string; internalOrderId?: string; bookingToken?: string; squareOrderId?: string; totalDue?: number }
          | null;
        if (
          !response.ok ||
          !data?.internalOrderId ||
          !data?.bookingToken ||
          !data?.squareOrderId ||
          typeof data.totalDue !== "number" ||
          !Number.isFinite(data.totalDue) ||
          data.totalDue <= 0
        ) {
          throw new Error(data?.error || "Unable to start private checkout.");
        }

        activeCheckout = {
          internalOrderId: data.internalOrderId,
          bookingToken: data.bookingToken,
          squareOrderId: data.squareOrderId,
          totalDue: data.totalDue,
        };
        setCheckoutState(activeCheckout);
      }

      setProcessingMessage("We are verifying your card details...");

      const tokenResult = await cardRef.current.tokenize();
      if (tokenResult.status !== "OK" || !tokenResult.token) {
        throw new Error(tokenResult.errors?.[0]?.message || "Card details could not be verified.");
      }

      setProcessingMessage("We are processing your payment...");

      const paymentResponse = await fetch("/api/private/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          internalOrderId: activeCheckout.internalOrderId,
          bookingToken: activeCheckout.bookingToken,
          squareOrderId: activeCheckout.squareOrderId,
          totalDue: activeCheckout.totalDue,
          sourceId: tokenResult.token,
          dccHandoffId: firstValue(searchParams, "dcc_handoff_id") || "",
        }),
      });

      const paymentData = (await paymentResponse.json().catch(() => null)) as { error?: string; successUrl?: string } | null;
      if (!paymentResponse.ok || !paymentData?.successUrl) {
        throw new Error(paymentData?.error || "Unable to process payment.");
      }

      window.location.href = paymentData.successUrl;
    } catch (error) {
      setProcessingMessage(null);
      setSubmitState({
        loading: false,
        error: error instanceof Error ? error.message : "Unable to process payment.",
      });
      return;
    }

    setSubmitState({ loading: false, error: null });
  }

  return (
    <div className="space-y-6 sm:pb-8">
      <section className="rounded-[26px] border border-white/10 bg-[#09101f] p-5 sm:p-6">
        <StepLabel step={1} title="Show Details" />
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <label className="space-y-2 text-sm text-white/74">
            <span className="text-[12px] font-black uppercase tracking-[0.18em] text-white/54 sm:text-[13px]">Show date</span>
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="w-full rounded-[20px] border border-white/12 bg-[#0d1629] px-4 py-3 text-white outline-none transition focus:border-[#ffb07c]"
            />
          </label>
          <label className="space-y-2 text-sm text-white/74">
            <span className="text-[12px] font-black uppercase tracking-[0.18em] text-white/54 sm:text-[13px]">Artist or event</span>
            <input
              type="text"
              value={artist}
              onChange={(event) => setArtist(event.target.value)}
              placeholder="Optional, but helpful for operations"
              className="w-full rounded-[20px] border border-white/12 bg-[#0d1629] px-4 py-3 text-white outline-none transition focus:border-[#ffb07c]"
            />
          </label>
        </div>
      </section>

      <section className="rounded-[26px] border border-white/10 bg-[#09101f] p-5 sm:p-6">
        <StepLabel step={2} title="Vehicle Plan" />
        <div className="mt-4 grid gap-4 lg:grid-cols-[0.9fr_0.9fr_1.2fr]">
          <label className="space-y-2 text-sm text-white/74">
            <span className="text-[12px] font-black uppercase tracking-[0.18em] text-white/54 sm:text-[13px]">Vehicles</span>
            <select
              value={vehicleQty}
              onChange={(event) => setVehicleQty(Number(event.target.value))}
              className="w-full rounded-[18px] border border-white/12 bg-[#0d1629] px-4 py-3 text-white outline-none transition focus:border-[#ffb07c]"
            >
              {[1, 2, 3, 4].map((count) => (
                <option key={count} value={count}>
                  {count} {option.title}
                  {count === 1 ? "" : "s"}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2 text-sm text-white/74">
            <span className="text-[12px] font-black uppercase tracking-[0.18em] text-white/54 sm:text-[13px]">Guests</span>
            <input
              type="number"
              min={1}
              value={guestCount}
              onChange={(event) => setGuestCount(event.target.value)}
              placeholder="How many people?"
              className="w-full rounded-[18px] border border-white/12 bg-[#0d1629] px-4 py-3 text-white outline-none transition focus:border-[#ffb07c]"
            />
          </label>
          <div className="rounded-[18px] border border-white/10 bg-black/20 px-4 py-4 text-sm text-white/82">
            <div className="text-[12px] font-black uppercase tracking-[0.18em] text-white/52 sm:text-[13px]">Estimated total</div>
            <div className="mt-2 text-lg font-black text-white">
              {option.priceLabel} x {vehicleQty} = {estimatedTotalLabel}
            </div>
            <div className="mt-2 text-white/64">Fixed vehicle pricing. Total shown here is before tax.</div>
          </div>
        </div>
      </section>

      <section className="rounded-[26px] border border-white/10 bg-[#09101f] p-5 sm:p-6">
        <StepLabel step={3} title="Pickup Plan" />
        <div className="mt-4 space-y-4">
          <div className="rounded-[18px] border border-cyan-300/24 bg-cyan-400/10 px-4 py-4 text-sm leading-6 text-cyan-50/92">
            Private rides do not use the shared Sheraton pickup. Enter the exact hotel, Airbnb, or street address where your group should be picked up.
          </div>
          <label className="space-y-2 text-sm text-white/74">
            <span className="text-[12px] font-black uppercase tracking-[0.18em] text-white/54 sm:text-[13px]">Pickup address or hotel</span>
            <input
              type="text"
              value={pickupAddress}
              onChange={(event) => setPickupAddress(event.target.value)}
              placeholder="Required: hotel, Airbnb, condo, or exact street address"
              className="w-full rounded-[18px] border border-white/12 bg-[#0d1629] px-4 py-3 text-white outline-none transition focus:border-[#ffb07c]"
            />
          </label>
          <textarea
            value={formData.notes}
            placeholder="Tailgate stop, split pickup, return timing, accessibility needs, or anything the dispatcher should know."
            onChange={(event) => setFormData({ ...formData, notes: event.target.value })}
            rows={4}
            className="w-full rounded-[18px] border border-white/12 bg-[#0d1629] px-4 py-3 text-white outline-none transition focus:border-[#ffb07c]"
          />
        </div>
      </section>

      <section className="rounded-[26px] border border-white/10 bg-[#09101f] p-5 sm:p-6">
        <StepLabel step={4} title="Your Info" />
        <div className="mt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="text"
              name="firstName"
              autoComplete="given-name"
              value={formData.firstName}
              placeholder="First name"
              onChange={(event) => setFormData({ ...formData, firstName: event.target.value })}
              className="rounded-[18px] border border-white/12 bg-[#0d1629] px-4 py-3 text-white outline-none transition focus:border-[#ffb07c]"
            />
            <input
              type="text"
              name="lastName"
              autoComplete="family-name"
              value={formData.lastName}
              placeholder="Last name"
              onChange={(event) => setFormData({ ...formData, lastName: event.target.value })}
              className="rounded-[18px] border border-white/12 bg-[#0d1629] px-4 py-3 text-white outline-none transition focus:border-[#ffb07c]"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-[0.95fr_1.05fr]">
            <input
              type="email"
              name="email"
              autoComplete="email"
              value={formData.email}
              placeholder="Email"
              onChange={(event) => setFormData({ ...formData, email: event.target.value })}
              className="rounded-[18px] border border-white/12 bg-[#0d1629] px-4 py-3 text-white outline-none transition focus:border-[#ffb07c]"
            />
            <div className="grid gap-3 sm:grid-cols-[0.72fr_1.28fr]">
              <select
                name="phoneCountry"
                autoComplete="tel-country-code"
                value={formData.phoneCountry}
                onChange={(event) => setFormData({ ...formData, phoneCountry: event.target.value as SupportedPhoneCountry })}
                className="rounded-[18px] border border-white/12 bg-[#0d1629] px-4 py-3 text-white outline-none transition focus:border-[#ffb07c]"
                aria-label="Phone country"
              >
                {PHONE_COUNTRY_OPTIONS.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.code}
                  </option>
                ))}
              </select>
              <input
                type="tel"
                name="phone"
                autoComplete="tel"
                inputMode="tel"
                value={formData.phone}
                placeholder={PHONE_COUNTRY_OPTIONS.find((country) => country.code === formData.phoneCountry)?.example || "Phone"}
                onChange={(event) => setFormData({ ...formData, phone: event.target.value })}
                className="rounded-[18px] border border-white/12 bg-[#0d1629] px-4 py-3 text-white outline-none transition focus:border-[#ffb07c]"
              />
            </div>
          </div>
          <p className="text-xs text-white/52">Enter the number the way you normally would. We’ll format it correctly for checkout.</p>
        </div>
      </section>

      <section className="rounded-[26px] border border-white/10 bg-[#09101f] p-5 sm:p-6">
        <StepLabel step={5} title="Payment" />
        <div className="mt-4 space-y-4">
          <div className="rounded-[20px] border border-white/10 bg-[#0d1629] px-4 py-4">
            <div id="private-square-card-container" className="min-h-16" />
          </div>
          <p className="text-xs text-white/52">Secure card entry is powered by Square and stays on Party at Red Rocks.</p>
          {cardError ? <div className="rounded-[18px] border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">{cardError}</div> : null}
          {!cardError && !cardReady ? <div className="rounded-[18px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/72">Loading secure card entry...</div> : null}
        </div>
      </section>

      {processingMessage ? <ProcessingNotice message={processingMessage} /> : null}
      {submitState.error ? <div className="rounded-[18px] border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">{submitState.error}</div> : null}
      {checkoutState ? (
        <div className="rounded-[18px] border border-emerald-400/30 bg-emerald-500/10 px-4 py-4 text-sm text-white/88">
          <div className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-200">Private checkout active</div>
          <div className="mt-2">Order: <span className="font-black text-white">{checkoutState.internalOrderId}</span></div>
          <div className="mt-2 text-white/72">If card validation fails, fix the field and click pay again. This checkout stays on Party at Red Rocks.</div>
        </div>
      ) : null}

      <div>
        <button
          type="button"
          disabled={submitState.loading || !cardReady || !date}
          onClick={handleSubmit}
          className={`flex min-h-14 w-full items-center justify-center rounded-full px-6 text-sm font-black uppercase tracking-[0.16em] transition ${submitState.loading || !cardReady || !date ? "cursor-not-allowed bg-white/10 text-white/45" : "bg-[#ffb07c] text-[#07111d] hover:bg-[#ffc298]"}`}
        >
          {submitState.loading ? "We are processing your payment..." : `Pay ${estimatedTotalLabel} on this site`}
        </button>
      </div>
    </div>
  );
}
