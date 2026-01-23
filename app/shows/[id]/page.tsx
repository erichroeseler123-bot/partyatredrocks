import { getEvent } from "@/lib/seatgeek";
import TicketButtons from "@/components/TicketButtons";
import RezdyWidgets from "@/components/RezdyWidgets";
import seoData from "@/data/seo_master.json"; // PULLS FROM PYTHON TOOL

export default async function ShowPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const show = await getEvent(params.id);
  const intelligence = (seoData as any)[params.id];

  if (!show || show.venue.id !== 196) {
    return <div className="p-20 text-center text-red-600 font-black uppercase">Venue Mismatch</div>;
  }

  // DCC INTELLIGENCE: SCHEMA GRAPH
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      intelligence?.schema,
      {
        "@type": "LocalBusiness",
        "name": "Party at Red Rocks Shuttle",
        "url": "https://partyatredrocks.com",
        "priceRange": "$59-$65",
        "address": { "@type": "PostalAddress", "addressLocality": "Denver", "addressRegion": "CO" }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Where is the shuttle pickup for Red Rocks?",
            "acceptedAnswer": { "@type": "Answer", "text": "Pickup is at the Sheraton Denver Downtown and Trailhead Taphouse in Golden." }
          }
        ]
      }
    ]
  };

  return (
    <main className="min-h-screen bg-black text-white">
      {/* CANONICAL & SCHEMA INJECTION */}
      <link rel="canonical" href={intelligence?.canonical || `https://partyatredrocks.com/shows/${params.id}`} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="relative h-[60vh] overflow-hidden border-b border-white/10">
        <img src={show.performers[0].image} className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-1000" />
        <div className="absolute bottom-0 p-12 bg-gradient-to-t from-black to-transparent w-full">
          <h1 className="text-8xl font-black italic uppercase tracking-tighter leading-none">{show.title}</h1>
          <p className="text-red-600 font-black uppercase tracking-[0.4em] mt-4 italic text-xs underline decoration-red-600 decoration-2 underline-offset-8">
            DCC Intelligence Active
          </p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-12 p-12">
        <div className="col-span-12 lg:col-span-4 space-y-12">
          <TicketButtons event={show} />
          <div className="p-10 rounded-[3rem] bg-zinc-900/50 border border-white/5">
            <h3 className="text-red-600 font-black uppercase text-[10px] tracking-[0.5em] mb-6">Artist Context</h3>
            <p className="text-zinc-300 italic">{show.performers[0].name} live setlist intelligence is currently loading...</p>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-8">
          <section className="bg-zinc-900/40 p-2 rounded-[3.5rem] border border-white/5 min-h-[1000px]"><RezdyWidgets /></section>
        </div>
      </div>
    </main>
  );
}
