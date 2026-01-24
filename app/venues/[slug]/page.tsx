import { notFound } from "next/navigation";
import Image from "next/image";
import { venues } from "@/data/venues";
import { fetchSeatGeekEventsByVenue } from "@/lib/seatgeek";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function VenuePage({ params }: Props) {
  const { slug } = await params;
  const venue = venues[slug];

  if (!venue) notFound();

  const events = venue.seatgeekVenueId
    ? await fetchSeatGeekEventsByVenue(venue.seatgeekVenueId)
    : [];

  return (
    <main className="min-h-screen bg-black text-white p-12">
      {/* HEADER */}
      <div className="mb-20 border-b border-white/5 pb-10">
        <h1 className="text-8xl font-black italic uppercase tracking-tighter leading-none">
          {venue.name}
        </h1>
        <p className="text-red-600 font-bold uppercase tracking-[0.4em] mt-4 italic text-xs">
          2026 Intelligence Feed // {events.length} Events Active
        </p>
      </div>

      {/* EVENTS */}
      <div className="space-y-32">
        {Object.entries(
          events.reduce<Record<string, any[]>>((acc, event) => {
            const month = new Date(event.datetime_local).toLocaleString(
              "en-US",
              { month: "long", year: "numeric" }
            );
            acc[month] = acc[month] || [];
            acc[month].push(event);
            return acc;
          }, {})
        ).map(([month, monthEvents]) => (
          <section key={month}>
            <h2 className="text-red-600 font-black uppercase text-xs mb-10 tracking-[0.5em] italic border-l-4 border-red-600 pl-6">
              {month}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {monthEvents.map((event) => {
                const image =
                  event.performers?.[0]?.image ||
                  "/images/fallback.jpg";

                return (
                  <a
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
                        {new Date(event.datetime_local).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric" }
                        )}
                      </p>

                      <h3 className="text-2xl font-black italic uppercase mb-3 group-hover:text-yellow-400 transition-colors">
                        {event.title}
                      </h3>

                      <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest truncate">
                        {event.performers?.map((p: any) => p.name).join(", ")}
                      </p>
                    </div>
                  </a>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
