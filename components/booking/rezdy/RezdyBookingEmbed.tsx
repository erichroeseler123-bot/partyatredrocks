"use client";

import Script from "next/script";
import { useEffect } from "react";
import { trackParrEvent } from "@/lib/telemetry";

type RezdyBookingEmbedProps = {
  page: string;
  surface: string;
  title: string;
  subtitle: string;
  productId: string;
  productName: string;
  rezdyUrl: string;
  eventMeta?: Record<string, string>;
};

const TRACKING_QUERY_KEYS = [
  "source",
  "dcc_handoff_id",
  "handoff_id",
  "decision_corridor",
  "ref",
  "dcc",
  "utm_source",
  "utm_campaign",
] as const;

function readTrackingContext() {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);
  const context: Record<string, string> = {};
  for (const key of TRACKING_QUERY_KEYS) {
    const value = params.get(key);
    if (value) context[key] = value;
  }

  if (!context.handoff_id && context.dcc_handoff_id) {
    context.handoff_id = context.dcc_handoff_id;
  }

  return context;
}

export function RezdyBookingEmbed({
  page,
  surface,
  title,
  subtitle,
  productId,
  productName,
  rezdyUrl,
  eventMeta,
}: RezdyBookingEmbedProps) {
  useEffect(() => {
    const payload = {
      surface,
      page,
      ...readTrackingContext(),
      product_id: productId,
      product_name: productName,
      booking_provider: "rezdy",
      temporary_booking_path: true,
      ...eventMeta,
    };

    trackParrEvent("booking_opened", payload);
    trackParrEvent("rezdy_embed_viewed", payload);
  }, [eventMeta, page, productId, productName, surface]);

  return (
    <section className="rounded-[30px] border border-white/10 bg-[#0b1224] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.42)] sm:p-6">
      <Script
        src="https://gosnotransportation58.rezdy.com/pluginJs"
        strategy="afterInteractive"
      />
      <div className="mb-5 rounded-2xl border border-[#ffb07c]/20 bg-[#ffb07c]/10 p-4">
        <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#ffb07c]">
          Temporary Rezdy booking
        </div>
        <h2 className="mt-3 text-2xl font-black uppercase tracking-[-0.03em] text-white sm:text-3xl">
          {title}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-white/76 sm:text-[15px]">
          {subtitle}
        </p>
        <p className="mt-3 max-w-3xl text-xs leading-5 text-white/58">
          Native Party at Red Rocks booking, Square checkout, orders, and admin inventory are intentionally preserved for rollback.
        </p>
      </div>
      <div className="w-full min-w-0 overflow-hidden rounded-[22px] bg-white p-2">
        <iframe
          title={`${productName} Rezdy booking widget`}
          seamless
          width="100%"
          height="1000"
          frameBorder="0"
          className="rezdy block min-h-[1000px] w-full max-w-full border-0"
          src={rezdyUrl}
        />
      </div>
    </section>
  );
}
