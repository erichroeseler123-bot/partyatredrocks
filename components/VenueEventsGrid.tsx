import Link from 'next/link';

// FIXED: Removed broken SeatGeekEvent import, used 'any'
export default function VenueEventsGrid({ events }: { events: any[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event: any) => (
        <Link 
          key={event.id} 
          href={`/shows/${event.id}`}
          className="group bg-zinc-900/40 p-8 rounded-[2.5rem] border border-white/5 hover:border-yellow-400/50 transition-all"
        >
          <p className="text-zinc-500 text-[10px] font-black uppercase mb-4">
            {new Date(event.datetime_local).toLocaleDateString()}
          </p>
          <h3 className="text-2xl font-black italic uppercase leading-none group-hover:text-yellow-400">
            {event.title}
          </h3>
        </Link>
      ))}
    </div>
  );
}
