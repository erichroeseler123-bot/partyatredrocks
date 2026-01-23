export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type GalleryPerformer = {
  image?: string;
};

type GalleryEvent = {
  id: number;
  performers: GalleryPerformer[];
};

type GalleryResponse = {
  events?: GalleryEvent[];
};

async function getGalleryData(): Promise<GalleryResponse> {
  const res = await fetch(
    `https://api.seatgeek.com/2/events?venue.id=2466&client_id=${process.env.seatgeekclientid}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch gallery events");
  }

  const data = (await res.json()) as GalleryResponse;
  return data;
}

export default async function GalleryPage() {
  const data = await getGalleryData();

  return (
    <main className="min-h-screen bg-black text-white px-6 py-24">
      <h1 className="text-4xl font-black mb-10">Red Rocks Gallery</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {data.events?.map((event) => (
          <div
            key={event.id}
            className="group relative aspect-[3/4] overflow-hidden bg-zinc-900 border border-zinc-800"
          >
            <img
              src={event.performers?.[0]?.image || "/placeholder.jpg"}
              alt=""
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}

        {!data.events?.length && (
          <p className="col-span-full text-zinc-400">
            No gallery images available.
          </p>
        )}
      </div>
    </main>
  );
}
