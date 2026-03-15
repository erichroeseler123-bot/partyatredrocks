import Link from "next/link";
import { ArrowRight, BadgeCheck, Bus, CarFront, ShieldCheck, Ticket } from "lucide-react";
import { ReviewBlock } from "@/components/ReviewBlock";
import { RecentBookingToast } from "@/components/RecentBookingToast";

export const metadata = {
  title: "Red Rocks Shuttle from Denver | $59 Seats + Private Options",
  description:
    "Book Red Rocks shuttle transportation from Denver with fixed-price shared seats and private ride options. Start with venue, choose ride type, and book online.",
  alternates: {
    canonical: "/shuttles",
  },
};

const rideCards = [
  {
    title: "Shared Shuttle",
    price: "$59 / seat",
    copy:
      "Round-trip shuttle seats for most riders. Fixed price, clear pickup, and a set ride home after the show.",
    href: "/book/red-rocks-amphitheatre/shared",
    cta: "Book Shared Seats",
    icon: Ticket,
  },
  {
    title: "Private SUV",
    price: "Private group",
    copy:
      "Best for small groups that want one vehicle, Upper North limo-lane access, and time to tailgate before the show.",
    href: "/book/red-rocks-amphitheatre/private/suv",
    cta: "Book Private SUV",
    icon: CarFront,
  },
  {
    title: "Private Van",
    price: "10-14 guests",
    copy:
      "Built for full crews that want to stay together, use the limo lane, and tailgate before heading in.",
    href: "/book/red-rocks-amphitheatre/private/van",
    cta: "Book Private Van",
    icon: Bus,
  },
];

const proofPoints = [
  "Shared shuttle seats from Denver",
  "Private rides for groups",
  "Secure online booking",
  "Pickup details before show night",
];

export default function ShuttlesPage() {
  return (
    <main className="bg-[#050816] px-4 pb-14 pt-24 text-white sm:px-6 lg:px-8">
      <RecentBookingToast />
      <section className="mx-auto flex max-w-[1440px] flex-col gap-8">
        <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(9,15,31,0.96),rgba(7,11,25,0.96))] p-8 shadow-[0_40px_120px_rgba(0,0,0,0.45)] sm:p-10 lg:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,91,46,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(143,208,255,0.14),transparent_28%)]" />
          <div className="relative max-w-3xl">
            <div className="inline-flex items-center rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
              Red Rocks Rides
            </div>
            <h1 className="mt-5 text-[2.5rem] font-black uppercase leading-[0.94] tracking-[-0.04em] sm:text-[4rem] lg:text-[5rem]">
              Red Rocks Shuttle From Denver
            </h1>
            <p className="mt-5 max-w-2xl text-[15px] leading-7 text-white/74 sm:text-lg">
              Shared seats from $59. Private rides for groups. Book online and get pickup details before show night.
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/68 sm:text-[15px]">
              Your return ride is covered after the show.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/book?venue=red-rocks-amphitheatre"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#ff5b2e] px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-[#ff7148]"
              >
                Start Booking
              </Link>
              <Link
                href="/book/red-rocks-amphitheatre/shared"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-white/6 px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-white/10"
              >
                Shared Shuttle
              </Link>
              <Link
                href="/book/red-rocks-amphitheatre/private"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-white/6 px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-white/10"
              >
                Private Rides
              </Link>
            </div>
          </div>
        </section>

        <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,13,26,0.96),rgba(6,9,18,0.96))] p-6 sm:p-8">
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
            Ride Options
          </div>
          <h2 className="mt-2 text-2xl font-black uppercase tracking-[-0.03em] sm:text-3xl">
            Shared if you want speed. Private if you want control.
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {rideCards.map((ride) => {
              const Icon = ride.icon;
              return (
                <article
                  key={ride.title}
                  className="rounded-[26px] border border-white/10 bg-[#0b1224] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(0,0,0,0.42)]"
                >
                  <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#ffb07c]">
                    <Icon className="h-4 w-4" />
                    {ride.price}
                  </div>
                  <h3 className="mt-3 text-2xl font-black uppercase tracking-[-0.03em] text-white">
                    {ride.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-white/70">{ride.copy}</p>
                  <Link
                    href={ride.href}
                    className="mt-5 inline-flex items-center text-sm font-bold text-[#ffb07c]"
                  >
                    {ride.cta}
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </article>
              );
            })}
          </div>
        </section>

        <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(9,15,31,0.96),rgba(7,11,25,0.96))] p-6 sm:p-8">
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#ffb07c]">
            Private Ride Benefits
          </div>
          <h2 className="mt-2 text-2xl font-black uppercase tracking-[-0.03em] sm:text-3xl">
            Best for groups that want Upper North limo-lane access and time to tailgate
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/70">
            Private rides use the Upper North limo lane and are the best option for groups who want to tailgate before the show.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/book/red-rocks-amphitheatre/private"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#3df3ff] px-6 text-sm font-black uppercase tracking-[0.16em] text-[#07111d] transition hover:bg-[#62f6ff]"
            >
              Book Private Service
            </Link>
            <Link
              href="/guide/tailgating"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-white/6 px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-white/10"
            >
              Tailgating Guide
            </Link>
          </div>
        </section>

        <ReviewBlock />

        <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(17,11,18,0.96),rgba(10,9,20,0.96))] p-6 sm:p-8">
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#ffb07c]">
            How Booking Works
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {proofPoints.map((point) => (
              <div
                key={point}
                className="rounded-[26px] border border-white/10 bg-[#0b1224] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.35)]"
              >
                <div className="flex items-start gap-3 text-sm font-bold leading-6 text-white">
                  <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#ffb07c]" />
                  <span>{point}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-5 max-w-3xl text-sm leading-6 text-white/70">
            Choose shared shuttle seats or a private ride, then complete booking online for your Red Rocks night.
          </p>
        </section>

        <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,13,24,0.98),rgba(6,9,18,0.98))] p-6 sm:p-8">
          <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
            <ShieldCheck className="h-4 w-4" />
            Before Show Night
          </div>
          <div className="mt-4 max-w-4xl space-y-4 text-sm leading-7 text-white/72">
            <p>
              Shared shuttle seats and private rides can be booked online.
            </p>
            <p>
              Pickup details are sent before show night, and your return ride is covered after the show.
            </p>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/book?venue=red-rocks-amphitheatre"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#ff5b2e] px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-[#ff7148]"
            >
              Book Red Rocks Shuttle
            </Link>
            <Link
              href="/about"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-white/6 px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-white/10"
            >
              About The Service
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
