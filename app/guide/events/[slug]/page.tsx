export const dynamicParams = true;

import { notFound, redirect } from "next/navigation";
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
   PREBUILD INDEXES (FAST + SAFE)
================================ */

const showMap = new Map<string, Show>();
const normalizedMap = new Map<string, Show[]>();

function normalize(input = "") {
  return input
    .toLowerCase()
    .trim()
    .replace(/\/+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

for (const show of shows2026) {
  if (!show?.slug) continue;

  // Exact map
  showMap.set(show.slug, show);

  // Normalized index
  const key = normalize(show.slug);

  if (!normalizedMap.has(key)) {
    normalizedMap.set(key, []);
  }

  normalizedMap.get(key)!.push(show);
}

/* ================================
   STATIC GENERATION
================================ */

export async function generateStaticParams() {
  return Array.from(showMap.keys()).map((slug) => ({ slug }));
}

/* ================================
   SLUG RESOLVER (DETERMINISTIC)
================================ */

function resolveShow(raw: string): Show | undefined {
  const slug = normalize(raw);

  /* -------------------------------------------------
     1. Exact match (authoritative)
  ------------------------------------------------- */

  const exact = showMap.get(slug);
  if (exact) return exact;

  /* -------------------------------------------------
     2. Normalized exact (handles weird chars)
  ------------------------------------------------- */

  const normalized = normalizedMap.get(slug);
  if (normalized?.length) {
    return pickCanonical(normalized);
  }

  /* -------------------------------------------------
     3. Safe prefix match
  ------------------------------------------------- */

  const prefixMatches = shows2026.filter(
    (s) =>
      normalize(s.slug).startsWith(slug + "-") ||
      slug.startsWith(normalize(s.slug) + "-")
  );

  if (prefixMatches.length) {
    return pickCanonical(prefixMatches);
  }

  /* -------------------------------------------------
     4. Artist match (last resort)
  ------------------------------------------------- */

  const artistSlug = slug.replace(/-?\d+day-pass.*$/, "");

  const artistMatches = shows2026.filter((s) => {
    if (!s.artist) return false;

    const a = normalize(s.artist);

    return a === artistSlug || a.includes(artistSlug);
  });

  if (artistMatches.length) {
    return pickCanonical(artistMatches);
  }

  return undefined;
}

/* ================================
   CANONICAL PICKER
================================ */

function pickCanonical(list: Show[]): Show {
  // Always pick earliest date = canonical
  return list
    .slice()
    .sort(
      (a, b) => +new Date(a.date) - +new Date(b.date)
    )[0];
}

/* ================================
   SEO
================================ */

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {

  const show = resolveShow(params.slug);

  if (!show) return {};

  const date = new Date(show.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const title = `${show.artist} at Red Rocks — ${date}`;

  const description =
    show.operational?.bio ??
    `Transportation and concert guide for ${show.artist} at Red Rocks Amphitheatre on ${date}. Shuttle service, parking tips, and arrival planning.`;

  return {
    title,
    description,

    alternates: {
      canonical: `/guide/events/${show.slug}`,
    },

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

  const show = resolveShow(params.slug);

  if (!show) {
    notFound();
  }

  /* Canonical redirect */
  if (normalize(params.slug) !== normalize(show.slug)) {
    redirect(`/guide/events/${show.slug}`);
  }

  const date = new Date(show.date);

  const formattedDate = date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <main className="max-w-4xl mx-auto px-6 py-24 text-white">

      {/* HEADER */}

      <header className="mb-12">

        <h1 className="text-4xl md:text-5xl font-black uppercase italic mb-4">
          {show.artist}
        </h1>

        <p className="text-red-600 font-bold uppercase text-sm mb-3">
          {formattedDate}
        </p>

        <p className="text-zinc-400 text-lg">
          {show.venue}
        </p>

      </header>

      {/* HERO */}

      {show.img && (
        <div className="mb-12 overflow-hidden rounded-3xl border border-zinc-800">
          <img
            src={show.img}
            alt={`${show.artist} at Red Rocks`}
            className="w-full h-[320px] object-cover"
            loading="eager"
          />
        </div>
      )}

      {/* INTEL */}

      <section className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-8 mb-14">

        <h2 className="text-xl font-black uppercase mb-4">
          Show Intelligence
        </h2>

        <p className="text-zinc-300 leading-relaxed">

          {show.operational?.bio ??
            `This ${show.artist} performance is expected to draw strong demand. 
            Plan to arrive early and secure transportation in advance.`}

        </p>

      </section>

      {/* CTA */}

      <section className="flex flex-col sm:flex-row gap-4">

        <Link
          href="/book-shuttle"
          className="px-7 py-3 bg-red-600 hover:bg-red-700 font-black uppercase text-sm rounded-full text-center"
        >
          Book Shuttle
        </Link>

        <Link
          href="/guide/events/2026-season-preview"
          className="px-7 py-3 border border-zinc-700 hover:border-zinc-500 font-black uppercase text-sm rounded-full text-center"
        >
          View Full Season
        </Link>

      </section>

    </main>
  );
}
