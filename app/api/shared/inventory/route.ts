import { NextResponse } from "next/server";
import { getSharedInventorySnapshot } from "@/lib/sharedInventory";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const venue = searchParams.get("venue") || "red-rocks-amphitheatre";
  const date = searchParams.get("date");
  const pickupHub = searchParams.get("pickupHub") === "golden" ? "golden" : "denver";

  if (!date) {
    return NextResponse.json({ error: "Missing date" }, { status: 400 });
  }

  const snapshot = await getSharedInventorySnapshot({
    venue,
    date,
    pickupHub,
  });

  return NextResponse.json(snapshot);
}
