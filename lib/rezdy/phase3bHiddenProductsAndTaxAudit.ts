import "server-only";

const REZDY_V1_BASE = "https://api.rezdy.com/v1";

/**
 * Hardcoded safety denylist of existing live PARR / GoSno Rezdy product codes.
 * Phase 3B setup is strictly forbidden from mutating any existing product.
 */
export const FORBIDDEN_LIVE_PRODUCT_CODES = new Set([
  "P0U1MY", // 596193 Live Suburban
  "PJM9GD", // 630812 Live 10-Passenger Van
  "PP6ERS", // Live 14-Passenger Sprinter
  "PJWY1B", // Existing manual Suburban draft
  "P5FACM",
  "PCKHPV",
  "PDQVFH",
  "PLQWXF",
  "PHB8Q5",
]);

export const PARR_2027_HIDDEN_SUBURBAN_INTERNAL_CODE = "PARR_2027_SUBURBAN_API_TEST";
export const PARR_2027_HIDDEN_VAN_INTERNAL_CODE = "PARR_2027_VAN_API_TEST";
export const PARR_CONTROLLED_TEST_SESSION_START_LOCAL = "2027-11-30 16:30:00";

function getRezdyApiKey(): string {
  const key = process.env.REZDY_API_KEY?.trim() || "";
  if (!key) {
    throw new Error("REZDY_API_KEY is not configured in this server runtime.");
  }
  return key;
}

export function assertProductCodeAllowedForPhase3bWrite(productCode: string): void {
  const clean = productCode.trim().toUpperCase();
  if (!clean || FORBIDDEN_LIVE_PRODUCT_CODES.has(clean)) {
    throw new Error(`SAFETY_VIOLATION: Refusing to mutate protected/existing Rezdy product code "${clean}".`);
  }
}

async function rezdyRequest(
  method: "GET" | "POST" | "PUT" | "DELETE",
  pathWithQuery: string,
  apiKey: string,
  bodyObj?: Record<string, unknown>
): Promise<{ status: number; ok: boolean; endpoint: string; data: Record<string, unknown> | null }> {
  const normalizedPath = pathWithQuery.startsWith("/") ? pathWithQuery : `/${pathWithQuery}`;
  const url = new URL(`${REZDY_V1_BASE}${normalizedPath}`);
  url.searchParams.set("apiKey", apiKey);

  const res = await fetch(url.toString(), {
    method,
    headers: {
      Accept: "application/json",
      ...(bodyObj ? { "Content-Type": "application/json" } : {}),
    },
    ...(bodyObj ? { body: JSON.stringify(bodyObj) } : {}),
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
    endpoint: `${method} ${REZDY_V1_BASE}${normalizedPath}`,
    data: parsed,
  };
}

const PII_OBJECT_KEYS = new Set([
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
  "orderNumber",
  "resellerReference",
]);

function redactPiiAndSecrets(value: unknown, secrets: string[]): Record<string, unknown> {
  const walk = (v: unknown): unknown => {
    if (Array.isArray(v)) return v.map(walk);
    if (v && typeof v === "object") {
      const out: Record<string, unknown> = {};
      for (const [k, child] of Object.entries(v as Record<string, unknown>)) {
        if (PII_OBJECT_KEYS.has(k)) {
          out[k] = "[REDACTED]";
        } else if (k === "label" && typeof child === "string" && /pi_|ch_|tok_|REZDY_STRIPE/i.test(child)) {
          out[k] = child.replace(/(pi_|ch_|tok_|card_|pm_)[A-Za-z0-9_]+/g, "$1[REDACTED]");
        } else {
          out[k] = walk(child);
        }
      }
      return out;
    }
    return v;
  };

  let str = JSON.stringify(walk(value));
  for (const s of secrets) {
    if (s && s.length >= 6 && str.includes(s)) {
      str = str.split(s).join("[REDACTED_SECRET]");
    }
  }
  str = str.replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, "[REDACTED_EMAIL]");
  return JSON.parse(str) as Record<string, unknown>;
}

