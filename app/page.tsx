import type { Metadata } from "next";
import HomeSections from "@/components/home/HomeSections";
import SocialProofStrip from "@/components/social/SocialProofStrip";
import { getSameAs } from "@/lib/socials";
import { SITE_CONFIG } from "@/app/site-config";
import { getDynamicImage } from "@/lib/getDynamicImage";
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
  description:
    "Shared and private Red Rocks shuttles from Denver, Golden, and Morrison. Fixed pricing, guaranteed return, private SUVs, vans, Sprinters, and group ride planning.",
  alternates: { canonical: `${SITE}/` },
  openGraph: {
    title: "Red Rocks Shuttle from Denver | Shared Seats + Private SUVs | Party at Red Rocks",
    description:
      "Shared and private Red Rocks shuttles from Denver, Golden, and Morrison. Fixed pricing, guaranteed return, private SUVs, vans, Sprinters, and group ride planning.",
    url: `${SITE}/`,
    type: "website",
  },
};

export default async function HomePage() {
  const brandKey = SITE_CONFIG.socialBrandKey;
  const [heroSrc, shuttleSrc, sprinterSrc, vipSrc] = await Promise.all([
    getDynamicImage("venue", "Red Rocks Amphitheatre", "/hero/hero-home.jpg"),
    getDynamicImage("concert", "shuttle bus denver", "/images/marketing/shuttle.jpg"),
    getDynamicImage("fleet", "sprinter van denver", "/fleet/fleet-sprinter.jpg"),
    getDynamicImage("concert", "private suv concert arrival", "/images/marketing/vip-suv.jpg"),
  ]);

  const webSiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: BUSINESS_NAME,
    url: `${SITE}/`,
  };

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "Service"],
    name: BUSINESS_NAME,
    url: `${SITE}/`,
    telephone: BUSINESS_PHONE,
    email: BUSINESS_EMAIL,
    areaServed: SERVICE_AREAS.map((city) => ({
      "@type": "City",
      name: `${city}, CO`,
    })),
    sameAs: getSameAs(brandKey),
    description:
      "Fixed-price Red Rocks shuttles and private rides with pickup planning and guaranteed return service.",
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
          text: "Yes. Private Red Rocks rides are built around a guaranteed return after the show so your group is not left scrambling for pickup.",
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
        vipSrc={vipSrc}
      />
      <section className="bg-[#090909] px-4 pb-20 sm:px-6 lg:px-8">
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
