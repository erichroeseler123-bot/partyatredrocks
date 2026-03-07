import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // LEGACY_MISHAWAKA_CASE
  // Normalize /Mishawaka (and any casing) -> /mishawaka so it doesn't 404.
  if (pathname.toLowerCase() === "/mishawaka" && pathname !== "/mishawaka") {
    const url = req.nextUrl.clone();
    url.pathname = "/mishawaka";
    return NextResponse.redirect(url, 308);
  }
  // END LEGACY_MISHAWAKA_CASE

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
