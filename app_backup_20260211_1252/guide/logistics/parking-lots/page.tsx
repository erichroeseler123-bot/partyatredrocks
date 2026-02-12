import Link from 'next/link';

export default function ParkingLots() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 prose prose-slate lg:prose-lg">
      <h1 className="text-3xl font-bold mb-4">Red Rocks Parking 2026: Which Lot is Best?</h1>
      <p>
        Red Rocks sits at 6,450ft elevation. Underestimating the hike from the lower lots is the #1 mistake first-timers make. 
        According to the <a href="https://www.redrocksonline.com/plan-your-visit/getting-here/" target="_blank" rel="noopener noreferrer">Official Parking Guide</a>, lots open 2 hours before doors.
      </p>

      <div className="bg-red-50 p-6 my-8 rounded-xl border-l-4 border-red-700">
        <h3 className="text-red-900 mt-0">The 2026 Pro-Tip</h3>
        <p className="mb-0 text-red-800">
          Our shared and private shuttles utilize the <strong>Top Circle Drop-Off</strong>. This puts you at the very top (Row 70), 
          allowing you to walk <em>down</em> the stairs to your seat instead of climbing 380+ steps from the Lower South Lot.
        </p>
      </div>

      <h3>Quick Lot Comparison</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-slate-100">
              <th className="p-3">Lot Name</th>
              <th className="p-3">Best For</th>
              <th className="p-3">The "Catch"</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="p-3 font-bold">Upper North</td><td className="p-3">Row 70 / Easy Entry</td><td className="p-3">Fills 2.5 hours before doors.</td></tr>
            <tr><td className="p-3 font-bold">Lower South</td><td className="p-3">Fast Post-Show Exit</td><td className="p-3">Equivalent to a 20-story climb.</td></tr>
          </tbody>
        </table>
      </div>

      <div className="mt-12 bg-slate-900 text-white p-8 rounded-2xl text-center">
        <h2 className="text-white mt-0">Don't Deal with the Hike</h2>
        <p className="text-slate-300">Our shared shuttles start at $50 per person. Private SUVs from $499.</p>
        <Link href="/book-shuttle" className="inline-block bg-red-700 text-white px-8 py-3 rounded-full font-bold hover:bg-red-800 transition no-underline">
          Book Top Circle Drop-off
        </Link>
      </div>
    </div>
  );
}
