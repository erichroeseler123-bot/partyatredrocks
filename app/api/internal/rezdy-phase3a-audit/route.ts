import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { isOwnerSummaryRequestAuthorized, timingSafeSecretEqual } from "@/lib/internalApiAuth";
import { executePhase3aReadOnlyAudit } from "@/lib/rezdy/phase3aReadOnlyAudit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// One-way SHA-256 digest of the local ephemeral Phase 3A audit probe token
const PHASE3A_PROBE_TOKEN_SHA256 = "aeb516fe549886125f214d9a638adf7ac4ac9a2639e3dc3f0435b928db028637";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
};

function isPhase3aProbeAuthorized(request: Request): boolean {
  if (isOwnerSummaryRequestAuthorized(request)) {
    return true;
  }
  const probeHeader = request.headers.get("x-phase3a-audit-token")?.trim() || "";
  if (!probeHeader) {
    return false;
  }
  const digest = crypto.createHash("sha256").update(probeHeader, "utf8").digest("hex");
  return timingSafeSecretEqual(digest, PHASE3A_PROBE_TOKEN_SHA256);
}

function isPreviewOrLocalDev(): boolean {
  if (process.env.VERCEL_ENV === "preview") return true;
  if (process.env.NODE_ENV === "development" && process.env.VERCEL !== "1") return true;
  if (process.env.NODE_ENV === "test") return true;
  return false;
}

export async function GET(request: Request) {
  // Never expose this diagnostic route on Production
  if (!isPreviewOrLocalDev()) {
    return NextResponse.json({ ok: false, error: "Not Found" }, { status: 404, headers: NO_STORE_HEADERS });
  }

  if (!isPhase3aProbeAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401, headers: NO_STORE_HEADERS });
  }

  try {
    const report = await executePhase3aReadOnlyAudit();
    return NextResponse.json(report, { status: 200, headers: NO_STORE_HEADERS });
  } catch (error) {
    const rawMsg = error instanceof Error ? error.message : "Phase 3A audit failed";
    const apiKey = process.env.REZDY_API_KEY?.trim() || "";
    const safeMsg = apiKey && rawMsg.includes(apiKey) ? rawMsg.split(apiKey).join("[REDACTED]") : rawMsg;
    return NextResponse.json(
      { ok: false, error: safeMsg },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}

function methodNotAllowed() {
  return NextResponse.json(
    { ok: false, error: "Method Not Allowed — Phase 3A audit is strictly read-only." },
    { status: 405, headers: NO_STORE_HEADERS }
  );
}

export async function POST() {
  return methodNotAllowed();
}

export async function PUT() {
  return methodNotAllowed();
}

export async function PATCH() {
  return methodNotAllowed();
}

export async function DELETE() {
  return methodNotAllowed();
}
