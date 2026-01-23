import { notFound } from "next/navigation";
import { getArtistIntelligence } from "@/lib/gemini";
import { getArtistShows } from "@/lib/seatgeek";

export const revalidate = 86400;

// FIX: params is now a Promise in Next.js 16
export default async function ArtistPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // CRITICAL: Await the params before accessing the slug
  const { slug } = await params;
  const artistName = slug.replace(/-/g, " ");

  const [intel, shows] = await Promise.all([
    getArtistIntelligence(artistName),
    getArtistShows(slug),
  ]);

  if (!shows || shows.length === 0) return notFound();

  const description =
    typeof intel.description === "string"
      ? intel.description
      : intel.description?.summary || "No description available.";

  return (
    <main className="min-h-screen pt-32 px-6 bg-black text-white">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-7xl font-black italic uppercase tracking-tighter mb-12">
          {artistName}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <section className="lg:col-span-2 p-10 bg-white/5 border border-white/10 rounded-[3rem]">
            <h2 className="text-xs tracking-widest text-blue-400 mb-8 uppercase font-bold">
              // Artist Dossier
            </h2>

            <p className="text-xl text-zinc-300 leading-relaxed italic">
              {description}
            </p>

            <div className="grid grid-cols-2 gap-6 pt-8 mt-8 border-t border-white/10">
               <div>
                 <p className="text-[10px] uppercase text-zinc-500 font-black">Age Range</p>
                 <p className="text-white font-bold uppercase">{intel.fans?.age_range || "N/A"}</p>
               </div>
               <div>
                 <p className="text-[10px] uppercase text-zinc-500 font-black">Interests</p>
                 <p className="text-white font-bold uppercase">{intel.fans?.interests || "N/A"}</p>
               </div>
            </div>
          </section>

          <aside className="space-y-6">
            <h3 className="text-red-600 font-black uppercase tracking-widest text-sm italic">Upcoming Dates</h3>
            {shows.map((show: any) => (
              <div key={show.id} className="p-6 bg-zinc-900 border border-white/5 rounded-2xl">
                <p className="text-xs text-zinc-500">{new Date(show.datetime_local).toLocaleDateString()}</p>
                <p className="font-bold uppercase italic text-zinc-200">{show.venue.name}</p>
              </div>
            ))}
          </aside>
        </div>
      </div>
    </main>
  );
}
