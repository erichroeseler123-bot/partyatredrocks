import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

import { shows2026 } from "@/lib/shows-2026";

/* ================================
   TYPES
================================ */

type Show = (typeof shows2026)[number];

type Props = {
  params: {
    slug: string;
  };
};

/* ================================
   PRECOMPUTE LOOKUP MAP (FAST + SAFE)
================================ */

// Build once at load time
const SHOW_MAP = new Map<string, Show>(
  shows2026.map((s) => [s.slug, s])
);

/* ================================
   STATIC GENERATION
================================ */

export async function generateStaticParams() {
  return shows2026.map((show) => ({
    slug: show.slug,
  }));
}

/* ================================
   SEO METADATA
================================ */

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {

  const show = SHOW_MAP.get(params.slug);

  if (!show) {
    return {
      title: "Event Not Found | Party at Red Rocks",
      robots: { index: false, follow: false },
    };
  }

  const dateText = new Date(show.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const title = `${show.artist} at Red Rocks — ${dateText}`;

  const description =
    show.operational?.bio ||
    `Concert transportation and planning guide for ${show.artist} at Red Rocks Amphitheatre on ${dateText}. Shuttle service, parking tips, and arrival strategy.`;

  const image = show.img || "/og/default-red-rocks.jpg";

  const url = `https://www.partyatredrocks.com/guide/events/${show.slug}`;

  return {
    title,
    description,

    alternates: {
      canonical: url,
    },

    openGraph: {
      title,
      description,
      url,
      type: "article",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

/* ================================
   PAGE
================================ */

export default function EventPage({ params }: Props) {

  const show = SHOW_MAP.get(params.slug);

  if (!show) {
    notFound();
  }

  const formattedDate = new Date(show.date).toLocaleDateString("en-US", {
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
          href="/book-shuttle"
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