function buildHiddenProductSpec(kind: "suburban" | "van", existingPriceOptionId?: number) {
  const isSuburban = kind === "suburban";
  const price = isSuburban ? 499 : 699;
  const maxGuests = isSuburban ? 6 : 10;
  // Rezdy Track #1: Normal checkout is strictly 1 vehicle (Suburban up to 6 or Van up to 10).
  // Multiple vehicles require the separate /red-rocks/group-transportation flow.
  const maxVehicles = 1;
  const partyListOptions = Array.from({ length: maxGuests }, (_, i) => String(i + 1)).join("\r\n");

  return {
    name: isSuburban
      ? "Private Red Rocks Suburban (2027 Hidden Test)"
      : "Private Red Rocks Van (2027 Hidden Test)",
    internalCode: isSuburban
      ? PARR_2027_HIDDEN_SUBURBAN_INTERNAL_CODE
      : PARR_2027_HIDDEN_VAN_INTERNAL_CODE,
    productType: "PRIVATE_TOUR",
    bookingMode: "INVENTORY",
    confirmMode: "AUTOCONFIRM",
    charter: true,
    currency: "USD",
    advertisedPrice: price,
    unitLabel: "Vehicle",
    unitLabelPlural: "Vehicles",
    quantityRequired: true,
    quantityRequiredMin: 1,
    quantityRequiredMax: maxVehicles,
    durationMinutes: 480,
    minimumNoticeMinutes: 120,
    cancellationPolicyDays: 2,
    shortDescription: isSuburban
      ? "Private round-trip Suburban (1 vehicle, up to 6 guests) for Red Rocks with Upper North Lot tailgating gear and waiting driver."
      : "Private round-trip 10-passenger Van (1 vehicle, up to 10 guests) for Red Rocks with Upper North Lot tailgating gear and waiting driver.",
    description:
      `Private round-trip group transportation for up to ${maxGuests} guests in one dedicated ${isSuburban ? "Suburban" : "10-passenger Van"}. ` +
      `Includes Denver-area door-to-door pickup, one optional grocery or beverage stop en route, Upper North Lot staging with tailgating time, ` +
      `folding chairs, cooler, fresh ice, and Bluetooth speaker, your driver waiting on-site at Red Rocks throughout the entire concert, ` +
      `and your direct return ride home—all for one flat vehicle price. Single-vehicle checkout (1 vehicle); groups needing multiple vehicles use /red-rocks/group-transportation. ` +
      `Excludes concert admission tickets, optional purchases, driver gratuity, and unplanned extra stops.`,
    priceOptions: [
      {
        ...(existingPriceOptionId ? { id: existingPriceOptionId } : {}),
        price,
        label: isSuburban ? "Private Suburban (Up to 6 Guests)" : "Private Van (Up to 10 Guests)",
        seatsUsed: 1,
        minQuantity: 1,
        maxQuantity: maxVehicles,
        priceGroupType: "EACH",
      },
    ],
    bookingFields: [
      {
        label: "First Name",
        fieldType: "String",
        requiredPerBooking: true,
        visiblePerBooking: true,
        requiredPerParticipant: false,
        visiblePerParticipant: false,
      },
      {
        label: "Last Name",
        fieldType: "String",
        requiredPerBooking: true,
        visiblePerBooking: true,
        requiredPerParticipant: false,
        visiblePerParticipant: false,
      },
      {
        label: "Email",
        fieldType: "String",
        requiredPerBooking: true,
        visiblePerBooking: true,
        requiredPerParticipant: false,
        visiblePerParticipant: false,
      },
      {
        label: "Mobile",
        fieldType: "Phone",
        requiredPerBooking: true,
        visiblePerBooking: true,
        requiredPerParticipant: false,
        visiblePerParticipant: false,
      },
      {
        label: "Pickup Address",
        fieldType: "String",
        requiredPerBooking: true,
        visiblePerBooking: true,
        requiredPerParticipant: false,
        visiblePerParticipant: false,
      },
      {
        label: `Party Size (1-${maxGuests} Guests)`,
        fieldType: "List",
        listOptions: partyListOptions,
        requiredPerBooking: true,
        visiblePerBooking: true,
        requiredPerParticipant: false,
        visiblePerParticipant: false,
      },
      {
        label: "Concert / Artist & Trip Notes",
        fieldType: "String",
        requiredPerBooking: false,
        visiblePerBooking: true,
        requiredPerParticipant: false,
        visiblePerParticipant: false,
      },
    ],
    productSeoTags: [
      {
        metaType: "NOINDEX",
        attrKey: "noindex",
        attrValue: "1",
      },
    ],
    locationAddress: {
      addressLine: "18300 W Alameda Pkwy",
      city: "Morrison",
      state: "CO",
      postCode: "80465",
      countryCode: "us",
      latitude: 39.6654,
      longitude: -105.2057,
    },
  };
}

