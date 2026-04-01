import BrandMark from '@/components/BrandMark';
import Image from 'next/image';
import Link from 'next/link';
import PublicBookingActions from '@/components/booking/PublicBookingActions';
import BookingPackChecklist from '@/components/booking/BookingPackChecklist';
import BookingRideSummaryCard from '@/components/booking/BookingRideSummaryCard';
import BookingShowDayTimeline from '@/components/booking/BookingShowDayTimeline';
import BookingStickyHelp from '@/components/booking/BookingStickyHelp';
import BookingSupportCard from '@/components/booking/BookingSupportCard';
import PublicBookingNotes from '@/components/booking/PublicBookingNotes';
import PublicBookingShare from '@/components/booking/PublicBookingShare';
import {
  resolveBookingArtistContext,
  resolveBookingShowContext,
  type BookingShowContext,
} from '@/lib/bookingContext';
import { getInternalOrderByBookingToken } from '@/lib/orders';
import { getPickupLocationDetails } from '@/lib/pickupLocations';
import { PARR_PUBLIC_FACTS } from '@/lib/publicOperatorFacts';
import { getSharedCheckoutStatus } from '@/lib/sharedInventory';
import { getArtistProfile } from '@/lib/spotify';
import { getProbableSetlist } from '@/lib/setlists';
import { siteOrigin } from '@/lib/square';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type ArtistLinks = {
  youtube: string | null;
  appleMusic: string | null;
  spotify: string | null;
};

function readRecord(value: unknown) {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : null;
}

function asShowContext(value: unknown): BookingShowContext | null {
  const row = readRecord(value);
  if (!row) return null;
  if (typeof row.showId !== 'string' || typeof row.artistName !== 'string' || typeof row.dateKey !== 'string') return null;
  return {
    showId: row.showId,
    showSlug: typeof row.showSlug === 'string' ? row.showSlug : row.showId,
    showTitle: typeof row.showTitle === 'string' ? row.showTitle : row.artistName,
    artistName: row.artistName,
    artistSlug: typeof row.artistSlug === 'string' ? row.artistSlug : row.artistName,
    venueSlug: typeof row.venueSlug === 'string' ? row.venueSlug : 'red-rocks-amphitheatre',
    venueName: typeof row.venueName === 'string' ? row.venueName : null,
    dateKey: row.dateKey,
    startLocal: typeof row.startLocal === 'string' ? row.startLocal : null,
  };
}

function badge(status: string) {
  if (status === 'confirmed') return 'border-emerald-400/35 bg-emerald-500/12 text-emerald-100';
  if (status === 'pending' || status === 'pending_payment') return 'border-amber-400/35 bg-amber-500/12 text-amber-100';
  if (status === 'cancelled') return 'border-rose-400/35 bg-rose-500/12 text-rose-100';
  return 'border-cyan-300/35 bg-cyan-400/12 text-cyan-50';
}

const infoPillClass = 'rounded-full border border-[#ffb07c]/28 bg-[#ffb07c]/16 px-4 py-2 text-[12px] font-black uppercase tracking-[0.16em] text-[#fff1e7] shadow-[0_10px_24px_rgba(255,176,124,0.14)]';
const secondaryActionClass = 'rounded-full border border-cyan-300/30 bg-cyan-400/14 px-4 py-2 text-[12px] font-black uppercase tracking-[0.16em] text-cyan-50 no-underline transition hover:border-cyan-200/45 hover:bg-cyan-300/20';

function label(status: string) {
  if (status === 'confirmed') return 'Confirmed';
  if (status === 'pending' || status === 'pending_payment') return 'Pending';
  if (status === 'cancelled') return 'Cancelled';
  if (status === 'expired') return 'Expired';
  return 'Pending';
}

function titleCasePickup(value: string | null | undefined) {
  if (!value) return 'Denver';
  return value === 'golden' ? 'Golden' : value === 'denver' ? 'Denver' : value;
}

