'use client';

export default function TicketButtons({ event }: { event: any }) {
  return (
    <div className="flex flex-col gap-4">
      <a href="#booking" className="w-full bg-red-600 hover:bg-red-700 text-white p-6 rounded-[2rem] font-black uppercase text-center tracking-[0.2em] transition-all transform hover:scale-[1.02]">
        Book Shared Shuttle — $59+
      </a>

      <a href="#booking" className="w-full bg-[#1673E6] hover:bg-[#125bb8] text-white p-6 rounded-[2rem] font-black uppercase text-center tracking-[0.2em] transition-all transform hover:scale-[1.02]">
        Book Private Suburban — $499
      </a>

      {/* YELLOW BUTTON */}
      <a 
        href={event?.url || '#'} 
        target="_blank" 
        className="w-full mt-4 bg-yellow-400 hover:bg-yellow-500 text-black p-4 rounded-2xl font-black uppercase text-center text-[10px] tracking-widest transition shadow-[0_10px_20px_rgba(250,204,21,0.2)]"
      >
        Buy Concert Tickets on SeatGeek
      </a>
    </div>
  );
}
