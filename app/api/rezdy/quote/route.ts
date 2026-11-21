import { NextResponse } from "next/server";
import {
  getParrRezdyStatelessQuote,
  isParrNativeApiEnabled,
  type ParrNativeVehicleSlug,
} from "@/lib/rezdy/parrNativeRezdyService";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HEADERS = {
  "Cache-Control": "no-store, max-age=0",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
};

export async function POST(request: Request) {
  if (!isParrNativeApiEnabled()) {
    return NextResponse.json({ ok: false, error: "Not Found" }, { status: 404, headers: HEADERS });
  }
  try {
    const body = (await request.json()) as {
      vehicleSlug?: ParrNativeVehicleSlug;
      startTimeLocal?: string;
      optionLabel?: string;
      vehicleQuantity?: number;
    };
    if (body.vehicleSlug !== "suv" && body.vehicleSlug !== "van") {
      return NextResponse.json({ ok: false, error: "Invalid vehicleSlug" }, { status: 400, headers: HEADERS });
    }
    if (!body.startTimeLocal || !body.optionLabel) {
      return NextResponse.json({ ok: false, error: "Missing startTimeLocal or optionLabel" }, { status: 400, headers: HEADERS });
    }
    const quote = await getParrRezdyStatelessQuote({
      vehicleSlug: body.vehicleSlug,
      startTimeLocal: body.startTimeLocal,
      optionLabel: body.optionLabel,
      vehicleQuantity: body.vehicleQuantity ?? 1,
    });
    return NextResponse.json(quote, { status: quote.ok ? 200 : 400, headers: HEADERS });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Quote calculation failed" },
      { status: 500, headers: HEADERS }
    );
  }
}
