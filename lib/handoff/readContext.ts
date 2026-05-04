import type { HandoffContext } from "./types";

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function inferRequestedLane(decisionOption?: string, legacyRequestedLane?: string) {
  if (legacyRequestedLane) return legacyRequestedLane;
  if (!decisionOption) return undefined;
  if (decisionOption.includes("private")) return "private";
  if (decisionOption.includes("shuttle") || decisionOption.includes("shared")) return "transport";
  return decisionOption;
}

function inferDecisionState(
  rawState: string | undefined,
  decisionAction: string | undefined,
  decisionOption: string | undefined,
  decisionProduct: string | undefined,
) {
  if (rawState === "chosen" || rawState === "continuing") return rawState;
  if (decisionAction || decisionOption || decisionProduct) return "continuing" as const;
  return "considering" as const;
}

export function readHandoffContext(
  input: Record<string, string | string[] | undefined>,
): HandoffContext {
  const rank = Number(first(input.rank));
  const date = first(input.date);
  const sourcePage = first(input.source_page) || first(input.src_page);
  const decisionCorridor = first(input.decision_corridor) || first(input.topic) || "red-rocks";
  const decisionAction = first(input.decision_action);
  const decisionOption = first(input.decision_option) || first(input.resolved_lane);
  const decisionProduct = first(input.decision_product) || first(input.product_slug);
  const decisionState = inferDecisionState(
    first(input.decision_state),
    decisionAction,
    decisionOption,
    decisionProduct,
  );
  const requestedLane = inferRequestedLane(decisionOption, first(input.requested_lane));
  const resolvedLane = first(input.resolved_lane) || decisionOption || decisionProduct;

  return {
    handoffId: first(input.dcc_handoff_id) || first(input.handoff_id),
    sourcePage,
    decisionCorridor,
    decisionState,
    decisionAction,
    decisionOption,
    decisionProduct,
    requestedLane,
    resolvedLane,
    topic: first(input.topic) || decisionCorridor,
    subtype: first(input.subtype),
    date: date && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : undefined,
    port: first(input.port),
    productSlug: decisionProduct,
    rank: Number.isFinite(rank) ? rank : undefined,
    widgetId: first(input.widget_id),
    widgetPlacement: first(input.widget_placement),
  };
}

export function packDccTelemetry(context: HandoffContext) {
  return {
    handoff_id: context.handoffId,
    source_page: context.sourcePage,
    decision_corridor: context.decisionCorridor,
    decision_state: context.decisionState,
    decision_action: context.decisionAction,
    decision_option: context.decisionOption,
    decision_product: context.decisionProduct,
    requested_lane: context.requestedLane,
    resolved_lane: context.resolvedLane,
    topic: context.topic,
    subtype: context.subtype,
    date: context.date,
    port: context.port,
    product_slug: context.productSlug,
    rank: context.rank,
    widget_id: context.widgetId,
    widget_placement: context.widgetPlacement,
  };
}
