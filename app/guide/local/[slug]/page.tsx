import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PAGE_INTENT_METADATA, buildPageIntentMetadata } from "@/lib/pageIntentMetadata";
import {
  PRIVATE_BOOKING_PATH,
  comparisonRows,
  gatewayFaqs,
  localGatewayPageList,
  localGatewayPages,
  type LocalGatewaySlug,
} from "@/lib/localGatewayPages";

const SITE = "https://www.partyatredrocks.com";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return localGatewayPageList.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = localGatewayPages[slug as LocalGatewaySlug];
  if (!page) return {};

  return {
    ...buildPageIntentMetadata(`/guide/local/${page.slug}` as keyof typeof PAGE_INTENT_METADATA),
    title: { absolute: `${page.locationName} to Red Rocks Private Transportation | Party at Red Rocks` },
    description: `Private transportation from the ${page.locationName} area to Red Rocks: $399 Suburban or $599 van with a planned return ride. No shared shuttle seats.`,
    alternates: {
      canonical: `${SITE}/guide/local/${page.slug}`,
    },
    openGraph: {
      title: `${page.locationName} to Red Rocks Private Transportation | Party at Red Rocks`,
      description: `Private transportation from the ${page.locationName} area to Red Rocks with a planned return ride.`,
      url: `${SITE}/guide/local/${page.slug}`,
      type: "article",
      images: [page.shareImage],
    },
    twitter: {
      card: "summary_large_image",
      title: `${page.locationName} to Red Rocks Private Transportation | Party at Red Rocks`,
      description: `Private transportation from the ${page.locationName} area to Red Rocks with a planned return ride.`,
      images: [page.shareImage],
    },
  };
}

