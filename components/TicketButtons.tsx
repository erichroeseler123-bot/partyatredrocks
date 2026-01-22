'use client';

export default function TicketButtons({ event }: { event: any }) {
  return (
    <div className="flex flex-col gap-3">
      {/* PRIMARY CTA: Shared Shuttle (Red/Urgent) */}
      <a 
        href="#booking" 
        className="w-full bg-red-600 hover:bg-red-700 text-white p-5 rounded-2xl font-black uppercase text-center tracking-[0.2em] transition-all transform hover:scale-[1.02] shadow-[0_10px_20px_rgba(220,38,38,0.3)]"
      >
        Book Red Rocks Shuttle — $59+
      </a>

      {/* SECONDARY CTA: Private Suburban (Blue/Trust) */}
      <a 
        href="#booking" 
        className="w-full bg-[#1673E6] hover:bg-[#125bb8] text-white p-5 rounded-2xl font-black uppercase text-center tracking-[0.2em] transition-all transform hover:scale-[1.02] shadow-[0_10px_20px_rgba(22,115,230,0.2)]"
      >
        Book Private Suburban — $499
      </a>

      {/* TERTIARY CTA: SeatGeek Tickets (Muted/Outline) */}
      <a 
        href={event.url} 
        target="_blank" 
        className="w-full mt-4 bg-transparent border border-zinc-800 hover:border-zinc-600 text-zinc-500 hover:text-zinc-300 p-3 rounded-2xl font-bold uppercase text-center tracking-widest text-[10px] transition"
      >
        View Concert Tickets on SeatGeek
      </a>
      
      <p className="text-[9px] text-zinc-700 uppercase font-bold italic text-center tracking-tighter">
        *Transportation only. Event tickets sold separately.
      </p>
    </div>
  );
}
