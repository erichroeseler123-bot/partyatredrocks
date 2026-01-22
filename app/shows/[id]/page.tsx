import { getEvent } from "@/lib/seatgeek"; // This line was missing
import CustomBooking from "@/components/CustomBooking";
import ArtistGuide from "@/components/ArtistGuide";
import MusicPlayer from "@/components/MusicPlayer";
import Setlist from "@/components/Setlist";
import TicketButtons from "@/components/TicketButtons";

export default async function ShowPage({ params }: { params: { id: string } }) {
  // Now TypeScript will recognize this function
  const show = await getEvent(params.id); 

  return (
    <main className="min-h-screen bg-black text-white">
      {/* ... rest of your layout ... */}
    </main>
  );
}
