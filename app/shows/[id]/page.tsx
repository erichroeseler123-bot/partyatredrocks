import { getEvent } from "@/lib/seatgeek";
import TicketButtons from "@/components/TicketButtons";
import RezdyWidgets from "@/components/RezdyWidgets";
import Head from 'next/head';

export default async function ShowPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const show = await getEvent(params.id);

  if (!show || show.venue.id !== 196) {
    return <div className="p-20 text-center text-red-600">Venue Mismatch: Red Rocks Only</div>;
  }

  const performer = show.performers[0];
  const canonicalUrl = `https://partyatredrocks.com/shows/${params.id}`;

  // DCC INTELLIGENCE: SCHEMA MARKUP BLOCK
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Event",
        "name": show.title,
        "startDate": show.datetime_local,
        "location": {
          "@type": "Place",
          "name": "Red Rocks Amphitheatre",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "18300 W Alameda Pkwy",
            "addressLocality": "Morrison",
            "addressRegion": "CO",
            "postalCode": "80465",
            "addressCountry": "US"
          }
        },
        "image": performer.image,
        "description": `Secure shuttle transportation for ${show.title} at Red Rocks. ${performer.name} live performance intelligence.`
      },
      {
        "@type": "LocalBusiness",
        "name": "Party at Red Rocks Shuttle",
        "description": "Premium round-trip shuttle service from Denver and Golden to Red Rocks Amphitheatre.",
        "url": "https://partyatredrocks.com",
        "telephone": "720-000-0000",
        "priceRange": "$59-$65",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Denver",
          "addressRegion": "CO",
          "addressCountry": "US"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Where is the shuttle pickup for Red Rocks?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Shuttles depart from downtown Denver (Sheraton) and the Trailhead Taphouse in Golden."
            }
          },
          {
            "@type": "Question",
            "name": "How much is the shuttle to Red Rocks?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Shared shuttles are $65 from Denver and $59 from Golden. Private SUVs are available for $499."
            }
          }
        ]
      }
    ]
  };

  return (
    <main className="min-h-screen bg-black text-white">
      {/* SCHEMA & CANONICAL INJECTION */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <link rel="canonical" href={canonicalUrl} />

      <div className="relative h-[50vh] overflow-hidden border-b border-white/10">
        <img src={performer.image} alt={show.title} className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-1000" />
        <div className="absolute bottom-0 p-12 bg-gradient-to-t from-black to-transparent w-full">
          <h1 className="text-8xl font-black italic uppercase tracking-tighter">{show.title}</h1>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-12 p-12">
        <div className="col-span-12 lg:col-span-4 space-y-12">
          <div className="p-10 rounded-[3rem] bg-zinc-900/50 border border-white/5">
            <h3 className="text-red-600 font-black uppercase text-[10px] tracking-[0.5em] mb-6">Artist Intelligence</h3>
            <p className="text-zinc-300 italic">{performer.name} is scheduled for a headline set at Venue 196. Book transportation now to avoid surge pricing.</p>
          </div>

          {/* SETLIST FEED */}
          <div className="p-10 rounded-[3rem] bg-zinc-900/50 border border-white/5">
            <h3 className="text-yellow-400 font-black uppercase text-[10px] tracking-[0.5em] mb-6">Setlist Intelligence</h3>
            <p className="text-zinc-500 text-xs">Aggregating live data for {performer.name}...</p>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-8">
          <section className="bg-zinc-900/40 p-2 rounded-[3.5rem] border border-white/5 min-h-[1000px]">
            <RezdyWidgets />
          </section>
        </div>
      </div>
    </main>
  );
}
