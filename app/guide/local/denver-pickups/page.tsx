import Link from 'next/link';

export default function DenverPickups() {
  const localSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Party at Red Rocks / GoSno LLC",
    "image": "https://partyatredrocks.com/images/denver-shuttle.jpg",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "1550 Court Pl",
      "addressLocality": "Denver",
      "addressRegion": "CO",
      "postalCode": "80202"
    },
    "geo": { "@type": "GeoCoordinates", "latitude": 39.7430, "longitude": -104.9903 },
    "priceRange": "$55-$499"
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localSchema) }} />
      
      <h1 className="text-4xl font-black mb-4 text-slate-900">Denver Shuttle Hub: Sheraton Downtown</h1>
      <p className="text-lg text-slate-700 mb-8 leading-relaxed italic">
        The primary Denver-to-Red Rocks pickup for GoSno LLC and Party at Red Rocks.
      </p>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="p-8 border rounded-3xl bg-slate-50">
          <h3 className="font-bold text-xl mb-4 text-red-700">Pre-Concert Strategy</h3>
          <p className="text-sm mb-4">Located at 1550 Court Pl, the Sheraton is the perfect pre-show basecamp. We recommend arriving 30 mins early to utilize the hotel bars before the <strong>2.5-hour pre-doors departure</strong>.</p>
          <ul className="space-y-2 text-sm">
            <li>📍 <strong>Official Pickup:</strong> 1550 Court Pl, Denver, CO 80202</li>
            <li>🚌 <strong>Fleet:</strong> Late-model Sprinters and Suburbans.</li>
            <li>🔗 <a href="https://visitdenver.com" target="_blank" className="underline">Visit Denver Official Guide</a></li>
          </ul>
        </div>
        <div className="bg-slate-200 rounded-3xl flex items-center justify-center text-slate-400 font-bold italic h-64 border-2 border-dashed">
            [Google Maps Embed - Sheraton Downtown Denver]
        </div>
      </div>

      <p className="text-center text-slate-500 text-sm">
        Party at Red Rocks is a Tier-1 operator licensed by the Colorado PUC (LL-02649).
      </p>
    </div>
  );
}
