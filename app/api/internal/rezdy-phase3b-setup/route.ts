import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { isOwnerSummaryRequestAuthorized, timingSafeSecretEqual } from "@/lib/internalApiAuth";
import { executePhase3bSetupAndTaxInvestigation } from "@/lib/rezdy/phase3bHiddenProductsAndTaxAudit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PHASE3A_PROBE_TOKEN_SHA256 = "aeb516fe549886125f214d9a638adf7ac4ac9a2639e3dc3f0435b928db028637";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
};

function isAuthorized(request: Request): boolean {
  if (isOwnerSummaryRequestAuthorized(request)) return true;
  const probeHeader = request.headers.get("x-phase3a-audit-token")?.trim() || "";
  if (!probeHeader) return false;
  const digest = crypto.createHash("sha256").update(probeHeader, "utf8").digest("hex");
  return timingSafeSecretEqual(digest, PHASE3A_PROBE_TOKEN_SHA256);
}

function isPreviewOrLocalDev(): boolean {
  if (process.env.VERCEL_ENV === "preview") return true;
  if (process.env.NODE_ENV === "development" && process.env.VERCEL !== "1") return true;
  if (process.env.NODE_ENV === "test") return true;
  return false;
}

export async function POST(request: Request) {
  if (!isPreviewOrLocalDev()) {
    return NextResponse.json({ ok: false, error: "Not Found" }, { status: 404, headers: NO_STORE_HEADERS });
  }
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401, headers: NO_STORE_HEADERS });
  }

  try {
    const body = (await request.json().catch(() => ({}))) as {
      provisionProducts?: boolean;
      syncSingleVehicleQuantity?: boolean;
    };
    const result = await executePhase3bSetupAndTaxInvestigation({
      provisionProducts: Boolean(body.provisionProducts),
      syncSingleVehicleQuantity: Boolean(body.syncSingleVehicleQuantity),
    });
    return NextResponse.json(result, { status: 200, headers: NO_STORE_HEADERS });
  } catch (error) {
    const rawMsg = error instanceof Error ? error.message : "Phase 3B setup failed";
    const apiKey = process.env.REZDY_API_KEY?.trim() || "";
    const safeMsg = apiKey && rawMsg.includes(apiKey) ? rawMsg.split(apiKey).join("[REDACTED]") : rawMsg;
    return NextResponse.json({ ok: false, error: safeMsg }, { status: 500, headers: NO_STORE_HEADERS });
  }
}

export async function GET(request: Request) {
  if (!isPreviewOrLocalDev()) {
    return NextResponse.json({ ok: false, error: "Not Found" }, { status: 404, headers: NO_STORE_HEADERS });
  }
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401, headers: NO_STORE_HEADERS });
  }

  try {
    const result = await executePhase3bSetupAndTaxInvestigation({ provisionProducts: false });
    return NextResponse.json(result, { status: 200, headers: NO_STORE_HEADERS });
  } catch (error) {
    const rawMsg = error instanceof Error ? error.message : "Phase 3B inspection failed";
    const apiKey = process.env.REZDY_API_KEY?.trim() || "";
    const safeMsg = apiKey && rawMsg.includes(apiKey) ? rawMsg.split(apiKey).join("[REDACTED]") : rawMsg;
    return NextResponse.json({ ok: false, error: safeMsg }, { status: 500, headers: NO_STORE_HEADERS });
  }
}
