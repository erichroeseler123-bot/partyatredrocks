import "server-only";

const REZDY_V1_BASE = "https://api.rezdy.com/v1";

type ReadOnlyRezdyResult = {
  status: number;
  ok: boolean;
  endpoint: string;
  data: Record<string, unknown> | null;
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
    // Strip verbose image binary/gallery arrays to keep payload crisp, keep count
    if (k === "images" && Array.isArray(v)) {
      out.imagesCount = v.length;
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
      // Redact any card digits if label contains numbers; keep gateway/method word
      labelKind:
        typeof p.label === "string"
          ? p.label.replace(/\d+/g, "X").slice(0, 60)
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

export async function executePhase3aReadOnlyAudit() {
  const apiKey = getRezdyApiKey();
  const stripePubKey =
    process.env.REZDY_STRIPE_PUBLISHABLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_REZDY_STRIPE_PUBLISHABLE_KEY?.trim() ||
    "";

  // 1. Paginated GET /v1/products across entire supplier catalog
  const allProducts: Array<Record<string, unknown>> = [];
  let productsEndpointStatus = 0;
  let productsEndpointError: unknown = null;

  for (let offset = 0; offset < 600; offset += 100) {
    const res = await rezdyGetReadOnly(`/products?limit=100&offset=${offset}`, apiKey);
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

  // 2. Categories / Catalogs inspection (specifically catalog 541037 & legacy 638971)
  const [
    categoriesRes,
    cat541037DetailRes,
    cat541037ProductsQueryRes,
    cat541037SubpathRes,
    cat638971ProductsQueryRes,
    probe596193Res,
    probe630812Res,
    probe541037Res,
  ] = await Promise.all([
    rezdyGetReadOnly("/categories?limit=100", apiKey),
    rezdyGetReadOnly("/categories/541037", apiKey),
    rezdyGetReadOnly("/products?category=541037&limit=100", apiKey),
    rezdyGetReadOnly("/categories/541037/products?limit=100", apiKey),
    rezdyGetReadOnly("/products?category=638971&limit=100", apiKey),
    rezdyGetReadOnly("/products/596193", apiKey),
    rezdyGetReadOnly("/products/630812", apiKey),
    rezdyGetReadOnly("/products/541037", apiKey),
  ]);

  const cat541037Products = Array.isArray(cat541037ProductsQueryRes.data?.products)
    ? (cat541037ProductsQueryRes.data?.products as Array<Record<string, unknown>>)
    : Array.isArray(cat541037SubpathRes.data?.products)
      ? (cat541037SubpathRes.data?.products as Array<Record<string, unknown>>)
      : [];

  const cat638971Products = Array.isArray(cat638971ProductsQueryRes.data?.products)
    ? (cat638971ProductsQueryRes.data?.products as Array<Record<string, unknown>>)
    : [];

  // 3. Identify every candidate PARR / Red Rocks / Suburban / 10-Passenger Van product
  const candidateCodes = new Set<string>();
  for (const p of [...cat541037Products, ...cat638971Products]) {
    if (typeof p.productCode === "string") candidateCodes.add(p.productCode);
  }
  for (const p of allProducts) {
    const code = typeof p.productCode === "string" ? p.productCode : "";
    if (!code) continue;
    const blob = JSON.stringify({
      code,
      id: p.id,
      internalCode: p.internalCode,
      name: p.name,
      shortDescription: p.shortDescription,
      description: p.description,
      productType: p.productType,
    }).toLowerCase();

    if (
      blob.includes("red rocks") ||
      blob.includes("596193") ||
      blob.includes("630812") ||
      blob.includes("541037") ||
      blob.includes("morrison") ||
      /^suburban$/i.test(String(p.name ?? "").trim()) ||
      /10[\s-]*passenger|van[\s-]*10|^van$/i.test(String(p.name ?? "").trim()) ||
      /suburban/i.test(String(p.name ?? ""))
    ) {
      candidateCodes.add(code);
    }
  }

  // Include 1 GoSno SUV & 1 GoSno Van reference product for structural comparison
  const referenceCodes = ["P7477S", "PKQDPG"].filter((c) =>
    allProducts.some((p) => p.productCode === c)
  );

  const detailedProducts: Record<string, unknown> = {};
  const quarterWindows2027 = [
    { label: "2027-Q1", start: "2027-01-01 00:00:00", end: "2027-03-31 23:59:59" },
    { label: "2027-Q2", start: "2027-04-01 00:00:00", end: "2027-06-30 23:59:59" },
    { label: "2027-Q3", start: "2027-07-01 00:00:00", end: "2027-09-30 23:59:59" },
    { label: "2027-Q4", start: "2027-10-01 00:00:00", end: "2027-12-31 23:59:59" },
  ];

  for (const code of Array.from(candidateCodes)) {
    const [prodDetailRes, pickupsRes, avail2026Res, ...avail2027QuarterResults] = await Promise.all([
      rezdyGetReadOnly(`/products/${encodeURIComponent(code)}`, apiKey),
      rezdyGetReadOnly(`/products/${encodeURIComponent(code)}/pickups`, apiKey),
      rezdyGetReadOnly(
        `/availability?productCode=${encodeURIComponent(code)}&startTimeLocal=${encodeURIComponent("2026-11-18 00:00:00")}&endTimeLocal=${encodeURIComponent("2026-12-31 23:59:59")}&limit=200`,
        apiKey
      ),
      ...quarterWindows2027.map((w) =>
        rezdyGetReadOnly(
          `/availability?productCode=${encodeURIComponent(code)}&startTimeLocal=${encodeURIComponent(w.start)}&endTimeLocal=${encodeURIComponent(w.end)}&limit=200`,
          apiKey
        )
      ),
    ]);

    const bookingsSampleRes = await rezdyGetReadOnly(
      `/bookings?productCode=${encodeURIComponent(code)}&limit=5`,
      apiKey
    );

    const sessions2026 = Array.isArray(avail2026Res.data?.sessions)
      ? (avail2026Res.data?.sessions as Array<Record<string, unknown>>)
      : [];
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
        httpStatus: avail2026Res.status,
        error: (avail2026Res.data?.requestStatus as Record<string, unknown> | undefined)?.error ?? null,
        totalCount: sessions2026.length,
        sampleSessions: sessions2026.slice(0, 5),
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
              (s) => `seats=${String(s.seats ?? "")},seatsAvailable=${String(s.seatsAvailable ?? "")},allDay=${String(s.allDay ?? "")}`
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

  // 4. Reference GoSno products + global recent booking payment-gateway structure + resources check
  const referenceProducts: Record<string, unknown> = {};
  for (const refCode of referenceCodes) {
    const r = await rezdyGetReadOnly(`/products/${encodeURIComponent(refCode)}`, apiKey);
    referenceProducts[refCode] = sanitizeProductRecord(r.data?.product ?? r.data);
  }

  const [globalRecentBookingsRes, resourcesListRes, ...resourceProbeResults] = await Promise.all([
    rezdyGetReadOnly("/bookings?limit=8", apiKey),
    rezdyGetReadOnly("/resources", apiKey),
    ...["102357", "91158", "102358", "102359", "92540", "83735"].map((rid) =>
      rezdyGetReadOnly(`/resources/${rid}`, apiKey)
    ),
  ]);

  const rawGlobalBookings = Array.isArray(globalRecentBookingsRes.data?.bookings)
    ? globalRecentBookingsRes.data?.bookings
    : [];

  const payload = {
    ok: productsEndpointStatus === 200,
    auditedAt: new Date().toISOString(),
    readOnlyGuarantee: {
      rezdyWritesExecuted: 0,
      allowedHttpMethodsToRezdy: ["GET"],
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
      allProductsIndex: allProducts.map((p) => ({
        productCode: p.productCode ?? null,
        id: p.id ?? null,
        internalCode: p.internalCode ?? null,
        name: p.name ?? null,
        productType: p.productType ?? null,
        bookingMode: p.bookingMode ?? null,
        isApiBookingSupported: p.isApiBookingSupported ?? null,
        confirmMode: p.confirmMode ?? null,
        advertisedPrice: p.advertisedPrice ?? null,
        priceOptions: Array.isArray(p.priceOptions) ? p.priceOptions : [],
      })),
    },
    categoriesAndNumericIdProbes: {
      categoriesListStatus: categoriesRes.status,
      categoriesList: categoriesRes.data?.categories ?? categoriesRes.data,
      category541037Detail: {
        status: cat541037DetailRes.status,
        data: cat541037DetailRes.data,
      },
      category541037Products: {
        queryStatus: cat541037ProductsQueryRes.status,
        subpathStatus: cat541037SubpathRes.status,
        count: cat541037Products.length,
        productCodes: cat541037Products.map((p) => ({
          productCode: p.productCode ?? null,
          id: p.id ?? null,
          name: p.name ?? null,
          productType: p.productType ?? null,
          bookingMode: p.bookingMode ?? null,
          isApiBookingSupported: p.isApiBookingSupported ?? null,
        })),
      },
      category638971Products: {
        queryStatus: cat638971ProductsQueryRes.status,
        count: cat638971Products.length,
        productCodes: cat638971Products.map((p) => ({
          productCode: p.productCode ?? null,
          name: p.name ?? null,
        })),
      },
      directNumericProductProbes: {
        "596193": { status: probe596193Res.status, data: probe596193Res.data },
        "630812": { status: probe630812Res.status, data: probe630812Res.data },
        "541037": { status: probe541037Res.status, data: probe541037Res.data },
      },
    },
    candidateCodesInspected: Array.from(candidateCodes),
    detailedProducts,
    referenceComparisonProducts: referenceProducts,
    accountPaymentAndNotificationEvidenceFromRedactedOrders: {
      httpStatus: globalRecentBookingsRes.status,
      sampledCount: rawGlobalBookings.length,
      samples: rawGlobalBookings.map(sanitizeBookingRecordToStructureOnly),
    },
    resourcesInspection: {
      listStatus: resourcesListRes.status,
      listData: resourcesListRes.data,
      knownVehicleResourceProbes: Object.fromEntries(
        ["102357", "91158", "102358", "102359", "92540", "83735"].map((rid, idx) => [
          rid,
          {
            status: resourceProbeResults[idx].status,
            data: resourceProbeResults[idx].data,
          },
        ])
      ),
    },
  };

  return scrubSecretsAndPii(payload, [apiKey, stripePubKey]);
}
