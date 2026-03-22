import { BookingVisualHero } from "@/components/booking/BookingVisualHero";
import { DccReturnBanner } from "@/components/booking/DccReturnBanner";
import RezdySessionPicker from "@/components/RezdySessionPicker";
import Script from "next/script";
import { notFound } from "next/navigation";
import venuesJson from "@/data/venues.json";
import { bookingVisuals } from "@/lib/bookingVisuals";
import { buildTrackedExternalCheckoutHref, postDccSatelliteEvent, postWtaPartnerAcceptedIfNeeded } from "@/lib/dccSatellite";
import type { HandoffSearchParams } from "@/lib/parrHandoff";

export const runtime = "nodejs";
export const revalidate = 300;

type VenueRow = {
  slug?: string;
  name?: string;
};

const SHARED_CATALOG_WIDGET_URL = "https://gosnotransportation58.rezdy.com/catalog/617787/shuttles?iframe=true";

function getVenue(slug: string): VenueRow | null {
  return (venuesJson as Record<string, VenueRow>)[slug] ?? null;
}

function firstValue(searchParams: HandoffSearchParams, key: string) {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] : value;
}

export default async function SharedOptionsPage({
  params,
  searchParams,
}: {
  params: Promise<{ venue: string }>;
  searchParams: Promise<HandoffSearchParams>;
}) {
  const { venue } = await params;
  const sp = await searchParams;
  if (venue !== "red-rocks-amphitheatre") notFound();
  const row = getVenue(venue);
  if (!row?.name) notFound();
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
    sourcePath: `/book/${venue}/shared`,
    stage: "shared_catalog",
    booking: { venueSlug: venue },
  });

  await postWtaPartnerAcceptedIfNeeded({
    searchParams: sp,
    sourcePath: `/book/${venue}/shared`,
  });

  return (
    <main className="min-h-screen bg-[#050816] px-4 pb-14 pt-24 text-white sm:px-6 lg:px-8">
      <section className="mx-auto flex max-w-[1240px] flex-col gap-8">
        <BookingVisualHero
          eyebrow={bookingVisuals.shared.eyebrow}
          title={bookingVisuals.shared.title}
          copy={bookingVisuals.shared.copy}
          imageSrc={bookingVisuals.shared.imageSrc}
          imageAlt={bookingVisuals.shared.imageAlt}
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

        <section className="rounded-[30px] border border-white/10 bg-[#0b1224] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.42)] sm:p-8">
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
            Native booking flow
          </div>
          <h2 className="mt-3 text-3xl font-black uppercase tracking-[-0.03em] text-white">
            Book shared shuttle seats here first
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/70 sm:text-[15px]">
            This uses the in-site booking flow instead of sending you straight into the hosted Rezdy page. It is the safest path if the external widget is slow, blocked, or forcing extra verification.
          </p>
          <div className="mt-6">
            <RezdySessionPicker />
          </div>
        </section>

        <section className="overflow-visible rounded-[30px] border border-white/10 bg-[#0b1224] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.42)] sm:p-6">
          <Script src="https://gosnotransportation58.rezdy.com/pluginJs" strategy="afterInteractive" />
          <div className="mb-4 text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
            Hosted Rezdy checkout
          </div>
          <p className="mb-4 max-w-3xl text-sm leading-6 text-white/70">
            This is still available as a secondary path. If the hosted widget forces verification or loads badly, use the native booking flow above instead.
          </p>
          <div className="mb-4">
            <a
              href={buildTrackedExternalCheckoutHref({
                targetUrl: SHARED_CATALOG_WIDGET_URL.replace("?iframe=true", ""),
                searchParams: sp,
                sourcePath: `/book/${venue}/shared`,
                stage: "external_shared_catalog",
                productSlug: "shared-shuttle",
              })}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#ffd6a3]/24 bg-[linear-gradient(180deg,rgba(74,43,19,0.96),rgba(48,29,13,0.98))] px-5 text-xs font-black uppercase tracking-[0.16em] text-[#fff4de] transition hover:bg-[linear-gradient(180deg,rgba(93,56,27,0.98),rgba(61,37,17,0.98))]"
            >
              Open Shared Checkout in New Tab
            </a>
          </div>
          <iframe
            seamless
            width="100%"
            height="1000"
            frameBorder="0"
            className="rezdy w-full rounded-[20px] border-0 bg-white"
            src={SHARED_CATALOG_WIDGET_URL}
            title="Red Rocks shared shuttle catalog"
          />
        </section>
      </section>
    </main>
  );
}
