import Image from "next/image";
import { RedRocksEvent } from "@/lib/redrocksEvents";

export default function RedRocksShowsGrid({
  events,
}: {
  events: RedRocksEvent[];
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {events.map((event) => (
        <a
          key={event.id}
          href={event.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-white transition"
        >
          <div className="relative aspect-[16/9] w-full bg-black">
            {event.image && (
              <Image
                src={event.image}
                alt={event.title}
                fill
                className="object-cover group-hover:scale-105 transition"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            )}
          </div>

          <div className="p-4">
            <h3 className="font-bold text-lg leading-tight">
              {event.title}
            </h3>
            <p className="text-sm text-zinc-400 mt-1">
              {new Date(event.datetime).toLocaleString()}
            </p>
          </div>
        </a>
      ))}
    </div>
  );
}
