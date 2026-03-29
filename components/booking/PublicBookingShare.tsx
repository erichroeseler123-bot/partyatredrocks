'use client';

import { useState } from 'react';

type Props = {
  shareUrl: string;
  shareTitle: string;
  shareText: string;
};

export default function PublicBookingShare({ shareUrl, shareTitle, shareText }: Props) {
  const [message, setMessage] = useState<string | null>(null);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setMessage('Booking link copied. Send it to your group chat.');
    } catch {
      setMessage('Copy failed. You can still use the share or text buttons.');
    }
  }

  async function copyInvite() {
    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setMessage('Invite message copied. Paste it into text or your group chat.');
    } catch {
      setMessage('Copy failed. You can still use the share or text buttons.');
    }
  }

  async function share() {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        setMessage(null);
        return;
      } catch {
        // fall through to copy
      }
    }
    await copyInvite();
  }

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-[#ffb07c]/18 bg-[linear-gradient(135deg,rgba(255,176,124,0.14),rgba(8,14,28,0.98)_48%,rgba(143,208,255,0.12))] p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_26%)]" />
      <div className="relative">
        <div className="text-[12px] font-black uppercase tracking-[0.2em] text-[var(--brand-orange)]">Bring Your Group</div>
        <div className="mt-4 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-[-0.03em] text-white sm:text-3xl">Invite people onto your shuttle.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/78">
              This is the exact ride you booked. Send your group the booking link so they can join the same shuttle instead of figuring out transportation separately.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={share}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#ffb07c]/28 bg-[#ffb07c]/14 px-5 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-[#ffb07c]/20"
              >
                Share This Shuttle
              </button>
              <a
                href={`sms:&body=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-400/14 px-5 text-sm font-black uppercase tracking-[0.16em] text-cyan-50 no-underline transition hover:border-cyan-200/45 hover:bg-cyan-300/20"
              >
                Text My Group
              </a>
              <button
                type="button"
                onClick={copyInvite}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-400/14 px-5 text-sm font-black uppercase tracking-[0.16em] text-cyan-50 transition hover:border-cyan-200/45 hover:bg-cyan-300/20"
              >
                Copy Invite
              </button>
              <button
                type="button"
                onClick={copyLink}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-400/14 px-5 text-sm font-black uppercase tracking-[0.16em] text-cyan-50 transition hover:border-cyan-200/45 hover:bg-cyan-300/20"
              >
                Copy Link
              </button>
            </div>
            {message ? <p className="mt-3 text-sm text-white/68">{message}</p> : null}
          </div>

          <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
            <div className="text-[11px] font-black uppercase tracking-[0.18em] text-white/46">Suggested Invite</div>
            <div className="mt-4 rounded-[18px] border border-white/10 bg-white/[0.04] p-4 text-sm leading-7 text-white/82">
              <p>{shareText}</p>
              <p className="mt-3 break-all text-white/60">{shareUrl}</p>
            </div>
            <div className="mt-4 grid gap-3 text-sm text-white/72">
              <div className="rounded-[18px] border border-white/10 bg-white/[0.04] px-4 py-3">Best for group chats, text threads, and last-minute seat coordination.</div>
              <div className="rounded-[18px] border border-white/10 bg-white/[0.04] px-4 py-3">Everyone lands on the same shuttle flow instead of starting over from scratch.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
