'use client';

export default function TicketButtons({ event }: { event: any }) {
  return (
    <div className="flex flex-col gap-4">
      {/* PRIMARY CTA: Shuttle (High Conversion) */}
      <a href="#booking" className="w-full bg-red-600 hover:bg-red-700 text-white p-6 rounded-[2rem] font-black uppercase text-center tracking-[0.2em] transition-all transform hover:scale-[1.02] shadow-[0_20px_40px_rgba(220,38,38,0.3)]">
        Book Shared Shuttle — $59+
      </a>

      {/* SECONDARY CTA: Suburban (Blue/Trust) */}
      <a href="#booking" className="w-full bg-[#1673E6] hover:bg-[#125bb8] text-white p-6 rounded-[2rem] font-black uppercase text-center tracking-[0.2em] transition-all transform hover:scale-[1.02]">
        Book Private Suburban — $499
      </a>

      {/* LOW PRIORITY: Third-Party Tickets */}
      <a href={event.url} target="_blank" className="w-full mt-4 bg-transparent border border-zinc-800 text-zinc-500 p-4 rounded-2xl font-bold uppercase text-center text-[10px] tracking-widest hover:text-white transition">
        Buy Tickets on SeatGeek
      </a>
    </div>
  );
}
