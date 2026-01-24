import { fetchSeatGeekEventsByVenueSlug } from "@/lib/seatgeek";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function MishawakaPage() {
  const events = await fetchSeatGeekEventsByVenueSlug(
    "mishawaka-amphitheatre"
  );

  return (
    <main className="min-h-screen bg-black text-white px-6 py-20">
      <header className="mb-14">
        <h1 className="text-5xl font-black mb-4">
          Mishawaka Amphitheatre
        </h1>
        <p className="text-zinc-400 max-w-xl">
          Bellvue, CO · Live events from SeatGeek
        </p>
      </header>

      <section>
        <h2 className="text-3xl font-bold mb-8">
          Upcoming Shows
        </h2>

        {events.length === 0 ? (
          <p className="text-zinc-400">
            No upcoming events listed.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <a
                key={event.id}
                href={event.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-white transition"
              >
                <div className="relative aspect-[16/9] bg-black">
                  {event.image && (
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
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
        )}
      </section>
    </main>
  );
}

