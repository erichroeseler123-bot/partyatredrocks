import Link from "next/link";
import { GuideVisualHero } from "@/components/guide/GuideVisualHero";
import { guideVisuals } from "@/lib/guideVisuals";

export default function BagPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <GuideVisualHero
        eyebrow={guideVisuals.policy.eyebrow}
        title={'Red Rocks Bag Policy 2026: The "Single-Pocket" Rule'}
        copy="Don't get turned away at the gate. Red Rocks has updated their security protocols, and multi-pocket hiking backpacks are banned for 2026."
        imageSrc={guideVisuals.policy.imageSrc}
        imageAlt={guideVisuals.policy.imageAlt}
        actions={
          <>
            <Link className="btn-primary" href="/book/red-rocks-amphitheatre/private/suv">
              View SUV Options
            </Link>
            <Link className="btn-ghost" href="/guide/policies">
              More Policies
            </Link>
          </>
        }
      />

      <div className="grid gap-8 mb-12 mt-12">
        <div className="border-l-4 border-green-500 pl-6">
          <h3 className="text-xl font-bold">What IS Allowed:</h3>
          <ul className="list-disc ml-5 text-strong">
            <li><strong>Single-pocket</strong> bags (13” x 15” x 8” or smaller)</li>
            <li>Small purses and fanny packs (6” x 9” or smaller)</li>
            <li>Hydration packs (2L or smaller, emptied, max 1 extra pocket)</li>
            <li>Food in 1-gallon clear plastic bags</li>
          </ul>
        </div>

        <div className="border-l-4 border-[#4cc9f0] pl-6">
          <h3 className="text-xl font-bold text-[#4cc9f0]">What IS NOT Allowed:</h3>
          <ul className="list-disc ml-5 text-strong">
            <li>Any bag with multiple pockets (backpacks, camelbaks with storage)</li>
            <li>Hard-sided coolers</li>
            <li>Umbrellas or Totems</li>
          </ul>
        </div>
      </div>

      <p className="bg-slate-100 p-6 rounded-2xl italic hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
        "All possessions must fit under your designated seat (18″ x 12″)." — 
        <a href="https://www.redrocksonline.com/plan-your-visit/permitted-prohibited-items/" target="_blank" className="underline font-bold">Official Red Rocks Rules</a>.
      </p>

      <div className="mt-12 rounded-2xl border border-[#3df3ff]/30 bg-[linear-gradient(180deg,rgba(61,243,255,0.18),rgba(29,191,211,0.16))] p-8 text-center text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
        <h2 className="text-white text-2xl mb-4">Need to store your "Prohibited" gear?</h2>
        <p className="mb-6 text-white/82">Our private SUV service allows you to keep your non-permitted items safely locked in the vehicle while you enjoy the show.</p>
        <Link href="/book/red-rocks-amphitheatre/private/suv" className="inline-flex rounded-full bg-[#3df3ff] px-8 py-3 font-bold text-[#08111e] no-underline">
          View SUV Options
        </Link>
      </div>
    </div>
  );
}
