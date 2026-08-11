import Link from "next/link";
import type { HandoffSearchParams } from "@/lib/parrHandoff";
import { buildBookingHref } from "@/lib/parrHandoff";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

export const metadata = {
  title: "Red Rocks Private Transportation vs Uber 2026 | What Works After the Show",
  description:
    "Compare private Red Rocks transportation with Uber and Lyft in 2026: fixed group pricing, post-show pickup reliability, and the $399 Suburban / $599 van options from Party at Red Rocks.",
  alternates: { canonical: "/red-rocks/transportation/shuttle-vs-uber-2026" },
  openGraph: {
    title: "Red Rocks Private Transportation vs Uber 2026",
    description:
      "Private $399 Suburban and $599 van service compared with rideshare surge pricing and post-show pickup uncertainty at Red Rocks.",
    url: `${SITE}/red-rocks/transportation/shuttle-vs-uber-2026`,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Red Rocks Private Transportation vs Uber 2026",
    description:
      "Compare Party at Red Rocks private transportation with Uber and Lyft for a Red Rocks concert night.",
  },
};

export default async function Page({ searchParams }: { searchParams: Promise<HandoffSearchParams> }) {
  const sp = await searchParams;
  const bookingHref = buildBookingHref({
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
      { "@type": "ListItem", position: 4, name: "Private Transportation vs Uber 2026", item: `${SITE}/red-rocks/transportation/shuttle-vs-uber-2026` },
    ],
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Red Rocks Private Transportation vs Uber in 2026",
    description:
      "Comparing fixed-price private Red Rocks transportation with rideshare surge pricing, post-show waits, and pickup uncertainty.",
    url: `${SITE}/red-rocks/transportation/shuttle-vs-uber-2026`,
    mainEntityOfPage: `${SITE}/red-rocks/transportation/shuttle-vs-uber-2026`,
    author: { "@type": "Organization", name: "Party at Red Rocks" },
    publisher: { "@id": `${SITE}/#organization` },
    about: [
      { "@type": "Place", name: "Red Rocks Amphitheatre", url: `${SITE}/venues/red-rocks-amphitheatre` },
      { "@type": "Service", name: "Private Red Rocks transportation", url: `${SITE}/book/red-rocks-amphitheatre/private` },
      { "@type": "Thing", name: "Rideshare surge pricing and post-show pickup at Red Rocks" },
    ],
  };

  return (
    <main className="min-h-screen bg-[#050816] px-4 pb-16 pt-24 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1100px]">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />

        <nav className="text-sm text-white/55">
          <Link className="hover:text-white" href="/red-rocks/transportation">Transportation</Link>{" "}
          <span className="text-white/35">/</span> Private Ride vs Uber 2026
        </nav>

        <section className="mt-6 overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(13,19,34,0.98),rgba(8,11,20,0.98))] p-8 shadow-[0_40px_120px_rgba(0,0,0,0.45)] sm:p-10 lg:p-12">
          <div className="inline-flex items-center rounded-full border border-[#8fd0ff]/30 bg-[#8fd0ff]/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">2026 Comparison</div>
          <h1 className="mt-5 max-w-4xl text-[2.5rem] font-black uppercase leading-[0.94] tracking-[-0.04em] sm:text-[4rem]">Red Rocks Private Transportation vs. Uber in 2026</h1>
          <p className="mt-5 max-w-3xl text-[15px] leading-7 text-white/78 sm:text-lg">
            The real difference shows up after the encore. Party at Red Rocks gives your group one private vehicle, one return plan, and fixed group pricing before the night starts.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm font-bold text-white/90">
            <span className="rounded-full border border-white/12 bg-white/6 px-4 py-2">$399 Private Suburban</span>
            <span className="rounded-full border border-white/12 bg-white/6 px-4 py-2">$599 Private Van</span>
            <span className="rounded-full border border-white/12 bg-white/6 px-4 py-2">Vehicle waits through the show</span>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href={bookingHref} className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#62f6ff] px-6 text-sm font-black uppercase tracking-[0.16em] text-[#07111d] transition hover:bg-[#8cf8ff]">Book Private Red Rocks Ride</Link>
            <Link href="/red-rocks/transportation" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-white/6 px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-white/10">Transportation Guide</Link>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-[30px] border border-white/10 bg-[#0b1224] p-6 sm:p-8">
            <div className="text-[12px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">After The Encore</div>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-[-0.03em] text-white sm:text-4xl">Your return plan is already there</h2>
            <p className="mt-4 text-[15px] leading-7 text-white/74">A private vehicle that waits through the show removes the need to open an app, hunt for a driver, or negotiate a changing pickup plan while thousands of people leave at once.</p>
          </section>
          <section className="rounded-[30px] border border-white/10 bg-[#0b1224] p-6 sm:p-8">
            <div className="text-[12px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">When Uber Makes Sense</div>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-[-0.03em] text-white sm:text-4xl">Flexibility without a reserved vehicle</h2>
            <p className="mt-4 text-[15px] leading-7 text-white/74">Uber or Lyft can still work when your group values app-based flexibility and is comfortable with changing availability, pickup instructions, and post-show pricing.</p>
          </section>
        </section>

        <section className="mt-8 rounded-[30px] border border-white/10 bg-[#0b1224] p-6 sm:p-8">
          <div className="text-[12px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">Side-by-side</div>
          <h2 className="mt-3 text-3xl font-black uppercase tracking-[-0.03em] text-white sm:text-4xl">Private vehicle vs. rideshare</h2>
          <div className="mt-6 overflow-hidden rounded-[24px] border border-white/10">
            <table className="w-full border-collapse text-left text-sm text-white/80">
              <thead className="bg-white/6 text-[11px] uppercase tracking-[0.18em] text-[#8fd0ff]"><tr><th className="px-4 py-4 font-black">Feature</th><th className="px-4 py-4 font-black">Party at Red Rocks</th><th className="px-4 py-4 font-black">Uber / Lyft</th></tr></thead>
              <tbody>
                <tr className="border-t border-white/10 bg-black/10 align-top"><td className="px-4 py-4 font-black text-white">Price</td><td className="px-4 py-4">$399 Suburban or $599 van for the private vehicle</td><td className="px-4 py-4">Varies by demand and can surge after the show</td></tr>
                <tr className="border-t border-white/10 bg-black/10 align-top"><td className="px-4 py-4 font-black text-white">Pickup</td><td className="px-4 py-4">Door-to-door plan established before show night</td><td className="px-4 py-4">App instructions and driver availability can change</td></tr>
                <tr className="border-t border-white/10 bg-black/10 align-top"><td className="px-4 py-4 font-black text-white">Return</td><td className="px-4 py-4">Your vehicle waits through the show</td><td className="px-4 py-4">You request a ride when you are ready to leave</td></tr>
                <tr className="border-t border-white/10 bg-black/10 align-top"><td className="px-4 py-4 font-black text-white">Group experience</td><td className="px-4 py-4">Your group stays together in one private vehicle</td><td className="px-4 py-4">May require multiple cars for larger groups</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8 rounded-[30px] border border-white/10 bg-[#0b1224] p-6 sm:p-8">
          <div className="text-[12px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">Bottom Line</div>
          <h2 className="mt-3 text-3xl font-black uppercase tracking-[-0.03em] text-white sm:text-4xl">Pay for certainty if certainty matters</h2>
          <p className="mt-4 text-[15px] leading-7 text-white/74">For groups that want the transportation problem solved before concert night, the private option buys predictability: one vehicle, one plan, and a known group price.</p>
          <div className="mt-6"><Link href={bookingHref} className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#62f6ff] px-6 text-sm font-black uppercase tracking-[0.16em] text-[#07111d] transition hover:bg-[#8cf8ff]">Reserve Private Transportation</Link></div>
        </section>
      </div>
    </main>
  );
}
