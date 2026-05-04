import type { InitialUiState, ResolvedStateResult } from "./types";

export function applyConfidenceGate(
  resolved: ResolvedStateResult,
  baseState: InitialUiState,
  threshold = 0.6,
) {
  const confidentFields = new Map(
    Array.from(resolved.winners.entries()).filter(([, winner]) => winner.confidence >= threshold),
  );

  if (confidentFields.size === 0) {
    return {
      state: baseState,
      winners: confidentFields,
      downgraded: true,
    };
  }

  const state: InitialUiState = { ...baseState };
  for (const [key, winner] of Array.from(confidentFields.entries())) {
    state[key] = winner.value as never;
  }

  return {
    state,
    winners: confidentFields,
    downgraded: confidentFields.size !== resolved.winners.size,
  };
}

export function validateParrState(state: InitialUiState): InitialUiState {
  const next = { ...state };

  if (next.defaultCardSlug === "private-suv" && next.primaryCtaLabel === "Book your ride") {
    next.primaryCtaLabel = "Check private rides";
  }

  if (next.fitSignal === "group") {
    const priorities = next.prioritizedCardSlugs || [];
    if (!priorities.includes("private-suv")) {
      next.prioritizedCardSlugs = ["private-suv", ...priorities];
    }
    next.defaultCardSlug = "private-suv";
    next.sortMode = "fit";
  }

  if (next.defaultCardSlug === "private-suv" && next.sortMode === "recommended") {
    next.sortMode = "fit";
  }

  return next;
}
