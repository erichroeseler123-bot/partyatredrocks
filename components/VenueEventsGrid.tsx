import Link from "next/link";
import Image from "next/image";

export default function VenueEventsGrid({ events }: { events: any[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => {
        const performer = event.performers?.[0];
        const imageUrl = performer?.image;

        return (
          <Link
            key={event.id}
            href={`/shows/${event.id}`}
            className="group bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden hover:border-white transition"
          >
            {/* IMAGE */}
            {imageUrl && (
              <div className="relative w-full h-48 overflow-hidden">
                <Image
                  src={imageUrl}
                  alt={event.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              </div>
            )}

            {/* TEXT */}
            <div className="p-5">
              <p className="text-xs text-zinc-400 uppercase tracking-widest mb-1">
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