export default async function LocalGatewayPage({ params }: Props) {
  const { slug } = await params;
  const page = localGatewayPages[slug as LocalGatewaySlug];
  if (!page) notFound();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Where exactly is the pickup at ${page.locationName}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The exact private pickup address near ${page.locationName} is coordinated with your group before show night.`,
        },
      },
      ...gatewayFaqs.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    ],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Guide",
        item: `${SITE}/guide`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Local",
        item: `${SITE}/guide/local`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${page.locationName} Private Transportation`,
        item: `${SITE}/guide/local/${page.slug}`,
      },
    ],
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "TransportationService"],
    name: "Party at Red Rocks",
    url: SITE,
    image: page.shareImage,
    areaServed: ["Denver, CO", "Golden, CO", "Morrison, CO"],
    priceRange: "$399-$599",
    description: `Private transportation from the ${page.locationName} area to Red Rocks.`,
  };

  return (
    <main className="min-h-screen bg-[#050816] px-4 pb-16 pt-24 text-white sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />

      <section className="mx-auto flex max-w-[1180px] flex-col gap-8">
        <section className="overflow-hidden rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,16,32,0.98),rgba(6,9,18,0.96))] shadow-[0_40px_120px_rgba(0,0,0,0.45)]">
          <div className="grid gap-0 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="p-8 sm:p-10 lg:p-12">
              <div className="inline-flex items-center rounded-full border border-[#8fd0ff]/30 bg-[#8fd0ff]/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
                Private pickup area
              </div>
              <h1 className="mt-5 max-w-4xl text-[2.4rem] font-black uppercase leading-[0.94] tracking-[-0.04em] sm:text-[4rem]">
                Private Transportation from {page.locationName} to Red Rocks
              </h1>
              <p className="mt-5 max-w-3xl text-[15px] leading-7 text-white/80 sm:text-lg">Book a private Suburban for $399 or a private van for $599. Your group gets one vehicle, one pickup plan, and a planned ride home after the show. Shared shuttle seats are not currently offered.</p>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-[22px] border border-white/10 bg-black/20 p-5">
                  <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#8fd0ff]">Pickup Area</div>
                  <div className="mt-3 text-base font-semibold text-white">{page.landmarkName}</div>
                </div>
                <div className="rounded-[22px] border border-white/10 bg-black/20 p-5">
                  <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#8fd0ff]">Best For</div>
                  <div className="mt-3 text-base font-semibold text-white">{page.bestFor}</div>
                </div>
                <div className="rounded-[22px] border border-white/10 bg-black/20 p-5">
                  <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#8fd0ff]">Return Plan</div>
                  <div className="mt-3 text-base font-semibold text-white">Coordinated for your group before show night</div>
                </div>
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href={PRIVATE_BOOKING_PATH} className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-white/6 px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-white/10">
                  Book Private Transportation
                </Link>
              </div>
            </div>
            <div className="relative min-h-[320px] lg:min-h-full">
              <Image src={page.heroImageSrc} alt={page.heroImageAlt} fill className="object-cover" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,8,22,0.08),rgba(5,8,22,0.65)_100%)]" />
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-[30px] border border-white/10 bg-[#0b1224] p-6 sm:p-8">
            <div className="text-[12px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">Why This Departure Works</div>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-[-0.03em] text-white sm:text-4xl">Planning pickup near {page.locationName}</h2>
            <p className="mt-3 text-[15px] leading-7 text-white/74">Private pickup details are coordinated for your group before the ride. Confirm the exact address during booking so the vehicle plan matches where your group is staying or meeting.</p>
            <div className="mt-5 rounded-[22px] border border-white/10 bg-black/15 p-5 text-sm leading-7 text-white/76">
              <strong className="text-white">Who this pickup is best for:</strong> {page.bestFor}
            </div>
            <div className="mt-4 rounded-[22px] border border-white/10 bg-black/15 p-5 text-sm leading-7 text-white/76">
              <strong className="text-white">Current service:</strong> Private Suburban or private van; no shared stops or per-person fares.
            </div>
          </section>

          <section className="rounded-[30px] border border-white/10 bg-[#0b1224] p-6 sm:p-8">
            <div className="text-[12px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">Logistics</div>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-[-0.03em] text-white sm:text-4xl">Timing and returns</h2>
            <div className="mt-6 grid gap-4">
              <div className="rounded-[22px] border border-white/10 bg-black/15 p-5 text-sm leading-7 text-white/76">
                <strong className="text-white">Departure:</strong> Your pickup time and location are confirmed for your private group before show night.
              </div>
              <div className="rounded-[22px] border border-white/10 bg-black/15 p-5 text-sm leading-7 text-white/76">
                <strong className="text-white">Pickup:</strong> Keep the group together and ready at the agreed pickup address.
              </div>
              <div className="rounded-[22px] border border-white/10 bg-black/15 p-5 text-sm leading-7 text-white/76">
                <strong className="text-white">Return:</strong> The vehicle waits through the show, so the return ride is already part of your plan.
              </div>
            </div>
          </section>
        </section>

        <section className="rounded-[30px] border border-white/10 bg-[#0b1224] p-6 sm:p-8">
          <div className="text-[12px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">Shuttle vs. Uber vs. Driving</div>
          <h2 className="mt-3 text-3xl font-black uppercase tracking-[-0.03em] text-white sm:text-4xl">Compare the real options</h2>
          <div className="mt-6 overflow-hidden rounded-[24px] border border-white/10">
            <table className="w-full border-collapse text-left text-sm text-white/80">
              <thead className="bg-white/6 text-[11px] uppercase tracking-[0.18em] text-[#8fd0ff]">
                <tr>
                  <th className="px-4 py-4 font-black">Feature</th>
                  <th className="px-4 py-4 font-black">Party at Red Rocks</th>
                  <th className="px-4 py-4 font-black">Uber/Lyft</th>
                  <th className="px-4 py-4 font-black">Driving</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.feature} className="border-t border-white/10 bg-black/10 align-top">
                    <td className="px-4 py-4 font-black text-white">{row.feature}</td>
                    <td className="px-4 py-4">{row.parr}</td>
                    <td className="px-4 py-4">{row.uber}</td>
                    <td className="px-4 py-4">{row.driving}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-[30px] border border-white/10 bg-[#0b1224] p-6 sm:p-8">
            <div className="text-[12px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">Private Upgrade</div>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-[-0.03em] text-white sm:text-4xl">Traveling with a crew of 6 or more?</h2>
            <p className="mt-3 text-[15px] leading-7 text-white/74">
              Keep the group together in a private Suburban for up to six or a private van for up to ten. Party at Red Rocks does not currently offer a traditional party bus.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href={PRIVATE_BOOKING_PATH} className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-white/6 px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-white/10">
                View Private Vehicle Rates
              </Link>
              <Link href="/red-rocks/transportation" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-white/6 px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-white/10">
                Compare Ride Options
              </Link>
            </div>
          </section>

          <section className="rounded-[30px] border border-white/10 bg-[#0b1224] p-6 sm:p-8">
            <div className="text-[12px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">Nearby Spots</div>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-[-0.03em] text-white sm:text-4xl">Local guide</h2>
            <p className="mt-3 text-[15px] leading-7 text-white/74">Use {page.locationName} as the starting point for your private pickup plan. Confirm the exact address while booking, then keep the whole group on the same arrival and return plan.</p>
            <div className="mt-6 grid gap-4">
              {page.nearbySpots.map((spot) => (
                <div key={spot.name} className="rounded-[22px] border border-white/10 bg-black/15 p-5">
                  <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#ffb07c]">Nearby spot</div>
                  <h3 className="mt-3 text-xl font-black uppercase tracking-[-0.03em] text-white">{spot.name}</h3>
                  <p className="mt-2 text-sm leading-7 text-white/72">{spot.note}</p>
                </div>
              ))}
            </div>
          </section>
        </section>

        <section className="rounded-[30px] border border-white/10 bg-[#0b1224] p-6 sm:p-8">
          <div className="text-[12px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">FAQ</div>
          <h2 className="mt-3 text-3xl font-black uppercase tracking-[-0.03em] text-white sm:text-4xl">Questions riders ask before booking</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-[22px] border border-white/10 bg-black/15 p-5 text-sm leading-7 text-white/76">
              <strong className="text-white">Where exactly is the pickup at {page.locationName}?</strong>
              <div className="mt-2">The exact private pickup address near {page.locationName} is coordinated with your group before show night.</div>
            </div>
            {gatewayFaqs.map((faq) => (
              <div key={faq.question} className="rounded-[22px] border border-white/10 bg-black/15 p-5 text-sm leading-7 text-white/76">
                <strong className="text-white">{faq.question}</strong>
                <div className="mt-2">{faq.answer}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[30px] border border-[#62f6ff]/25 bg-[#0b1224] p-6 text-center sm:p-8">
          <h2 className="text-3xl font-black uppercase tracking-[-0.03em] text-white">{page.locationName} to Red Rocks Private Ride</h2>
          <p className="mx-auto mt-3 max-w-2xl text-[15px] leading-7 text-white/74">Choose a private Suburban or van and coordinate the exact pickup address for your group.</p>
          <Link href={PRIVATE_BOOKING_PATH} className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-[#62f6ff] px-6 text-sm font-black uppercase tracking-[0.16em] text-[#07111d] transition hover:bg-[#8cf8ff]">Book Private Transportation</Link>
        </section>
      </section>
    </main>
  );
}
