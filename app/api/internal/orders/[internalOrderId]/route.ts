import { NextResponse } from "next/server";
import { updateInternalOrderOps } from "@/lib/orders";

export const runtime = "nodejs";

type OpsUpdateBody = {
  notes?: string;
  followUpStatus?: "new" | "contacted" | "waiting" | "resolved";
  markPaymentRequestSent?: boolean;
};

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ internalOrderId: string }> }
) {
  const { internalOrderId } = await params;
  if (!internalOrderId) {
    return NextResponse.json({ error: "Missing internalOrderId" }, { status: 400 });
  }

  let body: OpsUpdateBody;
  try {
    body = (await request.json()) as OpsUpdateBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (
    typeof body.notes !== "undefined" &&
    typeof body.notes !== "string"
  ) {
    return NextResponse.json({ error: "notes must be a string" }, { status: 400 });
  }
  if (
    typeof body.followUpStatus !== "undefined" &&
    body.followUpStatus !== "new" &&
    body.followUpStatus !== "contacted" &&
    body.followUpStatus !== "waiting" &&
    body.followUpStatus !== "resolved"
  ) {
    return NextResponse.json({ error: "Invalid followUpStatus" }, { status: 400 });
  }
  if (
    typeof body.markPaymentRequestSent !== "undefined" &&
    typeof body.markPaymentRequestSent !== "boolean"
  ) {
    return NextResponse.json({ error: "markPaymentRequestSent must be boolean" }, { status: 400 });
  }

  const updated = await updateInternalOrderOps(internalOrderId, {
    notes: body.notes,
    followUpStatus: body.followUpStatus,
    markPaymentRequestSent: body.markPaymentRequestSent,
  });
  if (!updated.ok) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
