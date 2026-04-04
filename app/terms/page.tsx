import type { Metadata } from "next";
import Link from "next/link";
import { PARR_PUBLIC_FACTS } from "@/lib/publicOperatorFacts";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service for Party at Red Rocks covering website use, bookings, payments, pickup coordination, cancellations, and liability limits.",
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
};

const sections = [
  {
    title: "Using The Site",
    points: [
      "By using this site or submitting a booking request, you agree to these Terms.",
      "You agree to provide accurate booking, contact, and trip information and to use the site only for lawful purposes.",
      "We may update these Terms from time to time by posting the revised version on this page.",
    ],
  },
  {
    title: "Bookings And Payments",
    points: [
      "A booking is not final until checkout, payment authorization, or direct operator confirmation is completed as required for that service.",
      "Pricing, vehicle availability, pickup windows, and ride formats may change before confirmation if inventory, route conditions, or operational constraints require it.",
      "Third-party processors or booking systems may handle parts of the transaction. Their own terms and policies may also apply.",
    ],
  },
  {
    title: "Pickup And Ride Expectations",
    points: [
      "Riders are responsible for arriving on time at the communicated pickup point and keeping a reachable phone number on file for ride-day updates.",
      "Pickup locations, boarding timing, and return instructions may be adjusted for weather, venue operations, traffic, safety, or other logistics.",
      "Missed pickups, no-shows, late arrivals, or failure to follow operational instructions may reduce or eliminate refund eligibility.",
    ],
  },
  {
    title: "Changes, Cancellations, And Refunds",
    points: [
      "Cancellation, change, and refund eligibility depend on the service booked, the timing of the request, payment status, and any stated product-specific terms shown during booking.",
      "If a booking flow, checkout page, or confirmation message shows a more specific cancellation policy, that more specific policy controls for that booking.",
      "Approved refunds may take additional time to post depending on the payment processor or financial institution.",
    ],
  },
  {
    title: "Content And Availability",
    points: [
      "We aim to keep the site accurate, but venue details, schedules, routing notes, and service descriptions may change or contain errors.",
      "Site access may be interrupted by maintenance, outages, third-party failures, or conditions outside our control.",
      "We may suspend or refuse service when necessary for safety, fraud prevention, operational integrity, or legal compliance.",
    ],
  },
  {
    title: "Liability Limits",
    points: [
      "To the fullest extent allowed by law, Party at Red Rocks is not liable for indirect, incidental, special, consequential, or punitive damages arising from site use, booking activity, or transportation coordination.",
      "Our total liability for any claim relating to a booking or site use will not exceed the amount paid to us for the specific service giving rise to the claim.",
      "Nothing in these Terms excludes liability that cannot be excluded under applicable law.",
    ],
  },
  {
    title: "Contact",
    points: [
      `Questions about these Terms can be sent to ${PARR_PUBLIC_FACTS.support.email} or ${PARR_PUBLIC_FACTS.support.phoneDisplay}.`,
      "Operational notices and booking confirmations sent to the contact information on your order are considered part of the service.",
    ],
  },
] as const;

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#050816] px-4 pb-16 pt-24 text-white sm:px-6 lg:px-8">
      <section className="mx-auto max-w-[960px]">
        <div className="rounded-[32px] border border-white/10 bg-[#0b1224] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.42)] sm:p-10">
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#ffb07c]">Legal</div>
          <h1 className="mt-4 text-[2.4rem] font-black uppercase tracking-[-0.04em] text-white sm:text-[3.4rem]">
            Terms of Service
          </h1>
          <p className="mt-4 max-w-3xl text-[15px] leading-7 text-white/76">
            These Terms govern use of Party at Red Rocks and related booking flows, including quote requests, shuttle reservations, private ride planning, and support communications.
          </p>
          <div className="mt-6 rounded-[24px] border border-white/10 bg-white/[0.04] px-5 py-4 text-sm leading-6 text-white/70">
            Effective date: April 2, 2026. If you do not agree with these Terms, do not use the site or complete a booking.
          </div>

          <div className="mt-8 space-y-8">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-xl font-black uppercase tracking-[0.04em] text-white">{section.title}</h2>
                <div className="mt-3 space-y-3 text-[15px] leading-7 text-white/74">
                  {section.points.map((point) => (
                    <p key={point}>{point}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-3 border-t border-white/10 pt-6 text-sm">
            <Link href="/privacy" className="inline-flex items-center rounded-full border border-white/14 bg-white/[0.04] px-4 py-2 font-semibold text-white transition hover:bg-white/[0.08]">
              Read Privacy Policy
            </Link>
            <Link href="/contact" className="inline-flex items-center rounded-full border border-white/14 bg-white/[0.04] px-4 py-2 font-semibold text-white transition hover:bg-white/[0.08]">
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
