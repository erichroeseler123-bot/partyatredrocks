import Link from "next/link";
import CustomBooking from "@/components/CustomBooking";

// Upcoming Mishawaka Shows
const UPCOMING_SHOWS = [
  { date: "Mar 7", title: "Graham Good & The Painters", time: "8:00 PM" },
  { date: "Apr 18", title: "San Holo: Wholesome Riddim", time: "7:00 PM" },
  { date: "May 1", title: "Benjamin Tod & The Inline Six", time: "8:00 PM" },
  { date: "Jun 14", title: "Lane 8: TNH TEN", time: "5:00 PM" },
  { date: "Jun 20", title: "Tycho (Live)", time: "8:00 PM" }
];

export default function MishawakaPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="h-[40vh] w-full relative">
        <img 
          src="https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=2070&auto=format&fit=crop" 
          className="w-full h-full object-cover opacity-60" 
          alt="Mishawaka Amphitheatre" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        <div className="absolute bottom-10 left-6 md:left-20">
          <Link href="/" className="text-sm font-bold text-red-600 uppercase tracking-widest hover:text-white transition">
            ← Back to All Venues
          </Link>
          <h1 className="text-4xl md:text-7xl font-black italic uppercase">
            Mishawaka Amphitheatre
          </h1>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Booking Section */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-6">Book Your Shuttle</h2>
          <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8 backdrop-blur-md">
            <CustomBooking />
          </div>
        </div>

        {/* Shows Section */}
        <div className="border border-white/5 p-8 rounded-2xl bg-zinc-950/50 backdrop-blur-md">
          <h3 className="text-[10px] font-black uppercase text-red-600 mb-6 tracking-[0.2em]">
            Upcoming Shows
          </h3>
          <div className="space-y-6">
            {UPCOMING_SHOWS.map((show, i) => (
              <div key={i} className="flex flex-col border-b border-white/5 pb-4 last:border-0">
                <span className="text-[10px] text-zinc-500 font-mono uppercase">{show.date} • {show.time}</span>
                <span className="text-sm font-bold mt-1 text-zinc-200">{show.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
