import { resolveSeatGeekVenue, seatgeekEventsByVenueId } from "@/lib/seatgeek";
import VenueEventsGrid from "./VenueEventsGrid";

type Props = {
  venue: {
    slug: string; // your site slug
    name: string; // display name
    seatgeekSlug?: string; // optional if you have it later
  };
};

export default async function VenueShows({ venue }: Props) {
  if (!venue?.slug || !venue?.name) {
    return (
      <section>
        <h2 className="text-zinc-500 font-bold uppercase tracking-widest">
          Upcoming Shows
        </h2>
        <p className="text-zinc-400">No events available.</p>
      </section>
    );
  }

  // Resolve SeatGeek venue (slug-first if seatgeekSlug exists, otherwise smart CO/Denver fallback)
  const sgVenue = await resolveSeatGeekVenue({
    targetName: venue.name,
    seatgeekSlug: venue.seatgeekSlug,
    siteSlug: venue.slug,
  });

  // Fetch events by numeric venue id (most reliable)
  const events = sgVenue ? await seatgeekEventsByVenueId(sgVenue.id) : [];

  return (
    <section>
      <h2 className="text-zinc-500 font-bold uppercase tracking-widest">
        Upcoming Shows
      </h2>

      {events.length === 0 ? (
        <p className="text-zinc-400">No upcoming events listed.</p>
      ) : (
        <VenueEventsGrid events={events} venueSlug={venue.slug} />
      )}
    </section>
  );
}
