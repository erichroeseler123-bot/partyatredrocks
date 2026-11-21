"use client";

export type ParrAnalyticsEventType =
  | "page_viewed"
  | "guide_engaged"
  | "cross_site_handoff_clicked"
  | "cross_site_handoff_arrived"
  | "seller_handoff_initiated";

export interface ParrClientAnalyticsInput {
  logicalEventId?: string;
  eventType: ParrAnalyticsEventType;
  path?: string;
  navigationType?: "initial_load" | "spa_route_change" | "reload";
  handoffId?: string;
  clickId?: string;
  contextTokenPresent?: boolean;
  targetSite?: string;
  productCode?: string;
  isTest?: boolean;
  props?: Record<string, string | number | boolean | null>;
}

const SEED_KEY = "dcc_aid_v2";
const SESS_KEY = "dcc_asess_v2";
const FT_KEY = "dcc_aft_v2";

let queue: Array<{ payload: Record<string, unknown>; retries: number }> = [];
let timer: ReturnType<typeof setTimeout> | null = null;
let inFlight = false;
let fails = 0;
let openUntil = 0;
let bound = false;

function rid(p: string): string {
  return typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? `${p}_${crypto.randomUUID().replace(/-/g, "")}`
    : `${p}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isSuppressedInternalParrPath(rawPath?: string | null): boolean {
  const p = (rawPath || "/").split("?")[0].split("#")[0].trim() || "/";
  return /^\/(?:internal|admin|manager)(?:\/|$)/i.test(p);
}

export function sanitizeParrAnalyticsPath(rawPath?: string | null): string {
  const p = (rawPath || "/").split("?")[0].split("#")[0].trim() || "/";
  if (/^\/booking\/[^/]+/i.test(p)) return "/booking/[token]";
  if (/^\/pay-balance\/[^/]+/i.test(p)) return "/pay-balance/[token]";
  if (/^\/pay\/[^/]+/i.test(p)) return "/pay/[token]";
  if (/^\/quote\/[^/]+/i.test(p)) return "/quote/[token]";
  if (/^\/manage\/[^/]+/i.test(p)) return "/manage/[token]";
  if (/^\/checkout\/[^/]+/i.test(p)) return "/checkout/[token]";
  if (/^\/orders?\/[^/]+/i.test(p)) return "/order/[token]";
  if (/^\/confirmation\/[^/]+/i.test(p)) return "/confirmation/[token]";
  return p.slice(0, 160);
}

function getSeed(): string {
  if (typeof window === "undefined") return "ssr";
  try {
    if (typeof document !== "undefined") {
      const m = (document.cookie || "").match(/(?:^|;\s*)_dcc_aid=([A-Za-z0-9_-]{8,96})/);
      if (m?.[1]) return m[1];
    }
    const raw = window.localStorage.getItem(SEED_KEY);
    if (raw) {
      const v = JSON.parse(raw) as { seed?: string; expiresAt?: number };
      if (v.seed && (v.expiresAt || 0) > Date.now()) return v.seed;
    }
    const s = rid("bseed");
    if (typeof document !== "undefined") {
      const sec = window.location?.protocol === "https:" ? "; Secure" : "";
      document.cookie = `_dcc_aid=${s}; Max-Age=7776000; Path=/; SameSite=Lax${sec}`;
    }
    window.localStorage.setItem(SEED_KEY, JSON.stringify({ seed: s, expiresAt: Date.now() + 7_776_000_000 }));
    return s;
  } catch {
    return rid("bseed");
  }
}

function getSess(): string {
  if (typeof window === "undefined") return "ssr";
  const now = Date.now();
  try {
    const raw = window.sessionStorage.getItem(SESS_KEY);
    if (raw) {
      const v = JSON.parse(raw) as { id?: string; t?: number };
      if (v.id && now - (v.t || 0) <= 1_800_000) {
        window.sessionStorage.setItem(SESS_KEY, JSON.stringify({ id: v.id, t: now }));
        return v.id;
      }
    }
    const id = rid("sess");
    window.sessionStorage.setItem(SESS_KEY, JSON.stringify({ id, t: now }));
    return id;
  } catch {
    return rid("sess");
  }
}

function cleanTok(v?: string | null, n = 64): string | undefined {
  const t = (v || "").trim();
  if (!t || /@/.test(t) || /^\+?\d[\d\s()-]{7,}$/.test(t)) return undefined;
  return t.replace(/[^A-Za-z0-9._:-]/g, "_").slice(0, n) || undefined;
}

function getFt() {
  if (typeof window === "undefined") return { lp: "/" };
  try {
    const qs = new URLSearchParams(window.location?.search || "");
    const qa = ["qa", "qa_test", "is_test", "synthetic", "dcc_verify"].some((k) => qs.get(k) === "1");
    const hid = cleanTok(qs.get("dcc_handoff_id") || qs.get("handoff_id") || qs.get("journey_id"), 96);
    const cid = cleanTok(qs.get("click_id"), 96);
    const ctx = Boolean(qs.get("ctx") || qs.get("context_id") || hid);
    const lp = sanitizeParrAnalyticsPath(window.location?.pathname || "/");
    const prev = window.sessionStorage.getItem(FT_KEY);
    if (prev) {
      const p = JSON.parse(prev) as Record<string, string>;
      return {
        lp: p.lp || lp,
        src: cleanTok(qs.get("utm_source") || qs.get("source")) || p.src || undefined,
        med: cleanTok(qs.get("utm_medium")) || p.med || undefined,
        cmp: cleanTok(qs.get("utm_campaign"), 96) || p.cmp || undefined,
        ref: p.ref || undefined,
        hid,
        cid,
        ctx,
        qa,
      };
    }
    let ref = "";
    if (typeof document !== "undefined" && document.referrer) {
      try {
        const u = new URL(document.referrer);
        if (u.hostname && u.hostname !== window.location?.hostname) ref = u.hostname.toLowerCase();
      } catch { /* ignore */ }
    }
    const st = {
      lp,
      src: cleanTok(qs.get("utm_source") || qs.get("source")) || "",
      med: cleanTok(qs.get("utm_medium")) || "",
      cmp: cleanTok(qs.get("utm_campaign"), 96) || "",
      ref,
    };
    window.sessionStorage.setItem(FT_KEY, JSON.stringify(st));
    return { lp, src: st.src || undefined, med: st.med || undefined, cmp: st.cmp || undefined, ref: ref || undefined, hid, cid, ctx, qa };
  } catch {
    return { lp: "/" };
  }
}

function isParrClientAnalyticsDisabled(): boolean {
  const dcc = (process.env.NEXT_PUBLIC_DCC_ANALYTICS_DISABLED || "").trim().toLowerCase();
  const pr = (process.env.NEXT_PUBLIC_PARR_ANALYTICS_DISABLED || "").trim().toLowerCase();
  return (
    dcc === "1" ||
    dcc === "true" ||
    dcc === "yes" ||
    dcc === "on" ||
    pr === "1" ||
    pr === "true" ||
    pr === "yes" ||
    pr === "on"
  );
}

export function enqueueParrAnalyticsEvent(input: ParrClientAnalyticsInput): string | null {
  if (isParrClientAnalyticsDisabled() || typeof window === "undefined" || Date.now() < openUntil) return null;
  const rawPath = input.path || window.location?.pathname || "/";
  if (isSuppressedInternalParrPath(rawPath)) return null;

  if (!bound) {
    bound = true;
    const onExit = () => flushParrAnalyticsQueue({ useBeacon: true });
    if (typeof document !== "undefined") {
      document.addEventListener?.("visibilitychange", () => {
        if (document.visibilityState === "hidden") onExit();
      });
    }
    window.addEventListener?.("pagehide", onExit);
  }

  const id = input.logicalEventId || rid("parr_evt");
  const ft = getFt();
  const payload: Record<string, unknown> = {
    schemaVersion: "dcc.analytics.event.v2",
    logicalEventId: id,
    eventType: input.eventType,
    occurredAt: new Date().toISOString(),
    site: "partyatredrocks",
    browserSeed: getSeed(),
    sessionId: getSess(),
    path: sanitizeParrAnalyticsPath(rawPath),
    landingPath: ft.lp,
    contentFamily: "operating_mor",
    ...(input.navigationType ? { navigationType: input.navigationType } : {}),
    ...(ft.ref ? { referrer: ft.ref } : {}),
    ...(ft.src ? { utmSource: ft.src } : {}),
    ...(ft.med ? { utmMedium: ft.med } : {}),
    ...(ft.cmp ? { utmCampaign: ft.cmp } : {}),
    ...(input.handoffId || ft.hid ? { handoffId: input.handoffId || ft.hid } : {}),
    ...(input.clickId || ft.cid ? { clickId: input.clickId || ft.cid } : {}),
    ...(input.contextTokenPresent || ft.ctx ? { contextTokenPresent: true } : {}),
    ...(input.targetSite ? { targetSite: input.targetSite } : {}),
    ...(input.productCode ? { productCode: input.productCode } : {}),
    ...(input.isTest || ft.qa ? { isTest: true } : {}),
    ...(input.props ? { props: input.props } : {}),
  };

  if (queue.length >= 40) queue.shift();
  queue.push({ payload, retries: 0 });

  if (queue.length >= 10 || input.eventType === "cross_site_handoff_clicked") {
    flushParrAnalyticsQueue({ useBeacon: input.eventType === "cross_site_handoff_clicked" });
  } else if (!timer && typeof document !== "undefined") {
    timer = setTimeout(() => {
      timer = null;
      flushParrAnalyticsQueue();
    }, 2500);
    (timer as unknown as { unref?: () => void })?.unref?.();
  }
  return id;
}

export function flushParrAnalyticsQueue(opts?: { useBeacon?: boolean }): void {
  if (typeof window === "undefined" || typeof document === "undefined" || queue.length === 0) return;
  if (Date.now() < openUntil) {
    queue = [];
    return;
  }
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }

  const batch = queue.splice(0, 10);
  const body = JSON.stringify({
    deliveryId: rid("parr_dlv"),
    sentAt: new Date().toISOString(),
    events: batch.map((b) => b.payload),
  });

  if (opts?.useBeacon && typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
    try {
      if (navigator.sendBeacon("/api/telemetry/parr", new Blob([body], { type: "application/json" }))) return;
    } catch { /* fallback */ }
  }
  if (inFlight && !opts?.useBeacon) {
    queue.unshift(...batch);
    return;
  }

  inFlight = true;
  fetch("/api/telemetry/parr", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
    credentials: "same-origin",
  })
    .then((r) => {
      inFlight = false;
      if (r.ok || (r.status >= 400 && r.status < 500 && r.status !== 429)) {
        fails = 0;
        if (queue.length > 0) flushParrAnalyticsQueue();
        return;
      }
      throw new Error("retry");
    })
    .catch(() => {
      inFlight = false;
      if (++fails >= 3) {
        openUntil = Date.now() + 60_000;
        queue = [];
        return;
      }
      const ret = batch.filter((b) => b.retries < 2).map((b) => ({ payload: b.payload, retries: b.retries + 1 }));
      if (ret.length > 0) queue = [...ret, ...queue].slice(0, 40);
    });
}
