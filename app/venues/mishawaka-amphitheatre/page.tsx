import Link from "next/link";
import CustomBooking from "@/components/CustomBooking";
import ArtistGuide from "@/components/ArtistGuide";

const MISH_SHOWS = [
  { date: "Mar 7, 2026", title: "Graham Good & The Painters" },
  { date: "Apr 18, 2026", title: "San Holo" },
  { date: "May 1, 2026", title: "Benjamin Tod & The Inline Six" },
  { date: "Jun 14, 2026", title: "Lane 8" },
  { date: "Jun 20, 2026", title: "Tycho (Live)" }
];

export default function MishawakaPage() {
  return (
    <main className="min-h-screen bg-black text-white p-8">
      <Link href="/" className="text-red-600 uppercase font-bold text-xs tracking-widest">← Back</Link>
      <h1 className="text-5xl font-black italic uppercase my-6">Mishawaka Amphitheatre</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-zinc-900/50 p-8 rounded-3xl border border-white/5">
            <h2 className="text-xl font-bold mb-4 text-red-600">Venue Spotlight</h2>
            <ArtistGuide artistName="Upcoming Artists" venue="Mishawaka Amphitheatre" />
          </div>
          
          <div className="bg-zinc-900/50 p-8 rounded-3xl border border-white/5">
            <h2 className="text-xl font-bold mb-4">Mishawaka Shuttles</h2>
            {/* venue="mishawaka" filters for PGG11Z and PB7VBT */}
            <CustomBooking venue="mishawaka" />
          </div>
        </div>

        <div className="bg-zinc-950 p-8 rounded-3xl border border-white/5 h-fit">
          <h3 className="text-xs font-black uppercase text-red-600 mb-6 tracking-widest">Upcoming 2026 Shows</h3>
          <div className="space-y-4">
            {MISH_SHOWS.map((show, i) => (
              <div key={i} className="border-b border-white/5 pb-4 last:border-0">
                <div className="text-[10px] font-mono text-zinc-500 uppercase">{show.date}</div>
                <div className="font-bold text-zinc-200">{show.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
