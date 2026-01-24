import { notFound } from "next/navigation";
import Image from "next/image";
import { venues } from "@/data/venues";
import { fetchSeatGeekEventsByVenueSlug } from "@/lib/seatgeek";

export const dynamic = "force-dynamic";

type Props = {
  params: { slug: string };
};

export default async function VenuePage({ params }: Props) {
  const { slug } = params;
  const venue = venues[slug];

  if (!venue) notFound();

  // ✅ ONE source of truth: SeatGeek venue slug
  const events = await fetchSeatGeekEventsByVenueSlug(venue.slug);

  // Group events by Month + Year
  const eventsByMonth = events.reduce<Record<string, any[]>>(
    (acc, event) => {
      const month = new Date(event.datetime_local).toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      });

      acc[month] = acc[month] || [];
      acc[month].push(event);
      return acc;
    },
    {}
  );

  return (
    <main className="min-h-screen bg-black text-white px-6 py-20">
      {/* HEADER */}
      <header className="mb-16 border-b border-white/10 pb-10">
        <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tight">
          {venue.name}
        </h1>

        <p className="mt-4 text-red-600 font-bold uppercase tracking-[0.35em] text-xs">
          2026 Intelligence Feed · {events.length} Events
        </p>
      </header>

      {/* EVENTS */}
      <div className="space-y-24">
        {Object.entries(eventsByMonth).map(([month, monthEvents]) => (
          <section key={month}>
            <h2 className="text-red-600 font-black uppercase text-xs tracking-[0.3em] mb-8">
              {month}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {monthEvents.map((event) => {
                const image =
                  event.performers?.[0]?.image ?? "/images/fallback.jpg";

                return (
                  <a
                    key={event.id}
                    href={event.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-white transition"
                  >
                    <div className="relative aspect-[16/9] bg-black">
                      <Image
                        src={image}
                        alt={event.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>

                    <div className="p-4">
                      <h3 className="font-bold text-lg leading-tight">
                        {event.title}
                      </h3>

                      <p className="mt-1 text-sm text-zinc-400">
                        {new Date(event.datetime_local).toLocaleString()}
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
