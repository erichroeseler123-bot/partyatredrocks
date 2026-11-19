"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  enqueueParrAnalyticsEvent,
  isSuppressedInternalParrPath,
  sanitizeParrAnalyticsPath,
} from "@/lib/analyticsV2Client";

export default function ParrAnalyticsBridge() {
  const pathname = usePathname();
  const lastTrackedPathRef = useRef<string | null>(null);
  const handoffCheckedRef = useRef(false);

  useEffect(() => {
    const rawPath = pathname || (typeof window !== "undefined" ? window.location.pathname : "/");
    if (isSuppressedInternalParrPath(rawPath)) return;
    const cleanPath = sanitizeParrAnalyticsPath(rawPath);
    if (lastTrackedPathRef.current === cleanPath) return;

    const navType = lastTrackedPathRef.current === null ? "initial_load" : "spa_route_change";
    lastTrackedPathRef.current = cleanPath;

    enqueueParrAnalyticsEvent({
      eventType: "page_viewed",
      path: cleanPath,
      navigationType: navType,
    });

    if (!handoffCheckedRef.current && typeof window !== "undefined") {
      handoffCheckedRef.current = true;
      try {
        const qs = new URLSearchParams(window.location.search || "");
        const handoffId = qs.get("dcc_handoff_id") || qs.get("handoff_id") || qs.get("journey_id");
        const hasCtx = Boolean(qs.get("ctx") || qs.get("context_id"));
        if (handoffId || hasCtx) {
          enqueueParrAnalyticsEvent({
            eventType: "cross_site_handoff_arrived",
            path: cleanPath,
            contextTokenPresent: hasCtx,
            handoffId: handoffId || undefined,
          });
        }
      } catch {
        // ignore URL parse errors
      }
    }
  }, [pathname]);

  return null;
}
