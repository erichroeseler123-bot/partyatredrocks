'use client';

export default function TicketButtons({ event }: { event: any }) {
  return (
    <div className="flex flex-col gap-4">
      {/* PRIMARY CTA: Shuttle Booking (Prominent) */}
      <a 
        href="#booking" 
        className="w-full bg-red-600 hover:bg-red-700 text-white p-5 rounded-2xl font-black uppercase text-center tracking-[0.2em] transition-all transform hover:scale-[1.02] shadow-[0_0_20px_rgba(220,38,38,0.3)]"
      >
        Book Red Rocks Shuttle — $59+
      </a>

      {/* SECONDARY CTA: SeatGeek Tickets (Less Prominent) */}
      <a 
        href={event.url} 
        target="_blank" 
        className="w-full bg-transparent border border-zinc-800 hover:border-zinc-600 text-zinc-400 hover:text-white p-4 rounded-2xl font-bold uppercase text-center tracking-widest text-xs transition"
      >
        Buy Concert Tickets on SeatGeek
      </a>
      
      <p className="text-[10px] text-zinc-600 uppercase font-bold italic text-center tracking-tighter">
        *Shuttle tickets do not include concert entry
      </p>
    </div>
  );
}
