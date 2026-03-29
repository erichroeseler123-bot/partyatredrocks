import Link from "next/link";
import { CarFront, ShieldCheck } from "lucide-react";
import { GuideLocalInfo } from "@/components/guide/GuideLocalInfo";
import { GuideVisualHero } from "@/components/guide/GuideVisualHero";
import { guideVisuals } from "@/lib/guideVisuals";

const SHARED_HREF = "/book/red-rocks-amphitheatre/custom/shared";
const PRIVATE_HREF = "/book/red-rocks-amphitheatre/private";

export const metadata = {
  title: "Red Rocks Tailgating Guide",
  description: "Tailgating strategy, parking reality, and the transport choice that keeps the night cleaner for your group.",
  alternates: {
    canonical: "/guide/tailgating",
  },
};

const checklist = [
  "Arrive early enough to park, unload, and still make the walk in without rushing.",
  "Keep food and drinks simple and easy to pack back into the vehicle.",
  "Bring layers, water, and lighting for the walk back after the show.",
  "Set one regroup point before everyone heads toward the gates.",
];

const privateBenefits = [
  "Upper North limo-lane access for easier arrival",
  "Better fit for groups that want to tailgate before the show",
  "One vehicle for the full night",
  "Pickup details sent before your ride",
  "Return ride covered after the show",
];

export default function TailgatingGuidePage() {
  return (
    <main className="bg-[#050816] px-4 pb-14 pt-24 text-white sm:px-6 lg:px-8">
      <section className="mx-auto flex max-w-[1440px] flex-col gap-8">
        <GuideVisualHero
          eyebrow={guideVisuals.tailgating.eyebrow}
          title="Red Rocks Tailgating Guide"
          copy="Tailgating can be part of the fun, but the transport choice decides whether the night feels easy or exhausting."
          imageSrc={guideVisuals.tailgating.imageSrc}
          imageAlt={guideVisuals.tailgating.imageAlt}
          actions={
            <>
              <Link href={PRIVATE_HREF} className="btn-primary">
                Book Private Ride
              </Link>
              <Link href={SHARED_HREF} className="btn-ghost">
                Book Shuttle Instead
              </Link>
            </>
          }
        />

        <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,13,26,0.96),rgba(6,9,18,0.96))] p-6 sm:p-8">
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">Decision Bridge</div>
          <h2 className="mt-3 text-2xl font-black uppercase tracking-[-0.03em] text-white sm:text-3xl">
            Decide how much parking-lot work you want in your night
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/72">
            If your group wants to tailgate, private transportation is usually the cleanest fit. If you do not care about tailgating and just want a simple ride, the shuttle is the easier move.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <article className="rounded-[24px] border border-[#ffb07c]/24 bg-[#0b1224] p-5">
              <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#ffb07c]">Best For Tailgating</div>
              <h3 className="mt-3 text-2xl font-black uppercase tracking-[-0.03em] text-white">Private SUV or Van</h3>
              <p className="mt-3 text-sm leading-7 text-white/74">One vehicle, one plan, and a return ride already handled after the show.</p>
              <Link href={PRIVATE_HREF} className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-[#3df3ff] px-5 text-sm font-black uppercase tracking-[0.16em] text-[#07111d]">
                Book Private Service
              </Link>
            </article>
            <article className="rounded-[24px] border border-white/10 bg-[#0b1224] p-5">
              <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#8fd0ff]">Best For Simplicity</div>
              <h3 className="mt-3 text-2xl font-black uppercase tracking-[-0.03em] text-white">$59 Shuttle Seats</h3>
              <p className="mt-3 text-sm leading-7 text-white/74">If you are skipping the tailgate, fixed-price shuttle seats are the simplest way to get in and out.</p>
              <Link href={SHARED_HREF} className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full border border-white/14 bg-white/6 px-5 text-sm font-black uppercase tracking-[0.16em] text-white">
                Book Shuttle Seats
              </Link>
            </article>
          </div>
        </section>

        <GuideLocalInfo variant="tailgating" />

        <section className="grid gap-4 lg:grid-cols-2">
          <article className="rounded-[30px] border border-white/10 bg-[#0b1224] p-6 sm:p-8">
            <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">Before You Arrive</div>
            <div className="mt-4 space-y-4 text-sm leading-7 text-white/74">
              <p>Tailgating works best when you arrive early enough to park, settle in, and still have time to head through the gates without rushing.</p>
              <p>The biggest mistake is building the whole night around parking-lot optimism and then scrambling after the show. Pick the transport plan before you load the cooler.</p>
            </div>
          </article>

          <article className="rounded-[30px] border border-white/10 bg-[#0b1224] p-6 sm:p-8">
            <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#ffb07c]">Tailgating Checklist</div>
            <ul className="mt-4 space-y-3">
              {checklist.map((item) => (
                <li key={item} className="text-sm leading-7 text-white/74">{item}</li>
              ))}
            </ul>
          </article>
        </section>

        <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,13,26,0.96),rgba(6,9,18,0.96))] p-6 sm:p-8">
          <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#ffb07c]">
            <CarFront className="h-4 w-4" />
            Private Ride Benefits
          </div>
          <h2 className="mt-3 text-2xl font-black uppercase tracking-[-0.03em] text-white sm:text-3xl">Best for groups that want to tailgate before the show</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/72">Private rides use the Upper North limo lane and are the best fit for groups that want easier arrival, time to tailgate, and one vehicle for the full night.</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {privateBenefits.map((item) => (
              <div key={item} className="rounded-[24px] border border-white/10 bg-[#0b1224] p-5">
                <div className="flex items-start gap-3 text-sm font-bold leading-6 text-white">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#ffb07c]" />
                  <span>{item}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href={PRIVATE_HREF} className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#3df3ff] px-6 text-sm font-black uppercase tracking-[0.16em] text-[#07111d] transition hover:bg-[#62f6ff]">
              Book Private Service
            </Link>
            <Link href="/red-rocks/transportation/private-vs-shared" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-white/6 px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-white/10">
              Private vs Shared
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
