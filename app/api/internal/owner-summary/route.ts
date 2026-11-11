import { NextResponse } from "next/server";
import { isVaultEncryptionConfigured } from "@/lib/blobVault";
import { isOwnerSummaryRequestAuthorized } from "@/lib/internalApiAuth";
import { listInternalOrdersReadOnly } from "@/lib/orders";
import { summarizeOwnerOrders28d } from "@/lib/parr/ops/ownerSummary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store",
};

export async function GET(request: Request) {
  if (!isOwnerSummaryRequestAuthorized(request)) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401, headers: NO_STORE_HEADERS },
    );
  }

  const now = new Date();
  const generatedAt = now.toISOString();
  const security = {
    opsAuthFailClosed: true,
    vaultEncryptionConfigured: isVaultEncryptionConfigured(),
  };

  try {
    const orders = await listInternalOrdersReadOnly();
    const metrics28d = summarizeOwnerOrders28d(orders, now);

    return NextResponse.json(
      {
        ok: true,
        siteId: "partyatredrocks",
        role: "direct_mor_transport",
        generatedAt,
        security,
        metrics28d,
      },
      { status: 200, headers: NO_STORE_HEADERS },
    );
  } catch {
    return NextResponse.json(
      {
        ok: false,
        degraded: true,
        siteId: "partyatredrocks",
        role: "direct_mor_transport",
        generatedAt,
        security,
        metrics28d: null,
      },
      { status: 200, headers: NO_STORE_HEADERS },
    );
  }
}
