import fs from "node:fs";
import path from "node:path";
import { DCC_ORIGIN, type HandoffSearchParams } from "@/lib/parrHandoff";

export const PARR_SATELLITE_ID = "partyatredrocks";
const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";
const DEFAULT_DCC_CALLBACK_URL = "https://www.destinationcommandcenter.com/api/internal/satellite-handoffs/events";
const HANDOFF_ROOT = path.join(process.cwd(), "data", "handoffs", "dcc");

function liveDccCallbacksEnabled() {
  return process.env.DCC_ENABLE_LIVE_CALLBACKS !== "false";
}

export type DccSatelliteEventType =
  | "handoff_viewed"
  | "lead_captured"
  | "booking_started"
  | "booking_completed"
  | "booking_failed"
  | "booking_cancelled"
  | "status_updated"
  | "traveler_returned"
  | "forwarded_to_partner"
  | "accepted_from_partner"
  | "partner_booking_completed"
  | "partner_booking_failed";

export type DccSatelliteContext = {
  handoffId?: string;
  returnUrl?: string;
  source?: string;
  sourceSlug?: string;
  sourcePage?: string;
  topicSlug?: string;
  venueSlug?: string;
  eventDate?: string;
  quantity?: number;
  artist?: string;
  event?: string;
  partnerSatelliteId?: "partyatredrocks" | "gosno" | "welcome-to-alaska";
  partnerReason?: string;
  partnerHandoffId?: string;
};

export type DccSatellitePartner = {
  fromSite?: "partyatredrocks" | "gosno" | "welcome-to-alaska";
  toSite?: "partyatredrocks" | "gosno" | "welcome-to-alaska";
  partnerHandoffId?: string;
  reason?: string;
};

const WTA_FORWARD_SOURCE_SLUG = "wta-network-forward";
const WTA_FORWARD_SOURCE_PAGE = "/handoff/partner/partyatredrocks";
const WTA_FORWARD_TOPIC_SLUG = "concert-transport";

export type DccSatelliteStoredEvent = {
  callbackId: string;
  handoffId: string;
  eventType: DccSatelliteEventType;
  sourcePath?: string;
  status?: string;
  stage?: string;
  externalReference?: string | null;
  createdAt: string;
  deliveredAt?: string;
  attempts: number;
  lastError?: string;
  skipped?: boolean;
};

export type DccSatelliteHandoffSession = {
  handoffId: string;
  source: string | null;
  sourceSlug: string | null;
  sourcePage: string | null;
  topicSlug: string | null;
  venueSlug: string | null;
  eventDate: string | null;
  quantity: number | null;
  artist: string | null;
  event: string | null;
  returnUrl: string | null;
  firstSeenAt: string;
  lastSeenAt: string;
  lastEventType: DccSatelliteEventType | null;
  callbackIds: string[];
};

function normalizeEventDate(value?: string | null) {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return parsed.toISOString().slice(0, 10);
}

function normalizeCurrency(value?: string | null) {
  const trimmed = String(value || "").trim().toUpperCase();
  return /^[A-Z]{3}$/.test(trimmed) ? trimmed : undefined;
}

function inferTopicSlug(input: {
  context: DccSatelliteContext;
  sourcePath?: string;
  productSlug?: string;
}) {
  if (input.context.topicSlug) return input.context.topicSlug;
  if (
    input.context.partnerSatelliteId === "welcome-to-alaska" ||
    input.context.sourceSlug === WTA_FORWARD_SOURCE_SLUG ||
    input.context.sourcePage === WTA_FORWARD_SOURCE_PAGE
  ) {
    return WTA_FORWARD_TOPIC_SLUG;
  }
  const product = String(input.productSlug || "").toLowerCase();
  const sourcePath = String(input.sourcePath || "").toLowerCase();

  if (product.includes("shared") || sourcePath.includes("/shared") || sourcePath.includes("shuttle")) {
    return "shuttle";
  }
  if (
    product.includes("private") ||
    product.includes("suv") ||
    product.includes("van") ||
    product.includes("sprinter") ||
    product.includes("party-bus") ||
    sourcePath.includes("/private")
  ) {
    return "private-rides";
  }
  if (sourcePath.includes("/book") || sourcePath.includes("/red-rocks")) {
    return "concert-transportation";
  }
  return undefined;
}

function normalizePartnerSatelliteId(value?: string | null) {
  if (value === "partyatredrocks" || value === "gosno" || value === "welcome-to-alaska") {
    return value;
  }
  return undefined;
}

function firstValue(searchParams: HandoffSearchParams | undefined, key: string) {
  if (!searchParams) return undefined;
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] : value;
}

