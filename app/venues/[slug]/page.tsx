import { notFound } from "next/navigation";
import Link from "next/link";
import { getVenueEvents } from "@/lib/seatgeek";
import { VENUES } from "@/data/venues";

export const revalidate = 3600;

export default async function VenuePage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  // 🔴 SPECIAL CASE: RED ROCKS
  if (slug === "red-rocks-amphitheatre") {
    const RED_ROCKS_VENUE_ID = 196;
    const events = await getVenueEvents(RED_ROCKS_VENUE_ID);

    return (
      <main className="min-h-screen bg-black text-white px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-6xl font-black italic uppercase mb-12">
            Red Rocks Shuttle
          </h1>

          <div className="space-y-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex justify-between items-center border border-white/10 rounded-xl p-6"
              >
                <div>
                  <div className="text-zinc-400 text-sm">
                    {new Date(event.datetime_local).toDateString()}
                  </div>
                  <div className="text-xl font-bold">
                    {event.title}
                  </div>
                </div>

                <Link
                  href={`/book-shuttle?venue=red-rocks&eventId=${event.id}`}
                  className="bg-red-600 px-6 py-3 rounded-full text-xs font-black uppercase"
                >
                  Book Shuttle
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  // 🟢 ALL OTHER VENUES (Mishawaka, etc.)
const venue = VENUES[slug];
  if (!venue) return notFound();

  return (
    <main className="min-h-screen bg-black text-white px-6 py-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-6xl font-black italic uppercase mb-6">
          {venue.name}
        </h1>
        <p className="text-zinc-400">{venue.description}</p>
      </div>
    </main>
  );
}
