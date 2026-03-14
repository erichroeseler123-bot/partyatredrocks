import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { venueImage } from "@/lib/display";
import { VENUES } from "@/lib/venues";

export default function VenuesPage() {
  return (
    <main className="bg-[#050816] px-4 pb-14 pt-24 text-white sm:px-6 lg:px-8">
      <section className="mx-auto flex max-w-[1440px] flex-col gap-8">
        <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(9,15,31,0.96),rgba(7,11,25,0.96))] p-8 shadow-[0_40px_120px_rgba(0,0,0,0.45)] sm:p-10 lg:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,91,46,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(143,208,255,0.14),transparent_28%)]" />
          <div className="relative max-w-3xl">
            <div className="inline-flex items-center rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
              Venue Index
            </div>
            <h1 className="mt-5 text-[2.5rem] font-black uppercase leading-[0.94] tracking-[-0.04em] sm:text-[4rem] lg:text-[5rem]">
              Shuttle Destinations
            </h1>
            <p className="mt-5 max-w-2xl text-[15px] leading-7 text-white/74 sm:text-lg">
              Browse the venues we cover, jump into venue intel, and move straight to the right ride or show-night plan.
            </p>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {VENUES.map((v) => (
            <Link
              key={v.slug}
              href={`/venues/${v.slug}`}
              className="group relative overflow-hidden rounded-[26px] border border-white/10 bg-[#0b1224] p-7 shadow-[0_18px_60px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(0,0,0,0.42)]"
            >
              <img
                src={venueImage(v.slug)}
                alt={v.name}
                className="absolute inset-0 h-full w-full object-cover opacity-20 transition duration-500 group-hover:scale-105 group-hover:opacity-28"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,8,18,0.14),rgba(5,8,18,0.8)_78%,rgba(5,8,18,0.94)_100%)]" />
              <div className="relative z-10">
                <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
                  Venue Intel
                </div>
                <h2 className="mt-3 text-2xl font-black uppercase tracking-[-0.03em] text-white">
                  {v.name}
                </h2>
                <div className="mt-5 inline-flex items-center text-sm font-bold text-white/88">
                  View shuttles & shows <ArrowRight className="ml-1 h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </section>
      </section>
    </main>
  );
}
