import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  return NextResponse.json(
    {
      error: "Shared booking now requires hosted Square checkout. Use /api/shared/checkout instead.",
    },
    { status: 410 }
  );
}
