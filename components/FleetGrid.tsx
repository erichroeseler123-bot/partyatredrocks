"use client";

import React from "react";
import Link from "next/link";
import { UnsplashImg } from "@/components/UnsplashImg";
import { resolveMediaImage } from "@/lib/media/resolver";

const privateVanImage = resolveMediaImage({
  entityType: "transport",
  slug: "private-van",
  sourceHints: {
    title: "Private 10-passenger van concert transportation",
    queryHint: "passenger van concert transportation colorado",
    localImageUrl: "/shuttle-exec.jpg",
    alt: "Private Van",
  },
});

const privateSuvImage = resolveMediaImage({
  entityType: "transport",
  slug: "private-suv-node",
  sourceHints: {
    title: "Private suburban concert transportation",
    queryHint: "private suburban concert transportation denver",
    localImageUrl: "/private-suv.jpg",
    alt: "Private Suburban",
  },
});

export default function FleetGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* 🏎️ PRIVATE SUBURBAN CARD */}
      <div className="panel-soft rounded-3xl p-6 flex flex-col items-center text-center space-y-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <UnsplashImg
            src={privateSuvImage}
            query="private suburban concert transportation denver"
            alt="Private Suburban"
            className="object-cover w-full h-full"
            loading="lazy"
            decoding="async"
            width={1280}
            height={720}
          />
          <span className="absolute top-4 right-4 bg-neon-blue text-black font-black text-[11px] px-3 py-1 rounded-full shadow-[0_0_10px_var(--glowHex)]">
            $399.00
          </span>
        </div>
        <div>
          <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">PRIVATE SUBURBAN</h3>
          <p className="text-[10px] text-muted font-bold uppercase tracking-widest mt-1 italic">// UP TO 6 PASSENGERS • DOOR-TO-DOOR</p>
        </div>
        
        <Link 
          href="/book/red-rocks-amphitheatre/private/suv"
          className="w-full py-4 bg-neon-blue text-black font-black uppercase italic tracking-tighter text-sm rounded-2xl hover:bg-surface/40 transition-all shadow-[0_0_20px_var(--glowHex)] active:scale-95 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
        >
          BOOK PRIVATE SUBURBAN — $399
        </Link>
      </div>

      {/* 🚐 PRIVATE 10-PASSENGER VAN CARD */}
      <div className="panel-soft rounded-3xl p-6 flex flex-col items-center text-center space-y-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <UnsplashImg
            src={privateVanImage}
            query="passenger van concert transportation colorado"
            alt="Private Van"
            className="object-cover w-full h-full"
            loading="lazy"
            decoding="async"
            width={1280}
            height={720}
          />
          <span className="absolute top-4 right-4 bg-white text-black font-black text-[11px] px-3 py-1 rounded-full shadow-lg">
            $599.00
          </span>
        </div>
        <div>
          <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">PRIVATE 10-PASSENGER VAN</h3>
          <p className="text-[10px] text-muted font-bold uppercase tracking-widest mt-1 italic">// UP TO 10 PASSENGERS • DOOR-TO-DOOR</p>
        </div>
        
        <Link 
          href="/book/red-rocks-amphitheatre/private/van"
          className="w-full py-4 bg-white text-black font-black uppercase italic tracking-tighter text-sm rounded-2xl hover:bg-white/80 transition-all shadow-lg active:scale-95 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
        >
          BOOK PRIVATE VAN — $599
        </Link>
      </div>

    </div>
  );
}
