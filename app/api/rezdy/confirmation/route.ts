import { NextResponse } from "next/server";
import {
  getParrRezdyBookingConfirmation,
  isPreviewOrDevEnvironment,
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
  const orderNumber = url.searchParams.get("orderNumber") || "";
  const ref = url.searchParams.get("ref") || "";
  const sig = url.searchParams.get("sig") || "";

  try {
    const res = await getParrRezdyBookingConfirmation({
      orderNumber,
      resellerReference: ref,
      sig,
    });
    return NextResponse.json(res, { status: res.httpStatus, headers: HEADERS });
  } catch {
    return NextResponse.json(
      { ok: false, code: "LOOKUP_FAILED", message: "Unable to load reservation details right now." },
      { status: 502, headers: HEADERS }
    );
  }
}
