'use client';

import { useState } from 'react';

type Props = {
  token: string;
  canCancel: boolean;
  alreadyCancelled: boolean;
  refundEligible: boolean;
  refundAmountLabel: string;
};

type CancelResult = {
  refundStatus: 'initiated' | 'ineligible';
};

export default function PublicBookingActions({
  token,
  canCancel,
  alreadyCancelled,
  refundEligible,
  refundAmountLabel,
}: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [result, setResult] = useState<CancelResult | null>(null);

  async function handleConfirmCancel() {
    if (!canCancel || alreadyCancelled || submitting) return;

    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/booking/${encodeURIComponent(token)}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Unable to cancel booking');
      setConfirmOpen(false);
      setResult({ refundStatus: data.refundStatus === 'initiated' ? 'initiated' : 'ineligible' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to cancel booking');
    } finally {
      setSubmitting(false);
    }
  }

  if (alreadyCancelled || result) {
    const refundStatus = alreadyCancelled ? 'initiated' : result?.refundStatus || 'ineligible';
    const refundLabel = refundStatus === 'initiated' ? 'Initiated' : 'Ineligible';
    return (
      <div className="space-y-3">
        <div className="rounded-[22px] border border-rose-300/25 bg-rose-500/10 p-5">
          <div className="text-[11px] font-black uppercase tracking-[0.18em] text-rose-100/80">Cancellation Confirmed</div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.18em] text-white/46">Status</div>
              <div className="mt-1 text-base font-black text-white">Booking Cancelled</div>
            </div>
            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.18em] text-white/46">Refund Status</div>
              <div className="mt-1 text-base font-black text-white">{refundLabel}</div>
            </div>
            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.18em] text-white/46">Next Steps</div>
              <div className="mt-1 text-sm leading-6 text-white/78">Check your inbox for the cancellation email. Eligible refunds usually show within 5-10 business days.</div>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-white/76">Changed your mind? Text us at 720-369-6292 to see if seats are still available.</p>
        </div>
        {error ? <p className="text-sm text-rose-200">{error}</p> : null}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <a
          href="#manage-booking"
          className="flex min-h-12 items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-400/14 px-5 text-sm font-black uppercase tracking-[0.16em] text-cyan-50 transition hover:border-cyan-200/45 hover:bg-cyan-300/20"
        >
          Manage Booking
        </a>
        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          disabled={!canCancel || alreadyCancelled || submitting}
          className={`flex min-h-12 w-full items-center justify-center rounded-full px-5 text-sm font-black uppercase tracking-[0.16em] transition ${!canCancel || alreadyCancelled || submitting ? 'cursor-not-allowed border border-white/12 bg-white/6 text-white/40' : 'border border-rose-400/35 bg-rose-500/10 text-rose-100 hover:bg-rose-500/18'}`}
        >
          {submitting ? 'Cancelling...' : 'Cancel Booking'}
        </button>
      </div>
      {confirmOpen ? (
        <div className="rounded-[22px] border border-white/12 bg-[#0d1629] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
          <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[var(--brand-orange)]">Wait! Are you sure you want to cancel?</div>
          <div className="mt-4 rounded-[18px] border border-white/10 bg-black/20 p-4 text-sm leading-7 text-white/80">
            {refundEligible ? (
              <>
                <div className="font-black text-emerald-100">You are more than 48 hours away.</div>
                <p className="mt-2">If you cancel now, a full refund ({refundAmountLabel}) will be initiated to the original payment method used at checkout.</p>
              </>
            ) : (
              <>
                <div className="font-black text-rose-100">You are within 48 hours of departure.</div>
                <p className="mt-2">If you cancel now, your seat will be released, but per policy, no refund can be issued at this time.</p>
              </>
            )}
          </div>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setConfirmOpen(false)}
              className="flex min-h-12 items-center justify-center rounded-full border border-white/12 bg-white/6 px-5 text-sm font-black uppercase tracking-[0.16em] text-white/78 transition hover:bg-white/10"
            >
              Keep My Seat
            </button>
            <button
              type="button"
              onClick={handleConfirmCancel}
              disabled={submitting}
              className="flex min-h-12 items-center justify-center rounded-full border border-rose-400/35 bg-rose-500/10 px-5 text-sm font-black uppercase tracking-[0.16em] text-rose-100 transition hover:bg-rose-500/18 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? 'Cancelling...' : 'Confirm Cancellation'}
            </button>
          </div>
        </div>
      ) : null}
      {error ? <p className="text-sm text-rose-200">{error}</p> : null}
    </div>
  );
}
