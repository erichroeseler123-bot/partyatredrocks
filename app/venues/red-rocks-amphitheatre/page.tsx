import Link from 'next/link';

const RED_ROCKS_SCHEDULE = [
  { date: "2026-02-07", event: "Icelantic’s Winter on the Rocks", support: "BigXthaPlug, Smino" },
  { date: "2026-03-27", event: "CRANKDAT", support: "Dr. Fresch, Smoakland" },
  { date: "2026-03-28", event: "Ravenscoon & Jantsen", support: "Jason Leech, DEV" },
  { date: "2026-04-03", event: "INZO", support: "What So Not, Lumasi" },
  { date: "2026-04-17", event: "Sublime", support: "Common Kings, Bumpin Uglies" },
  { date: "2026-04-18", event: "Sublime", support: "Pepper, Codefendants" },
  { date: "2026-04-20", event: "Ice Cube", support: "Big Boi, Czarface" },
  { date: "2026-05-16", event: "LSDREAM", support: "Morning LIGHTCODE + DREAMROCKS II" },
  { date: "2026-06-04", event: "Brit Floyd", support: "THE WALL" },
  { date: "2026-06-05", event: "Brit Floyd", support: "DARK SIDE" },
  { date: "2026-07-10", event: "The Avett Brothers", support: "The Lemonheads" },
  { date: "2026-08-17", event: "Train", support: "Barenaked Ladies" },
  { date: "2026-09-08", event: "Five Finger Death Punch", support: "20th Anniversary" }
  // ... rest of your 90+ shows
];

export default function RedRocksVenuePage() {
  const groupedShows = RED_ROCKS_SCHEDULE.reduce((acc: any, show) => {
    const monthYear = new Date(show.date).toLocaleString('default', { month: 'long', year: 'numeric' });
    if (!acc[monthYear]) acc[monthYear] = [];
    acc[monthYear].push(show);
    return acc;
  }, {});

  return (
    <main className="min-h-screen bg-black text-white p-12">
      <div className="mb-20 border-b border-white/5 pb-10 flex justify-between items-end">
        <div>
          <h1 className="text-8xl font-black italic uppercase tracking-tighter leading-none">Red Rocks</h1>
          <p className="text-red-600 font-black uppercase tracking-[0.4em] mt-4 italic text-[10px] underline decoration-red-600 decoration-2 underline-offset-8">2026 Intelligence Feed</p>
        </div>
        <div className="text-right hidden md:block border-l border-white/10 pl-10 font-mono italic">
          <p className="text-zinc-600 uppercase text-[9px] mb-1">Fleet Deployment</p>
          <p className="text-white text-xs">6 Suburbans // 2 Sprinters Active</p>
        </div>
      </div>
      <div className="space-y-32">
        {Object.entries(groupedShows).map(([month, shows]: [string, any]) => (
          <section key={month}>
            <h2 className="text-red-600 font-black uppercase text-[10px] mb-10 tracking-[0.5em] italic border-l-4 border-red-600 pl-6">{month}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {shows.map((show: any, i: number) => (
                <Link key={i} href={`/shows/${show.event.toLowerCase().replace(/ /g, '-')}`} className="group bg-zinc-900/40 p-10 rounded-[3.5rem] border border-white/5 hover:border-yellow-400/50 transition-all duration-500">
                  <p className="text-zinc-500 text-[10px] font-black uppercase mb-4 tracking-widest">{new Date(show.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                  <h3 className="text-2xl font-black italic uppercase leading-tight group-hover:text-yellow-400 transition-colors mb-4">{show.event}</h3>
                  <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest truncate">{show.support}</p>
                  <div className="mt-8 pt-8 border-t border-white/5 flex justify-between items-center text-[9px] font-black uppercase italic tracking-widest text-zinc-700">
                    <span>Intelligence &rarr;</span>
                    <span className="text-red-600">Active</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
