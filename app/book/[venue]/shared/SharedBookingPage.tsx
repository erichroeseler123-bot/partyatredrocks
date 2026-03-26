import { BookingVisualHero } from "@/components/booking/BookingVisualHero";
import { DccReturnBanner } from "@/components/booking/DccReturnBanner";
import RezdySessionPicker from "@/components/RezdySessionPicker";
import Script from "next/script";
import { notFound } from "next/navigation";
import venuesJson from "@/data/venues.json";
import { bookingVisuals } from "@/lib/bookingVisuals";
import { buildTrackedExternalCheckoutHref, postDccSatelliteEvent, postWtaPartnerAcceptedIfNeeded } from "@/lib/dccSatellite";
import type { HandoffSearchParams } from "@/lib/parrHandoff";
import { buildSharedBookingJsonLd } from "./sharedBookingSeo";

type VenueRow = {
  slug?: string;
  name?: string;
};

type SharedBookingPageInput = {
  venue: string;
  searchParams: HandoffSearchParams;
  sourcePath: string;
  basePath: string;
  stage: string;
};

const SHARED_CATALOG_WIDGET_URL = "https://gosnotransportation58.rezdy.com/catalog/617787/shuttles?iframe=true";

function getVenue(slug: string): VenueRow | null {
  return (venuesJson as Record<string, VenueRow>)[slug] ?? null;
}

function firstValue(searchParams: HandoffSearchParams, key: string) {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] : value;
}

function getPickupHub(searchParams: HandoffSearchParams): "denver" | "golden" {
  const raw = (firstValue(searchParams, "pickupHub") || firstValue(searchParams, "city") || "").trim().toLowerCase();
  return raw === "golden" ? "golden" : "denver";
}

function buildPickupHubHref(searchParams: HandoffSearchParams, basePath: string, pickupHub: "denver" | "golden") {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (key === "pickupHub" || key === "city") continue;
    if (Array.isArray(value)) {
      for (const entry of value) params.append(key, entry);
      continue;
    }
    if (typeof value === "string") params.set(key, value);
  }

  params.set("pickupHub", pickupHub);
  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

export async function SharedBookingPage({
  venue,
  searchParams,
  sourcePath,
  basePath,
  stage,
}: SharedBookingPageInput) {
  if (venue !== "red-rocks-amphitheatre") notFound();

  const row = getVenue(venue);
  if (!row?.name) notFound();

  const artist = firstValue(searchParams, "artist");
  const dateRaw = firstValue(searchParams, "date");
  const pickupHub = getPickupHub(searchParams);
  const pickupHubDetail =
    pickupHub === "golden"
      ? "Golden pickup boards at Trailhead Taphouse in Golden."
      : "Denver pickup boards at the Sheraton Denver Downtown.";
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
    searchParams,
    sourcePath,
    stage,
    booking: { venueSlug: venue },
  });

  await postWtaPartnerAcceptedIfNeeded({
    searchParams,
    sourcePath,
  });

  const jsonLd = buildSharedBookingJsonLd(basePath);

  return (
    <main className="min-h-screen bg-[#050816] px-4 pb-14 pt-24 text-white sm:px-6 lg:px-8">
      {jsonLd.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
      <section className="mx-auto flex max-w-[1240px] flex-col gap-8">
        <BookingVisualHero
          eyebrow={bookingVisuals.shared.eyebrow}
          title={bookingVisuals.shared.title}
          copy={bookingVisuals.shared.copy}
          imageSrc={bookingVisuals.shared.imageSrc}
          imageAlt={bookingVisuals.shared.imageAlt}
        />

        <section className="rounded-[28px] border border-white/10 bg-[#0b1224] px-5 py-5 shadow-[0_24px_80px_rgba(0,0,0,0.32)] sm:px-6">
          <div className="text-[11px] font-black uppercase tracking-[0.18em] text-white/54">Pickup City</div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {([
              { hub: "denver" as const, label: "Denver", detail: "Sheraton Denver Downtown" },
              { hub: "golden" as const, label: "Golden", detail: "Trailhead Taphouse" },
            ]).map((option) => {
              const active = pickupHub === option.hub;
              return (
                <a
                  key={option.hub}
                  href={buildPickupHubHref(searchParams, basePath, option.hub)}
                  className={`rounded-[24px] border px-5 py-4 transition ${
                    active
                      ? "border-[#8fd0ff]/55 bg-[#12243f] text-white shadow-[0_0_0_1px_rgba(143,208,255,0.18)]"
                      : "border-white/12 bg-black/25 text-white/78 hover:border-white/24 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                        active ? "border-[#8fd0ff] bg-[#8fd0ff]/18" : "border-white/28 bg-transparent"
                      }`}
                    >
                      <span className={`h-2.5 w-2.5 rounded-full ${active ? "bg-[#8fd0ff]" : "bg-transparent"}`} />
                    </span>
                    <div>
                      <div className="text-sm font-black uppercase tracking-[0.14em]">{option.label}</div>
                      <div className="mt-1 text-sm text-white/64">{option.detail}</div>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
          <p className="mt-3 text-sm text-white/70">{pickupHubDetail}</p>
        </section>

        <DccReturnBanner searchParams={searchParams} />

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
                searchParams,
                sourcePath,
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
