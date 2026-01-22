{/* PRICE WATCH: Styled for high visibility */}
<div className="text-right border-l-2 border-red-600/20 pl-10">
  <p className="text-zinc-600 uppercase font-black text-[10px] tracking-[0.3em] mb-2">DCC Market Intel</p>
  <div className="flex flex-col items-end">
    <p className="text-5xl font-black italic text-yellow-400 leading-none">
      ${show.stats.lowest_price || "TBA"}
    </p>
    <p className="text-[10px] text-zinc-500 font-bold uppercase mt-2 italic">Lowest Live Listing</p>
  </div>
</div>

{/* MAP SECTION: Grayscale/High Contrast for the DCC aesthetic */}
<div className="rounded-[3rem] overflow-hidden border border-white/5 h-80 grayscale contrast-[1.2] brightness-75 hover:grayscale-0 transition-all duration-1000">
  <iframe
    width="100%" height="100%" frameBorder="0"
    src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&q=Red+Rocks+Amphitheatre+Morrison+CO`}
    allowFullScreen
  ></iframe>
</div>
