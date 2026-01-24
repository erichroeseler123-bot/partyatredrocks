import { notFound } from "next/navigation";
import { venues } from "@/data/venues";
import { fetchSeatGeekEventsByVenue } from "@/lib/seatgeek";
import VenueEventsGrid from "@/components/VenueEventsGrid";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function VenuePage({ params }: Props) {
  const { slug } = await params;
  const venue = venues[slug];

  if (!venue) notFound();

  const events =
    venue.seatgeekVenueId
      ? await fetchSeatGeekEventsByVenue(venue.seatgeekVenueId)
      : [];

  return (
    <main className="min-h-screen bg-black text-white px-6 py-20">
      <h1 className="text-5xl font-black mb-2">{venue.name}</h1>
      <p className="text-zinc-400 mb-8">
        {venue.city}, {venue.state}
      </p>

      {/* SHUTTLE CTA */}
      <section className="mb-14">
        <p className="text-lg">
          <strong>$50 per person round-trip shuttle</strong>
          <br />
          $250 trip minimum · Cash / Venmo accepted
        </p>
      </section>

      {/* EVENTS */}
      <section>
        <h2 className="text-3xl font-bold mb-6">
          Upcoming Shows (90 Days)
        </h2>

        {events.length === 0 ? (
          <p className="text-zinc-500">No upcoming events listed.</p>
        ) : (
          <VenueEventsGrid events={events} />
        )}
      </section>
    </main>
  );
}
