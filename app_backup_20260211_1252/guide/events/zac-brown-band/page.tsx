import Link from 'next/link';

export default function ZBBEvent() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <span className="text-red-700 font-bold tracking-widest uppercase text-sm">October 19 & 20, 2026</span>
      <h1 className="text-4xl font-black mt-2 mb-6">Zac Brown Band @ Red Rocks</h1>
      
      <p className="text-lg text-slate-700 leading-relaxed mb-8">
        The Zac Brown Band returns to the rocks this October with special guest Grace Potter. 
        Expect cool mountain temperatures (averaging 42°F at night).
      </p>

      <div className="grid gap-6">
        <div className="border-b pb-6">
          <h3 className="font-bold text-xl mb-2">Show Intelligence</h3>
          <p className="text-slate-600">
            Based on historical data from <a href="https://www.setlist.fm" target="_blank" className="underline">Setlist.fm</a>, 
            expect a 2.5-hour performance. Our shuttle departs 30 minutes after the final encore.
          </p>
        </div>

        <div className="border-b pb-6">
          <h3 className="font-bold text-xl mb-2">The "Uber Trap" Warning</h3>
          <p className="text-slate-600">
            ZBB is a high-demand show. Expect rideshare surge pricing to exceed $180 post-concert. 
            Our flat-rate $59 shared shuttle locks your price today.
          </p>
        </div>
      </div>

      <div className="mt-12 p-8 border rounded-2xl bg-slate-50 flex flex-col items-center">
        <h3 className="mt-0">Secure Your Transport</h3>
        <p className="text-center mb-6">Pickups at Sheraton Downtown Denver & Trailhead Taphouse Golden.</p>
        <Link href="/shuttle/shared-shuttle-denver" className="w-full text-center bg-red-700 text-white py-4 rounded-xl font-bold hover:bg-red-800 transition">
          Book Zac Brown Shuttle
        </Link>
      </div>
    </div>
  );
}
