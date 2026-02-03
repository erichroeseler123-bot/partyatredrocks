import Link from 'next/link';

export default function DenverPickups() {
  const localSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Party at Red Rocks",
    "image": "https://partyatredrocks.com/hero/hero-home.jpg",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "1550 Court Pl",
      "addressLocality": "Denver",
      "addressRegion": "CO",
      "postalCode": "80202"
    },
    "geo": { "@type": "GeoCoordinates", "latitude": 39.7430, "longitude": -104.9897 },
    "priceRange": "$55-$499"
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 bg-black text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localSchema) }} />

      <h1 className="text-4xl font-black mb-4 uppercase italic tracking-tighter">Denver Shuttle Hub: Sheraton Downtown</h1>
      <p className="text-lg text-zinc-400 mb-10 leading-relaxed italic">
        The primary Denver-to-Red Rocks pickup hub for Party at Red Rocks riders.
      </p>

      <div className="grid md:grid-cols-2 gap-10 mb-12 border border-zinc-800 rounded-[2.5rem] overflow-hidden bg-zinc-900/30 p-8 shadow-2xl">
        <div>
          <h3 className="font-bold text-xl mb-4 text-red-600 uppercase tracking-tight">Pre-Concert Strategy</h3>
          <p className="text-zinc-400 text-sm mb-6 leading-relaxed">Located at 1550 Court Pl, the Sheraton serves as our central Denver basecamp. We recommend arriving at the hotel bar at least 45 minutes prior to departure.</p>
          <ul className="space-y-4 text-sm text-zinc-300 font-medium">
            <li className="flex gap-2"><span>📍</span> <span><strong>Official Pickup:</strong> 1550 Court Pl, Denver, CO 80202</span></li>
            <li className="flex gap-2"><span>🚌</span> <span><strong>Fleet:</strong> Late-model Sprinters and Suburbans.</span></li>
            <li>🔗 <a href="https://www.marriott.com/en-us/hotels/dencc-sheraton-denver-downtown-hotel/overview/" target="_blank" className="text-red-500 hover:underline transition">Sheraton Details</a></li>
          </ul>
        </div>
        <div className="aspect-square md:aspect-auto md:h-full min-h-[300px] rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3067.439164214555!2d-104.99227562402128!3d39.74301597155639!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x876c78d052848c41%3A0xe212879659b85c8e!2sSheraton%20Denver%20Downtown%20Hotel!5e0!3m2!1sen!2sus!4v1706990100000!5m2!1sen!2sus" 
            width="100%" height="100%" style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>

      <div className="mt-20 pt-10 border-t border-zinc-900 text-center">
        <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em]">
          Party at Red Rocks | Colorado&apos;s Premier Concert Logistics
        </p>
      </div>
    </div>
  );
}
