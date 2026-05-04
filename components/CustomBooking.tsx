'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { packDccTelemetry, readHandoffContext } from '@/lib/handoff/readContext';
import {
  MARRIOTT_WEST_PICKUP_ID,
  isMarriottWestPickup,
} from '@/lib/parr/marriottWestManager';
import { PARR_PUBLIC_FACTS } from '@/lib/publicOperatorFacts';
import { normalizePhoneNumber, PHONE_COUNTRY_OPTIONS, type SupportedPhoneCountry } from '@/lib/phone';
import { SHARED_PRICE_PER_SEAT } from '@/lib/sharedPricing';
import { trackParrEvent } from '@/lib/telemetry';

type SearchParams = Record<string, string | string[] | undefined>;

type Props = {
  venue?: string;
  searchParams?: SearchParams;
  squareAppId: string;
  squareLocationId: string;
  squareSdkUrl: string;
};

type Inventory = {
  available: number;
  capacity: number;
  reserved: number;
  pricePerSeat: number;
  pickupHub: 'denver' | 'golden';
  date: string;
  holdTtlMinutes?: number;
};

type CheckoutState = {
  checkoutSessionId: string;
  checkoutSnapshotToken: string;
  expiresAt: string;
  squareOrderId: string;
};

type PublicPickupOptionId = 'denver' | 'golden' | typeof MARRIOTT_WEST_PICKUP_ID;

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
  if (typeof window === 'undefined') return Promise.reject(new Error('Square SDK requires a browser.'));
  if (window.Square) return Promise.resolve();
  if (squareScriptPromise) return squareScriptPromise;

  squareScriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[data-square-sdk="${src}"]`) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('Failed to load Square SDK.')), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.dataset.squareSdk = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Square SDK.'));
    document.head.appendChild(script);
  });

  return squareScriptPromise;
}

function firstValue(searchParams: SearchParams | undefined, key: string) {
  const value = searchParams?.[key];
  return Array.isArray(value) ? value[0] : value;
}

async function readJsonResponse<T>(response: Response, fallbackMessage: string): Promise<T> {
  const text = await response.text();
  if (!text) {
    if (!response.ok) throw new Error(fallbackMessage);
    return {} as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(fallbackMessage);
  }
}

function isActiveCheckout(checkout: CheckoutState | null) {
  if (!checkout) return false;
  const expiresAt = new Date(checkout.expiresAt).getTime();
  return Number.isFinite(expiresAt) && expiresAt > Date.now() + 5_000;
}

function StepLabel({ step, title }: { step: number; title: string }) {
  return (
    <div className="flex items-center gap-2 text-[15px] font-black uppercase tracking-[0.18em] text-[var(--brand-orange)] sm:text-[16px]">
      <span aria-hidden="true" className="text-lg leading-none text-[var(--brand-orange)] sm:text-xl">*</span>
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

export default function CustomBooking({
  venue = 'red-rocks-amphitheatre',
  searchParams,
  squareAppId,
  squareLocationId,
  squareSdkUrl,
}: Props) {
  const handoffContext = useMemo(
    () => readHandoffContext(searchParams || {}),
    [searchParams],
  );
  const initialDate = firstValue(searchParams, 'date') || '';
  const initialArtist = firstValue(searchParams, 'artist') || '';
  const initialEvent = firstValue(searchParams, 'event') || '';
  const requestedPickupLabel = firstValue(searchParams, 'pickupLabel') || firstValue(searchParams, 'requests') || '';
  const initialPickupOption: PublicPickupOptionId = isMarriottWestPickup(requestedPickupLabel)
    ? MARRIOTT_WEST_PICKUP_ID
    : firstValue(searchParams, 'pickupHub') === 'golden' || firstValue(searchParams, 'city') === 'golden'
      ? 'golden'
      : 'denver';
  const initialQty = Math.max(1, Number(firstValue(searchParams, 'qty')) || 1);

  const [date, setDate] = useState(initialDate);
  const [artist, setArtist] = useState(initialArtist);
  const [pickupOption, setPickupOption] = useState<PublicPickupOptionId>(initialPickupOption);
  const [quantity, setQuantity] = useState(initialQty);
  const [inventory, setInventory] = useState<Inventory | null>(null);
  const [inventoryLoading, setInventoryLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [processingMessage, setProcessingMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [checkoutState, setCheckoutState] = useState<CheckoutState | null>(null);
  const [cardReady, setCardReady] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);
  const cardRef = useRef<SquareCard | null>(null);
  const cardMountedRef = useRef(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneCountry: 'US' as SupportedPhoneCountry,
    phone: '',
    notes: '',
  });
  const pickupHub: 'denver' | 'golden' = pickupOption === 'denver' ? 'denver' : 'golden';
  const pickupFacts = pickupOption === 'denver'
    ? PARR_PUBLIC_FACTS.pickups.denver
    : pickupOption === 'golden'
      ? PARR_PUBLIC_FACTS.pickups.golden
      : PARR_PUBLIC_FACTS.pickups[MARRIOTT_WEST_PICKUP_ID];

  useEffect(() => {
    let active = true;

    async function initSquareCard() {
      try {
        await loadSquareSdk(squareSdkUrl);
        if (!active) return;
        const payments = window.Square?.payments(squareAppId, squareLocationId);
        if (!payments) throw new Error('Square payments unavailable.');
        const card = await payments.card();
        if (!active) return;
        await card.attach('#square-card-container');
        if (!active) {
          await card.destroy?.();
          return;
        }
        cardRef.current = card;
        cardMountedRef.current = true;
        setCardReady(true);
        setCardError(null);
      } catch (err) {
        if (!active) return;
        setCardReady(false);
        setCardError(err instanceof Error ? err.message : 'Failed to load secure card entry.');
      }
    }

    if (!cardMountedRef.current && squareAppId && squareLocationId && squareSdkUrl) {
      void initSquareCard();
    }

    return () => {
      active = false;
    };
  }, [squareAppId, squareLocationId, squareSdkUrl]);

  useEffect(() => {
    if (!date) {
      setInventory(null);
      return;
    }

    const controller = new AbortController();
    setInventoryLoading(true);
    setError(null);

    fetch(`/api/shared/inventory?venue=${encodeURIComponent(venue)}&date=${encodeURIComponent(date)}&pickupHub=${pickupHub}`, {
      signal: controller.signal,
      cache: 'no-store',
    })
      .then(async (res) => {
        const data = await readJsonResponse<{ error?: string } & Inventory>(res, 'Failed to load inventory');
        if (!res.ok) throw new Error(data.error || 'Failed to load inventory');
        return data;
      })
      .then((data) => setInventory(data))
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setError(err.message || 'Failed to load inventory');
        setInventory(null);
      })
      .finally(() => setInventoryLoading(false));

    return () => controller.abort();
  }, [date, pickupHub, venue]);

  const totalLabel = useMemo(() => {
    const price = inventory?.pricePerSeat ?? SHARED_PRICE_PER_SEAT;
    return `$${price * quantity}`;
  }, [inventory, quantity]);

  const inventoryTone = inventory && inventory.available <= 6
    ? 'border-amber-400/35 bg-amber-500/10 text-amber-50'
    : 'border-emerald-400/30 bg-emerald-500/10 text-emerald-50';

  const event = initialEvent && date === initialDate && artist === initialArtist ? initialEvent : '';

  async function handleSubmit() {
    const normalizedPhone = normalizePhoneNumber(formData.phone, formData.phoneCountry);
    if (!normalizedPhone) {
      setError('Enter a valid phone number with the correct country.');
      return;
    }
    if (!cardRef.current || !cardReady) {
      setError(cardError || 'Secure card entry is still loading.');
      return;
    }

    setSubmitting(true);
    setProcessingMessage('We are starting your secure checkout...');
    setError(null);

    try {
      let activeCheckout = isActiveCheckout(checkoutState) ? checkoutState : null;

      if (!activeCheckout) {
        const checkoutRes = await fetch('/api/shared/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            venue,
            date,
            pickupHub,
            pickupLabel: pickupFacts.name,
            qty: quantity,
            artist,
            event,
            notes: formData.notes,
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

        const checkoutData = await readJsonResponse<{
          error?: string;
          checkoutSessionId: string;
          checkoutSnapshotToken?: string;
          expiresAt: string;
          squareOrderId: string;
          availableAfterHold: number;
        }>(checkoutRes, 'Failed to start checkout');
        if (!checkoutRes.ok) throw new Error(checkoutData.error || 'Failed to start checkout');

        activeCheckout = {
          checkoutSessionId: checkoutData.checkoutSessionId,
          checkoutSnapshotToken: checkoutData.checkoutSnapshotToken || '',
          expiresAt: checkoutData.expiresAt,
          squareOrderId: checkoutData.squareOrderId,
        };
        trackParrEvent('checkout_started', {
          corridor: 'parr',
          page_type: 'shared_checkout',
          ...packDccTelemetry(handoffContext),
          source_page: window.location.pathname,
          target_path: `/book/${venue}/custom/shared`,
          venue,
          pickup_hub: pickupHub,
          pickup_label: pickupFacts.name,
          qty: quantity,
          date,
          artist,
          event,
          decision_corridor: handoffContext.decisionCorridor || 'red-rocks-transport',
          decision_action: handoffContext.decisionAction || 'book_shared_red_rocks_shuttle',
          decision_option: handoffContext.decisionOption || 'shuttle',
          decision_product: handoffContext.decisionProduct || 'shared-red-rocks-shuttle-seat',
          product_slug: handoffContext.productSlug || 'shared-red-rocks-shuttle-seat',
        });
        setCheckoutState(activeCheckout);
        setInventory((current) => current ? { ...current, available: checkoutData.availableAfterHold, reserved: current.capacity - checkoutData.availableAfterHold } : current);
      }

      setProcessingMessage('We are verifying your card details...');

      const tokenResult = await cardRef.current.tokenize();
      if (tokenResult.status !== 'OK' || !tokenResult.token) {
        const cardMessage = tokenResult.errors?.[0]?.message || 'Card details could not be verified.';
        throw new Error(cardMessage);
      }

      setProcessingMessage('We are processing your payment...');

      const paymentRes = await fetch('/api/shared/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          checkoutSessionId: activeCheckout.checkoutSessionId,
          checkoutSnapshotToken: activeCheckout.checkoutSnapshotToken,
          squareOrderId: activeCheckout.squareOrderId,
          sourceId: tokenResult.token,
          dccHandoffId: firstValue(searchParams, 'dcc_handoff_id') || '',
        }),
      });

      const paymentData = await readJsonResponse<{ error?: string; successUrl: string }>(paymentRes, 'Failed to process payment');
      if (paymentRes.status === 404) {
        setCheckoutState(null);
        throw new Error('We could not find that checkout hold. Click Pay again to start a fresh order.');
      }
      if (!paymentRes.ok) throw new Error(paymentData.error || 'Failed to process payment');

      window.location.href = paymentData.successUrl;
      return;
    } catch (err) {
      setProcessingMessage(null);
      setError(err instanceof Error ? err.message : 'Failed to process payment');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6 sm:pb-8">
      <section className="rounded-[26px] border border-white/10 bg-[#09101f] p-5 sm:p-6">
        <StepLabel step={1} title="Choose Pickup" />
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {([
            {
              id: 'denver' as const,
              label: 'Downtown',
              detail: PARR_PUBLIC_FACTS.pickups.denver.shortLabel,
              copy: 'Best default for most Denver riders.',
              recommended: true,
            },
            {
              id: 'golden' as const,
              label: PARR_PUBLIC_FACTS.pickups.golden.cityLabel,
              detail: PARR_PUBLIC_FACTS.pickups.golden.shortLabel,
              copy: 'Best for west-side riders.',
              recommended: false,
            },
            {
              id: MARRIOTT_WEST_PICKUP_ID,
              label: PARR_PUBLIC_FACTS.pickups[MARRIOTT_WEST_PICKUP_ID].cityLabel,
              detail: PARR_PUBLIC_FACTS.pickups[MARRIOTT_WEST_PICKUP_ID].shortLabel,
              copy: 'Best for Marriott West hotel guests.',
              recommended: false,
            },
          ] satisfies Array<{ id: PublicPickupOptionId; label: string; detail: string; copy: string; recommended: boolean }>).map((option) => {
            const active = pickupOption === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setPickupOption(option.id)}
                className={`rounded-[26px] border px-5 py-5 text-left transition ${active ? 'border-[#ffb07c]/50 bg-[#2a1a12] text-white shadow-[0_0_0_1px_rgba(255,176,124,0.16)]' : option.recommended ? 'border-[#8fd0ff]/28 bg-[#8fd0ff]/10 text-white hover:border-[#8fd0ff]/40 hover:bg-[#8fd0ff]/14' : 'border-white/12 bg-black/20 text-white/76 hover:border-white/24 hover:text-white'}`}
              >
                <div className="flex h-full flex-col">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className={`flex h-5 w-5 items-center justify-center rounded-full border ${active ? 'border-[#ffb07c] bg-[#ffb07c]/18' : option.recommended ? 'border-[#8fd0ff]/55 bg-[#8fd0ff]/12' : 'border-white/24'}`}>
                        <span className={`h-2.5 w-2.5 rounded-full ${active ? 'bg-[#ffb07c]' : option.recommended ? 'bg-[#8fd0ff]/80' : 'bg-transparent'}`} />
                      </span>
                      <div className="text-sm font-black uppercase tracking-[0.14em]">{option.label}</div>
                    </div>
                    {option.recommended ? (
                      <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] ${active ? 'bg-[#ffb07c]/14 text-[#ffd7bf]' : 'bg-[#8fd0ff]/16 text-[#b7e3ff]'}`}>
                        Recommended
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-2 text-sm font-semibold text-white/72">{option.detail}</div>
                  <p className="mt-3 text-sm leading-6 text-white/72">{option.copy}</p>
                  <div className={`mt-4 inline-flex min-h-11 items-center justify-center rounded-full px-5 text-xs font-black uppercase tracking-[0.16em] ${active ? 'bg-[#ffb07c] text-[#1a0d07]' : 'border border-white/12 bg-white/6 text-white/78'}`}>
                    {active ? 'Selected' : 'Choose'}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-[26px] border border-white/10 bg-[#09101f] p-5 sm:p-6">
        <StepLabel step={2} title="Check Live Availability" />
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <label className="space-y-2 text-sm text-white/74">
            <span className="text-[12px] font-black uppercase tracking-[0.18em] sm:text-[13px] text-white/54">Date</span>
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="w-full rounded-[20px] border border-white/12 bg-[#0d1629] px-4 py-3 text-white outline-none transition focus:border-[#8fd0ff]"
            />
          </label>
          <label className="space-y-2 text-sm text-white/74">
            <span className="text-[12px] font-black uppercase tracking-[0.18em] sm:text-[13px] text-white/54">Artist or Event</span>
            <input
              type="text"
              value={artist}
              onChange={(event) => setArtist(event.target.value)}
              placeholder="Optional, but helpful for your ride plan"
              className="w-full rounded-[20px] border border-white/12 bg-[#0d1629] px-4 py-3 text-white outline-none transition focus:border-[#8fd0ff]"
            />
          </label>
        </div>

        {date ? (
          <div className={`mt-5 rounded-[20px] border px-4 py-4 ${inventoryTone}`}>
            {inventoryLoading ? (
              <div className="text-sm">Checking live seat count...</div>
            ) : inventory ? (
              <div className="space-y-2 text-sm">
                <div className="text-[12px] font-black uppercase tracking-[0.18em] sm:text-[13px] text-current/80">Live Availability</div>
                <div>
                  {inventory.available <= 6 ? 'Only' : ''} <span className="font-black text-white">{inventory.available}</span> seat{inventory.available === 1 ? '' : 's'} available
                </div>
                <div className="text-white/72">
                  {pickupFacts.cityLabel} pickup · ${inventory.pricePerSeat}/seat flat rate · {inventory.holdTtlMinutes || 20} minute checkout hold
                </div>
              </div>
            ) : (
              <div className="text-sm text-rose-100">Unable to load live seat count for that date.</div>
            )}
          </div>
        ) : null}
      </section>

      <section className="rounded-[26px] border border-white/10 bg-[#09101f] p-5 sm:p-6">
        <StepLabel step={3} title="Lock Your Seats" />
        <div className="mt-4 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <label className="space-y-2 text-sm text-white/74">
            <span className="text-[12px] font-black uppercase tracking-[0.18em] sm:text-[13px] text-white/54">Number of seats</span>
            <select
              value={quantity}
              onChange={(event) => setQuantity(Number(event.target.value))}
              className="w-full rounded-[18px] border border-white/12 bg-[#0d1629] px-4 py-3 text-white outline-none transition focus:border-[#8fd0ff]"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((count) => <option key={count} value={count}>{count} seat{count === 1 ? '' : 's'}</option>)}
            </select>
          </label>
          <div className="rounded-[18px] border border-white/10 bg-black/20 px-4 py-4 text-sm text-white/82">
            <div className="text-[12px] font-black uppercase tracking-[0.18em] sm:text-[13px] text-white/52">Trip total</div>
            <div className="mt-2 text-lg font-black text-white">${inventory?.pricePerSeat ?? SHARED_PRICE_PER_SEAT} x {quantity} = {totalLabel}</div>
            <div className="mt-2 text-sm text-white/62">Your return ride is included in this total.</div>
          </div>
        </div>
      </section>

      <section className="rounded-[26px] border border-white/10 bg-[#09101f] p-5 sm:p-6">
        <StepLabel step={4} title="Rider Details" />
        <div className="mt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <input type="text" name="firstName" autoComplete="given-name" value={formData.firstName} placeholder="First name" onChange={(event) => setFormData({ ...formData, firstName: event.target.value })} className="rounded-[18px] border border-white/12 bg-[#0d1629] px-4 py-3 text-white outline-none transition focus:border-[#8fd0ff]" />
            <input type="text" name="lastName" autoComplete="family-name" value={formData.lastName} placeholder="Last name" onChange={(event) => setFormData({ ...formData, lastName: event.target.value })} className="rounded-[18px] border border-white/12 bg-[#0d1629] px-4 py-3 text-white outline-none transition focus:border-[#8fd0ff]" />
          </div>
          <div className="grid gap-4 sm:grid-cols-[0.95fr_1.05fr]">
            <input type="email" name="email" autoComplete="email" value={formData.email} placeholder="Email" onChange={(event) => setFormData({ ...formData, email: event.target.value })} className="rounded-[18px] border border-white/12 bg-[#0d1629] px-4 py-3 text-white outline-none transition focus:border-[#8fd0ff]" />
            <div className="grid gap-3 sm:grid-cols-[0.72fr_1.28fr]">
              <select
                name="phoneCountry"
                autoComplete="tel-country-code"
                value={formData.phoneCountry}
                onChange={(event) => setFormData({ ...formData, phoneCountry: event.target.value as SupportedPhoneCountry })}
                className="rounded-[18px] border border-white/12 bg-[#0d1629] px-4 py-3 text-white outline-none transition focus:border-[#8fd0ff]"
                aria-label="Phone country"
              >
                {PHONE_COUNTRY_OPTIONS.map((option) => (
                  <option key={option.code} value={option.code}>{option.code}</option>
                ))}
              </select>
              <input
                type="tel"
                name="phone"
                autoComplete="tel"
                inputMode="tel"
                value={formData.phone}
                placeholder={PHONE_COUNTRY_OPTIONS.find((option) => option.code === formData.phoneCountry)?.example || 'Phone'}
                onChange={(event) => setFormData({ ...formData, phone: event.target.value })}
                className="rounded-[18px] border border-white/12 bg-[#0d1629] px-4 py-3 text-white outline-none transition focus:border-[#8fd0ff]"
              />
            </div>
          </div>
          <p className="text-xs text-white/52">Enter the number the way you normally would. We’ll format it correctly for checkout.</p>
          <textarea value={formData.notes} placeholder="Pickup notes, hotel, or group details" onChange={(event) => setFormData({ ...formData, notes: event.target.value })} rows={4} className="w-full rounded-[18px] border border-white/12 bg-[#0d1629] px-4 py-3 text-white outline-none transition focus:border-[#8fd0ff]" />
        </div>
      </section>

      <section className="rounded-[26px] border border-white/10 bg-[#09101f] p-5 sm:p-6">
        <StepLabel step={5} title="Secure Checkout" />
        <div className="mt-4 space-y-4">
          <div className="rounded-[20px] border border-white/10 bg-[#0d1629] px-4 py-4">
            <div id="square-card-container" className="min-h-16" />
          </div>
          <p className="text-xs text-white/52">Secure card entry is powered by Square and stays on Party at Red Rocks.</p>
          {cardError ? <div className="rounded-[18px] border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">{cardError}</div> : null}
          {!cardError && !cardReady ? <div className="rounded-[18px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/72">Loading secure card entry...</div> : null}
        </div>
      </section>

      {processingMessage ? <ProcessingNotice message={processingMessage} /> : null}
      {error ? <div className="rounded-[18px] border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">{error}</div> : null}
      {checkoutState ? (
        <div className="rounded-[18px] border border-emerald-400/30 bg-emerald-500/10 px-4 py-4 text-sm text-white/88">
          <div className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-200">Checkout hold active</div>
          <div className="mt-2">Session: <span className="font-black text-white">{checkoutState.checkoutSessionId}</span></div>
          <div>Hold expires: <span className="font-black text-white">{new Date(checkoutState.expiresAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span></div>
          <div className="mt-2 text-white/72">If card validation fails, fix the field and click Pay again. This same hold will be reused until it expires.</div>
        </div>
      ) : null}

      <div>
        <button
          type="button"
          disabled={submitting || !cardReady || !date || !inventory || inventory.available < quantity}
          onClick={handleSubmit}
          className={`flex min-h-14 w-full items-center justify-center rounded-full px-6 text-sm font-black uppercase tracking-[0.16em] transition ${submitting || !cardReady || !date || !inventory || inventory.available < quantity ? 'cursor-not-allowed bg-white/10 text-white/45' : 'bg-[#3df3ff] text-[#07111d] hover:bg-[#62f6ff]'}`}
        >
          {submitting ? 'We are processing your payment...' : `Lock In Ride For ${totalLabel}`}
        </button>
      </div>
    </div>
  );
}
