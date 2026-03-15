import Link from "next/link";
import { ArrowRight, Bus, CarFront, Clock3, Headphones } from "lucide-react";

export const metadata = {
  title: "About Party at Red Rocks",
  description:
    "Party at Red Rocks provides shared shuttle seats and private rides for Red Rocks concerts, with Denver pickup points and return rides after the show.",
  alternates: {
    canonical: "/about",
  },
};

const servicePoints = [
  {
    title: "Shared shuttle seats",
    copy: "Round-trip shuttle seats for riders heading to Red Rocks from Denver pickup points.",
    icon: Bus,
  },
  {
    title: "Private rides for groups",
    copy: "SUVs, vans, and larger private options for groups that want one vehicle for the night.",
    icon: CarFront,
  },
  {
    title: "Show-night timing",
    copy: "Pickup details are sent before the show, and drivers handle the return ride after the encore.",
    icon: Clock3,
  },
  {
    title: "Text support",
    copy: "If you need help on show night, support is available by text or phone.",
    icon: Headphones,
  },
];

const rideTypes = [
  {
    title: "Shared Shuttle",
    copy: "Best for most riders who want a set pickup, a set return, and a straightforward online booking path.",
    href: "/book/red-rocks-amphitheatre/shared",
    cta: "Book Shared Seats",
  },
  {
    title: "Private Ride",
    copy: "Best for groups that want one vehicle, one driver, and one plan for the full night.",
    href: "/book/red-rocks-amphitheatre/private",
    cta: "Book Private Ride",
  },
];

export default function AboutPage() {
  return (
    <main className="bg-[#050816] px-4 pb-14 pt-24 text-white sm:px-6 lg:px-8">
      <section className="mx-auto flex max-w-[1440px] flex-col gap-8">
        <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(9,15,31,0.96),rgba(7,11,25,0.96))] p-8 shadow-[0_40px_120px_rgba(0,0,0,0.45)] sm:p-10 lg:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,91,46,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(143,208,255,0.14),transparent_28%)]" />
          <div className="relative max-w-3xl">
            <div className="inline-flex items-center rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
              About Party at Red Rocks
            </div>
            <h1 className="mt-5 text-[2.5rem] font-black uppercase leading-[0.94] tracking-[-0.04em] sm:text-[4rem] lg:text-[5rem]">
              Red Rocks rides for show night
            </h1>
            <p className="mt-5 max-w-2xl text-[15px] leading-7 text-white/74 sm:text-lg">
              Party at Red Rocks provides shared shuttle seats and private transportation for concerts at Red Rocks Amphitheatre.
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/68 sm:text-[15px]">
              Shared seats leave from Denver pickup points and return after the show. Private SUVs and vans are available for groups who want one ride for the full night.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/book"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#ff5b2e] px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-[#ff7148]"
              >
                Start Booking
              </Link>
              <Link
                href="/shuttles"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-white/6 px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-white/10"
              >
                View Ride Options
              </Link>
            </div>
          </div>
        </section>

        <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,13,26,0.96),rgba(6,9,18,0.96))] p-6 sm:p-8">
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
            Show-Night Transportation
          </div>
          <h2 className="mt-2 text-2xl font-black uppercase tracking-[-0.03em] sm:text-3xl">
            Simple ride options for Red Rocks
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {servicePoints.map((point) => {
              const Icon = point.icon;
              return (
                <article
                  key={point.title}
                  className="rounded-[26px] border border-white/10 bg-[#0b1224] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)]"
                >
                  <Icon className="h-5 w-5 text-[#ffb07c]" />
                  <h3 className="mt-4 text-xl font-black uppercase tracking-[-0.03em] text-white">{point.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/70">{point.copy}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(17,11,18,0.96),rgba(10,9,20,0.96))] p-6 sm:p-8">
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#ffb07c]">
            How riders use it
          </div>
          <div className="mt-4 max-w-4xl space-y-4 text-sm leading-7 text-white/72">
            <p>
              Some riders book shared seats and travel with other concertgoers.
            </p>
            <p>
              Others book a private SUV or van so their group stays together from pickup through the ride home.
            </p>
            <p>
              Pickup details are sent before show night, and drivers handle the return ride after the concert.
            </p>
          </div>
        </section>

        <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,13,24,0.98),rgba(6,9,18,0.98))] p-6 sm:p-8">
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
            Ride Types
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {rideTypes.map((ride) => (
              <article
                key={ride.title}
                className="rounded-[26px] border border-white/10 bg-[#0b1224] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)]"
              >
                <h3 className="text-2xl font-black uppercase tracking-[-0.03em] text-white">{ride.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/70">{ride.copy}</p>
                <Link
                  href={ride.href}
                  className="mt-5 inline-flex items-center text-sm font-bold text-[#ffb07c]"
                >
                  {ride.cta}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,13,26,0.96),rgba(6,9,18,0.96))] p-6 sm:p-8">
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
            The goal
          </div>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/72">
            Make getting to and from Red Rocks easier on show night.
          </p>
        </section>
      </section>
    </main>
  );
}
