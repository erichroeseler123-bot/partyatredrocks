import { NextResponse } from "next/server";
import {
  getPublicVehicleAvailability,
  MissingParrSecretError,
  MissingPrivateBlobTokenError,
  SOLD_OUT_TRAVELER_MESSAGE,
} from "@/lib/inventory/parrVehicleInventory";
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
  const showId = url.searchParams.get("show") || null;
  const qaSoldOutParam = (url.searchParams.get("qa_sold_out") || "").toLowerCase();

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ ok: false, error: "Invalid ISO date (YYYY-MM-DD)" }, { status: 400, headers: HEADERS });
  }

  try {
    // Summary mode for `ParrShowBookingSelector`: returns public-safe PARR inventory for both SUV and Van
    if (!vehicle) {
      const [suvPub, vanPub] = await Promise.all([
        getPublicVehicleAvailability({ dateKey: date, vehicleSlug: "suv", showId }),
        getPublicVehicleAvailability({ dateKey: date, vehicleSlug: "van", showId }),
      ]);
      const forceSuv = qaSoldOutParam === "suv" || qaSoldOutParam === "both" || qaSoldOutParam === "1";
      const forceVan = qaSoldOutParam === "van" || qaSoldOutParam === "both";

      return NextResponse.json(
        {
          ok: true,
          dateKey: date,
          vehicles: {
            suv: forceSuv
              ? { ...suvPub, available: false, soldOut: true, availableCount: 0, statusMessage: SOLD_OUT_TRAVELER_MESSAGE }
              : suvPub,
            van: forceVan
              ? { ...vanPub, available: false, soldOut: true, availableCount: 0, statusMessage: SOLD_OUT_TRAVELER_MESSAGE }
              : vanPub,
          },
        },
        { status: 200, headers: HEADERS }
      );
    }

    if (vehicle !== "suv" && vehicle !== "van") {
      return NextResponse.json({ ok: false, error: "Invalid vehicle option" }, { status: 400, headers: HEADERS });
    }

    const qaSoldOut =
      qaSoldOutParam === vehicle || qaSoldOutParam === "both" || qaSoldOutParam === "1";

    const result = await getParrRezdyAvailabilityForDate({
      vehicleSlug: vehicle,
      dateKey: date,
      showId,
      qaSoldOut,
    });
    return NextResponse.json(result, { status: 200, headers: HEADERS });
  } catch (err) {
    if (err instanceof MissingParrSecretError || err instanceof MissingPrivateBlobTokenError) {
      return NextResponse.json(
        { ok: false, code: err.code, error: err.message },
        { status: 503, headers: HEADERS }
      );
    }
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Availability lookup failed" },
      { status: 400, headers: HEADERS }
    );
  }
}
