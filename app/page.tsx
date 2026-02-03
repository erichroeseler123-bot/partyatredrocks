import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="bg-black text-white">

      {/* ================= HERO ================= */}
      <section className="relative min-h-[90vh] flex items-end">
        <Image
          src="/hero/hero-home.jpg"
          alt="Party at Red Rocks Transportation"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-24 text-left">
          <h1 className="text-6xl md:text-8xl font-black italic uppercase leading-none text-white tracking-tighter">
            Party at <br /> Red Rocks
          </h1>
          <p className="mt-6 max-w-xl text-zinc-200 text-xl font-medium">
            2026 Concert transportation, done right. <span className="text-red-500 font-bold">$55 Round-Trip.</span> 
            Direct from Denver & Golden. Zero stress getting home.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/book-shuttle"
              className="bg-red-600 hover:bg-red-500 px-10 py-5 font-black uppercase tracking-wide rounded-full transition shadow-2xl transform hover:scale-105"
            >
              Book Shuttle - $55
            </Link>

            <Link
              href="/private-suburban"
              className="bg-zinc-100 text-black hover:bg-white px-10 py-5 font-black uppercase tracking-wide rounded-full transition shadow-2xl transform hover:scale-105"
            >
              Private SUV
            </Link>
          </div>
          
          <div className="mt-8 text-zinc-400 font-bold uppercase tracking-widest text-sm">
            Questions? Text/Call: <span className="text-white">720-369-6292</span>
          </div>
        </div>
      </section>

      {/* ================= MASTER NAVIGATOR ================= */}
      <section className="py-24 bg-zinc-950 border-y border-zinc-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-4xl font-black italic uppercase text-white mb-4">Plan Your 2026 Night</h2>
            <p className="text-zinc-500 font-medium">Outsmart the crowds with our venue intelligence guides.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            
            {/* Logistics Pillar */}
            <div className="border-l border-zinc-800 pl-6">
              <h3 className="text-red-600 font-black uppercase text-lg mb-6 tracking-tighter italic">Logistics Hub</h3>
              <ul className="space-y-4">
                <li><Link href="/guide/logistics/parking-lots" className="text-zinc-400 hover:text-white transition text-sm font-bold">Parking Lot Guide →</Link></li>
                <li><Link href="/guide/logistics/bag-policy" className="text-zinc-400 hover:text-white transition text-sm font-bold">2026 Bag Rules →</Link></li>
                <li><Link href="/guide/logistics/shuttle-vs-westracks-2026" className="text-yellow-500 hover:text-yellow-400 transition text-sm font-black">vs. Westracks Pilot →</Link></li>
                <li><Link href="/guide/logistics/sold-out-survival" className="text-zinc-400 hover:text-white transition text-sm font-bold">Sold-Out Survival →</Link></li>
              </ul>
            </div>

            {/* Local Pickups Pillar */}
            <div className="border-l border-zinc-800 pl-6">
              <h3 className="text-red-600 font-black uppercase text-lg mb-6 tracking-tighter italic">Local Pickups</h3>
              <ul className="space-y-4">
                <li><Link href="/guide/local/denver-pickups" className="text-zinc-400 hover:text-white transition text-sm font-bold">Denver: Sheraton Hub →</Link></li>
                <li><Link href="/guide/local/trailhead-taphouse" className="text-zinc-400 hover:text-white transition text-sm font-bold">Golden: Trailhead Hub →</Link></li>
                <li><Link href="/guide/local/group-pre-game-spots" className="text-zinc-400 hover:text-white transition text-sm font-bold">Pre-Game Bars →</Link></li>
              </ul>
            </div>

            {/* Intelligence Pillar */}
            <div className="border-l border-zinc-800 pl-6">
              <h3 className="text-red-600 font-black uppercase text-lg mb-6 tracking-tighter italic text-left">Event Intel</h3>
              <ul className="space-y-4">
                <li><Link href="/guide/events/2026-season-preview" className="text-white hover:text-red-500 transition text-sm font-black italic uppercase">2026 Season Lineup →</Link></li>
                <li><Link href="/guide/logistics/winter-survival" className="text-blue-400 hover:text-blue-300 transition text-sm font-black italic">Winter Survival Guide →</Link></li>
                <li><Link href="/guide/events/tailgate-guide" className="text-zinc-400 hover:text-white transition text-sm font-bold">Tailgate Strategy →</Link></li>
              </ul>
            </div>

            {/* Trust Pillar */}
            <div className="border-l border-zinc-800 pl-6 text-left">
              <h3 className="text-red-600 font-black uppercase text-lg mb-6 tracking-tighter italic">Compare & Trust</h3>
              <ul className="space-y-4">
                <li><Link href="/guide/compare-shuttles-2026" className="text-zinc-400 hover:text-white transition text-sm font-bold uppercase">Shuttle Comparison →</Link></li>
                <li><Link href="/guide/reviews-and-testimonials" className="text-zinc-400 hover:text-white transition text-sm font-bold uppercase italic">Rider Reviews →</Link></li>
                <li><Link href="/guide/faq" className="text-zinc-400 hover:text-white transition text-sm font-bold uppercase italic">Common FAQs →</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="py-32 px-6 border-t border-zinc-900 text-center bg-zinc-950">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-black italic uppercase text-white tracking-tighter">Don’t Drive. Don’t Stress.</h2>
          <p className="mt-8 text-zinc-500 text-xl font-medium leading-relaxed">The most reliable concert shuttle in Colorado. Stress-free parking, round-trip service, and no rideshare surge pricing.</p>
          <div className="mt-12 flex flex-col items-center gap-6">
             <Link
              href="/book-shuttle"
              className="inline-block bg-red-600 hover:bg-red-500 px-12 py-5 font-black uppercase tracking-wide rounded-full transition shadow-2xl"
            >
              Secure Your Round-Trip Ride
            </Link>
            <div className="text-zinc-400 font-bold uppercase tracking-widest text-xs">
              Call or Text 24/7: 720-369-6292
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}

function VenueCard({ href, image, title, className = "" }: { href: string; image: string; title: string; className?: string; }) {
  return (
    <Link href={href} className={`group rounded-3xl overflow-hidden border border-zinc-900 transition ${className}`}>
      <div className="relative h-64 w-full overflow-hidden">
        <Image src={image} alt={title} fill className="object-cover group-hover:scale-105 transition duration-500" />
      </div>
      <div className="p-6 font-black uppercase text-zinc-300 group-hover:text-white transition">{title}</div>
    </Link>
  );
}

function FleetCard({ image, title, desc }: { image: string; title: string; desc: string; }) {
  return (
    <div className="rounded-3xl overflow-hidden border border-zinc-800 group hover:border-zinc-700 transition">
      <div className="relative h-64 w-full overflow-hidden">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>
      <div className="p-6">
        <h3 className="font-black uppercase text-zinc-100">{title}</h3>
        <p className="text-zinc-400 text-sm mt-2 font-medium">{desc}</p>
      </div>
    </div>
  );
}
