import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookingVisualHero } from "@/components/booking/BookingVisualHero";
import SocialProofStrip from "@/components/social/SocialProofStrip";
import ShareActions from "@/components/shared/ShareActions";
import venuesJson from "@/data/venues.json";
import { PlanningLinks } from "@/components/booking/PlanningLinks";
import { PrivatePromoBanner } from "@/components/booking/PrivatePromoBanner";
import { DccReturnBanner } from "@/components/booking/DccReturnBanner";
import { postDccSatelliteEvent, postWtaPartnerAcceptedIfNeeded } from "@/lib/dccSatellite";
import { buildBookingHref, type HandoffSearchParams } from "@/lib/parrHandoff";
import { TrustStrip } from "@/components/TrustStrip";
import { bookingVisuals } from "@/lib/bookingVisuals";
import { getSameAs } from "@/lib/socials";
import { SITE_CONFIG } from "@/app/site-config";
import { BUSINESS_NAME, BUSINESS_PHONE, SERVICE_AREAS } from "@/lib/seo/siteTrust";

type VenueRow = {
  slug?: string;
  name?: string;
};

const privateOptions = [
  {
    slug: "suv",
    title: "Private SUV",
    eyebrow: "$499 • Up to 6 Guests",
    body: "Private ride for smaller groups that want limo-lane access and time to tailgate before the show.",
  },
  {
    slug: "van",
    title: "10 Passenger Van",
    eyebrow: "$599 • Up to 10 Guests",
    body: "One vehicle, one pickup plan, limo-lane access, and one return timeline for groups that need more room.",
  },
  {
    slug: "sprinter",
    title: "14 Passenger Sprinter",
    eyebrow: "$799 • Up to 14 Guests",
    body: "Best for larger groups that want more space, limo-lane access, and one vehicle for the full night.",
  },
  {
    slug: "party-bus",
    title: "24 Passenger Party Bus",
    eyebrow: "$1199 • Up to 24 Guests",
    body: "Best for larger groups who want to tailgate, stay together, and make the ride part of the night.",
  },
] as const;

const dccProductMap = {
  suv: "parr-suburban",
  van: "parr-van-10",
  sprinter: "parr-sprinter-14",
  "party-bus": "parr-party-bus-24",
} as const;

const SITE = "https://www.partyatredrocks.com";

function buildDccCheckoutHref(product: keyof typeof dccProductMap, quantity = 1) {
  const qty = Number.isFinite(quantity) && quantity > 0 ? Math.floor(quantity) : 1;
  return `https://www.destinationcommandcenter.com/book?route=parr-private&product=${dccProductMap[product]}&qty=${qty}`;
}

const privateBenefits = [
  "Upper North limo-lane access",
  "Best fit for groups that want to tailgate before the show",
  "One vehicle for the full night",
  "Pickup details sent before your ride",
  "Return ride handled after the show",
];

function getVenue(slug: string): VenueRow | null {
  return (venuesJson as Record<string, VenueRow>)[slug] ?? null;
}

