import { fetchSeatGeekEventsByVenue } from "@/lib/seatgeek";
import VenueEventsGrid from "./VenueEventsGrid";

type Props = {
  venue: {
    seatgeekVenueId?: number | null;
    name: string;
    slug: string; // 👈 ADD THIS
  };
};

export default async function VenueShows({ venue }: Props) {
  if (!venue.seatgeekVenueId) {
    return (
      <section>
        <h2 className="text-zinc-500 font-bold uppercase tracking-widest">
          Upcoming Shows
        </h2>
        <p className="text-zinc-400">No events available.</p>
      </section>
    );
  }

  const events = await fetchSeatGeekEventsByVenue(
    venue.seatgeekVenueId
  );

  return (
    <section>
      <h2 className="text-zinc-500 font-bold uppercase tracking-widest">
        Upcoming Shows
      </h2>

      {events.length === 0 ? (
        <p className="text-zinc-400">No upcoming events listed.</p>
      ) : (
        <VenueEventsGrid
          events={events}
          venueSlug={venue.slug} // ✅ THIS IS THE FIX
        />
      )}
    </section>
  );
}