function toPositiveInt(value: string | undefined) {
  if (!value) return undefined;
  const out = Number(value);
  return Number.isFinite(out) && out > 0 ? out : undefined;
}

function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

function logPersistenceFailure(action: string, error: unknown, details?: Record<string, string | undefined>) {
  const message = error instanceof Error ? error.message : String(error);
  console.error("[dccSatellite] persistence failure", {
    action,
    message,
    ...(details || {}),
  });
}

function handoffDir(handoffId: string) {
  return path.join(HANDOFF_ROOT, "by-handoff", handoffId);
}

function handoffSessionFile(handoffId: string) {
  return path.join(handoffDir(handoffId), "session.json");
}

function handoffEventsFile(handoffId: string) {
  return path.join(handoffDir(handoffId), "events.ndjson");
}

function callbackLogFile() {
  return path.join(HANDOFF_ROOT, "callbacks.ndjson");
}

function callbackFailureFile() {
  return path.join(HANDOFF_ROOT, "callback-failures.ndjson");
}

function compactObject<T extends Record<string, unknown>>(input: T): T {
  return Object.fromEntries(
    Object.entries(input).filter(([, value]) => value !== undefined && value !== null && value !== "")
  ) as T;
}

function compactNestedObject<T extends Record<string, unknown>>(input: T) {
  const compacted = compactObject(input);
  return Object.keys(compacted).length ? compacted : undefined;
}

export function getDccSatelliteContext(
  searchParams?: HandoffSearchParams,
  defaults?: Partial<DccSatelliteContext>
): DccSatelliteContext {
  return {
    handoffId: defaults?.handoffId || firstValue(searchParams, "dcc_handoff_id"),
    returnUrl: defaults?.returnUrl || firstValue(searchParams, "dcc_return"),
    source: defaults?.source || firstValue(searchParams, "source"),
    sourceSlug: defaults?.sourceSlug || firstValue(searchParams, "source_slug"),
    sourcePage: defaults?.sourcePage || firstValue(searchParams, "source_page"),
    topicSlug: defaults?.topicSlug || firstValue(searchParams, "topic"),
    venueSlug: defaults?.venueSlug || firstValue(searchParams, "venue"),
    eventDate: normalizeEventDate(defaults?.eventDate || firstValue(searchParams, "date")),
    quantity: defaults?.quantity ?? toPositiveInt(firstValue(searchParams, "qty")),
    artist: defaults?.artist || firstValue(searchParams, "artist"),
    event: defaults?.event || firstValue(searchParams, "event"),
    partnerSatelliteId: normalizePartnerSatelliteId(
      defaults?.partnerSatelliteId || firstValue(searchParams, "partner_satellite")
    ),
    partnerReason: defaults?.partnerReason || firstValue(searchParams, "partner_reason"),
    partnerHandoffId: defaults?.partnerHandoffId || firstValue(searchParams, "partner_handoff_id"),
  };
}

export function hasDccSatelliteContext(searchParams?: HandoffSearchParams) {
  const context = getDccSatelliteContext(searchParams);
  return context.source === "dcc" && Boolean(context.handoffId);
}

export function isWtaPartnerForward(
  searchParams?: HandoffSearchParams,
  defaults?: Partial<DccSatelliteContext>
) {
  const context = getDccSatelliteContext(searchParams, defaults);
  if (context.source !== "dcc" || !context.handoffId) return false;
  return (
    context.partnerSatelliteId === "welcome-to-alaska" ||
    context.sourceSlug === WTA_FORWARD_SOURCE_SLUG ||
    context.sourcePage === WTA_FORWARD_SOURCE_PAGE
  );
}

export function getWtaPartnerOverrides(
  searchParams?: HandoffSearchParams,
  defaults?: Partial<DccSatelliteContext>
): Partial<DccSatelliteContext> | null {
  if (!isWtaPartnerForward(searchParams, defaults)) return null;
  const context = getDccSatelliteContext(searchParams, defaults);
  return {
    sourceSlug: context.sourceSlug || WTA_FORWARD_SOURCE_SLUG,
    sourcePage: context.sourcePage || WTA_FORWARD_SOURCE_PAGE,
    topicSlug: context.topicSlug || WTA_FORWARD_TOPIC_SLUG,
    partnerSatelliteId: "welcome-to-alaska",
    partnerReason: context.partnerReason || "traveler_reuse",
    partnerHandoffId: context.partnerHandoffId || context.handoffId,
  };
}

function buildAcceptedPartnerSourcePath(context: DccSatelliteContext, fallbackPath: string) {
  if (context.venueSlug) return `/book/${context.venueSlug}`;
  return fallbackPath;
}

