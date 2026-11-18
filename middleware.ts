import { NextRequest, NextResponse } from "next/server";
import { lookupLegacyStaticRedirect } from "./lib/legacyRedirects";

const INTERNAL_OPS_COOKIE = "internal_ops_auth";
const PARR_TRIP_CTX_COOKIE = "parr_trip_ctx";
const DCC_CTX_TOKEN_PATTERN = /^dcc_ctx_[A-Za-z0-9_-]{6,128}$/;
const FORBIDDEN_URL_PII_PARAMS = [
  "name",
  "fullname",
  "first_name",
  "last_name",
  "passengername",
  "email",
  "phone",
  "weight",
  "weights",
  "passengerweight",
  "passengerweightlbs",
  "maxpassengerweightlbs",
  "accessibility",
  "mobilitynotes",
  "medicalnotes",
  "bookingref",
  "bookingreference",
  "confirmationnumber",
  "cabin",
  "cabinnumber",
  "stateroom",
  "stateroomnumber",
  "privatenotes",
  "internalnotes",
];

function applyPreviewRobotsHeader(res: NextResponse): NextResponse {
  if (process.env.VERCEL_ENV === "preview") {
    res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  }
  return res;
}

function constantTimeEqual(actual: string, expected: string): boolean {
  const encoder = new TextEncoder();
  const actualBytes = encoder.encode(actual);
  const expectedBytes = encoder.encode(expected);
  const length = Math.max(actualBytes.length, expectedBytes.length);
  let diff = actualBytes.length ^ expectedBytes.length;
  for (let i = 0; i < length; i += 1) {
    diff |= (actualBytes[i] ?? 0) ^ (expectedBytes[i] ?? 0);
  }
  return diff === 0;
}

function parseBearerToken(header: string | null): string | null {
  if (!header) return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) return null;
  const token = match[1].trim();
  return token || null;
}

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

type InternalOpsAuthResult = {
  authorized: boolean;
  method: "bearer" | "cookie" | "basic" | "local_dev" | "none";
};

function evaluateInternalOpsAuth(req: NextRequest): InternalOpsAuthResult {
  const pathname = req.nextUrl.pathname;
  const isInternalApiPath =
    pathname === "/api/internal" || pathname.startsWith("/api/internal/");

  if (isInternalApiPath) {
    const parrSecret = process.env.PARR_SECRET?.trim() || "";
    const bearerToken = parseBearerToken(req.headers.get("authorization"));
    if (parrSecret && bearerToken && constantTimeEqual(bearerToken, parrSecret)) {
      return { authorized: true, method: "bearer" };
    }
  }

  const expectedUser = process.env.INTERNAL_OPS_USER?.trim() || "";
  const expectedPass = process.env.INTERNAL_OPS_PASS?.trim() || "";
  if (!expectedUser || !expectedPass) {
    if (process.env.NODE_ENV === "development" && process.env.VERCEL !== "1") {
      return { authorized: true, method: "local_dev" };
    }
    return { authorized: false, method: "none" };
  }

  const expectedEncoded = btoa(`${expectedUser}:${expectedPass}`);
  const cookieValue = req.cookies.get(INTERNAL_OPS_COOKIE)?.value || "";
  if (cookieValue && constantTimeEqual(cookieValue, expectedEncoded)) {
    return { authorized: true, method: "cookie" };
  }

  const auth = parseBasicAuth(req.headers.get("authorization"));
  if (auth) {
    const userMatches = constantTimeEqual(auth.user, expectedUser);
    const passMatches = constantTimeEqual(auth.pass, expectedPass);
    if (userMatches && passMatches) {
      return { authorized: true, method: "basic" };
    }
  }

  return { authorized: false, method: "none" };
}

