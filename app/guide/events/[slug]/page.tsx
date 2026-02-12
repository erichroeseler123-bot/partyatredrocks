// app/guide/events/[slug]/page.tsx
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

/**
 * IMPORTANT (Next.js 16):
 * params is a Promise in dynamic routes in certain builds/targets.
 * So we type it as Promise<...> and unwrap with `await params` exactly once.
 */

type Props = {
  params: Promise<{ slug: string }>;
};

/** -----------------------------
 *  Types
 *  ----------------------------*/
type Show = {
  slug: string;
  title: string;
  venue?: string;
  city?: string;
  dateText?: string; // e.g. "Fri • May 10, 2026"
  description?: string;
  heroImage?: string; // optional if you have it
  ticketUrl?: string; // optional
};

/** -----------------------------
 *  Data Source
 *  Replace this with YOUR real list if you already have one.
 *  If you already have a SHOWS array in this file, keep it and delete this stub.
 *  ----------------------------*/
const SHOWS: Show[] = [
  {
    slug: "2026-season-preview",
    title: "2026 Season Preview",
    venue: "Red Rocks + Denver Venues",
    city: "Denver, CO",
    dateText: "2026",
    description:
      "A living preview page for the 2026 season. Updated as new dates drop.",
  },
  // NOTE: your real event slugs (like the crankdat slug) should be in your real dataset.
];

/** -----------------------------
 *  Resolver
 *  ----------------------------*/
function resolveShow(rawSlug: string): Show | undefined {
  const slug = String(rawSlug || "").trim().toLowerCase();
  return SHOWS.find((s) => s.slug === slug);
}

/** -----------------------------
 *  Metadata (FIXED)
 *  ----------------------------*/
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params; // ✅ unwrap params promise
  const show = resolveShow(slug);

  if (!show) return {};

  const title = `${show.title} | Party at Red Rocks`;
  const description =
    show.description ||
    `Concert intelligence + transportation planning for ${show.title}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
    },
  };
}

/** -----------------------------
 *  Page (FIXED)
 *  ----------------------------*/
export default async function EventPage({ params }: Props) {
  const { slug } = await params; // ✅ unwrap params promise
  const show = resolveShow(slug);

  if (!show) notFound();

  return (
    <main className="min-h-screen bg-surface text-white py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12 border-l-4 border-red-600 pl-8">
          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-tight">
            {show.title}
          </h1>

          <p className="mt-3 text-xl text-zinc-400 font-bold uppercase tracking-widest">
            {(show.venue ? `${show.venue}` : "Event") +
              (show.city ? ` • ${show.city}` : "")}
          </p>

          {show.dateText ? (
            <p className="mt-4 text-base text-zinc-500 font-bold uppercase tracking-[0.2em]">
              {show.dateText}
            </p>
          ) : null}
        </header>

        {/* Intelligence */}
        <section className="mb-20">
          <h2 className="text-3xl font-black mb-8 border-b border-white/10 pb-4 uppercase italic">
            Event Intelligence
          </h2>

          {show.description ? (
            <p className="text-zinc-300 leading-relaxed text-lg">
              {show.description}
            </p>
          ) : (
            <p className="text-zinc-500 italic text-center py-10 uppercase text-base font-bold tracking-widest">
              Updating event intelligence...
            </p>
          )}

          <div className="mt-10 flex flex-col md:flex-row gap-4">
            <Link
              href="/book-all-venue"
              className="btn-primary uppercase text-base tracking-[0.2em] transition shadow-xl text-center"
            >
              Book Transportation
            </Link>

            {show.ticketUrl ? (
              <a
                href={show.ticketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-zinc-800 hover:bg-zinc-700 px-8 py-4 rounded-full font-black uppercase text-base tracking-[0.2em] transition shadow-xl text-center"
              >
                Tickets
              </a>
            ) : null}

            <Link
              href="/guide/events/2026-season-preview"
              className="btn-secondary"
            >
              2026 Hub
            </Link>
          </div>
        </section>

        {/* Footer / Back */}
        <section className="mt-10 border-t border-zinc-900 pt-10">
          <Link
            href="/"
            className="inline-block bg-white text-black px-10 py-4 rounded-full font-black uppercase hover:bg-zinc-200 transition shadow-xl"
          >
            Return to Homepage
          </Link>
        </section>
      </div>
    </main>
  );
}

/** -----------------------------
 *  Static Params (optional, but good)
 *  ----------------------------*/
export async function generateStaticParams() {
  return SHOWS.map((s) => ({ slug: s.slug }));
}
