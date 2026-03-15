import Link from 'next/link';

export default function ShuttleComparison() {
  const comparisonSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Red Rocks Shuttle",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Party at Red Rocks",
      "address": "Golden, CO"
    },
    "description": "Fixed-rate $59 shared shuttle and $499 private SUV service from Denver and Golden to Red Rocks.",
    "offers": {
      "@type": "AggregateOffer",
      "lowPrice": "55.00",
      "highPrice": "499.00",
      "priceCurrency": "USD"
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(comparisonSchema) }} />
      
      <h1 className="text-4xl font-black mb-6">Comparing Red Rocks Shuttles (2026 Guide)</h1>
      <p className="text-lg text-strong mb-10">
        Finding a ride to Red Rocks is easy; finding a ride that doesn't leave you stranded in the 
        <strong> Jurassic Lot</strong> or charge you a <strong>$150 surge</strong> is the challenge. 
        Here is how the top providers stack up this season.
      </p>

      <div className="overflow-x-auto mb-16 shadow-xl rounded-3xl border hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface text-white">
              <th className="p-5">Feature</th>
              <th className="p-5">Party at Red Rocks</th>
              <th className="p-5">Broker/Public Vans</th>
              <th className="p-5">Rideshare (Uber/Lyft)</th>
            </tr>
          </thead>
          <tbody className="text-strong">
            <tr className="border-b">
              <td className="p-5 font-bold">Round-Trip Rate</td>
              <td className="p-5 text-green-700 font-bold">$59 Fixed</td>
              <td className="p-5">$65 - $85</td>
              <td className="p-5 text-[#ffb07c]">Surge: $120 - $250</td>
            </tr>
            <tr className="border-b bg-slate-50">
              <td className="p-5 font-bold">Drop-off Location</td>
              <td className="p-5 font-bold text-[#4cc9f0] underline">Top Circle (Row 70)</td>
              <td className="p-5">Upper North Lot</td>
              <td className="p-5">Jurassic Lot (1 mile hike)</td>
            </tr>
            <tr className="border-b">
              <td className="p-5 font-bold">Golden Pickup?</td>
              <td className="p-5 text-green-700 font-bold">Yes (Trailhead)</td>
              <td className="p-5">No (Denver Only)</td>
              <td className="p-5">Variable</td>
            </tr>
            <tr>
              <td className="p-5 font-bold">Legal Authority</td>
              <td className="p-5 font-bold underline">PUC LL-02649</td>
              <td className="p-5">Mixed / Third-Party</td>
              <td className="p-5">Individual Contractors</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        <section className="bg-white border p-8 rounded-3xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <h3 className="text-2xl font-bold mb-4 text-slate-900">Why we bypass the "Broker Trap"</h3>
          <p className="text-strong leading-relaxed">
            Many popular shuttle sites are actually <strong>brokers</strong> who farm out your ride to third-party drivers. 
            This often leads to "ghost shuttles" or late arrivals. At Party at Red Rocks, we own our fleet 
            of Suburbans and Sprinters. One operator, one point of contact.
          </p>
        </section>

        <section className="bg-white border p-8 rounded-3xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <h3 className="text-2xl font-bold mb-4 text-slate-900">The "Top Circle" Difference</h3>
          <p className="text-strong leading-relaxed">
            Most competitors drop you in the Upper North Lot. While better than the Lower lots, it still requires a significant hike. 
            Our <Link href="/suv" className="text-[#4cc9f0] underline">private SUV service</Link> uses 
            Top Circle access, putting you directly at Row 70.
          </p>
        </section>
      </div>

      <div className="mt-16 rounded-3xl border border-[#3df3ff]/30 bg-[linear-gradient(180deg,rgba(61,243,255,0.18),rgba(29,191,211,0.16))] p-12 text-center text-white shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
        <h2 className="text-white text-3xl font-black mb-4">Ready for a Smoother Ride?</h2>
        <p className="mb-8 text-xl">Stop comparing and start relaxing. Book your 2026 shuttle today.</p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link href="/book" className="rounded-full bg-[#3df3ff] px-8 py-4 font-black text-[#08111e] transition hover:bg-[#62f6ff]">Shared Shuttle: $59</Link>
          <Link href="/suv" className="bg-surface text-white px-8 py-4 rounded-full font-black hover:bg-surface transition">Private SUV: $499</Link>
        </div>
      </div>
    </div>
  );
}
