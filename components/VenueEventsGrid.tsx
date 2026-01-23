import Link from "next/link";
import Image from "next/image";

export default function VenueEventsGrid({ events }: { events: any[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {events.map((event) => {
        const image =
          event.performers?.[0]?.image ||
          event.performers?.[0]?.images?.huge ||
          null;

        return (
          <Link
            key={event.id}
            href={`/shows/${event.id}`}
            className="group relative rounded-3xl border border-zinc-800 bg-zinc-950 overflow-hidden hover:border-white transition"
          >
            {/* IMAGE */}
            {image && (
              <div className="relative h-44 w-full">
                <Image
                  src={image}
                  alt={event.title}
                  fill
                  className="object-cover group-hover:scale-105 transition"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              </div>
            )}

            {/* CONTENT */}
            <div className="p-6">
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-2">
                {new Date(event.datetime_local).toLocaleDateString()}
              </p>

              <h3 className="text-xl font-black italic uppercase leading-tight">
                {event.title}
              </h3>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
