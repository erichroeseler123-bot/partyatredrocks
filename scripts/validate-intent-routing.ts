#!/usr/bin/env tsx
import { INTENT_REGISTRY, type IntentRegistryEntry, type NextStepStatus } from "../lib/intentRegistry";

type Summary = {
  checked: number;
  errors: string[];
  warnings: string[];
  info: string[];
};

const ALLOWED_SOURCE_TYPES = new Set(["legacy", "external", "search", "internal"]);
const ALLOWED_INTENTS = new Set(["explore", "understand", "compare", "act"]);
const ALLOWED_DESTINATIONS = new Set(["dcc", "wts", "parr", "checkout"]);
const ALLOWED_NEXT_STEPS = new Set<NextStepStatus>(["full", "partial", "none"]);
const CHECKOUT_SENTINEL = "checkout";

function isPathLike(value: string) {
  return value === CHECKOUT_SENTINEL || value.startsWith("/");
}

function validateEntry(entry: IntentRegistryEntry, seen: Set<string>, summary: Summary) {
  if (seen.has(entry.sourcePath)) {
    summary.errors.push(`duplicate sourcePath: ${entry.sourcePath}`);
  }
  seen.add(entry.sourcePath);

  if (!isPathLike(entry.sourcePath)) {
    summary.errors.push(`sourcePath must start with / or be checkout sentinel: ${entry.sourcePath}`);
  }
  if (!isPathLike(entry.destinationPath)) {
    summary.errors.push(`destinationPath must start with / or be checkout sentinel: ${entry.destinationPath}`);
  }
  if (!ALLOWED_SOURCE_TYPES.has(entry.sourceType)) {
    summary.errors.push(`invalid sourceType for ${entry.sourcePath}: ${entry.sourceType}`);
  }
  if (!ALLOWED_INTENTS.has(entry.detectedIntent)) {
    summary.errors.push(`invalid detectedIntent for ${entry.sourcePath}: ${entry.detectedIntent}`);
  }
  if (!ALLOWED_DESTINATIONS.has(entry.destinationType)) {
    summary.errors.push(`invalid destinationType for ${entry.sourcePath}: ${entry.destinationType}`);
  }
  if (!ALLOWED_NEXT_STEPS.has(entry.nextStepExists)) {
    summary.errors.push(`invalid nextStepExists for ${entry.sourcePath}: ${entry.nextStepExists}`);
  }
  if (entry.intentMatchScore < 1 || entry.intentMatchScore > 5) {
    summary.errors.push(`intentMatchScore out of range for ${entry.sourcePath}: ${entry.intentMatchScore}`);
  }
  if (entry.primaryNextStep && !isPathLike(entry.primaryNextStep)) {
    summary.errors.push(`primaryNextStep must be a path or checkout for ${entry.sourcePath}: ${entry.primaryNextStep}`);
  }
  for (const step of entry.secondaryNextSteps) {
    if (!isPathLike(step)) {
      summary.errors.push(`secondaryNextStep must be a path or checkout for ${entry.sourcePath}: ${step}`);
    }
  }

  if (entry.needsIntentUpgrade && entry.intentMatchScore >= 4) {
    summary.warnings.push(`${entry.sourcePath}: marked for intent upgrade despite a high match score`);
  }
  if (!entry.needsIntentUpgrade && entry.intentMatchScore <= 2) {
    summary.warnings.push(`${entry.sourcePath}: low intent match score but not flagged for upgrade`);
  }
  if (entry.nextStepExists !== "full") {
    summary.info.push(`${entry.sourcePath}: next-step coverage is ${entry.nextStepExists}`);
  }
  if (entry.intentMatchScore <= 2) {
    summary.info.push(`${entry.sourcePath}: weak intent match score ${entry.intentMatchScore}`);
  }
}

const summary: Summary = {
  checked: INTENT_REGISTRY.length,
  errors: [],
  warnings: [],
  info: [],
};
const seen = new Set<string>();

for (const entry of INTENT_REGISTRY) {
  validateEntry(entry, seen, summary);
}

const payload = {
  checked: summary.checked,
  errors: summary.errors,
  warnings: summary.warnings,
  info: summary.info,
};

console.log(JSON.stringify(payload, null, 2));

if (summary.errors.length > 0) {
  process.exit(1);
}