function formatDate(value: string | null | undefined) {
  if (!value) return 'TBD';
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatShortDate(value: string | null | undefined) {
  if (!value) return 'TBD';
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatDateTime(value: string | null | undefined, fallbackDate?: string | null) {
  const raw = value || (fallbackDate ? `${fallbackDate}T19:00:00` : null);
  if (!raw) return 'Show time TBD';
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw;
  return date.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatMoney(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) ? `$${value.toFixed(2)}` : 'TBD';
}

function canCancel(status: string, date: string | null | undefined) {
  if (!date) return false;
  if (status === 'cancelled' || status === 'expired') return false;
  const showStart = new Date(`${date}T19:00:00`);
  if (Number.isNaN(showStart.getTime())) return false;
  return showStart.getTime() > Date.now();
}

function isRefundEligible(date: string | null | undefined) {
  if (!date) return false;
  const showStart = new Date(`${date}T19:00:00`);
  if (Number.isNaN(showStart.getTime())) return false;
  return showStart.getTime() - Date.now() > 48 * 60 * 60 * 1000;
}

async function getArtistLinks(artistName: string): Promise<ArtistLinks | null> {
  try {
    const res = await fetch(`${siteOrigin()}/api/artist-intel?name=${encodeURIComponent(artistName)}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      youtube: typeof data?.urls?.youtube === 'string' ? data.urls.youtube : null,
      appleMusic: typeof data?.urls?.appleMusic === 'string' ? data.urls.appleMusic : null,
      spotify: typeof data?.urls?.spotify === 'string' ? data.urls.spotify : null,
    };
  } catch {
    return null;
  }
}

export default async function PublicBookingPage(
  {
    params,
    searchParams,
  }: {
    params: Promise<{ token: string }>;
    searchParams: Promise<{ view?: string }>;
  }
) {
  const { token } = await params;
  const resolvedSearchParams = await searchParams;
  const isGuestView = resolvedSearchParams?.view === 'guest';
  const order = await getInternalOrderByBookingToken(token);

  if (!order) {
    return (
      <main className="min-h-screen bg-[#050816] px-4 pb-14 pt-24 text-white sm:px-6 lg:px-8">
        <section className="mx-auto max-w-3xl rounded-[30px] border border-white/10 bg-[#0b1224] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.42)] sm:p-8">
          <div className="text-[12px] font-black uppercase tracking-[0.2em] text-[var(--brand-orange)]">Booking</div>
          <h1 className="mt-3 text-3xl font-black uppercase tracking-[-0.03em] text-white">Booking not found</h1>
          <p className="mt-4 text-white/72">That booking link is invalid or no longer available.</p>
        </section>
      </main>
    );
  }

  const { hold } = await getSharedCheckoutStatus(order.internalOrderId);
  const payload = readRecord(order.rezdyBookingPayload) ?? {};
  const booking = readRecord(order.booking) ?? {};
  const customer = readRecord(order.customer) ?? {};
  const payment = readRecord(order.payment) ?? {};
  const storedShow = asShowContext(booking.show) ?? asShowContext(payload.show);
  const status = typeof booking.status === 'string' ? booking.status : hold?.status || 'pending';
  const pickup = titleCasePickup(
    typeof payload.pickupHub === 'string' ? payload.pickupHub : hold?.pickupHub
  );
  const seats = typeof payload.qty === 'number' ? payload.qty : hold?.qty || 1;
  const date = typeof payload.dateKey === 'string'
    ? payload.dateKey
    : typeof payload.date === 'string'
      ? payload.date
      : hold?.date || null;
  const eventHint = typeof payload.event === 'string' ? payload.event : null;
  const bookingArtist = typeof payload.artist === 'string' && payload.artist.trim()
    ? payload.artist.trim()
    : storedShow?.artistName || null;
  const customerName = [customer.firstName, customer.lastName]
    .filter((v) => typeof v === 'string' && v.trim())
    .join(' ');
  const firstName = typeof customer.firstName === 'string' && customer.firstName.trim()
    ? customer.firstName.trim()
    : null;
  const paymentStatus = typeof payment.status === 'string' ? payment.status : 'unpaid';
  const cancelAllowed = canCancel(status, date);
  const refundEligible = isRefundEligible(date);
  const pickupLocation = getPickupLocationDetails(pickup);

  const show = storedShow ?? await resolveBookingShowContext({
    venueSlug:
      typeof payload.venueSlug === 'string'
        ? payload.venueSlug
        : typeof payload.venue === 'string'
          ? payload.venue
          : 'red-rocks-amphitheatre',
    dateKey: date,
    artistName: bookingArtist,
    event: eventHint,
  });
  const artistName = show?.artistName || bookingArtist;

  const [artistContext, artistProfile, artistLinks, setlistSongs] = artistName
    ? await Promise.all([
        resolveBookingArtistContext({
          artistName,
          artistSlug: show?.artistSlug || null,
          dateKey: date,
        }),
        getArtistProfile(artistName),
        getArtistLinks(artistName),
        getProbableSetlist(artistName),
      ])
    : [null, null, null, null];

  const setlistPreview = Array.isArray(setlistSongs)
    ? setlistSongs
        .map((song) => (typeof song?.name === 'string' ? song.name : null))
        .filter((song): song is string => Boolean(song))
        .slice(0, 6)
    : [];

  const spotifyUrl = artistProfile?.spotifyUrl || artistLinks?.spotify || null;
  const artistImage = artistProfile?.image || artistContext?.image || null;
  const showHref = show?.showId ? `/shows/${encodeURIComponent(show.showId)}` : null;
  const artistHref = artistContext?.artistSlug || show?.artistSlug
    ? `/artists/${encodeURIComponent(artistContext?.artistSlug || show?.artistSlug || '')}`
    : null;
  const bookingFlowUrl = `${siteOrigin()}/book/red-rocks-amphitheatre/shared?pickupHub=${encodeURIComponent(pickup.toLowerCase())}${date ? `&date=${encodeURIComponent(date)}` : ''}${artistName ? `&artist=${encodeURIComponent(artistName)}` : ''}`;
  const pickupTime = show?.startLocal
    ? `Final pickup timing is confirmed before show day for ${formatDateTime(show.startLocal, show.dateKey)}.`
    : 'Final pickup timing is confirmed before show day.';
  const supportPhone = PARR_PUBLIC_FACTS.support.phoneDisplay;
  const supportEmail = PARR_PUBLIC_FACTS.support.email;
  const checklistStorageKey = `parr-pack-checklist:${token}`;
  const guestRosterStorageKey = `parr-guest-roster:${token}`;
  const bookingUrl = `${siteOrigin()}/booking/${encodeURIComponent(token)}`;
  const guestShareUrl = `${bookingUrl}?view=guest`;
  const supportSmsHref = `sms:${PARR_PUBLIC_FACTS.support.phoneE164}?&body=${encodeURIComponent(`Hey - I need help with my Party At Red Rocks ride. Booking token: ${token}`)}`;
  const eventStartIso = show?.startLocal || (show?.dateKey ? `${show.dateKey}T19:00:00` : date ? `${date}T19:00:00` : null);
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is the bag policy for 2026?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Red Rocks only allows single-pocket bags or clear bags up to 13 x 15 x 8 inches. Hydration packs must be 2L or smaller with no more than one extra pocket.',
        },
      },
      {
        '@type': 'Question',
        name: 'Where is the shuttle pickup?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Your pickup is at ${pickupLocation.name}, ${pickupLocation.address}. Watch for the final boarding or return-zone text from your driver on show day.`,
        },
      },
      {
        '@type': 'Question',
        name: 'Can I bring a Camelbak?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Hydration packs are allowed if they are 2L or smaller, have no more than one extra pocket, and are empty before you reach security.',
        },
      },
    ],
  };
  const eventSchema = artistName && eventStartIso ? {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: `${artistName} at Red Rocks Amphitheatre`,
    startDate: eventStartIso,
    location: {
      '@type': 'MusicVenue',
      name: show?.venueName || 'Red Rocks Amphitheatre',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '18300 W Alameda Pkwy',
        addressLocality: 'Morrison',
        addressRegion: 'CO',
        postalCode: '80465',
        addressCountry: 'US',
      },
    },
    performer: {
      '@type': 'PerformingGroup',
      name: artistName,
    },
    organizer: {
      '@type': 'Organization',
      name: PARR_PUBLIC_FACTS.operatorName,
      url: siteOrigin(),
    },
    url: bookingUrl,
  } : null;

  return (
    <main className="min-h-screen bg-[#050816] px-4 pb-14 pt-24 text-white sm:px-6 lg:px-8">
      <section className="mx-auto flex max-w-6xl flex-col gap-6">
        <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[#0b1224] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.42)] sm:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,176,124,0.18),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(143,208,255,0.12),transparent_24%)]" />
          <div className="relative">
            <BrandMark className="mb-4" variant="booking" />
            <div className="text-[12px] font-black uppercase tracking-[0.2em] text-[var(--brand-orange)]">Booking Confirmed</div>
            <div className="mt-5 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              <div>
                <h1 className="text-3xl font-black tracking-[-0.03em] text-white sm:text-4xl">
                  {firstName ? `Thanks, ${firstName} - your shuttle is confirmed.` : 'Your shuttle is confirmed.'}
                </h1>
                <p className="mt-3 max-w-2xl text-white/76">Your ride to Red Rocks is locked in. Your booking page is now the live source for pickup details, seat count, and any changes.</p>
                <div className="mt-5 flex flex-wrap gap-3 text-sm font-black uppercase tracking-[0.16em] text-white">
                  <span className={infoPillClass}>{pickup} pickup</span>
                  <span className={infoPillClass}>{formatShortDate(date)}</span>
                  <span className={infoPillClass}>{seats} seat{seats === 1 ? '' : 's'}</span>
                  <span className={`rounded-full border px-4 py-2 text-[12px] ${badge(status)}`}>Status: {label(status)}</span>
                </div>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
                <div className="text-[11px] font-black uppercase tracking-[0.18em] text-white/46">Concierge note</div>
                <div className="mt-4 grid gap-3 text-sm text-white/76">
                  <div className="rounded-[18px] border border-white/10 bg-white/[0.04] px-4 py-3">Pickup timing is confirmed before show day.</div>
                  <div className="rounded-[18px] border border-white/10 bg-white/[0.04] px-4 py-3">Your return ride after the show is already included.</div>
                  <div className="rounded-[18px] border border-white/10 bg-white/[0.04] px-4 py-3">Need help before the show? Text {supportPhone} or email {supportEmail}.</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {!isGuestView ? (
          <PublicBookingShare
            guestShareUrl={guestShareUrl}
            bookingFlowUrl={bookingFlowUrl}
            showName={artistName || 'your Red Rocks show'}
            showDateLabel={formatShortDate(date)}
            pickupLabel={pickupLocation.name}
            pickupTimeLabel={show?.startLocal ? formatDateTime(show.startLocal, show.dateKey) : 'timing updates coming soon'}
            seatCount={seats}
            storageKey={guestRosterStorageKey}
          />
        ) : (
          <section className="rounded-[28px] border border-white/10 bg-[#09101f] p-6">
            <div className="text-[12px] font-black uppercase tracking-[0.2em] text-[var(--brand-orange)]">Guest View</div>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-white/76">
              You are viewing the guest-safe version of this shuttle dashboard. Packing tips, timeline, and return guidance are all here. Primary-booker controls stay hidden on this shared link.
            </p>
          </section>
        )}

        <BookingRideSummaryCard
          showStartRaw={show?.startLocal || null}
          fallbackDate={show?.dateKey || date}
          pickupName={pickupLocation.name}
          pickupAddress={pickupLocation.address}
          pickupMapsUrl={pickupLocation.googleMapsUrl}
          supportPhoneDisplay={supportPhone}
          supportPhoneE164={PARR_PUBLIC_FACTS.support.phoneE164}
        />

        <section className="rounded-[28px] border border-white/10 bg-[#09101f] p-6">
          <div className="text-[12px] font-black uppercase tracking-[0.2em] text-[var(--brand-orange)]">What Happens Next</div>
          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            <div className="rounded-[22px] border border-white/10 bg-black/20 p-5">
              <div className="text-[11px] font-black uppercase tracking-[0.18em] text-white/46">Before You Head Out</div>
              <p className="mt-3 text-sm leading-7 text-white/76">{pickupLocation.arrivalNote} Keep your phone on in case we text a boarding update.</p>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-black/20 p-5">
              <div className="text-[11px] font-black uppercase tracking-[0.18em] text-white/46">During The Ride</div>
              <p className="mt-3 text-sm leading-7 text-white/76">Your seat count is set, your ride to the venue is covered, and your return ride after the show is already included.</p>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-black/20 p-5">
              <div className="text-[11px] font-black uppercase tracking-[0.18em] text-white/46">Need Anything?</div>
              <p className="mt-3 text-sm leading-7 text-white/76">Text {supportPhone} or email {supportEmail} if you need help with pickup, timing, or a booking change.</p>
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-white/10 bg-[#09101f] p-6">
          <BookingShowDayTimeline
            showStartRaw={show?.startLocal || null}
            fallbackDate={show?.dateKey || date}
            pickupName={pickupLocation.name}
          />
        </section>

        {!isGuestView ? (
          <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[28px] border border-white/10 bg-[#09101f] p-6">
            <div className="text-[12px] font-black uppercase tracking-[0.2em] text-[var(--brand-orange)]">Your Pickup</div>
            <div className="mt-5 rounded-[22px] border border-white/10 bg-black/20 p-5">
              <h2 className="mt-2 text-2xl font-black uppercase tracking-[-0.03em] text-white">{pickupLocation.name}</h2>
              <p className="mt-2 text-sm font-semibold text-white/78">{pickupLocation.address}</p>
              <p className="mt-4 text-sm leading-7 text-white/76">{pickupLocation.description}</p>
              <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-[11px] font-black uppercase tracking-[0.18em] text-white/46">Pickup Time</dt>
                  <dd className="mt-2 text-sm leading-6 text-white/82">{pickupTime}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-black uppercase tracking-[0.18em] text-white/46">Return Guarantee</dt>
                  <dd className="mt-2 text-sm leading-6 text-white/82">Your return ride is built into this shuttle booking after the show.</dd>
                </div>
              </dl>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href={pickupLocation.googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={secondaryActionClass}
                >
                  Open In Google Maps
                </a>
                {pickupLocation.menuUrl ? (
                  <a
                    href={pickupLocation.menuUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={secondaryActionClass}
                  >
                    {pickupLocation.menuLabel || 'View Menu'}
                  </a>
                ) : pickupLocation.websiteUrl ? (
                  <a
                    href={pickupLocation.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={secondaryActionClass}
                  >
                    {pickupLocation.websiteLabel || 'Visit Website'}
                  </a>
                ) : null}
              </div>
              <p className="mt-5 text-sm font-semibold text-white/72">Arrive 10-15 minutes early.</p>
              <p className="mt-2 text-sm leading-6 text-white/72">{pickupLocation.instructions}</p>
              {pickupLocation.amenities?.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {pickupLocation.amenities.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/12 bg-black/20 px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-white/74"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[#09101f] p-6">
            <div id="manage-booking" className="text-[12px] font-black uppercase tracking-[0.2em] text-[var(--brand-orange)]">Manage Booking</div>
            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-[11px] font-black uppercase tracking-[0.18em] text-white/48">Name</dt>
                <dd className="mt-1 text-base font-semibold text-white">{customerName || 'Guest'}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-black uppercase tracking-[0.18em] text-white/48">Email</dt>
                <dd className="mt-1 text-base font-semibold text-white">{typeof customer.email === 'string' ? customer.email : 'Not available'}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-black uppercase tracking-[0.18em] text-white/48">Payment</dt>
                <dd className="mt-1 text-lg font-black text-white">{paymentStatus === 'paid' ? 'Paid' : 'Not Paid'}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-black uppercase tracking-[0.18em] text-white/48">Amount</dt>
                <dd className="mt-1 text-lg font-black text-white">{formatMoney(payment.totalPaid ?? payment.totalDue)}</dd>
              </div>
            </dl>
            <p className="mt-5 text-sm leading-6 text-white/74">
              {cancelAllowed
                ? refundEligible
                  ? 'Cancel at least 48 hours before departure for a full refund to the original payment method.'
                  : 'You can still cancel this seat before departure, but the 48-hour refund window has passed.'
                : status === 'cancelled'
                  ? 'This booking has already been cancelled.'
                  : 'Online cancellation is no longer available because this departure has already passed.'}
            </p>
            <div className="mt-5">
              <PublicBookingActions
                token={token}
                canCancel={cancelAllowed}
                alreadyCancelled={status === 'cancelled'}
                refundEligible={refundEligible}
                refundAmountLabel={formatMoney(payment.totalPaid ?? payment.totalDue)}
              />
            </div>
          </div>
          <section className="rounded-[28px] border border-white/10 bg-[#09101f] p-6">
            <div className="text-[12px] font-black uppercase tracking-[0.2em] text-[var(--brand-orange)]">Refund & Cancellation Details</div>
          <div className="mt-5 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-[22px] border border-white/10 bg-black/20 p-5">
              <div className="text-[11px] font-black uppercase tracking-[0.18em] text-white/46">The 48-Hour Rule</div>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-white/78">
                <li>Full refund when you cancel at least 48 hours before the scheduled shuttle departure time.</li>
                <li>Cancellations within 48 hours of departure and no-shows are non-refundable.</li>
                <li>Use this dashboard to cancel so the request is timestamped correctly.</li>
              </ul>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-black/20 p-5">
              <div className="text-[11px] font-black uppercase tracking-[0.18em] text-white/46">Refund Timeline</div>
              <ol className="mt-4 space-y-3 text-sm leading-7 text-white/78">
                <li>1. As soon as you cancel, the refund request is triggered on our side.</li>
                <li>2. It usually takes 3-7 business days for our bank to release the funds.</li>
                <li>3. Your bank may take a few more business days to post the credit to your statement.</li>
                <li>4. You will receive an automated refund or cancellation email once the request is initiated.</li>
              </ol>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-black/20 p-5 lg:col-span-2">
              <div className="text-[11px] font-black uppercase tracking-[0.18em] text-white/46">Important Logistics</div>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-4 text-sm leading-7 text-white/80">
                  <span className="font-black text-white">Original payment only.</span> Refunds go back to the exact card used at checkout. We cannot reroute refunds to Zelle, Venmo, or a different card.
                </div>
                <div className="rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-4 text-sm leading-7 text-white/80">
                  <span className="font-black text-white">Inside 48 hours?</span> If you cannot make the ride, text {supportPhone}. We may be able to help you gift the seat, even when a refund is no longer available.
                </div>
              </div>
            </div>
          </div>
        </section>

            </section>
        ) : null}

        <section className="rounded-[28px] border border-white/10 bg-[#09101f] p-6">
          <div className="text-[12px] font-black uppercase tracking-[0.2em] text-[var(--brand-orange)]">Get Ready For Your Show</div>
          {show && artistName ? (
            <div className="mt-5 grid gap-5 lg:grid-cols-[auto_1fr]">
              <div className="relative h-28 w-28 overflow-hidden rounded-[24px] border border-white/10 bg-white/6">
                {artistImage ? (
                  <Image src={artistImage} alt={`${artistName} artist image`} fill className="object-cover" unoptimized />
                ) : (
                  <div className="flex h-full items-center justify-center text-center text-[10px] font-black uppercase tracking-[0.16em] text-white/42">Artist</div>
                )}
              </div>
              <div className="min-w-0">
                <div className="text-2xl font-black uppercase tracking-[-0.03em] text-white">{artistName}</div>
                <p className="mt-2 text-sm text-white/68">{formatDateTime(show.startLocal, show.dateKey)} @ {show.venueName || 'Red Rocks Amphitheatre'}</p>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-white/74">
                  {artistContext?.bio || `${artistName} is on deck for your Red Rocks night. Use the show and artist links below to get context before pickup.`}
                </p>
                {artistContext?.genres?.length ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {artistContext.genres.slice(0, 4).map((genre) => (
                      <span key={genre} className="rounded-full border border-white/12 bg-black/20 px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-white/74">
                        {genre}
                      </span>
                    ))}
                  </div>
                ) : null}
                <div className="mt-4 flex flex-wrap gap-3">
                  {showHref ? (
                    <Link href={showHref} className={secondaryActionClass}>
                      View Show Page
                    </Link>
                  ) : null}
                  {artistHref ? (
                    <Link href={artistHref} className={secondaryActionClass}>
                      View Artist Guide
                    </Link>
                  ) : null}
                  {spotifyUrl ? <a href={spotifyUrl} target="_blank" rel="noreferrer" className={secondaryActionClass}>Spotify</a> : null}
                  {artistLinks?.appleMusic ? <a href={artistLinks.appleMusic} target="_blank" rel="noreferrer" className={secondaryActionClass}>Apple Music</a> : null}
                  {artistLinks?.youtube ? <a href={artistLinks.youtube} target="_blank" rel="noreferrer" className={secondaryActionClass}>YouTube</a> : null}
                </div>
                {setlistPreview.length ? (
                  <p className="mt-4 text-sm leading-7 text-white/70">
                    <span className="font-black text-white">Setlist vibes:</span> {setlistPreview.slice(0, 5).join(' • ')}
                  </p>
                ) : null}
              </div>
            </div>
          ) : (
            <p className="mt-5 text-sm text-white/70">Show and artist context will appear here when the booking resolves to a live event.</p>
          )}
        </section>

        <section className="rounded-[28px] border border-white/10 bg-[#09101f] p-6">
          <div className="text-[12px] font-black uppercase tracking-[0.2em] text-[var(--brand-orange)]">Red Rocks Venue Policies & Packing Tips</div>
          <p className="mt-3 text-sm leading-6 text-white/72">Use this as your show-day cheat sheet while you pack. The bag rules are strict and security will turn away the wrong setup.</p>
          <div className="mt-5 grid gap-5 xl:grid-cols-2">
            <div className="rounded-[22px] border border-white/10 bg-black/20 p-5">
              <div className="text-[11px] font-black uppercase tracking-[0.18em] text-white/46">Bag Policy</div>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-white/78">
                <li>Single-pocket bags or clear bags only, up to 13" x 15" x 8".</li>
                <li>Purses and fanny packs should stay at 6" x 9" or smaller.</li>
                <li>Hydration packs are allowed up to 2L with no more than one extra pocket.</li>
                <li>Everything needs to fit under your 18" x 12" seat space.</li>
              </ul>
            </div>
            <BookingPackChecklist storageKey={checklistStorageKey} />
            <div className="rounded-[22px] border border-white/10 bg-black/20 p-5">
              <div className="text-[11px] font-black uppercase tracking-[0.18em] text-white/46">Leave This On The Shuttle</div>
              <div className="mt-4 space-y-3">
                {[
                  'Multi-pocket backpacks or standard hiking bags.',
                  'Alcohol, marijuana, glass bottles, aluminum cans, or any open-container setup.',
                  'Umbrellas, aerosols, hard-sided coolers, or strollers.',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-6 text-white/80">
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-rose-300/30 bg-rose-400/12 text-[11px] font-black text-rose-100">×</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-black/20 p-5">
              <div className="text-[11px] font-black uppercase tracking-[0.18em] text-white/46">Tailgating & Return</div>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-white/78">
                <li>Tailgating should stay at the rear of the vehicle and cannot block traffic.</li>
                <li>No glass, no kegs, and no open flames. Small propane grills are only okay when there is no fire ban.</li>
                <li>Your driver will text pickup instructions before the end of the show. Do not wander off and miss the shuttle.</li>
                <li>If you miss the shuttle, rideshare pickup is a long downhill walk with surge pricing and major waits.</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-white/10 bg-[#09101f] p-6">
          <div className="text-[12px] font-black uppercase tracking-[0.2em] text-[var(--brand-orange)]">Plan Your Red Rocks Night</div>
          <p className="mt-3 text-sm leading-6 text-white/72">Helpful guides if you want them.</p>
          <div className="mt-5 -mx-1 flex gap-3 overflow-x-auto px-1 pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {[
              { label: 'History', href: '/red-rocks/history' },
              { label: 'Geology', href: '/red-rocks/geology' },
              { label: 'Best Seats', href: '/red-rocks/visiting-guide' },
              { label: 'Weather', href: '/red-rocks/weather' },
              { label: 'What To Bring', href: '/red-rocks/what-to-wear' },
              { label: 'Tailgating', href: '/guide/tailgate-faq' },
              { label: 'Parking Reality', href: '/red-rocks/parking' },
              { label: 'Red Rocks Tips', href: '/red-rocks/visiting-guide' },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`shrink-0 ${secondaryActionClass}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-[#ffb07c]/20 bg-[linear-gradient(135deg,rgba(255,176,124,0.12),rgba(11,18,36,0.95))] p-6">
          <div className="text-[12px] font-black uppercase tracking-[0.2em] text-[var(--brand-orange)]">Flying In For The Show?</div>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/78">
            We&apos;ll pick you up at the airport, make a quick stop for drinks or essentials, give you time to check in, and get you downtown before the night starts.
          </p>
          <div className="mt-4 text-2xl font-black uppercase tracking-[-0.03em] text-white">Flat $89</div>
          <div className="mt-5">
            <Link
              href="/book/red-rocks-amphitheatre/private?service=airport&source=booking-hub"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#ffb07c]/30 bg-[#ffb07c]/12 px-5 text-sm font-black uppercase tracking-[0.16em] text-white no-underline transition hover:bg-[#ffb07c]/18"
            >
              Add Airport Pickup
            </Link>
          </div>
        </section>

        <BookingSupportCard
          showName={artistName || 'your Red Rocks show'}
          phoneDisplay={supportPhone}
          phoneE164={PARR_PUBLIC_FACTS.support.phoneE164}
          websiteUrl={siteOrigin()}
        />

        <section className="rounded-[28px] border border-white/10 bg-[#09101f] p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="text-[12px] font-black uppercase tracking-[0.2em] text-[var(--brand-orange)]">My Night Plan</div>
              <p className="mt-3 text-sm leading-6 text-white/72">
                {isGuestView
                  ? 'The primary booker can drop the meetup plan here so the whole crew sees the same playbook.'
                  : 'Add the meetup plan, bar stop, or crew notes you do not want to forget.'}
              </p>
            </div>
            {isGuestView ? (
              <Link
                href={bookingFlowUrl}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#ffb07c]/28 bg-[#ffb07c]/14 px-5 text-sm font-black uppercase tracking-[0.16em] text-white no-underline transition hover:bg-[#ffb07c]/20"
              >
                Grab Your Seat - $59
              </Link>
            ) : null}
          </div>
          <div className="mt-5">
            {!isGuestView ? (
              <PublicBookingNotes token={token} initialNotes={order.notes || ''} />
            ) : order.notes ? (
              <div className="rounded-[22px] border border-white/10 bg-black/20 p-5">
                <div className="text-[11px] font-black uppercase tracking-[0.18em] text-white/46">Shared By Your Group Lead</div>
                <p className="mt-4 whitespace-pre-line text-sm leading-7 text-white/80">{order.notes}</p>
              </div>
            ) : (
              <div className="rounded-[22px] border border-white/10 bg-black/20 p-5 text-sm leading-7 text-white/72">
                No custom meetup note has been added yet. Use the timeline, pickup card, and checklist above as the default game plan.
              </div>
            )}
          </div>
        </section>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        {eventSchema ? (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
          />
        ) : null}
      </section>
      <BookingStickyHelp
        smsHref={supportSmsHref}
        phoneLabel={supportPhone}
      />
    </main>
  );
}
