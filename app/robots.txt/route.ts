import { NextResponse } from "next/server";

export const revalidate = 300;

export async function GET() {
  const body = `User-agent: *
Allow: /

Sitemap: https://www.partyatredrocks.com/sitemap.xml
`;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400",
    },
  });
}
