import Link from "next/link";
import type { HandoffSearchParams } from "@/lib/parrHandoff";
import { buildBookingHref } from "@/lib/parrHandoff";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

export const metadata = {
  title: "Red Rocks Shuttle vs Uber 2026 | What Actually Works After the Show",
  description:
    "Comparing Red Rocks shuttle vs Uber in 2026: cost, post-show wait times, pickup confusion, and why fixed-price shuttle rides beat surge pricing after the encore.",
  alternates: { canonical: "/red-rocks/transportation/shuttle-vs-uber-2026" },
  openGraph: {
    title: "Red Rocks Shuttle vs Uber 2026 | What Actually Works After the Show",
    description:
      "Comparing Red Rocks shuttle vs Uber in 2026: cost, post-show wait times, pickup confusion, and why fixed-price shuttle rides beat surge pricing after the encore.",
    url: `${SITE}/red-rocks/transportation/shuttle-vs-uber-2026`,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Red Rocks Shuttle vs Uber 2026 | What Actually Works After the Show",
    description:
      "Comparing Red Rocks shuttle vs Uber in 2026: cost, post-show wait times, pickup confusion, and why fixed-price shuttle rides beat surge pricing after the encore.",
  },
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<HandoffSearchParams>;
}) {
  const sp = await searchParams;
  const bookingHref = buildBookingHref({
    target: "book",
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
      { "@type": "ListItem", position: 4, name: "Shuttle vs Uber 2026", item: `${SITE}/red-rocks/transportation/shuttle-vs-uber-2026` },
    ],
  };
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Red Rocks Shuttle vs Uber in 2026",
    description:
      "Comparing fixed-price shuttle service against Uber surge pricing, post-show waits, and pickup chaos at Red Rocks.",
    url: `${SITE}/red-rocks/transportation/shuttle-vs-uber-2026`,
    mainEntityOfPage: `${SITE}/red-rocks/transportation/shuttle-vs-uber-2026`,
    author: { "@type": "Organization", name: "Party at Red Rocks" },
    publisher: { "@id": `${SITE}/#organization` },
    about: [
      { "@type": "Place", name: "Red Rocks Amphitheatre", url: `${SITE}/venues/red-rocks-amphitheatre` },
      { "@type": "Service", name: "Red Rocks shared shuttle", url: `${SITE}/book/red-rocks-amphitheatre/custom/shared` },
      { "@type": "Thing", name: "Rideshare surge pricing and post-show pickup at Red Rocks" },
    ],
  };

  return (
    <main className="min-h-screen bg-[#050816] px-4 pb-16 pt-24 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1100px]">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />

        <nav className="text-sm text-white/55">
          <Link className="hover:text-white" href="/red-rocks/transportation">
            Transportation
          </Link>{" "}
          <span className="text-white/35">/</span> Shuttle vs Uber 2026
        </nav>

        <section className="mt-6 overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(13,19,34,0.98),rgba(8,11,20,0.98))] p-8 shadow-[0_40px_120px_rgba(0,0,0,0.45)] sm:p-10 lg:p-12">
          <div className="inline-flex items-center rounded-full border border-[#8fd0ff]/30 bg-[#8fd0ff]/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
            2026 Comparison
          </div>
          <h1 className="mt-5 max-w-4xl text-[2.5rem] font-black uppercase leading-[0.94] tracking-[-0.04em] sm:text-[4rem]">
            Red Rocks Shuttle vs. Uber in 2026
          </h1>
          <p className="mt-5 max-w-3xl text-[15px] leading-7 text-white/78 sm:text-lg">
            If you are deciding between a shuttle and Uber for Red Rocks, the real difference is not just the ride in. It is what happens after the show, when thousands of people leave at once, drivers disappear, and surge pricing spikes hard.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href={bookingHref} className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#62f6ff] px-6 text-sm font-black uppercase tracking-[0.16em] text-[#07111d] transition hover:bg-[#8cf8ff]">
              Book Your Red Rocks Shuttle
            </Link>
            <Link href="/book/red-rocks-amphitheatre/private" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-white/6 px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-white/10">
              View Private Vehicles
            </Link>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-[30px] border border-white/10 bg-[#0b1224] p-6 sm:p-8">
            <div className="text-[12px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">After The Encore</div>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-[-0.03em] text-white sm:text-4xl">The biggest difference shows up after the music stops</h2>
            <p className="mt-4 text-[15px] leading-7 text-white/74">
              Getting to Red Rocks is only half the problem. The hard part is getting out. Shuttles leave with a return plan already built in. Uber riders are competing with the full venue at the exact same time, often in the dark, with moving pickup zones and surge pricing climbing by the minute.
            </p>
          </section>
          <section className="rounded-[30px] border border-white/10 bg-[#0b1224] p-6 sm:p-8">
            <div className="text-[12px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">Best Strategy</div>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-[-0.03em] text-white sm:text-4xl">What actually works for most concert nights</h2>
            <ul className="mt-5 space-y-4 text-sm leading-7 text-white/76 sm:text-base">
              <li><strong className="text-white">Choose the shuttle</strong> if you want fixed pricing, a guaranteed return, and less friction after the show.</li>
              <li><strong className="text-white">Choose Uber</strong> only if you are comfortable paying more for flexibility and accepting the risk of long waits.</li>
              <li><strong className="text-white">Choose private service</strong> if your group wants one vehicle, one driver, and one plan all night.</li>
            </ul>
          </section>
        </section>

        <section className="mt-8 rounded-[30px] border border-white/10 bg-[#0b1224] p-6 sm:p-8">
          <div className="text-[12px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">2026 Cost Reality</div>
          <h2 className="mt-3 text-3xl font-black uppercase tracking-[-0.03em] text-white sm:text-4xl">Fixed shuttle pricing vs. surge pricing roulette</h2>
          <div className="mt-6 overflow-hidden rounded-[24px] border border-white/10">
            <table className="w-full border-collapse text-left text-sm text-white/80">
              <thead className="bg-white/6 text-[11px] uppercase tracking-[0.18em] text-[#8fd0ff]">
                <tr>
                  <th className="px-4 py-4 font-black">Feature</th>
                  <th className="px-4 py-4 font-black">Party at Red Rocks Shuttle</th>
                  <th className="px-4 py-4 font-black">Uber / Lyft</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-white/10 bg-black/10 align-top">
                  <td className="px-4 py-4 font-black text-white">Price</td>
                  <td className="px-4 py-4">$59 round trip, fixed before the night starts</td>
                  <td className="px-4 py-4">Often spikes after the show, sometimes into triple digits</td>
                </tr>
                <tr className="border-t border-white/10 bg-black/10 align-top">
                  <td className="px-4 py-4 font-black text-white">Pickup clarity</td>
                  <td className="px-4 py-4">Pickup and return are already planned</td>
                  <td className="px-4 py-4">Pickup zones shift and drivers cancel or reroute</td>
                </tr>
                <tr className="border-t border-white/10 bg-black/10 align-top">
                  <td className="px-4 py-4 font-black text-white">Post-show wait</td>
                  <td className="px-4 py-4">Built into the plan</td>
                  <td className="px-4 py-4">Can turn into a long queue with uncertain ETAs</td>
                </tr>
                <tr className="border-t border-white/10 bg-black/10 align-top">
                  <td className="px-4 py-4 font-black text-white">Night quality</td>
                  <td className="px-4 py-4">Social, simple, and predictable</td>
                  <td className="px-4 py-4">Flexible, but more chaotic when the venue clears out</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <section className="rounded-[30px] border border-white/10 bg-[#0b1224] p-6 sm:p-8">
            <div className="text-[12px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">Pickup Clarity</div>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-[-0.03em] text-white sm:text-4xl">Pickup clarity vs. pickup chaos</h2>
            <p className="mt-4 text-[15px] leading-7 text-white/74">
              Shuttle riders know where they are going before the night starts. Uber riders often have to walk, refresh the app, and react to driver changes in real time. When the venue empties out, certainty becomes part of the product.
            </p>
          </section>
          <section className="rounded-[30px] border border-white/10 bg-[#0b1224] p-6 sm:p-8">
            <div className="text-[12px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">Bottom Line</div>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-[-0.03em] text-white sm:text-4xl">The better play for most concert nights</h2>
            <p className="mt-4 text-[15px] leading-7 text-white/74">
              For most Red Rocks concerts, the shuttle is the cleaner move. It removes surge pricing, eliminates the post-show scramble, and turns transportation into one solved part of the night instead of a second problem to manage.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={bookingHref} className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#62f6ff] px-6 text-sm font-black uppercase tracking-[0.16em] text-[#07111d] transition hover:bg-[#8cf8ff]">
                Book The $59 Shuttle
              </Link>
              <Link href="/guide/local/union-station-red-rocks-shuttle" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-white/6 px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-white/10">
                Union Station Pickup Guide
              </Link>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
