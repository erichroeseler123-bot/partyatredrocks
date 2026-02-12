// app/api/spotify-id/route.ts
import { getArtistId } from "@/lib/spotify";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const artist = searchParams.get('artist');
  if (!artist) return NextResponse.json({ error: 'Missing artist' }, { status: 400 });

  const id = await getArtistId(artist);
  return NextResponse.json({ id });
}