async function ensureSingleTestSession(
  productCode: string,
  apiKey: string,
  refreshSessionPriceOptions = false
) {
  assertProductCodeAllowedForPhase3bWrite(productCode);

  const existingAvail = await rezdyRequest(
    "GET",
    `/availability?productCode=${encodeURIComponent(productCode)}&startTimeLocal=${encodeURIComponent("2027-01-01 00:00:00")}&endTimeLocal=${encodeURIComponent("2027-12-31 23:59:59")}&limit=50`,
    apiKey
  );
  const existingSessions = Array.isArray(existingAvail.data?.sessions)
    ? (existingAvail.data?.sessions as Array<Record<string, unknown>>)
    : [];

  if (existingSessions.length > 0 && !refreshSessionPriceOptions) {
    return {
      createdNewSession: false,
      refreshedExistingSessions: false,
      sessionCountIn2027: existingSessions.length,
      sessions: existingSessions,
    };
  }

  // When updating product priceOption maxQuantity -> 1, recreate the controlled off-season test session
  // so session-cached priceOptions reflect minQuantity: 1, maxQuantity: 1 cleanly.
  if (existingSessions.length > 0 && refreshSessionPriceOptions) {
    for (const s of existingSessions) {
      if (s.id != null) {
        await rezdyRequest("DELETE", `/availability/${encodeURIComponent(String(s.id))}`, apiKey);
      }
    }
  }

  const createSessionRes = await rezdyRequest("POST", "/availability", apiKey, {
    productCode,
    startTimeLocal: PARR_CONTROLLED_TEST_SESSION_START_LOCAL,
    seats: 1,
    seatsAvailable: 1,
  });

  const verifyAvail = await rezdyRequest(
    "GET",
    `/availability?productCode=${encodeURIComponent(productCode)}&startTimeLocal=${encodeURIComponent("2027-01-01 00:00:00")}&endTimeLocal=${encodeURIComponent("2027-12-31 23:59:59")}&limit=50`,
    apiKey
  );
  const verifiedSessions = Array.isArray(verifyAvail.data?.sessions)
    ? (verifyAvail.data?.sessions as Array<Record<string, unknown>>)
    : [];

  return {
    createdNewSession: true,
    refreshedExistingSessions: refreshSessionPriceOptions && existingSessions.length > 0,
    createHttpStatus: createSessionRes.status,
    createResponseStatus: createSessionRes.data?.requestStatus ?? null,
    sessionCountIn2027: verifiedSessions.length,
    sessions: verifiedSessions,
  };
}

