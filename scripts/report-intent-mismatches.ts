#!/usr/bin/env tsx
import { INTENT_REGISTRY } from "../lib/intentRegistry";

function priorityScore(entry: (typeof INTENT_REGISTRY)[number]) {
  const intentWeight = entry.detectedIntent === "act" ? 5 : entry.detectedIntent === "compare" ? 4 : 3;
  const sourceWeight = entry.sourceType === "external" ? 3 : entry.sourceType === "legacy" ? 2 : 1;
  const nextStepPenalty = entry.nextStepExists === "partial" ? 2 : entry.nextStepExists === "none" ? 3 : 0;
  const upgradePenalty = entry.needsIntentUpgrade ? 3 : 0;
  const rewritePenalty = entry.needsRewrite ? 2 : 0;
  const redirectPenalty = entry.needsRedirect ? 2 : 0;
  const landingPenalty = entry.needsDedicatedLandingPage ? 2 : 0;
  const clarityPenalty = 6 - entry.nextStepClarity;
  const mismatchPenalty = 6 - entry.intentMatchScore;
  return intentWeight + sourceWeight + nextStepPenalty + upgradePenalty + rewritePenalty + redirectPenalty + landingPenalty + clarityPenalty + mismatchPenalty;
}

const mismatches = INTENT_REGISTRY
  .filter(
    (entry) =>
      entry.needsIntentUpgrade ||
      entry.needsRewrite ||
      entry.needsRedirect ||
      entry.needsDedicatedLandingPage ||
      entry.nextStepExists !== "full" ||
      entry.intentMatchScore <= 3 ||
      entry.nextStepClarity <= 3,
  )
  .map((entry) => ({
    sourcePath: entry.sourcePath,
    intentFamily: entry.intentFamily,
    destinationPath: entry.destinationPath,
    destinationAnchor: entry.destinationAnchor,
    detectedIntent: entry.detectedIntent,
    sourceType: entry.sourceType,
    canonicalStatus: entry.canonicalStatus,
    intentMatchScore: entry.intentMatchScore,
    nextStepClarity: entry.nextStepClarity,
    nextStepExists: entry.nextStepExists,
    needsIntentUpgrade: entry.needsIntentUpgrade,
    needsRewrite: entry.needsRewrite,
    needsRedirect: entry.needsRedirect,
    needsDedicatedLandingPage: entry.needsDedicatedLandingPage,
    primaryNextStep: entry.primaryNextStep,
    priorityScore: priorityScore(entry),
    notes: entry.notes,
  }))
  .sort((a, b) => b.priorityScore - a.priorityScore || a.intentMatchScore - b.intentMatchScore || a.nextStepClarity - b.nextStepClarity);

console.log(JSON.stringify({ total: mismatches.length, mismatches }, null, 2));
