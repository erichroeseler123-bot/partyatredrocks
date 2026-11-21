import { NextRequest, NextResponse } from "next/server";
import {
  isInternalOrdersRequestAuthorized,
  isOwnerSummaryRequestAuthorized,
} from "@/lib/internalApiAuth";
import {
  listAdminInventoryPools,
  MissingParrSecretError,
  MissingPrivateBlobTokenError,
  reconcilePoolWithRezdy,
  releaseInventoryAfterConfirmedCancellation,
  requireDedicatedParrSecret,
  resolvePoolReconciliationDisagreement,
} from "@/lib/inventory/parrVehicleInventory";
import {
  runParr2027SessionAndReconciliationAudit,
  runPrivateVercelBlobStorageProof,
} from "@/lib/rezdy/parr2027BaselineAudit";
import { isParrNativeApiEnabled, type ParrNativeVehicleSlug } from "@/lib/rezdy/parrNativeRezdyService";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HEADERS = {
  "Cache-Control": "no-store, max-age=0",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
};

function isAuthorized(req: NextRequest): boolean {
  return isInternalOrdersRequestAuthorized(req) || isOwnerSummaryRequestAuthorized(req);
}

export async function GET(request: NextRequest) {
  if (!isParrNativeApiEnabled()) {
    return NextResponse.json({ ok: false, error: "Not Found" }, { status: 404, headers: HEADERS });
  }
  try {
    requireDedicatedParrSecret();
  } catch (err) {
    if (err instanceof MissingParrSecretError) {
      return NextResponse.json(
        { ok: false, code: err.code, error: err.message },
        { status: 503, headers: HEADERS }
      );
    }
    throw err;
  }
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401, headers: HEADERS });
  }

  try {
    const mode = request.nextUrl.searchParams.get("mode") || "";
    if (mode === "private_storage_proof") {
      const proof = await runPrivateVercelBlobStorageProof();
      return NextResponse.json({ ok: true, mode, proof }, { status: 200, headers: HEADERS });
    }
    if (mode === "audit_2027_baseline") {
      const sync = request.nextUrl.searchParams.get("sync") === "1";
      const audit = await runParr2027SessionAndReconciliationAudit({
        syncNonEmptyOrderPoolsToStore: sync,
      });
      return NextResponse.json({ ok: true, mode, ...audit }, { status: 200, headers: HEADERS });
    }

    const board = await listAdminInventoryPools();
    return NextResponse.json({ ok: true, ...board }, { status: 200, headers: HEADERS });
  } catch (err) {
    if (err instanceof MissingParrSecretError || err instanceof MissingPrivateBlobTokenError) {
      return NextResponse.json(
        { ok: false, code: err.code, error: err.message },
        { status: 503, headers: HEADERS }
      );
    }
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Inventory lookup failed" },
      { status: 500, headers: HEADERS }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!isParrNativeApiEnabled()) {
    return NextResponse.json({ ok: false, error: "Not Found" }, { status: 404, headers: HEADERS });
  }
  try {
    requireDedicatedParrSecret();
  } catch (err) {
    if (err instanceof MissingParrSecretError) {
      return NextResponse.json(
        { ok: false, code: err.code, error: err.message },
        { status: 503, headers: HEADERS }
      );
    }
    throw err;
  }
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401, headers: HEADERS });
  }

  try {
    const body = (await request.json()) as {
      action: "reconcile" | "resolve_disagreement" | "release_cancelled";
      dateKey: string;
      vehicleSlug: ParrNativeVehicleSlug;
      rezdyOrderNumber?: string;
      actor?: string;
      note?: string;
      promoteBlockedHoldsToSold?: boolean;
    };

    if (body.vehicleSlug !== "suv" && body.vehicleSlug !== "van") {
      return NextResponse.json({ ok: false, error: "Invalid vehicleSlug" }, { status: 400, headers: HEADERS });
    }

    if (body.action === "reconcile") {
      const res = await reconcilePoolWithRezdy({
        dateKey: body.dateKey,
        vehicleSlug: body.vehicleSlug,
        actor: body.actor || "internal_admin",
      });
      return NextResponse.json({ ok: true, ...res }, { status: 200, headers: HEADERS });
    }

    if (body.action === "release_cancelled") {
      if (!body.rezdyOrderNumber) {
        return NextResponse.json({ ok: false, error: "rezdyOrderNumber required" }, { status: 400, headers: HEADERS });
      }
      const res = await releaseInventoryAfterConfirmedCancellation({
        dateKey: body.dateKey,
        vehicleSlug: body.vehicleSlug,
        rezdyOrderNumber: body.rezdyOrderNumber,
        actor: body.actor || "internal_admin",
      });
      return NextResponse.json({ ok: res.released, ...res }, { status: res.released ? 200 : 409, headers: HEADERS });
    }

    if (body.action === "resolve_disagreement") {
      const res = await resolvePoolReconciliationDisagreement({
        dateKey: body.dateKey,
        vehicleSlug: body.vehicleSlug,
        actor: body.actor || "owner_admin",
        note: body.note || "",
        promoteBlockedHoldsToSold: body.promoteBlockedHoldsToSold,
      });
      return NextResponse.json({ ok: true, ...res }, { status: 200, headers: HEADERS });
    }

    return NextResponse.json({ ok: false, error: "Unsupported action" }, { status: 400, headers: HEADERS });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Inventory action failed" },
      { status: 400, headers: HEADERS }
    );
  }
}
