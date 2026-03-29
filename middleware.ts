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

  // LEGACY_MISHAWAKA_AND_PICKUP_LINKS
  // Old social/directory links should land on the current venue or pickup pages.
  if (pathname.toLowerCase() === "/mishawaka") {
    const url = req.nextUrl.clone();
    url.pathname = "/venues/mishawaka-amphitheatre";
    url.hash = "private-transportation";
    url.search = "";
    return NextResponse.redirect(url, 308);
  }

  if (pathname.toLowerCase() === "/downtown") {
    const url = req.nextUrl.clone();
    url.pathname = "/guide/local/denver-pickups";
    url.hash = "downtown-pickup";
    url.search = "";
    return NextResponse.redirect(url, 308);
  }
  // END LEGACY_MISHAWAKA_AND_PICKUP_LINKS

  // LEGACY_WIX_ROUTES
  // Old Wix blog posts should consolidate to the best matching modern guide, not just the generic hub.
  if (pathname.startsWith("/post/")) {
    const slug = pathname.slice("/post/".length).toLowerCase();
    const url = req.nextUrl.clone();

    if (slug.includes("pickup") || slug.includes("sheraton") || slug.includes("downtown")) {
      url.pathname = "/guide/local/denver-pickups";
      url.hash = "downtown-pickup";
    } else if (slug.includes("bag") || slug.includes("policy") || slug.includes("prohibited") || slug.includes("backpack")) {
      url.pathname = "/guide/logistics/bag-policy";
    } else if (slug.includes("parking") || slug.includes("lot")) {
      url.pathname = "/guide/parking";
    } else if (slug.includes("tailgate") || slug.includes("pregame") || slug.includes("pre-game")) {
      url.pathname = "/guide/tailgating";
    } else if (slug.includes("private") && slug.includes("shared")) {
      url.pathname = "/red-rocks/transportation/private-vs-shared";
    } else if (slug.includes("worth-it") || slug.includes("worthit")) {
      url.pathname = "/red-rocks/transportation/is-shuttle-worth-it";
    } else if (slug.includes("uber") || slug.includes("rideshare")) {
      url.pathname = "/red-rocks/transportation/shuttle-vs-uber";
    } else if (slug.includes("drive") || slug.includes("driving")) {
      url.pathname = "/red-rocks/transportation/shuttle-vs-driving";
    } else if (slug.includes("leave") || slug.includes("exit") || slug.includes("encore") || slug.includes("ride-home") || slug.includes("ridehome")) {
      url.pathname = "/red-rocks/post-concert-transportation";
    } else if (slug.includes("post-encore") || slug.includes("pickup-plan") || slug.includes("post-show") || slug.includes("after-show")) {
      url.pathname = "/guide/show-night-strategy/post-show-pickup-plan";
    } else if (slug.includes("when-to-leave") || slug.includes("what-time") || slug.includes("when-to-arrive") || slug.includes("arrive") || slug.includes("timing")) {
      url.pathname = "/guide/show-night-strategy";
    } else if (slug.includes("what-to-bring") || slug.includes("bring") || slug.includes("pack") || slug.includes("wear") || slug.includes("what-to-wear") || slug.includes("cold") || slug.includes("snow") || slug.includes("rain") || slug.includes("weather")) {
      url.pathname = "/red-rocks/what-to-wear";
    } else if (slug.includes("concert") || slug.includes("red-rocks-guide") || slug.includes("show-guide") || slug.includes("first-time")) {
      url.pathname = "/red-rocks/concert-guide";
    } else {
      url.pathname = "/guide";
    }

    url.search = "";
    return NextResponse.redirect(url, 308);
  }

  const legacyRouteMap: Record<string, { pathname: string; hash?: string }> = {
    "/party-bus-to-red-rocks": { pathname: "/party-bus" },
    "/sprinter": { pathname: "/private-van" },
    "/mishawaka-private-transportation": { pathname: "/venues/mishawaka-amphitheatre", hash: "private-transportation" },
    "/general-7": { pathname: "/" },
    "/la-quinta-fairfield": { pathname: "/guide/local/denver-pickups", hash: "hotel-pickup" },
    "/upper-north": { pathname: "/guide/local/denver-pickups", hash: "private-pickup" },
    "/tubing": { pathname: "/guide" },
    "/hiking-at-red-rocks": { pathname: "/guide" },
    "/guide/post-encore-strategy": { pathname: "/guide/show-night-strategy/post-show-pickup-plan" },
    "/guide/bag-policy-2026": { pathname: "/guide/logistics/bag-policy" },
    "/guide/sheraton-pickup": { pathname: "/guide/local/denver-pickups", hash: "downtown-pickup" },
    "/concert-guide": { pathname: "/red-rocks/concert-guide" },
    "/red-rocks-concert-guide": { pathname: "/red-rocks/concert-guide" },
  };

  const legacyDestination = legacyRouteMap[pathname];
  if (legacyDestination) {
    const url = req.nextUrl.clone();
    url.pathname = legacyDestination.pathname;
    url.hash = legacyDestination.hash || "";
    url.search = "";
    return NextResponse.redirect(url, 308);
  }
  // END LEGACY_WIX_ROUTES

  // Never override cache headers for these (they manage their own caching)
  if (
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const res = NextResponse.next();
  res.headers.set("Cache-Control", "public, max-age=0, must-revalidate");
  return res;
}

export const config = {
  matcher: "/:path*",
};
