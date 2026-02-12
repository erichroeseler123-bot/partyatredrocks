import { list, del } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function GET() {
  const { blobs } = await list({ prefix: 'guides/' });
  const now = new Date();

  for (const blob of blobs) {
    // Fetch the file to check its showDate
    const res = await fetch(blob.url);
    const data = await res.json();
    
    if (new Date(data.showDate) < now) {
      await del(blob.url); // Delete if the show is over
    }
  }

  return NextResponse.json({ status: "Cleanup Complete" });
}
