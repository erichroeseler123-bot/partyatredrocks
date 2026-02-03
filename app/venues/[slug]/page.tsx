import Link from 'next/link';
import { notFound } from 'next/navigation';

// ... (venueData object remains the same as previous step)

export default async function VenuePage({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const venue = venueData[slug as keyof typeof venueData];
  if (!venue) notFound();

  const events = await getEventsForVenue(slug);

  // --- DYNAMIC SCHEMA GENERATION ---
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `How do I get a shuttle to ${venue.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          "text": `Our All-Venue City Service provides door-to-door transport to ${venue.name} from any hotel or residence in Denver or Boulder. We offer flat-rate pricing starting at $250 for groups.`
        }
      },
      {
        "@type": "Question",
        "name": "Does the shuttle wait for me after the concert?",
        acceptedAnswer: {
          "@type": "Answer",
          "text": "Yes. Unlike Uber or Lyft, our drivers wait at a designated spot right outside the venue entrance. You won't have to hunt for a ride or deal with post-show surge pricing."
        }
      }
    ]
  };

  return (
    <main className="min-h-screen bg-black text-white py-12 px-6">
      {/* Injecting FAQ Schema */}
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

        {/* Live Show Schedule Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-black mb-8 border-b border-zinc-800 pb-4 uppercase italic">
            Upcoming Shows
          </h2>

          <div className="space-y-6">
            {events.slice(0, 10).map((event: any) => (
              <div key={event.id} className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-6 transition-all hover:border-red-600">
                <div className="text-center md:text-left">
                  <h3 className="text-xl font-black uppercase italic">{event.title}</h3>
                  <p className="text-zinc-500 font-bold text-sm">
                    {new Date(event.datetime_utc).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex gap-4">
                  {event.url && (
                    <a
                      href={event.url}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="bg-zinc-800 hover:bg-zinc-700 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest text-white transition"
                    >
                      Tickets via SeatGeek
                    </a>
                  )}
                  <Link 
                    href="/book-all-venue"
                    className="bg-red-600 hover:bg-red-500 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest text-white transition shadow-lg"
                  >
                    Book Shuttle
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-[10px] text-zinc-600 text-center uppercase font-bold tracking-widest">
            *Ticket links are provided via SeatGeek. Official transport provided by Party at Red Rocks.
          </p>
        </section>

        {/* (Rest of the location/map/shuttle-fit components from previous step) */}
      </div>
    </main>
  );
}
