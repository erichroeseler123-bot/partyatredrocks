import { notFound } from "next/navigation";
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
    <main className="min-h-screen bg-black text-white px-6 py-20">
      <h1 className="text-5xl font-black mb-2">{venue.name}</h1>
      <p className="text-zinc-400 mb-8">
        {venue.city}, {venue.state}
      </p>

      <p className="mb-12 text-lg">
        <strong>$50 per person round-trip shuttle</strong><br />
        $250 minimum · Pay cash at pickup
      </p>

      <h2 className="text-3xl font-bold mb-6">
        Upcoming Shows (90 Days)
      </h2>

      {events.length === 0 && (
        <p className="text-zinc-500">No upcoming events listed.</p>
      )}

      <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <li
            key={event.id}
            className="rounded-xl overflow-hidden border border-zinc-800"
          >
            {event.performers?.[0]?.image && (
              <img
                src={event.performers[0].image}
                alt={event.title}
                className="h-40 w-full object-cover"
              />
            )}
            <div className="p-4">
              <div className="font-semibold">{event.title}</div>
              <div className="text-sm text-zinc-400">
                {new Date(event.datetime_local).toLocaleString()}
              </div>
              <a
                href={event.url}
                target="_blank"
                className="underline text-sm mt-2 inline-block"
              >
                View Tickets
              </a>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}

