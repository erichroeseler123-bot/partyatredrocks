import Link from 'next/link';

export default function WestracksComparison() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 bg-surface text-white">
      <h1 className="text-5xl font-black mb-8 uppercase italic tracking-tighter">
        Shuttle vs. Public Pilot: <span className="text-red-600">The 2026 Reality</span>
      </h1>
      <p className="text-zinc-400 text-xl mb-12 leading-relaxed">
        The Westracks public shuttle launches Memorial Day 2026. While great for morning hikers, it is <strong>daytime only (9 AM - 5 PM)</strong>. If you are attending a concert, you need a different plan.
      </p>
      
      <div className="overflow-x-auto mb-16">
        <table className="w-full border-collapse border border-zinc-800">
          <thead>
            <tr className="bg-surface-strong">
              <th className="p-4 border border-zinc-800 text-left uppercase">Feature</th>
              <th className="p-4 border border-zinc-800 text-left">Westracks Pilot</th>
              <th className="p-4 border border-zinc-800 text-left text-red-600 uppercase font-black">Party at Red Rocks</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-4 border border-zinc-800 font-bold uppercase">Night Return</td>
              <td className="p-4 border border-zinc-800 italic text-zinc-500">No Service after 5 PM</td>
              <td className="p-4 border border-zinc-800 font-bold uppercase text-green-500">Guaranteed Return</td>
            </tr>
            <tr>
              <td className="p-4 border border-zinc-800 font-bold uppercase">Pickup</td>
              <td className="p-4 border border-zinc-800">Golden Station Area</td>
              <td className="p-4 border border-zinc-800 font-bold uppercase">Sheraton Denver & Trailhead</td>
            </tr>
            <tr>
              <td className="p-4 border border-zinc-800 font-bold uppercase">Drop-off</td>
              <td className="p-4 border border-zinc-800">Trading Post (Lower)</td>
              <td className="p-4 border border-zinc-800 font-bold uppercase text-red-500">Top Circle (Row 70)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-surface-strong p-10 rounded-[2.5rem] border border-red-600 text-center">
        <h2 className="text-3xl font-black mb-4 uppercase">Don't Get Stranded</h2>
        <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
          The public pilot won't bring you home from the show. We provide the only stress-free, 
          late-night shuttle from the Top Circle directly back to Denver and Golden.
        </p>
        <Link href="/book-shuttle" className="btn-primary uppercase hover:bg-red-500 transition shadow-xl inline-block">
          Secure Your Ride
        </Link>
      </div>
    </div>
  );
}
