import React from 'react';
import { DISPLAY } from "@/lib/display";
import GlobalSearch from '@/components/GlobalSearch';

export default function ShuttlesPage() {
  return (
    <div className="min-h-screen bg-surface text-white font-mono selection:bg-matrix-green/30 w-full pb-20">
      <main className="p-8 lg:p-12 max-w-7xl mx-auto">
        
        {/* SECTION B: INTEL_HEADER & GLOBAL_SEARCH */}
        <header className="mb-12 border-b border-soft pb-8">
          <p className="text-[10px] text-neon-blue mb-2 tracking-[0.4em] uppercase italic font-bold">Global Intelligence // System_Active</p>
          <h1 className="text-6xl font-black uppercase italic tracking-tighter mb-8 text-white">TRANSPORT <span className="text-neon-blue not-italic">INTEL</span></h1>
          <GlobalSearch />
        </header>

        {/* SECTION C: VISUAL_SYNC_PORTAL */}
        <section className="relative w-full aspect-video lg:aspect-[21/9] panel rounded-2xl mb-4 flex flex-col items-center justify-center group overflow-hidden shadow-2xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <img src={DISPLAY.images.marketing.fleet} alt="DCC Fleet Operations" className="absolute inset-0 w-full h-full object-cover z-0 opacity-100" />
          <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden opacity-10">
            <div className="w-full h-full bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />
          </div>
          <div className="absolute top-4 left-4 z-30 font-mono text-[10px] text-neon-blue uppercase tracking-widest bg-surface/60 px-2 py-1 border border-neon-blue/20 font-bold italic">REC ● LIVE_FEED // FLEET_SYNC_ACTIVE</div>
        </section>

        <div className="mb-16 text-center">
           <a href="/gallery" className="group inline-flex items-center gap-4">
              <span className="text-muted font-mono text-[10px] tracking-[0.3em] uppercase group-hover:text-neon-blue transition-colors italic font-bold">
                Node: Fleet_Operations // <span className="underline font-black uppercase">Open_Intel_Gallery</span> →
              </span>
           </a>
        </div>

        {/* SECTION D: NATIVE SERVICE VECTORS (OUTLINE STYLE) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24">
          
          {/* NODE 01: SHARED SHUTTLE */}
          <section className="space-y-6">
            <div className="border border-soft rounded-2xl overflow-hidden group hover:border-neon-blue transition-all shadow-2xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <img src={DISPLAY.images.marketing.shuttle} alt="Shuttle Service" className="w-full h-64 object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="space-y-6">
              <div className="border-b border-neon-blue/30 pb-2 flex justify-between items-end">
                <h2 className="text-4xl font-black italic uppercase tracking-tighter">$59 SHUTTLE</h2>
                <p className="text-[10px] text-neon-blue font-bold uppercase tracking-[0.2em] font-mono">// SHARED_VECTOR</p>
              </div>
              <div className="grid grid-cols-1 gap-2 text-[11px] font-mono uppercase tracking-widest text-muted">
                <div className="flex border-l-2 border-neon-blue pl-4 py-1">01. CAPACITY: 14 PAX MAX / TRANSIT</div>
                <div className="flex border-l-2 border-neon-blue pl-4 py-1">02. ROUTE: UNION STATION ↔ VENUE</div>
              </div>
              <a href="/book?type=shuttle" className="block w-full py-4 bg-neon-blue text-white text-center font-black uppercase text-sm tracking-widest rounded-sm hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-blue-900/20">
                EXECUTE_BOOKING
              </a>
            </div>
          </section>

          {/* NODE 02: VIP SUV (CHEVROLET SUBURBAN) */}
          <section className="space-y-6">
            <div className="border border-soft rounded-2xl overflow-hidden group hover:border-matrix-green transition-all shadow-2xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <img src={DISPLAY.images.marketing.vipSuv} alt="VIP Service" className="w-full h-64 object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="space-y-6">
              <div className="border-b border-matrix-green/30 pb-2 flex justify-between items-end">
                <h2 className="text-4xl font-black italic uppercase tracking-tighter text-matrix-light">VIP SUV</h2>
                <p className="text-[10px] text-matrix-green font-bold uppercase tracking-[0.2em] font-mono">// PRIVATE_VECTOR</p>
              </div>
              <div className="grid grid-cols-1 gap-2 text-[11px] font-mono uppercase tracking-widest text-muted">
                <div className="flex border-l-2 border-matrix-green pl-4 py-1">01. FLEET: CHEVROLET SUBURBAN</div>
                <div className="flex border-l-2 border-matrix-green pl-4 py-1">02. MISSION: DOOR-TO-DOOR OPS</div>
              </div>
              <a href="/book?type=suv" className="block w-full py-4 border border-matrix-green bg-matrix-green/10 text-matrix-green text-center font-black uppercase text-sm tracking-widest rounded-sm hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-green-900/20">
                REQUEST_VIP_SYNC
              </a>
            </div>
          </section>

        </div>

        {/* SECTION E: GLOBAL CARRIER NETWORK // SHARED VECTOR INTELLIGENCE */}
        <section className="border-t border-soft pt-16 mb-20">
          <div className="mb-12">
            <h3 className="text-2xl font-black uppercase italic tracking-widest mb-2">Carrier Network // Shared Intelligence</h3>
            <p className="text-[10px] text-muted font-mono uppercase tracking-widest italic">// Intelligence summaries for per-person transport vectors</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[
              { name: "Bus to Show", url: "https://bustoshow.org", rate: "$35", intel: "Non-profit // School buses // BYOB // Union Station + Boulder Nodes." },
              { name: "Bus Party Colorado", url: "https://buspartyco.com", rate: "$59", intel: "21+ Only // RiNo Pre-Party at Shambles // Lights + Music sync." },
              { name: "RM Event Shuttles", url: "https://rmeshuttles.com", rate: "$57.50", intel: "Hotel Pickup (Kimpton/Origin) // All ages // Minimal walking node." },
              { name: "On Location (RRX)", url: "https://rrxshuttles.com", rate: "$65", intel: "55-Pax capacity // Onboard bathrooms // Illegal Pete's + Union Station." },
              { name: "Red Rocks Shuttle", url: "https://redrocksshuttle.com", rate: "$65-69", intel: "Air-conditioned transit // Union Station node // Private options available." }
            ].map((node) => (
              <a key={node.name} href={node.url} target="_blank" rel="noopener noreferrer" className="p-6 border border-soft bg-surface-strong/30 hover:border-neon-blue transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <h5 className="font-black italic uppercase text-xl group-hover:text-neon-blue transition-colors">{node.name}</h5>
                  <span className="text-xs text-neon-blue font-black underline italic tracking-widest">{node.rate}</span>
                </div>
                <p className="text-[11px] text-muted font-mono tracking-widest leading-relaxed uppercase border-l-2 border-soft pl-4">
                  <span className="text-faint font-bold">SitRep:</span> {node.intel}
                </p>
                <div className="mt-6 text-[9px] text-faint font-bold tracking-[0.4em] uppercase group-hover:text-neon-blue">Execute_External_Resolve →</div>
              </a>
            ))}
          </div>
        </section>

        {/* SECTION F: PRIVATE COMMAND NODES // SUV INTELLIGENCE */}
        <section className="border-t border-soft pt-16">
          <div className="mb-12">
            <h3 className="text-2xl font-black uppercase italic tracking-widest mb-2">Private Command Nodes // SUV Ops</h3>
            <p className="text-[10px] text-muted font-mono uppercase tracking-widest italic">// Resolve external private SUV intelligence</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Blue Sky Limo", url: "https://blueskylimovail.com", intel: "Luxury SUV focus // 24/7 Ops" },
              { name: "Mr. Chauffeur", url: "https://mrchauffeurcolorado.com", intel: "1-5 Pax // Professional Sync" },
              { name: "Red Rocks Voyager", url: "https://redrocksvoyager.com", intel: "Event Specialists // Door-to-Door" },
              { name: "Rockin Transportation", url: "https://rockintransportation.com", intel: "Tailgate Specialized // Chiller/Ice" },
              { name: "Eagle Vail Express", url: "https://eaglevailexpress.com", intel: "Luxury Fleet // All Concerts" },
              { name: "Denver Limo Service", url: "https://limousinesdenver.com", intel: "Fleet variety // Large Party Sync" },
              { name: "Red Rocks Limo", url: "https://redrocks.limo", intel: "Escalade Focus // VIP Priority" },
              { name: "Silver Mountain Express", url: "https://silvermountainexpress.com", intel: "Reliable Event Reliability Node" }
            ].map((node) => (
              <a key={node.name} href={node.url} target="_blank" rel="noopener noreferrer" className="p-5 border border-soft bg-surface-strong/10 hover:border-matrix-green transition-all group">
                <h5 className="font-black italic uppercase text-sm mb-2 group-hover:text-matrix-light">{node.name}</h5>
                <p className="text-[9px] text-muted font-mono tracking-widest uppercase mb-4">{node.intel}</p>
                <div className="text-[8px] text-faint font-bold tracking-[0.3em] uppercase group-hover:text-matrix-green">Resolve_Command_Node →</div>
              </a>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
