import "server-only";

const REZDY_V1_BASE = "https://api.rezdy.com/v1";

type ReadOnlyRezdyResult = {
  status: number;
  ok: boolean;
  endpoint: string;
  data: Record<string, unknown> | null;
};

export type Phase3aAuditOptions = {
  codes?: string[];
};

function getRezdyApiKey(): string {
  const key = process.env.REZDY_API_KEY?.trim() || "";
  if (!key) {
    throw new Error("REZDY_API_KEY is not configured in this server runtime.");
  }
  return key;
}

/**
 * Strictly read-only Rezdy v1 GET helper.
 * Hardcodes HTTP method "GET", never logs or echoes `apiKey`, and strips any
 * accidental credential occurrence from error messages.
 */
async function rezdyGetReadOnly(pathWithQuery: string, apiKey: string): Promise<ReadOnlyRezdyResult> {
  const normalizedPath = pathWithQuery.startsWith("/") ? pathWithQuery : `/${pathWithQuery}`;
  const url = new URL(`${REZDY_V1_BASE}${normalizedPath}`);
  url.searchParams.set("apiKey", apiKey);

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  const rawText = await res.text();
  let parsed: Record<string, unknown> | null = null;
  try {
    parsed = JSON.parse(rawText) as Record<string, unknown>;
  } catch {
    parsed = { nonJsonPreview: rawText.slice(0, 300) };
  }

  return {
    status: res.status,
    ok: res.ok,
    endpoint: `GET ${REZDY_V1_BASE}${normalizedPath}`,
    data: parsed,
  };
}

function sanitizeProductRecord(raw: unknown): Record<string, unknown> | null {
  if (!raw || typeof raw !== "object") return null;
  const prod = raw as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(prod)) {
    if (k === "images" && Array.isArray(v)) {
      out.imagesCount = v.length;
      out.imageUrls = v
        .slice(0, 4)
        .map((img) =>
          img && typeof img === "object" ? (img as Record<string, unknown>).itemUrl ?? null : null
        )
        .filter(Boolean);
      continue;
    }
    out[k] = v;
  }
  return out;
}

function sanitizeBookingRecordToStructureOnly(raw: unknown): Record<string, unknown> | null {
  if (!raw || typeof raw !== "object") return null;
  const b = raw as Record<string, unknown>;
  const items = Array.isArray(b.items) ? (b.items as Array<Record<string, unknown>>) : [];
  const payments = Array.isArray(b.payments) ? (b.payments as Array<Record<string, unknown>>) : [];
  const fields = Array.isArray(b.fields) ? (b.fields as Array<Record<string, unknown>>) : [];

  return {
    status: b.status ?? null,
    source: b.source ?? null,
    sourceChannel: b.sourceChannel ?? null,
    paymentOption: b.paymentOption ?? null,
    sendNotifications: b.sendNotifications ?? null,
    totalAmount: b.totalAmount ?? null,
    totalCurrency: b.totalCurrency ?? null,
    totalPaid: b.totalPaid ?? null,
    totalDue: b.totalDue ?? null,
    yearCreated: typeof b.dateCreated === "string" ? b.dateCreated.slice(0, 4) : null,
    dateCreatedMonth: typeof b.dateCreated === "string" ? b.dateCreated.slice(0, 7) : null,
    hasResellerReference: Boolean(b.resellerReference),
    fieldLabelsPresent: fields.map((f) => ({
      label: f.label ?? null,
      requiredPerBooking: f.requiredPerBooking ?? null,
      requiredPerParticipant: f.requiredPerParticipant ?? null,
    })),
    itemsStructure: items.map((item) => ({
      productCode: item.productCode ?? null,
      productName: item.productName ?? null,
      startYearMonth: typeof item.startTimeLocal === "string" ? item.startTimeLocal.slice(0, 7) : null,
      amount: item.amount ?? null,
      subtotal: item.subtotal ?? null,
      totalItemTax: item.totalItemTax ?? null,
      totalQuantity: item.totalQuantity ?? null,
      hasPickupLocation: Boolean(item.pickupLocation || item.pickupId),
      pickupLocationName:
        item.pickupLocation && typeof item.pickupLocation === "object"
          ? (item.pickupLocation as Record<string, unknown>).locationName ?? null
          : null,
      participantSlotCount: Array.isArray(item.participants) ? item.participants.length : 0,
      quantities: Array.isArray(item.quantities) ? item.quantities : [],
    })),
    paymentsStructure: payments.map((p) => ({
      type: p.type ?? null,
      recipient: p.recipient ?? null,
      currency: p.currency ?? null,
      amount: p.amount ?? null,
      labelKind:
        typeof p.label === "string"
          ? p.label
              .replace(/(pi_|ch_|tok_|card_|pm_|py_|re_)[A-Za-z0-9_]+/g, "$1[REDACTED]")
              .replace(/\d+/g, "X")
              .slice(0, 60)
          : null,
    })),
  };
}

