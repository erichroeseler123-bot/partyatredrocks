import { BookingVisualHero } from "@/components/booking/BookingVisualHero";
import CustomBooking from "@/components/CustomBooking";
import { DccReturnBanner } from "@/components/booking/DccReturnBanner";
import { notFound } from "next/navigation";
import venuesJson from "@/data/venues.json";
import { BOOKING_COPY } from "@/lib/bookingCopy";
import { bookingVisuals } from "@/lib/bookingVisuals";
import { postDccSatelliteEvent, postWtaPartnerAcceptedIfNeeded } from "@/lib/dccSatellite";
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
      ? BOOKING_COPY.pickupHubs.golden.helper
      : BOOKING_COPY.pickupHubs.denver.helper;
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
              { hub: "denver" as const, label: BOOKING_COPY.pickupHubs.denver.label, detail: BOOKING_COPY.pickupHubs.denver.detail },
              { hub: "golden" as const, label: BOOKING_COPY.pickupHubs.golden.label, detail: BOOKING_COPY.pickupHubs.golden.detail },
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
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">Custom booking flow</div>
          <h2 className="mt-3 text-3xl font-black uppercase tracking-[-0.03em] text-white">
            Book shared shuttle seats here
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/70 sm:text-[15px]">
            This is the in-site booking form. Pick your service, choose a date, and complete the booking here without the hosted Rezdy widget.
          </p>
          <div className="mt-6">
            <CustomBooking venue={venue} />
          </div>
        </section>
      </section>
    </main>
  );
}
