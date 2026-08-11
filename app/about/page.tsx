import Link from "next/link";
import { ArrowRight, CarFront, Clock3, Headphones, ShieldCheck } from "lucide-react";
import { curatedImages } from "@/lib/curatedImages";

export const metadata = {
  title: "About Party at Red Rocks",
  description:
    "Party at Red Rocks provides private transportation for Red Rocks concerts, with direct pickup planning and a return plan after the show.",
  alternates: {
    canonical: "/about",
  },
};

const servicePoints = [
  {
    title: "Private service only",
    copy: "Your group gets its own vehicle rather than sharing a ride with unrelated passengers.",
    icon: ShieldCheck,
  },
  {
    title: "Private vehicles for groups",
    copy: "Choose from private vehicle options based on your group size and show-night plan.",
    icon: CarFront,
  },
  {
    title: "Show-night timing",
    copy: "Pickup details are confirmed before the show, with the return plan already built into your ride.",
    icon: Clock3,
  },
  {
    title: "Text support",
    copy: "If you need help with your ride, support is available by text or phone.",
    icon: Headphones,
  },
];

export default function AboutPage() {
  return (
    <main className="brand-page bg-[radial-gradient(circle_at_top,rgba(255,91,46,0.15),transparent_26%),radial-gradient(circle_at_18%_10%,rgba(59,130,246,0.14),transparent_18%),linear-gradient(180deg,#0b0b0f_0%,#0b0b0f_100%)] px-4 pb-14 pt-24 text-white sm:px-6 lg:px-8">
      <section className="mx-auto flex max-w-[1440px] flex-col gap-8">
        <section
          className="brand-panel relative min-h-[420px] overflow-hidden rounded-[32px] p-8 shadow-[0_40px_120px_rgba(0,0,0,0.45)] sm:min-h-[460px] sm:p-10 lg:min-h-[520px] lg:p-12"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.72)), linear-gradient(110deg, rgba(11,11,15,0.84) 0%, rgba(11,11,15,0.58) 40%, rgba(11,11,15,0.9) 100%), url(${curatedImages.aboutHero})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,91,46,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.14),transparent_28%)]" />
          <div className="relative max-w-3xl">
            <div className="inline-flex items-center rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[var(--brand-cyan)]">
              About Party at Red Rocks
            </div>
            <h1 className="mt-5 text-[2.5rem] font-black uppercase leading-[0.94] tracking-[-0.04em] sm:text-[4rem] lg:text-[5rem]">
              Private Red Rocks rides for show night
            </h1>
            <p className="mt-5 max-w-2xl text-[15px] leading-7 text-white/74 sm:text-lg">
              Party at Red Rocks provides private transportation for groups heading to concerts at Red Rocks Amphitheatre.
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/68 sm:text-[15px]">
              Your group keeps one vehicle and one ride plan from pickup through the post-show return.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/book/red-rocks-amphitheatre/private"
                className="brand-button-primary inline-flex min-h-12 items-center justify-center px-6 text-sm font-black uppercase tracking-[0.16em]"
              >
                View Private Vehicles
              </Link>
              <Link
                href="/shuttles"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-white/6 px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-white/10"
              >
                Transportation Details
              </Link>
            </div>
          </div>
        </section>

        <section className="brand-panel rounded-[30px] p-6 sm:p-8">
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[var(--brand-cyan)]">
            Show-Night Transportation
          </div>
          <h2 className="mt-2 text-2xl font-black uppercase tracking-[-0.03em] sm:text-3xl">
            One private ride plan for your group
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {servicePoints.map((point) => {
              const Icon = point.icon;
              return (
                <article key={point.title} className="brand-card rounded-[26px] p-6">
                  <Icon className="h-5 w-5 text-[var(--brand-orange)]" />
                  <h3 className="mt-4 text-xl font-black uppercase tracking-[-0.03em] text-white">{point.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/70">{point.copy}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="brand-card rounded-[30px] p-6 sm:p-8">
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[var(--brand-orange)]">
            How riders use it
          </div>
          <div className="mt-4 max-w-4xl space-y-4 text-sm leading-7 text-white/72">
            <p>
              Choose the private vehicle that fits your group and complete the booking online.
            </p>
            <p>
              Pickup details are confirmed before show night so everyone knows the plan before the concert.
            </p>
            <p>
              After the show, your return ride is part of the same private transportation plan.
            </p>
          </div>
        </section>

        <section className="brand-panel rounded-[30px] p-6 sm:p-8">
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[var(--brand-cyan)]">
            Current Service
          </div>
          <article className="brand-card mt-6 rounded-[26px] p-6">
            <h3 className="text-2xl font-black uppercase tracking-[-0.03em] text-white">Private Transportation</h3>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/70">
              Party at Red Rocks currently offers private transportation only. Your group does not share the vehicle with unrelated riders.
            </p>
            <Link
              href="/book/red-rocks-amphitheatre/private"
              className="brand-link mt-5 inline-flex items-center text-sm font-bold"
            >
              View Private Vehicles
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </article>
        </section>

        <section className="brand-panel rounded-[30px] p-6 sm:p-8">
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[var(--brand-cyan)]">
            The goal
          </div>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/72">
            Make getting to and from Red Rocks easier by giving your group one clear private transportation plan for the night.
          </p>
        </section>
      </section>
    </main>
  );
}
