import Image from "next/image";
import Link from "next/link";
import HomepageBridge from "@/components/HomepageBridge";
import FeaturedServices from "@/components/FeaturedServices";

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
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-24 text-left">
          <h1 className="text-6xl md:text-8xl font-black italic uppercase leading-tight tracking-tighter text-white">
            Party at <br /> Red Rocks
          </h1>
          <p className="mt-6 max-w-xl text-zinc-200 text-xl font-medium leading-relaxed">
            Concert transportation, done right. <span className="text-red-600 font-bold">$59  per person shuttles</span>, 
            private SUVs, and zero stress getting home after the encore.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/book-shuttle"
              className="bg-red-600 hover:bg-red-500 px-10 py-5 font-black uppercase tracking-wide rounded-full transition transform hover:scale-105 shadow-2xl"
            >
              Book Shuttle — $59
            </Link>

            <Link
              href="/private-suburban"
              className="bg-white text-black hover:bg-zinc-200 px-10 py-5 font-black uppercase tracking-wide rounded-full transition transform hover:scale-105 shadow-2xl"
            >
              Private SUV
            </Link>
          </div>
        </div>
      </section>
<FeaturedServices />

      {/* ================= VENUE INTELLIGENCE (THE BRIDGE) ================= */}
      <HomepageBridge />

      {/* ================= CALL TO ACTION & NAV LINKS ================= */}
      <section className="py-20 bg-black text-center">
        <h2 className="text-4xl font-black italic uppercase text-white tracking-tighter mb-12">
          Don&apos;t Drive. Don&apos;t Stress.
        </h2>
        
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-12">
           <Link href="/guide" className="hover:text-red-600 transition">Venue Intelligence</Link>
           <Link href="/book-shuttle" className="hover:text-red-600 transition">Shuttle Booking</Link>
           <Link href="/private-suburban" className="hover:text-red-600 transition">Private SUV</Link>
           <Link href="/venues/red-rocks-amphitheatre" className="hover:text-red-600 transition">Upcoming Shows</Link>
        </div>
      </section>

      {/* ================= UPDATED SCRUBBED FOOTER ================= */}
      <footer className="py-24 border-t border-zinc-900 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-left">
            
            {/* Column 1: Brand Authority */}
            <div>
              <h3 className="text-xl font-black italic uppercase text-white mb-6 tracking-tighter">
                Party at Red Rocks
              </h3>
              <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">
                Colorado&apos;s premier concert transportation specialist. Direct Top Circle 
                access for every show. No parking stress, no rideshare surges.
              </p>
            </div>

            {/* Column 2: Venue Guide Pillars */}
            <div>
              <h4 className="text-red-600 font-black uppercase text-xs tracking-[0.2em] mb-8">Venue Guide</h4>
              <ul className="space-y-4 text-zinc-400 text-sm font-bold">
                <li><Link href="/guide/logistics/parking-lots" className="hover:text-white transition">Parking Lot Hacks →</Link></li>
                <li><Link href="/guide/logistics/bag-policy" className="hover:text-white transition">2026 Bag Rules →</Link></li>
                <li><Link href="/guide/logistics/sold-out-survival" className="hover:text-white transition">Sold-Out Survival →</Link></li>
                <li><Link href="/guide/safety-and-trust" className="hover:text-white transition">Safety & Trust →</Link></li>
              </ul>
            </div>

            {/* Column 3: Pickup Hubs */}
            <div>
              <h4 className="text-red-600 font-black uppercase text-xs tracking-[0.2em] mb-8">Pickup Hubs</h4>
              <ul className="space-y-4 text-zinc-400 text-sm font-bold">
                <li><Link href="/guide/local/denver-pickups" className="hover:text-white transition">Denver: Sheraton →</Link></li>
                <li><Link href="/guide/local/trailhead-taphouse" className="hover:text-white transition">Golden: Trailhead Taphouse →</Link></li>
                <li><Link href="/guide/local/morrison" className="hover:text-white transition">Morrison Logistics →</Link></li>
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