const SENSITIVE_OBJECT_KEYS = new Set([
  "bookings",
  "booking",
  "customer",
  "email",
  "phone",
  "mobile",
  "fax",
  "comments",
  "internalNotes",
  "participants",
  "vouchers",
  "apiKey",
  "cardToken",
  "creditCard",
]);

function deepRedactSensitiveFields(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(deepRedactSensitiveFields);
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (SENSITIVE_OBJECT_KEYS.has(k)) {
        out[k] = "[REDACTED]";
      } else {
        out[k] = deepRedactSensitiveFields(v);
      }
    }
    return out;
  }
  return value;
}

function scrubSecretsAndPii(payloadObj: unknown, secrets: string[]): Record<string, unknown> {
  const deepCleaned = deepRedactSensitiveFields(payloadObj);
  let clean = JSON.stringify(deepCleaned);
  for (const s of secrets) {
    if (s && s.length >= 6 && clean.includes(s)) {
      clean = clean.split(s).join("[REDACTED_SECRET]");
    }
  }
  clean = clean.replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, "[REDACTED_EMAIL]");
  return JSON.parse(clean) as Record<string, unknown>;
}

const TARGET_CATEGORY_IDS = [
  { id: "541037", label: "Party At Red Rocks (public catalog)" },
  { id: "621841", label: "Private (hidden category)" },
  { id: "638971", label: "Red Rocks Shuttle (hidden category)" },
  { id: "608654", label: "Hotels / Denver hotel to Red Rocks Shuttle (hidden category)" },
  { id: "617787", label: "Shuttles" },
  { id: "562061", label: "Return Trips (hidden category)" },
];

