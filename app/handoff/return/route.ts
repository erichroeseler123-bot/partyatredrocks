import { NextRequest, NextResponse } from "next/server";
import { getDccReturnHref, postDccSatelliteEvent } from "@/lib/dccSatellite";
import type { HandoffSearchParams } from "@/lib/parrHandoff";

function toHandoffSearchParams(request: NextRequest): HandoffSearchParams {
  const out: HandoffSearchParams = {};
  for (const [key, value] of Array.from(request.nextUrl.searchParams.entries())) {
    const existing = out[key];
    if (existing === undefined) {
      out[key] = value;
      continue;
    }
    if (Array.isArray(existing)) {
      existing.push(value);
      continue;
    }
    out[key] = [existing, value];
  }
  return out;
}

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const searchParams = toHandoffSearchParams(request);
  const validatedReturnHref = getDccReturnHref(searchParams);

  if (!validatedReturnHref) {
    return NextResponse.json(
      { ok: false, error: "Invalid or unapproved DCC return destination" },
      { status: 400 }
    );
  }

  await postDccSatelliteEvent({
    eventType: "traveler_returned",
    searchParams,
    sourcePath: "/handoff/return",
    status: "returned_to_dcc",
    stage: "return",
  }).catch(() => null);

  return NextResponse.redirect(validatedReturnHref, 307);
}
