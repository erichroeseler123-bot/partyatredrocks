import Link from "next/link";
import { GuideVisualHero } from "@/components/guide/GuideVisualHero";
import { guideVisuals } from "@/lib/guideVisuals";

const SHARED_HREF = "/book/red-rocks-amphitheatre/custom/shared";
const PRIVATE_HREF = "/book/red-rocks-amphitheatre/private";

export default function BagPolicy() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16 text-white">
      <GuideVisualHero
        eyebrow={guideVisuals.policy.eyebrow}
        title={'Red Rocks Bag Policy 2026: The "Single-Pocket" Rule'}
        copy="Do not get turned away at the gate. Then decide whether you want to carry the bag-risk yourself or book a ride plan that makes the night simpler."
        imageSrc={guideVisuals.policy.imageSrc}
        imageAlt={guideVisuals.policy.imageAlt}
        actions={
          <>
            <Link className="btn-primary" href={SHARED_HREF}>
              Book Shuttle Seats
            </Link>
            <Link className="btn-ghost" href={PRIVATE_HREF}>
              Book Private Ride
            </Link>
          </>
        }
      />

      <section className="mt-12 rounded-3xl border border-soft bg-surface-strong p-6 md:p-8">
        <p className="text-[11px] font-black uppercase tracking-[0.24em] text-muted">Decision Bridge</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight">Do not solve the bag problem and ignore the ride problem</h2>
        <p className="mt-3 max-w-3xl text-soft leading-relaxed">
          The bag policy is just one piece of show-night friction. If you want the lowest-stress night, decide your transport now too.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <article className="rounded-3xl border border-soft bg-surface p-6">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-cyan-300">Travel Light</p>
            <h3 className="mt-3 text-2xl font-black tracking-tight">$59 Shuttle Seats</h3>
            <p className="mt-3 text-soft leading-relaxed">Best if you just want to bring the permitted basics and keep the whole night simple.</p>
            <Link href={SHARED_HREF} className="btn-primary mt-6 inline-flex">
              Book Shuttle
            </Link>
          </article>
          <article className="rounded-3xl border border-soft bg-surface p-6">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-300">More Flexibility</p>
            <h3 className="mt-3 text-2xl font-black tracking-tight">Private SUV or Van</h3>
            <p className="mt-3 text-soft leading-relaxed">Best if your group wants one vehicle and a place to leave non-permitted extras locked up before the show.</p>
            <Link href={PRIVATE_HREF} className="btn-ghost mt-6 inline-flex">
              Book Private Ride
            </Link>
          </article>
        </div>
      </section>

      <div className="mt-12 grid gap-8">
        <div className="border-l-4 border-green-500 pl-6">
          <h3 className="text-xl font-bold">What IS Allowed:</h3>
          <ul className="ml-5 list-disc text-strong">
            <li><strong>Single-pocket</strong> bags (13” x 15” x 8” or smaller)</li>
            <li>Small purses and fanny packs (6” x 9” or smaller)</li>
            <li>Hydration packs (2L or smaller, emptied, max 1 extra pocket)</li>
            <li>Food in 1-gallon clear plastic bags</li>
          </ul>
        </div>

        <div className="border-l-4 border-[#4cc9f0] pl-6">
          <h3 className="text-xl font-bold text-[#4cc9f0]">What IS NOT Allowed:</h3>
          <ul className="ml-5 list-disc text-strong">
            <li>Any bag with multiple pockets (backpacks, camelbaks with storage)</li>
            <li>Hard-sided coolers</li>
            <li>Umbrellas or totems</li>
          </ul>
        </div>
      </div>

      <p className="mt-12 rounded-2xl bg-slate-100 p-6 italic text-slate-900 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
        "All possessions must fit under your designated seat (18″ x 12″)." —
        <a href="https://www.redrocksonline.com/plan-your-visit/permitted-prohibited-items/" target="_blank" className="ml-1 font-bold underline" rel="noreferrer">
          Official Red Rocks Rules
        </a>
      </p>

      <div className="mt-12 rounded-2xl border border-[#3df3ff]/30 bg-[linear-gradient(180deg,rgba(61,243,255,0.18),rgba(29,191,211,0.16))] p-8 text-center shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
        <h2 className="mb-4 text-2xl text-white">Need the cleanest show-night setup?</h2>
        <p className="mb-6 text-white/82">Travel light on the shuttle, or keep your group on one private vehicle and stop making the whole night depend on bag logistics and parking decisions.</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href={SHARED_HREF} className="inline-flex rounded-full bg-[#3df3ff] px-8 py-3 font-bold text-[#08111e] no-underline">
            Book Shuttle Seats
          </Link>
          <Link href={PRIVATE_HREF} className="inline-flex rounded-full border border-white/18 bg-white/8 px-8 py-3 font-bold text-white no-underline">
            Book Private Ride
          </Link>
        </div>
      </div>
    </main>
  );
}
