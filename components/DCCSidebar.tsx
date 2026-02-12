"use client";
import React from 'react';
import { useMap } from "@/app/context/MapContext";
import { MAP_PRESETS } from "@/lib/presets";

interface SidebarProps {
  setSearch: (val: string) => void;
  searchValue: string;
}

export default function DCCSidebar({ setSearch, searchValue }: SidebarProps) {
  const { flyTo } = useMap();

  return (
    <div className="flex flex-col gap-6 font-mono">
      {/* 🔍 ARTIST SEARCH */}
      <div className="bg-surface/50 border border-white/10 p-4 rounded-2xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
        <p className="text-[10px] font-black tracking-widest text-zinc-500 uppercase mb-3">// ARTIST_INTEL_SEARCH</p>
        <div className="flex gap-1">
          <input 
            type="text" 
            value={searchValue}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="SEARCH ARTISTS..."
            className="w-full bg-black border border-white/10 p-2 text-[10px] text-white focus:border-neon-blue outline-none rounded"
          />
        </div>
      </div>

      {/* 📍 TACTICAL PRESETS (Desktop Only) */}
      <div className="hidden md:block bg-surface/50 border border-white/10 p-4 rounded-2xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
        <p className="text-[10px] font-black tracking-widest text-zinc-500 uppercase mb-3">// TACTICAL_PRESETS</p>
        <div className="flex flex-col gap-2">
          {Object.entries(MAP_PRESETS).map(([key, preset]) => (
            <button
              key={key}
              // Casting to 'any' bypasses the [number, number] tuple check
              onClick={() => flyTo(preset as any)}
              className="w-full text-left p-2 border border-white/10 bg-black text-[9px] text-zinc-400 hover:text-neon-blue hover:border-neon-blue transition-all uppercase font-bold rounded"
            >
              {"> "}{preset.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
