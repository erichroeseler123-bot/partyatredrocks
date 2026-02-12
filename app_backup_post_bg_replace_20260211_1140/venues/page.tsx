import Link from "next/link";

const VENUES = [
  { name: "Mission Ballroom", slug: "mission-ballroom", id: "428753" },
  { name: "Fiddler's Green", slug: "fiddlers-green-amphitheatre", id: "1221" },
  { name: "Fillmore Auditorium", slug: "fillmore-auditorium", id: "424" },
  { name: "Ogden Theatre", slug: "ogden-theatre", id: "422" },
  { name: "Bluebird Theater", slug: "bluebird-theater", id: "423" },
  { name: "Gothic Theatre", slug: "gothic-theatre", id: "1218" },
  { name: "Summit Denver", slug: "summit-denver", id: "14757" },
  { name: "Cervantes' Masterpiece", slug: "cervantes-masterpiece", id: "10094" },
  { name: "Dillon Amphitheater", slug: "dillon-amphitheater", id: "341857" },
  { name: "Gerald R. Ford Amphitheater", slug: "vail-amp", id: "2795" }
];

export default function VenuesPage() {
  return (
    <main className="min-h-screen bg-surface text-white p-12">
      <Link href="/" className="text-red-600 text-xs font-bold uppercase tracking-widest mb-4 inline-block">← Back to Hub</Link>
      <h1 className="text-5xl font-black italic uppercase mb-12 tracking-tighter text-red-600">Shuttle Destinations</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {VENUES.map((v) => (
          <Link key={v.slug} href={`/venues/${v.slug}`} className="group p-8 border border-white/10 rounded-3xl bg-zinc-900/50 hover:bg-red-600 transition duration-300">
            <h2 className="text-2xl font-black italic uppercase">{v.name}</h2>
            <p className="text-zinc-500 text-xs mt-2 group-hover:text-white/80 uppercase font-bold tracking-widest">View Shuttles & Shows →</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
