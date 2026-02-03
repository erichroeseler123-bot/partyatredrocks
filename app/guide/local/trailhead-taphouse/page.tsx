import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Golden Shuttle Hub: Trailhead Taphouse',
  description: 'The official Golden pickup location for Red Rocks shuttles. Pre-show food, craft beer, and logistics.',
};

export default function TrailheadHub() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 bg-black text-white">
      <h1 className="text-4xl font-black mb-4 uppercase italic">Golden Shuttle Hub: Trailhead Taphouse</h1>
      <p className="text-lg text-zinc-400 mb-10">
        Our official Golden, CO pickup location is the <strong>Trailhead Taphouse & Kitchen</strong>. 
        It’s the perfect pre-show basecamp for locals and travelers alike.
      </p>

      <div className="grid md:grid-cols-2 gap-10 items-center border border-zinc-800 p-8 rounded-3xl">
        <div>
          <h3 className="text-xl font-bold mb-2 text-red-600 uppercase">Pre-Show Logistics</h3>
          <p className="text-zinc-400">Located in the heart of downtown Golden, the Taphouse offers craft beers and Cajun-influenced pub fare.</p>
          <ul className="mt-4 space-y-2 text-sm text-zinc-500">
            <li>📍 <strong>Address:</strong> 811 12th St, Golden, CO 80401</li>
            <li>🍺 <strong>Pro-Tip:</strong> Arrive 60 mins early for a pint before the shuttle departs.</li>
            <li>🔗 <a href="https://trailheadtaphouse.com/" target="_blank" className="underline hover:text-red-500">Official Site</a></li>
          </ul>
        </div>
        <div className="bg-zinc-900 h-64 rounded-2xl flex items-center justify-center text-zinc-600 font-bold italic border border-zinc-800">
          [Trailhead Taphouse Hub Map]
        </div>
      </div>
    </div>
  );
}
