import Image from "next/image";
import Link from "next/link";
import HomepageBridge from "@/components/HomepageBridge";

export default function HomePage() {
  return (
    <main className="bg-black text-white selection:bg-red-600 selection:text-white">

      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-[85vh] flex items-end">
        <Image
          src="/hero/hero-home.jpg" 
          alt="Party at Red Rocks Shuttle"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-24 text-left">
          <h1 className="text-6xl md:text-8xl font-black italic uppercase leading-tight tracking-tighter text-white">
            Party at <br /> Red Rocks
          </h1>
          <p className="mt-6 max-w-xl text-zinc-200 text-xl font-medium leading-relaxed">
            Concert transportation, done right. <span className="text-red-600 font-bold">$55 round-trip shuttles</span>, 
            private SUVs, and now <span className="text-white font-bold">All-Venue City Service</span>.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/book-shuttle"
              className="bg-red-600 hover:bg-red-500 px-10 py-5 font-black uppercase tracking-wide rounded-full transition transform hover:scale-105 shadow-2xl"
            >
              Book Red Rocks — $55
            </Link>

            <Link
              href="/shuttles/all-venue"
              className="bg-white text-black hover:bg-zinc-200 px-10 py-5 font-black uppercase tracking-wide rounded-full transition transform hover:scale-105 shadow-2xl"
            >
              All Venue City Service
            </Link>
          </div>
        </div>
      </section>

      {/* ================= SERVICE GRID ================= */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          
          {/* Shared Red Rocks Shuttle */}
          <div className="group rounded-[2.5rem] bg-zinc-900/50 border border-zinc-800 p-10 hover:border-red-600/50 transition-all">
            <h3 className="text-2xl font-black uppercase italic mb-4">Red Rocks Shuttle</h3>
            <p className="text-zinc-400 mb-8 text-sm leading-relaxed">
              Our flagship high-roof Sprinters run direct to the Top Circle. 
              $55 round-trip from Downtown Denver and Golden.
            </p>
            <Link href="/book-shuttle" className="text-red-500 font-bold uppercase tracking-widest text-[10px] hover:underline">
              Check Dates →
            </Link>
          </div>

          {/* All Venue Shuttle Card */}
          <div className="group rounded-[2.5rem] bg-zinc-900/50 border border-red-600 p-10 hover:bg-zinc-900 transition-all">
            <div className="inline-block bg-red-600 text-white text-[9px] font-black px-2 py-1 uppercase rounded mb-4">
              Featured
            </div>
            <h3 className="text-2xl font-black uppercase italic mb-4">All Venue Shuttle</h3>
            <p className="text-zinc-400 mb-8 text-sm leading-relaxed font-bold">
              $50 per person ($250 min). Door-to-door to Mission Ballroom, 
              Ball Arena, Fiddler&apos;s Green, and beyond.
            </p>
            <Link href="/shuttles/all-venue" className="text-white font-black uppercase tracking-widest text-[10px] hover:underline">
              Book City Service →
            </Link>
          </div>
          
          {/* Private SUV Card */}
          <div className="group rounded-[2.5rem] bg-zinc-900/50 border border-zinc-800 p-10 hover:border-blue-600/50 transition-all">
            <h3 className="text-2xl font-black uppercase italic mb-4">Private SUV</h3>
            <p className="text-zinc-400 mb-8 text-sm leading-relaxed">
              Luxury for up to 6 guests. Custom timing from your hotel or Airbnb. 
              Private SUV packages starting at $499.
            </p>
            <Link href="/private-suburban" className="text-blue-500 font-bold uppercase tracking-widest text-[10px] hover:underline">
              Book Private →
            </Link>
          </div>

        </div>
      </section>

      {/* ================= THE BRIDGE ================= */}
      <HomepageBridge />

      {/* ================= THE CLEAN FOOTER (ONLY ONE) ================= */}
      <footer className="py-24 border-t border-zinc-900 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-left">
            
            <div>
              <h3 className="text-2xl font-black italic uppercase text-white mb-6 tracking-tighter">
                Party at Red Rocks
              </h3>
              <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">
                Colorado&apos;s premier concert transportation specialist. Direct Top Circle 
                access for every show. No parking stress, no rideshare surges.
              </p>
            </div>

            <div>
              <h4 className="text-red-600 font-black uppercase text-xs tracking-[0.2em] mb-8">Venue Guide</h4>
              <ul className="space-y-4 text-zinc-400 text-sm font-bold">
                <li><Link href="/guide/logistics/parking-lots" className="hover:text-white transition">Parking Lot Hacks →</Link></li>
                <li><Link href="/guide/logistics/bag-policy" className="hover:text-white transition">2026 Bag Rules →</Link></li>
                <li><Link href="/guide/logistics/shuttle-vs-westracks-2026" className="hover:text-white transition">vs. Westracks Pilot →</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-red-600 font-black uppercase text-xs tracking-[0.2em] mb-8">Service Hubs</h4>
              <ul className="space-y-4 text-zinc-400 text-sm font-bold">
                <li><Link href="/guide/local/denver-pickups" className="hover:text-white transition">Denver: Sheraton →</Link></li>
                <li><Link href="/guide/local/trailhead-taphouse" className="hover:text-white transition">Golden: Trailhead Taphouse →</Link></li>
                <li><Link href="/shuttles/all-venue" className="hover:text-white transition">All Venue City Service →</Link></li>
              </ul>
            </div>

          </div>

          <div className="mt-20 pt-8 border-t border-zinc-900 text-center">
            <p className="text-[9px] text-zinc-700 font-bold uppercase tracking-[0.4em]">
              &copy; 2026 Party at Red Rocks | All Rights Reserved
            </p>
          </div>
        </div>
      </footer>

    </main>
  );
}
