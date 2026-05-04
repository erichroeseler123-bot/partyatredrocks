"use client";

type ParrTelemetryEvent =
  | "handoff_viewed"
  | "shortlist_rendered"
  | "product_opened"
  | "checkout_started"
  | "navigation_clicked"
  | "decision_cta_clicked"
  | "booking_confirmed"
  | "booking_completed"
  | "page_viewed";

type ParrEventProps = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
    __parrSessionId?: string;
  }
}

const SESSION_STORAGE_KEY = "parr_session_id";

function getSessionId() {
  if (typeof window === "undefined") return "";
  if (window.__parrSessionId) return window.__parrSessionId;

  let value = "";
  try {
    value = window.sessionStorage.getItem(SESSION_STORAGE_KEY) || "";
  } catch {
    value = "";
  }

  if (!value) {
    value =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `parr_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    try {
      window.sessionStorage.setItem(SESSION_STORAGE_KEY, value);
    } catch {
      // noop
    }
  }

  window.__parrSessionId = value;
  return value;
}

function persistInternalTelemetry(name: ParrTelemetryEvent, payload: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const body = JSON.stringify({
    id:
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `evt_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
    name,
    created_at: new Date().toISOString(),
    session_id: payload.session_id,
    page: payload.page,
    handoff_id: payload.handoff_id,
    props: payload,
  });

  try {
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const blob = new Blob([body], { type: "application/json" });
      if (navigator.sendBeacon("/api/telemetry/parr", blob)) return;
    }
  } catch {
    // noop
  }

  void fetch("/api/telemetry/parr", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => undefined);
}

export function trackParrEvent(name: ParrTelemetryEvent, props: ParrEventProps) {
  if (typeof window === "undefined") return;

  const payload = {
    ...props,
    session_id: getSessionId(),
    page: window.location.pathname,
  };

  if (typeof window.gtag === "function") {
    window.gtag("event", name, payload);
  }

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event: name, ...payload });
  }

  persistInternalTelemetry(name, payload);
}
