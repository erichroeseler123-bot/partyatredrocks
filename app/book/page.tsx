import Link from "next/link";
import { redirect } from "next/navigation";
import { CalendarDays, CarFront, MapPinned, ShieldCheck } from "lucide-react";
import { rezdyGetAvailability } from "@/lib/rezdy";
import { SHUTTLE_PRICING } from "@/lib/pricing";

export const metadata = {
  robots: { index: false, follow: true },
};

type SP = Record<string, string | string[] | undefined>;

function first(sp: SP, key: string) {
  const v = sp[key];
  return Array.isArray(v) ? v[0] : v;
}

function buildQs(sp: SP) {
  const qs = new URLSearchParams();
  const pickup = first(sp, "pickup");
  const date = first(sp, "date");
  const qty = first(sp, "qty");

  if (pickup) qs.set("pickup", pickup);
  if (date) qs.set("date", date);
  if (qty) qs.set("qty", qty);

  const q = qs.toString();
  return q ? `?${q}` : "";
}

function formatVenueName(raw: string) {
  return raw
    .replace(/-/g, " ")
    .replace(/amphitheatre/g, "Amphitheatre")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const bookingCards = [
  {
    href: "/venues/red-rocks-amphitheatre",
    title: "Red Rocks Shuttle",
    eyebrow: "Flagship Ride",
    accent: "#ff5b2e",
    bullets: [
      "Round-trip Red Rocks shuttle",
      "Denver pickup flow",
      "Return ride locked in",
      "Built for the full night",
    ],
    icon: CarFront,
  },
  {
    href: "/venues/mishawaka-amphitheatre",
    title: "Mishawaka Shuttle",
    eyebrow: "Mountain Nights",
    accent: "#8fd0ff",
    bullets: [
      "Shared canyon shuttle",
      "Mountain logistics handled",
      SHUTTLE_PRICING.mishawaka.shared,
      `Private option: ${SHUTTLE_PRICING.mishawaka.privateSuburban}`,
    ],
    icon: MapPinned,
  },
  {
    href: "/book-all-venues",
    title: "All-Venue Shuttle",
    eyebrow: "Private Route",
    accent: "#8fe3b0",
    bullets: [
      "Denver + Boulder venue coverage",
      SHUTTLE_PRICING.denverBoulderOtherVenues.suburban,
      "Private suburban service",
      "One clean booking flow",
    ],
    icon: ShieldCheck,
  },
] as const;

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const productCode = first(sp, "productCode");
  let liveAvailabilityNote: string | null = null;

  if (productCode) {
    try {
      const query = new URLSearchParams();
      query.set("productCode", productCode);
      const sessions = await rezdyGetAvailability(query);
      liveAvailabilityNote = `Live Rezdy check: ${sessions.length} session${sessions.length === 1 ? "" : "s"} returned for ${productCode}.`;
    } catch {
      liveAvailabilityNote = `Live Rezdy check unavailable for ${productCode}.`;
    }
  }

  const venue = (first(sp, "venue") || "").toLowerCase();
  const venueDisplay = formatVenueName(venue);
  const qs = buildQs(sp);

  if (venue) {
    return (
      <main className="min-h-screen bg-[#050816] px-4 pb-12 pt-24 text-white sm:px-6 lg:px-8">
        <section className="mx-auto max-w-5xl rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,13,26,0.96),rgba(6,9,18,0.96))] p-8 text-center shadow-[0_30px_90px_rgba(0,0,0,0.4)] sm:p-12">
          <div className="inline-flex items-center rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
            Booking Prefill Ready
          </div>
          <h1 className="mt-5 text-4xl font-black uppercase tracking-[-0.04em] sm:text-6xl">
            {venueDisplay}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-white/72 sm:text-lg">
            Your ride details are already loaded. Continue to the matching shuttle flow and finish booking from there.
          </p>
          <div className="mt-8">
            <Link
              href={`/venues/${venue}${qs}`}
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#ff5b2e] px-8 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-[#ff7148]"
            >
              Continue Booking
            </Link>
          </div>
        </section>
      </main>
    );
  }

  if (
    venue === "red-rocks" ||
    venue === "redrocks" ||
    venue === "red-rocks-amphitheatre"
  ) {
    redirect(`/venues/red-rocks-amphitheatre${qs}`);
  }
  if (venue === "mishawaka" || venue === "mishawaka-amphitheatre") {
    redirect(`/venues/mishawaka-amphitheatre${qs}`);
  }
  if (venue === "all-venues" || venue === "any" || venue === "any-venue") {
    redirect(`/book-all-venues${qs}`);
  }

  return (
    <main className="min-h-screen bg-[#050816] px-4 pb-14 pt-24 text-white sm:px-6 lg:px-8">
      <section className="mx-auto flex max-w-[1440px] flex-col gap-8">
        {liveAvailabilityNote ? (
          <section className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,13,26,0.96),rgba(6,9,18,0.96))] p-4">
            <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
              Live Availability
            </div>
            <p className="mt-2 text-sm text-white/76">{liveAvailabilityNote}</p>
          </section>
        ) : null}

        <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,16,32,0.98),rgba(6,9,18,0.96))] p-8 shadow-[0_40px_120px_rgba(0,0,0,0.45)] sm:p-10 lg:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,91,46,0.18),transparent_30%),radial-gradient(circle_at_top_right,rgba(143,208,255,0.14),transparent_28%)]" />
          <div className="relative max-w-3xl">
            <div className="inline-flex items-center rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
              Booking Router
            </div>
            <h1 className="mt-5 text-[2.5rem] font-black uppercase leading-[0.94] tracking-[-0.04em] sm:text-[4rem] lg:text-[5rem]">
              Choose Your Ride
            </h1>
            <p className="mt-5 max-w-2xl text-[15px] leading-7 text-white/74 sm:text-lg">
              Pick the venue flow that matches your night and move straight into the right shuttle booking experience.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/find"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#ff5b2e] px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-[#ff7148]"
              >
                Find Your Ride
              </Link>
              <Link
                href="/week"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-white/6 px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-white/10"
              >
                Browse This Week
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {[
                "Fixed pricing",
                "Guaranteed return",
                "Pro drivers",
                "Group-friendly rides",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 bg-white/6 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white/72"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          {bookingCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.title}
                href={`${card.href}${qs}`}
                className="group rounded-[26px] border border-white/10 bg-[#0b1224] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(0,0,0,0.42)]"
              >
                <div
                  className="inline-flex rounded-2xl border p-3"
                  style={{
                    borderColor: `${card.accent}40`,
                    backgroundColor: `${card.accent}18`,
                    color: card.accent,
                  }}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div
                  className="mt-4 text-[11px] font-black uppercase tracking-[0.22em]"
                  style={{ color: card.accent }}
                >
                  {card.eyebrow}
                </div>
                <h2 className="mt-2 text-2xl font-black uppercase tracking-[-0.03em] text-white">
                  {card.title}
                </h2>
                <ul className="mt-4 space-y-2 text-sm leading-6 text-white/70">
                  {card.bullets.map((bullet) => (
                    <li key={bullet}>• {bullet}</li>
                  ))}
                </ul>
                <div
                  className="mt-6 inline-flex items-center text-sm font-bold"
                  style={{ color: card.accent }}
                >
                  Continue →
                </div>
              </Link>
            );
          })}
        </section>

        <section className="grid gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,21,38,0.96),rgba(8,12,24,0.96))] p-6 sm:p-8">
            <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
              Booking Notes
            </div>
            <h2 className="mt-2 text-2xl font-black uppercase tracking-[-0.03em] sm:text-3xl">
              Pick the flow that matches the night.
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: "Red Rocks",
                  body: "The flagship route for the venue most riders come here for.",
                },
                {
                  title: "Mishawaka",
                  body: "Mountain logistics and canyon timing handled in one place.",
                },
                {
                  title: "All-Venue",
                  body: "Private suburban routing for Denver and Boulder show nights.",
                },
                {
                  title: "Prefills",
                  body: "If you arrive with venue or date params, this page forwards you cleanly.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5"
                >
                  <div className="text-lg font-black text-white">{item.title}</div>
                  <p className="mt-2 text-sm leading-6 text-white/68">{item.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(17,11,18,0.96),rgba(10,9,20,0.96))] p-6 sm:p-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-3 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-[#ffb07c]">
              <CalendarDays className="h-3.5 w-3.5" />
              Quick Start
            </div>
            <div className="mt-4 text-2xl font-black leading-tight text-white">
              Already browsing shows?
            </div>
            <p className="mt-3 text-sm leading-6 text-white/72">
              Use this week&apos;s lineup to jump from the show you want straight into ride options with less clicking.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Link
                href="/week"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#ff5b2e] px-5 text-xs font-black uppercase tracking-[0.16em] text-white transition hover:bg-[#ff7148]"
              >
                Browse This Week
              </Link>
              <Link
                href="/find"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/12 bg-white/6 px-5 text-xs font-black uppercase tracking-[0.16em] text-white transition hover:bg-white/10"
              >
                Open Ride Finder
              </Link>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
