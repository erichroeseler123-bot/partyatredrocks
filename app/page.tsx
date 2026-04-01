import type { Metadata } from "next";
import HomeSections from "@/components/home/HomeSections";
import SocialProofStrip from "@/components/social/SocialProofStrip";
import { getSameAs } from "@/lib/socials";
import { SITE_CONFIG } from "@/app/site-config";
import { BOOKING_COPY } from "@/lib/bookingCopy";
import { getEventsCatalog } from "@/lib/events/getCatalog";
import { getDynamicImage } from "@/lib/getDynamicImage";
import { curatedImages } from "@/lib/curatedImages";
import { pageVisuals } from "@/lib/pageVisuals";
import {
  BUSINESS_EMAIL,
  BUSINESS_NAME,
  BUSINESS_PHONE,
  BUSINESS_PHONE_DISPLAY,
  SERVICE_AREAS,
} from "@/lib/seo/siteTrust";

export const revalidate = 300;
const SITE = "https://www.partyatredrocks.com";

export const metadata: Metadata = {
  title: "Red Rocks Shuttle from Denver | Shared Seats + Private SUVs | Party at Red Rocks",
  description: BOOKING_COPY.meta.homeDescription,
  alternates: { canonical: `${SITE}/` },
  openGraph: {
    title: "Red Rocks Shuttle from Denver | Shared Seats + Private SUVs | Party at Red Rocks",
    description: BOOKING_COPY.meta.homeDescription,
    url: `${SITE}/`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Red Rocks Shuttle from Denver | Shared Seats + Private SUVs | Party at Red Rocks",
    description: BOOKING_COPY.meta.homeDescription,
  },
};

export default async function HomePage() {
  const brandKey = SITE_CONFIG.socialBrandKey;
  const [events] = await Promise.all([getEventsCatalog(2026, "redrocks")]);
  const heroSrc = pageVisuals.home.heroSrc;
  const shuttleSrc = pageVisuals.home.shuttleSrc;
  const sprinterSrc = pageVisuals.home.privateSrc;
  const denverToday = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Denver",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  const nextRedRocksEvent = events
    .filter((event) => event.venueId === "red-rocks-amphitheatre" && event.dateKey >= denverToday)
    .sort((a, b) => `${a.dateKey}T${a.startLocal}`.localeCompare(`${b.dateKey}T${b.startLocal}`))[0];
  const nextRedRocksEventImage = nextRedRocksEvent
    ? await getDynamicImage(
        "concert",
        `${nextRedRocksEvent.artistNames[0] || nextRedRocksEvent.name} red rocks concert`,
        nextRedRocksEvent.image || curatedImages.redRocksVenue,
      )
    : null;
  const urgency = nextRedRocksEvent
    ? {
        label: nextRedRocksEvent.dateKey === denverToday ? "Tonight at Red Rocks" : "Next at Red Rocks",
        detail:
          nextRedRocksEvent.dateKey === denverToday
            ? `${nextRedRocksEvent.name} is on tonight. Shared and private ride planning is still open.`
            : `${nextRedRocksEvent.name} is coming up next. Lock the ride plan before show night gets compressed.`,
        imageSrc: nextRedRocksEventImage || curatedImages.redRocksVenue,
        imageAlt: `${nextRedRocksEvent.name} concert image`,
      }
    : null;

  const webSiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE}/#website`,
    name: BUSINESS_NAME,
    url: `${SITE}/`,
    publisher: { "@id": `${SITE}/#organization` },
  };

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@id": `${SITE}/#organization`,
    "@type": ["LocalBusiness", "TransportationService"],
    name: BUSINESS_NAME,
    url: `${SITE}/`,
    telephone: BUSINESS_PHONE,
    email: BUSINESS_EMAIL,
    areaServed: SERVICE_AREAS.map((city) => ({
      "@type": "City",
      name: `${city}, CO`,
    })),
    sameAs: getSameAs(brandKey),
    description: BOOKING_COPY.meta.businessDescription,
    serviceType: [
      "Private concert shuttle service",
      "Shared Red Rocks shuttle service",
      "Red Rocks Amphitheatre transportation",
    ],
    offers: {
      "@type": "OfferCatalog",
      name: "Private Red Rocks ride options",
      itemListElement: [
        {
          "@type": "Offer",
          priceCurrency: "USD",
          price: "499",
          itemOffered: {
            "@type": "Service",
            name: "Private SUV to Red Rocks",
          },
        },
        {
          "@type": "Offer",
          priceCurrency: "USD",
          price: "599",
          itemOffered: {
            "@type": "Service",
            name: "10 Passenger Van to Red Rocks",
          },
        },
        {
          "@type": "Offer",
          priceCurrency: "USD",
          price: "799",
          itemOffered: {
            "@type": "Service",
            name: "14 Passenger Sprinter to Red Rocks",
          },
        },
        {
          "@type": "Offer",
          priceCurrency: "USD",
          price: "1199",
          itemOffered: {
            "@type": "Service",
            name: "24 Passenger Party Bus to Red Rocks",
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
        name: "How late do Red Rocks rides run?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Return rides run after the show ends, so your group does not have to guess the exit timing.",
        },
      },
      {
        "@type": "Question",
        name: "Can private rides stop at a liquor store?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Private rides can usually include a quick stop if you add the request before the ride.",
        },
      },
      {
        "@type": "Question",
        name: "Do you offer shared and private Red Rocks transportation?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Party at Red Rocks offers fixed-seat shared shuttles and private SUVs, vans, Sprinters, and party buses.",
        },
      },
      {
        "@type": "Question",
        name: "Do private Red Rocks shuttles have guaranteed return service?",
        acceptedAnswer: {
          "@type": "Answer",
          text: BOOKING_COPY.faq.privateReturn,
        },
      },
      {
        "@type": "Question",
        name: "Can groups book larger vehicles for Red Rocks?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Larger groups can book vans, Sprinters, or a 24-passenger party bus depending on group size and the kind of night they want.",
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <HomeSections
        heroSrc={heroSrc}
        shuttleSrc={shuttleSrc}
        sprinterSrc={sprinterSrc}
        urgency={urgency}
      />
      <section className="brand-page px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1500px]">
          <SocialProofStrip
            brandKey="partyatredrocks"
            title="Real ride nights"
            body="A fast look at real arrivals, real groups, and the kind of Red Rocks night people are actually booking."
            pageTitle="Party At Red Rocks"
            pageUrl={`${SITE}/`}
          />
        </div>
      </section>
    </>
  );
}
