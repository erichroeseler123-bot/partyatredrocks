import Link from "next/link";
import { venues } from "@/data/venues";
import { fetchSeatGeekEventsByVenue } from "@/lib/seatgeek";
import ArtistGuide from "@/components/ArtistGuide";

export const dynamic = "force-dynamic";

export default async function MishawakaPage() {
  const venue = venues["mishawaka-amphitheatre"];

  if (!venue || !venue.seatgeekVenueId) {
    return (
      <main className="min-h-screen bg-black text-white px-6 py-20">
        <h1 className="text-4xl font-black">Mishawaka Amphitheatre</h1>
        <p className="text-zinc-400 mt-4">Venue data unavailable.</p>
      </main>
    );
  }

  const events = await fetchSeatGeekEventsByVenue(venue.seatgeekVenueId);

  return (
    <main className="min-h-screen bg-black text-white px-6 py-20">
      <h1 className="text-5xl font-black mb-2">{venue.name}</h1>
      <p className="text-zinc-400 mb-8">
        {venue.city}, {venue.state}
      </p>

      {/* Shuttle CTA */}
      <section className="mb-12">
        <p className="text-lg">
          <strong>$50 per person round-trip shuttle</strong>
          <br />
          $250 trip minimum · Pay at pickup
        </p>
        <Link
          href="/book-shuttle"
          className="inline-block mt-4 underline"
        >
          Book a shuttle
        </Link>
      </section>

      {/* Events */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6">Upcoming Shows</h2>

        {events.length === 0 && (
          <p className="text-zinc-500">No upcoming events listed.</p>
        )}

        <ul className="space-y-4">
          {events.map((event) => (
            <li
              key={event.id}
              className="border border-zinc-800 rounded-lg p-4 hover:border-white transition"
            >
              <div className="font-semibold">{event.title}</div>
              <div className="text-sm text-zinc-400">
                {new Date(event.datetime_local).toLocaleString()}
              </div>
              <a
                href={event.url}
                target="_blank"
                className="text-sm underline mt-1 inline-block"
              >
                View tickets
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* Optional enrichment */}
      <ArtistGuide />
    </main>
  );
}

