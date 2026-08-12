import { NextResponse } from "next/server";
import { getRedRocksIntelligence } from "@/lib/red-rocks-intelligence";

export const dynamic = "force-dynamic";

export async function GET() {
  const intelligence = await getRedRocksIntelligence();

  return NextResponse.json(intelligence, {
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
