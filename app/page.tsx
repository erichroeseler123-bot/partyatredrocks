import type { Metadata } from "next";
import HomeSections, { type UpcomingRedRocksPreviewItem } from "@/components/home/HomeSections";
import SocialProofStrip from "@/components/social/SocialProofStrip";
import { getSameAs } from "@/lib/socials";
import { SITE_CONFIG } from "@/app/site-config";
import { BOOKING_COPY } from "@/lib/bookingCopy";
import { getDenverDateKey, getUpcomingEventsCatalog } from "@/lib/events/getCatalog";
import { getDynamicImage } from "@/lib/getDynamicImage";
import { curatedImages } from "@/lib/curatedImages";
import { pageVisuals } from "@/lib/pageVisuals";
import {
  BUSINESS_EMAIL,
  BUSINESS_NAME,
  SERVICE_AREAS,
} from "@/lib/seo/siteTrust";

export const revalidate = 300;
const SITE = "https://www.partyatredrocks.com";

export const metadata: Metadata = {
  title: "Red Rocks Shuttle & Private Group Transportation | Party at Red Rocks",
  description: BOOKING_COPY.meta.homeDescription,
  alternates: { canonical: `${SITE}/` },
  openGraph: {
    title: "Red Rocks Shuttle & Private Group Transportation | Party at Red Rocks",
    description: BOOKING_COPY.meta.homeDescription,
    url: `${SITE}/`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Red Rocks Shuttle & Private Group Transportation | Party at Red Rocks",
    description: BOOKING_COPY.meta.homeDescription,
  },
};

