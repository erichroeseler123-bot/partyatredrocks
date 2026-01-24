import Image from "next/image";
import Link from "next/link";

export default function VenueEventsGrid({ events }: { events: any[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {events.map((event) => {
        const image =
          event.performers?.[0]?.image || "/images/fallback.jpg";

        return (
          <Link
            key={event.id}
            href={`/shows/${event.slug}`}
            className="group relative rounded-[3rem] overflow-hidden border border-white/5 hover:border-yellow-400 transition-all shadow-xl"
          >
            {/* IMAGE */}
            <div className="relative h-56 w-full">
              <Image
                src={image}
                alt={event.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover opacity-70 group-hover:opacity-90 transition"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
            </div>

            {/* CONTENT */}
            <div className="p-8 bg-black/60 backdrop-blur">
              <p className="text-zinc-500 text-[10px] font-black uppercase mb-3 tracking-widest">
                {new Date(event.datetime_local).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </p>

              <h3 className="text-2xl font-black italic uppercase mb-3 group-hover:text-yellow-400 transition-colors">
                {event.title}
              </h3>

              <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest truncate">
                {event.performers?.map((p: any) => p.name).join(", ")}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
