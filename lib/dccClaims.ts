import snapshot from "@/data/dcc.claim-snapshot.v1.json";

export type DccClaimCategory =
  | "safety_navigation"
  | "schedule_access"
  | "price_refund"
  | "operational_status";

export type DccClaimStatus =
  | "verified"
  | "stale"
  | "disputed"
  | "needs_confirmation";

export interface DccSnapshotClaim {
  claimId: string;
  category: DccClaimCategory;
  claimText: string;
  authorityName: string;
  authorityUrl: string;
  checkedAt: string;
  nextCheckAt: string;
  status: DccClaimStatus;
  effectiveStatus: DccClaimStatus;
  limitationsNote: string;
  sites: string[];
}

export interface ResolvedDccClaim extends DccSnapshotClaim {
  currentStatus: DccClaimStatus;
  isCurrentVerified: boolean;
  dccRecordUrl: string;
}

const claimsById = new Map<string, DccSnapshotClaim>(
  (snapshot.claims as DccSnapshotClaim[]).map((claim) => [claim.claimId, claim]),
);

export function evaluateClaimStatus(
  claim: Pick<DccSnapshotClaim, "status" | "checkedAt" | "nextCheckAt">,
  todayIso = new Date().toISOString().slice(0, 10),
): DccClaimStatus {
  if (claim.status !== "verified") return claim.status;
  return claim.checkedAt <= todayIso && claim.nextCheckAt >= todayIso
    ? "verified"
    : "stale";
}

export function getDccClaimsByIds(
  claimIds: readonly string[],
  todayIso = new Date().toISOString().slice(0, 10),
): ResolvedDccClaim[] {
  const results: ResolvedDccClaim[] = [];
  for (const id of claimIds) {
    const claim = claimsById.get(id);
    if (!claim) continue;
    const currentStatus = evaluateClaimStatus(claim, todayIso);
    results.push({
      ...claim,
      currentStatus,
      isCurrentVerified: currentStatus === "verified",
      dccRecordUrl: `https://www.destinationcommandcenter.com/r/dcc-claim-${claim.claimId}`,
    });
  }
  return results;
}

export function getAllSiteDccClaims(
  todayIso = new Date().toISOString().slice(0, 10),
): ResolvedDccClaim[] {
  return getDccClaimsByIds(
    (snapshot.claims as DccSnapshotClaim[]).map((c) => c.claimId),
    todayIso,
  );
}
