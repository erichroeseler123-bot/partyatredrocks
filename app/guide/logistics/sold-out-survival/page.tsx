import Link from 'next/link';

export default function SoldOutSurvival() {
  const survivalSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Red Rocks Sold-Out Show Survival Guide 2026",
    "description": "How to navigate parking, surge pricing, and transportation for sold-out Red Rocks concerts in 2026.",
    "author": { "@type": "Organization", "name": "Party at Red Rocks" }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(survivalSchema) }} />
      
      <h1 className="text-5xl font-black mb-6 leading-tight">
        Sold-Out Survival: <span className="text-red-700">Don't Get Stranded at Red Rocks</span>
      </h1>

      <p className="text-xl text-strong mb-16 leading-relaxed">
        For 2026 high-demand shows like <strong>Zac Brown Band</strong> or <strong>Widespread Panic</strong>, logistics change. 
        Standard parking lots fill 2-3 hours before doors, and the &quot;Jurassic Lot&quot; overflow becomes a 1.5-mile hike.
      </p>

      <section className="mb-16 bg-surface text-white p-8 rounded-3xl shadow-2xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
        <h3 className="text-red-400 font-bold uppercase tracking-widest text-base mb-2">2026 Surge Pricing Alert</h3>
        <p className="text-2xl mb-6">Uber/Lyft prices for sold-out nights in 2026 are projected to exceed <strong>$165.00</strong> for a return trip to Denver.</p>
        <div className="grid grid-cols-2 gap-4 text-base border-t border-slate-700 pt-6">
          <div>
            <p className="text-slate-400">Average Post-Show Wait</p>
            <p className="font-bold text-lg">60 - 90 Minutes</p>
          </div>
          <div>
            <p className="text-slate-400">Pickup Location</p>
            <p className="font-bold text-lg text-yellow-400">Jurassic Lot (1 Mile Hike)</p>
          </div>
        </div>
      </section>

      <h2 className="text-3xl font-bold mb-6">The 2026 Venue Intelligence</h2>
      <ul className="space-y-4 mb-16">
        <li className="flex items-start">
          <span className="bg-red-100 text-red-700 p-1 rounded mr-3">✔</span>
          <strong>The East Terrace:</strong> New for 2026, this area near the East Stairs provides more room for security screening, but wait times still peak 45 mins before showtime.
        </li>
        <li className="flex items-start">
          <span className="bg-red-100 text-red-700 p-1 rounded mr-3">✔</span>
          <strong>South Merch Stand:</strong> The new permanent structure replaces the old tent, moving lines faster for those who arrive early.
        </li>
      </ul>

      <div className="bg-red-700 text-white p-10 rounded-3xl text-center shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
        <h2 className="text-white text-3xl font-black mb-4 uppercase">Secure Your Fixed Rate</h2>
        <p className="text-lg mb-16 max-w-xl mx-auto">
          Our shared $59 shuttles are surge-proof. We drop at the <strong>Top Circle (Row 70)</strong>, bypassing the Lower South &quot;Stair Tax.&quot;
        </p>
        <Link href="/book-shuttle" className="inline-block bg-white text-red-700 px-10 py-4 rounded-full font-black text-xl hover:bg-slate-100 transition shadow-lg">
          Guarantee My Seat
        </Link>
      </div>
    </div>
  );
}
