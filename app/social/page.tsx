import type { Metadata } from "next";
import SocialProofStrip from "@/components/social/SocialProofStrip";
import SocialLinks from "@/components/shared/SocialLinks";
import { SITE_CONFIG } from "@/app/site-config";
import { getSameAs } from "@/lib/socials";
import { pageVisuals } from "@/lib/pageVisuals";
const SITE = "https://www.partyatredrocks.com";
const FEATURED_SOCIAL_IMAGE = pageVisuals.social.shareImage;

export const metadata: Metadata = {
  title: pageVisuals.social.title,
  description: pageVisuals.social.description,
  alternates: { canonical: `${SITE}/social` },
  openGraph: {
    title: pageVisuals.social.title,
    description: pageVisuals.social.description,
    url: `${SITE}/social`,
    type: "website",
    images: [{ url: FEATURED_SOCIAL_IMAGE, alt: "Party At Red Rocks social proof gallery" }],
  },
  twitter: {
    card: "summary_large_image",
    title: pageVisuals.social.title,
    description: pageVisuals.social.description,
    images: [FEATURED_SOCIAL_IMAGE],
  },
};

export default function SocialPage() {
  const brandKey = SITE_CONFIG.socialBrandKey;

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Party At Red Rocks Social",
    url: `${SITE}/social`,
    description: "Real rides, real nights, and real groups planning concert transport with Party At Red Rocks.",
    sameAs: getSameAs(brandKey),
  };

  return (
    <main className="brand-page min-h-screen bg-[radial-gradient(circle_at_top,rgba(255,91,46,0.15),transparent_26%),radial-gradient(circle_at_18%_10%,rgba(59,130,246,0.14),transparent_18%),linear-gradient(180deg,#0b0b0f_0%,#0b0b0f_100%)] px-4 pb-14 pt-24 text-white sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
      <section className="mx-auto flex max-w-[1240px] flex-col gap-8">
        <section
          className="brand-panel relative min-h-[420px] overflow-hidden rounded-[32px] p-8 shadow-[0_40px_120px_rgba(0,0,0,0.45)] sm:min-h-[460px] sm:p-10 lg:min-h-[520px] lg:p-12"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.72)), linear-gradient(110deg, rgba(11,11,15,0.82) 0%, rgba(11,11,15,0.56) 42%, rgba(11,11,15,0.88) 100%), url(${pageVisuals.social.heroSrc})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,91,46,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.14),transparent_28%)]" />
          <div className="relative max-w-4xl">
            <div className="inline-flex items-center rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[var(--brand-orange)]">
              Social
            </div>
            <h1 className="mt-5 text-[2.5rem] font-black uppercase leading-[0.94] tracking-[-0.04em] sm:text-[4rem] lg:text-[5rem]">
              Party At Red Rocks Social
            </h1>
            <p className="mt-5 max-w-3xl text-[15px] leading-7 text-white/74 sm:text-lg">
              Real rides, real nights, real groups. This is the cleanest place to see what the route actually looks like and send the plan to the rest of your crew.
            </p>
            <div className="mt-7">
              <SocialLinks brandKey={brandKey} mode="feature" showLabels />
            </div>
          </div>
        </section>

        <SocialProofStrip
          brandKey="partyatredrocks"
          mode="feature"
          title="Ride nights and fan moments"
          body="Curated proof from real concert nights. Strong arrivals, group energy, and the kind of plan people actually want to send around before show day."
          pageTitle="Party At Red Rocks Social"
          pageUrl={`${SITE}/social`}
        />

        <section className="brand-card rounded-[30px] p-6 sm:p-8">
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[var(--brand-cyan)]">Follow the route</div>
          <h2 className="mt-3 text-2xl font-black uppercase tracking-[-0.03em] text-white sm:text-3xl">
            Riding with us? Tag us, follow us, or send the plan to your group.
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/72">
            Social here is proof, not filler. If you want to see what rides actually look like or ask about a pickup plan, start here.
          </p>
        </section>
      </section>
    </main>
  );
}
