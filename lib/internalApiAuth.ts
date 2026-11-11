import crypto from "node:crypto";

const INTERNAL_OPS_COOKIE = "internal_ops_auth";

export function timingSafeSecretEqual(provided: string, expected: string): boolean {
  const providedBuf = Buffer.from(provided, "utf8");
  const expectedBuf = Buffer.from(expected, "utf8");
  if (providedBuf.length !== expectedBuf.length) {
    crypto.timingSafeEqual(expectedBuf, expectedBuf);
    return false;
  }
  return crypto.timingSafeEqual(providedBuf, expectedBuf);
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
    const decoded = Buffer.from(encoded, "base64").toString("utf8");
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

function readCookieValue(cookieHeader: string | null, cookieName: string): string | null {
  if (!cookieHeader) return null;
  for (const part of cookieHeader.split(";")) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex < 0) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    if (key === cookieName) {
      return decodeURIComponent(trimmed.slice(eqIndex + 1).trim());
    }
  }
  return null;
}

export function isParrSecretBearerAuthorized(request: Request): boolean {
  const parrSecret = process.env.PARR_SECRET?.trim() || "";
  if (!parrSecret) return false;
  const bearerToken = parseBearerToken(request.headers.get("authorization"));
  if (!bearerToken) return false;
  return timingSafeSecretEqual(bearerToken, parrSecret);
}

export function isInternalOrdersRequestAuthorized(request: Request): boolean {
  if (isParrSecretBearerAuthorized(request)) {
    return true;
  }

  const expectedUser = process.env.INTERNAL_OPS_USER?.trim() || "";
  const expectedPass = process.env.INTERNAL_OPS_PASS?.trim() || "";
  if (!expectedUser || !expectedPass) {
    return process.env.NODE_ENV === "development" && process.env.VERCEL !== "1";
  }

  const expectedEncoded = Buffer.from(`${expectedUser}:${expectedPass}`, "utf8").toString("base64");
  const cookieValue = readCookieValue(request.headers.get("cookie"), INTERNAL_OPS_COOKIE);
  if (cookieValue && timingSafeSecretEqual(cookieValue, expectedEncoded)) {
    return true;
  }

  const basic = parseBasicAuth(request.headers.get("authorization"));
  if (!basic) return false;
  const userMatches = timingSafeSecretEqual(basic.user, expectedUser);
  const passMatches = timingSafeSecretEqual(basic.pass, expectedPass);
  return userMatches && passMatches;
}

export function isOwnerSummaryRequestAuthorized(request: Request): boolean {
  const configuredSecrets = [
    process.env.DCC_INTERNAL_API_SECRET,
    process.env.DCC_PARR_WEBHOOK_TOKEN,
    process.env.PARR_SECRET,
  ]
    .map((value) => (typeof value === "string" ? value.trim() : ""))
    .filter((value) => value.length > 0);

  if (configuredSecrets.length === 0) {
    return false;
  }

  const headerSecret = request.headers.get("x-dcc-internal-secret")?.trim() || "";
  const bearerSecret = parseBearerToken(request.headers.get("authorization")) || "";
  const candidates = [headerSecret, bearerSecret].filter((value) => value.length > 0);
  if (candidates.length === 0) {
    return false;
  }

  let matched = false;
  for (const candidate of candidates) {
    for (const secret of configuredSecrets) {
      if (timingSafeSecretEqual(candidate, secret)) {
        matched = true;
      }
    }
  }
  return matched;
}
