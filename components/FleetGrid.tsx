"use client";

import React from "react";
import Link from "next/link";

export default function FleetGrid() {
  // 🛰️ Internal logic: Target the first mission of the 2026 season
  const primarySlug = "two-friends";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      
      {/* 🚐 SHUTTLE EXEC CARD */}
      <div className="bg-surface/40 border border-white/10 rounded-3xl p-6 flex flex-col items-center text-center space-y-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <img src="/shuttle-exec.jpg" alt="Shuttle Exec" className="object-cover w-full h-full" />
          <span className="absolute top-4 right-4 bg-neon-blue text-black font-black text-[10px] px-3 py-1 rounded-full shadow-[0_0_10px_#00f2ff]">
            $59.00
          </span>
        </div>
        <div>
          <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">SHUTTLE_EXEC</h3>
          <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-1 italic">// PICKUP: SHERATON DOWNTOWN (COURT ST)</p>
        </div>
        
        {/* ✅ FIXED BUTTON: NEON BLUE + NO 404 LINK */}
        <Link 
          href={`/shows/${primarySlug}`}
          className="w-full py-4 bg-neon-blue text-black font-black uppercase italic tracking-tighter text-sm rounded-2xl hover:bg-white transition-all shadow-[0_0_20px_#00f2ff] active:scale-95 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
        >
          BOOK_SHUTTLE
        </Link>
      </div>

      {/* 🏎️ PRIVATE SUV NODE CARD */}
      <div className="bg-surface/40 border border-white/10 rounded-3xl p-6 flex flex-col items-center text-center space-y-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <img src="/private-suv.jpg" alt="Private Suburban" className="object-cover w-full h-full" />
          <span className="absolute top-4 right-4 bg-white text-black font-black text-[10px] px-3 py-1 rounded-full shadow-lg">
            $499.00
          </span>
        </div>
        <div>
          <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">PRIVATE_SUV_NODE</h3>
          <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-1 italic">// DOOR-TO-DOOR SERVICE</p>
        </div>
        
        {/* ✅ FIXED BUTTON: NEON BLUE + NEW LABEL */}
        <Link 
          href={`/shows/${primarySlug}`}
          className="w-full py-4 bg-neon-blue text-black font-black uppercase italic tracking-tighter text-sm rounded-2xl hover:bg-white transition-all shadow-[0_0_20px_#00f2ff] active:scale-95 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
        >
          BOOK_PRIVATE_SUBURBAN
        </Link>
      </div>

    </div>
  );
}
