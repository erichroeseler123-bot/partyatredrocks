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
  | "cp_board_created";

export interface TrackNetworkEventInput {
  eventName: SharedNetworkEventName;
  destinationSite?: "dcc" | "partyatredrocks" | "gosno" | "cruisepromenade";
  entryPage?: string;
  travelIntent?: string;
  campaignSource?: string;
  date?: string;
}

function getAnonymousSessionId(): string {
  if (typeof window === "undefined") return "ssr";
  try {
    const key = "dcc_anon_session_id";
    let sid = window.localStorage.getItem(key);
    if (!sid) {
      sid = `sess_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
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
}): string {
  const url = new URL("https://destinationcommandcenter.com/red-rocks");
  url.searchParams.set("source", "partyatredrocks");
  url.searchParams.set("intent", "red-rocks-concert");
  url.searchParams.set("entry", params.entryPage);
  url.searchParams.set("venue", "red-rocks");
  if (params.date) url.searchParams.set("date", params.date);
  if (params.partySize) url.searchParams.set("partySize", String(params.partySize));
  if (params.origin) url.searchParams.set("origin", params.origin);
  return url.toString();
}

export function trackNetworkEvent(input: TrackNetworkEventInput): void {
  if (typeof window === "undefined") return;
  const sessionId = getAnonymousSessionId();
  const entryPage = input.entryPage || window.location.pathname || "/";
  const urlParams = new URLSearchParams(window.location.search);
  const campaignSource =
    input.campaignSource || urlParams.get("source") || urlParams.get("utm_source") || "direct";

  const payload = JSON.stringify({
    corridor_id: "partyatredrocks",
    event_name: input.eventName,
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
    },
  });

  const endpoint = "https://destinationcommandcenter.com/api/public/corridor-events";
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(endpoint, new Blob([payload], { type: "application/json" }));
      return;
    }
    void fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    });
  } catch {
    // Non-blocking telemetry
  }
}
