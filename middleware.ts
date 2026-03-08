import { NextRequest, NextResponse } from "next/server";

function parseBasicAuth(header: string | null): { user: string; pass: string } | null {
  if (!header || !header.startsWith("Basic ")) return null;
  const encoded = header.slice("Basic ".length).trim();
  if (!encoded) return null;
  try {
    const decoded = atob(encoded);
    const separatorIndex = decoded.indexOf(":");
    if (separatorIndex < 0) return null;
    return {
      user: decoded.slice(0, separatorIndex),
      pass: decoded.slice(separatorIndex + 1),
    };
  } catch {
    return null;
  }
}

function isInternalOpsAuthorized(req: NextRequest): boolean {
  const expectedUser = process.env.INTERNAL_OPS_USER;
  const expectedPass = process.env.INTERNAL_OPS_PASS;
  if (!expectedUser || !expectedPass) return true;
  const auth = parseBasicAuth(req.headers.get("authorization"));
  return Boolean(auth && auth.user === expectedUser && auth.pass === expectedPass);
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isInternalOpsPath =
    pathname === "/internal/orders" || pathname.startsWith("/api/internal/orders/");
  if (isInternalOpsPath && !isInternalOpsAuthorized(req)) {
    const isApi = pathname.startsWith("/api/");
    if (isApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return new NextResponse("Authentication required", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Internal Ops", charset="UTF-8"' },
    });
  }

  // LEGACY_SHOW_NUMERIC_IDS
  // Old numeric /shows/{sourceId} links should land on a safe modern schedule page.
  if (pathname.startsWith("/shows/") && /^\/shows\/\d+\/?$/.test(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = "/red-rocks/concerts";
    url.search = "";
    return NextResponse.redirect(url, 308);
  }
  // END LEGACY_SHOW_NUMERIC_IDS

  // LEGACY_MISHAWAKA_CASE
  // Normalize /Mishawaka (and any casing) -> /mishawaka so it doesn't 404.
  if (pathname.toLowerCase() === "/mishawaka" && pathname !== "/mishawaka") {
    const url = req.nextUrl.clone();
    url.pathname = "/mishawaka";
    return NextResponse.redirect(url, 308);
  }
  // END LEGACY_MISHAWAKA_CASE

  // LEGACY_WIX_ROUTES
  // Old Wix blog posts should consolidate to /guide without tracking params.
  if (pathname.startsWith("/post/")) {
    const url = req.nextUrl.clone();
    url.pathname = "/guide";
    url.search = "";
    return NextResponse.redirect(url, 308);
  }

  const legacyRouteMap: Record<string, string> = {
    "/party-bus-to-red-rocks": "/party-bus",
    "/sprinter": "/private-van",
    "/mishawaka-private-transportation": "/venues/mishawaka-amphitheatre",
    "/general-7": "/",
    "/la-quinta-fairfield": "/guide/local/denver-pickups",
    "/upper-north": "/guide/local/denver-pickups",
    "/tubing": "/guide",
    "/hiking-at-red-rocks": "/guide",
  };

  const legacyDestination = legacyRouteMap[pathname];
  if (legacyDestination) {
    const url = req.nextUrl.clone();
    url.pathname = legacyDestination;
    url.search = "";
    return NextResponse.redirect(url, 308);
  }
  // END LEGACY_WIX_ROUTES

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
