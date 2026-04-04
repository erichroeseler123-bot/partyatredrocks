'use client';

import { useEffect, useMemo, useState } from 'react';

type Props = {
  guestShareUrl: string;
  bookingFlowUrl: string;
  showName: string;
  showDateLabel: string;
  pickupLabel: string;
  pickupTimeLabel: string;
  seatCount: number;
  storageKey: string;
};

type GuestRoster = {
  names: string[];
};

function sanitizeName(value: string) {
  return value.trim().replace(/\s+/g, ' ').slice(0, 40);
}

export default function PublicBookingShare({
  guestShareUrl,
  bookingFlowUrl,
  showName,
  showDateLabel,
  pickupLabel,
  pickupTimeLabel,
  seatCount,
  storageKey,
}: Props) {
  const [message, setMessage] = useState<string | null>(null);
  const [guestName, setGuestName] = useState('');
  const [roster, setRoster] = useState<GuestRoster>({ names: [] });

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.names)) return;
      setRoster({ names: parsed.names.filter((item: unknown): item is string => typeof item === 'string') });
    } catch {
      // ignore localStorage read failures
    }
  }, [storageKey]);

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(roster));
    } catch {
      // ignore localStorage write failures
    }
  }, [roster, storageKey]);

  const snapchatText = useMemo(() => (
    `Red Rocks is calling! 👻 I've got our Party at Red Rocks shuttle locked in for ${showName} on ${showDateLabel}. 🚐\n\n📍 Pickup: ${pickupLabel} @ ${pickupTimeLabel}\n🎫 Your Hub: ${guestShareUrl}\n\nJump in the link to see the weather, packing checklist, and our return info. Let's get it! 🎸🔥`
  ), [guestShareUrl, pickupLabel, pickupTimeLabel, showDateLabel, showName]);

  const qrUrl = useMemo(() => {
    const params = new URLSearchParams({
      size: '220x220',
      data: guestShareUrl,
      qzone: '1',
      format: 'png',
    });
    return `https://api.qrserver.com/v1/create-qr-code/?${params.toString()}`;
  }, [guestShareUrl]);

  const namedSeats = roster.names.length;
  const remainingSeats = Math.max(seatCount - namedSeats, 0);

  async function copyGuestLink() {
    try {
      await navigator.clipboard.writeText(guestShareUrl);
      setMessage('Guest-safe link copied. Send it to your group.');
    } catch {
      setMessage('Copy failed. You can still use the share buttons.');
    }
  }

  async function copySnapMessage() {
    try {
      await navigator.clipboard.writeText(snapchatText);
      setMessage('Snap message copied. Paste it into Snapchat or your group text.');
    } catch {
      setMessage('Copy failed. You can still use the share button.');
    }
  }

  async function nativeShare() {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: `${showName} ride plan`,
          text: snapchatText,
          url: guestShareUrl,
        });
        setMessage(null);
        return;
      } catch {
        // fall through to clipboard
      }
    }
    await copySnapMessage();
  }

  function addGuest() {
    const next = sanitizeName(guestName);
    if (!next) return;
    setRoster((current) => ({ names: [...current.names, next] }));
    setGuestName('');
    setMessage(null);
  }

  function removeGuest(name: string) {
    setRoster((current) => ({ names: current.names.filter((item) => item !== name) }));
  }

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-[#ffb07c]/18 bg-[linear-gradient(135deg,rgba(255,176,124,0.14),rgba(8,14,28,0.98)_48%,rgba(143,208,255,0.12))] p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_26%)]" />
      <div className="relative">
        <div className="text-[12px] font-black uppercase tracking-[0.2em] text-[var(--brand-orange)]">Coordinate The Crew</div>
        <div className="mt-4 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="min-w-0 space-y-5">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-[-0.03em] text-white sm:text-3xl">Make the group plan impossible to miss.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/78">
                Share the guest-safe dashboard link so everyone gets the checklist, timeline, and return info without touching payment or cancellation controls.
              </p>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
              <div className="text-[11px] font-black uppercase tracking-[0.18em] text-white/46">One-Tap Snap Message</div>
              <div className="mt-4 rounded-[18px] border border-white/10 bg-white/[0.04] p-4 text-sm leading-7 text-white/82">
                <p className="whitespace-pre-line">{snapchatText}</p>
              </div>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <button
                  type="button"
                  onClick={nativeShare}
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-[#ffb07c]/28 bg-[#ffb07c]/14 px-5 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-[#ffb07c]/20 sm:w-auto"
                >
                  Share To Snapchat
                </button>
                <button
                  type="button"
                  onClick={copySnapMessage}
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-400/14 px-5 text-sm font-black uppercase tracking-[0.16em] text-cyan-50 transition hover:border-cyan-200/45 hover:bg-cyan-300/20 sm:w-auto"
                >
                  Copy Snap Message
                </button>
                <button
                  type="button"
                  onClick={copyGuestLink}
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-400/14 px-5 text-sm font-black uppercase tracking-[0.16em] text-cyan-50 transition hover:border-cyan-200/45 hover:bg-cyan-300/20 sm:w-auto"
                >
                  Copy Guest Link
                </button>
              </div>
              {message ? <p className="mt-3 text-sm text-white/68">{message}</p> : null}
            </div>

            <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="text-[11px] font-black uppercase tracking-[0.18em] text-white/46">Who's Rolling?</div>
                  <p className="mt-2 text-sm leading-6 text-white/76">Keep a lightweight seat tally for your crew. This stays saved on your phone.</p>
                </div>
                <div className="text-sm font-black text-[var(--brand-cyan)]">{namedSeats}/{seatCount} named</div>
              </div>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  value={guestName}
                  onChange={(event) => setGuestName(event.target.value)}
                  placeholder="Add guest name"
                  className="min-h-12 flex-1 rounded-full border border-white/12 bg-[#0d1629] px-4 text-white outline-none transition focus:border-[var(--brand-orange)]"
                />
                <button
                  type="button"
                  onClick={addGuest}
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-400/14 px-5 text-sm font-black uppercase tracking-[0.16em] text-cyan-50 transition hover:border-cyan-200/45 hover:bg-cyan-300/20"
                >
                  Add Guest Name
                </button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {roster.names.map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => removeGuest(name)}
                    className="rounded-full border border-white/12 bg-white/[0.05] px-3 py-2 text-[11px] font-black uppercase tracking-[0.14em] text-white/78 transition hover:bg-white/[0.1]"
                  >
                    {name} ×
                  </button>
                ))}
                {Array.from({ length: remainingSeats }).map((_, index) => (
                  <span
                    key={`tbd-${index}`}
                    className="rounded-full border border-dashed border-white/12 bg-white/[0.03] px-3 py-2 text-[11px] font-black uppercase tracking-[0.14em] text-white/48"
                  >
                    TBD
                  </span>
                ))}
              </div>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <a
                  href={bookingFlowUrl}
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-[#ffb07c]/28 bg-[#ffb07c]/14 px-5 text-center text-sm font-black uppercase tracking-[0.16em] text-white no-underline transition hover:bg-[#ffb07c]/20 sm:w-auto"
                >
                  Add More Seats To This Group
                </a>
              </div>
            </div>
          </div>

          <div className="min-w-0 space-y-5">
            <div className="rounded-[24px] border border-white/10 bg-black/20 p-5 text-center">
              <div className="text-[11px] font-black uppercase tracking-[0.18em] text-white/46">Scan To Join The Plan</div>
              <p className="mt-2 text-sm leading-6 text-white/76">Open this on one phone at the bar and let the group scan it into their own dashboard.</p>
              <div className="mt-4 inline-flex w-full max-w-[252px] rounded-[24px] border border-white/10 bg-white p-4">
                <img
                  src={qrUrl}
                  alt="QR code for the guest-safe booking dashboard link"
                  width="220"
                  height="220"
                  className="h-auto w-full max-w-[220px]"
                />
              </div>
              <p className="mt-4 break-all text-xs leading-6 text-white/50">{guestShareUrl}</p>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
              <div className="text-[11px] font-black uppercase tracking-[0.18em] text-white/46">Guest-Safe View</div>
              <div className="mt-4 grid gap-3 text-sm text-white/72">
                <div className="rounded-[18px] border border-white/10 bg-white/[0.04] px-4 py-3">Guests see the checklist, show-day timeline, packing rules, and return guidance.</div>
                <div className="rounded-[18px] border border-white/10 bg-white/[0.04] px-4 py-3">Primary-booker controls like cancellation, refund details, and notes stay on the private dashboard.</div>
                <div className="rounded-[18px] border border-white/10 bg-white/[0.04] px-4 py-3">Best for Snapchat, bar-side QR scans, and keeping the whole group on the same plan.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
