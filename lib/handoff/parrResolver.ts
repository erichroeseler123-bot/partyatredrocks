import type { HandoffContext, InitialUiState, ResolverRule } from "./types";

export const parrBaseState: InitialUiState = {
  headline: "Your Red Rocks ride - already handled.",
  supportLine:
    "Live availability, flat pricing, and a return plan that is already built around show night.",
  arrivalConfirmationLine: "Live availability • Flat rate • No waiting",
  primaryCtaLabel: "Lock in your ride",
  urgency: "medium",
  resolverVariant: "private-first",
  visualVariant: "private-first",
  defaultCardSlug: "private-suv",
  prioritizedCardSlugs: ["private-suv", "shared-shuttle"],
  visualCardSlugs: ["private-suv", "shared-shuttle"],
  sortMode: "fit",
};

export const parrResolverRules: ResolverRule[] = [
  {
    id: "parr-event-night",
    match: (ctx: HandoffContext) =>
      (ctx.topic || "").includes("red-rocks") ||
      (ctx.requestedLane || "").includes("transport") ||
      (ctx.resolvedLane || "").includes("shuttle"),
    resolve: () => ({
      confidence: 0.88,
      reason: "Strong Red Rocks transport intent",
      patch: {
        headline: "Lock in your Red Rocks ride in seconds.",
        arrivalConfirmationLine:
          "Live availability • Flat rate • Return handled",
        primaryCtaLabel: "Book your ride",
        urgency: "high",
        fitSignal: "event-night",
      },
    }),
  },
  {
    id: "parr-first-time",
    match: (ctx: HandoffContext) =>
      (ctx.subtype || "").includes("first") ||
      (ctx.sourcePage || "").includes("best-way-to-leave") ||
      (ctx.topic || "").includes("first-time"),
    resolve: () => ({
      confidence: 0.82,
      reason: "First-time rider intent",
      patch: {
        supportLine:
          "Start with the ride option that is already set up for show night, then switch only if your group needs more control.",
        resolverVariant: "shared-first",
        defaultCardSlug: "shared-shuttle",
        prioritizedCardSlugs: ["shared-shuttle", "private-suv"],
        sortMode: "recommended",
      },
    }),
  },
  {
    id: "parr-private",
    match: (ctx: HandoffContext) =>
      (ctx.subtype || "").includes("private") ||
      (ctx.productSlug || "").includes("private") ||
      (ctx.requestedLane || "").includes("private"),
    resolve: () => ({
      confidence: 0.93,
      reason: "Explicit private ride intent",
      patch: {
        headline: "Private Red Rocks Ride + Tailgate Experience",
        arrivalConfirmationLine:
          "Private group • Flexible pickup • Tailgate setup included",
        supportLine:
          "Your group gets a private ride, pickup anytime 4:30 PM or later, and a pre-show setup with chairs, cooler, ice, and speaker.",
        primaryCtaLabel: "Reserve Your Private Tailgate Ride",
        resolverVariant: "private-first",
        defaultCardSlug: "private-suv",
        prioritizedCardSlugs: ["private-suv", "shared-shuttle"],
        sortMode: "fit",
        fitSignal: "private",
      },
    }),
  },
  {
    id: "parr-group",
    match: (ctx: HandoffContext) =>
      (ctx.subtype || "").includes("group") ||
      (ctx.subtype || "").includes("large-party"),
    resolve: () => ({
      confidence: 0.79,
      reason: "Group logistics intent",
      patch: {
        supportLine:
          "For larger groups, start with the ride format that keeps everyone on one vehicle and off the coordination thread.",
        resolverVariant: "private-first",
        defaultCardSlug: "private-suv",
        sortMode: "fit",
        fitSignal: "group",
      },
    }),
  },
  {
    id: "parr-date-known",
    match: (ctx: HandoffContext) => Boolean(ctx.date && /^\d{4}-\d{2}-\d{2}$/.test(ctx.date)),
    resolve: (ctx: HandoffContext) => ({
      confidence: 0.96,
      reason: "Known event date",
      patch: {
        prefilledDate: ctx.date,
      },
    }),
  },
  {
    id: "parr-explicit-product",
    match: (ctx: HandoffContext) => Boolean(ctx.productSlug),
    resolve: (ctx: HandoffContext) => ({
      confidence: 0.95,
      reason: "Specific product requested",
      patch: {
        defaultCardSlug: ctx.productSlug,
      },
    }),
  },
];
