'use client';

export default function TicketButtons({ event }: { event: any }) {
  // SeatGeek link is usually provided directly in their API response
  const seatGeekUrl = event.url;
  
  // For Ticketmaster, we use their 'url' field if available
  const ticketmasterUrl = event.external_links?.find((l: any) => l.type === 'ticketmaster')?.url;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {seatGeekUrl && (
        <a 
          href={seatGeekUrl} 
          target="_blank" 
          className="bg-[#1673E6] hover:bg-[#125bb8] text-white p-4 rounded-2xl font-black uppercase text-center tracking-widest transition"
        >
          Tickets on SeatGeek
        </a>
      )}
      {ticketmasterUrl && (
        <a 
          href={ticketmasterUrl} 
          target="_blank" 
          className="bg-[#026cdf] hover:bg-[#0154ad] text-white p-4 rounded-2xl font-black uppercase text-center tracking-widest transition"
        >
          Tickets on Ticketmaster
        </a>
      )}
    </div>
  );
}
