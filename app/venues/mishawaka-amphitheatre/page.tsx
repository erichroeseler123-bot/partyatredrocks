import Link from "next/link";
import { buildPageIntentMetadata } from "@/lib/pageIntentMetadata";
import { PARR_PUBLIC_FACTS } from "@/lib/publicOperatorFacts";

export const metadata = {
  ...buildPageIntentMetadata("/venues/mishawaka-amphitheatre"),
  title: "Mishawaka Transportation | Party at Red Rocks",
  description:
    "Mishawaka Amphitheatre transportation options, booking path, and direct support from Party at Red Rocks.",
};

export default function MishawakaPage() {
  const supportEmail = PARR_PUBLIC_FACTS.support.email;
  const supportPhone = PARR_PUBLIC_FACTS.support.phoneDisplay;
  const smsHref = `sms:${PARR_PUBLIC_FACTS.support.phoneE164}?&body=${encodeURIComponent(PARR_PUBLIC_FACTS.support.smsLead)}`;
  const bookingHref = "/book-all-venue?venue=mishawaka-amphitheatre";

  return (
    <main className="min-h-screen bg-[#050816] px-4 pb-14 pt-24 text-white sm:px-6 lg:px-8">
      <section className="mx-auto flex max-w-[1120px] flex-col gap-8">
        <section className="rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,16,32,0.98),rgba(6,9,18,0.96))] p-8 shadow-[0_40px_120px_rgba(0,0,0,0.45)] sm:p-10 lg:p-12">
          <div className="inline-flex items-center rounded-full border border-[#8fd0ff]/30 bg-[#8fd0ff]/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
            Mountain Venue Transportation
          </div>
          <h1 className="mt-5 max-w-4xl text-[2.5rem] font-black uppercase leading-[0.94] tracking-[-0.04em] sm:text-[4rem]">
            Mishawaka Amphitheatre Transportation
          </h1>
          <p className="mt-5 max-w-3xl text-[15px] leading-7 text-white/80 sm:text-lg">
            If you are looking for a Mishawaka shuttle or private ride, this is the right place. Mishawaka transportation is handled directly through Party at Red Rocks because mountain venue timing, routing, and pickup plans need direct confirmation before show night.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href={bookingHref} className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#62f6ff] px-6 text-sm font-black uppercase tracking-[0.16em] text-[#07111d] transition hover:bg-[#8cf8ff]">
              Start Mishawaka Booking Request
            </Link>
            <a href={smsHref} className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-white/6 px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-white/10">
              Text {supportPhone}
            </a>
            <a href={`mailto:${supportEmail}`} className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-white/6 px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-white/10">
              Email {supportEmail}
            </a>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          <article className="rounded-[28px] border border-white/10 bg-[#0b1224] p-6">
            <div className="text-[12px] font-black uppercase tracking-[0.22em] text-[#ffb07c]">Intent Check</div>
            <h2 className="mt-3 text-2xl font-black uppercase tracking-[-0.03em] text-white">Yes, this page is for booking transport</h2>
            <p className="mt-4 text-sm leading-7 text-white/74">
              Old Mishawaka social links and directory traffic should land on a page that confirms the transportation path immediately, not just a venue overview.
            </p>
          </article>
          <article className="rounded-[28px] border border-white/10 bg-[#0b1224] p-6">
            <div className="text-[12px] font-black uppercase tracking-[0.22em] text-[#ffb07c]">How It Works</div>
            <h2 className="mt-3 text-2xl font-black uppercase tracking-[-0.03em] text-white">Direct confirmation before the show</h2>
            <p className="mt-4 text-sm leading-7 text-white/74">
              Because Mishawaka is a mountain venue, we confirm availability, routing, timing, and the best vehicle plan directly instead of dropping you into a generic checkout that ignores the real logistics.
            </p>
          </article>
          <article className="rounded-[28px] border border-white/10 bg-[#0b1224] p-6">
            <div className="text-[12px] font-black uppercase tracking-[0.22em] text-[#ffb07c]">Next Step</div>
            <h2 className="mt-3 text-2xl font-black uppercase tracking-[-0.03em] text-white">Send the ride request now</h2>
            <p className="mt-4 text-sm leading-7 text-white/74">
              Start the booking request, then we line up the transport option that fits your show, timing, and group size.
            </p>
          </article>
        </section>

        <section id="private-transportation" className="rounded-[30px] border border-white/10 bg-[#0b1224] p-6 sm:p-8">
          <div className="text-[22px] font-black uppercase tracking-[0.18em] text-[#ffb07c] sm:text-[24px]">Transport Options</div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-[24px] border border-white/10 bg-black/15 p-5">
              <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#8fd0ff]">Shared or Group Ride</div>
              <p className="mt-3 text-sm leading-7 text-white/74">
                If show-night inventory supports it, we can place you into the cleanest shared or group routing option available for the date.
              </p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-black/15 p-5">
              <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#8fd0ff]">Private Vehicle</div>
              <p className="mt-3 text-sm leading-7 text-white/74">
                Best for groups who want one vehicle, one pickup plan, and one clear ride back without splitting the night across multiple cars.
              </p>
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href={bookingHref} className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#62f6ff] px-6 text-sm font-black uppercase tracking-[0.16em] text-[#07111d] transition hover:bg-[#8cf8ff]">
              Request Mishawaka Transportation
            </Link>
            <Link href="/venues" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-white/6 px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-white/10">
              View All Venues
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
