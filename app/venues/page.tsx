import Link from "next/link";
import ServedVenueSections from "@/components/venues/ServedVenueSections";
import { curatedImages } from "@/lib/curatedImages";

export default function VenuesPage() {
  return (
    <main className="brand-page bg-[radial-gradient(circle_at_top,rgba(255,91,46,0.15),transparent_26%),radial-gradient(circle_at_18%_10%,rgba(59,130,246,0.14),transparent_18%),linear-gradient(180deg,#0b0b0f_0%,#0b0b0f_100%)] px-4 pb-14 pt-24 text-white sm:px-6 lg:px-8">
      <section className="mx-auto flex max-w-[1440px] flex-col gap-8">
        <section
          className="brand-panel relative min-h-[420px] overflow-hidden rounded-[32px] p-8 shadow-[0_40px_120px_rgba(0,0,0,0.45)] sm:min-h-[460px] sm:p-10 lg:min-h-[520px] lg:p-12"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.72)), linear-gradient(110deg, rgba(11,11,15,0.84) 0%, rgba(11,11,15,0.58) 40%, rgba(11,11,15,0.9) 100%), url(${curatedImages.venuesHero})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,91,46,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.14),transparent_28%)]" />
          <div className="relative max-w-3xl">
            <div className="inline-flex items-center rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[var(--brand-cyan)]">
              Venue guide
            </div>
            <h1 className="mt-5 text-[2.5rem] font-black uppercase leading-[0.94] tracking-[-0.04em] sm:text-[4rem] lg:text-[5rem]">
              Choose Your Venue
            </h1>
            <p className="mt-5 max-w-2xl text-[15px] leading-7 text-white/74 sm:text-lg">
              Browse the Colorado venues we cover, then open venue details or go straight into booking.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/book"
                className="brand-button-primary inline-flex min-h-12 items-center justify-center px-6 text-sm font-black uppercase tracking-[0.16em]"
              >
                Book a Ride
              </Link>
              <Link
                href="/week"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-white/6 px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-white/10"
              >
                Shows This Week
              </Link>
            </div>
          </div>
        </section>

        <ServedVenueSections mode="venues" />
      </section>
    </main>
  );
}
