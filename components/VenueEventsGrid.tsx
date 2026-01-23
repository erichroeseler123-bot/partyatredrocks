import Link from 'next/link';
import Image from 'next/image';

function pickBestImage(event: any): string | null {
  // SeatGeek usually provides performer images
  const p0 = event?.performers?.[0];
  const perfImg =
    p0?.image ||
    p0?.images?.huge ||
    p0?.images?.large ||
    p0?.images?.medium ||
    p0?.images?.small;

  // Some responses include venue image
  const venueImg =
    event?.venue?.image ||
    event?.venue?.images?.huge ||
    event?.venue?.images?.large;

  return perfImg || venueImg || null;
}

function shouldHideEvent(event: any): boolean {
  const title = String(event?.title || '').toLowerCase();
  // Kill the “Winter on the Rocks / Icelantic” hero item
  if (title.includes('winter on the rocks')) return true;
  if (title.includes('icelantic')) return true;
  return false;
}

export default function VenueEventsGrid({ events }: { events: any[] }) {
  const filtered = (events || []).filter((e) => !shouldHideEvent(e));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filtered.map((event: any) => {
        const img = pickBestImage(event);
        const dateLabel = event?.datetime_local
          ? new Date(event.datetime_local).toLocaleDateString()
          : '';

        const ticketUrl = event?.url; // SeatGeek event URL

        return (
          <div
            key={event.id}
            className="group rounded-[2.5rem] overflow-hidden border border-zinc-800 bg-zinc-950/40 hover:border-zinc-600 transition"
          >
            <Link href={`/shows/${event.id}`} className="block">
              <div className="relative h-44 w-full bg-black">
                {img ? (
                  <Image
                    src={img}
                    alt={event.title}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-zinc-600 text-xs">
                    No image
                  </div>
                )}

                {/* subtle depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/0" />

                <div className="absolute bottom-4 left-5 right-5">
                  <p className="text-zinc-300 text-[10px] font-black uppercase tracking-widest">
                    {dateLabel}
                  </p>
                  <h3 className="mt-1 text-xl font-black italic uppercase leading-none text-white">
                    {event.title}
                  </h3>
                  {event?.performers?.length ? (
                    <p className="mt-2 text-[10px] uppercase tracking-widest text-zinc-400 line-clamp-1">
                      {event.performers
                        .map((p: any) => p?.name)
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                  ) : null}
                </div>
              </div>
            </Link>

            <div className="px-5 py-4 flex items-center justify-between gap-3">
              <Link
                href={`/shows/${event.id}`}
                className="text-[11px] font-black uppercase tracking-widest text-white/90 hover:text-white"
              >
                View Show →
              </Link>

              {ticketUrl ? (
                <a
                  href={ticketUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] font-black uppercase tracking-widest px-4 py-2 rounded-full border border-zinc-700 bg-zinc-900/50 hover:bg-zinc-900 hover:border-zinc-500 transition"
                >
                  Buy Tickets
                </a>
              ) : (
                <span className="text-[11px] font-black uppercase tracking-widest text-zinc-600">
                  Tickets N/A
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
