import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

import { shows2026 } from "@/public/data/shows-2026";

/* ================================
   TYPES
================================ */

type Show = {
  slug: string;
  artist: string;
  date: string;
  venue: string;
  img?: string;

  operational?: {
    bio?: string;
  };
};

type Props = {
  params: {
    slug: string;
  };
};

/* ================================
   STATIC GENERATION
================================ */

export async function generateStaticParams() {
  return shows2026.map((show: Show) => ({
    slug: show.slug,
  }));
}

/* ================================
   SEO METADATA
================================ */

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {

  const show = shows2026.find(
    (s: Show) => s.slug === params.slug
  );

  if (!show) return {};

  const date = new Date(show.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const title = `${show.artist} at Red Rocks — ${date}`;

  const description =
    show.operational?.bio ||
    `Transportation and concert guide for ${show.artist} at Red Rocks Amphitheatre on ${date}. Shuttle service, parking tips, and arrival planning.`;

  return {
    title,
    description,

    openGraph: {
      title,
      description,
      type: "article",
      images: show.img ? [show.img] : [],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: show.img ? [show.img] : [],
    },
  };
}

/* ================================
   PAGE
================================ */

export default function EventPage({ params }: Props) {

  const show = shows2026.find(
    (s: Show) => s.slug === params.slug
  );

  if (!show) {
    notFound();
  }

  const date = new Date(show.date);

  const formattedDate = date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <main className="max-w-4xl mx-auto px-6 py-24 text-white">

      {/* ================= HEADER ================= */}

      <header className="mb-12">

        <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tight mb-4">
          {show.artist}
        </h1>

        <p className="text-red-600 font-bold uppercase tracking-widest text-sm mb-3">
          {formattedDate}
        </p>

        <p className="text-zinc-400 text-lg">
          {show.venue}
        </p>

      </header>

      {/* ================= HERO IMAGE ================= */}

      {show.img && (
        <div className="mb-12 overflow-hidden rounded-3xl border border-zinc-800">

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={show.img}
            alt={`${show.artist} at Red Rocks`}
            className="w-full h-[320px] object-cover"
            loading="eager"
          />

        </div>
      )}

      {/* ================= INTELLIGENCE ================= */}

      <section className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-8 mb-14">

        <h2 className="text-xl font-black uppercase mb-4 tracking-tight">
          Show Intelligence
        </h2>

        <p className="text-zinc-300 leading-relaxed text-base">

          {show.operational?.bio ||
            `This ${show.artist} performance is expected to draw strong demand. 
            Plan to arrive early and secure transportation in advance to avoid
            parking congestion, surge pricing, and long exit delays.`}

        </p>

      </section>

      {/* ================= CTA ================= */}

      <section className="flex flex-col sm:flex-row gap-4">

        <Link
          href="/"
          className="px-7 py-3 bg-red-600 hover:bg-red-700 transition font-black uppercase text-sm tracking-widest rounded-full text-center"
        >
          Book Shuttle
        </Link>

        <Link
          href="/guide/events/2026-season-preview"
          className="px-7 py-3 border border-zinc-700 hover:border-zinc-500 transition font-black uppercase text-sm tracking-widest rounded-full text-center"
        >
          View Full Season
        </Link>

      </section>

    </main>
  );
}
