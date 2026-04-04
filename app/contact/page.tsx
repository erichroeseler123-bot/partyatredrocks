import type { Metadata } from "next";
import Link from "next/link";
import { PARR_PUBLIC_FACTS } from "@/lib/publicOperatorFacts";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Party at Red Rocks for pickup questions, booking support, payment help, and ride-day updates.",
  alternates: { canonical: "/contact" },
  robots: { index: true, follow: true },
};

const support = PARR_PUBLIC_FACTS.support;
const smsHref = `sms:${support.phoneE164.replace(/^\+/, "")}?&body=${encodeURIComponent(support.smsLead)}`;
const whatsappHref = `https://wa.me/${support.phoneE164.replace(/^\+/, "")}?text=${encodeURIComponent(support.smsLead)}`;
const mailHref = `mailto:${support.email}`;

const supportTopics = [
  "pickup timing and meetup instructions",
  "booking changes or rider-count updates",
  "payment questions or confirmation issues",
  "return ride timing after the show",
] as const;

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#050816] px-4 pb-16 pt-24 text-white sm:px-6 lg:px-8">
      <section className="mx-auto max-w-[960px]">
        <div className="rounded-[32px] border border-white/10 bg-[#0b1224] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.42)] sm:p-10">
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">Support</div>
          <h1 className="mt-4 text-[2.4rem] font-black uppercase tracking-[-0.04em] text-white sm:text-[3.4rem]">
            Contact Party at Red Rocks
          </h1>
          <p className="mt-4 max-w-3xl text-[15px] leading-7 text-white/76">
            Questions about pickup, payment, your booking, or ride-day logistics? Reach out directly and we will point you to the fastest next step.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <Link
              href={smsHref}
              className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5 transition hover:bg-white/[0.08]"
            >
              <div className="text-[11px] font-black uppercase tracking-[0.2em] text-[#8fd0ff]">Fastest</div>
              <div className="mt-3 text-xl font-black uppercase tracking-[0.04em] text-white">Text Us</div>
              <div className="mt-2 text-[15px] leading-7 text-white/74">{support.phoneDisplay}</div>
            </Link>

            <Link
              href={mailHref}
              className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5 transition hover:bg-white/[0.08]"
            >
              <div className="text-[11px] font-black uppercase tracking-[0.2em] text-[#ffb07c]">Email</div>
              <div className="mt-3 text-xl font-black uppercase tracking-[0.04em] text-white">Send Email</div>
              <div className="mt-2 break-all text-[15px] leading-7 text-white/74">{support.email}</div>
            </Link>

            <Link
              href={whatsappHref}
              target="_blank"
              rel="noreferrer noopener"
              className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5 transition hover:bg-white/[0.08]"
            >
              <div className="text-[11px] font-black uppercase tracking-[0.2em] text-[#7ce1a7]">Alternate</div>
              <div className="mt-3 text-xl font-black uppercase tracking-[0.04em] text-white">WhatsApp</div>
              <div className="mt-2 text-[15px] leading-7 text-white/74">Open a direct support thread.</div>
            </Link>
          </div>

          <div className="mt-8 rounded-[24px] border border-white/10 bg-white/[0.04] px-5 py-4 text-sm leading-6 text-white/70">
            Best for: {supportTopics.join(", ")}. Include your show date and booking name if you already booked.
          </div>

          <div className="mt-10 flex flex-wrap gap-3 border-t border-white/10 pt-6 text-sm">
            <Link href="/book/red-rocks-amphitheatre/custom/shared" className="inline-flex items-center rounded-full border border-white/14 bg-white/[0.04] px-4 py-2 font-semibold text-white transition hover:bg-white/[0.08]">
              Booking Hub
            </Link>
            <Link href="/privacy" className="inline-flex items-center rounded-full border border-white/14 bg-white/[0.04] px-4 py-2 font-semibold text-white transition hover:bg-white/[0.08]">
              Privacy Policy
            </Link>
            <Link href="/terms" className="inline-flex items-center rounded-full border border-white/14 bg-white/[0.04] px-4 py-2 font-semibold text-white transition hover:bg-white/[0.08]">
              Terms of Service
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
