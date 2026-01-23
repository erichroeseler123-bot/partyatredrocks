import { getEvent } from "@/lib/seatgeek";
import TicketButtons from "@/components/TicketButtons";
import RezdyWidgets from "@/components/RezdyWidgets";

// SAFE IMPORT: Prevents build failure if Python hasn't run yet
let seoData: any = {};
try {
  seoData = require("@/data/seo_master.json");
} catch (e) {}

export default async function ShowPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const show = await getEvent(params.id);
  const intelligence = seoData[params.id];

  // DCC Hardened Check: Bypasses mismatch if show exists in your 2026 custom list
  const isRedRocks = show?.venue?.id === 196 || show?.venue?.name?.includes("Red Rocks") || !!intelligence;

  if (!isRedRocks) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center p-20 text-center">
        <div>
          <h1 className="text-4xl font-black italic uppercase text-red-600 mb-4 underline decoration-red-600">Venue Mismatch</h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Destination Intelligence Restricted to Venue 196.</p>
        </div>
      </main>
    );
  }

  const performer = show?.performers?.[0] || { name: params.id.toUpperCase(), image: "/hero-bg.jpg" };
  const eventDate = show ? new Date(show.datetime_local) : new Date();

  // DCC INTELLIGENCE: MULTI-SCHEMA GRAPH
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Event",
        "name": show?.title || performer.name,
        "startDate": eventDate.toISOString(),
        "location": { "@type": "Place", "name": "Red Rocks Amphitheatre" }
      },
      {
        "@type": "LocalBusiness",
        "name": "Party at Red Rocks Shuttle",
        "priceRange": "$59-$65",
        "url": "https://partyatredrocks.com"
      },
      {
        "@type": "FAQPage",
        "mainEntity": [{
          "@type": "Question",
          "name": "Where is the Red Rocks shuttle pickup?",
          "acceptedAnswer": { "@type": "Answer", "text": "Pickup is at the Sheraton Denver Downtown and Trailhead Taphouse in Golden." }
        }]
      }
    ]
  };

  return (
    <main className="min-h-screen bg-black text-white font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <link rel="canonical" href={`https://partyatredrocks.com/shows/${params.id}`} />

      {/* HERO IMAGE & HEADER RESTORATION */}
      <div className="relative h-[65vh] w-full overflow-hidden border-b border-white/10 shadow-2xl">
        <img src={performer.image} className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-1000" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-12">
          <h1 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter leading-[0.8] mb-6">{show?.title || performer.name}</h1>
          <div className="flex flex-wrap gap-8 items-center bg-black/40 p-4 rounded-2xl border border-white/5 backdrop-blur-md w-fit">
            <p className="text-red-600 font-black uppercase tracking-[0.3em] text-sm italic">
              {eventDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
            <a href="https://www.redrocksonline.com" target="_blank" className="text-zinc-400 font-black uppercase tracking-widest text-[9px] hover:text-white transition underline decoration-yellow-400 underline-offset-4 italic">Venue Official</a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-12 p-12">
        <div className="col-span-12 lg:col-span-4 space-y-12">
          {show && <TicketButtons event={show} />}
          <div className="p-10 rounded-[3rem] bg-zinc-900/50 border border-white/5 shadow-2xl">
            <h3 className="text-red-600 font-black uppercase text-[10px] tracking-[0.5em] mb-6 italic">DCC Intelligence</h3>
            <p className="text-zinc-300 italic">{performer.name} live performance profile is active. Secure shuttle booking recommended to avoid 2026 surge delays.</p>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-8">
          <section id="booking" className="bg-zinc-900/40 p-2 rounded-[4.5rem] border border-white/5 min-h-[1200px] shadow-inner">
            <RezdyWidgets />
          </section>
        </div>
      </div>
    </main>
  );
}
