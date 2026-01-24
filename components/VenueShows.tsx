import { fetchSeatGeekEventsByVenueSlug } from "@/lib/seatgeek";
import VenueEventsGrid from "./VenueEventsGrid";

type Props = {
  venue: {
    slug: string;
    name: string;
  };
};

export default async function VenueShows({ venue }: Props) {
  if (!venue?.slug) {
    return (
      <section>
        <h2 className="text-zinc-500 font-bold uppercase tracking-widest">
          Upcoming Shows
        </h2>
        <p className="text-zinc-400">No events available.</p>
      </section>
    );
  }

  // ✅ Canonical SeatGeek fetch
  const events = await fetchSeatGeekEventsByVenueSlug(venue.slug);

  return (
    <section>
      <h2 className="text-zinc-500 font-bold uppercase tracking-widest mb-4">
        Upcoming Shows
      </h2>

      {events.length === 0 ? (
        <p className="text-zinc-400">No upcoming events listed.</p>
      ) : (
<VenueEventsGrid
  events={events}
  venueSlug={venue.slug}
/>
      )}
    </section>
  );
}
