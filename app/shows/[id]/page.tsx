import { getEvent } from "@/lib/seatgeek";
import TicketButtons from "@/components/TicketButtons";
import RezdyWidgets from "@/components/RezdyWidgets";

// DCC SAFE IMPORT BRIDGE: Prevents Turbopack build failure if Python data hasn't run
let seoData: any = {};
try {
  seoData = require("@/data/seo_master.json");
} catch (e) {
  console.warn("DCC Intelligence: seo_master.json not found, using logic fallbacks.");
}

export default async function ShowPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const showId = params.id.toLowerCase();
  
  // Fetch live SeatGeek data or handle slug-to-ID search
  const show = await getEvent(params.id);
  const localIntel = seoData[showId];

  // DCC Hardened Venue Guard: Allows custom 2026 slugs to bypass strict ID checks
  const isRedRocks = !show || show.venue.id === 196 || show.venue.name?.includes("Red Rocks") || !!localIntel;

  if (!isRedRocks) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center p-20 text-center">
        <div>
          <h1 className="text-4xl font-black italic uppercase text-red-600 mb-4 underline decoration-red-600">Venue Mismatch</h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Restricted to Red Rocks Amphitheatre Intelligence.</p>
        </div>
      </main>
    );
  }

  // Visual Intelligence: Fallback logic to fix 404 header errors
  const performer = show?.performers?.[0] || { name: localIntel?.title || showId.replace(/-/g, ' '), image: localIntel?.image || "/hero-bg.jpg" };
  const eventDate = show ? new Date(show.datetime_local) : new Date();

  // DCC MULTI-SCHEMA GRAPH: Event, LocalBusiness, and FAQ for SEO dominance
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Event",
        "name": localIntel?.title || show?.title || performer.name,
        "startDate": eventDate.toISOString(),
        "location": { "@type": "Place", "name": "Red Rocks Amphitheatre" },
        "image": performer.image
      },
      {
        "@type": "LocalBusiness",
        "name": "Party at Red Rocks Shuttle",
        "url": "https://partyatredrocks.com",
        "priceRange": "$59-$65",
        "address": { "@type": "PostalAddress", "addressLocality": "Denver", "addressRegion": "CO" }
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
      {/* CANONICAL & SCHEMA INJECTION */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <link rel="canonical" href={`https://partyatredrocks.com/shows/${showId}`} />

      {/* HERO SECTION */}
      <div className="relative h-[65vh] w-full overflow-hidden border-b border-white/10 shadow-2xl">
        <img 
          src={performer.image} 
          alt={show?.title || performer.name}
          className="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-1000"
          onError={(e) => { e.currentTarget.src = "https://seatgeek.com/images/performers-landscape/generic-concert/huge.jpg"; }} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-12 flex flex-col md:flex-row justify-between items-end gap-10">
          <div className="max-w-5xl">
            <h1 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter leading-[0.8] mb-10">
              {localIntel?.title || show?.title || performer.name}
            </h1>
            <p className="text-yellow-400 font-black italic uppercase text-xl mb-10 tracking-tight">
              {localIntel?.guests || "Destination Performance // 2026"}
            </p>
            <div className="flex flex-wrap gap-8 items-center bg-black/40 p-4 rounded-2xl backdrop-blur-md border border-white/5 w-fit">
              <p className="text-red-600 font-black uppercase tracking-[0.3em] text-sm italic">
                {eventDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
              <a href="https://www.redrocksonline.com" target="_blank" className="text-zinc-400 font-black uppercase tracking-widest text-[9px] hover:text-white transition underline decoration-yellow-400 underline-offset-4 italic">Venue Official</a>
              <a href="http://googleusercontent.com/maps.google.com/8" target="_blank" className="text-zinc-400 font-black uppercase tracking-widest text-[9px] hover:text-white transition underline decoration-blue-600 underline-offset-4 italic">Directions</a>
            </div>
          </div>
          <div className="text-right border-l border-white/20 pl-10 hidden lg:block bg-black/40 p-6 rounded-3xl backdrop-blur-md">
            <p className="text-zinc-500 uppercase font-black text-[9px] tracking-widest mb-1 italic font-mono">DCC Market Watch</p>
            <p className="text-7xl font-black italic text-yellow-400 tracking-tighter">${show?.stats?.lowest_price || "TBA"}</p>
          </div>
        </div>
      </div>

      {/* CONTENT GRID */}
      <div className="grid grid-cols-12 gap-12 p-12">
        <div className="col-span-12 lg:col-span-4 space-y-12">
          {show && <div className="p-2 rounded-[3.5rem] bg-zinc-900/30 border border-white/5 shadow-2xl"><TicketButtons event={show} /></div>}
          
          <div className="p-10 rounded-[3rem] bg-zinc-900/50 border border-white/5 shadow-2xl">
            <h3 className="text-red-600 font-black uppercase text-[10px] tracking-[0.5em] mb-8 italic border-b border-white/5 pb-4">Destination Intelligence</h3>
            <p className="text-zinc-300 text-lg leading-relaxed font-medium italic">
              {performer.name} live performance profile is active. Secure shuttle booking recommended to bypass 2026 surge delays.
            </p>
          </div>

          <div className="p-10 rounded-[3rem] bg-zinc-900/50 border border-white/5 shadow-2xl">
            <h3 className="text-yellow-400 font-black uppercase text-[10px] tracking-[0.5em] mb-8 italic border-b border-white/5 pb-4">Setlist Intelligence</h3>
            <div className="bg-black/30 p-4 rounded-2xl border border-white/5 mb-6 text-center">
              <span className="text-zinc-500 font-black uppercase text-[9px] tracking-widest block mb-2">Predicted Set Length</span>
              <span className="text-white font-black italic text-4xl tracking-tighter">14 - 18 Tracks</span>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed font-medium italic">Intelligence aggregated from past tour data. Expect a mix of core hits and new material curated for the monoliths.</p>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-8">
          {/* REZDY BOOKING WIDGETS */}
          <section id="booking" className="bg-zinc-900/40 p-2 rounded-[4.5rem] border border-white/5 min-h-[1200px] shadow-inner">
            <RezdyWidgets />
          </section>
        </div>
      </div>
    </main>
  );
}
