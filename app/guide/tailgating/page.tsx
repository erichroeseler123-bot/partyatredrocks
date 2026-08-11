import Link from "next/link";
import { CarFront, ShieldCheck } from "lucide-react";
import { GuideLocalInfo } from "@/components/guide/GuideLocalInfo";
import { GuideVisualHero } from "@/components/guide/GuideVisualHero";
import { guideVisuals } from "@/lib/guideVisuals";

const PRIVATE_HREF = "/book/red-rocks-amphitheatre/private";

export const metadata = {
  title: "Red Rocks Tailgating Guide",
  description: "Tailgating strategy, parking reality, and the private transportation option that keeps the night cleaner for your group.",
  alternates: {
    canonical: "/guide/tailgating",
  },
};

const checklist = [
  "Arrive early enough to settle in and still make the walk to the gates without rushing.",
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
          copy="Tailgating can be part of the fun. A private ride gives your group one vehicle, one arrival plan, and one return plan for the full night."
          imageSrc={guideVisuals.tailgating.imageSrc}
          imageAlt={guideVisuals.tailgating.imageAlt}
          actions={
            <Link href={PRIVATE_HREF} className="btn-primary">
              Book Private Ride — $399 / $599
            </Link>
          }
        />

        <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,13,26,0.96),rgba(6,9,18,0.96))] p-6 sm:p-8">
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">Tailgate + Transportation</div>
          <h2 className="mt-3 text-2xl font-black uppercase tracking-[-0.03em] text-white sm:text-3xl">
            Keep the whole night on one vehicle plan
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/72">
            Party at Red Rocks currently offers private transportation only. Choose the $399 Suburban or $599 van when your group wants door-to-door pickup, time to enjoy the pre-show atmosphere, and the return ride handled after the concert.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <article className="rounded-[24px] border border-[#ffb07c]/24 bg-[#0b1224] p-5">
              <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#ffb07c]">Private Suburban</div>
              <h3 className="mt-3 text-2xl font-black uppercase tracking-[-0.03em] text-white">$399 Private Ride</h3>
              <p className="mt-3 text-sm leading-7 text-white/74">One vehicle, no shared passengers, and one plan from pickup through the ride home.</p>
              <Link href="/book/red-rocks-amphitheatre/private/suv" className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-[#3df3ff] px-5 text-sm font-black uppercase tracking-[0.16em] text-[#07111d]">
                Book Suburban
              </Link>
            </article>
            <article className="rounded-[24px] border border-white/10 bg-[#0b1224] p-5">
              <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#8fd0ff]">Private Van</div>
              <h3 className="mt-3 text-2xl font-black uppercase tracking-[-0.03em] text-white">$599 Van</h3>
              <p className="mt-3 text-sm leading-7 text-white/74">A larger private vehicle for groups that need more space while keeping the same single-vehicle night plan.</p>
              <Link href="/book/red-rocks-amphitheatre/private#van-upgrade" className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full border border-white/14 bg-white/6 px-5 text-sm font-black uppercase tracking-[0.16em] text-white">
                View Van Option
              </Link>
            </article>
          </div>
        </section>

        <GuideLocalInfo variant="tailgating" />

        <section className="grid gap-4 lg:grid-cols-2">
          <article className="rounded-[30px] border border-white/10 bg-[#0b1224] p-6 sm:p-8">
            <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">Before You Arrive</div>
            <div className="mt-4 space-y-4 text-sm leading-7 text-white/74">
              <p>Tailgating works best when you arrive early enough to settle in and still have time to head through the gates without rushing.</p>
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
          <h2 className="mt-3 text-2xl font-black uppercase tracking-[-0.03em] text-white sm:text-3xl">Built for groups that want to enjoy the pre-show without managing the drive home</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/72">Private rides use the Upper North limo lane and keep your group on one vehicle plan for arrival and return.</p>
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
            <Link href="/red-rocks/transportation" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-white/6 px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-white/10">
              Transportation Guide
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
