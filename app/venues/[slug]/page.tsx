import { notFound } from "next/navigation";
import Link from "next/link";
import { getVenueEvents } from "@/lib/seatgeek";

export const revalidate = 3600; // 1 hour

export default async function VenuePage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  // Only apply this logic to Red Rocks
  if (slug !== "red-rocks-amphitheatre") {
    return notFound();
  }

  // SeatGeek venue ID for Red Rocks Amphitheatre
  const RED_ROCKS_VENUE_ID = 196; // this is correct

  const events = await getVenueEvents(RED_ROCKS_VENUE_ID);

  return (
    <main className="min-h-screen bg-black text-white px-6 py-24">
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <header className="mb-16">
          <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tight mb-6">
            Red Rocks Shuttle
          </h1>
          <p className="text-zinc-400 max-w-2xl">
            Round-trip shuttle service to Red Rocks Amphitheatre.
            Pickup anywhere in Denver. Driver waits after the show.
          </p>
        </header>

        {/* SHOW LIST */}
        <section>
          <h2 className="text-2xl font-black uppercase tracking-wide mb-8">
            Upcoming Shows
          </h2>

          <div className="space-y-6">
            {events.map((event) => {
              const date = new Date(event.datetime_local);

              return (
                <div
                  key={event.id}
                  className="flex flex-col md:flex-row md:items-center md:justify-between border border-white/10 rounded-xl p-6"
                >
                  <div>
                    <div className="text-sm text-zinc-400 mb-1">
                      {date.toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                    <div className="text-xl font-bold">
                      {event.title}
                    </div>
                  </div>

                  <Link
                    href={`/book-shuttle?venue=red-rocks&eventId=${event.id}`}
                    className="mt-4 md:mt-0 inline-block bg-red-600 hover:bg-red-500 transition px-6 py-3 rounded-full font-bold uppercase tracking-widest text-xs"
                  >
                    Book Shuttle
                  </Link>
                </div>
              );
            })}
          </div>

          {events.length === 0 && (
            <p className="text-zinc-500 mt-8">
              No upcoming shows found.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
