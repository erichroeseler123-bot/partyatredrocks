import Link from 'next/link';

export default function ParkingComparison() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 prose prose-slate">
      <h1 className="text-3xl font-bold mb-4">Red Rocks Parking 2026: Which Lot is Best?</h1>
      <p>Don't ruin your night with a 400-stair climb. At 6,450ft, the "Lower South" lot is a physical challenge most fans aren't prepared for.</p>

      <div className="bg-gray-50 p-6 my-8 rounded-xl border border-red-200">
        <h3 className="text-xl font-bold text-red-800 mt-0">The 2026 Pro-Tip</h3>
        <p className="mb-0">
          Our shared and private shuttles utilize the <strong>Top Circle Drop-Off</strong>. This puts you at the very top of the amphitheatre (Row 70), allowing you to walk <em>down</em> to your seat.
        </p>
      </div>

      <h3>Quick Lot Breakdown</h3>
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Lot</th>
            <th className="border p-2">Best For</th>
            <th className="border p-2">The Catch</th>
          </tr>
        </thead>
        <tbody>
          <tr><td className="border p-2 font-bold text-red-700">Upper North</td><td className="border p-2">VIP / Proximity</td><td className="border p-2">Fills 2.5 hours before doors.</td></tr>
          <tr><td className="border p-2 font-bold text-red-700">Lower South</td><td className="border p-2">Fastest Exit</td><td className="border p-2">Massive uphill hike.</td></tr>
        </tbody>
      </table>

      <div className="mt-10 bg-red-700 text-white p-6 rounded-lg text-center">
        <h2 className="text-white mt-0">Skip the Parking Nightmare</h2>
        <p>Book a round-trip shuttle from Denver or Golden for just $55.</p>
        <Link href="/book-shuttle" className="bg-white text-red-700 px-6 py-2 rounded font-bold hover:bg-gray-100 no-underline">
          Reserve My Seat
        </Link>
      </div>
    </div>
  );
}
