import Link from 'next/link';

export default function ProhibitedItems() {
  const items = [
    { name: "Hydration Packs", rule: "Single-pocket only. Max 3L. No 'Hiking' packs with multiple zippers.", tip: "If it has more than 1 pocket, security will send you back." },
    { name: "Vapes & Pens", rule: "Permitted in designated smoking areas only. Not in the seating bowl.", tip: "Keep them in your pocket during the scan; don't use them in the rows." },
    { name: "External Batteries", rule: "Legal if smaller than a standard phone.", tip: "Massive power blocks for camping will be rejected." },
    { name: "Food", rule: "Permitted in clear, 1-gallon plastic bags.", tip: "Fruit must be sliced. Security will not allow whole apples or oranges." }
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-20 bg-surface text-white text-left">
      <header className="mb-16 border-l-4 border-red-600 pl-8">
        <h1 className="text-5xl font-black uppercase italic tracking-tighter">
          2026 <span className="text-red-600">Prohibited</span> Items Deep Dive
        </h1>
        <p className="mt-4 text-zinc-400 text-xl font-medium max-w-2xl">
          Don&apos;t get sent back to the lot. Security at the East Terrace and North ramps is utilizing 
          AI-scanning for the 2026 season. Here is the intelligence you need.
        </p>
      </header>

      {/* Rules Grid */}
      <div className="grid gap-6 mb-16">
        {items.map((item, i) => (
          <div key={i} className="bg-surface-strong/50 border-soft shadow-soft p-8 rounded-[2rem]">
            <h3 className="text-red-500 font-black uppercase mb-2 italic text-2xl">{item.name}</h3>
            <p className="text-white font-bold mb-4">{item.rule}</p>
            <div className="bg-surface/40 p-4 rounded-xl border-soft shadow-soft text-zinc-500 text-sm italic">
              Pro Tip: {item.tip}
            </div>
          </div>
        ))}
      </div>

      {/* Internal "Web of Relevance" Links */}
      <div className="bg-surface-strong p-10 rounded-[2.5rem] border-soft shadow-soft mb-16">
        <h3 className="text-2xl font-black mb-6 uppercase italic text-white">Related Intelligence</h3>
        <div className="grid sm:grid-cols-2 gap-6">
          <Link href="/guide/logistics/bag-policy" className="group">
            <h4 className="text-zinc-100 font-bold group-hover:text-red-500 transition">2026 Bag Rules →</h4>
            <p className="text-zinc-500 text-xs mt-1">Detailed sizing for fanny packs and purses.</p>
          </Link>
          <Link href="/guide/logistics/winter-survival" className="group">
            <h4 className="text-zinc-100 font-bold group-hover:text-blue-500 transition">Winter Gear Prep →</h4>
            <p className="text-zinc-500 text-xs mt-1">What clothing items pass security in March.</p>
          </Link>
        </div>
      </div>

      {/* Transactional Pivot */}
      <div className="bg-white text-black p-12 rounded-[3.5rem] text-center shadow-2xl">
        <h2 className="text-3xl font-black mb-4 uppercase italic">The Locked Storage Advantage</h2>
        <p className="text-lg mb-8 leading-relaxed font-medium max-w-2xl mx-auto">
          If security rejects an item, a rideshare leaves you stranded. Our shuttle drivers provide 
          a final check and allow you to leave gear safely in our locked vehicles during the show.
        </p>
        <Link href="/book-shuttle" className="bg-red-600 text-white px-12 py-5 rounded-full font-black uppercase hover:bg-red-500 transition shadow-lg inline-block">
          Book Your 2026 Ride
        </Link>
      </div>
    </div>
  );
}
