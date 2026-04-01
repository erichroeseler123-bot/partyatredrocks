'use client';

import { useEffect, useMemo, useState } from 'react';

type Props = {
  showStartRaw: string | null;
  fallbackDate: string | null;
  pickupName: string;
  pickupAddress: string;
  pickupMapsUrl: string;
  pickupMapsEmbedUrl: string;
  supportPhoneDisplay: string;
  supportPhoneE164: string;
  meetupLandmark: string;
  meetupWaitSpot: string;
  meetupWaitInstructions: string;
  meetupCheckIn: string;
  meetupArrivalText: string;
  meetupBoardingCue: string;
};

type Phase = 'pretrip' | 'showday' | 'return';

type LiveStatus = {
  label: string;
  detail: string;
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

function getLiveStatus(now: number, checkIn: Date | null, departure: Date | null, landmark: string): LiveStatus {
  if (!checkIn || !departure) {
    return {
      label: 'Preparing',
      detail: `Grab a drink and keep this page bookmarked. We will text you when it is time to head to ${landmark}.`,
    };
  }

  const msUntilCheckIn = checkIn.getTime() - now;
  const msUntilDeparture = departure.getTime() - now;

  if (msUntilDeparture <= 0) {
    return {
      label: 'Boarding',
      detail: `We are at the curb now. Head straight to ${landmark} and look for the PARR vehicle.`,
    };
  }

  if (msUntilCheckIn <= 15 * 60 * 1000) {
    return {
      label: 'Arriving Soon',
      detail: `The shuttle is close. Finish your drinks and head toward ${landmark}.`,
    };
  }

  return {
    label: 'Preparing',
    detail: `Grab a drink and stay nearby. We will text you when we are 15 minutes out for ${landmark}.`,
  };
}

const returnZoneMapsUrl =
  'https://www.google.com/maps/search/?api=1&query=Red+Rocks+Amphitheatre+18300+W+Alameda+Pkwy+Morrison+CO+80465';

export default function BookingRideSummaryCard({
  showStartRaw,
  fallbackDate,
  pickupName,
  pickupAddress,
  pickupMapsUrl,
  pickupMapsEmbedUrl,
  supportPhoneDisplay,
  supportPhoneE164,
  meetupLandmark,
  meetupWaitSpot,
  meetupWaitInstructions,
  meetupCheckIn,
  meetupArrivalText,
  meetupBoardingCue,
}: Props) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  const schedule = useMemo(() => {
    const raw = showStartRaw || (fallbackDate ? `${fallbackDate}T19:00:00` : null);
    const showStart = raw ? new Date(raw) : null;
    if (!showStart || Number.isNaN(showStart.getTime())) {
      return null;
    }

    const departure = new Date(showStart.getTime() - 90 * 60 * 1000);
    const checkIn = new Date(departure.getTime() - 15 * 60 * 1000);
    const twentyFourHoursBeforeDeparture = departure.getTime() - 24 * 60 * 60 * 1000;
    const phase: Phase = now >= departure.getTime() ? 'return' : now >= twentyFourHoursBeforeDeparture ? 'showday' : 'pretrip';
    const countdownTarget = phase === 'return' ? showStart : departure;

    return {
      phase,
      showStart,
      departure,
      checkIn,
      countdown: formatCountdown(countdownTarget.getTime() - now),
      liveStatus: getLiveStatus(now, checkIn, departure, meetupLandmark),
    };
  }, [fallbackDate, meetupLandmark, now, showStartRaw]);

  const smsHref = useMemo(() => {
    const body = encodeURIComponent(
      `Hey - I need help with my Party At Red Rocks ride. Pickup: ${pickupName}.`
    );
    return `sms:${supportPhoneE164}?&body=${body}`;
  }, [pickupName, supportPhoneE164]);

  const phaseCopy = schedule?.phase === 'return'
    ? {
        badge: 'Return Mode',
        title: 'Post-show plan is live.',
        body: 'Use the support text shortcut if your crew gets separated. Your driver text and this page are the fastest way back onto the return ride.',
        primaryLabel: 'Text For Return Help',
        primaryHref: smsHref,
        secondaryLabel: 'Open Return Pickup',
        secondaryHref: returnZoneMapsUrl,
      }
    : schedule?.phase === 'showday'
      ? {
          badge: 'Show Day',
          title: 'This is your live ride anchor.',
          body: 'Map, timing, and pickup details are all here now. Open the route before you leave so there is no bar-side scrambling.',
          primaryLabel: 'Get Directions',
          primaryHref: pickupMapsUrl,
          secondaryLabel: 'Text The Driver Team',
          secondaryHref: smsHref,
        }
      : {
          badge: 'T-Minus 24+ Hours',
          title: 'Your ride details are locked in.',
          body: 'Bookmark this page now. The countdown is live, the checklist stays saved on your phone, and the map link is ready for show day.',
          primaryLabel: 'Check Red Rocks Weather',
          primaryHref: '/red-rocks/weather',
          secondaryLabel: 'Preview Pickup Route',
          secondaryHref: pickupMapsUrl,
        };

  return (
    <section className="rounded-[28px] border border-[#ffb07c]/20 bg-[linear-gradient(135deg,rgba(255,176,124,0.10),rgba(9,16,31,0.98)_42%,rgba(143,208,255,0.10))] p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <div className="text-[12px] font-black uppercase tracking-[0.2em] text-[var(--brand-orange)]">Ride Summary</div>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-[#ffb07c]/28 bg-[#ffb07c]/14 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-white">
              {phaseCopy.badge}
            </span>
            {schedule ? (
              <span className="rounded-full border border-cyan-300/30 bg-cyan-400/12 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-cyan-50">
                {schedule.phase === 'return' ? 'Music starts in' : 'Shuttle leaves in'} {schedule.countdown}
              </span>
            ) : null}
            {schedule ? (
              <span className="rounded-full border border-white/12 bg-white/8 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-white">
                Status: {schedule.liveStatus.label}
              </span>
            ) : null}
          </div>
          <h2 className="mt-4 text-2xl font-black uppercase tracking-[-0.03em] text-white sm:text-3xl">{phaseCopy.title}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/76">{phaseCopy.body}</p>
          {schedule ? (
            <div className="mt-4 rounded-[20px] border border-cyan-300/22 bg-cyan-400/10 px-4 py-4 text-sm leading-7 text-cyan-50">
              <div className="text-[11px] font-black uppercase tracking-[0.18em] text-cyan-100/82">Live Status</div>
              <p className="mt-2">{schedule.liveStatus.detail}</p>
            </div>
          ) : null}
        </div>
        <div className="grid w-full gap-3 lg:max-w-[320px]">
          <a
            href={phaseCopy.primaryHref}
            target={phaseCopy.primaryHref.startsWith('/') ? undefined : '_blank'}
            rel={phaseCopy.primaryHref.startsWith('/') ? undefined : 'noreferrer'}
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#ffb07c]/28 bg-[#ffb07c]/14 px-5 text-sm font-black uppercase tracking-[0.16em] text-white no-underline transition hover:bg-[#ffb07c]/20"
          >
            {phaseCopy.primaryLabel}
          </a>
          <a
            href={phaseCopy.secondaryHref}
            target={phaseCopy.secondaryHref.startsWith('sms:') || phaseCopy.secondaryHref.startsWith('/') ? undefined : '_blank'}
            rel={phaseCopy.secondaryHref.startsWith('sms:') || phaseCopy.secondaryHref.startsWith('/') ? undefined : 'noreferrer'}
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-400/14 px-5 text-sm font-black uppercase tracking-[0.16em] text-cyan-50 no-underline transition hover:border-cyan-200/45 hover:bg-cyan-300/20"
          >
            {phaseCopy.secondaryLabel}
          </a>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-[24px] border border-white/10 bg-black/20">
        <iframe
          title={`Map for ${pickupName}`}
          src={pickupMapsEmbedUrl}
          className="h-[280px] w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <div className="rounded-[22px] border border-white/10 bg-black/20 p-5">
          <div className="text-[11px] font-black uppercase tracking-[0.18em] text-white/46">Pickup</div>
          <div className="mt-2 text-lg font-black text-white">{pickupName}</div>
          <p className="mt-2 text-sm leading-6 text-white/74">{pickupAddress}</p>
        </div>
        <div className="rounded-[22px] border border-white/10 bg-black/20 p-5">
          <div className="text-[11px] font-black uppercase tracking-[0.18em] text-white/46">Check-In</div>
          <div className="mt-2 text-lg font-black text-white">{formatTime(schedule?.checkIn || null)}</div>
          <p className="mt-2 text-sm leading-6 text-white/74">Be there 10 to 15 minutes early so the whole group loads cleanly.</p>
        </div>
        <div className="rounded-[22px] border border-white/10 bg-black/20 p-5">
          <div className="text-[11px] font-black uppercase tracking-[0.18em] text-white/46">
            {schedule?.phase === 'return' ? 'Return Help' : 'Departure'}
          </div>
          <div className="mt-2 text-lg font-black text-white">
            {schedule?.phase === 'return' ? supportPhoneDisplay : formatTime(schedule?.departure || null)}
          </div>
          <p className="mt-2 text-sm leading-6 text-white/74">
            {schedule?.phase === 'return'
              ? 'If the group gets split up after the encore, text support before you start the rideshare walk.'
              : 'Departure time is based on the current show schedule. Final driver text always wins.'}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-[24px] border border-white/10 bg-black/20 p-5">
        <div className="text-[12px] font-black uppercase tracking-[0.18em] text-[var(--brand-orange)]">How To Meet Us</div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-4 text-sm leading-7 text-white/80">
            <div className="text-[11px] font-black uppercase tracking-[0.18em] text-white/46">The Exact Spot</div>
            <p className="mt-2">Look for the Party at Red Rocks sign near <span className="font-black text-white">{meetupLandmark}</span>.</p>
          </div>
          <div className="rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-4 text-sm leading-7 text-white/80">
            <div className="text-[11px] font-black uppercase tracking-[0.18em] text-white/46">Wait Inside Or Out?</div>
            <p className="mt-2">Feel free to wait at <span className="font-black text-white">{meetupWaitSpot}</span>. {meetupWaitInstructions}</p>
          </div>
          <div className="rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-4 text-sm leading-7 text-white/80">
            <div className="text-[11px] font-black uppercase tracking-[0.18em] text-white/46">Check-In</div>
            <p className="mt-2">{meetupCheckIn}</p>
          </div>
          <div className="rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-4 text-sm leading-7 text-white/80">
            <div className="text-[11px] font-black uppercase tracking-[0.18em] text-white/46">Notification</div>
            <p className="mt-2">{meetupArrivalText} {meetupBoardingCue}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
