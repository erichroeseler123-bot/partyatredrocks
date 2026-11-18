import type { Metadata } from "next";
import Link from "next/link";
import GbpPost from "@/app/components/GbpPost";
import { PARR_PUBLIC_FACTS } from "@/lib/publicOperatorFacts";
import { SUBURBAN_2027_USD, VAN_2027_USD } from "@/lib/pricing";

const SITE = "https://www.partyatredrocks.com";

export const metadata: Metadata = {
  title: "Red Rocks Venue Logistics & Rider Alerts | Party at Red Rocks",
  description:
    "Show-day bag rules, Upper North Lot arrival guidance, and Red Rocks rider advisories from Party at Red Rocks.",
  alternates: { canonical: `${SITE}/guide/updates` },
};

export default function UpdatesPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-24 text-white">
      <h1 className="mb-4 text-4xl font-black uppercase tracking-tight">Venue Logistics & Rider Advisories</h1>
      <p className="mb-10 text-lg text-strong">
        Practical Red Rocks concert-night advisories covering bag screening, weather prep, Upper North Lot tailgating, and 2027 private vehicle planning.
      </p>

      <div className="space-y-8">
        <GbpPost
          date="2027 Season Advisory"
          title="2027 Red Rocks Private Vehicle Reservations Open"
          content={`Private round-trip reservations are open for announced 2027 Red Rocks concerts: $${SUBURBAN_2027_USD} Private Suburban (up to 6) and $${VAN_2027_USD} Private Van (up to 10), including Upper North Lot tailgating setup and on-site driver wait.`}
          ctaLink="/red-rocks/concerts"
        />

        <GbpPost
          date="Security Screening Reminder"
          title="Single-Pocket Bag & Hydration Pack Enforcement"
          content="Red Rocks entry lanes strictly enforce the single-pocket rule on bags and hydration packs. Leave tailgate coolers, chairs, and extra layers locked inside your private Suburban or Van during the concert."
          ctaLink="/guide/logistics/bag-policy"
        />
      </div>

      <div className="mt-14 rounded-3xl border border-white/10 bg-surface-strong p-8 text-white">
        <h2 className="mb-2 text-xl font-bold text-white">Questions about your show night?</h2>
        <p className="mb-4 text-muted">
          Text dispatch at{" "}
          <a href={`sms:${PARR_PUBLIC_FACTS.support.phoneE164}`} className="font-bold text-[#ffb07c] underline">
            {PARR_PUBLIC_FACTS.support.phoneDisplay}
          </a>{" "}
          or{" "}
          <Link href="/book/red-rocks-amphitheatre/private" className="font-bold text-[#ffb07c] underline">
            compare private vehicles online
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
