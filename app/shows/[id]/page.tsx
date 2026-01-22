// Example of the DCC-Enhanced Show Page
import { getEvent } from "@/lib/seatgeek";
import SetlistDisplay from "@/components/SetlistDisplay"; 

export default async function ShowPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const show = await getEvent(id);

  // Formatting Date and Time
  const eventDate = new Date(show.datetime_local).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const eventTime = new Date(show.datetime_local).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  return (
    <main className="min-h-screen bg-black text-white p-12">
      {/* Real-time Pricing Intelligence */}
      <div className="flex justify-between items-start mb-12">
        <div>
          <p className="text-red-600 font-black uppercase italic tracking-[0.4em] mb-2">{eventDate} @ {eventTime}</p>
          <h1 className="text-8xl font-black italic uppercase tracking-tighter">{show.title}</h1>
          <a href="https://www.redrocksonline.com" target="_blank" className="text-xs text-zinc-500 font-bold uppercase hover:text-white transition">Official Venue Site</a>
        </div>
        <div className="text-right border-l border-zinc-900 pl-8">
          <p className="text-zinc-600 uppercase font-black text-[10px] tracking-widest">DCC Price Watch</p>
          <p className="text-4xl font-black italic text-red-600">${show.stats.lowest_price || "TBA"}</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-12">
        {/* Navigation Intelligence */}
        <div className="col-span-4 h-96 rounded-[3rem] overflow-hidden border border-white/5 grayscale contrast-125">
          <iframe
            width="100%" height="100%" frameBorder="0"
            src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=Red+Rocks+Amphitheatre`}
            allowFullScreen
          ></iframe>
        </div>

        {/* Setlist Intelligence */}
        <div className="col-span-8 bg-zinc-900/40 p-10 rounded-[3rem] border border-white/5">
          <SetlistDisplay artistName={show.performers[0].name} />
        </div>
      </div>
    </main>
  );
}
