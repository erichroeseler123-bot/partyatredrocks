"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Search } from "lucide-react";
import { lookupVerifiedBookingAction } from "@/app/booking/actions";
import { PARR_PUBLIC_FACTS } from "@/lib/publicOperatorFacts";

export default function BookingOrderLookup() {
  const router = useRouter();
  const [reference, setReference] = useState("");
  const [contact, setContact] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resolvedPath, setResolvedPath] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setResolvedPath(null);

    try {
      const result = await lookupVerifiedBookingAction({
        reference,
        contact,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setResolvedPath(result.bookingPath);
      router.push(result.bookingPath);
    } catch {
      setError(
        `Unable to look up your booking right now. Please try again or text ${PARR_PUBLIC_FACTS.support.phoneDisplay}.`,
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section
      aria-labelledby="booking-order-lookup-heading"
      className="bg-white rounded-[2rem] shadow-xl border border-slate-200 p-6 sm:p-8 mb-8"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-600">
            Self-Service Trip Hub
          </div>
          <h2
            id="booking-order-lookup-heading"
            className="mt-1 text-2xl sm:text-3xl font-black uppercase italic tracking-tighter text-slate-900"
          >
            Find Your Existing Booking
          </h2>
          <p className="mt-2 text-sm text-slate-600 max-w-2xl">
            Already booked your ride? Enter your confirmation code and the email or phone number used
            at checkout to view pickup details, balance status, or update your rider notes.
          </p>
        </div>
        <a
          href={`sms:${PARR_PUBLIC_FACTS.support.phoneE164}`}
          className="text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-blue-600 transition-colors"
        >
          Need help? Text {PARR_PUBLIC_FACTS.support.phoneDisplay}
        </a>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 sm:grid-cols-12">
        <div className="sm:col-span-5">
          <label
            htmlFor="booking-lookup-reference"
            className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2"
          >
            Booking Reference or Token
          </label>
          <input
            id="booking-lookup-reference"
            name="reference"
            type="text"
            autoComplete="off"
            required
            value={reference}
            onChange={(event) => {
              setReference(event.target.value);
              if (error) setError(null);
            }}
            placeholder="e.g. RZD-123456 or ord_..."
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="sm:col-span-5">
          <label
            htmlFor="booking-lookup-contact"
            className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2"
          >
            Checkout Email or Phone
          </label>
          <input
            id="booking-lookup-contact"
            name="contact"
            type="text"
            autoComplete="email"
            required
            value={contact}
            onChange={(event) => {
              setContact(event.target.value);
              if (error) setError(null);
            }}
            placeholder="you@example.com or 720-555-0199"
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="sm:col-span-2 flex items-end">
          <button
            type="submit"
            disabled={submitting}
            className="w-full min-h-[46px] rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white px-4 py-3 font-black uppercase text-xs tracking-wider flex items-center justify-center gap-2 transition-colors"
          >
            <Search className="w-4 h-4" />
            {submitting ? "Checking..." : "Find Ride"}
          </button>
        </div>
      </form>

      {error ? (
        <div
          role="alert"
          className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
        >
          {error}
        </div>
      ) : null}

      {resolvedPath ? (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-950 flex flex-wrap items-center justify-between gap-3">
          <span>Booking verified. Opening your trip hub...</span>
          <Link
            href={resolvedPath}
            className="inline-flex items-center gap-1 font-black uppercase text-xs tracking-wider text-emerald-800 underline"
          >
            Open Booking Hub <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : null}
    </section>
  );
}
