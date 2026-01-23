import { getVenueEvents } from '@/lib/seatgeek';
import VenueEventsGrid from './VenueEventsGrid';

export default async function VenueShows({
  venueId,
}: {
  venueId: number;
}) {
  const events = await getVenueEvents(venueId);

  if (!events || events.length === 0) {
    return (
      <p className="text-zinc-500 mt-12">
        No upcoming events found.
      </p>
    );
  }

  return (
    <section className="mt-16">
      <VenueEventsGrid events={events} />
    </section>
  );
}
