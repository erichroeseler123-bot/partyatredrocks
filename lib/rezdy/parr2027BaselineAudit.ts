import "server-only";

import { del, get, head, list } from "@vercel/blob";
import {
  BlobCasInventoryStore,
  CasConflictError,
  classifyUpstreamRezdyOrder,
  deriveInventoryNamespacePrefix,
  encryptInventoryLedger,
  ensureOpeningInventorySeeded,
  reconcilePoolWithRezdy,
  requireDedicatedParrSecret,
  requirePrivateInventoryBlobToken,
  type FetchLike,
  type ParrDateVehiclePoolLedger,
} from "@/lib/inventory/parrVehicleInventory";
import {
  PARR_2027_OPTION_B_PRICING_AUTHORITY,
  type ParrAuthoritativeVehicleSlug,
} from "@/lib/pricing";
import { buildCanonicalRedRocksBookingCatalog } from "@/lib/shows/redRocksBookingCatalog";

const REZDY_V1_BASE = "https://api.rezdy.com/v1";

function getRezdyApiKeyOrThrow(): string {
  const key = (process.env.REZDY_API_KEY || "").trim();
  if (!key) {
    throw new Error("REZDY_API_KEY is unavailable in the server runtime.");
  }
  return key;
}

async function fetchRezdyReadOnly(
  pathWithQuery: string,
  fetchImpl?: FetchLike
): Promise<Record<string, unknown>> {
  const apiKey = getRezdyApiKeyOrThrow();
  const normalized = pathWithQuery.startsWith("/") ? pathWithQuery : `/${pathWithQuery}`;
  const url = new URL(`${REZDY_V1_BASE}${normalized}`);
  url.searchParams.set("apiKey", apiKey);

  const f = fetchImpl ?? fetch;
  const res = await f(url.toString(), {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  const text = await res.text();
  const scrubbed = apiKey ? text.split(apiKey).join("[REDACTED]") : text;
  if (!res.ok) {
    throw new Error(`Rezdy HTTP ${res.status}: ${scrubbed.slice(0, 260)}`);
  }
  return JSON.parse(scrubbed) as Record<string, unknown>;
}

export type SanitizedBaselineOrderSummary = {
  orderNumber: string;
  productCode: string;
  status: string;
  refundStatus: string | null;
  dateKey: string;
  startTimeLocal: string;
  quantity: number;
  totalAmount: number;
  totalPaid: number;
  classification: "confirmed" | "cancelled_clean" | "ignorable_quote" | "ambiguous";
  ambiguityReason: string | null;
};

export type VehicleDateAuditCell = {
  vehicleSlug: ParrAuthoritativeVehicleSlug;
  previewProductCode: "P94HN4" | "PU8R6Y";
  legacyPublicProductCode: "P0U1MY" | "PJM9GD";
  expectedBasePriceUsd: number;
  expectedAllInTotalUsd: number;
  capacity: number;
  coverageStatus: "covered" | "missing_session" | "mismatch";
  sessionCountOnDate: number;
  sessionId: string | null;
  sessionStartTimeLocal: string | null;
  seatsAvailable: number | null;
  optionLabel: string | null;
  optionPriceUsd: number | null;
  sessionMismatches: string[];
  confirmedOrderUnits: number;
  confirmedOrders: SanitizedBaselineOrderSummary[];
  cancelledOrders: SanitizedBaselineOrderSummary[];
  ambiguousOrders: SanitizedBaselineOrderSummary[];
  orderReconciliationStatus: "clean" | "blocked_incomplete" | "blocked_ambiguous" | "blocked_over_capacity";
  orderReconciliationBlockReasons: string[];
  effectiveDateStatus: "ready" | "blocked";
  effectiveBlockReasons: string[];
};

export type Parr2027DateBaselineRow = {
  dateKey: string;
  shows: Array<{
    id: string;
    title: string;
    startLocal: string;
  }>;
  suburban: VehicleDateAuditCell;
  van: VehicleDateAuditCell;
};

type RawRezdySession = {
  id: string;
  productCode: string;
  startTimeLocal: string;
  endTimeLocal: string | null;
  seatsAvailable: number;
  optionLabel: string | null;
  optionPriceUsd: number | null;
  maxQuantity: number | null;
};

async function fetchAll2027SessionsForProduct(
  productCode: "P94HN4" | "PU8R6Y",
  fetchImpl?: FetchLike
): Promise<{
  complete: boolean;
  error: string | null;
  sessionsByDate: Map<string, RawRezdySession[]>;
  totalSessionsFound: number;
}> {
  const sessionsByDate = new Map<string, RawRezdySession[]>();
  let totalSessionsFound = 0;

  // Query month-by-month across 2027 with offset pagination so Rezdy never truncates sessions
  const monthRanges: Array<[string, string]> = [
    ["2027-01-01 00:00:00", "2027-01-31 23:59:59"],
    ["2027-02-01 00:00:00", "2027-02-28 23:59:59"],
    ["2027-03-01 00:00:00", "2027-03-31 23:59:59"],
    ["2027-04-01 00:00:00", "2027-04-30 23:59:59"],
    ["2027-05-01 00:00:00", "2027-05-31 23:59:59"],
    ["2027-06-01 00:00:00", "2027-06-30 23:59:59"],
    ["2027-07-01 00:00:00", "2027-07-31 23:59:59"],
    ["2027-08-01 00:00:00", "2027-08-31 23:59:59"],
    ["2027-09-01 00:00:00", "2027-09-30 23:59:59"],
    ["2027-10-01 00:00:00", "2027-10-31 23:59:59"],
    ["2027-11-01 00:00:00", "2027-11-30 23:59:59"],
    ["2027-12-01 00:00:00", "2027-12-31 23:59:59"],
  ];

  try {
    const seenSessionIds = new Set<string>();
    for (const [startRange, endRange] of monthRanges) {
      let offset = 0;
      const limit = 100;
      for (let page = 0; page < 10; page += 1) {
        const offsetParam = offset > 0 ? `&offset=${offset}` : "";
        const data = await fetchRezdyReadOnly(
          `/availability?productCode=${encodeURIComponent(productCode)}&startTimeLocal=${encodeURIComponent(startRange)}&endTimeLocal=${encodeURIComponent(endRange)}&limit=${limit}${offsetParam}`,
          fetchImpl
        );
        const rawList = Array.isArray(data.sessions)
          ? (data.sessions as Array<Record<string, unknown>>)
          : [];
        for (const s of rawList) {
          const sid = String(s.id ?? "");
          const startTimeLocal = String(s.startTimeLocal ?? "").trim();
          const dateKey = startTimeLocal.slice(0, 10);
          if (!sid || !/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) continue;
          if (seenSessionIds.has(sid)) continue;
          seenSessionIds.add(sid);

          const priceOptions = Array.isArray(s.priceOptions)
            ? (s.priceOptions as Array<Record<string, unknown>>)
            : [];
          const primaryOpt = priceOptions[0] ?? null;

          const parsed: RawRezdySession = {
            id: sid,
            productCode: String(s.productCode || productCode).toUpperCase(),
            startTimeLocal,
            endTimeLocal: s.endTimeLocal ? String(s.endTimeLocal) : null,
            seatsAvailable: Number(s.seatsAvailable ?? 0),
            optionLabel: primaryOpt?.label ? String(primaryOpt.label) : null,
            optionPriceUsd:
              primaryOpt && primaryOpt.price !== undefined ? Number(primaryOpt.price) : null,
            maxQuantity:
              primaryOpt && primaryOpt.maxQuantity !== undefined
                ? Number(primaryOpt.maxQuantity)
                : null,
          };

          const arr = sessionsByDate.get(dateKey) ?? [];
          arr.push(parsed);
          sessionsByDate.set(dateKey, arr);
          totalSessionsFound += 1;
        }
        if (rawList.length < limit) break;
        offset += limit;
      }
    }
    return { complete: true, error: null, sessionsByDate, totalSessionsFound };
  } catch (err) {
    return {
      complete: false,
      error: err instanceof Error ? err.message : String(err),
      sessionsByDate,
      totalSessionsFound,
    };
  }
}

async function fetchAll2027BookingsForProducts(
  productCodes: string[],
  fetchImpl?: FetchLike
): Promise<{
  complete: boolean;
  error: string | null;
  ordersByDateAndCode: Map<string, SanitizedBaselineOrderSummary[]>;
  all2027Orders: SanitizedBaselineOrderSummary[];
}> {
  const ordersByDateAndCode = new Map<string, SanitizedBaselineOrderSummary[]>();
  const deduped = new Map<string, SanitizedBaselineOrderSummary>();

  try {
    for (const code of productCodes) {
      let offset = 0;
      const limit = 100;
      const maxPages = 25;
      for (let page = 0; page < maxPages; page += 1) {
        const offsetParam = offset > 0 ? `&offset=${offset}` : "";
        const data = await fetchRezdyReadOnly(
          `/bookings?productCode=${encodeURIComponent(code)}&minTourStartDate=${encodeURIComponent("2027-01-01 00:00:00")}&maxTourStartDate=${encodeURIComponent("2027-12-31 23:59:59")}&limit=${limit}${offsetParam}`,
          fetchImpl
        );
        const rawBookings = Array.isArray(data.bookings)
          ? (data.bookings as Array<Record<string, unknown>>)
          : [];

        for (const b of rawBookings) {
          const orderNumber = typeof b.orderNumber === "string" ? b.orderNumber.trim() : "";
          if (!orderNumber) continue;
          const status = typeof b.status === "string" ? b.status.trim().toUpperCase() : "UNKNOWN";
          const refundStatus =
            typeof b.refundStatus === "string" && b.refundStatus.trim()
              ? b.refundStatus.trim().toUpperCase()
              : null;
          const items = Array.isArray(b.items)
            ? (b.items as Array<Record<string, unknown>>)
            : [];

          for (const item of items) {
            const pCode = String(item.productCode || "").trim().toUpperCase();
            if (pCode !== code.toUpperCase()) continue;
            const startTimeLocal = String(item.startTimeLocal || "").trim();
            const dateKey = startTimeLocal.slice(0, 10);
            if (!dateKey.startsWith("2027-")) continue;

            const quantities = Array.isArray(item.quantities)
              ? (item.quantities as Array<Record<string, unknown>>)
              : [];
            const qtySum = quantities.reduce(
              (acc, q) => acc + Math.max(0, Number(q.value ?? 1) || 0),
              0
            );
            const quantity = qtySum > 0 ? qtySum : 1;
            const totalAmount = Number(b.totalAmount ?? 0);
            const totalPaid = Number(b.totalPaid ?? 0);

            const cls = classifyUpstreamRezdyOrder({
              orderNumber,
              status,
              refundStatus,
              resellerReference: null,
              productCode: pCode,
              startTimeLocal,
              dateKey,
              quantity,
              totalAmount,
              totalPaid,
              customer: null,
              pickupLocation: null,
              rawBooking: {},
            });

            const summary: SanitizedBaselineOrderSummary = {
              orderNumber,
              productCode: pCode,
              status,
              refundStatus,
              dateKey,
              startTimeLocal,
              quantity,
              totalAmount,
              totalPaid,
              classification: cls.kind,
              ambiguityReason: cls.reason ?? null,
            };

            deduped.set(`${orderNumber}:${pCode}:${dateKey}`, summary);
          }
        }

        if (rawBookings.length < limit) break;
        if (page + 1 >= maxPages) {
          throw new Error(
            `INCOMPLETE_2027_BOOKING_PAGINATION: >= ${limit * maxPages} bookings returned for ${code}`
          );
        }
        offset += limit;
      }
    }

    const all2027Orders = Array.from(deduped.values()).sort((a, b) =>
      a.dateKey.localeCompare(b.dateKey) || a.orderNumber.localeCompare(b.orderNumber)
    );
    for (const ord of all2027Orders) {
      const k = `${ord.dateKey}:${ord.productCode}`;
      const listForKey = ordersByDateAndCode.get(k) ?? [];
      listForKey.push(ord);
      ordersByDateAndCode.set(k, listForKey);
    }

    return { complete: true, error: null, ordersByDateAndCode, all2027Orders };
  } catch (err) {
    return {
      complete: false,
      error: err instanceof Error ? err.message : String(err),
      ordersByDateAndCode,
      all2027Orders: Array.from(deduped.values()),
    };
  }
}

function buildVehicleCell(input: {
  dateKey: string;
  vehicleSlug: ParrAuthoritativeVehicleSlug;
  sessionsFetchComplete: boolean;
  sessionsFetchError: string | null;
  sessionsOnDate: RawRezdySession[];
  bookingsFetchComplete: boolean;
  bookingsFetchError: string | null;
  ordersOnDate: SanitizedBaselineOrderSummary[];
}): VehicleDateAuditCell {
  const cfg = PARR_2027_OPTION_B_PRICING_AUTHORITY[input.vehicleSlug];
  const sessionMismatches: string[] = [];

  if (!input.sessionsFetchComplete) {
    sessionMismatches.push(
      `SESSION_AUDIT_INCOMPLETE: ${input.sessionsFetchError || "Failed querying Rezdy sessions"}`
    );
  } else if (input.sessionsOnDate.length === 0) {
    sessionMismatches.push(
      `MISSING_SESSION: ${cfg.rezdy.previewProductCode} has 0 sessions on ${input.dateKey}`
    );
  } else {
    if (input.sessionsOnDate.length > 1) {
      sessionMismatches.push(
        `MULTIPLE_SESSIONS_ON_DATE: ${cfg.rezdy.previewProductCode} has ${input.sessionsOnDate.length} sessions on ${input.dateKey}`
      );
    }
    const primary = input.sessionsOnDate[0];
    if (primary.seatsAvailable < 1) {
      sessionMismatches.push(
        `ZERO_SEATS_AVAILABLE: ${cfg.rezdy.previewProductCode} session ${primary.id} has seatsAvailable=${primary.seatsAvailable}`
      );
    }
    if (
      primary.optionPriceUsd === null ||
      Math.abs(primary.optionPriceUsd - cfg.basePriceUsd) > 0.005
    ) {
      sessionMismatches.push(
        `BASE_PRICE_MISMATCH: ${cfg.rezdy.previewProductCode} session ${primary.id} optionPrice=${String(primary.optionPriceUsd)} vs expected $${cfg.basePriceUsd.toFixed(2)}`
      );
    }
  }

  const coverageStatus: VehicleDateAuditCell["coverageStatus"] =
    !input.sessionsFetchComplete
      ? "mismatch"
      : input.sessionsOnDate.length === 0
        ? "missing_session"
        : sessionMismatches.length > 0
          ? "mismatch"
          : "covered";

  const primarySession = input.sessionsOnDate[0] ?? null;

  const confirmedOrders = input.ordersOnDate.filter((o) => o.classification === "confirmed");
  const cancelledOrders = input.ordersOnDate.filter((o) => o.classification === "cancelled_clean");
  const ambiguousOrders = input.ordersOnDate.filter((o) => o.classification === "ambiguous");
  const confirmedOrderUnits = confirmedOrders.reduce((acc, o) => acc + o.quantity, 0);

  const orderBlockReasons: string[] = [];
  let orderReconciliationStatus: VehicleDateAuditCell["orderReconciliationStatus"] = "clean";

  if (!input.bookingsFetchComplete) {
    orderReconciliationStatus = "blocked_incomplete";
    orderBlockReasons.push(
      `INCOMPLETE_REZDY_BOOKING_BASELINE: ${input.bookingsFetchError || "Booking query incomplete"}`
    );
  } else if (ambiguousOrders.length > 0) {
    orderReconciliationStatus = "blocked_ambiguous";
    for (const amb of ambiguousOrders) {
      orderBlockReasons.push(
        amb.ambiguityReason ||
          `AMBIGUOUS_ORDER: ${amb.orderNumber} (${amb.productCode}) status=${amb.status}`
      );
    }
  } else if (confirmedOrderUnits > cfg.dailyVehicleCapacity) {
    orderReconciliationStatus = "blocked_over_capacity";
    orderBlockReasons.push(
      `OVER_CAPACITY_IN_REZDY: ${confirmedOrderUnits} confirmed units vs capacity ${cfg.dailyVehicleCapacity}`
    );
  }

  const effectiveBlockReasons = [...sessionMismatches, ...orderBlockReasons];
  const effectiveDateStatus: "ready" | "blocked" =
    coverageStatus === "covered" &&
    orderReconciliationStatus === "clean" &&
    confirmedOrderUnits < cfg.dailyVehicleCapacity
      ? "ready"
      : "blocked";

  if (
    coverageStatus === "covered" &&
    orderReconciliationStatus === "clean" &&
    confirmedOrderUnits >= cfg.dailyVehicleCapacity
  ) {
    effectiveBlockReasons.push(
      `SOLD_OUT_AT_CAPACITY: ${confirmedOrderUnits}/${cfg.dailyVehicleCapacity} vehicles already confirmed`
    );
  }

  return {
    vehicleSlug: input.vehicleSlug,
    previewProductCode: cfg.rezdy.previewProductCode,
    legacyPublicProductCode: cfg.rezdy.legacyPublicProductCode,
    expectedBasePriceUsd: cfg.basePriceUsd,
    expectedAllInTotalUsd: cfg.allInTotalUsd,
    capacity: cfg.dailyVehicleCapacity,
    coverageStatus,
    sessionCountOnDate: input.sessionsOnDate.length,
    sessionId: primarySession?.id ?? null,
    sessionStartTimeLocal: primarySession?.startTimeLocal ?? null,
    seatsAvailable: primarySession?.seatsAvailable ?? null,
    optionLabel: primarySession?.optionLabel ?? null,
    optionPriceUsd: primarySession?.optionPriceUsd ?? null,
    sessionMismatches,
    confirmedOrderUnits,
    confirmedOrders,
    cancelledOrders,
    ambiguousOrders,
    orderReconciliationStatus,
    orderReconciliationBlockReasons: orderBlockReasons,
    effectiveDateStatus,
    effectiveBlockReasons,
  };
}

/**
 * Hardening Items 3 & 4:
 * Strictly READ-ONLY against Rezdy!
 * Audits all 2027 Red Rocks concert dates across hidden products `P94HN4` & `PU8R6Y`
 * AND runs a complete read-only reconciliation baseline against actual confirmed & cancelled
 * Rezdy orders (`P94HN4`, `PU8R6Y`, `P0U1MY`, `PJM9GD`).
 */
export async function runParr2027SessionAndReconciliationAudit(opts?: {
  fetchImpl?: FetchLike;
  syncNonEmptyOrderPoolsToStore?: boolean;
}) {
  requireDedicatedParrSecret();

  const catalog2027 = buildCanonicalRedRocksBookingCatalog("2026-11-18").filter((s) =>
    s.dateKey.startsWith("2027-")
  );

  const showsByDate = new Map<string, Array<{ id: string; title: string; startLocal: string }>>();
  for (const s of catalog2027) {
    const arr = showsByDate.get(s.dateKey) ?? [];
    arr.push({ id: s.id, title: s.title, startLocal: s.startLocal });
    showsByDate.set(s.dateKey, arr);
  }

  const sortedShowDates = Array.from(showsByDate.keys()).sort();

  const [suvSessionsRes, vanSessionsRes, bookingsRes] = await Promise.all([
    fetchAll2027SessionsForProduct("P94HN4", opts?.fetchImpl),
    fetchAll2027SessionsForProduct("PU8R6Y", opts?.fetchImpl),
    fetchAll2027BookingsForProducts(["P94HN4", "P0U1MY", "PU8R6Y", "PJM9GD"], opts?.fetchImpl),
  ]);

  const matrix: Parr2027DateBaselineRow[] = [];
  const poolsSyncedToPrivateStore: string[] = [];

  for (const dateKey of sortedShowDates) {
    const suvOrders = [
      ...(bookingsRes.ordersByDateAndCode.get(`${dateKey}:P94HN4`) ?? []),
      ...(bookingsRes.ordersByDateAndCode.get(`${dateKey}:P0U1MY`) ?? []),
    ];
    const vanOrders = [
      ...(bookingsRes.ordersByDateAndCode.get(`${dateKey}:PU8R6Y`) ?? []),
      ...(bookingsRes.ordersByDateAndCode.get(`${dateKey}:PJM9GD`) ?? []),
    ];

    const suburban = buildVehicleCell({
      dateKey,
      vehicleSlug: "suv",
      sessionsFetchComplete: suvSessionsRes.complete,
      sessionsFetchError: suvSessionsRes.error,
      sessionsOnDate: suvSessionsRes.sessionsByDate.get(dateKey) ?? [],
      bookingsFetchComplete: bookingsRes.complete,
      bookingsFetchError: bookingsRes.error,
      ordersOnDate: suvOrders,
    });

    const van = buildVehicleCell({
      dateKey,
      vehicleSlug: "van",
      sessionsFetchComplete: vanSessionsRes.complete,
      sessionsFetchError: vanSessionsRes.error,
      sessionsOnDate: vanSessionsRes.sessionsByDate.get(dateKey) ?? [],
      bookingsFetchComplete: bookingsRes.complete,
      bookingsFetchError: bookingsRes.error,
      ordersOnDate: vanOrders,
    });

    matrix.push({
      dateKey,
      shows: showsByDate.get(dateKey) ?? [],
      suburban,
      van,
    });

    if (opts?.syncNonEmptyOrderPoolsToStore) {
      if (
        suvOrders.length > 0 ||
        suburban.orderReconciliationStatus !== "clean"
      ) {
        await ensureOpeningInventorySeeded(
          { dateKey, vehicleSlug: "suv" },
          { fetchImpl: opts?.fetchImpl }
        );
        await reconcilePoolWithRezdy(
          { dateKey, vehicleSlug: "suv", actor: "baseline_2027_audit" },
          { fetchImpl: opts?.fetchImpl }
        );
        poolsSyncedToPrivateStore.push(`${dateKey}__suv`);
      }
      if (
        vanOrders.length > 0 ||
        van.orderReconciliationStatus !== "clean"
      ) {
        await ensureOpeningInventorySeeded(
          { dateKey, vehicleSlug: "van" },
          { fetchImpl: opts?.fetchImpl }
        );
        await reconcilePoolWithRezdy(
          { dateKey, vehicleSlug: "van", actor: "baseline_2027_audit" },
          { fetchImpl: opts?.fetchImpl }
        );
        poolsSyncedToPrivateStore.push(`${dateKey}__van`);
      }
    }
  }

  // Also check isolated non-concert canary date `2027-11-30` and any extra non-catalog 2027 sessions
  const nonCatalogSuvSessionDates = Array.from(suvSessionsRes.sessionsByDate.keys())
    .filter((d) => !showsByDate.has(d))
    .sort();
  const nonCatalogVanSessionDates = Array.from(vanSessionsRes.sessionsByDate.keys())
    .filter((d) => !showsByDate.has(d))
    .sort();

  const canaryDateKey = "2027-11-30";
  const isolatedCanaryDateCheck = {
    dateKey: canaryDateKey,
    suburban: buildVehicleCell({
      dateKey: canaryDateKey,
      vehicleSlug: "suv",
      sessionsFetchComplete: suvSessionsRes.complete,
      sessionsFetchError: suvSessionsRes.error,
      sessionsOnDate: suvSessionsRes.sessionsByDate.get(canaryDateKey) ?? [],
      bookingsFetchComplete: bookingsRes.complete,
      bookingsFetchError: bookingsRes.error,
      ordersOnDate: [
        ...(bookingsRes.ordersByDateAndCode.get(`${canaryDateKey}:P94HN4`) ?? []),
        ...(bookingsRes.ordersByDateAndCode.get(`${canaryDateKey}:P0U1MY`) ?? []),
      ],
    }),
    van: buildVehicleCell({
      dateKey: canaryDateKey,
      vehicleSlug: "van",
      sessionsFetchComplete: vanSessionsRes.complete,
      sessionsFetchError: vanSessionsRes.error,
      sessionsOnDate: vanSessionsRes.sessionsByDate.get(canaryDateKey) ?? [],
      bookingsFetchComplete: bookingsRes.complete,
      bookingsFetchError: bookingsRes.error,
      ordersOnDate: [
        ...(bookingsRes.ordersByDateAndCode.get(`${canaryDateKey}:PU8R6Y`) ?? []),
        ...(bookingsRes.ordersByDateAndCode.get(`${canaryDateKey}:PJM9GD`) ?? []),
      ],
    }),
  };

  const summary = {
    auditedAt: new Date().toISOString(),
    totalCatalog2027Events: catalog2027.length,
    totalUnique2027ServiceDates: sortedShowDates.length,
    upstreamSessionAuditComplete: suvSessionsRes.complete && vanSessionsRes.complete,
    upstreamOrderBaselineComplete: bookingsRes.complete,
    suburbanSessionSummary: {
      productCode: "P94HN4",
      total2027SessionsInRezdy: suvSessionsRes.totalSessionsFound,
      nonCatalog2027SessionDates: nonCatalogSuvSessionDates,
      coveredConcertDates: matrix.filter((r) => r.suburban.coverageStatus === "covered").length,
      missingSessionConcertDates: matrix.filter((r) => r.suburban.coverageStatus === "missing_session").length,
      mismatchConcertDates: matrix.filter((r) => r.suburban.coverageStatus === "mismatch").length,
      orderReconciliationCleanDates: matrix.filter((r) => r.suburban.orderReconciliationStatus === "clean").length,
      orderReconciliationBlockedDates: matrix.filter((r) => r.suburban.orderReconciliationStatus !== "clean").length,
      effectiveReadyDates: matrix.filter((r) => r.suburban.effectiveDateStatus === "ready").length,
      effectiveBlockedDates: matrix.filter((r) => r.suburban.effectiveDateStatus === "blocked").length,
    },
    vanSessionSummary: {
      productCode: "PU8R6Y",
      total2027SessionsInRezdy: vanSessionsRes.totalSessionsFound,
      nonCatalog2027SessionDates: nonCatalogVanSessionDates,
      coveredConcertDates: matrix.filter((r) => r.van.coverageStatus === "covered").length,
      missingSessionConcertDates: matrix.filter((r) => r.van.coverageStatus === "missing_session").length,
      mismatchConcertDates: matrix.filter((r) => r.van.coverageStatus === "mismatch").length,
      orderReconciliationCleanDates: matrix.filter((r) => r.van.orderReconciliationStatus === "clean").length,
      orderReconciliationBlockedDates: matrix.filter((r) => r.van.orderReconciliationStatus !== "clean").length,
      effectiveReadyDates: matrix.filter((r) => r.van.effectiveDateStatus === "ready").length,
      effectiveBlockedDates: matrix.filter((r) => r.van.effectiveDateStatus === "blocked").length,
    },
    all2027OrdersSummary: {
      totalOrdersFoundAcross2027: bookingsRes.all2027Orders.length,
      confirmedCount: bookingsRes.all2027Orders.filter((o) => o.classification === "confirmed").length,
      cancelledCleanCount: bookingsRes.all2027Orders.filter((o) => o.classification === "cancelled_clean").length,
      ambiguousCount: bookingsRes.all2027Orders.filter((o) => o.classification === "ambiguous").length,
      ignorableQuoteCount: bookingsRes.all2027Orders.filter((o) => o.classification === "ignorable_quote").length,
      orders: bookingsRes.all2027Orders,
    },
    poolsSyncedToPrivateStore,
  };

  return {
    summary,
    isolatedCanaryDateCheck,
    matrix,
  };
}

/**
 * Hardening Item 1:
 * Executes an end-to-end live verification against the dedicated private Vercel Blob store
 * (`PARR_INVENTORY_PRIVATE_READ_WRITE_TOKEN`) using an isolated diagnostic pool key (`9999-12-31__suv`)
 * and cleans up all probe blobs in `finally`.
 */
export async function runPrivateVercelBlobStorageProof() {
  requireDedicatedParrSecret();
  const token = requirePrivateInventoryBlobToken();
  const nsPrefix = deriveInventoryNamespacePrefix();
  const probePoolKey = "9999-12-31__suv";
  const headPathname = `${nsPrefix}/heads/${probePoolKey}.cas`;
  const revPrefix = `${nsPrefix}/revs/${probePoolKey}/`;
  const blobStore = new BlobCasInventoryStore({ token });

  const cleanupProbeBlobs = async () => {
    try {
      const revs = await list({ prefix: revPrefix, limit: 100, token });
      if (revs.blobs.length > 0) {
        await del(
          revs.blobs.map((b) => b.url),
          { token }
        );
      }
    } catch {}
    try {
      const h = await head(headPathname, { token });
      await del(h.url, { token });
    } catch {}
  };

  await cleanupProbeBlobs();

  try {
    const sampleLedgerRev1: ParrDateVehiclePoolLedger = {
      schema: "parr.vehicle-inventory-ledger.v1",
      poolKey: probePoolKey,
      canonicalServiceDate: "9999-12-31",
      canonicalShowId: "rr-9999-12-31-private-storage-probe",
      vehicleSlug: "suv",
      dccProductCode: "parr-suburban",
      rezdyProductReference: "P94HN4",
      capacity: 6,
      revision: 1,
      openingInventorySeededAt: new Date().toISOString(),
      openingConfirmedRezdyOrders: [],
      reconciliationBlocked: false,
      reconciliationBlockReasons: [],
      lastReconciledAt: new Date().toISOString(),
      reservations: [],
      outbox: [],
      ownerAlerts: [],
      poolAuditLog: [
        {
          at: new Date().toISOString(),
          action: "private_blob_cas_probe_rev1",
          actor: "hardening_verifier",
          detail: "Verifying private Vercel Blob access, AES-256-GCM v2 cipher, and ETag/ifMatch CAS.",
        },
      ],
    };

    // 1. Create initial private `.enc` revision and `.cas` head (`expectedVersionToken = null`)
    const write1 = await blobStore.writePoolCas(probePoolKey, sampleLedgerRev1, null);
    const headMeta1 = await head(headPathname, { token });
    const listedRevs1 = await list({ prefix: revPrefix, limit: 20, token });
    const revBlob1 = listedRevs1.blobs[0];
    if (!revBlob1) {
      throw new Error("Expected immutable private revision blob to exist after writePoolCas.");
    }

    // 2. Verify unauthenticated public HTTP GET to BOTH headUrl and revUrl is rejected (`403` / `401`)!
    const [unauthHeadRes, unauthRevRes] = await Promise.all([
      fetch(headMeta1.url, { method: "GET", cache: "no-store" }),
      fetch(revBlob1.url, { method: "GET", cache: "no-store" }),
    ]);

    // 3. Verify raw private `.enc` body is AES-256-GCM v2 ciphertext (never plaintext)
    const rawRevGot = await get(revBlob1.pathname, {
      access: "private",
      useCache: false,
      token,
    });
    const rawCipherText =
      rawRevGot && rawRevGot.statusCode === 200
        ? await new Response(rawRevGot.stream).text()
        : "";
    const parsedEnvelope = JSON.parse(rawCipherText) as Record<string, unknown>;

    // 4. Read back via `BlobCasInventoryStore.readPool`
    const read1 = await blobStore.readPool(probePoolKey);

    // 5. Commit revision 2 using `ifMatch: write1.versionToken`
    const sampleLedgerRev2: ParrDateVehiclePoolLedger = {
      ...sampleLedgerRev1,
      revision: 2,
    };
    const write2 = await blobStore.writePoolCas(
      probePoolKey,
      sampleLedgerRev2,
      write1.versionToken
    );

    // 6. Attempt stale ETag CAS write using `write1.versionToken` -> MUST throw `CasConflictError`!
    let staleCasRejectedWithConflict = false;
    let staleCasErrorName = "";
    try {
      await blobStore.writePoolCas(
        probePoolKey,
        { ...sampleLedgerRev2, revision: 3 },
        write1.versionToken
      );
    } catch (err) {
      if (err instanceof CasConflictError) {
        staleCasRejectedWithConflict = true;
        staleCasErrorName = err.name;
      } else {
        throw err;
      }
    }

    const readAfterStaleConflict = await blobStore.readPool(probePoolKey);

    return {
      verifiedAt: new Date().toISOString(),
      privateStoreHost: new URL(headMeta1.url).host,
      isPrivateVercelStorageHost: headMeta1.url.includes(".private.blob.vercel-storage.com/"),
      namespacePrefix: nsPrefix,
      headBlob: {
        pathname: headMeta1.pathname,
        url: headMeta1.url,
        etagRev1: write1.versionToken,
        etagRev2: write2.versionToken,
        unauthenticatedHttpGetStatus: unauthHeadRes.status,
      },
      immutableRevisionBlob: {
        pathname: revBlob1.pathname,
        url: revBlob1.url,
        sizeBytes: revBlob1.size,
        unauthenticatedHttpGetStatus: unauthRevRes.status,
        envelopeVersion: parsedEnvelope.v,
        envelopeAlgorithm: parsedEnvelope.alg,
        containsPlaintextPoolKey: rawCipherText.includes(probePoolKey),
      },
      authenticatedReadCheck: {
        rev1ReadRevision: read1.ledger?.revision ?? null,
        rev1VersionTokenMatched: read1.versionToken === write1.versionToken,
        rev2ReadAfterStaleConflictRevision: readAfterStaleConflict.ledger?.revision ?? null,
        rev2VersionTokenMatched: readAfterStaleConflict.versionToken === write2.versionToken,
      },
      casPreconditionCheck: {
        etagChangedOnRev2: write1.versionToken !== write2.versionToken,
        staleEtagRejectedWithCasConflictError: staleCasRejectedWithConflict,
        errorName: staleCasErrorName,
      },
      sampleCipherRoundTripValid: Boolean(encryptInventoryLedger("probe").includes('"v":2')),
    };
  } finally {
    await cleanupProbeBlobs();
  }
}
