import Link from 'next/link';
import Image from 'next/image';

export default function VenueEventsGrid({ events }: { events: any[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {events.map((event: any) => {
        const imageUrl =
          event.performers?.[0]?.image || '/hero/hero-home.jpg';

        return (
          <Link
            key={event.id}
            href={`/shows/${event.id}`}
            className="group rounded-[2.5rem] overflow-hidden border border-zinc-800 bg-zinc-900/40 hover:border-red-600 transition"
          >
            {/* IMAGE */}
            <div className="relative w-full h-56 overflow-hidden">
              <Image
                src={imageUrl}
                alt={event.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            </div>

            {/* TEXT */}
            <div className="p-6">
              <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-1">
                {new Date(event.datetime_local).toLocaleDateString()}
              </p>

              <h3 className="text-xl font-black italic uppercase leading-tight text-white">
                {event.title}
              </h3>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
