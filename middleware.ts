import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ Never override cache headers for these (they manage their own caching)
  if (
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // Your existing behavior for “normal pages”
  const res = NextResponse.next();
  res.headers.set("Cache-Control", "public, max-age=0, must-revalidate");
  return res;
}

// Apply middleware to everything (we still early-return above)
export const config = {
  matcher: "/:path*",
};
