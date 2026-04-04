import type { Metadata } from "next";
import Link from "next/link";
import { PARR_PUBLIC_FACTS } from "@/lib/publicOperatorFacts";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for Party at Red Rocks covering booking information, pickup coordination, and support communications.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

const sections = [
  {
    title: "What We Collect",
    points: [
      "We collect the information you provide during booking or support, including name, phone number, email address, rider count, venue, date, pickup preference, and special requests.",
      "If you complete a payment or checkout flow, we may receive payment-related confirmation details from our payment and booking providers, but we do not store full credit card numbers on this website.",
      "We may also collect basic usage and device data such as IP address, browser type, referral source, and page activity to keep the site working and understand booking demand.",
    ],
  },
  {
    title: "How We Use Information",
    points: [
      "We use your information to run bookings, confirm pickup details, send support messages, coordinate schedule changes, and deliver post-booking updates.",
      "We use contact details to answer questions, send booking confirmations, and provide ride-day communication such as pickup reminders, return timing, or issue resolution.",
      "We may use limited analytics and operational data to improve site performance, reduce booking friction, and protect against abuse or fraud.",
    ],
  },
  {
    title: "Who We Share It With",
    points: [
      "We share information with service providers that help us operate the business, such as payment processors, booking platforms, hosting providers, messaging tools, and support systems.",
      "We may share only the information needed for transportation fulfillment, pickup logistics, customer support, fraud prevention, or legal compliance.",
      "We do not sell your personal information for third-party advertising.",
    ],
  },
  {
    title: "Booking And Pickup Details",
    points: [
      "Pickup and rider notes may be used by our team and transportation partners to coordinate the ride you booked.",
      "If you submit special timing, meetup, accessibility, or group coordination requests, that information may be included in the operational record for your trip.",
      "Please avoid sending unnecessary sensitive information through booking notes or text support.",
    ],
  },
  {
    title: "Retention And Security",
    points: [
      "We keep information for as long as reasonably needed to operate bookings, maintain records, resolve disputes, prevent fraud, and meet tax or legal obligations.",
      "We use commercially reasonable safeguards, but no internet transmission or storage system is completely secure.",
      "If you believe your information was submitted in error or need help with an account-specific request, contact us using the details below.",
    ],
  },
  {
    title: "Your Choices",
    points: [
      "You can contact us to request updates or deletion of certain information, subject to operational, legal, and recordkeeping requirements.",
      "You may opt out of marketing messages, but transactional or service messages related to an active booking may still be sent when necessary.",
      "Colorado, California, and other privacy rights requests can be submitted by email or text using the contact information on this page.",
    ],
  },
] as const;

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#050816] px-4 pb-16 pt-24 text-white sm:px-6 lg:px-8">
      <section className="mx-auto max-w-[960px]">
        <div className="rounded-[32px] border border-white/10 bg-[#0b1224] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.42)] sm:p-10">
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">Legal</div>
          <h1 className="mt-4 text-[2.4rem] font-black uppercase tracking-[-0.04em] text-white sm:text-[3.4rem]">
            Privacy Policy
          </h1>
          <p className="mt-4 max-w-3xl text-[15px] leading-7 text-white/76">
            This Privacy Policy applies to Party at Red Rocks. It explains how we collect, use, and share information when you use this site, request transportation, or communicate with support.
          </p>
          <div className="mt-6 rounded-[24px] border border-white/10 bg-white/[0.04] px-5 py-4 text-sm leading-6 text-white/70">
            Effective date: April 2, 2026. Questions can be sent to {PARR_PUBLIC_FACTS.support.email} or {PARR_PUBLIC_FACTS.support.phoneDisplay}.
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
            <Link href="/terms" className="inline-flex items-center rounded-full border border-white/14 bg-white/[0.04] px-4 py-2 font-semibold text-white transition hover:bg-white/[0.08]">
              Read Terms
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