export async function executePhase3aReadOnlyAudit(options: Phase3aAuditOptions = {}) {
  const apiKey = getRezdyApiKey();
  const stripePubKey =
    process.env.REZDY_STRIPE_PUBLISHABLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_REZDY_STRIPE_PUBLISHABLE_KEY?.trim() ||
    "";

  let upstreamGetRequestCount = 0;
  const getTracked = async (pathWithQuery: string) => {
    upstreamGetRequestCount += 1;
    return rezdyGetReadOnly(pathWithQuery, apiKey);
  };

  // 1. Paginated GET /v1/products across entire supplier catalog (2 calls for 125 products)
  const allProducts: Array<Record<string, unknown>> = [];
  let productsEndpointStatus = 0;
  let productsEndpointError: unknown = null;

  for (let offset = 0; offset < 600; offset += 100) {
    const res = await getTracked(`/products?limit=100&offset=${offset}`);
    if (offset === 0) {
      productsEndpointStatus = res.status;
      const reqStatus = res.data?.requestStatus as Record<string, unknown> | undefined;
      productsEndpointError = reqStatus?.error ?? null;
    }
    const batch = Array.isArray(res.data?.products)
      ? (res.data?.products as Array<Record<string, unknown>>)
      : [];
    allProducts.push(...batch);
    if (batch.length < 100) break;
  }

  // 2. Categories / Catalogs inspection via authentic `/categories/{id}/products` subpath
  const [categoriesRes, cat541037DetailRes, probe596193Res, probe630812Res, probe541037Res] =
    await Promise.all([
      getTracked("/categories?limit=100"),
      getTracked("/categories/541037"),
      getTracked("/products/596193"),
      getTracked("/products/630812"),
      getTracked("/products/541037"),
    ]);

  const categoryMemberships: Record<string, unknown> = {};
  const categoryDiscoveredCodes = new Set<string>();

  for (const cat of TARGET_CATEGORY_IDS) {
    const subRes = await getTracked(`/categories/${cat.id}/products?limit=100`);
    const items = Array.isArray(subRes.data?.products)
      ? (subRes.data?.products as Array<Record<string, unknown>>)
      : [];
    for (const p of items) {
      if (typeof p.productCode === "string" && p.productCode) {
        categoryDiscoveredCodes.add(p.productCode);
      }
    }
    categoryMemberships[cat.id] = {
      label: cat.label,
      httpStatus: subRes.status,
      error: (subRes.data?.requestStatus as Record<string, unknown> | undefined)?.error ?? null,
      count: items.length,
      products: items.map((p) => ({
        productCode: p.productCode ?? null,
        id: p.id ?? null,
        internalCode: p.internalCode ?? null,
        name: p.name ?? null,
        productType: p.productType ?? null,
        bookingMode: p.bookingMode ?? null,
        confirmMode: p.confirmMode ?? null,
        isApiBookingSupported: p.isApiBookingSupported ?? null,
        advertisedPrice: p.advertisedPrice ?? null,
        priceOptions: Array.isArray(p.priceOptions) ? p.priceOptions : [],
      })),
    };
  }

  // 3. Determine focused product codes to inspect well below Rezdy's 100 req/min rate limit
  const explicitCodes = (options.codes ?? [])
    .map((c) => c.trim().toUpperCase())
    .filter((c) => /^[A-Z0-9_-]{3,20}$/.test(c));

  const candidateCodes = new Set<string>();
  if (explicitCodes.length > 0) {
    for (const c of explicitCodes) candidateCodes.add(c);
    // Also ensure any products strictly inside catalog 541037 are included
    const cat541037Entry = categoryMemberships["541037"] as
      | { products?: Array<{ productCode?: string | null }> }
      | undefined;
    for (const p of cat541037Entry?.products ?? []) {
      if (p.productCode) candidateCodes.add(p.productCode);
    }
  } else {
    for (const p of allProducts) {
      const code = typeof p.productCode === "string" ? p.productCode : "";
      if (!code) continue;
      const ic = String(p.internalCode ?? "");
      if (ic.toUpperCase().startsWith("GOSNO")) continue;
      const nameStr = String(p.name ?? "");
      const descStr = `${String(p.shortDescription ?? "")} ${String(p.description ?? "")}`;
      if (
        /red rocks|morrison|^suburban$|^van\s*-\s*10|^sprinter van/i.test(nameStr.trim()) ||
        /red rocks/i.test(descStr)
      ) {
        candidateCodes.add(code);
      }
    }
    const cat541037Entry = categoryMemberships["541037"] as
      | { products?: Array<{ productCode?: string | null }> }
      | undefined;
    for (const p of cat541037Entry?.products ?? []) {
      if (p.productCode) candidateCodes.add(p.productCode);
    }
  }

  const detailedProducts: Record<string, unknown> = {};
  const windows2026 = [
    { label: "2026-Apr-Jul", start: "2026-04-01 00:00:00", end: "2026-07-31 23:59:59" },
    { label: "2026-Aug-Dec", start: "2026-08-01 00:00:00", end: "2026-12-31 23:59:59" },
  ];
  const quarterWindows2027 = [
    { label: "2027-Q1", start: "2027-01-01 00:00:00", end: "2027-03-31 23:59:59" },
    { label: "2027-Q2", start: "2027-04-01 00:00:00", end: "2027-06-30 23:59:59" },
    { label: "2027-Q3", start: "2027-07-01 00:00:00", end: "2027-09-30 23:59:59" },
    { label: "2027-Q4", start: "2027-10-01 00:00:00", end: "2027-12-31 23:59:59" },
  ];

  const primaryVehicleCodes = new Set(["P0U1MY", "PJM9GD", "PJWY1B", "PP6ERS"]);

  for (const code of Array.from(candidateCodes)) {
    const includeFull2026 = primaryVehicleCodes.has(code);
    const active2026Windows = includeFull2026
      ? windows2026
      : [{ label: "2026-Nov-Dec", start: "2026-11-18 00:00:00", end: "2026-12-31 23:59:59" }];

    const [prodDetailRes, pickupsRes, bookingsSampleRes] = await Promise.all([
      getTracked(`/products/${encodeURIComponent(code)}`),
      getTracked(`/products/${encodeURIComponent(code)}/pickups`),
      getTracked(`/bookings?productCode=${encodeURIComponent(code)}&limit=5`),
    ]);

    const avail2026Results = await Promise.all(
      active2026Windows.map((w) =>
        getTracked(
          `/availability?productCode=${encodeURIComponent(code)}&startTimeLocal=${encodeURIComponent(w.start)}&endTimeLocal=${encodeURIComponent(w.end)}&limit=200`
        )
      )
    );

    const avail2027QuarterResults = await Promise.all(
      quarterWindows2027.map((w) =>
        getTracked(
          `/availability?productCode=${encodeURIComponent(code)}&startTimeLocal=${encodeURIComponent(w.start)}&endTimeLocal=${encodeURIComponent(w.end)}&limit=200`
        )
      )
    );

    const sessions2026 = avail2026Results.flatMap((r) =>
      Array.isArray(r.data?.sessions) ? (r.data?.sessions as Array<Record<string, unknown>>) : []
    );
    const sessions2027 = avail2027QuarterResults.flatMap((r) =>
      Array.isArray(r.data?.sessions) ? (r.data?.sessions as Array<Record<string, unknown>>) : []
    );

    const rawProduct = prodDetailRes.data?.product ?? prodDetailRes.data;
    const rawBookings = Array.isArray(bookingsSampleRes.data?.bookings)
      ? bookingsSampleRes.data?.bookings
      : [];

    detailedProducts[code] = {
      productHttpStatus: prodDetailRes.status,
      productRawKeys: rawProduct && typeof rawProduct === "object" ? Object.keys(rawProduct) : [],
      product: sanitizeProductRecord(rawProduct),
      pickupsHttpStatus: pickupsRes.status,
      pickups: pickupsRes.data,
      sessions2026: {
        windowStatuses: avail2026Results.map((r, i) => ({
          window: active2026Windows[i].label,
          status: r.status,
          count: Array.isArray(r.data?.sessions) ? r.data?.sessions.length : 0,
          error: (r.data?.requestStatus as Record<string, unknown> | undefined)?.error ?? null,
        })),
        totalCount: sessions2026.length,
        firstSessionStart: sessions2026[0]?.startTimeLocal ?? null,
        lastSessionStart: sessions2026[sessions2026.length - 1]?.startTimeLocal ?? null,
        distinctSessionPriceOptions: Array.from(
          new Set(
            sessions2026.flatMap((s) => {
              const opts = Array.isArray(s.priceOptions)
                ? (s.priceOptions as Array<Record<string, unknown>>)
                : [];
              return opts.map(
                (po) =>
                  `${String(po.label ?? "")}|price=${String(po.price ?? "undefined")}|seatsUsed=${String(po.seatsUsed ?? "")}|groupType=${String(po.priceGroupType ?? "")}`
              );
            })
          )
        ),
        distinctSeatModels: Array.from(
          new Set(
            sessions2026.map(
              (s) =>
                `seats=${String(s.seats ?? "")},seatsAvailable=${String(s.seatsAvailable ?? "")},allDay=${String(s.allDay ?? "")}`
            )
          )
        ),
        sampleSessions: sessions2026.slice(0, 6),
      },
      sessions2027: {
        quarterStatuses: avail2027QuarterResults.map((r, i) => ({
          quarter: quarterWindows2027[i].label,
          status: r.status,
          count: Array.isArray(r.data?.sessions) ? r.data?.sessions.length : 0,
          error: (r.data?.requestStatus as Record<string, unknown> | undefined)?.error ?? null,
        })),
        totalCount: sessions2027.length,
        firstSessionStart: sessions2027[0]?.startTimeLocal ?? null,
        lastSessionStart: sessions2027[sessions2027.length - 1]?.startTimeLocal ?? null,
        distinctSessionPriceOptions: Array.from(
          new Set(
            sessions2027.flatMap((s) => {
              const opts = Array.isArray(s.priceOptions)
                ? (s.priceOptions as Array<Record<string, unknown>>)
                : [];
              return opts.map(
                (po) =>
                  `${String(po.label ?? "")}|price=${String(po.price ?? "undefined")}|seatsUsed=${String(po.seatsUsed ?? "")}|groupType=${String(po.priceGroupType ?? "")}`
              );
            })
          )
        ),
        distinctSeatModels: Array.from(
          new Set(
            sessions2027.map(
              (s) =>
                `seats=${String(s.seats ?? "")},seatsAvailable=${String(s.seatsAvailable ?? "")},allDay=${String(s.allDay ?? "")}`
            )
          )
        ),
        sampleSessions: sessions2027.slice(0, 8),
      },
      redactedRecentBookingsStructure: {
        httpStatus: bookingsSampleRes.status,
        sampledCount: rawBookings.length,
        samples: rawBookings.map(sanitizeBookingRecordToStructureOnly),
      },
    };
  }

  const [globalRecentBookingsRes, resourcesListRes] = await Promise.all([
    getTracked("/bookings?limit=8"),
    getTracked("/resources"),
  ]);

  const rawGlobalBookings = Array.isArray(globalRecentBookingsRes.data?.bookings)
    ? globalRecentBookingsRes.data?.bookings
    : [];

  // Summarize productType x bookingMode distribution across all 125 products for Phase 3A #2
  const productTypeModeBreakdown: Record<string, { count: number; emptyPriceOptionsCount: number }> = {};
  for (const p of allProducts) {
    const key = `${String(p.productType ?? "UNKNOWN")}__${String(p.bookingMode ?? "UNKNOWN")}`;
    if (!productTypeModeBreakdown[key]) {
      productTypeModeBreakdown[key] = { count: 0, emptyPriceOptionsCount: 0 };
    }
    productTypeModeBreakdown[key].count += 1;
    const opts = Array.isArray(p.priceOptions) ? p.priceOptions : [];
    if (opts.length === 0) {
      productTypeModeBreakdown[key].emptyPriceOptionsCount += 1;
    }
  }

  const payload = {
    ok: productsEndpointStatus === 200,
    auditedAt: new Date().toISOString(),
    readOnlyGuarantee: {
      rezdyWritesExecuted: 0,
      allowedHttpMethodsToRezdy: ["GET"],
      upstreamGetRequestCount,
    },
    credentialAndGatewayRuntimeStatus: {
      rezdyApiKeyConfiguredInRuntime: true,
      rezdyApiKeyValidAgainstV1Products: productsEndpointStatus === 200,
      rezdyStripePublishableKeyConfiguredInParrRuntime: Boolean(stripePubKey),
      rezdyStripePublishableKeyMode: stripePubKey.startsWith("pk_live_")
        ? "live"
        : stripePubKey.startsWith("pk_test_")
          ? "test"
          : "not_set_in_parr_yet",
    },
    supplierCatalogSummary: {
      productsEndpointStatus,
      productsEndpointError,
      totalProductsCount: allProducts.length,
      productTypeModeBreakdown,
    },
    categoriesAndNumericIdProbes: {
      categoriesListStatus: categoriesRes.status,
      category541037Detail: {
        status: cat541037DetailRes.status,
        data: cat541037DetailRes.data,
      },
      categoryMemberships,
      directNumericProductProbes: {
        "596193": { status: probe596193Res.status, data: probe596193Res.data },
        "630812": { status: probe630812Res.status, data: probe630812Res.data },
        "541037": { status: probe541037Res.status, data: probe541037Res.data },
      },
    },
    candidateCodesInspected: Array.from(candidateCodes),
    detailedProducts,
    accountPaymentAndNotificationEvidenceFromRedactedOrders: {
      httpStatus: globalRecentBookingsRes.status,
      sampledCount: rawGlobalBookings.length,
      samples: rawGlobalBookings.map(sanitizeBookingRecordToStructureOnly),
    },
    resourcesInspection: {
      listStatus: resourcesListRes.status,
      listData: resourcesListRes.data,
    },
  };

  return scrubSecretsAndPii(payload, [apiKey, stripePubKey]);
}
