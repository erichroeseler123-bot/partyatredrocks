import Image from "next/image";
import { getBookingVenueImage } from "@/data/media";
import { ParrShowBookingSelector } from "@/components/booking/ParrShowBookingSelector";
import {
  buildCanonicalRedRocksBookingCatalog,
  getCurrentDenverDateKey,
} from "@/lib/shows/redRocksBookingCatalog";

export default function QuickRedRocksPage() {
  const hero = getBookingVenueImage("red-rocks-amphitheatre");
  const todayDateKey = getCurrentDenverDateKey();
  const bookingCatalog = buildCanonicalRedRocksBookingCatalog(todayDateKey);

  return (
    <main className="min-h-screen bg-[#070b14] text-white">
      <section className="relative h-[280px] overflow-hidden border-b border-white/10 sm:h-[340px]">
        <Image src={hero.hero} alt={hero.heroAlt} fill priority className="object-cover object-center" sizes="100vw" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,11,20,0.45),rgba(7,11,20,0.94))]" />
        <div className="relative mx-auto flex h-full w-full max-w-[1100px] flex-col justify-end px-4 pb-8 sm:px-6 sm:pb-10 lg:px-8">
          <div className="inline-flex w-fit items-center rounded-full border border-white/14 bg-black/40 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#ffb07c]">
            Private Ride Booking
          </div>
          <h1 className="mt-3 max-w-4xl text-[1.9rem] font-black uppercase leading-[0.96] tracking-[-0.04em] sm:mt-4 sm:text-[3.1rem]">
            Book Your Private Red Rocks Ride
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-6 text-white/80 sm:text-[15px]">
            Start with your concert date or search by artist—then choose party size, private vehicle, and continue to availability.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[980px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <ParrShowBookingSelector
          catalog={bookingCatalog}
          todayDateKey={todayDateKey}
          entrySurface="/quick-red-rocks"
          mode="navigate"
        />
      </section>
    </main>
  );
}
