import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { recordParrTelemetryEvent, type ParrStoredTelemetryEvent } from "@/lib/parrTelemetryStore";
import {
  deriveParrOutcomeLogicalEventId,
  emitParrVerifiedBookingOutcomeAfterResponse,
  flushParrAnalyticsAfterTasksForTest,
  isParrAnalyticsDisabled,
  resolveParrDccCollectEndpoint,
  resolveParrInternalCollectorSecret,
  scheduleParrAnalyticsAfter,
} from "@/lib/analyticsV2Server";

export const runtime = "nodejs";

const VALID_EVENTS = new Set<ParrStoredTelemetryEvent["name"]>([
  "page_viewed",
  "handoff_viewed",
  "shortlist_rendered",
  "product_opened",
  "checkout_started",
  "booking_opened",
  "rezdy_embed_viewed",
  "navigation_clicked",
  "decision_cta_clicked",
  "booking_confirmed",
  "booking_completed",
]);

export async function POST(request: Request) {
  if (isParrAnalyticsDisabled()) {
    return NextResponse.json(
      { ok: true, accepted: false, reason: "site_analytics_disabled" },
      { status: 202, headers: { "Cache-Control": "no-store" } },
    );
  }

  let rawText = "";
  let body: Record<string, unknown>;
  try {
    rawText = await request.text();
    if (!rawText || rawText.length > 32_768) {
      return NextResponse.json(
        { error: "Invalid or oversized body" },
        { status: rawText.length > 32_768 ? 413 : 400 },
      );
    }
    body = JSON.parse(rawText) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (body.mode === "synthetic_booking_outcome_probe") {
    if (process.env.VERCEL_ENV === "production") {
      return NextResponse.json(
        { ok: false, error: "synthetic_probe_forbidden_in_production" },
        { status: 403 },
      );
    }
    const expectedSecret = resolveParrInternalCollectorSecret();
    const providedSecret = request.headers.get("x-dcc-internal-secret")?.trim() || "";
    if (!expectedSecret || !providedSecret || providedSecret !== expectedSecret) {
      return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
    }
    const internalOrderId =
      typeof body.internalOrderId === "string" && body.internalOrderId.trim()
        ? body.internalOrderId.trim().slice(0, 96)
        : "QA-PARR-PREVIEW-SYNTH-01";
    const outcomeType = body.outcomeType === "cancelled" ? "cancelled" : "confirmed_paid";
    const logicalEventId = deriveParrOutcomeLogicalEventId(internalOrderId, outcomeType);

    // Zero real charges, bookings, cancellations, or refunds — exercises server emitter only
    emitParrVerifiedBookingOutcomeAfterResponse({
      internalOrderId,
      outcomeType,
      grossAmountUsd: typeof body.grossAmountUsd === "number" ? body.grossAmountUsd : 449,
      dccHandoffId:
        typeof body.handoffId === "string" ? body.handoffId : "qa_parr_preview_handoff",
      productCode: "parr-private-suburban",
      isTest: true,
    });
    await flushParrAnalyticsAfterTasksForTest();

    return NextResponse.json(
      {
        ok: true,
        accepted: true,
        mode: "synthetic_booking_outcome_probe",
        logicalEventId,
        zeroRealChargesOrBookings: true,
        forwardedTo: resolveParrDccCollectEndpoint() ? "dcc_v2_collect" : "preview_local_sink",
      },
      { status: 202, headers: { "Cache-Control": "no-store" } },
    );
  }

  // Forward v2 batched envelopes asynchronously via Next.js after() without adding new app/ route files
  if (Array.isArray(body.events)) {
    const endpoint = resolveParrDccCollectEndpoint();
    const ua = request.headers.get("user-agent") || "";
    const lang = request.headers.get("accept-language") || "";
    const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || "";
    const isQa =
      request.headers.get("x-qa-test") === "1" ||
      request.headers.get("x-dcc-synthetic-verification") === "1";

    if (endpoint && body.events.length > 0) {
      scheduleParrAnalyticsAfter(async () => {
        await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(ua ? { "User-Agent": ua } : {}),
            ...(lang ? { "Accept-Language": lang } : {}),
            ...(host ? { "x-forwarded-host": host } : {}),
            ...(isQa ? { "x-qa-test": "1" } : {}),
          },
          body: rawText,
          cache: "no-store",
          signal:
            typeof AbortSignal !== "undefined" && "timeout" in AbortSignal
              ? AbortSignal.timeout(1200)
              : undefined,
        }).catch(() => undefined);
      });
    }

    return NextResponse.json(
      {
        ok: true,
        accepted: true,
        batchSize: body.events.length,
        forwardedTo: endpoint ? "dcc_v2_collect" : "preview_local_sink",
      },
      { status: 202, headers: { "Cache-Control": "no-store" } },
    );
  }

  const name = typeof body.name === "string" ? body.name : "";
  const sessionId = typeof body.session_id === "string" ? body.session_id.trim() : "";
  const page = typeof body.page === "string" ? body.page.trim() : "";
  if (!VALID_EVENTS.has(name as ParrStoredTelemetryEvent["name"])) {
    return NextResponse.json({ error: "Invalid event name" }, { status: 400 });
  }
  if (!sessionId || !page) {
    return NextResponse.json({ error: "Missing session_id or page" }, { status: 400 });
  }

  const props =
    body.props && typeof body.props === "object" ? (body.props as Record<string, unknown>) : {};
  const createdAt = typeof body.created_at === "string" ? body.created_at : new Date().toISOString();
  const handoffId =
    typeof body.handoff_id === "string"
      ? body.handoff_id
      : typeof props.handoff_id === "string"
        ? props.handoff_id
        : null;

  await recordParrTelemetryEvent({
    id: typeof body.id === "string" && body.id.trim() ? body.id : randomUUID(),
    name: name as ParrStoredTelemetryEvent["name"],
    createdAt,
    sessionId,
    page,
    handoffId,
    props,
  });

  return NextResponse.json({ ok: true });
}
