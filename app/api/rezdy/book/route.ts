import { NextResponse } from "next/server";
import {
  createParrRezdyBooking,
  isParrNativeApiEnabled,
  type CreateParrNativeBookingInput,
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
    const body = (await request.json()) as CreateParrNativeBookingInput;
    const res = await createParrRezdyBooking(body);
    return NextResponse.json(res, { status: res.httpStatus, headers: HEADERS });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        code: "INVALID_REQUEST",
        message: "Unable to process booking request. Please try again or use the classic booking widget.",
      },
      { status: 400, headers: HEADERS }
    );
  }
}
