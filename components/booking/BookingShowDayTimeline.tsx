'use client';

import { useEffect, useMemo, useState } from 'react';

type Props = {
  showStartRaw: string | null;
  fallbackDate: string | null;
  pickupName: string;
};

type CountdownState = {
  label: string;
  value: string;
};

function pad(value: number) {
  return String(value).padStart(2, '0');
}

function formatTime(date: Date | null) {
  if (!date) return 'TBD';
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatCountdown(diffMs: number) {
  if (diffMs <= 0) return '00:00:00';
  const totalSeconds = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

function getCountdown(now: number, departure: Date | null, showStart: Date | null): CountdownState | null {
  if (departure && departure.getTime() > now) {
    return {
      label: 'Shuttle leaves in',
      value: formatCountdown(departure.getTime() - now),
    };
  }
  if (showStart && showStart.getTime() > now) {
    return {
      label: 'Music starts in',
      value: formatCountdown(showStart.getTime() - now),
    };
  }
  return null;
}

export default function BookingShowDayTimeline({ showStartRaw, fallbackDate, pickupName }: Props) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  const schedule = useMemo(() => {
    const raw = showStartRaw || (fallbackDate ? `${fallbackDate}T19:00:00` : null);
    const showStart = raw ? new Date(raw) : null;
    if (!showStart || Number.isNaN(showStart.getTime())) {
      return {
        countdown: null,
        checkIn: null,
        departure: null,
        doors: null,
        showStart: null,
      };
    }

    const departure = new Date(showStart.getTime() - 90 * 60 * 1000);
    const checkIn = new Date(departure.getTime() - 15 * 60 * 1000);
    const doors = new Date(showStart.getTime() - 60 * 60 * 1000);

    return {
      countdown: getCountdown(now, departure, showStart),
      checkIn,
      departure,
      doors,
      showStart,
    };
  }, [fallbackDate, now, showStartRaw]);

  return (
    <div className="rounded-[22px] border border-white/10 bg-black/20 p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-[11px] font-black uppercase tracking-[0.18em] text-white/46">Show-Day Timeline</div>
          <p className="mt-2 text-sm leading-6 text-white/76">Built from your current show time. If the schedule shifts, the final driver text wins.</p>
        </div>
        {schedule.countdown ? (
          <div className="rounded-full border border-[var(--brand-cyan)]/30 bg-[var(--brand-cyan)]/12 px-4 py-2 text-center text-sm font-black text-cyan-50">
            <div className="text-[10px] uppercase tracking-[0.18em] text-cyan-100/70">{schedule.countdown.label}</div>
            <div className="mt-1 text-lg tracking-[0.12em]">{schedule.countdown.value}</div>
          </div>
        ) : (
          <div className="rounded-full border border-white/12 bg-white/6 px-4 py-2 text-sm font-black text-white/70">Show day is live</div>
        )}
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-4">
          <div className="text-[11px] font-black uppercase tracking-[0.18em] text-white/46">Check-In</div>
          <div className="mt-2 text-lg font-black text-white">{formatTime(schedule.checkIn)}</div>
          <p className="mt-2 text-sm leading-6 text-white/72">Arrive at {pickupName} and be ready to board.</p>
        </div>
        <div className="rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-4">
          <div className="text-[11px] font-black uppercase tracking-[0.18em] text-white/46">Departure</div>
          <div className="mt-2 text-lg font-black text-white">{formatTime(schedule.departure)}</div>
          <p className="mt-2 text-sm leading-6 text-white/72">Estimated shuttle departure based on the current show time.</p>
        </div>
        <div className="rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-4">
          <div className="text-[11px] font-black uppercase tracking-[0.18em] text-white/46">Doors Open</div>
          <div className="mt-2 text-lg font-black text-white">{formatTime(schedule.doors)}</div>
          <p className="mt-2 text-sm leading-6 text-white/72">Get through security and head uphill with some buffer.</p>
        </div>
        <div className="rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-4">
          <div className="text-[11px] font-black uppercase tracking-[0.18em] text-white/46">Music Starts</div>
          <div className="mt-2 text-lg font-black text-white">{formatTime(schedule.showStart)}</div>
          <p className="mt-2 text-sm leading-6 text-white/72">Catch the opener and settle in before the headliner.</p>
        </div>
      </div>
      <div className="mt-4 rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-4 text-sm leading-7 text-white/76">
        <span className="font-black text-white">The return:</span> 30 minutes after the final encore. Watch for the driver text so you head back to the correct pickup zone instead of the rideshare scramble.
      </div>
    </div>
  );
}
