'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type Props = {
  internalOrderId: string;
  initialStatus?: StatusPayload | null;
};

type StatusPayload = {
  ok?: boolean;
  order?: {
    internalOrderId: string;
    bookingToken?: string | null;
    booking?: Record<string, unknown> | null;
    payment?: Record<string, unknown> | null;
  } | null;
  hold?: {
    status?: string | null;
    pickupHub?: string | null;
    date?: string | null;
    qty?: number | null;
  } | null;
  error?: string;
};

const POLL_MS = 2500;
const MAX_POLL_MS = 30000;

function readStatus(value: unknown) {
  return typeof value === 'string' ? value : '';
}

function isConfirmedStatus(status: StatusPayload | null | undefined) {
  const paymentStatus = readStatus(status?.order?.payment?.status);
  const bookingStatus = readStatus(status?.order?.booking?.status);
  return paymentStatus === 'paid' && bookingStatus === 'confirmed';
}

export default function SharedCheckoutStatus({ internalOrderId, initialStatus = null }: Props) {
  const [status, setStatus] = useState<StatusPayload | null>(initialStatus);
  const [loading, setLoading] = useState(!initialStatus && Boolean(internalOrderId));
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    setStatus(initialStatus);
    setLoading(!initialStatus && Boolean(internalOrderId));
    setTimedOut(false);
  }, [initialStatus, internalOrderId]);

  useEffect(() => {
    if (!internalOrderId) {
      setLoading(false);
      setStatus({ error: 'Missing internal order ID' });
      return;
    }

    let cancelled = false;
    let intervalId: number | null = null;
    let timeoutId: number | null = null;

    const load = async () => {
      try {
        const res = await fetch(`/api/internal/orders/${encodeURIComponent(internalOrderId)}`, {
          cache: 'no-store',
        });
        const data = (await res.json()) as StatusPayload;
        if (cancelled) return;

        setStatus(data);
        setLoading(false);

        if (isConfirmedStatus(data)) {
          if (intervalId) window.clearInterval(intervalId);
          if (timeoutId) window.clearTimeout(timeoutId);
        }
      } catch {
        if (cancelled) return;
        setLoading(false);
        setStatus((current) => current ?? { error: 'Failed to load checkout status' });
      }
    };

    if (!initialStatus) {
      void load();
    } else {
      setLoading(false);
      if (isConfirmedStatus(initialStatus)) {
        return () => {
          cancelled = true;
        };
      }
    }

    intervalId = window.setInterval(() => {
      void load();
    }, POLL_MS);
    timeoutId = window.setTimeout(() => {
      if (cancelled) return;
      setTimedOut(true);
      if (intervalId) window.clearInterval(intervalId);
    }, MAX_POLL_MS);

    const onVisible = () => {
      if (document.visibilityState === 'visible') void load();
    };

    document.addEventListener('visibilitychange', onVisible);

    return () => {
      cancelled = true;
      if (intervalId) window.clearInterval(intervalId);
      if (timeoutId) window.clearTimeout(timeoutId);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [initialStatus, internalOrderId]);

  const paymentStatus = readStatus(status?.order?.payment?.status) || 'unpaid';
  const bookingStatus = readStatus(status?.order?.booking?.status) || 'pending_payment';
  const isConfirmed = paymentStatus === 'paid' && bookingStatus === 'confirmed';
  const isProcessing = !isConfirmed && !timedOut;
  const bookingLabel = isConfirmed ? 'confirmed' : isProcessing ? 'processing' : 'not confirmed';
  const paymentLabel = paymentStatus === 'paid' ? 'paid' : isProcessing ? 'processing' : 'not paid';
  const bookingToken = typeof status?.order?.bookingToken === 'string' ? status.order.bookingToken : '';
  const bookingHref = bookingToken ? `/booking/${bookingToken}` : '';
  const heading = isConfirmed ? 'Thank you. Your booking is confirmed.' : 'Your Red Rocks ride is being finalized.';
  const intro = isConfirmed
    ? 'Your payment went through and your shared shuttle seats are locked in. Your booking page is now the live source of truth for ride details.'
    : 'We keep checking your Square payment in the background so this page can update on its own instead of leaving you guessing.';

  const tone = useMemo(() => {
    if (isConfirmed) {
      return {
        panel: 'border-emerald-400/30 bg-emerald-500/12 text-emerald-50',
        dot: 'bg-emerald-300',
        eyebrow: 'Payment locked in',
        message: 'Your shared shuttle seats are confirmed. Your booking page has your live details and manage-booking link.',
      };
    }
    return {
      panel: 'border-[#ffb07c]/30 bg-[#ffb07c]/12 text-white',
      dot: 'bg-[#ffb07c]',
      eyebrow: 'Finalizing your booking',
      message: timedOut
        ? 'Square may already have your payment. We are still waiting on the final confirmation signal.'
        : 'We are matching your Square payment to your booking now. This usually resolves on its own in a few seconds.',
    };
  }, [isConfirmed, timedOut]);

  return (
    <main className="relative overflow-hidden bg-[#050816] px-4 pb-20 pt-24 text-white sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,176,124,0.2),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(143,208,255,0.16),transparent_24%)]" />
      <div className="absolute inset-x-0 top-0 h-72 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),transparent)]" />

      <section className="relative mx-auto max-w-4xl overflow-hidden rounded-[34px] border border-white/10 bg-[#09101f] shadow-[0_40px_120px_rgba(0,0,0,0.45)]">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,176,124,0.12),transparent_36%,rgba(143,208,255,0.08))]" />
        <div className="relative p-8 sm:p-10">
          <div className="flex flex-wrap items-center gap-3 text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
            <span>Shared checkout</span>
            <span className="rounded-full border border-white/12 bg-white/6 px-3 py-1 text-white/72">Order {internalOrderId.slice(0, 8)}</span>
          </div>
          <h1 className="mt-4 max-w-2xl text-3xl font-black uppercase tracking-[-0.04em] sm:text-5xl">{heading}</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/74 sm:text-base">
            {intro}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[22px] border border-white/10 bg-white/6 p-4">
              <div className="text-[11px] font-black uppercase tracking-[0.18em] text-white/46">Booking</div>
              <div className="mt-3 text-lg font-black uppercase tracking-[0.02em] text-white">{bookingLabel}</div>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-white/6 p-4">
              <div className="text-[11px] font-black uppercase tracking-[0.18em] text-white/46">Payment</div>
              <div className="mt-3 text-lg font-black uppercase tracking-[0.02em] text-white">{paymentLabel}</div>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-white/6 p-4">
              <div className="text-[11px] font-black uppercase tracking-[0.18em] text-white/46">Refresh</div>
              <div className="mt-3 text-sm font-semibold leading-6 text-white/74">This page checks automatically for about 30 seconds.</div>
            </div>
          </div>

          {loading ? <p className="mt-6 text-sm text-white/74">Finalizing your payment confirmation...</p> : null}
          {!loading && status?.error ? <p className="mt-6 text-sm text-rose-200">{status.error}</p> : null}

          {!loading && !status?.error ? (
            <div className="mt-6 space-y-4">
              <div className={`rounded-[24px] border px-5 py-5 ${tone.panel}`}>
                <div className="flex items-center gap-3">
                  <span className={`h-2.5 w-2.5 rounded-full ${tone.dot}`} />
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/72">{tone.eyebrow}</span>
                </div>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-inherit/90">{tone.message}</p>
              </div>

              <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
                  <div className="text-[11px] font-black uppercase tracking-[0.18em] text-white/46">What happens next</div>
                  <div className="mt-4 grid gap-3 text-sm text-white/76">
                    <div className="rounded-[18px] border border-white/10 bg-white/[0.04] px-4 py-3">
                      {isConfirmed
                        ? 'Your payment is already matched to this booking.'
                        : 'Square finishes processing and we match the payment to this booking.'}
                    </div>
                    <div className="rounded-[18px] border border-white/10 bg-white/[0.04] px-4 py-3">Your booking page becomes the source of truth for seats, pickup, and any changes.</div>
                    <div className="rounded-[18px] border border-white/10 bg-white/[0.04] px-4 py-3">You should receive both the Square receipt and a Party at Red Rocks confirmation email.</div>
                  </div>
                </div>

                <div className="rounded-[24px] border border-white/10 bg-white/6 p-5">
                  <div className="text-[11px] font-black uppercase tracking-[0.18em] text-white/46">Next move</div>
                  <p className="mt-4 text-sm leading-7 text-white/76">
                    {bookingHref
                      ? 'Open your booking page if you want to review the ride details or check again after the payment settles.'
                      : 'Stay on this page for a few seconds while the confirmation finishes.'}
                  </p>
                  {bookingHref ? (
                    <div className="mt-5">
                      <Link
                        className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#8fd0ff]/30 bg-[#8fd0ff]/12 px-5 text-sm font-black uppercase tracking-[0.16em] text-white no-underline transition hover:bg-[#8fd0ff]/18"
                        href={bookingHref}
                      >
                        Open booking page
                      </Link>
                    </div>
                  ) : null}
                </div>
              </div>

              {timedOut && !isConfirmed ? (
                <div className="rounded-[24px] border border-white/10 bg-white/5 px-5 py-5 text-sm leading-7 text-white/82">
                  If you already paid and this still has not updated, open your booking page and give it another moment. If it still looks wrong, contact Party at Red Rocks support.
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
