export type HandoffContext = {
  handoffId?: string;
  sourcePage?: string;
  decisionCorridor?: string;
  decisionState?: "considering" | "chosen" | "continuing";
  decisionAction?: string;
  decisionOption?: string;
  decisionProduct?: string;
  requestedLane?: string;
  resolvedLane?: string;
  topic?: string;
  subtype?: string;
  date?: string;
  port?: string;
  productSlug?: string;
  rank?: number;
  widgetId?: string;
  widgetPlacement?: string;
};

export type InitialUiState = {
  headline: string;
  supportLine?: string;
  arrivalConfirmationLine?: string;
  primaryCtaLabel: string;
  urgency?: "low" | "medium" | "high";
  resolverVariant?: "private-first" | "shared-first";
  visualVariant?: "private-first" | "shared-first";
  defaultCardSlug?: string;
  prioritizedCardSlugs?: string[];
  visualCardSlugs?: string[];
  hiddenCardSlugs?: string[];
  sortMode?: "recommended" | "availability" | "price" | "fit";
  prefilledDate?: string;
  fitSignal?: string;
};

export type ResolverResult = {
  patch: Partial<InitialUiState>;
  confidence: number;
  reason: string;
};

export type ResolverRule<PageModel = unknown> = {
  id: string;
  match: (context: HandoffContext, model?: PageModel) => boolean;
  resolve: (context: HandoffContext, model?: PageModel) => ResolverResult;
};

export type ResolvedField<T = unknown> = {
  value: T;
  confidence: number;
  ruleId: string;
  reason: string;
};

export type ResolvedStateResult = {
  state: InitialUiState;
  winners: Map<keyof InitialUiState, ResolvedField>;
};
