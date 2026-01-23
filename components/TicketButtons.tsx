'use client';

export default function TicketButtons({ event }: { event: any }) {
  return (
    <div className="flex flex-col gap-4">
      <a href="#booking" className="w-full bg-red-600 hover:bg-red-700 text-white p-6 rounded-[2rem] font-black uppercase text-center tracking-widest transition transform hover:scale-[1.02]">
        Book Shared Shuttle
      </a>
      <a href="#booking" className="w-full bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-[2rem] font-black uppercase text-center tracking-widest transition transform hover:scale-[1.02]">
        Book Private Suburban
      </a>
      <a href={event?.url || '#'} target="_blank" className="w-full mt-4 bg-yellow-400 hover:bg-yellow-500 text-black p-4 rounded-2xl font-black uppercase text-center text-xs tracking-widest transition">
        Buy Tickets on SeatGeek
      </a>
    </div>
  );
}