function firstValue(searchParams: HandoffSearchParams, key: string) {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] : value;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ venue: string }>;
}): Promise<Metadata> {
  const { venue } = await params;
  if (venue !== "red-rocks-amphitheatre") {
    return {};
  }

  return {
    title: "Private Red Rocks Shuttle from Denver | $499 SUV - $799 Sprinter - Guaranteed Return",
    description:
      "Private shuttle from Denver to Red Rocks. SUV $499, 10-pass van $599, Sprinter $799, guaranteed return, limo-lane access, and optional liquor stop planning.",
    alternates: { canonical: `${SITE}/book/${venue}/private` },
    openGraph: {
      title: "Private Red Rocks Shuttle from Denver | $499 SUV - $799 Sprinter - Guaranteed Return",
      description:
        "Private shuttle from Denver to Red Rocks. SUV $499, 10-pass van $599, Sprinter $799, guaranteed return, limo-lane access, and optional liquor stop planning.",
      url: `${SITE}/book/${venue}/private`,
      type: "website",
      images: [
        {
          url: `${SITE}${bookingVisuals.private.imageSrc}`,
          alt: bookingVisuals.private.imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Private Red Rocks Shuttle from Denver | $499 SUV - $799 Sprinter - Guaranteed Return",
      description:
        "Private shuttle from Denver to Red Rocks. SUV $499, 10-pass van $599, Sprinter $799, guaranteed return, limo-lane access, and optional liquor stop planning.",
      images: [`${SITE}${bookingVisuals.private.imageSrc}`],
    },
  };
}

export default async function PrivateOptionsPage({
  params,
  searchParams,
}: {
  params: Promise<{ venue: string }>;
  searchParams: Promise<HandoffSearchParams>;
}) {
  const brandKey = SITE_CONFIG.socialBrandKey;
  const { venue } = await params;
  const sp = await searchParams;
  if (venue !== "red-rocks-amphitheatre") notFound();
  const row = getVenue(venue);
  if (!row?.name) notFound();
  const qtyRaw = firstValue(sp, "qty");
  const vehicleQty = qtyRaw ? Math.max(1, Number(qtyRaw) || 1) : 1;
  const artist = firstValue(sp, "artist");
  const dateRaw = firstValue(sp, "date");
  const dateLabel = dateRaw
    ? new Date(`${dateRaw}T12:00:00`).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  await postDccSatelliteEvent({
    eventType: "handoff_viewed",
    searchParams: sp,
    sourcePath: `/book/${venue}/private`,
    stage: "private_options",
    booking: { venueSlug: venue },
  });

  await postWtaPartnerAcceptedIfNeeded({
    searchParams: sp,
    sourcePath: `/book/${venue}/private`,
  });

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": ["Service", "TaxiService"],
    name: "Red Rocks private shuttle service",
    provider: {
      "@type": "LocalBusiness",
      name: BUSINESS_NAME,
      url: SITE,
      telephone: BUSINESS_PHONE,
      sameAs: getSameAs(brandKey),
    },
    areaServed: SERVICE_AREAS.map((city) => `${city}, CO`),
    serviceType: "Private concert shuttle service",
    url: `${SITE}/book/${venue}/private`,
    description:
      "Private Red Rocks transportation from Denver with fixed-price SUVs, vans, Sprinters, and party buses.",
    offers: {
      "@type": "OfferCatalog",
      name: "Private Red Rocks vehicle pricing",
      itemListElement: privateOptions.map((option) => ({
        "@type": "Offer",
        priceCurrency: "USD",
        price: option.eyebrow.split(" • ")[0].replace("$", ""),
        url: buildDccCheckoutHref(option.slug, vehicleQty),
        itemOffered: {
          "@type": "Service",
          name: option.title,
          description: option.body,
        },
      })),
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How late do private Red Rocks rides run?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Private rides run through the end of the show, with return pickup handled after the concert lets out.",
        },
      },
      {
        "@type": "Question",
        name: "Can my private ride stop at a liquor store?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Most private rides can include a quick stop if the request is added before the ride.",
        },
      },
      {
        "@type": "Question",
        name: "What time is pickup for private Red Rocks rides?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Most private Red Rocks rides use a 4:30 PM pickup window from Denver, with the exact pickup details confirmed before the event.",
        },
      },
      {
        "@type": "Question",
        name: "Do private Red Rocks shuttles have guaranteed return service?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Private rides are planned around a guaranteed return after the show so your group stays on one vehicle for the full night.",
        },
      },
      {
        "@type": "Question",
        name: "Which private vehicle is best for larger groups?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Larger groups usually choose the 10-passenger van, 14-passenger Sprinter, or 24-passenger party bus depending on headcount and how much room they want.",
        },
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#050816] px-4 pb-14 pt-24 text-white sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <section className="mx-auto flex max-w-[1240px] flex-col gap-8">
        <BookingVisualHero
          eyebrow={bookingVisuals.private.eyebrow}
          title={bookingVisuals.private.title}
          copy={bookingVisuals.private.copy}
          imageSrc={bookingVisuals.private.imageSrc}
          imageAlt={bookingVisuals.private.imageAlt}
        />

        <section className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,16,32,0.98),rgba(6,9,18,0.96))] p-8 shadow-[0_40px_120px_rgba(0,0,0,0.45)] sm:p-10 lg:p-12">
          <div className="inline-flex items-center rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#ffb07c]">
            Step 3
          </div>
          <div className="mt-4 inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-400/12 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-emerald-200">
            2-Second Booking - Instant and Secure
          </div>
          <h1 className="mt-5 text-[2.5rem] font-black uppercase leading-[0.94] tracking-[-0.04em] sm:text-[4rem]">
            Private Red Rocks Shuttle: Book in 2 Seconds
          </h1>
          <p className="mt-5 max-w-2xl text-[15px] leading-7 text-white/74 sm:text-lg">
            No redirects, no waiting. Choose your vehicle, enter your pickup and date, then pay online before your playlist ends.
          </p>
          <ShareActions
            brandKey={brandKey}
            url={`${SITE}/book/${venue}/private`}
            title="Private Red Rocks shuttle from Denver"
            mode="feature"
            className="mt-5"
          />
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/68 sm:text-[15px]">
            Private rides mean one vehicle, one plan, guaranteed return, and a faster way to lock the night in.
          </p>
          <div className="mt-6">
            <Link
              href={buildBookingHref({ target: "venue", venue, searchParams: sp })}
              className="text-sm font-bold text-[#ffb07c] hover:text-white"
            >
              ← Back to ride types
            </Link>
          </div>
          <PlanningLinks
            venue={venue}
            source={Array.isArray(sp.source) ? sp.source[0] : sp.source}
            className="mt-6"
          />
        </section>

        <section className="rounded-[30px] border border-white/10 bg-[#0b1224] p-6 sm:p-8">
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#ffb07c]">
            Why private
          </div>
          <h2 className="mt-4 text-3xl font-black uppercase tracking-[-0.03em] text-white sm:text-4xl">
            Why choose private over public shuttles from Denver or Golden to Red Rocks
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-[24px] border border-white/10 bg-[#09101f] p-5">
              <h3 className="text-lg font-black uppercase tracking-[-0.02em] text-white">
                Shuttle from Denver to Red Rocks
              </h3>
              <p className="mt-3 text-sm leading-6 text-white/74">
                Private rides work better when your group wants one pickup plan, limo-lane access, and a guaranteed return without waiting on other stops or another group&apos;s timing.
              </p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-[#09101f] p-5">
              <h3 className="text-lg font-black uppercase tracking-[-0.02em] text-white">
                Private transportation Golden to Red Rocks
              </h3>
              <p className="mt-3 text-sm leading-6 text-white/74">
                This lane is also better when you want to tailgate, make a quick liquor stop, or keep the full night on one vehicle instead of splitting the plan across public seats and rideshare.
              </p>
            </div>
          </div>
        </section>

        <SocialProofStrip
          brandKey="partyatredrocks"
          title="Real private ride nights"
          body="Private groups usually want the same proof before they book: what the ride feels like, what the arrival looks like, and whether the night actually stays clean after the encore."
          pageTitle="Private Red Rocks shuttle from Denver"
          pageUrl={`${SITE}/book/${venue}/private`}
        />

        <DccReturnBanner searchParams={sp} />

        {artist || dateLabel ? (
          <section className="rounded-2xl border border-emerald-400/28 bg-emerald-500/10 p-4 sm:p-5">
            <div className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-200">Quick ride selection</div>
            <p className="mt-2 text-sm text-white/88 sm:text-[15px]">
              You&apos;re booking for <span className="font-black text-white">{artist || "your selected artist"}</span>
              {dateLabel ? (
                <>
                  {" "}
                  on <span className="font-black text-white">{dateLabel}</span>
                </>
              ) : null}
              .
            </p>
          </section>
        ) : null}

        <PrivatePromoBanner />

        <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
          {privateOptions.map((option) => (
            <Link
              key={option.slug}
              href={buildDccCheckoutHref(option.slug, vehicleQty)}
              className="rounded-[26px] border border-white/10 bg-[#0b1224] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(0,0,0,0.42)]"
            >
              <div className="relative mb-5 h-40 overflow-hidden rounded-[20px] border border-white/10">
                <Image
                  src={bookingVisuals.privateOptions[option.slug].imageSrc}
                  alt={bookingVisuals.privateOptions[option.slug].imageAlt}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1280px) 280px, (min-width: 1024px) 50vw, 100vw"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,8,22,0.1),rgba(5,8,22,0.62)_100%)]" />
              </div>
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#ffb07c]">
                {option.eyebrow}
              </div>
              <h2 className="mt-3 text-2xl font-black uppercase tracking-[-0.03em] text-white">
                {option.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-white/70">{option.body}</p>
              <div className="mt-5 text-sm font-bold text-[#ffb07c]">Book in 2 Seconds →</div>
            </Link>
          ))}
        </section>

        <section className="rounded-[30px] border border-white/10 bg-[#0b1224] p-6 sm:p-8">
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#ffb07c]">
            Private Ride Benefits
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {privateBenefits.map((item) => (
              <div key={item} className="rounded-[24px] border border-white/10 bg-[#09101f] p-5 text-sm font-bold leading-6 text-white">
                {item}
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/guide/tailgating"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-white/6 px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-white/10"
            >
              Tailgating Guide
            </Link>
            <Link
              href="/guide/tailgate-faq"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-white/6 px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-white/10"
            >
              Tailgate FAQ
            </Link>
          </div>
        </section>

        <TrustStrip />
      </section>
    </main>
  );
}