export async function postWtaPartnerAcceptedIfNeeded(args: {
  searchParams?: HandoffSearchParams;
  sourcePath: string;
  externalReference?: string | null;
  occurredAt?: string;
}) {
  const overrides = getWtaPartnerOverrides(args.searchParams);
  if (!overrides) return { ok: false, skipped: true } as const;
  const context = getDccSatelliteContext(args.searchParams, overrides);
  return postDccSatelliteEvent({
    eventType: "accepted_from_partner",
    searchParams: args.searchParams,
    context: overrides,
    sourcePath: buildAcceptedPartnerSourcePath(context, args.sourcePath),
    externalReference: args.externalReference,
    status: "received",
    stage: "landing",
    occurredAt: args.occurredAt,
    booking: {
      venueSlug: context.venueSlug,
      eventDate: context.eventDate,
      quantity: context.quantity,
    },
    partner: {
      fromSite: "welcome-to-alaska",
      toSite: "partyatredrocks",
      partnerHandoffId: context.partnerHandoffId || context.handoffId,
      reason: context.partnerReason || "traveler_reuse",
    },
  });
}

export function getDccReturnHref(searchParams?: HandoffSearchParams) {
  const raw = firstValue(searchParams, "dcc_return");
  if (!raw) return null;
  try {
    return new URL(raw, DCC_ORIGIN).toString();
  } catch {
    return null;
  }
}

export function buildTrackedDccReturnHref(searchParams?: HandoffSearchParams) {
  const context = getDccSatelliteContext(searchParams);
  if (!context.handoffId || context.source !== "dcc" || !context.returnUrl) return null;

  const url = new URL("/handoff/return", SITE_ORIGIN);
  const query = pickTrackedQueryParams(context);
  query.forEach((value, key) => url.searchParams.set(key, value));
  return url.toString();
}

export function buildTrackedExternalCheckoutHref(args: {
  targetUrl: string;
  searchParams?: HandoffSearchParams;
  sourcePath?: string;
  stage?: string;
  productSlug?: string;
}) {
  const context = getDccSatelliteContext(args.searchParams);
  if (!context.handoffId || context.source !== "dcc") return args.targetUrl;

  const url = new URL("/handoff/out", SITE_ORIGIN);
  const query = pickTrackedQueryParams(context);
  query.forEach((value, key) => url.searchParams.set(key, value));
  url.searchParams.set("target", args.targetUrl);
  if (args.sourcePath) url.searchParams.set("source_path", args.sourcePath);
  if (args.stage) url.searchParams.set("stage", args.stage);
  if (args.productSlug) url.searchParams.set("product", args.productSlug);
  return url.toString();
}

function pickTrackedQueryParams(context: DccSatelliteContext) {
  const query = new URLSearchParams();
  if (context.handoffId) query.set("dcc_handoff_id", context.handoffId);
  if (context.returnUrl) query.set("dcc_return", context.returnUrl);
  if (context.source) query.set("source", context.source);
  query.set("satellite", PARR_SATELLITE_ID);
  if (context.sourceSlug) query.set("source_slug", context.sourceSlug);
  if (context.sourcePage) query.set("source_page", context.sourcePage);
  if (context.topicSlug) query.set("topic", context.topicSlug);
  if (context.venueSlug) query.set("venue", context.venueSlug);
  if (context.eventDate) query.set("date", context.eventDate);
  if (context.quantity) query.set("qty", String(context.quantity));
  if (context.artist) query.set("artist", context.artist);
  if (context.event) query.set("event", context.event);
  if (context.partnerSatelliteId) query.set("partner_satellite", context.partnerSatelliteId);
  if (context.partnerReason) query.set("partner_reason", context.partnerReason);
  if (context.partnerHandoffId) query.set("partner_handoff_id", context.partnerHandoffId);
  return query;
}

export function readDccHandoffSession(handoffId: string): DccSatelliteHandoffSession | null {
  try {
    const filePath = handoffSessionFile(handoffId);
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, "utf8")) as DccSatelliteHandoffSession;
  } catch (error) {
    logPersistenceFailure("read_session", error, { handoffId });
    return null;
  }
}

