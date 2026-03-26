import Link from "next/link";
import type { HandoffSearchParams } from "@/lib/parrHandoff";
import { buildBookingHref } from "@/lib/parrHandoff";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

export const metadata = {
  title: "Shuttle vs Uber at Red Rocks",
  description:
    "Cost, reliability, surge pricing, and the best return strategy after the encore.",
  alternates: { canonical: "/red-rocks/transportation/shuttle-vs-uber" },
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<HandoffSearchParams>;
}) {
  const sp = await searchParams;
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Red Rocks", item: `${SITE}/red-rocks` },
      { "@type": "ListItem", position: 3, name: "Transportation", item: `${SITE}/red-rocks/transportation` },
      { "@type": "ListItem", position: 4, name: "Shuttle vs Uber", item: `${SITE}/red-rocks/transportation/shuttle-vs-uber` },
    ],
  };
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Shuttle vs Uber at Red Rocks",
    description: "Cost, reliability, surge pricing, and the best return strategy after the encore.",
    url: `${SITE}/red-rocks/transportation/shuttle-vs-uber`,
    mainEntityOfPage: `${SITE}/red-rocks/transportation/shuttle-vs-uber`,
    author: { "@type": "Organization", name: "Party at Red Rocks" },
    publisher: { "@id": `${SITE}/#organization` },
    about: [
      { "@type": "Place", name: "Red Rocks Amphitheatre", url: `${SITE}/venues/red-rocks-amphitheatre` },
      { "@type": "Service", name: "Red Rocks shared shuttle", url: `${SITE}/book/red-rocks-amphitheatre/custom/shared` },
      { "@type": "Thing", name: "Rideshare pricing and pickup strategy at Red Rocks" },
    ],
  };
  return (
    <main className="min-h-screen bg-surface text-white px-6 py-24">
      <div className="max-w-4xl mx-auto">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
        <nav className="text-sm text-muted">
          <Link className="hover:text-white" href="/red-rocks/transportation">
            Transportation
          </Link>{" "}
          <span className="text-faint">/</span> Shuttle vs Uber
        </nav>

        <h1 className="mt-4 text-5xl font-black tracking-tight">Shuttle vs Uber</h1>
        <p className="mt-4 text-lg text-soft">
          Shuttles are predictable. Rideshares can be fine—or a complete mess—depending on
          surges, queue control, and driver availability.
        </p>

        <section className="mt-10 grid gap-6">
          <div className="panel rounded-2xl p-6">
            <h3 className="text-xl font-bold">Cost</h3>
            <p className="mt-2 text-soft">
              Shuttles are fixed. Rideshares spike post-show and can exceed expectations on
              sold-out nights.
            </p>
          </div>

          <div className="panel rounded-2xl p-6">
            <h3 className="text-xl font-bold">Reliability</h3>
            <p className="mt-2 text-soft">
              Pickup depends on lot control, queue length, and driver availability. Shuttles run
              on schedule.
            </p>
          </div>

          <div className="panel rounded-2xl p-6">
            <h3 className="text-xl font-bold">Best strategy</h3>
            <p className="mt-2 text-soft">
              If you rideshare, leave slightly before the final rush or wait it out. If you shuttle,
              treat it like a reservation.
            </p>
          </div>
        </section>

        <div className="mt-12">
          <Link href={buildBookingHref({ target: "book", venue: "red-rocks-amphitheatre", searchParams: sp })} className="btn-primary">
            Book the $59 shuttle →
          </Link>
        </div>
      </div>
    </main>
  );
}
