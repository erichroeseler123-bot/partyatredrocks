import { getEvent } from "@/lib/seatgeek";
import TicketButtons from "@/components/TicketButtons";
import RezdyWidgets from "@/components/RezdyWidgets";

// OPTIONAL IMPORT: Prevents build failure if Python hasn't run yet
let seoData: any = {};
try {
  seoData = require("@/data/seo_master.json");
} catch (e) {
  console.warn("DCC Intelligence: seo_master.json not found, using fallbacks.");
}

export default async function ShowPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const show = await getEvent(params.id);
  const intelligence = seoData[params.id];

  if (!show || show.venue.id !== 196) {
    return <div className="p-20 text-center text-red-600 font-black uppercase italic">Venue Mismatch</div>;
  }

  // DCC SCHEMA GENERATION
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      intelligence?.schema || {
        "@type": "Event",
        "name": show.title,
        "startDate": show.datetime_local,
        "location": { "@type": "Place", "name": "Red Rocks Amphitheatre" }
      },
      {
        "@type": "LocalBusiness",
        "name": "Party at Red Rocks Shuttle",
        "priceRange": "$59-$65",
        "url": "https://partyatredrocks.com"
      }
    ]
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <link rel="canonical" href={intelligence?.canonical || `https://partyatredrocks.com/shows/${params.id}`} />
      
      {/* ... Rest of your existing high-detail layout */}
      <div className="p-12">
        <h1 className="text-8xl font-black italic uppercase tracking-tighter">{show.title}</h1>
        <div className="grid grid-cols-12 gap-12 mt-12">
          <div className="col-span-4"><TicketButtons event={show} /></div>
          <div className="col-span-8"><RezdyWidgets /></div>
        </div>
      </div>
    </main>
  );
}