function formatDenverEventDate(dateKey: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Denver",
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${dateKey}T12:00:00-07:00`));
}

export default async function HomePage() {
  const brandKey = SITE_CONFIG.socialBrandKey;
  const denverToday = getDenverDateKey();
  const currentYear = Number(denverToday.slice(0, 4));
  const upcomingEvents = await getUpcomingEventsCatalog({
    scopes: ["redrocks"],
    fromDateKey: denverToday,
    years: [currentYear, currentYear + 1],
    venueId: "red-rocks-amphitheatre",
    limit: 120,
  });

  const heroSrc = pageVisuals.home.heroSrc;
  const privateVehicleSrc = "/images/redesign/private-suburban-black.webp";
  const privateVanSrc = "/images/redesign/private-van-black.webp";

  const nextRedRocksEvent = upcomingEvents[0] ?? null;
  const nextRedRocksEventDate = nextRedRocksEvent
    ? formatDenverEventDate(nextRedRocksEvent.dateKey)
    : null;
  const nextRedRocksEventImage = nextRedRocksEvent
    ? await getDynamicImage(
        "concert",
        `${nextRedRocksEvent.artistNames[0] || nextRedRocksEvent.name} red rocks concert`,
        nextRedRocksEvent.image || curatedImages.redRocksVenueThumb,
      )
    : null;

  const urgency = nextRedRocksEvent
    ? {
        label:
          nextRedRocksEvent.dateKey === denverToday
            ? "Tonight at Red Rocks"
            : nextRedRocksEvent.dateKey.startsWith("2027-")
              ? "Next Announced 2027 Show"
              : "Next at Red Rocks",
        detail:
          nextRedRocksEvent.dateKey === denverToday
            ? `${nextRedRocksEvent.name} is on tonight at Red Rocks.`
            : `${nextRedRocksEvent.name} kicks off ${nextRedRocksEventDate}. Reserve your group vehicle early.`,
        imageSrc: nextRedRocksEventImage || curatedImages.redRocksVenueThumb,
        imageAlt: `${nextRedRocksEvent.name} at Red Rocks Amphitheatre`,
        bookingHref: `/book/red-rocks-amphitheatre/private?date=${encodeURIComponent(nextRedRocksEvent.dateKey)}&artist=${encodeURIComponent(nextRedRocksEvent.name)}`,
      }
    : null;

  const upcoming2027Events = upcomingEvents.filter((event) => event.dateKey >= "2027-01-01");
  const upcoming2027Preview: UpcomingRedRocksPreviewItem[] = upcoming2027Events.map((event) => ({
    id: event.id,
    name: event.name,
    dateKey: event.dateKey,
    dateLabel: formatDenverEventDate(event.dateKey),
    supportLabel: event.artistNames.slice(1).join(", ") || null,
    sourceUrl: event.sourceUrl ?? null,
    suvBookingHref: `/book/red-rocks-amphitheatre/private/suv?date=${encodeURIComponent(event.dateKey)}&artist=${encodeURIComponent(event.name)}`,
    vanBookingHref: `/book/red-rocks-amphitheatre/private/van?date=${encodeURIComponent(event.dateKey)}&artist=${encodeURIComponent(event.name)}`,
  }));

  const webSiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE}/#website`,
    name: BUSINESS_NAME,
    url: `${SITE}/`,
    publisher: { "@id": `${SITE}/#organization` },
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@id": `${SITE}/#organization`,
    "@type": "Organization",
    name: BUSINESS_NAME,
    url: `${SITE}/`,
    logo: `${SITE}/brand/red-rocks-shuttle.png`,
    image: `${SITE}/fleet/fleet-suburban.jpg`,
    telephone: "+1-720-369-6292",
    email: BUSINESS_EMAIL,
    areaServed: SERVICE_AREAS.map((city) => ({
      "@type": "City",
      name: `${city}, CO`,
    })),
    sameAs: getSameAs(brandKey),
    description: BOOKING_COPY.meta.businessDescription,
  };

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@id": `${SITE}/#service`,
    "@type": "Service",
    name: "Private Red Rocks Concert Transportation",
    serviceType: "Private concert transportation",
    description:
      "Private round-trip concert transportation to Red Rocks Amphitheatre in a Private Suburban ($499) or 10-passenger Private Van ($699), including Upper North Lot tailgating gear and an on-site waiting driver.",
    provider: { "@id": `${SITE}/#organization` },
    areaServed: SERVICE_AREAS.map((city) => ({
      "@type": "City",
      name: `${city}, CO`,
    })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Private Red Rocks ride options",
      itemListElement: [
        {
          "@type": "Offer",
          priceCurrency: "USD",
          price: "499",
          url: `${SITE}/book/red-rocks-amphitheatre/private/suv`,
          itemOffered: {
            "@type": "Service",
            name: "Private Suburban to Red Rocks",
            description: "Private concert transportation for up to 6 guests in a full-size Suburban or equivalent SUV with Upper North Lot tailgating setup and waiting driver.",
          },
        },
        {
          "@type": "Offer",
          priceCurrency: "USD",
          price: "699",
          url: `${SITE}/book/red-rocks-amphitheatre/private/van`,
          itemOffered: {
            "@type": "Service",
            name: "10 Passenger Private Van to Red Rocks",
            description: "Private concert transportation for up to 10 guests in a high-roof van with Upper North Lot tailgating setup and waiting driver.",
          },
        },
      ],
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is included in the flat vehicle price?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Every private ride includes Denver-area pickup, an optional beverage/grocery stop, Upper North Lot staging, tailgating time with chairs, cooler, Bluetooth speaker and ice, a dedicated driver and vehicle waiting through the concert, and your return ride home.",
        },
      },
      {
        "@type": "Question",
        name: "How much does private Red Rocks transportation cost for 2027?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Published 2027 round-trip pricing is $499 flat for a Private Suburban (up to 6 guests) and $699 flat for a 10-passenger Private Van (up to 10 guests).",
        },
      },
      {
        "@type": "Question",
        name: "Can our private ride stop at a liquor or grocery store before Red Rocks?",
        acceptedAnswer: {
          "@type": "Answer",
          text: BOOKING_COPY.faq.liquorStop,
        },
      },
      {
        "@type": "Question",
        name: "Does our driver wait at Red Rocks during the concert?",
        acceptedAnswer: {
          "@type": "Answer",
          text: BOOKING_COPY.faq.privateReturn,
        },
      },
      {
        "@type": "Question",
        name: "Where do we tailgate at Red Rocks?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Private rides stage for pre-show tailgating in the Upper North Lot—Red Rocks' primary party lot near the top amphitheatre entrance.",
        },
      },
    ],
  };

  return (
    <>
      <link
        rel="preload"
        as="image"
        href="/images/redesign/hero-red-rocks-mobile.webp"
        media="(max-width: 640px)"
        fetchPriority="high"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <HomeSections
        heroSrc={heroSrc}
        privateVehicleSrc={privateVehicleSrc}
        privateVanSrc={privateVanSrc}
        urgency={urgency}
        upcoming2027Preview={upcoming2027Preview}
        verified2027Count={upcoming2027Events.length}
      />
      <section className="bg-[#070b14] px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1380px]">
          <SocialProofStrip
            brandKey="partyatredrocks"
            title="Real Red Rocks nights"
            body="Group arrivals, sunset tailgates in Upper North Lot, and zero-stress rides home after the encore."
            pageTitle="Party At Red Rocks"
            pageUrl={`${SITE}/`}
          />
        </div>
      </section>
    </>
  );
}
