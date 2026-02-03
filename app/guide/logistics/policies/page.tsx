import Link from 'next/link';

export default function VenuePolicies() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Can I smoke marijuana at Red Rocks?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Technically, no. While legal in Colorado, public consumption is prohibited. Red Rocks security strictly enforces no smoking in the seating area. Designated smoking areas are located only along the outside rails of the North and South stairs."
        }
      },
      {
        "@type": "Question",
        "name": "Where are the family restrooms at Red Rocks?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Accessible family restrooms are located at the top of the amphitheatre adjacent to Row 70 and inside the Visitor Center (accessible via elevator). New public restrooms are also available at the 'Depot' in the Upper North Lot."
        }
      }
    ]
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <h1 className="text-4xl font-black mb-6">Red Rocks Rules: The Insider FAQ</h1>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-red-700">Alcohol & Tailgating</h2>
        <p className="mb-4">You can bring <strong>beer and wine</strong> into the parking lots for tailgating, but <strong>no glass</strong> and <strong>no kegs</strong>. Once you hit the gate, all alcohol must stay behind. You are allowed one factory-sealed non-alcoholic beverage (32oz or less) per person.</p>
      </section>

      <section className="mb-12 bg-slate-50 p-8 rounded-2xl border">
        <h2 className="text-2xl font-bold mb-4">Cannabis & Smoking</h2>
        <p>Colorado law is clear: No public consumption. Security <em>will</em> eject you for smoking in the rows. If you must smoke, head to the <strong>designated rails</strong> on the North/South stairs. Pro-tip: Edibles are the common workaround for fans, but remember the high altitude triples the effect.</p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Bathroom Intelligence</h2>
        <ul className="list-disc ml-5 space-y-2">
          <li><strong>Top of Venue:</strong> Row 70 (Family/ADA accessible).</li>
          <li><strong>Bottom of Venue:</strong> Visitor Center North end (Newly remodeled).</li>
          <li><strong>The "Secret" Spot:</strong> The new <strong>Red Rocks Depot</strong> in the Upper North Lot has public restrooms that are often cleaner and less crowded pre-show.</li>
        </ul>
      </section>
    </div>
  );
}