export function isInternalOpsAuthorized(req: NextRequest): boolean {
  return evaluateInternalOpsAuth(req).authorized;
}

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  if (
    !pathname.startsWith("/_next/") &&
    !pathname.startsWith("/api/") &&
    pathname !== "/.well-known/dcc-site"
  ) {
    const rawCtx = searchParams.get("ctx") || searchParams.get("context_id");
    const validCtx = rawCtx && DCC_CTX_TOKEN_PATTERN.test(rawCtx.trim()) ? rawCtx.trim() : null;
    const hasCtxParam = searchParams.has("ctx") || searchParams.has("context_id");
    let hasForbiddenPii = false;
    for (const key of Array.from(searchParams.keys())) {
      if (FORBIDDEN_URL_PII_PARAMS.includes(key.toLowerCase())) {
        hasForbiddenPii = true;
        break;
      }
    }

    if (hasCtxParam || hasForbiddenPii) {
      const cleanUrl = req.nextUrl.clone();
      cleanUrl.searchParams.delete("ctx");
      cleanUrl.searchParams.delete("context_id");
      for (const key of Array.from(cleanUrl.searchParams.keys())) {
        if (FORBIDDEN_URL_PII_PARAMS.includes(key.toLowerCase())) {
          cleanUrl.searchParams.delete(key);
        }
      }
      const redirectRes = NextResponse.redirect(cleanUrl, 302);
      if (validCtx) {
        redirectRes.cookies.set(PARR_TRIP_CTX_COOKIE, validCtx, {
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        });
      }
      return applyPreviewRobotsHeader(redirectRes);
    }
  }

  const isInternalOpsPath =
    pathname === "/internal/orders" ||
    pathname.startsWith("/internal/orders/") ||
    pathname === "/admin/parr-inventory" ||
    pathname.startsWith("/admin/parr-inventory/") ||
    pathname === "/admin/friend-fleet-inventory" ||
    pathname.startsWith("/admin/friend-fleet-inventory/") ||
    pathname === "/api/internal/orders" ||
    pathname.startsWith("/api/internal/orders/");
  const opsAuth = isInternalOpsPath ? evaluateInternalOpsAuth(req) : null;
  if (isInternalOpsPath && !opsAuth?.authorized) {
    const isApi = pathname.startsWith("/api/");
    if (isApi) {
      return applyPreviewRobotsHeader(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
    }
    return applyPreviewRobotsHeader(
      new NextResponse("Authentication required", {
        status: 401,
        headers: { "WWW-Authenticate": 'Basic realm="Internal Ops", charset="UTF-8"' },
      })
    );
  }

  if (isInternalOpsPath && opsAuth?.method === "basic") {
    const expectedUser = process.env.INTERNAL_OPS_USER?.trim() || "";
    const expectedPass = process.env.INTERNAL_OPS_PASS?.trim() || "";
    if (expectedUser && expectedPass) {
      const expectedEncoded = btoa(`${expectedUser}:${expectedPass}`);
      const currentCookie = req.cookies.get(INTERNAL_OPS_COOKIE)?.value;
      if (currentCookie !== expectedEncoded) {
        const res = NextResponse.next();
        res.cookies.set(INTERNAL_OPS_COOKIE, expectedEncoded, {
          httpOnly: true,
          sameSite: "lax",
          secure: true,
          path: "/",
          maxAge: 60 * 60 * 8,
        });
        res.headers.set("Cache-Control", "private, no-store");
        return applyPreviewRobotsHeader(res);
      }
    }
  }

  // 1stBank Center (Broomfield, CO) permanently closed Nov 2023 & demolished 2024:
  // Preserve /venues/1stbank-center at HTTP 200 as a truthful historical closure page;
  // serve HTTP 410 Gone on empty schedule/subpages and /book/1stbank-center (0 GSC/Ahrefs/backlinks).
  const lowerPath = pathname.toLowerCase().replace(/\/+$/, "") || "/";
  if (
    lowerPath.startsWith("/venues/1stbank-center/") ||
    lowerPath === "/book/1stbank-center"
  ) {
    const goneHtml = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><meta name="robots" content="noindex, nofollow"/><title>1stBank Center Permanently Closed (410 Gone) | Party at Red Rocks</title><style>body{margin:0;font-family:system-ui,-apple-system,sans-serif;background:#070b14;color:#f8fafc;display:flex;min-height:100vh;align-items:center;justify-content:center;padding:24px}main{max-width:600px;background:#0d1424;border:1px solid rgba(255,255,255,.12);border-radius:24px;padding:32px}h1{margin:0 0 12px;font-size:1.75rem}p{line-height:1.6;color:rgba(248,250,252,.8)}a{color:#ffb07c;font-weight:700}</style></head><body><main><p style="text-transform:uppercase;letter-spacing:.16em;font-size:11px;color:#ffb07c;font-weight:800;margin:0 0 8px">HTTP 410 · Permanently Removed</p><h1>1stBank Center Schedule &amp; Subpages Retired</h1><p>1stBank Center in Broomfield, Colorado permanently closed in November 2023 and was demolished in 2024. No concerts or shuttle services operate for this venue.</p><p><a href="/venues/1stbank-center">Read the 1stBank Center closure note →</a> &nbsp;|&nbsp; <a href="/red-rocks/concerts">2027 Red Rocks Concerts →</a> &nbsp;|&nbsp; <a href="/venues">Active Colorado Venues →</a></p></main></body></html>`;
    const goneRes = new NextResponse(goneHtml, {
      status: 410,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
    return applyPreviewRobotsHeader(goneRes);
  }

  // Collapsed single-hop permanent redirect for /find preserving all legitimate query/attribution params
  if (pathname === "/find" || pathname === "/find/") {
    const url = req.nextUrl.clone();
    url.pathname = "/book/red-rocks-amphitheatre/private";
    if (
      url.searchParams.get("venue") &&
      ["redrocks", "red-rocks", "red-rocks-amphitheater", "red-rocks-amphitheatre"].includes(
        String(url.searchParams.get("venue")).trim().toLowerCase()
      )
    ) {
      url.searchParams.delete("venue");
    }
    return applyPreviewRobotsHeader(NextResponse.redirect(url, 308));
  }

  // LEGACY_SHOW_NUMERIC_IDS
  if (pathname.startsWith("/shows/") && /^\/shows\/\d+\/?$/.test(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = "/red-rocks/concerts";
    url.search = "";
    return applyPreviewRobotsHeader(NextResponse.redirect(url, 308));
  }

  // LEGACY_MISHAWAKA_AND_PICKUP_LINKS
  if (pathname.toLowerCase() === "/mishawaka") {
    const url = req.nextUrl.clone();
    url.pathname = "/venues/mishawaka-amphitheatre";
    url.hash = "private-transportation";
    url.search = "";
    return applyPreviewRobotsHeader(NextResponse.redirect(url, 308));
  }

  if (pathname.toLowerCase() === "/downtown") {
    const url = req.nextUrl.clone();
    url.pathname = "/guide/local/denver-pickups";
    url.hash = "downtown-pickup";
    url.search = "";
    return applyPreviewRobotsHeader(NextResponse.redirect(url, 308));
  }

  // LEGACY_WIX_ROUTES
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
    return applyPreviewRobotsHeader(NextResponse.redirect(url, 308));
  }

  const legacyDestination = lookupLegacyStaticRedirect(pathname);
  if (legacyDestination) {
    const url = req.nextUrl.clone();
    url.pathname = legacyDestination.pathname;
    url.hash = legacyDestination.hash || "";
    url.search = "";
    return applyPreviewRobotsHeader(NextResponse.redirect(url, 308));
  }

  // Never override cache headers for self-managed machine/asset routes
  if (
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/llms.txt" ||
    pathname === "/agent.json" ||
    pathname === "/.well-known/dcc-site" ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/fonts/") ||
    pathname.startsWith("/images/") ||
    pathname === "/favicon.ico"
  ) {
    return applyPreviewRobotsHeader(NextResponse.next());
  }

  const res = NextResponse.next();
  if (
    isInternalOpsPath ||
    pathname.startsWith("/booking/") ||
    pathname.startsWith("/pay-balance/") ||
    pathname.startsWith("/manager/")
  ) {
    res.headers.set("Cache-Control", "private, no-store");
  }
  return applyPreviewRobotsHeader(res);
}

export const config = {
  matcher: "/:path*",
};
