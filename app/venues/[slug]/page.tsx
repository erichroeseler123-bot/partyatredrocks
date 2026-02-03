import Link from 'next/link';
import { notFound } from 'next/navigation';

// -----------------------------------------------------------------------------
// 1. Master Venue Intelligence Database (Defined at top-level for scope)
// -----------------------------------------------------------------------------
const venueData = {
  'mission-ballroom': {
    name: 'Mission Ballroom',
    slug: 'mission-ballroom',
    location: 'RiNo, Denver',
    capacity: '3,950',
    address: '4242 Wynkoop St, Denver, CO 80216',
    description: 'Modern warehouse-style venue. Post-show crowds can be chaotic—our shuttle waits right at the main entrance.',
    pickupNote: '38th & Blake St access.',
    shuttleFit: 'RiNo location makes custom hotel/bar pickups seamless.'
  },
  'ball-arena': {
    name: 'Ball Arena',
    slug: 'ball-arena',
    location: 'Downtown Denver',
    capacity: '20,000',
    address: '1000 Chopper Cir, Denver, CO 80204',
    description: 'Major national tours. Avoid expensive parking and 45-minute rideshare queues.',
    pickupNote: 'Downtown hotel hub.',
    shuttleFit: 'Door-to-door from Downtown; skip the stadium traffic.'
  },
  'fiddlers-green': {
    name: "Fiddler's Green Amphitheatre",
    slug: 'fiddlers-green',
    location: 'Greenwood Village',
    capacity: '18,000',
    address: '6350 Greenwood Plaza Blvd, Greenwood Village, CO 80111',
    description: 'Outdoor venue in the Tech Center. Post-show I-25 traffic is notoriously gridlocked.',
    pickupNote: 'DTC hotel access.',
    shuttleFit: 'Fastest exit via flat-rate Suburban service.'
  },
  'ogden-theatre': {
    name: 'Ogden Theatre',
    slug: 'ogden-theatre',
    location: 'Colfax, Denver',
    capacity: '1,600',
    address: '935 E Colfax Ave, Denver, CO 80218',
    description: 'Historic and intimate rock venue. Limited neighborhood parking.',
    pickupNote: 'Colfax door-to-door.',
    shuttleFit: 'Perfect for small crews visiting local bars.'
  },
  'fillmore-auditorium': {
    name: 'Fillmore Auditorium',
    slug: 'fillmore-auditorium',
    location: 'Colfax, Denver',
    capacity: '3,900',
    address: '1510 Clarkson St, Denver, CO 80218',
    description: 'Large historic theatre. We wait for you directly on Clarkson St.',
    pickupNote: 'Clarkson St entrance.',
    shuttleFit: 'Door-to-door means no walking through crowds in the dark.'
  }
  // ... (Add additional venues here following the same format)
};

// -----------------------------------------------------------------------------
// 2. Fetch Live Show Data (SeatGeek API)
// -----------------------------------------------------------------------------
async function getEventsForVenue(venueName: string) {
  const clientId = process.env.SEATGEEK_CLIENT_ID;
  if (!clientId) return [];

  const url = `https://api.seatgeek.com/2/events?client_id=${clientId}&venue.name=${encodeURIComponent(venueName)}&per_page=10`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.events || [];
  } catch (err) {
    return [];
  }
}

// -----------------------------------------------------------------------------
// 3. Dynamic Page Component
// -----------------------------------------------------------------------------
export default async function VenuePage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const venue = venueData[slug as keyof typeof venueData];

  if (!venue) notFound();

  const events = await getEventsForVenue(venue.name);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `How do I get a shuttle to ${venue.name}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Our City Service provides door-to-door transport to ${venue.name} from any Denver/Boulder hotel or residence.`
        }
      },
      {
        "@type": "Question",
        "name": "Does the shuttle wait for me after the concert?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Drivers wait at a designated spot right outside the entrance so you skip surge pricing and long Uber lines."
        }
      }
    ]
  };

  return (
    <main className="min-h-screen bg-black text-white py-12 px-6">
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} 
      />

      <div className="max-w-5xl mx-auto">
        <header className="mb-12 border-l-4 border-red-600 pl-8">
          <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter">
            {venue.name}
          </h1>
          <p className="mt-3 text-xl text-zinc-400 font-bold">{venue.location}</p>
        </header>

        <section className="mb-20">
          <h2 className="text-3xl font-black mb-8 border-b border-zinc-800 pb-4 uppercase italic">
            Upcoming Shows
          </h2>

          <div className="space-y-6">
            {events.length > 0 ? (
              events.map((event: any) => (
                <div key={event.id} className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-6 transition-all hover:border-red-600 shadow-xl">
                  <div className="text-center md:text-left">
                    <h3 className="text-xl font-black uppercase italic">{event.title}</h3>
                    <p className="text-zinc-500 font-bold text-sm">
                      {new Date(event.datetime_local).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex gap-4">
                    {event.url && (
                      <a href={event.url} target="_blank" rel="noopener noreferrer nofollow" className="bg-zinc-800 hover:bg-zinc-700 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest text-white transition">
                        Tickets via SeatGeek
                      </a>
                    )}
                    <Link href="/book-all-venue" className="bg-red-600 hover:bg-red-500 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest text-white transition shadow-lg">
                      Book Shuttle
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-zinc-500 italic">No upcoming shows found. Check back soon for schedule updates.</p>
            )}
          </div>
        </section>

        {/* Location & Maps Node */}
        <section className="mb-20">
          <h3 className="text-2xl font-black mb-6 uppercase italic">Location & Directions</h3>
          <p className="text-zinc-400 mb-6">{venue.address}</p>
          <div className="aspect-video rounded-[2rem] overflow-hidden border border-zinc-800 shadow-2xl">
            <iframe
              src={`http://googleusercontent.com/maps.google.com/76{encodeURIComponent(venue.address)}&output=embed`}
              width="100%" height="100%" style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </section>
      </div>
    </main>
  );
}

export async function generateStaticParams() {
  return Object.keys(venueData).map((slug) => ({ slug }));
}