export function persistDccHandoffSession(
  searchParams?: HandoffSearchParams,
  defaults?: Partial<DccSatelliteContext>
) {
  const context = getDccSatelliteContext(searchParams, defaults);
  if (!context.handoffId || context.source !== "dcc") return null;

  const now = new Date().toISOString();
  const previous = readDccHandoffSession(context.handoffId);
  const normalizedEventDate = normalizeEventDate(context.eventDate || previous?.eventDate || undefined) || null;
  const session: DccSatelliteHandoffSession = {
    handoffId: context.handoffId,
    source: context.source || previous?.source || null,
    sourceSlug: context.sourceSlug || previous?.sourceSlug || null,
    sourcePage: context.sourcePage || previous?.sourcePage || null,
    topicSlug: context.topicSlug || previous?.topicSlug || null,
    venueSlug: context.venueSlug || previous?.venueSlug || null,
    eventDate: normalizedEventDate,
    quantity: context.quantity ?? previous?.quantity ?? null,
    artist: context.artist || previous?.artist || null,
    event: context.event || previous?.event || null,
    returnUrl: context.returnUrl || previous?.returnUrl || null,
    firstSeenAt: previous?.firstSeenAt || now,
    lastSeenAt: now,
    lastEventType: previous?.lastEventType || null,
    callbackIds: previous?.callbackIds || [],
  };

  try {
    ensureDir(handoffDir(context.handoffId));
    fs.writeFileSync(handoffSessionFile(context.handoffId), `${JSON.stringify(session, null, 2)}\n`, "utf8");
  } catch (error) {
    logPersistenceFailure("write_session", error, { handoffId: context.handoffId });
  }
  return session;
}

export function buildDccCallbackPayload(input: {
  eventType: DccSatelliteEventType;
  searchParams?: HandoffSearchParams;
  context?: Partial<DccSatelliteContext>;
  sourcePath?: string;
  status?: string;
  stage?: string;
  message?: string;
  occurredAt?: string;
  externalReference?: string | null;
  traveler?: {
    email?: string;
    phone?: string;
    name?: string;
    partySize?: number;
  };
  booking?: {
    venueSlug?: string;
    eventDate?: string;
    quantity?: number;
    currency?: string;
    amount?: number | null;
    productSlug?: string;
  };
  partner?: DccSatellitePartner;
  metadata?: Record<string, string | number | boolean | null | undefined>;
}) {
  const context = getDccSatelliteContext(input.searchParams, input.context);
  if (!context.handoffId || context.source !== "dcc") return null;
  const topicSlug = inferTopicSlug({
    context,
    sourcePath: input.sourcePath,
    productSlug: input.booking?.productSlug,
  });
  const eventDate = normalizeEventDate(input.booking?.eventDate || context.eventDate);
  const currency = normalizeCurrency(input.booking?.currency);

  return compactObject({
    handoffId: context.handoffId,
    satelliteId: PARR_SATELLITE_ID,
    eventType: input.eventType,
    source: "parr",
    sourcePath: input.sourcePath,
    occurredAt: input.occurredAt,
    externalReference: input.externalReference || undefined,
    status: input.status,
    stage: input.stage,
    message: input.message,
    traveler: compactNestedObject({
      email: input.traveler?.email,
      phone: input.traveler?.phone,
      name: input.traveler?.name,
      partySize: input.traveler?.partySize,
    }),
    attribution: compactNestedObject({
      sourceSlug: context.sourceSlug,
      sourcePage: context.sourcePage,
      topicSlug,
    }),
    booking: compactNestedObject({
      venueSlug: input.booking?.venueSlug || context.venueSlug,
      eventDate,
      quantity: input.booking?.quantity ?? context.quantity,
      currency,
      amount: input.booking?.amount ?? undefined,
      productSlug: input.booking?.productSlug,
    }),
    partner: compactNestedObject({
      fromSite:
        input.partner?.fromSite ||
        (input.partner?.toSite || context.partnerSatelliteId || input.partner?.partnerHandoffId || context.partnerHandoffId
          ? PARR_SATELLITE_ID
          : undefined),
      toSite: input.partner?.toSite || context.partnerSatelliteId,
      partnerHandoffId: input.partner?.partnerHandoffId || context.partnerHandoffId,
      reason: input.partner?.reason || context.partnerReason,
    }),
    metadata: compactNestedObject({
      dcc_return: context.returnUrl,
      artist: context.artist,
      event: context.event,
      ...(input.metadata || {}),
    }),
  });
}

export function buildCallbackId(input: {
  handoffId: string;
  eventType: DccSatelliteEventType;
  sourcePath?: string;
  stage?: string;
  externalReference?: string | null;
}) {
  return [
    input.handoffId,
    input.eventType,
    input.sourcePath || "",
    input.stage || "",
    input.externalReference || "",
  ].join(":");
}

function appendJsonLine(filePath: string, value: unknown) {
  try {
    ensureDir(path.dirname(filePath));
    fs.appendFileSync(filePath, `${JSON.stringify(value)}\n`, "utf8");
  } catch (error) {
    logPersistenceFailure("append_jsonl", error, { filePath });
  }
}

