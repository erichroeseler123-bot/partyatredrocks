import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-zinc-800 py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Brand Column */}
        <div className="col-span-1 md:col-span-2">
          <h4 className="text-2xl font-black italic uppercase text-white mb-4 tracking-tighter">
            Party at Red Rocks
          </h4>
          <p className="text-zinc-500 text-sm max-w-xs leading-relaxed font-medium">
            Colorado&apos;s premier concert transportation specialist. Direct Top Circle 
            access for every show. No parking stress, no rideshare surges.
          </p>
        </div>

        {/* Venue Guide Column */}
        <div>
          <h5 className="font-black uppercase text-xs tracking-widest text-red-600 mb-6">Venue Guide</h5>
          <ul className="space-y-3 text-sm font-bold text-zinc-400">
            <li><Link href="/guide/logistics/parking-lots" className="hover:text-white transition">Parking Lot Hacks</Link></li>
            <li><Link href="/guide/logistics/bag-policy" className="hover:text-white transition">2026 Bag Rules</Link></li>
            <li><Link href="/guide/logistics/sold-out-survival" className="hover:text-white transition">Sold-Out Survival</Link></li>
            <li><Link href="/guide/safety-and-trust" className="hover:text-white transition">Safety & Trust</Link></li>
          </ul>
        </div>

        {/* Pickup Hubs Column */}
        <div>
          <h5 className="font-black uppercase text-xs tracking-widest text-red-600 mb-6">Pickup Hubs</h5>
          <ul className="space-y-3 text-sm font-bold text-zinc-400">
            <li><Link href="/guide/local/denver-pickups" className="hover:text-white transition">Denver: Sheraton</Link></li>
            <li><Link href="/guide/local/trailhead-taphouse" className="hover:text-white transition">Golden: Trailhead Taphouse</Link></li>
            <li><Link href="/guide/local/morrison" className="hover:text-white transition">Morrison Logistics</Link></li>
          </ul>
        </div>

      </div>
      
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-zinc-900 text-center text-[10px] text-zinc-700 font-black uppercase tracking-[0.4em]">
        &copy; 2026 Party at Red Rocks | All Rights Reserved
      </div>
    </footer>
  );
}
