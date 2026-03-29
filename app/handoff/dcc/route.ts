import { NextRequest, NextResponse } from "next/server";
import { buildBookingHref, type HandoffSearchParams, normalizeVenueSlug } from "@/lib/parrHandoff";

const TARGET_ALIASES = new Map<string, "book" | "venue" | "shared" | "private" | "shuttles">([
  ["book", "book"],
  ["venue", "venue"],
  ["landing", "venue"],
  ["shared", "shared"],
  ["shuttle", "shared"],
  ["shuttles", "shuttles"],
  ["private", "private"],
]);

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

function firstValue(searchParams: HandoffSearchParams, key: string) {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] : value;
}

export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  const searchParams = toHandoffSearchParams(request);
  const rawTarget =
    firstValue(searchParams, "target") ||
    firstValue(searchParams, "route") ||
    firstValue(searchParams, "intent") ||
    "venue";
  const target = TARGET_ALIASES.get(String(rawTarget).trim().toLowerCase()) || "venue";
  const venue = normalizeVenueSlug(firstValue(searchParams, "venue")) || "red-rocks-amphitheatre";

  const destination = buildBookingHref({
    target,
    venue,
    searchParams,
  });

  return NextResponse.redirect(new URL(destination, request.url), 307);
}
