import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Golden Shuttle Hub: Trailhead Taphouse',
  description: 'The official Golden pickup location for Party at Red Rocks shuttles.',
};

export default function TrailheadHub() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 bg-black text-white">
      <h1 className="text-4xl font-black mb-4 uppercase italic tracking-tighter">Golden Shuttle Hub: Trailhead Taphouse</h1>
      <p className="text-lg text-zinc-400 mb-10 leading-relaxed">
        Our official Golden, CO pickup location is the <strong>Trailhead Taphouse & Kitchen</strong>. 
        It’s the perfect pre-show basecamp for locals and travelers alike.
      </p>

      <div className="grid md:grid-cols-2 gap-10 items-center border border-zinc-800 rounded-[2.5rem] overflow-hidden bg-zinc-900/30 p-8 shadow-2xl">
        <div>
          <h3 className="text-xl font-bold mb-4 text-red-600 uppercase tracking-tight">Pre-Show Logistics</h3>
          <p className="text-zinc-400 text-sm leading-relaxed mb-6">Located in the heart of downtown Golden, the Taphouse offers craft beers and Cajun-influenced pub fare.</p>
          <ul className="space-y-4 text-sm text-zinc-300 font-medium">
            <li className="flex gap-2"><span>📍</span> <span><strong>Address:</strong> 811 12th St, Golden, CO 80401</span></li>
            <li className="flex gap-2"><span>🍺</span> <span><strong>Pro-Tip:</strong> Arrive 60 mins early for a pint before the shuttle departs.</span></li>
            <li>🔗 <a href="https://trailheadtaphouse.com/" target="_blank" className="text-red-500 hover:underline transition">Official Site</a></li>
          </ul>
        </div>
        <div className="aspect-square md:aspect-auto md:h-full min-h-[300px] rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3067.87680076295!2d-105.2238479!3d39.7536341!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x876b856719e7a275%3A0x633658516c49877b!2sTrailhead%20Taphouse%20%26%20Kitchen!5e0!3m2!1sen!2sus!4v1706990000000!5m2!1sen!2sus" 
            width="100%" height="100%" style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
