// components/utilities/ConcertCalendar.tsx
import Link from 'next/link';

type Event = { artist: string; date: string; venue: string; slug: string };

const staticData: Event[] = [
  { artist: 'CRANKDAT', date: '2026-03-27', venue: 'Red Rocks', slug: 'crankdat' },
  { artist: 'Ravenscoon', date: '2026-03-28', venue: 'Mission Ballroom', slug: 'ravenscoon' },
  { artist: 'INZO', date: '2026-04-03', venue: 'Ball Arena', slug: 'inzo' },
  // Add 5-10 more for demo
];

export default function ConcertCalendar() {
  const today = new Date();
  const next30Days = new Date(today);
  next30Days.setDate(today.getDate() + 30);

  const upcoming = staticData
    .filter(event => {
      const d = new Date(event.date);
      return d >= today && d <= next30Days;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 8);

  return (
    <div className="panel-soft rounded-2xl p-6 mb-10 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      <h3 className="text-xl font-black uppercase mb-5 tracking-tight">Denver Concerts – Next 30 Days</h3>
      <div className="space-y-4">
        {upcoming.map(event => (
          <div key={event.slug} className="flex justify-between items-center">
            <div>
              <p className="font-bold text-white">{event.artist}</p>
              <p className="text-sm text-muted">
                {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {event.venue}
              </p>
            </div>
            <Link
              href="/book-shuttle"
              className="btn-primary"
            >
              Book Shuttle
            </Link>
          </div>
        ))}
      </div>
      <div className="mt-5 text-center">
        <Link href="/guide/events/2026-season-preview" className="text-sm text-muted hover:text-white">
          View full calendar →
        </Link>
      </div>
    </div>
  );
}
