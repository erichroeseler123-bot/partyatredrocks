import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Red Rocks & Colorado Venue Photo Gallery | Party at Red Rocks",
  description:
    "Verified photographs of Red Rocks Amphitheatre, Upper North and South lot approaches, Downtown Denver pickup corridors, and Front Range concert venues.",
  alternates: { canonical: "https://www.partyatredrocks.com/gallery" },
};

type GalleryItem = {
  src: string;
  title: string;
  caption: string;
  alt: string;
};

const GALLERY_ITEMS: GalleryItem[] = [
  {
    src: "/hero/hero_red_rocks.webp",
    title: "Red Rocks Show Night Overlook",
    caption: "Illuminated Red Rocks Amphitheatre and Front Range vista above Morrison, Colorado.",
    alt: "Illuminated Red Rocks Amphitheatre and Foothills vista at night",
  },
  {
    src: "/images/red-rocks/Panorama_of_Red_Rocks_Amphitheater.jpg",
    title: "Amphitheatre Seating Bowl Panorama",
    caption: "Daytime view across the 70-row sandstone seating bowl toward the stage and Denver horizon.",
    alt: "Wide daytime panorama across Red Rocks Amphitheatre seating rows and stage",
  },
  {
    src: "/images/red-rocks/red-rocks-amphitheater-from-top.jpg",
    title: "Top Plaza & Upper North Perspective",
    caption: "Looking down from the Top Circle plaza near Row 70 where private group vehicles stage.",
    alt: "Top-plaza overlook looking down Red Rocks Amphitheatre toward the stage and park roads",
  },
  {
    src: "/assets/venue/red-rocks/red-rocks-arrival.webp",
    title: "Red Rocks Park Entrance Marker",
    caption: "Historic sandstone entrance wall welcoming concertgoers into Red Rocks Park and Amphitheatre.",
    alt: "Red Rocks Park and Amphitheatre sandstone entrance sign",
  },
  {
    src: "/assets/venue/red-rocks/red-rocks-hero.webp",
    title: "Ship Rock & Sandstone Monoliths",
    caption: "Natural Fountain Formation sandstone monoliths flanking the Red Rocks concert corridor.",
    alt: "Daytime view of Red Rocks Park sandstone formations and foothills",
  },
  {
    src: "/assets/venue/red-rocks/red-rocks-shuttle.jpg",
    title: "South Park Road & Foothills Approach",
    caption: "Winding park road approaching the South parking corridor and sandstone formations.",
    alt: "Red Rocks Park approach road and sandstone monoliths near the South parking lot",
  },
  {
    src: "/images/red-rocks/red-rocks-trading-post-backyard.jpg",
    title: "Historic Red Rocks Trading Post",
    caption: "Pueblo Revival Trading Post below the south stairs, a key landmark for lower-lot navigation.",
    alt: "Historic Red Rocks Trading Post nestled against sandstone formations",
  },
  {
    src: "/images/red-rocks/Red-Rocks-Park.jpg",
    title: "Red Rocks Park Foothills Corridor",
    caption: "Autumn foliage and red sandstone hogbacks along the Morrison entrance corridor.",
    alt: "Red sandstone formations and foothills landscape inside Red Rocks Park",
  },
  {
    src: "/hero/arrival.jpg",
    title: "Denver Union Station Pickup Corridor",
    caption: "Downtown Denver LoDo and Union Station hub for door-to-door hotel and residence pickups.",
    alt: "Historic Denver Union Station illuminated plaza in Downtown Denver",
  },
  {
    src: "/venues/rrsite.webp",
    title: "Foothills Bench Rows & Stage Approach",
    caption: "Curved amphitheatre rows framed against the towering south monolith before doors open.",
    alt: "Red Rocks Amphitheatre curved bench rows beside sandstone monolith",
  },
  {
    src: "/venues/missionsite.jpg",
    title: "Mission Ballroom — RiNo Denver",
    caption: "Private concert transportation also serves Mission Ballroom and indoor Denver metro venues.",
    alt: "Mission Ballroom concert stage and interior in RiNo Denver",
  },
  {
    src: "/venues/mishsite.webp",
    title: "Mishawaka Amphitheatre — Poudre Canyon",
    caption: "Canyon-side stage setting for Front Range outdoor concert excursions.",
    alt: "Mishawaka Amphitheatre canyon stage setting in Colorado",
  },
];

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-[#050816] px-4 py-24 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1360px]">
        <header className="max-w-3xl">
          <div className="text-[11px] font-black uppercase tracking-[0.24em] text-[#ffb07c]">
            Verified Venue &amp; Corridor Photography
          </div>
          <h1 className="mt-3 text-4xl font-black uppercase tracking-tight text-white sm:text-5xl">
            Red Rocks &amp; Denver Corridor Gallery
          </h1>
          <p className="mt-4 text-base leading-7 text-white/76 sm:text-lg">
            Real views of Red Rocks Amphitheatre, Upper North and South lot landmarks, Downtown Denver pickup hubs, and Colorado concert venues we serve.
          </p>
        </header>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {GALLERY_ITEMS.map((item) => (
            <article
              key={item.src}
              className="overflow-hidden rounded-[26px] border border-white/10 bg-[#0b1224] shadow-[0_18px_50px_rgba(0,0,0,0.38)] transition duration-300 hover:-translate-y-1 hover:border-white/22"
            >
              <div className="relative aspect-[16/10] overflow-hidden border-b border-white/10">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="(min-width: 1024px) 32vw, (min-width: 640px) 48vw, 100vw"
                />
              </div>
              <div className="p-5">
                <h2 className="text-lg font-black uppercase tracking-[-0.02em] text-white">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-white/74">{item.caption}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          <Link
            href="/book/red-rocks-amphitheatre/private"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#3df3ff] px-6 text-xs font-black uppercase tracking-[0.16em] text-[#05111a] no-underline transition hover:bg-[#62f6ff]"
          >
            Book Private Red Rocks Ride
          </Link>
          <Link
            href="/red-rocks/map"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/16 bg-white/6 px-6 text-xs font-black uppercase tracking-[0.16em] text-white no-underline transition hover:bg-white/10"
          >
            Explore Red Rocks Lot Map
          </Link>
        </div>
      </div>
    </main>
  );
}
