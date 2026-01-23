import Link from 'next/link';

export default function VenueEventsGrid({ events }: { events: any[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {events.map((event) => {
        const image =
          event.performers?.[0]?.image ||
          '/hero/hero-home.jpg'; // safe fallback

        return (
          <div
            key={event.id}
            className="group rounded-[2.5rem] overflow-hidden bg-zinc-900/40 border border-zinc-800 hover:border-red-500 transition"
          >
            {/* IMAGE */}
            <div className="relative h-56 overflow-hidden">
              <img
                src={image}
                alt={event.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            </div>

            {/* CONTENT */}
            <div className="p-6">
              <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">
                {new Date(event.datetime_local).toLocaleDateString()}
              </p>

              <h3 className="text-xl font-black italic uppercase leading-tight mt-1">
                {event.title}
              </h3>

              <div className="flex gap-3 mt-6">
                {/* INTERNAL SHOW PAGE */}
                <Link
                  href={`/shows/${event.id}`}
                  className="flex-1 text-center rounded-full border border-zinc-700 py-2 text-sm hover:border-white transition"
                >
                  Details
                </Link>

                {/* SEATGEEK TICKETS */}
                <a
                  href={event.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center rounded-full bg-red-600 py-2 text-sm font-bold hover:bg-red-500 transition"
                >
                  Tickets
                </a>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
