import crypto from "node:crypto";
import { after } from "next/server";

const activeTasks = new Set<Promise<void>>();
let customFetchForTest: typeof fetch | null = null;

export function setParrAnalyticsFetchForTest(fn: typeof fetch | null): void {
  customFetchForTest = fn;
}

export async function flushParrAnalyticsAfterTasksForTest(): Promise<void> {
  while (activeTasks.size > 0) {
    await Promise.allSettled(Array.from(activeTasks));
  }
}

export function resolveParrDccCollectEndpoint(): string | null {
  const explicit = process.env.DCC_ANALYTICS_COLLECT_URL?.trim();
  if (explicit) return explicit;
  const origin = process.env.NEXT_PUBLIC_DCC_ORIGIN?.trim().replace(/\/+$/, "");
  if (origin) return `${origin}/api/v2/analytics/collect`;
  if (process.env.VERCEL_ENV === "production") {
    return "https://www.destinationcommandcenter.com/api/v2/analytics/collect";
  }
  return null;
}

function resolveParrInternalCollectorSecret(): string {
  return (
    process.env.DCC_ANALYTICS_INTERNAL_SECRET?.trim() ||
    process.env.DCC_INTERNAL_API_SECRET?.trim() ||
    (process.env.VERCEL_ENV !== "production" ? "dcc-nonprod-internal-collector-v2" : "")
  );
}

function resolveParrDedupeSecret(): string {
  return (
    process.env.TELEMETRY_HASH_SECRET?.trim() ||
    process.env.PARR_SECRET?.trim() ||
    process.env.DCC_PARR_WEBHOOK_TOKEN?.trim() ||
    "parr-internal-telemetry-dedupe"
  );
}

export function deriveParrOutcomeLogicalEventId(
  internalOrderId: string,
  outcomeType: "confirmed_paid" | "cancelled",
): string {
  const digest = crypto
    .createHmac("sha256", resolveParrDedupeSecret())
    .update(`parr:v2:${outcomeType}:${internalOrderId.trim()}`, "utf8")
    .digest("hex")
    .slice(0, 28);
  return `parr_out_${digest}`;
}

export function scheduleParrAnalyticsAfter(task: () => Promise<void>): void {
  if (
    process.env.NODE_ENV === "test" &&
    process.env.DCC_ANALYTICS_FORCE_LIVE_TEST !== "1" &&
    !customFetchForTest
  ) {
    return;
  }

  const run = async () => {
    try {
      await task();
    } catch {
      // Never throw or affect checkout / webhook responses
    }
  };

  const p = Promise.resolve().then(run);
  activeTasks.add(p);
  p.finally(() => activeTasks.delete(p));
  try {
    after(() => p);
  } catch {
    // Outside Next.js request scope (e.g., direct test harness invocation)
  }
}

export interface ParrVerifiedOutcomeInput {
  internalOrderId: string;
  outcomeType: "confirmed_paid" | "cancelled";
  grossAmountUsd?: number | null;
  dccHandoffId?: string | null;
  productCode?: string | null;
  isTest?: boolean;
}

export function emitParrVerifiedBookingOutcomeAfterResponse(
  input: ParrVerifiedOutcomeInput,
): void {
  if (!input.internalOrderId || !input.internalOrderId.trim()) return;
  const endpoint = resolveParrDccCollectEndpoint();
  const secret = resolveParrInternalCollectorSecret();
  if (!endpoint && !customFetchForTest) return;

  const logicalEventId = deriveParrOutcomeLogicalEventId(input.internalOrderId, input.outcomeType);
  const occurredAt = new Date().toISOString();
  const gross =
    typeof input.grossAmountUsd === "number" && Number.isFinite(input.grossAmountUsd) && input.grossAmountUsd >= 0
      ? Number(input.grossAmountUsd.toFixed(2))
      : undefined;

  const envelope: Record<string, unknown> = {
    schemaVersion: "dcc.analytics.event.v2",
    logicalEventId,
    eventType: "booking_outcome_confirmed",
    occurredAt,
    site: "partyatredrocks",
    navigationType: "server_action",
    path: "/booking/[token]",
    contentFamily: "operating_mor",
    provider: "parr_direct_mor",
    outcomeType: input.outcomeType,
    ...(typeof gross === "number" ? { grossAmountUsd: gross } : {}),
    ...(input.dccHandoffId ? { handoffId: String(input.dccHandoffId).slice(0, 96) } : {}),
    ...(input.productCode ? { productCode: String(input.productCode).slice(0, 80) } : {}),
    ...(input.isTest ? { isTest: true } : {}),
  };

  scheduleParrAnalyticsAfter(async () => {
    const fetchImpl = customFetchForTest || fetch;
    const targetUrl = endpoint || "https://www.destinationcommandcenter.com/api/v2/analytics/collect";
    const body = JSON.stringify({
      deliveryId: `parr_srv_${crypto.randomUUID().replace(/-/g, "").slice(0, 20)}`,
      sentAt: occurredAt,
      events: [envelope],
    });
    const attemptFetch = async () =>
      fetchImpl(targetUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "PARR-AnalyticsEmitter/2.0",
          ...(secret ? { "x-dcc-internal-secret": secret } : {}),
          ...(input.isTest ? { "x-qa-test": "1" } : {}),
        },
        body,
        cache: "no-store",
        signal:
          typeof AbortSignal !== "undefined" && "timeout" in AbortSignal
            ? AbortSignal.timeout(1200)
            : undefined,
      });

    const first = await attemptFetch().catch(() => null);
    if (!first || first.status >= 500 || first.status === 429) {
      await new Promise((r) => setTimeout(r, 80));
      await attemptFetch().catch(() => null);
    }
  });
}
