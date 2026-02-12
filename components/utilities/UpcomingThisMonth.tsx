// components/utilities/UpcomingThisMonth.tsx
import Link from 'next/link';

type Show = { artist: string; date: string; slug: string };

const staticData: Show[] = [
  { artist: 'CRANKDAT', date: '2026-03-27', slug: 'crankdat' },
  { artist: 'Ravenscoon', date: '2026-03-28', slug: 'ravenscoon' },
  { artist: 'INZO', date: '2026-04-03', slug: 'inzo' },
  { artist: 'Murph Rocks', date: '2026-04-04', slug: 'its-murph' },
  { artist: 'ZINGARA', date: '2026-04-10', slug: 'zingara' },
  { artist: 'Liquid Stranger', date: '2026-04-11', slug: 'liquid-stranger' },
  // Add a few more from your list for demo
];

export default function UpcomingThisMonth() {
  const today = new Date();
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const upcoming = staticData
    .filter(show => {
      const d = new Date(show.date);
      return d >= today && d <= endOfMonth;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 6);

  if (upcoming.length === 0) return <p>No shows this month — check full lineup!</p>;

  return (
    <div className="bg-surface/60 border border-white/10 rounded-2xl p-6 mb-10 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      <h3 className="text-xl font-black uppercase mb-5 tracking-tight">Upcoming at Red Rocks This Month</h3>
      <div className="space-y-4">
        {upcoming.map(show => (
          <div key={show.slug} className="flex justify-between items-center">
            <div>
              <p className="font-bold text-white">{show.artist}</p>
              <p className="text-sm text-zinc-400">
                {new Date(show.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
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
        <Link href="/guide/events/2026-season-preview" className="text-sm text-zinc-400 hover:text-white">
          View full 2026 lineup →
        </Link>
      </div>
    </div>
  );
}
