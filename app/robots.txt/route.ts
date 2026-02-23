import { NextResponse } from "next/server";

export const revalidate = 300;

export async function GET() {
  const body =
`User-agent: *
Allow: /

Sitemap: https://www.partyatredrocks.com/sitemap.xml
`;
  return new NextResponse(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=0, must-revalidate",
    },
  });
}