export function listDccHandoffEvents(handoffId: string) {
  try {
    const filePath = handoffEventsFile(handoffId);
    if (!fs.existsSync(filePath)) return [];
    return fs
      .readFileSync(filePath, "utf8")
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line) as DccSatelliteStoredEvent);
  } catch (error) {
    logPersistenceFailure("list_events", error, { handoffId });
    return [];
  }
}

export async function postDccSatelliteEvent(input: {
  eventType: DccSatelliteEventType;
  searchParams?: HandoffSearchParams;
  context?: Partial<DccSatelliteContext>;
  sourcePath?: string;
  status?: string;
  stage?: string;
  message?: string;
  occurredAt?: string;
  externalReference?: string | null;
  traveler?: {
    email?: string;
    phone?: string;
    name?: string;
    partySize?: number;
  };
  booking?: {
    venueSlug?: string;
    eventDate?: string;
    quantity?: number;
    currency?: string;
    amount?: number | null;
    productSlug?: string;
  };
  partner?: DccSatellitePartner;
  metadata?: Record<string, string | number | boolean | null | undefined>;
}) {
  const payload = buildDccCallbackPayload(input);
  if (!payload) return { ok: false, skipped: true };

  const handoffId = payload.handoffId as string;
  const callbackId = buildCallbackId({
    handoffId,
    eventType: input.eventType,
    sourcePath: input.sourcePath,
    stage: input.stage,
    externalReference: input.externalReference,
  });

  const session = persistDccHandoffSession(input.searchParams, input.context);
  if (session?.callbackIds.includes(callbackId)) {
    return { ok: true, duplicate: true, callbackId };
  }

  const callbackUrl = (process.env.DCC_CALLBACK_URL || DEFAULT_DCC_CALLBACK_URL).trim();
  const token = (process.env.DCC_PARR_WEBHOOK_TOKEN || "").trim();
  const createdAt = new Date().toISOString();

  if (!liveDccCallbacksEnabled()) {
    const skipped: DccSatelliteStoredEvent = {
      callbackId,
      handoffId,
      eventType: input.eventType,
      sourcePath: input.sourcePath,
      status: input.status,
      stage: input.stage,
      externalReference: input.externalReference,
      createdAt,
      attempts: 0,
      skipped: true,
      lastError: "live_callbacks_disabled",
    };
    appendJsonLine(handoffEventsFile(handoffId), skipped);
    appendJsonLine(callbackFailureFile(), skipped);
    return { ok: false, callbackId, skipped: true, error: "live_callbacks_disabled" };
  }

  let attempts = 0;
  let lastError: string | undefined;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    attempts = attempt;
    try {
      const response = await fetch(callbackUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "x-dcc-satellite-token": token } : {}),
        },
        body: JSON.stringify(payload),
        cache: "no-store",
      });
      if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(`callback_${response.status}:${text.slice(0, 300)}`);
      }

      const deliveredAt = new Date().toISOString();
      const stored: DccSatelliteStoredEvent = {
        callbackId,
        handoffId,
        eventType: input.eventType,
        sourcePath: input.sourcePath,
        status: input.status,
        stage: input.stage,
        externalReference: input.externalReference,
        createdAt,
        deliveredAt,
        attempts,
      };

      appendJsonLine(handoffEventsFile(handoffId), stored);
      appendJsonLine(callbackLogFile(), stored);

      const nextSession = readDccHandoffSession(handoffId);
      if (nextSession) {
        nextSession.lastEventType = input.eventType;
        nextSession.lastSeenAt = deliveredAt;
        nextSession.callbackIds = Array.from(new Set([...nextSession.callbackIds, callbackId]));
        try {
          fs.writeFileSync(handoffSessionFile(handoffId), `${JSON.stringify(nextSession, null, 2)}\n`, "utf8");
        } catch (error) {
          logPersistenceFailure("write_session_after_delivery", error, { handoffId });
        }
      }

      return { ok: true, callbackId };
    } catch (error) {
      lastError = error instanceof Error ? error.message : "unknown_callback_error";
    }
  }

  const failed: DccSatelliteStoredEvent = {
    callbackId,
    handoffId,
    eventType: input.eventType,
    sourcePath: input.sourcePath,
    status: input.status,
    stage: input.stage,
    externalReference: input.externalReference,
    createdAt,
    attempts,
    lastError,
  };
  appendJsonLine(handoffEventsFile(handoffId), failed);
  appendJsonLine(callbackFailureFile(), failed);
  return { ok: false, callbackId, error: lastError };
}
