import Image from 'next/image';
import Link from 'next/link';
import PublicBookingActions from '@/components/booking/PublicBookingActions';
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
  return showStart.getTime() - Date.now() > 24 * 60 * 60 * 1000;
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
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
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
  const shareUrl = `${siteOrigin()}/book/red-rocks-amphitheatre/shared?pickupHub=${encodeURIComponent(pickup.toLowerCase())}${date ? `&date=${encodeURIComponent(date)}` : ''}${artistName ? `&artist=${encodeURIComponent(artistName)}` : ''}`;
  const shareTitle = artistName
    ? `Join our ${pickup} shuttle for ${artistName} at Red Rocks`
    : `Join our ${pickup} shuttle to Red Rocks`;
  const shareText = artistName
    ? `We booked the ${pickup} shuttle for ${artistName} on ${formatShortDate(date)}. Join our shuttle here.`
    : `We booked the ${pickup} Red Rocks shuttle. Join our shuttle here.`;
  const pickupTime = show?.startLocal
    ? `Final pickup timing is confirmed before show day for ${formatDateTime(show.startLocal, show.dateKey)}.`
    : 'Final pickup timing is confirmed before show day.';
  const supportPhone = PARR_PUBLIC_FACTS.support.phoneDisplay;
  const supportEmail = PARR_PUBLIC_FACTS.support.email;

  return (
    <main className="min-h-screen bg-[#050816] px-4 pb-14 pt-24 text-white sm:px-6 lg:px-8">
      <section className="mx-auto flex max-w-6xl flex-col gap-6">
        <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[#0b1224] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.42)] sm:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,176,124,0.18),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(143,208,255,0.12),transparent_24%)]" />
          <div className="relative">
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

        <PublicBookingShare
          shareUrl={shareUrl}
          shareTitle={shareTitle}
          shareText={shareText}
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
                ? 'You can cancel this booking online until 24 hours before the show.'
                : status === 'cancelled'
                  ? 'This booking has already been cancelled.'
                  : 'Online cancellation is no longer available for this booking.'}
            </p>
            <div className="mt-5">
              <PublicBookingActions
                token={token}
                canCancel={cancelAllowed}
                alreadyCancelled={status === 'cancelled'}
              />
            </div>
          </div>
        </section>

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

        <section className="rounded-[28px] border border-white/10 bg-[#09101f] p-6">
          <div className="text-[12px] font-black uppercase tracking-[0.2em] text-[var(--brand-orange)]">Your Plan For The Night</div>
          <p className="mt-3 text-sm leading-6 text-white/72">Add anything you don&apos;t want to forget.</p>
          <div className="mt-5">
            <PublicBookingNotes token={token} initialNotes={order.notes || ''} />
          </div>
        </section>
      </section>
    </main>
  );
}
