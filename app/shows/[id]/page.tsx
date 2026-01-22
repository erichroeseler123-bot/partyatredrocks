import { getEvent } from "@/lib/seatgeek";
import TicketButtons from "@/components/TicketButtons";
import SetlistDisplay from "@/components/SetlistDisplay";
import CustomBooking from "@/components/CustomBooking";

export default async function ShowPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const show = await getEvent(id);

  // FIX: Guard clause to handle null data
  if (!show) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-black italic uppercase text-red-600 mb-4">Event Intelligence Missing</h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Dispatch Error: ID {id} Not Found</p>
        </div>
      </main>
    );
  }

  // Now TypeScript knows 'show' is NOT null here
  const performer = show.performers[0];

  return (
    <main className="min-h-screen bg-black text-white">
      {/* ... rest of your code ... */}
