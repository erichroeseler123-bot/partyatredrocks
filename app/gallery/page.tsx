import Image from 'next/image';

const images = [
  // root public
  '/fleet.jpg',
  '/shuttle123.jpg',
  '/hero123.jpg',
  '/Shuttle.jpg',
  '/hi.jpg',
  '/sprintershuttle.jpg',
  '/redrocks-color.jpg',
  '/suburban123.jpg',
  '/redrockssuburban.jpg',
  '/VIPSUV.jpg',

  // fleet folder
  '/fleet/shuttle.jpg',
  '/fleet/suv.jpg',

  // hero folder
  '/hero/transport.jpg',
];

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-surface text-white px-6 py-24">
      <h1 className="text-5xl font-black mb-12">Image Review</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {images.map((src) => (
          <div
            key={src}
            className="border border-white/10 rounded-2xl overflow-hidden bg-surface hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="relative h-64">
              <Image
                src={src}
                alt={src}
                fill
                className="object-cover"
              />
            </div>

            <div className="p-4 text-sm text-zinc-400 break-all">
              {src}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
