export const runtime = "nodejs";

import { NextResponse } from "next/server";

type SeatGeekPerformer = {
  image?: string;
};

type SeatGeekResponse = {
  performers?: SeatGeekPerformer[];
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const artist = searchParams.get("artist");

  if (!artist) {
    return new NextResponse("Missing artist", { status: 400 });
  }

  const sgRes = await fetch(
    `https://api.seatgeek.com/2/performers?q=${encodeURIComponent(
      artist
    )}&client_id=${process.env.seatgeekclientid}`
  );

  if (!sgRes.ok) {
    return new NextResponse("SeatGeek error", { status: 502 });
  }

  const sgData = (await sgRes.json()) as SeatGeekResponse;

  const image = sgData.performers?.[0]?.image;

  if (image) {
    return NextResponse.json({ url: image });
  }

  return new NextResponse("Image not found", { status: 404 });
}
