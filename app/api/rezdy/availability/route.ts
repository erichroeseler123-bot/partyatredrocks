import { NextResponse } from "next/server";
import {
  getParrRezdyAvailabilityForDate,
  isPreviewOrDevEnvironment,
  type ParrNativeVehicleSlug,
} from "@/lib/rezdy/parrNativeRezdyService";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HEADERS = {
  "Cache-Control": "no-store, max-age=0",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
};

export async function GET(request: Request) {
  if (!isPreviewOrDevEnvironment()) {
    return NextResponse.json({ ok: false, error: "Not Found" }, { status: 404, headers: HEADERS });
  }
  const url = new URL(request.url);
  const vehicle = url.searchParams.get("vehicle") as ParrNativeVehicleSlug | null;
  const date = url.searchParams.get("date") || "";
  if (vehicle !== "suv" && vehicle !== "van") {
    return NextResponse.json({ ok: false, error: "Invalid vehicle option" }, { status: 400, headers: HEADERS });
  }
  try {
    const result = await getParrRezdyAvailabilityForDate({ vehicleSlug: vehicle, dateKey: date });
    return NextResponse.json(result, { status: 200, headers: HEADERS });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Availability lookup failed" },
      { status: 400, headers: HEADERS }
    );
  }
}
