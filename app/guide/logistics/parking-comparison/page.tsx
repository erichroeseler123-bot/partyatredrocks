import Link from 'next/link';

export default function ParkingComparison() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 prose prose-slate">
      <h1 className="text-3xl font-bold mb-4">Red Rocks Parking 2026: Which Lot is Best?</h1>
      <p>Don't ruin your night with a 400-stair climb. At 6,450ft, the "Lower South" lot is a physical challenge most fans aren't prepared for.</p>

      <div className="my-8 rounded-2xl border border-[#3df3ff]/20 bg-[#3df3ff]/8 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
        <h3 className="mt-0 text-xl font-bold text-[#4cc9f0]">The 2026 Pro-Tip</h3>
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
          <tr><td className="border p-2 font-bold text-[#4cc9f0]">Upper North</td><td className="border p-2">VIP / Proximity</td><td className="border p-2">Fills 2.5 hours before doors.</td></tr>
          <tr><td className="border p-2 font-bold text-[#4cc9f0]">Lower South</td><td className="border p-2">Fastest Exit</td><td className="border p-2">Massive uphill hike.</td></tr>
        </tbody>
      </table>

      <div className="mt-10 rounded-lg border border-[#3df3ff]/30 bg-[linear-gradient(180deg,rgba(61,243,255,0.18),rgba(29,191,211,0.16))] p-6 text-center text-white">
        <h2 className="text-white mt-0">Skip the Parking Nightmare</h2>
        <p>Book a per-person shuttle from Denver or Golden for just $59.</p>
        <Link href="/book" className="rounded bg-[#3df3ff] px-6 py-2 font-bold text-[#08111e] no-underline hover:bg-[#62f6ff]">
          Reserve My Seat
        </Link>
      </div>
    </div>
  );
}
