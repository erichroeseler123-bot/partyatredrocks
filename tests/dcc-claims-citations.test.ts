import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import {
  evaluateClaimStatus,
  getAllSiteDccClaims,
  getDccClaimsByIds,
} from "../lib/dccClaims";

const root = process.cwd();

test("PARR DCC claim snapshot contains verified primary-authority Red Rocks records", () => {
  const all = getAllSiteDccClaims("2026-11-22");
  assert.equal(all.length, 5);
  for (const claim of all) {
    assert.equal(claim.isCurrentVerified, true, `${claim.claimId} should be verified on 2026-11-22`);
    assert.match(claim.authorityUrl, /^https:\/\/www\.redrocksonline\.com\//);
    assert.equal(
      claim.dccRecordUrl,
      `https://www.destinationcommandcenter.com/r/dcc-claim-${claim.claimId}`,
    );
    assert.ok(claim.limitationsNote.length > 10);
  }
});

test("evaluateClaimStatus downgrades expired claims to stale so expired records are never labeled verified", () => {
  assert.equal(
    evaluateClaimStatus(
      { status: "verified", checkedAt: "2026-11-22", nextCheckAt: "2027-03-01" },
      "2027-03-02",
    ),
    "stale",
  );
  const expired = getDccClaimsByIds(
    ["red-rocks-post-show-pickup-jurassic-lot"],
    "2027-04-01",
  );
  assert.equal(expired[0]?.currentStatus, "stale");
  assert.equal(expired[0]?.isCurrentVerified, false);
});

test("tailgating guide removes legacy Sprinter wording and cites primary Red Rocks rules", () => {
  const source = readFileSync(
    join(root, "app/guide/logistics/tailgating-rules/page.tsx"),
    "utf8",
  );
  assert.doesNotMatch(source, /Sprinter/i);
  assert.doesNotMatch(source, /No personal grills in the Upper Lots/i);
  assert.match(source, /DccSourceCitations/);
  assert.match(source, /red-rocks-tailgating-and-lot-rules/);
});
