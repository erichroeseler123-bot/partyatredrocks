"use client";

export type SharedNetworkEventName =
  | "service_page_view"
  | "date_selected"
  | "availability_started"
  | "booking_handoff"
  | "booking_completed"
  | "network_handoff"
  | "dcc_plan_opened"
  | "cp_sailing_started"
  | "cp_board_created"
  | "planner_view"
  | "organizer_copy_imported";

export interface TrackNetworkEventInput {
  eventName: SharedNetworkEventName;
  destinationSite?: "dcc" | "partyatredrocks" | "gosno" | "cruisepromenade";
  entryPage?: string;
  travelIntent?: string;
  campaignSource?: string;
  date?: string;
  eventId?: string;
  journeyId?: string;
  isTest?: boolean;
  verifiedSource?: string;
}

const JOURNEY_STORAGE_KEY = "dcc_journey_id_v1";
const JOURNEY_TTL_MS = 24 * 60 * 60 * 1000;
const JOURNEY_ID_RE = /^[a-zA-Z0-9_-]{8,64}$/;

function createOpaqueId(prefix: string): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}_${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`;
  }
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function getOrCreateJourneyId(): string {
  if (typeof window === "undefined") return "ssr";
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const urlJourneyId = urlParams.get("journey_id")?.trim() || "";
    if (JOURNEY_ID_RE.test(urlJourneyId)) {
      window.sessionStorage.setItem(JOURNEY_STORAGE_KEY, urlJourneyId);
      window.localStorage.setItem(
        JOURNEY_STORAGE_KEY,
        JSON.stringify({ id: urlJourneyId, expiresAt: Date.now() + JOURNEY_TTL_MS }),
      );
      return urlJourneyId;
    }

    const sessionVal = window.sessionStorage.getItem(JOURNEY_STORAGE_KEY);
    if (sessionVal && JOURNEY_ID_RE.test(sessionVal)) return sessionVal;

    const rawLocal = window.localStorage.getItem(JOURNEY_STORAGE_KEY);
    if (rawLocal) {
      const parsed = JSON.parse(rawLocal) as { id?: string; expiresAt?: number };
      if (parsed?.id && JOURNEY_ID_RE.test(parsed.id) && (parsed.expiresAt ?? 0) > Date.now()) {
        window.sessionStorage.setItem(JOURNEY_STORAGE_KEY, parsed.id);
        return parsed.id;
      }
    }

    const fresh = createOpaqueId("jrn");
    window.sessionStorage.setItem(JOURNEY_STORAGE_KEY, fresh);
    window.localStorage.setItem(
      JOURNEY_STORAGE_KEY,
      JSON.stringify({ id: fresh, expiresAt: Date.now() + JOURNEY_TTL_MS }),
    );
    return fresh;
  } catch {
    return createOpaqueId("jrn");
  }
}

export function isQaTestMode(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get("qa_test") === "1" || params.get("is_test") === "1";
  } catch {
    return false;
  }
}

function getAnonymousSessionId(): string {
  if (typeof window === "undefined") return "ssr";
  try {
    const key = "dcc_anon_session_id";
    let sid = window.localStorage.getItem(key);
    if (!sid) {
      sid = createOpaqueId("sess");
      window.localStorage.setItem(key, sid);
    }
    return sid;
  } catch {
    return "anon";
  }
}

export function buildAttributedDccRedRocksUrl(params: {
  date?: string;
  partySize?: number | string;
  origin?: string;
  entryPage: string;
  journeyId?: string;
}): string {
  const url = new URL("https://destinationcommandcenter.com/red-rocks");
  url.searchParams.set("source", "partyatredrocks");
  url.searchParams.set("intent", "red-rocks-concert");
  url.searchParams.set("entry", params.entryPage);
  url.searchParams.set("venue", "red-rocks");
  const jid = params.journeyId || (typeof window !== "undefined" ? getOrCreateJourneyId() : "");
  if (jid && jid !== "ssr") url.searchParams.set("journey_id", jid);
  if (typeof window !== "undefined" && isQaTestMode()) url.searchParams.set("qa_test", "1");
  if (params.date) url.searchParams.set("date", params.date);
  if (params.partySize) url.searchParams.set("partySize", String(params.partySize));
  if (params.origin) url.searchParams.set("origin", params.origin);
  return url.toString();
}

export function sanitizeTelemetryPath(rawPath?: string | null): string {
  const pathOnly = (rawPath || "/").split("?")[0].split("#")[0].trim() || "/";
  if (/^\/booking\/[^/]+/i.test(pathOnly)) return "/booking/[token]";
  if (/^\/pay-balance\/[^/]+/i.test(pathOnly)) return "/pay-balance/[token]";
  if (/^\/pay\/[^/]+/i.test(pathOnly)) return "/pay/[token]";
  if (/^\/quote\/[^/]+/i.test(pathOnly)) return "/quote/[token]";
  if (/^\/manage\/[^/]+/i.test(pathOnly)) return "/manage/[token]";
  return pathOnly;
}

export function sanitizeTelemetryEventId(rawEventId?: string | null): string | undefined {
  const trimmed = (rawEventId || "").trim();
  if (!trimmed) return undefined;
  if (/^(parr_booking_|gosno_booking_)/i.test(trimmed)) {
    return undefined;
  }
  return trimmed;
}

export function trackNetworkEvent(input: TrackNetworkEventInput): void {
  if (typeof window === "undefined") return;
  const sessionId = getAnonymousSessionId();
  const journeyId = input.journeyId || getOrCreateJourneyId();
  const eventId = sanitizeTelemetryEventId(input.eventId) || createOpaqueId("evt");
  const entryPage = sanitizeTelemetryPath(input.entryPage || window.location.pathname || "/");
  const urlParams = new URLSearchParams(window.location.search);
  const isTest = Boolean(input.isTest || isQaTestMode());
  const campaignSource =
    input.campaignSource || urlParams.get("source") || urlParams.get("utm_source") || (isTest ? "qa_test" : "direct");

  const payload = JSON.stringify({
    corridor_id: "partyatredrocks",
    event_name: input.eventName,
    event_id: eventId,
    journey_id: journeyId,
    handoff_id: journeyId,
    is_test: isTest,
    session_id: sessionId,
    source_page: entryPage,
    landing_path: entryPage,
    ...(input.date && /^\d{4}-\d{2}-\d{2}$/.test(input.date) ? { handoff_date: input.date } : {}),
    metadata: {
      originating_site: "partyatredrocks",
      entry_page: entryPage,
      destination_site: input.destinationSite || "partyatredrocks",
      travel_intent: input.travelIntent || urlParams.get("intent") || "red-rocks-concert",
      campaign_source: campaignSource,
      date: input.date || null,
      session_id: sessionId,
      journey_id: journeyId,
      event_id: eventId,
      is_test: isTest,
      ...(input.verifiedSource ? { verified_source: input.verifiedSource } : {}),
    },
  });

  const endpoint = "https://destinationcommandcenter.com/api/public/corridor-events";
  try {
    let sent = false;
    if (typeof navigator.sendBeacon === "function") {
      sent = navigator.sendBeacon(endpoint, new Blob([payload], { type: "application/json" }));
    }
    if (!sent) {
      void fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(isTest ? { "x-qa-test": "1" } : {}),
        },
        body: payload,
        keepalive: true,
      });
    }
  } catch {
    // Non-blocking telemetry
  }
}
