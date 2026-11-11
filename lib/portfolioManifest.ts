import rawManifest from "@/docs/portfolio-image-manifest.json";

export type PortfolioProperty = "parr" | "dcc" | "gosno" | "cp" | "wno" | "wta" | "sots" | string;

export type PortfolioTruthfulnessLevel =
  | "verified_product"
  | "verified_destination_activity"
  | "honest_placeholder";

export interface PortfolioDeployment {
  property: PortfolioProperty;
  publicPath: string;
  width: number;
  height: number;
  bytes: number;
}

export interface PortfolioAsset {
  id: string;
  subject: string;
  location: string;
  sourcePageUrl: string;
  photographer: string;
  license: string;
  licenseUrl: string;
  originalDimensions: string;
  focalPointMobile: string;
  truthfulnessLevel: PortfolioTruthfulnessLevel;
  deployments: PortfolioDeployment[];
}

export interface PortfolioImageManifest {
  schemaVersion: string;
  generatedAt: string;
  governancePolicy: {
    truthfulnessMandate: string;
    aiImageryBoundary: string;
    totalCuratedFamilies: number;
  };
  assets: PortfolioAsset[];
}

export interface ParrResolvedAssetProvenance {
  id: string;
  publicPath: string;
  subject: string;
  location: string;
  sourcePageUrl: string;
  photographer: string;
  license: string;
  licenseUrl: string;
  focalPointMobile: string;
  truthfulnessLevel: PortfolioTruthfulnessLevel;
  width: number;
  height: number;
  bytes: number;
}

export const PORTFOLIO_IMAGE_MANIFEST = rawManifest as PortfolioImageManifest;

export const PARR_PORTFOLIO_ASSETS: PortfolioAsset[] = PORTFOLIO_IMAGE_MANIFEST.assets.filter((asset) =>
  asset.deployments.some((deployment) => deployment.property === "parr")
);

const PARR_PROVENANCE_BY_PATH: Record<string, ParrResolvedAssetProvenance> = (() => {
  const index: Record<string, ParrResolvedAssetProvenance> = {};
  for (const asset of PARR_PORTFOLIO_ASSETS) {
    for (const deployment of asset.deployments) {
      if (deployment.property !== "parr") continue;
      index[deployment.publicPath] = {
        id: asset.id,
        publicPath: deployment.publicPath,
        subject: asset.subject,
        location: asset.location,
        sourcePageUrl: asset.sourcePageUrl,
        photographer: asset.photographer,
        license: asset.license,
        licenseUrl: asset.licenseUrl,
        focalPointMobile: asset.focalPointMobile || "50% 50%",
        truthfulnessLevel: asset.truthfulnessLevel,
        width: deployment.width,
        height: deployment.height,
        bytes: deployment.bytes,
      };
    }
  }
  return index;
})();

function normalizePublicPath(input: string | null | undefined): string {
  if (!input) return "";
  const trimmed = input.trim();
  if (!trimmed.startsWith("/")) return "";
  return trimmed.split("?")[0] || "";
}

export function getParrAssetProvenance(
  publicPath: string | null | undefined
): ParrResolvedAssetProvenance | null {
  const normalized = normalizePublicPath(publicPath);
  if (!normalized) return null;
  return PARR_PROVENANCE_BY_PATH[normalized] ?? null;
}

export function getParrMobileFocalPoint(
  publicPath: string | null | undefined,
  fallback = "50% 50%"
): string {
  return getParrAssetProvenance(publicPath)?.focalPointMobile ?? fallback;
}

export function listParrManifestPaths(): string[] {
  return Object.keys(PARR_PROVENANCE_BY_PATH).sort();
}
