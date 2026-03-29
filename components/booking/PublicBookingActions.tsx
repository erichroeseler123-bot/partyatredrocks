'use client';

import { useState } from 'react';

type Props = {
  token: string;
  canCancel: boolean;
  alreadyCancelled: boolean;
};

export default function PublicBookingActions({ token, canCancel, alreadyCancelled }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCancel() {
    if (!canCancel || alreadyCancelled || submitting) return;
    const confirmed = window.confirm('Are you sure? This cannot be undone.');
    if (!confirmed) return;

    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/booking/${encodeURIComponent(token)}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Unable to cancel booking');
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to cancel booking');
    } finally {
      setSubmitting(false);
    }
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
          onClick={handleCancel}
          disabled={!canCancel || alreadyCancelled || submitting}
          className={`flex min-h-12 w-full items-center justify-center rounded-full px-5 text-sm font-black uppercase tracking-[0.16em] transition ${!canCancel || alreadyCancelled || submitting ? 'cursor-not-allowed border border-white/12 bg-white/6 text-white/40' : 'border border-rose-400/35 bg-rose-500/10 text-rose-100 hover:bg-rose-500/18'}`}
        >
          {alreadyCancelled ? 'Booking Cancelled' : submitting ? 'Cancelling...' : 'Cancel Booking'}
        </button>
      </div>
      {error ? <p className="text-sm text-rose-200">{error}</p> : null}
    </div>
  );
}
