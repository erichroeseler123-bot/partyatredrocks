import Link from 'next/link';

export default function WeatherPrep() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What happens if it rains at Red Rocks?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Shows at Red Rocks are 'Rain or Shine.' Unless there is active lightning in the immediate area, the concert will continue. Always check the official Red Rocks Twitter for real-time delay updates."
        }
      }
    ]
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      
      <h1 className="text-4xl font-black mb-4">Red Rocks Weather Prep Guide (2026)</h1>
      <p className="text-lg text-zinc-200 mb-8">
        Red Rocks is a high-altitude outdoor venue (6,450ft). Weather changes fast. Use the 
        <a href="https://forecast.weather.gov/MapClick.php?lat=39.6653&lon=-105.2069" target="_blank" className="text-red-700 underline mx-1">NWS Morrison Point Forecast</a> 
        for the most accurate data.
      </p>

      <h2 className="text-2xl font-bold mb-4">The Red Rocks Prep Matrix</h2>
      <div className="overflow-x-auto mb-10">
        <table className="w-full text-left border-collapse border">
          <thead>
            <tr className="bg-slate-100">
              <th className="border p-4">Forecasted Low</th>
              <th className="border p-4">Recommended Layers</th>
              <th className="border p-4">Pro-Tip</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="border p-4">60°F+</td><td className="border p-4">Light Hoodie</td><td className="border p-4">Drink 2x water; elevation dehydrates.</td></tr>
            <tr><td className="border p-4">45°F - 55°F</td><td className="border p-4">Heavy Jacket + Gloves</td><td className="border p-4">The wind off the rocks feels 10° colder.</td></tr>
            <tr><td className="border p-4">Below 40°F</td><td className="border p-4">Thermal Base + Beanie</td><td className="border p-4">Our heated SUVs provide post-show relief.</td></tr>
          </tbody>
        </table>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-6">
        <h3 className="font-bold">Lightning Protocol</h3>
        <p>If lightning is detected within 8 miles, the venue may move fans to their vehicles. Our shuttles remain on-site and unlocked for your safety during weather delays.</p>
      </div>
    </div>
  );
}
