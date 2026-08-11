import Link from "next/link";
import type { HandoffSearchParams } from "@/lib/parrHandoff";
import { buildBookingHref } from "@/lib/parrHandoff";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

export const metadata = {
  title: "Private Ride vs Uber at Red Rocks",
  description:
    "Compare private Red Rocks transportation with Uber and Lyft for price certainty, pickup planning, and the ride home after the encore.",
  alternates: { canonical: "/red-rocks/transportation/shuttle-vs-uber" },
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<HandoffSearchParams>;
}) {
  const sp = await searchParams;
  const privateHref = buildBookingHref({
    target: "private",
    venue: "red-rocks-amphitheatre",
    searchParams: sp,
  });

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Red Rocks", item: `${SITE}/red-rocks` },
      { "@type": "ListItem", position: 3, name: "Transportation", item: `${SITE}/red-rocks/transportation` },
      { "@type": "ListItem", position: 4, name: "Private Ride vs Uber", item: `${SITE}/red-rocks/transportation/shuttle-vs-uber` },
    ],
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Private Ride vs Uber at Red Rocks",
    description:
      "Compare private Red Rocks transportation with rideshare for price certainty, pickup planning, and the return trip after the show.",
    url: `${SITE}/red-rocks/transportation/shuttle-vs-uber`,
    mainEntityOfPage: `${SITE}/red-rocks/transportation/shuttle-vs-uber`,
    author: { "@type": "Organization", name: "Party at Red Rocks" },
    publisher: { "@id": `${SITE}/#organization` },
    about: [
      { "@type": "Place", name: "Red Rocks Amphitheatre", url: `${SITE}/venues/red-rocks-amphitheatre` },
      { "@type": "Service", name: "Private Red Rocks transportation", url: `${SITE}/book/red-rocks-amphitheatre/private` },
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
          <span className="text-faint">/</span> Private Ride vs Uber
        </nav>

        <h1 className="mt-4 text-5xl font-black tracking-tight">Private Ride vs Uber at Red Rocks</h1>
        <p className="mt-4 text-lg text-soft">
          Party at Red Rocks currently offers private transportation only: a $399 Suburban or a $599 private van.
          Rideshare can work, but the tradeoff is more uncertainty around post-show pricing, pickup location, and driver availability.
        </p>

        <section className="mt-10 grid gap-6">
          <div className="panel rounded-2xl p-6">
            <h3 className="text-xl font-bold">Price certainty</h3>
            <p className="mt-2 text-soft">
              The private ride price is set before show night. Uber and Lyft pricing can move with demand, traffic, and driver supply after the encore.
            </p>
          </div>

          <div className="panel rounded-2xl p-6">
            <h3 className="text-xl font-bold">Pickup certainty</h3>
            <p className="mt-2 text-soft">
              With private service, your group has a planned vehicle and return strategy. Rideshare pickup depends on current lot controls, queues, and available drivers.
            </p>
          </div>

          <div className="panel rounded-2xl p-6">
            <h3 className="text-xl font-bold">Best fit</h3>
            <p className="mt-2 text-soft">
              Private service is strongest for groups that want door-to-door transportation and one vehicle waiting through the show. Rideshare may be enough for travelers who value flexibility over certainty.
            </p>
          </div>
        </section>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link href={privateHref} className="btn-primary">
            See Private Ride Options →
          </Link>
          <Link href="/red-rocks/transportation" className="btn-ghost">
            Transportation Guide
          </Link>
        </div>
      </div>
    </main>
  );
}
