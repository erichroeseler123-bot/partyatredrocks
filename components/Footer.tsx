import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-zinc-800 py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="col-span-1 md:col-span-2">
          <h4 className="text-2xl font-black italic uppercase text-white mb-4">GoSno LLC</h4>
          <p className="text-zinc-500 text-sm max-w-xs leading-relaxed">
            Colorado&apos;s premier concert transportation specialist. Licensed PUC LL-02649. Direct Top Circle access for every show.
          </p>
        </div>

        {/* THE PRETTY BOW: GUIDE LINKS */}
        <div>
          <h5 className="font-black uppercase text-xs tracking-widest text-red-600 mb-6">Venue Guide</h5>
          <ul className="space-y-3 text-sm font-medium text-zinc-400">
            <li><Link href="/guide/logistics/parking-lots" className="hover:text-white">Parking Lot Hacks</Link></li>
            <li><Link href="/guide/logistics/bag-policy" className="hover:text-white">2026 Bag Rules</Link></li>
            <li><Link href="/guide/logistics/sold-out-survival" className="hover:text-white">Sold-Out Survival</Link></li>
            <li><Link href="/guide/safety-and-legitimacy" className="hover:text-white">Safety & Licensing</Link></li>
          </ul>
        </div>

        {/* Local Pickups */}
        <div>
          <h5 className="font-black uppercase text-xs tracking-widest text-red-600 mb-6">Pickup Hubs</h5>
          <ul className="space-y-3 text-sm font-medium text-zinc-400">
            <li><Link href="/guide/local/denver-pickups" className="hover:text-white">Denver: Sheraton</Link></li>
            <li><Link href="/guide/local/trailhead-taphouse" className="hover:text-white">Golden: Trailhead Taphouse</Link></li>
            <li><Link href="/guide/local/morrison" className="hover:text-white">Morrison Logistics</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-zinc-900 text-center text-xs text-zinc-600 font-bold uppercase tracking-widest">
        © 2026 Party at Red Rocks | All Rights Reserved
      </div>
    </footer>
  );
}
