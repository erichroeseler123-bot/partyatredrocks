import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const isPreview = process.env.VERCEL_ENV === "preview";

  const body = isPreview
    ? `User-agent: *
Disallow: /
`
    : `User-agent: *
Allow: /

Host: https://www.partyatredrocks.com
Sitemap: https://www.partyatredrocks.com/sitemap.xml
`;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": isPreview
        ? "private, no-store"
        : "public, s-maxage=300, stale-while-revalidate=86400",
      ...(isPreview ? { "X-Robots-Tag": "noindex, nofollow, noarchive" } : {}),
    },
  });
}
