import { getVenueEvents } from '@/lib/seatgeek';
import VenueEventsGrid from './VenueEventsGrid';

export default async function VenueShows({ venue }: { venue: any }) {
  if (!venue?.seatgeekVenueId) {
    return null;
  }

  // Pull events for this venue
  const events = await getVenueEvents(venue.seatgeekVenueId);

  if (!events || events.length === 0) {
    return (
      <section className="py-24">
        <p className="text-zinc-500 uppercase tracking-widest text-sm">
          No upcoming events found
        </p>
      </section>
    );
  }

  return (
    <section className="py-24">
      {/* SECTION HEADER */}
      <div className="mb-12">
        <h2 className="text-zinc-500 font-black uppercase tracking-widest flex items-center gap-4">
          <span className="w-8 h-px bg-zinc-800" />
          Upcoming Shows
        </h2>
      </div>

      {/* EVENTS GRID (WITH IMAGES) */}
      <VenueEventsGrid events={events} />
    </section>
  );
}
