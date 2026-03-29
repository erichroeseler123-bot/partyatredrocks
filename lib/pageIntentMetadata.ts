import type { Metadata } from "next";

export type PageIntentMetadataRecord = {
  pagePath: string;
  intent: "explore" | "understand" | "compare" | "act";
  layer: "dcc" | "wts" | "parr" | "checkout";
  confirmsIntent: boolean;
  intentStatus: "full" | "partial" | "needs-upgrade";
  primaryNextStep: string | null;
  secondaryNextSteps: string[];
  notes: string;
};

export const PAGE_INTENT_METADATA: Record<string, PageIntentMetadataRecord> = {
  "/guide/local/denver-pickups": {
    pagePath: "/guide/local/denver-pickups",
    intent: "act",
    layer: "parr",
    confirmsIntent: true,
    intentStatus: "needs-upgrade",
    primaryNextStep: "/book/red-rocks-amphitheatre/custom/shared",
    secondaryNextSteps: ["/book/red-rocks-amphitheatre/private"],
    notes: "Pickup traffic is high-intent and should move into booking faster.",
  },
  "/venues/mishawaka-amphitheatre": {
    pagePath: "/venues/mishawaka-amphitheatre",
    intent: "understand",
    layer: "parr",
    confirmsIntent: true,
    intentStatus: "needs-upgrade",
    primaryNextStep: "/book-all-venue?venue=mishawaka-amphitheatre",
    secondaryNextSteps: [],
    notes: "Legacy Mishawaka traffic needs clearer transport options and a stronger booking path.",
  },
  "/guide": {
    pagePath: "/guide",
    intent: "understand",
    layer: "parr",
    confirmsIntent: true,
    intentStatus: "partial",
    primaryNextStep: "/red-rocks/transportation",
    secondaryNextSteps: ["/book/red-rocks-amphitheatre/custom/shared"],
    notes: "Legacy blog and informational traffic needs stronger transport-forward routing.",
  },
};

export function buildPageIntentMetadata(pathname: keyof typeof PAGE_INTENT_METADATA): Pick<Metadata, "other"> {
  const record = PAGE_INTENT_METADATA[pathname];
  return {
    other: {
      "page-intent": record.intent,
      "intent-layer": record.layer,
      "intent-status": record.intentStatus,
      "intent-confirms": record.confirmsIntent ? "true" : "false",
      "primary-next-step": record.primaryNextStep || "none",
      "secondary-next-steps": record.secondaryNextSteps.join(",") || "none",
    },
  };
}
