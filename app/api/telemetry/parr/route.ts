import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { recordParrTelemetryEvent, type ParrStoredTelemetryEvent } from "@/lib/parrTelemetryStore";

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
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
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
