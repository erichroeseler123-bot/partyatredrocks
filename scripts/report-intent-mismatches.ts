#!/usr/bin/env tsx
import { INTENT_REGISTRY } from "../lib/intentRegistry";

function priorityScore(entry: (typeof INTENT_REGISTRY)[number]) {
  const intentWeight = entry.detectedIntent === "act" ? 5 : entry.detectedIntent === "compare" ? 4 : 3;
  const sourceWeight = entry.sourceType === "external" ? 3 : entry.sourceType === "legacy" ? 2 : 1;
  const nextStepPenalty = entry.nextStepExists === "partial" ? 2 : entry.nextStepExists === "none" ? 3 : 0;
  const upgradePenalty = entry.needsIntentUpgrade ? 3 : 0;
  const mismatchPenalty = 6 - entry.intentMatchScore;
  return intentWeight + sourceWeight + nextStepPenalty + upgradePenalty + mismatchPenalty;
}

const mismatches = INTENT_REGISTRY
  .filter((entry) => entry.needsIntentUpgrade || entry.nextStepExists !== "full" || entry.intentMatchScore <= 3)
  .map((entry) => ({
    sourcePath: entry.sourcePath,
    destinationPath: entry.destinationPath,
    detectedIntent: entry.detectedIntent,
    sourceType: entry.sourceType,
    intentMatchScore: entry.intentMatchScore,
    nextStepExists: entry.nextStepExists,
    needsIntentUpgrade: entry.needsIntentUpgrade,
    primaryNextStep: entry.primaryNextStep,
    priorityScore: priorityScore(entry),
    notes: entry.notes,
  }))
  .sort((a, b) => b.priorityScore - a.priorityScore || a.intentMatchScore - b.intentMatchScore);

console.log(JSON.stringify({ total: mismatches.length, mismatches }, null, 2));