export async function executePhase3bSetupAndTaxInvestigation(options: {
  provisionProducts: boolean;
  syncSingleVehicleQuantity?: boolean;
}) {
  const apiKey = getRezdyApiKey();

  // 1. Inspect existing catalog to ensure idempotency
  const allProducts: Array<Record<string, unknown>> = [];
  for (const offset of [0, 100, 200]) {
    const res = await rezdyRequest("GET", `/products?limit=100&offset=${offset}`, apiKey);
    const batch = Array.isArray(res.data?.products)
      ? (res.data?.products as Array<Record<string, unknown>>)
      : [];
    allProducts.push(...batch);
    if (batch.length < 100) break;
  }

  let suburbanProd = allProducts.find(
    (p) => p.internalCode === PARR_2027_HIDDEN_SUBURBAN_INTERNAL_CODE
  );
  let vanProd = allProducts.find(
    (p) => p.internalCode === PARR_2027_HIDDEN_VAN_INTERNAL_CODE
  );

  const provisioningLog: Record<string, unknown> = {
    provisionRequested: options.provisionProducts,
    syncSingleVehicleQuantityRequested: Boolean(options.syncSingleVehicleQuantity),
    suburbanCreatedNow: false,
    vanCreatedNow: false,
    suburbanUpdatedQuantityToOne: false,
    vanUpdatedQuantityToOne: false,
  };

  if (options.provisionProducts) {
    if (!suburbanProd) {
      const spec = buildHiddenProductSpec("suburban");
      const createRes = await rezdyRequest("POST", "/products", apiKey, spec);
      provisioningLog.suburbanCreateStatus = createRes.status;
      provisioningLog.suburbanCreateRequestStatus = createRes.data?.requestStatus ?? null;
      if (createRes.data?.product && typeof createRes.data.product === "object") {
        suburbanProd = createRes.data.product as Record<string, unknown>;
        provisioningLog.suburbanCreatedNow = true;
      }
    }

    if (!vanProd) {
      const spec = buildHiddenProductSpec("van");
      const createRes = await rezdyRequest("POST", "/products", apiKey, spec);
      provisioningLog.vanCreateStatus = createRes.status;
      provisioningLog.vanCreateRequestStatus = createRes.data?.requestStatus ?? null;
      if (createRes.data?.product && typeof createRes.data.product === "object") {
        vanProd = createRes.data.product as Record<string, unknown>;
        provisioningLog.vanCreatedNow = true;
      }
    }
  }

  if (options.syncSingleVehicleQuantity) {
    if (suburbanProd && typeof suburbanProd.productCode === "string") {
      const code = suburbanProd.productCode;
      assertProductCodeAllowedForPhase3bWrite(code);
      const existingOptId = Array.isArray(suburbanProd.priceOptions) && suburbanProd.priceOptions[0]
        ? Number((suburbanProd.priceOptions[0] as Record<string, unknown>).id) || undefined
        : undefined;
      const spec = buildHiddenProductSpec("suburban", existingOptId);
      const putRes = await rezdyRequest("PUT", `/products/${encodeURIComponent(code)}`, apiKey, {
        ...spec,
        productCode: code,
      });
      provisioningLog.suburbanPutStatus = putRes.status;
      provisioningLog.suburbanPutRequestStatus = putRes.data?.requestStatus ?? null;
      provisioningLog.suburbanUpdatedQuantityToOne = putRes.ok;
    }

    if (vanProd && typeof vanProd.productCode === "string") {
      const code = vanProd.productCode;
      assertProductCodeAllowedForPhase3bWrite(code);
      const existingOptId = Array.isArray(vanProd.priceOptions) && vanProd.priceOptions[0]
        ? Number((vanProd.priceOptions[0] as Record<string, unknown>).id) || undefined
        : undefined;
      const spec = buildHiddenProductSpec("van", existingOptId);
      const putRes = await rezdyRequest("PUT", `/products/${encodeURIComponent(code)}`, apiKey, {
        ...spec,
        productCode: code,
      });
      provisioningLog.vanPutStatus = putRes.status;
      provisioningLog.vanPutRequestStatus = putRes.data?.requestStatus ?? null;
      provisioningLog.vanUpdatedQuantityToOne = putRes.ok;
    }
  }

  // Read back full product details + seed/refresh 1 controlled test session each
  let suburbanVerification: Record<string, unknown> | null = null;
  let vanVerification: Record<string, unknown> | null = null;

  if (suburbanProd && typeof suburbanProd.productCode === "string") {
    const code = suburbanProd.productCode;
    const detail = await rezdyRequest("GET", `/products/${encodeURIComponent(code)}`, apiKey);
    const sess =
      options.provisionProducts || options.syncSingleVehicleQuantity
        ? await ensureSingleTestSession(code, apiKey, Boolean(options.syncSingleVehicleQuantity))
        : null;
    suburbanVerification = {
      productCode: code,
      httpStatus: detail.status,
      product: detail.data?.product ?? detail.data,
      testSessionVerification: sess,
    };
  }

  if (vanProd && typeof vanProd.productCode === "string") {
    const code = vanProd.productCode;
    const detail = await rezdyRequest("GET", `/products/${encodeURIComponent(code)}`, apiKey);
    const sess =
      options.provisionProducts || options.syncSingleVehicleQuantity
        ? await ensureSingleTestSession(code, apiKey, Boolean(options.syncSingleVehicleQuantity))
        : null;
    vanVerification = {
      productCode: code,
      httpStatus: detail.status,
      product: detail.data?.product ?? detail.data,
      testSessionVerification: sess,
    };
  }

  // Verify public catalog 541037 was NOT polluted by our hidden products
  const cat541037Check = await rezdyRequest("GET", "/categories/541037/products?limit=100", apiKey);
  const cat541037Codes = Array.isArray(cat541037Check.data?.products)
    ? (cat541037Check.data?.products as Array<Record<string, unknown>>).map((p) => p.productCode)
    : [];

  // 2. Deep Read-Only Tax/Fee Investigation across raw Booking & Product structures + /bookings/quote probe
  const [recentBookingsRaw, p0u1myBookingsRaw, pjm9gdBookingsRaw, p0u1myProdRaw, pjm9gdProdRaw, p7477sProdRaw] =
    await Promise.all([
      rezdyRequest("GET", "/bookings?limit=8", apiKey),
      rezdyRequest("GET", "/bookings?productCode=P0U1MY&limit=5", apiKey),
      rezdyRequest("GET", "/bookings?productCode=PJM9GD&limit=5", apiKey),
      rezdyRequest("GET", "/products/P0U1MY", apiKey),
      rezdyRequest("GET", "/products/PJM9GD", apiKey),
      rezdyRequest("GET", "/products/P7477S", apiKey),
    ]);

  const extractProductTaxFields = (resData: Record<string, unknown> | null) => {
    const prod = (resData?.product ?? resData) as Record<string, unknown> | null;
    if (!prod || typeof prod !== "object") return null;
    return {
      productCode: prod.productCode ?? null,
      name: prod.name ?? null,
      productKeys: Object.keys(prod),
      taxes: prod.taxes ?? null,
      taxExempt: prod.taxExempt ?? null,
      surcharge: prod.surcharge ?? null,
      creditCardFee: prod.creditCardFee ?? null,
      bookingFee: prod.bookingFee ?? null,
      agentPaymentType: prod.agentPaymentType ?? null,
      commissionIncludesExtras: prod.commissionIncludesExtras ?? null,
    };
  };

  const extractTaxEvidence = (resData: Record<string, unknown> | null) => {
    const list = Array.isArray(resData?.bookings)
      ? (resData?.bookings as Array<Record<string, unknown>>)
      : [];
    return list.map((b) => {
      const items = Array.isArray(b.items) ? (b.items as Array<Record<string, unknown>>) : [];
      return {
        bookingRootKeys: Object.keys(b),
        source: b.source ?? null,
        sourceChannel: b.sourceChannel ?? null,
        status: b.status ?? null,
        paymentOption: b.paymentOption ?? null,
        dateCreatedMonth: typeof b.dateCreated === "string" ? b.dateCreated.slice(0, 7) : null,
        totalAmount: b.totalAmount ?? null,
        totalPaid: b.totalPaid ?? null,
        totalDue: b.totalDue ?? null,
        surcharge: b.surcharge ?? null,
        creditCardFee: b.creditCardFee ?? null,
        taxesOnBookingRoot: b.taxes ?? null,
        feesOnBookingRoot: b.fees ?? null,
        commission: b.commission ?? null,
        itemsTaxBreakdown: items.map((it) => ({
          itemKeys: Object.keys(it),
          productCode: it.productCode ?? null,
          productName: it.productName ?? null,
          amount: it.amount ?? null,
          subtotal: it.subtotal ?? null,
          totalItemTax: it.totalItemTax ?? null,
          computedRatePct:
            typeof it.amount === "number" && it.amount > 0 && typeof it.totalItemTax === "number"
              ? Number(((it.totalItemTax / it.amount) * 100).toFixed(4))
              : null,
          taxesArrayOnItem: it.taxes ?? null,
          extrasOnItem: it.extras ?? null,
          quantities: it.quantities ?? null,
        })),
      };
    });
  };

  // Probe stateless quote calculation (`POST /v1/bookings/quote`) on the new hidden Suburban & Van test products if they exist
  // Note: /v1/bookings/quote is Rezdy's stateless quote preview endpoint (creates zero bookings and sends zero notifications).
  let quoteProbeSuburbanResult: Record<string, unknown> | null = null;
  if (suburbanVerification && typeof suburbanVerification.productCode === "string") {
    const subCode = suburbanVerification.productCode;
    const subProdObj = suburbanVerification.product as Record<string, unknown> | undefined;
    const optLabel =
      Array.isArray(subProdObj?.priceOptions) && subProdObj?.priceOptions[0]
        ? String((subProdObj.priceOptions[0] as Record<string, unknown>).label ?? "Private Suburban (Up to 6)")
        : "Private Suburban (Up to 6)";

    const quoteRes = await rezdyRequest("POST", "/bookings/quote", apiKey, {
      customer: {
        firstName: "Quote",
        lastName: "Probe",
        email: "noreply@partyatredrocks.com",
      },
      items: [
        {
          productCode: subCode,
          startTimeLocal: PARR_CONTROLLED_TEST_SESSION_START_LOCAL,
          quantities: [{ optionLabel: optLabel, value: 1 }],
        },
      ],
    });
    quoteProbeSuburbanResult = {
      httpStatus: quoteRes.status,
      ok: quoteRes.ok,
      response: quoteRes.data,
    };
  }

  let quoteProbeVanResult: Record<string, unknown> | null = null;
  if (vanVerification && typeof vanVerification.productCode === "string") {
    const vanCode = vanVerification.productCode;
    const vanProdObj = vanVerification.product as Record<string, unknown> | undefined;
    const optLabel =
      Array.isArray(vanProdObj?.priceOptions) && vanProdObj?.priceOptions[0]
        ? String((vanProdObj.priceOptions[0] as Record<string, unknown>).label ?? "Private Van (Up to 10)")
        : "Private Van (Up to 10)";

    const quoteRes = await rezdyRequest("POST", "/bookings/quote", apiKey, {
      customer: {
        firstName: "Quote",
        lastName: "Probe",
        email: "noreply@partyatredrocks.com",
      },
      items: [
        {
          productCode: vanCode,
          startTimeLocal: PARR_CONTROLLED_TEST_SESSION_START_LOCAL,
          quantities: [{ optionLabel: optLabel, value: 1 }],
        },
      ],
    });
    quoteProbeVanResult = {
      httpStatus: quoteRes.status,
      ok: quoteRes.ok,
      response: quoteRes.data,
    };
  }

  return redactPiiAndSecrets(
    {
      ok: true,
      executedAt: new Date().toISOString(),
      safetyVerification: {
        liveProductsProtectedAndUntouched: Array.from(FORBIDDEN_LIVE_PRODUCT_CODES),
        publicCatalog541037ProductCodes: cat541037Codes,
        hiddenSuburbanInPublicCatalog541037:
          Boolean(suburbanVerification?.productCode) &&
          cat541037Codes.includes(suburbanVerification?.productCode),
        hiddenVanInPublicCatalog541037:
          Boolean(vanVerification?.productCode) &&
          cat541037Codes.includes(vanVerification?.productCode),
      },
      provisioningLog,
      hidden2027SuburbanTestProduct: suburbanVerification,
      hidden2027VanTestProduct: vanVerification,
      taxAndFeeForensics: {
        productTaxFieldsComparison: {
          p0u1my: extractProductTaxFields(p0u1myProdRaw.data),
          pjm9gd: extractProductTaxFields(pjm9gdProdRaw.data),
          p7477s: extractProductTaxFields(p7477sProdRaw.data),
          newHiddenSuburban: suburbanVerification
            ? extractProductTaxFields({ product: suburbanVerification.product })
            : null,
          newHiddenVan: vanVerification
            ? extractProductTaxFields({ product: vanVerification.product })
            : null,
        },
        quoteEndpointProbeOnNewHiddenSuburban: quoteProbeSuburbanResult,
        quoteEndpointProbeOnNewHiddenVan: quoteProbeVanResult,
        recentAccountBookingsTaxBreakdown: extractTaxEvidence(recentBookingsRaw.data),
        p0u1mySuburbanBookingsTaxBreakdown: extractTaxEvidence(p0u1myBookingsRaw.data),
        pjm9gdVanBookingsTaxBreakdown: extractTaxEvidence(pjm9gdBookingsRaw.data),
      },
    },
    [apiKey]
  );
}
