'use client';

import { useState } from 'react';

type Props = {
  token: string;
  initialNotes: string;
};

export default function PublicBookingNotes({ token, initialNotes }: Props) {
  const [notes, setNotes] = useState(initialNotes);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  async function saveNotes() {
    setSaving(true);
    setStatus(null);
    try {
      const response = await fetch(`/api/booking/${encodeURIComponent(token)}/notes`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || 'Unable to save notes');
      }
      setStatus('Saved');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to save notes');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <textarea
        value={notes}
        onChange={(event) => {
          setNotes(event.target.value);
          if (status) setStatus(null);
        }}
        placeholder="Leave at 5:15. Meet Jake at the pickup. Bring a jacket."
        rows={6}
        className="w-full rounded-[22px] border border-white/12 bg-[#0d1629] px-4 py-4 text-white outline-none transition focus:border-[var(--brand-orange)]"
      />
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={saveNotes}
          disabled={saving}
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-white/6 px-5 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:border-white/24 hover:bg-white/10 disabled:cursor-not-allowed disabled:text-white/40"
        >
          {saving ? 'Saving...' : 'Save Notes'}
        </button>
        {status ? <span className="text-sm text-white/68">{status}</span> : null}
      </div>
    </div>
  );
}
