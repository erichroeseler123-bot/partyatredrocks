import Link from "next/link";
import { PARR_PUBLIC_FACTS } from "@/lib/publicOperatorFacts";
import { buildPageIntentMetadata } from "@/lib/pageIntentMetadata";

export const metadata = {
  ...buildPageIntentMetadata("/venues/mishawaka-amphitheatre"),
  title: "Mishawaka Shuttle | Party at Red Rocks",
  description:
    "Plan Mishawaka Amphitheatre transportation with Party at Red Rocks. Contact us for current ride options and availability.",
};

export default function MishawakaPage() {
  const supportEmail = PARR_PUBLIC_FACTS.support.email;
  const supportPhone = PARR_PUBLIC_FACTS.support.phoneDisplay;

  return (
    <main className="min-h-screen bg-[#050816] px-4 pb-14 pt-24 text-white sm:px-6 lg:px-8">
      <section className="mx-auto flex max-w-[1240px] flex-col gap-8">
        <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,16,32,0.98),rgba(6,9,18,0.96))] p-8 shadow-[0_40px_120px_rgba(0,0,0,0.45)] sm:p-10 lg:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,176,124,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(143,208,255,0.14),transparent_28%)]" />
          <div className="relative max-w-3xl">
            <div className="inline-flex items-center rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
              Mountain Venue Shuttle
            </div>
            <h1 className="mt-5 text-[2.5rem] font-black uppercase leading-[0.94] tracking-[-0.04em] sm:text-[4rem] lg:text-[5rem]">
              Mishawaka Amphitheatre
            </h1>
            <p className="mt-5 max-w-2xl text-[15px] leading-7 text-white/74 sm:text-lg">
              Mishawaka transportation is handled directly through Party at Red Rocks. Contact us for current ride options, pricing, and show-night availability.
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/68 sm:text-[15px]">
              Mountain venue timing can shift fast, so we confirm the ride plan directly before show night.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href={`mailto:${supportEmail}`}
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#3df3ff] px-6 text-sm font-black uppercase tracking-[0.16em] text-[#07111d] transition hover:bg-[#62f6ff]"
              >
                Email {supportEmail}
              </a>
              <a
                href={`sms:${PARR_PUBLIC_FACTS.support.phoneE164}?&body=${encodeURIComponent(PARR_PUBLIC_FACTS.support.smsLead)}`}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-white/6 px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-white/10"
              >
                Text {supportPhone}
              </a>
              <Link
                href="/venues"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-white/6 px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-white/10"
              >
                View All Venues
              </Link>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
