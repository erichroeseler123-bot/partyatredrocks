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
   NORMALIZER
================================ */

function normalize(input = "") {
  return input
    .toLowerCase()
    .trim()
    .replace(/\/+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/* ================================
   PREBUILD INDEXES
================================ */

const showMap = new Map<string, Show>();
const normalizedMap = new Map<string, Show[]>();
const artistMap = new Map<string, Show[]>();

for (let i = 0; i < shows2026.length; i++) {
  const show = shows2026[i];

  if (!show?.slug || !show?.artist) continue;

  const slug = normalize(show.slug);
  const artist = normalize(show.artist);

  // Exact
  showMap.set(slug, show);

  // Normalized
  if (!normalizedMap.has(slug)) {
    normalizedMap.set(slug, []);
  }
  normalizedMap.get(slug)!.push(show);

  // Artist
  if (!artistMap.has(artist)) {
    artistMap.set(artist, []);
  }
  artistMap.get(artist)!.push(show);
}

/* ================================
   STATIC GENERATION
================================ */

export async function generateStaticParams() {
  return Array.from(showMap.keys()).map((slug) => ({ slug }));
}

/* ================================
   CANONICAL PICKER
================================ */

function pickCanonical(list: Show[]): Show {
  return list
    .slice()
    .sort(function (a, b) {
      return +new Date(a.date) - +new Date(b.date);
    })[0];
}

/* ================================
   RESOLVER
================================ */

function resolveShow(raw: string): Show | undefined {
  const slug = normalize(raw);

  /* 1. Exact */

  const exact = showMap.get(slug);
  if (exact) return exact;

  /* 2. Normalized */

  const normalized = normalizedMap.get(slug);
  if (normalized && normalized.length) {
    return pickCanonical(normalized);
  }

  /* 3. Artist direct */

  const artistSlug = slug.replace(/-?\d+day-pass.*$/, "");

  const direct = artistMap.get(artistSlug);

  if (direct && direct.length) {
    return pickCanonical(direct);
  }

  /* 4. Artist partial (ES5 safe) */

  const entries = Array.from(artistMap);

  for (let i = 0; i < entries.length; i++) {
    const artist = entries[i][0];
    const shows = entries[i][1];

    if (artist.indexOf(artistSlug) !== -1) {
      return pickCanonical(shows);
    }
  }

  /* 5. Prefix fallback */

  const prefix = [];

  for (let i = 0; i < shows2026.length; i++) {
    const s = shows2026[i];
    const sSlug = normalize(s.slug);

    if (
      sSlug.indexOf(slug + "-") === 0 ||
      slug.indexOf(sSlug + "-") === 0
    ) {
      prefix.push(s);
    }
  }

  if (prefix.length) {
    return pickCanonical(prefix);
  }

  return undefined;
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

  const title = show.artist + " at Red Rocks — " + date;

  const description =
    show.operational?.bio ||
    "Transportation and concert guide for " +
      show.artist +
      " at Red Rocks Amphitheatre on " +
      date +
      ".";

  return {
    title,
    description,

    alternates: {
      canonical: "/guide/events/" + show.slug,
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
    redirect("/guide/events/" + show.slug);
  }

  const formattedDate = new Date(show.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <main className="max-w-4xl mx-auto px-6 py-24 text-white">

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

      {show.img && (
        <div className="mb-12 overflow-hidden rounded-3xl border border-zinc-800">
          <img
            src={show.img}
            alt={show.artist + " at Red Rocks"}
            className="w-full h-[320px] object-cover"
            loading="eager"
          />
        </div>
      )}

      <section className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-8 mb-14">

        <h2 className="text-xl font-black uppercase mb-4">
          Show Intelligence
        </h2>

        <p className="text-zinc-300 leading-relaxed">

          {show.operational?.bio ||
            "This " +
              show.artist +
              " performance is expected to draw strong demand. " +
              "Plan to arrive early and secure transportation in advance."}

        </p>

      </section>

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
