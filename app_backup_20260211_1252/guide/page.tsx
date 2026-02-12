import Link from 'next/link';

export default function GuideHub() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-6 text-slate-900">Red Rocks Venue Intelligence Hub (2026)</h1>
      <p className="text-lg mb-8 text-slate-700 leading-relaxed">
        Welcome to the definitive resource for Red Rocks concert-goers. We combine real-time logistics from 
        <a href="https://www.redrocksonline.com" className="text-red-700 font-semibold hover:underline ml-1" target="_blank" rel="noopener noreferrer">Red Rocks Official</a> and 
        <a href="https://www.cotrip.org" className="text-red-700 font-semibold hover:underline ml-1" target="_blank" rel="noopener noreferrer">CDOT</a> to ensure you never miss a beat.
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        <section className="border p-6 rounded-xl shadow-sm bg-white">
          <h2 className="text-2xl font-semibold mb-4 text-red-800">Logistics & Survival</h2>
          <ul className="space-y-4">
            <li>
              <Link href="/guide/logistics/parking-lots" className="text-slate-800 font-medium hover:text-red-700 transition">
                Parking Lot Comparison: Avoid the 380-Stair Climb →
              </Link>
            </li>
            <li>
              <span className="text-slate-500">2026 Bag Policy: Single-Pocket Rules (Coming Soon)</span>
            </li>
          </ul>
        </section>

        <section className="border p-6 rounded-xl shadow-sm bg-white">
          <h2 className="text-2xl font-semibold mb-4 text-red-800">2026 Event Previews</h2>
          <ul className="space-y-4">
            <li>
              <Link href="/guide/events/zac-brown-band" className="text-slate-800 font-medium hover:text-red-700 transition">
                Zac Brown Band: October 19-20 Logistics →
              </Link>
            </li>
            <li>
              <span className="text-slate-500">Reggae on the Rocks: August 22 Guide (Coming Soon)</span>
            </li>
          </ul>
        </section>
      </div>

      <footer className="mt-16 pt-8 border-t text-sm text-slate-500 italic">
        Party at Red Rocks is a Tier-1 operator Colorado&#x27;s premier concert transportation specialist.
      </footer>
    </div>
  );
}
