import "server-only";

import crypto from "node:crypto";
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { BlobPreconditionFailedError, del, head, list, put } from "@vercel/blob";
import { decryptVaultText, encryptVaultText, previewBlobPrefix } from "@/lib/blobVault";
import {
  saveInternalOrderStateUpdate,
  upsertRezdyNativeOrderMirror,
} from "@/lib/orders";
import {
  PARR_2027_OPTION_B_PRICING_AUTHORITY,
  type ParrAuthoritativeVehicleSlug,
} from "@/lib/pricing";
import {
  buildCanonicalRedRocksBookingCatalog,
  getCurrentDenverDateKey,
  resolveInitialRedRocksShow,
} from "@/lib/shows/redRocksBookingCatalog";

const REZDY_V1_BASE = "https://api.rezdy.com/v1";
export const DEFAULT_CHECKOUT_HOLD_TTL_MS = 10 * 60 * 1000; // 10 minutes
export const SOLD_OUT_TRAVELER_MESSAGE = "Not available for this show." as const;

export type FetchLike = (input: string | URL | Request, init?: RequestInit) => Promise<Response>;

export type ParrInventoryPoolState =
  | "available"
  | "sold_out"
  | "reconciliation_blocked";

export type ParrInventoryUnitState =
  | "temporarily_held"
  | "payment_booking_pending"
  | "confirmed_sold"
  | "cancelled_released"
  | "expired"
  | "reconciliation_blocked";

export type ParrReservationAuditEntry = {
  at: string;
  fromState: ParrInventoryUnitState | null;
  toState: ParrInventoryUnitState;
  event: string;
  actor: string;
  detail?: string;
  rezdyOrderReference?: string | null;
};

export type ParrInventoryReservationRecord = {
  canonicalServiceDate: string;
  canonicalShowId: string;
  vehicleSlug: ParrAuthoritativeVehicleSlug;
  dccProductCode: "parr-suburban" | "parr-van-10";
  internalHoldId: string;
  internalOrderId: string | null;
  bookingToken: string | null;
  idempotencyKey: string;
  resellerReference: string;
  rezdyProductReference: "P94HN4" | "PU8R6Y";
  rezdyOrderReference: string | null;
  source: "native_checkout" | "opening_rezdy_seed" | "manual_rezdy_sync";
  partySize: number;
  createdAt: string;
  updatedAt: string;
  expiresAt: string | null;
  state: ParrInventoryUnitState;
  lastReconciledAt: string | null;
  reconciliationNote: string | null;
  pricingSnapshot: {
    basePriceCents: number;
    calculatedBookingFeeCents: number;
    allInTotalCents: number;
    effectiveSeason: string;
    version: string;
  };
  auditHistory: ParrReservationAuditEntry[];
};

export type ParrInventoryOutboxEntry = {
  outboxId: string;
  createdAt: string;
  updatedAt: string;
  kind:
    | "REZDY_CREATE_AND_FINALIZE"
    | "LOCAL_ORDER_MIRROR_RETRY"
    | "OWNER_RECONCILIATION_ALERT";
  status:
    | "in_progress"
    | "completed_confirmed"
    | "completed_released"
    | "retry_required"
    | "resolved_by_operator";
  attempts: number;
  internalHoldId: string;
  resellerReference: string;
  rezdyOrderReference: string | null;
  lastError: string | null;
  metadata: Record<string, unknown>;
};

export type ParrOwnerReconciliationAlert = {
  alertId: string;
  createdAt: string;
  resolvedAt: string | null;
  resolvedBy: string | null;
  resolutionNote: string | null;
  severity: "critical" | "warning";
  code: string;
  canonicalServiceDate: string;
  canonicalShowId: string;
  vehicleSlug: ParrAuthoritativeVehicleSlug;
  internalHoldId: string | null;
  rezdyOrderReference: string | null;
  summary: string;
};

export type ParrPoolAuditEntry = {
  at: string;
  action: string;
  actor: string;
  detail: string;
};

export type ParrDateVehiclePoolLedger = {
  schema: "parr.vehicle-inventory-ledger.v1";
  poolKey: string;
  canonicalServiceDate: string;
  canonicalShowId: string;
  vehicleSlug: ParrAuthoritativeVehicleSlug;
  dccProductCode: "parr-suburban" | "parr-van-10";
  rezdyProductReference: "P94HN4" | "PU8R6Y";
  capacity: number;
  revision: number;
  openingInventorySeededAt: string | null;
  openingConfirmedRezdyOrders: string[];
  reconciliationBlocked: boolean;
  reconciliationBlockReasons: string[];
  lastReconciledAt: string | null;
  reservations: ParrInventoryReservationRecord[];
  outbox: ParrInventoryOutboxEntry[];
  ownerAlerts: ParrOwnerReconciliationAlert[];
  poolAuditLog: ParrPoolAuditEntry[];
};

export class CasConflictError extends Error {
  constructor(poolKey: string) {
    super(`CAS version conflict on inventory pool ${poolKey}`);
    this.name = "CasConflictError";
  }
}

export interface ParrInventoryCasStore {
  readPool(poolKey: string): Promise<{
    ledger: ParrDateVehiclePoolLedger | null;
    versionToken: string | null;
  }>;
  writePoolCas(
    poolKey: string,
    nextLedger: ParrDateVehiclePoolLedger,
    expectedVersionToken: string | null
  ): Promise<{ versionToken: string }>;
  listKnownPoolKeys(): Promise<string[]>;
}

/**
 * Deterministic reseller reference shared with `parrNativeRezdyService.ts`
 * so we reuse the exact existing idempotency authority (`PARR-<22-char-base64url>`).
 */
export function buildInventoryResellerReference(idempotencyKey: string): string {
  const clean = (idempotencyKey || "").trim();
  if (clean.length < 8) {
    throw new Error("Missing or invalid checkout idempotencyKey (minimum 8 chars required).");
  }
  const digest = crypto.createHash("sha256").update(`parr-rezdy-v1:${clean}`, "utf8").digest();
  return `PARR-${digest.subarray(0, 16).toString("base64url")}`;
}

export function buildPoolKey(
  canonicalServiceDate: string,
  vehicleSlug: ParrAuthoritativeVehicleSlug
): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(canonicalServiceDate)) {
    throw new Error(`Invalid canonicalServiceDate: ${canonicalServiceDate}`);
  }
  if (vehicleSlug !== "suv" && vehicleSlug !== "van") {
    throw new Error(`Invalid vehicleSlug: ${String(vehicleSlug)}`);
  }
  return `${canonicalServiceDate}__${vehicleSlug}`;
}

/**
 * Reuses the canonical Red Rocks show catalog (`rr-YYYY-MM-DD-<slug>`) so no display text
 * or second date/show identity formula is ever created.
 */
export function resolveCanonicalServiceShowIdentity(input: {
  dateKey: string;
  showId?: string | null;
  artist?: string | null;
  todayDateKey?: string;
}): {
  canonicalServiceDate: string;
  canonicalShowId: string;
  isCatalogedShow: boolean;
  isPastShow: boolean;
} {
  const dateKey = (input.dateKey || "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
    throw new Error(`Invalid ISO service date (expected YYYY-MM-DD): "${input.dateKey}"`);
  }
  const today = input.todayDateKey || getCurrentDenverDateKey();
  const catalog = buildCanonicalRedRocksBookingCatalog(today);
  const resolved = resolveInitialRedRocksShow(
    {
      showId: input.showId || null,
      dateKey,
      artist: input.artist || null,
    },
    catalog,
    today
  );

  if (resolved.kind === "single_future_show" || resolved.kind === "past_show") {
    return {
      canonicalServiceDate: resolved.show.dateKey,
      canonicalShowId: resolved.show.id,
      isCatalogedShow: true,
      isPastShow: resolved.show.isPastShow,
    };
  }

  if (resolved.kind === "multiple_shows" && resolved.shows.length > 0) {
    const match =
      (input.showId && resolved.shows.find((s) => s.id === input.showId)) ||
      resolved.shows[0];
    return {
      canonicalServiceDate: dateKey,
      canonicalShowId: match.id,
      isCatalogedShow: true,
      isPastShow: match.isPastShow,
    };
  }

  return {
    canonicalServiceDate: dateKey,
    canonicalShowId: `rr-${dateKey}-service-date`,
    isCatalogedShow: false,
    isPastShow: dateKey < today,
  };
}

function createEmptyPoolLedger(input: {
  canonicalServiceDate: string;
  canonicalShowId: string;
  vehicleSlug: ParrAuthoritativeVehicleSlug;
}): ParrDateVehiclePoolLedger {
  const cfg = PARR_2027_OPTION_B_PRICING_AUTHORITY[input.vehicleSlug];
  return {
    schema: "parr.vehicle-inventory-ledger.v1",
    poolKey: buildPoolKey(input.canonicalServiceDate, input.vehicleSlug),
    canonicalServiceDate: input.canonicalServiceDate,
    canonicalShowId: input.canonicalShowId,
    vehicleSlug: input.vehicleSlug,
    dccProductCode: cfg.dccProductCode,
    rezdyProductReference: cfg.rezdy.previewProductCode,
    capacity: cfg.dailyVehicleCapacity,
    revision: 0,
    openingInventorySeededAt: null,
    openingConfirmedRezdyOrders: [],
    reconciliationBlocked: false,
    reconciliationBlockReasons: [],
    lastReconciledAt: null,
    reservations: [],
    outbox: [],
    ownerAlerts: [],
    poolAuditLog: [],
  };
}

// ============================================================================
// Storage Backends: InMemoryCasStore, SqliteCasStore, and BlobCasStore
// ============================================================================

export class InMemoryCasInventoryStore implements ParrInventoryCasStore {
  private readonly pools = new Map<
    string,
    { json: string; versionToken: string }
  >();
  private readonly onBeforeWriteHook?: (poolKey: string) => Promise<void> | void;

  constructor(opts?: { onBeforeWriteHook?: (poolKey: string) => Promise<void> | void }) {
    this.onBeforeWriteHook = opts?.onBeforeWriteHook;
  }

  async readPool(poolKey: string) {
    const row = this.pools.get(poolKey);
    if (!row) return { ledger: null, versionToken: null };
    return {
      ledger: JSON.parse(row.json) as ParrDateVehiclePoolLedger,
      versionToken: row.versionToken,
    };
  }

  async writePoolCas(
    poolKey: string,
    nextLedger: ParrDateVehiclePoolLedger,
    expectedVersionToken: string | null
  ) {
    if (this.onBeforeWriteHook) {
      await this.onBeforeWriteHook(poolKey);
    }
    const existing = this.pools.get(poolKey);
    if (expectedVersionToken === null) {
      if (existing) throw new CasConflictError(poolKey);
    } else if (!existing || existing.versionToken !== expectedVersionToken) {
      throw new CasConflictError(poolKey);
    }
    const versionToken = `mem-v${nextLedger.revision}-${crypto.randomUUID()}`;
    this.pools.set(poolKey, {
      json: JSON.stringify(nextLedger),
      versionToken,
    });
    return { versionToken };
  }

  async listKnownPoolKeys() {
    return Array.from(this.pools.keys()).sort();
  }
}

type SqliteStatement = {
  run: (...args: unknown[]) => { changes?: number };
  get: (...args: unknown[]) => Record<string, unknown> | undefined;
  all: (...args: unknown[]) => Array<Record<string, unknown>>;
};

type SqliteDatabase = {
  exec: (sql: string) => void;
  prepare: (sql: string) => SqliteStatement;
  close: () => void;
};

type SqliteModule = {
  DatabaseSync: new (filename: string) => SqliteDatabase;
};

let sqliteModPromise: Promise<SqliteModule | null> | null = null;

async function getSqliteModule(): Promise<SqliteModule | null> {
  if (sqliteModPromise) return sqliteModPromise;
  const dynamicImport = Function("s", "return import(s)") as (s: string) => Promise<unknown>;
  sqliteModPromise = dynamicImport("node:sqlite")
    .then((m) => (m && typeof m === "object" && "DatabaseSync" in m ? (m as SqliteModule) : null))
    .catch(() => null);
  return sqliteModPromise;
}

function resolveInventorySqlitePath(): string {
  if (process.env.PARR_INVENTORY_DB_PATH) return process.env.PARR_INVENTORY_DB_PATH;
  if (process.env.ORDER_DB_PATH) return process.env.ORDER_DB_PATH;
  return path.join(process.cwd(), "data", "orders", "orders.sqlite");
}

export class SqliteCasInventoryStore implements ParrInventoryCasStore {
  private async withDb<T>(fn: (db: SqliteDatabase) => T): Promise<T> {
    const sqlite = await getSqliteModule();
    if (!sqlite?.DatabaseSync) {
      throw new Error("node:sqlite DatabaseSync unavailable for local inventory store.");
    }
    const dbFile = resolveInventorySqlitePath();
    const dir = path.dirname(dbFile);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    const db = new sqlite.DatabaseSync(dbFile);
    try {
      db.exec(`
        PRAGMA journal_mode = WAL;
        PRAGMA busy_timeout = 5000;
        CREATE TABLE IF NOT EXISTS parr_vehicle_inventory_pools (
          poolKey TEXT PRIMARY KEY,
          serviceDate TEXT NOT NULL,
          vehicleSlug TEXT NOT NULL,
          revision INTEGER NOT NULL,
          updatedAt TEXT NOT NULL,
          ledgerJson TEXT NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_parr_inv_serviceDate ON parr_vehicle_inventory_pools(serviceDate);
      `);
      return fn(db);
    } finally {
      db.close();
    }
  }

  async readPool(poolKey: string) {
    return this.withDb((db) => {
      const row = db
        .prepare(`SELECT revision, ledgerJson FROM parr_vehicle_inventory_pools WHERE poolKey = ?`)
        .get(poolKey);
      if (!row) return { ledger: null, versionToken: null };
      return {
        ledger: JSON.parse(String(row.ledgerJson)) as ParrDateVehiclePoolLedger,
        versionToken: `sqlite-rev-${Number(row.revision)}`,
      };
    });
  }

  async writePoolCas(
    poolKey: string,
    nextLedger: ParrDateVehiclePoolLedger,
    expectedVersionToken: string | null
  ) {
    return this.withDb((db) => {
      db.exec("BEGIN IMMEDIATE");
      try {
        const nowIso = new Date().toISOString();
        const json = JSON.stringify(nextLedger);
        if (expectedVersionToken === null) {
          const existing = db
            .prepare(`SELECT revision FROM parr_vehicle_inventory_pools WHERE poolKey = ?`)
            .get(poolKey);
          if (existing) {
            throw new CasConflictError(poolKey);
          }
          db.prepare(
            `INSERT INTO parr_vehicle_inventory_pools (poolKey, serviceDate, vehicleSlug, revision, updatedAt, ledgerJson)
             VALUES (?, ?, ?, ?, ?, ?)`
          ).run(
            poolKey,
            nextLedger.canonicalServiceDate,
            nextLedger.vehicleSlug,
            nextLedger.revision,
            nowIso,
            json
          );
        } else {
          const expectedRev = Number(expectedVersionToken.replace("sqlite-rev-", ""));
          const res = db
            .prepare(
              `UPDATE parr_vehicle_inventory_pools
               SET revision = ?, updatedAt = ?, ledgerJson = ?
               WHERE poolKey = ? AND revision = ?`
            )
            .run(nextLedger.revision, nowIso, json, poolKey, expectedRev);
          if (!res || Number(res.changes ?? 0) !== 1) {
            throw new CasConflictError(poolKey);
          }
        }
        db.exec("COMMIT");
        return { versionToken: `sqlite-rev-${nextLedger.revision}` };
      } catch (err) {
        try {
          db.exec("ROLLBACK");
        } catch {}
        throw err;
      }
    });
  }

  async listKnownPoolKeys() {
    return this.withDb((db) => {
      const rows = db
        .prepare(`SELECT poolKey FROM parr_vehicle_inventory_pools ORDER BY poolKey ASC`)
        .all();
      return rows.map((r) => String(r.poolKey));
    });
  }
}

/**
 * Distributed linearizable CAS store over `@vercel/blob`:
 * - Uses `head(headPath)` against the strongly consistent Vercel Blob API (never CDN cached)
 *   to obtain `{ etag, contentType: "application/octet-stream;rev=<revId>" }`.
 * - Writes each encrypted state snapshot to an immutable write-once `revs/<poolKey>/<revId>.enc`
 *   blob (`allowOverwrite: false` -> zero stale CDN edge reads).
 * - Commits the pointer atomically via `put(headPath, revId, { ifMatch: expectedEtag })`,
 *   converting `BlobPreconditionFailedError` into `CasConflictError` for clean retry!
 */
class BlobCasInventoryStore implements ParrInventoryCasStore {
  private basePrefix(): string {
    const keySecret = process.env.PARR_SECRET || process.env.BLOB_READ_WRITE_TOKEN || "parr-inv";
    const nsHash = crypto
      .createHmac("sha256", keySecret)
      .update("parr-vehicle-inventory-v1")
      .digest("hex")
      .slice(0, 16);
    return `${previewBlobPrefix()}cache/inventory-${nsHash}`;
  }

  private headPath(poolKey: string): string {
    return `${this.basePrefix()}/heads/${poolKey}.cas`;
  }

  private revPath(poolKey: string, revId: string): string {
    return `${this.basePrefix()}/revs/${poolKey}/${revId}.enc`;
  }

  private parseRevFromContentType(ct: string): string | null {
    const m = /;\s*rev=([A-Za-z0-9_-]+)/i.exec(ct || "");
    return m ? m[1] : null;
  }

  async readPool(poolKey: string) {
    const hPath = this.headPath(poolKey);
    let meta: Awaited<ReturnType<typeof head>>;
    try {
      meta = await head(hPath);
    } catch {
      return { ledger: null, versionToken: null };
    }

    const revId = this.parseRevFromContentType(meta.contentType);
    if (!revId) {
      return { ledger: null, versionToken: null };
    }

    const rPath = this.revPath(poolKey, revId);
    const revMeta = await head(rPath);
    const res = await fetch(revMeta.url, { cache: "no-store" });
    if (!res.ok) {
      throw new Error(`Failed reading immutable inventory snapshot ${rPath}: HTTP ${res.status}`);
    }
    const rawCipher = await res.text();
    const plaintext = decryptVaultText(rawCipher);
    return {
      ledger: JSON.parse(plaintext) as ParrDateVehiclePoolLedger,
      versionToken: meta.etag,
    };
  }

  async writePoolCas(
    poolKey: string,
    nextLedger: ParrDateVehiclePoolLedger,
    expectedVersionToken: string | null
  ) {
    const revId = `r${nextLedger.revision}_${crypto.randomBytes(8).toString("hex")}`;
    const rPath = this.revPath(poolKey, revId);
    const ciphertext = encryptVaultText(JSON.stringify(nextLedger));

    const snapBlob = await put(rPath, ciphertext, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: false,
      contentType: "application/octet-stream",
      cacheControlMaxAge: 3600,
    });

    try {
      const headBlob = await put(this.headPath(poolKey), revId, {
        access: "public",
        addRandomSuffix: false,
        allowOverwrite: expectedVersionToken !== null,
        ...(expectedVersionToken ? { ifMatch: expectedVersionToken } : {}),
        contentType: `application/octet-stream;rev=${revId}`,
        cacheControlMaxAge: 60,
      });
      return { versionToken: headBlob.etag };
    } catch (err) {
      // Clean up unreferenced candidate snapshot on CAS collision
      void del(snapBlob.url).catch(() => undefined);
      if (
        err instanceof BlobPreconditionFailedError ||
        (err instanceof Error &&
          /precondition|already exists|overwrite/i.test(err.message))
      ) {
        throw new CasConflictError(poolKey);
      }
      throw err;
    }
  }

  async listKnownPoolKeys() {
    const prefix = `${this.basePrefix()}/heads/`;
    const listed = await list({ prefix, limit: 500 });
    return listed.blobs
      .map((b) => {
        const name = b.pathname.slice(prefix.length);
        return name.endsWith(".cas") ? name.slice(0, -4) : null;
      })
      .filter((k): k is string => Boolean(k))
      .sort();
  }
}

let defaultSqliteStore: SqliteCasInventoryStore | null = null;
let defaultBlobStore: BlobCasInventoryStore | null = null;

function resolveDefaultInventoryStore(): ParrInventoryCasStore {
  if (process.env.VERCEL === "1" && process.env.BLOB_READ_WRITE_TOKEN) {
    if (!defaultBlobStore) defaultBlobStore = new BlobCasInventoryStore();
    return defaultBlobStore;
  }
  if (!defaultSqliteStore) defaultSqliteStore = new SqliteCasInventoryStore();
  return defaultSqliteStore;
}

// Per-pool in-process async queue to serialize same-process async callers cleanly,
// while CAS `versionToken` enforces linearizability across separate workers/lambdas.
const inProcessPoolQueues = new Map<string, Promise<unknown>>();

async function withInProcessPoolQueue<T>(
  poolKey: string,
  bypassMutexForCasTest: boolean,
  fn: () => Promise<T>
): Promise<T> {
  if (bypassMutexForCasTest) {
    return fn();
  }
  const prev = inProcessPoolQueues.get(poolKey) ?? Promise.resolve();
  let release!: () => void;
  const gate = new Promise<void>((r) => {
    release = r;
  });
  const chained = prev.then(() => gate);
  inProcessPoolQueues.set(poolKey, chained);

  await prev;
  try {
    return await fn();
  } finally {
    release();
    if (inProcessPoolQueues.get(poolKey) === chained) {
      inProcessPoolQueues.delete(poolKey);
    }
  }
}

async function runAtomicPoolMutation<T>(
  input: {
    canonicalServiceDate: string;
    canonicalShowId: string;
    vehicleSlug: ParrAuthoritativeVehicleSlug;
  },
  mutator: (
    draft: ParrDateVehiclePoolLedger
  ) => Promise<{ commit: boolean; result: T }> | { commit: boolean; result: T },
  opts?: {
    store?: ParrInventoryCasStore;
    bypassInProcessQueueForCasTest?: boolean;
    maxCasAttempts?: number;
  }
): Promise<T> {
  const store = opts?.store ?? resolveDefaultInventoryStore();
  const poolKey = buildPoolKey(input.canonicalServiceDate, input.vehicleSlug);
  const maxAttempts = opts?.maxCasAttempts ?? 16;

  return withInProcessPoolQueue(
    poolKey,
    Boolean(opts?.bypassInProcessQueueForCasTest),
    async () => {
      for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
        const { ledger, versionToken } = await store.readPool(poolKey);
        const draft: ParrDateVehiclePoolLedger = ledger
          ? (JSON.parse(JSON.stringify(ledger)) as ParrDateVehiclePoolLedger)
          : createEmptyPoolLedger(input);

        const outcome = await mutator(draft);
        if (!outcome.commit) {
          return outcome.result;
        }

        draft.revision = (ledger?.revision ?? 0) + 1;
        try {
          await store.writePoolCas(poolKey, draft, versionToken);
          return outcome.result;
        } catch (err) {
          if (err instanceof CasConflictError && attempt < maxAttempts) {
            continue;
          }
          throw err;
        }
      }
      throw new Error(`Exceeded maximum CAS retry attempts (${maxAttempts}) on pool ${poolKey}`);
    }
  );
}

// ============================================================================
// Pure Ledger Calculations & Sweep Helpers
// ============================================================================

export function sweepExpiredHoldsInDraft(
  draft: ParrDateVehiclePoolLedger,
  nowMs: number
): number {
  const nowIso = new Date(nowMs).toISOString();
  let swept = 0;
  for (const rec of draft.reservations) {
    if (
      rec.state === "temporarily_held" &&
      rec.expiresAt &&
      Date.parse(rec.expiresAt) <= nowMs
    ) {
      const prev = rec.state;
      rec.state = "expired";
      rec.updatedAt = nowIso;
      rec.auditHistory.push({
        at: nowIso,
        fromState: prev,
        toState: "expired",
        event: "hold_ttl_expired",
        actor: "system_ttl_sweeper",
        detail: `Checkout hold expired at ${rec.expiresAt}`,
      });
      swept += 1;
    }
  }
  return swept;
}

export function isUnitConsumingCapacity(
  rec: ParrInventoryReservationRecord,
  nowMs: number
): boolean {
  if (rec.state === "confirmed_sold") return true;
  if (rec.state === "payment_booking_pending") return true;
  if (rec.state === "reconciliation_blocked") return true;
  if (rec.state === "temporarily_held") {
    if (!rec.expiresAt) return true;
    return Date.parse(rec.expiresAt) > nowMs;
  }
  return false;
}

export type ComputedPoolSummary = {
  canonicalServiceDate: string;
  canonicalShowId: string;
  vehicleSlug: ParrAuthoritativeVehicleSlug;
  capacity: number;
  confirmedSoldCount: number;
  activeHoldCount: number;
  pendingPaymentCount: number;
  reconciliationBlockedUnitCount: number;
  cancelledReleasedCount: number;
  expiredCount: number;
  allocatedCount: number;
  availableCount: number;
  poolState: ParrInventoryPoolState;
  reconciliationBlocked: boolean;
  available: boolean;
  soldOut: boolean;
  travelerStatusMessage: typeof SOLD_OUT_TRAVELER_MESSAGE | null;
};

export function computePoolSummary(
  ledger: ParrDateVehiclePoolLedger,
  nowMs = Date.now()
): ComputedPoolSummary {
  let confirmedSoldCount = 0;
  let activeHoldCount = 0;
  let pendingPaymentCount = 0;
  let reconciliationBlockedUnitCount = 0;
  let cancelledReleasedCount = 0;
  let expiredCount = 0;

  for (const rec of ledger.reservations) {
    if (rec.state === "confirmed_sold") {
      confirmedSoldCount += 1;
    } else if (rec.state === "payment_booking_pending") {
      pendingPaymentCount += 1;
    } else if (rec.state === "reconciliation_blocked") {
      reconciliationBlockedUnitCount += 1;
    } else if (rec.state === "temporarily_held") {
      if (!rec.expiresAt || Date.parse(rec.expiresAt) > nowMs) {
        activeHoldCount += 1;
      } else {
        expiredCount += 1;
      }
    } else if (rec.state === "cancelled_released") {
      cancelledReleasedCount += 1;
    } else if (rec.state === "expired") {
      expiredCount += 1;
    }
  }

  const allocatedCount =
    confirmedSoldCount +
    activeHoldCount +
    pendingPaymentCount +
    reconciliationBlockedUnitCount;

  const effectiveBlocked =
    ledger.reconciliationBlocked || reconciliationBlockedUnitCount > 0;

  // Inventory must NEVER become negative
  const rawRemaining = Math.max(0, ledger.capacity - allocatedCount);
  const availableCount = effectiveBlocked ? 0 : rawRemaining;

  const poolState: ParrInventoryPoolState = effectiveBlocked
    ? "reconciliation_blocked"
    : availableCount > 0
      ? "available"
      : "sold_out";

  const available = poolState === "available";
  return {
    canonicalServiceDate: ledger.canonicalServiceDate,
    canonicalShowId: ledger.canonicalShowId,
    vehicleSlug: ledger.vehicleSlug,
    capacity: ledger.capacity,
    confirmedSoldCount,
    activeHoldCount,
    pendingPaymentCount,
    reconciliationBlockedUnitCount,
    cancelledReleasedCount,
    expiredCount,
    allocatedCount,
    availableCount,
    poolState,
    reconciliationBlocked: effectiveBlocked,
    available,
    soldOut: !available,
    travelerStatusMessage: available ? null : SOLD_OUT_TRAVELER_MESSAGE,
  };
}

// ============================================================================
// Upstream Rezdy Read Helpers for Opening Seed & Reconciliation
// ============================================================================

export type UpstreamRezdyOrderSnapshot = {
  orderNumber: string;
  status: string;
  resellerReference: string | null;
  productCode: string;
  startTimeLocal: string;
  dateKey: string;
  quantity: number;
  totalAmount: number;
  totalPaid: number;
  customer: Record<string, unknown> | null;
  pickupLocation: string | null;
  rawBooking: Record<string, unknown>;
};

function getRezdyApiKeyOrThrow(): string {
  const k = (process.env.REZDY_API_KEY || "").trim();
  if (!k) throw new Error("REZDY_API_KEY is unavailable in the server runtime.");
  return k;
}

async function fetchRezdyJsonReadOnly(
  pathWithQuery: string,
  fetchImpl?: FetchLike
): Promise<Record<string, unknown>> {
  const apiKey = getRezdyApiKeyOrThrow();
  const normalized = pathWithQuery.startsWith("/") ? pathWithQuery : `/${pathWithQuery}`;
  const url = new URL(`${REZDY_V1_BASE}${normalized}`);
  url.searchParams.set("apiKey", apiKey);

  const f = fetchImpl ?? fetch;
  const res = await f(url.toString(), {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  const text = await res.text();
  const scrubbed = apiKey ? text.split(apiKey).join("[REDACTED]") : text;
  if (!res.ok) {
    throw new Error(`Rezdy HTTP ${res.status}: ${scrubbed.slice(0, 260)}`);
  }
  return JSON.parse(scrubbed) as Record<string, unknown>;
}

function parseRezdyOrderSnapshotsForDate(
  rawBookings: Array<Record<string, unknown>>,
  expectedProductCode: string,
  expectedDateKey: string
): UpstreamRezdyOrderSnapshot[] {
  const out: UpstreamRezdyOrderSnapshot[] = [];
  for (const b of rawBookings) {
    const orderNumber = typeof b.orderNumber === "string" ? b.orderNumber.trim() : "";
    if (!orderNumber) continue;
    const status = typeof b.status === "string" ? b.status.trim().toUpperCase() : "UNKNOWN";
    const resellerReference =
      typeof b.resellerReference === "string" && b.resellerReference.trim()
        ? b.resellerReference.trim()
        : null;
    const items = Array.isArray(b.items)
      ? (b.items as Array<Record<string, unknown>>)
      : [];

    for (const item of items) {
      const pCode = String(item.productCode || "").trim().toUpperCase();
      const startTimeLocal = String(item.startTimeLocal || "").trim();
      const itemDateKey = startTimeLocal.slice(0, 10);
      if (pCode !== expectedProductCode.toUpperCase()) continue;
      if (itemDateKey !== expectedDateKey) continue;

      const quantities = Array.isArray(item.quantities)
        ? (item.quantities as Array<Record<string, unknown>>)
        : [];
      const qtySum = quantities.reduce(
        (acc, q) => acc + Math.max(0, Number(q.value ?? 1) || 0),
        0
      );
      const quantity = qtySum > 0 ? qtySum : 1;
      const pickupObj =
        item.pickupId && typeof item.pickupId === "object"
          ? (item.pickupId as Record<string, unknown>)
          : null;
      const pickupLocation =
        typeof item.pickupLocation === "string"
          ? item.pickupLocation
          : typeof pickupObj?.locationName === "string"
            ? pickupObj.locationName
            : null;

      out.push({
        orderNumber,
        status,
        resellerReference,
        productCode: pCode,
        startTimeLocal,
        dateKey: itemDateKey,
        quantity,
        totalAmount: Number(b.totalAmount ?? 0),
        totalPaid: Number(b.totalPaid ?? 0),
        customer:
          b.customer && typeof b.customer === "object"
            ? (b.customer as Record<string, unknown>)
            : null,
        pickupLocation,
        rawBooking: b,
      });
    }
  }
  return out;
}

export async function fetchUpstreamRezdyOrdersForPool(
  input: {
    rezdyProductCode: "P94HN4" | "PU8R6Y";
    dateKey: string;
  },
  deps?: { fetchImpl?: FetchLike }
): Promise<UpstreamRezdyOrderSnapshot[]> {
  const minTour = `${input.dateKey} 00:00:00`;
  const maxTour = `${input.dateKey} 23:59:59`;
  const json = await fetchRezdyJsonReadOnly(
    `/bookings?productCode=${encodeURIComponent(input.rezdyProductCode)}&minTourStartDate=${encodeURIComponent(minTour)}&maxTourStartDate=${encodeURIComponent(maxTour)}&limit=100`,
    deps?.fetchImpl
  );
  const rawBookings = Array.isArray(json.bookings)
    ? (json.bookings as Array<Record<string, unknown>>)
    : [];
  return parseRezdyOrderSnapshotsForDate(
    rawBookings,
    input.rezdyProductCode,
    input.dateKey
  );
}

// ============================================================================
// Core Inventory Operations: Seed, Availability, Hold, Pending/Outbox, Confirm,
// Failure-Injection Block, Cancellation Release, and Rezdy Reconciliation
// ============================================================================

export type InventoryRuntimeDeps = {
  store?: ParrInventoryCasStore;
  fetchImpl?: FetchLike;
  nowMs?: () => number;
  holdTtlMs?: number;
  bypassInProcessQueueForCasTest?: boolean;
  skipOpeningRezdyFetch?: boolean;
  finalizeOrderMirrorImpl?: typeof upsertRezdyNativeOrderMirror;
  updateOrderStateImpl?: typeof saveInternalOrderStateUpdate;
  onOwnerAlert?: (alert: ParrOwnerReconciliationAlert) => Promise<void> | void;
};

/**
 * Section E: Before enabling a date, establish its opening inventory from existing
 * confirmed Rezdy bookings so pre-existing or manually entered reservations are counted.
 */
export async function ensureOpeningInventorySeeded(
  input: {
    dateKey: string;
    vehicleSlug: ParrAuthoritativeVehicleSlug;
    showId?: string | null;
    artist?: string | null;
  },
  deps?: InventoryRuntimeDeps
): Promise<ParrDateVehiclePoolLedger> {
  const nowFn = deps?.nowMs ?? Date.now;
  const identity = resolveCanonicalServiceShowIdentity({
    dateKey: input.dateKey,
    showId: input.showId,
    artist: input.artist,
  });
  const cfg = PARR_2027_OPTION_B_PRICING_AUTHORITY[input.vehicleSlug];
  const store = deps?.store ?? resolveDefaultInventoryStore();
  const poolKey = buildPoolKey(identity.canonicalServiceDate, input.vehicleSlug);

  const existing = await store.readPool(poolKey);
  if (existing.ledger?.openingInventorySeededAt) {
    return existing.ledger;
  }

  const upstreamConfirmed: UpstreamRezdyOrderSnapshot[] = deps?.skipOpeningRezdyFetch
    ? []
    : (
        await fetchUpstreamRezdyOrdersForPool(
          {
            rezdyProductCode: cfg.rezdy.previewProductCode,
            dateKey: identity.canonicalServiceDate,
          },
          { fetchImpl: deps?.fetchImpl }
        )
      ).filter((o) => o.status === "CONFIRMED");

  return runAtomicPoolMutation<ParrDateVehiclePoolLedger>(
    {
      canonicalServiceDate: identity.canonicalServiceDate,
      canonicalShowId: identity.canonicalShowId,
      vehicleSlug: input.vehicleSlug,
    },
    (draft) => {
      if (draft.openingInventorySeededAt) {
        return { commit: false, result: draft };
      }

      const nowIso = new Date(nowFn()).toISOString();
      const seededOrders: string[] = [];

      for (const order of upstreamConfirmed) {
        for (let unitIdx = 0; unitIdx < Math.max(1, order.quantity); unitIdx += 1) {
          const unitOrderRef =
            order.quantity > 1 ? `${order.orderNumber}#${unitIdx + 1}` : order.orderNumber;
          const alreadyTracked = draft.reservations.some(
            (r) =>
              r.rezdyOrderReference === unitOrderRef ||
              (order.resellerReference && r.resellerReference === order.resellerReference)
          );
          if (alreadyTracked) continue;

          const syntheticKey =
            order.resellerReference || `seed-${order.orderNumber}-u${unitIdx + 1}`;
          const resellerRef = order.resellerReference || `SEED-${order.orderNumber}-${unitIdx + 1}`;
          draft.reservations.push({
            canonicalServiceDate: identity.canonicalServiceDate,
            canonicalShowId: identity.canonicalShowId,
            vehicleSlug: input.vehicleSlug,
            dccProductCode: cfg.dccProductCode,
            internalHoldId: `hold_seed_${crypto.randomUUID()}`,
            internalOrderId: null,
            bookingToken: null,
            idempotencyKey: syntheticKey,
            resellerReference: resellerRef,
            rezdyProductReference: cfg.rezdy.previewProductCode,
            rezdyOrderReference: unitOrderRef,
            source: "opening_rezdy_seed",
            partySize: cfg.maxGuests,
            createdAt: nowIso,
            updatedAt: nowIso,
            expiresAt: null,
            state: "confirmed_sold",
            lastReconciledAt: nowIso,
            reconciliationNote: "Seeded from existing confirmed Rezdy booking prior to opening date.",
            pricingSnapshot: {
              basePriceCents: cfg.basePriceCents,
              calculatedBookingFeeCents: cfg.calculatedBookingFeeCents,
              allInTotalCents: cfg.allInTotalCents,
              effectiveSeason: cfg.effectiveSeason,
              version: cfg.version,
            },
            auditHistory: [
              {
                at: nowIso,
                fromState: null,
                toState: "confirmed_sold",
                event: "opening_inventory_seeded",
                actor: "rezdy_opening_seed",
                detail: `Counted pre-existing confirmed Rezdy order ${order.orderNumber}`,
                rezdyOrderReference: unitOrderRef,
              },
            ],
          });
          seededOrders.push(unitOrderRef);
        }
      }

      draft.openingInventorySeededAt = nowIso;
      draft.openingConfirmedRezdyOrders = seededOrders;
      draft.lastReconciledAt = nowIso;

      const confirmedCount = draft.reservations.filter(
        (r) => r.state === "confirmed_sold"
      ).length;
      if (confirmedCount > draft.capacity) {
        draft.reconciliationBlocked = true;
        const reason = `OPENING_SEED_OVER_CAPACITY: Rezdy has ${confirmedCount} confirmed bookings vs capacity ${draft.capacity}`;
        draft.reconciliationBlockReasons.push(reason);
        draft.ownerAlerts.push({
          alertId: `alt_${crypto.randomUUID()}`,
          createdAt: nowIso,
          resolvedAt: null,
          resolvedBy: null,
          resolutionNote: null,
          severity: "critical",
          code: "OPENING_SEED_OVER_CAPACITY",
          canonicalServiceDate: draft.canonicalServiceDate,
          canonicalShowId: draft.canonicalShowId,
          vehicleSlug: draft.vehicleSlug,
          internalHoldId: null,
          rezdyOrderReference: seededOrders[seededOrders.length - 1] ?? null,
          summary: reason,
        });
      }

      draft.poolAuditLog.push({
        at: nowIso,
        action: "opening_inventory_seeded",
        actor: "system",
        detail: `Seeded ${seededOrders.length} pre-existing confirmed Rezdy unit(s); capacity=${draft.capacity}`,
      });

      return { commit: true, result: draft };
    },
    {
      store,
      bypassInProcessQueueForCasTest: deps?.bypassInProcessQueueForCasTest,
    }
  );
}

/**
 * Public-safe availability summary for travelers (Section H).
 * Never exposes private booking records, order numbers, or customer PII,
 * and never invents fake scarcity copy.
 */
export async function getPublicVehicleAvailability(
  input: {
    dateKey: string;
    vehicleSlug: ParrAuthoritativeVehicleSlug;
    showId?: string | null;
    artist?: string | null;
  },
  deps?: InventoryRuntimeDeps
) {
  const nowMs = (deps?.nowMs ?? Date.now)();
  const identity = resolveCanonicalServiceShowIdentity({
    dateKey: input.dateKey,
    showId: input.showId,
    artist: input.artist,
  });

  if (identity.isPastShow) {
    const cfg = PARR_2027_OPTION_B_PRICING_AUTHORITY[input.vehicleSlug];
    return {
      canonicalServiceDate: identity.canonicalServiceDate,
      canonicalShowId: identity.canonicalShowId,
      vehicleSlug: input.vehicleSlug,
      capacity: cfg.dailyVehicleCapacity,
      availableCount: 0,
      available: false,
      soldOut: true,
      poolState: "sold_out" as ParrInventoryPoolState,
      statusMessage: SOLD_OUT_TRAVELER_MESSAGE,
    };
  }

  const seeded = await ensureOpeningInventorySeeded(input, deps);
  const summary = computePoolSummary(seeded, nowMs);

  return {
    canonicalServiceDate: summary.canonicalServiceDate,
    canonicalShowId: summary.canonicalShowId,
    vehicleSlug: summary.vehicleSlug,
    capacity: summary.capacity,
    availableCount: summary.availableCount,
    available: summary.available,
    soldOut: summary.soldOut,
    poolState: summary.poolState,
    statusMessage: summary.travelerStatusMessage,
  };
}

export type AcquireHoldResult =
  | {
      ok: true;
      idempotentReused: boolean;
      hold: ParrInventoryReservationRecord;
      poolSummary: ComputedPoolSummary;
    }
  | {
      ok: false;
      code: "SOLD_OUT" | "RECONCILIATION_BLOCKED" | "PAST_SHOW_NOT_BOOKABLE";
      message: typeof SOLD_OUT_TRAVELER_MESSAGE;
      poolSummary: ComputedPoolSummary;
    };

/**
 * Section G (Rules 1-4) & Section H:
 * Atomically reserves 1 vehicle using a short-lived checkout hold immediately before payment.
 * - Availability = capacity - confirmed_sold - active holds - pending - reconciliation_blocked
 * - Two simultaneous requests for the final vehicle produce AT MOST ONE hold
 * - Repeated requests with the same `idempotencyKey` reuse the existing hold/record and consume 0 extra units
 */
export async function acquireOrReuseCheckoutHold(
  input: {
    dateKey: string;
    vehicleSlug: ParrAuthoritativeVehicleSlug;
    idempotencyKey: string;
    partySize: number;
    showId?: string | null;
    artist?: string | null;
  },
  deps?: InventoryRuntimeDeps
): Promise<AcquireHoldResult> {
  const nowFn = deps?.nowMs ?? Date.now;
  const ttlMs = deps?.holdTtlMs ?? DEFAULT_CHECKOUT_HOLD_TTL_MS;
  const resellerReference = buildInventoryResellerReference(input.idempotencyKey);
  const cfg = PARR_2027_OPTION_B_PRICING_AUTHORITY[input.vehicleSlug];

  const identity = resolveCanonicalServiceShowIdentity({
    dateKey: input.dateKey,
    showId: input.showId,
    artist: input.artist,
  });

  if (identity.isPastShow) {
    const emptySummary = computePoolSummary(
      createEmptyPoolLedger({
        canonicalServiceDate: identity.canonicalServiceDate,
        canonicalShowId: identity.canonicalShowId,
        vehicleSlug: input.vehicleSlug,
      }),
      nowFn()
    );
    return {
      ok: false,
      code: "PAST_SHOW_NOT_BOOKABLE",
      message: SOLD_OUT_TRAVELER_MESSAGE,
      poolSummary: {
        ...emptySummary,
        availableCount: 0,
        available: false,
        soldOut: true,
        poolState: "sold_out",
        travelerStatusMessage: SOLD_OUT_TRAVELER_MESSAGE,
      },
    };
  }

  await ensureOpeningInventorySeeded(
    {
      dateKey: identity.canonicalServiceDate,
      vehicleSlug: input.vehicleSlug,
      showId: identity.canonicalShowId,
    },
    deps
  );

  return runAtomicPoolMutation<AcquireHoldResult>(
    {
      canonicalServiceDate: identity.canonicalServiceDate,
      canonicalShowId: identity.canonicalShowId,
      vehicleSlug: input.vehicleSlug,
    },
    (draft) => {
      const nowMs = nowFn();
      const nowIso = new Date(nowMs).toISOString();
      const sweptCount = sweepExpiredHoldsInDraft(draft, nowMs);

      // Idempotent lookup: active hold, pending, confirmed_sold, or reconciliation_blocked
      const existingActive = draft.reservations.find(
        (r) =>
          (r.resellerReference === resellerReference ||
            r.idempotencyKey === input.idempotencyKey.trim()) &&
          isUnitConsumingCapacity(r, nowMs)
      );

      if (existingActive) {
        if (existingActive.state === "temporarily_held") {
          existingActive.expiresAt = new Date(nowMs + ttlMs).toISOString();
          existingActive.updatedAt = nowIso;
        }
        const summary = computePoolSummary(draft, nowMs);
        return {
          commit: sweptCount > 0 || existingActive.state === "temporarily_held",
          result: {
            ok: true,
            idempotentReused: true,
            hold: JSON.parse(JSON.stringify(existingActive)) as ParrInventoryReservationRecord,
            poolSummary: summary,
          },
        };
      }

      const summaryBefore = computePoolSummary(draft, nowMs);
      if (summaryBefore.reconciliationBlocked) {
        return {
          commit: sweptCount > 0,
          result: {
            ok: false,
            code: "RECONCILIATION_BLOCKED",
            message: SOLD_OUT_TRAVELER_MESSAGE,
            poolSummary: summaryBefore,
          },
        };
      }

      if (summaryBefore.availableCount < 1) {
        return {
          commit: sweptCount > 0,
          result: {
            ok: false,
            code: "SOLD_OUT",
            message: SOLD_OUT_TRAVELER_MESSAGE,
            poolSummary: summaryBefore,
          },
        };
      }

      const expiresAtIso = new Date(nowMs + ttlMs).toISOString();
      const newHold: ParrInventoryReservationRecord = {
        canonicalServiceDate: identity.canonicalServiceDate,
        canonicalShowId: identity.canonicalShowId,
        vehicleSlug: input.vehicleSlug,
        dccProductCode: cfg.dccProductCode,
        internalHoldId: `hold_${crypto.randomUUID()}`,
        internalOrderId: null,
        bookingToken: null,
        idempotencyKey: input.idempotencyKey.trim(),
        resellerReference,
        rezdyProductReference: cfg.rezdy.previewProductCode,
        rezdyOrderReference: null,
        source: "native_checkout",
        partySize: Math.min(cfg.maxGuests, Math.max(1, Math.floor(input.partySize || 1))),
        createdAt: nowIso,
        updatedAt: nowIso,
        expiresAt: expiresAtIso,
        state: "temporarily_held",
        lastReconciledAt: null,
        reconciliationNote: null,
        pricingSnapshot: {
          basePriceCents: cfg.basePriceCents,
          calculatedBookingFeeCents: cfg.calculatedBookingFeeCents,
          allInTotalCents: cfg.allInTotalCents,
          effectiveSeason: cfg.effectiveSeason,
          version: cfg.version,
        },
        auditHistory: [
          {
            at: nowIso,
            fromState: null,
            toState: "temporarily_held",
            event: "checkout_hold_acquired",
            actor: "native_checkout",
            detail: `Reserved 1 ${cfg.shortLabel} until ${expiresAtIso}`,
          },
        ],
      };

      draft.reservations.push(newHold);
      const summaryAfter = computePoolSummary(draft, nowMs);

      return {
        commit: true,
        result: {
          ok: true,
          idempotentReused: false,
          hold: JSON.parse(JSON.stringify(newHold)) as ParrInventoryReservationRecord,
          poolSummary: summaryAfter,
        },
      };
    },
    {
      store: deps?.store,
      bypassInProcessQueueForCasTest: deps?.bypassInProcessQueueForCasTest,
    }
  );
}

/**
 * Promotes an active hold to `payment_booking_pending` and writes a durable outbox record
 * BEFORE calling Rezdy `POST /v1/bookings`, so a server crash mid-flight never loses track of the unit.
 */
export async function promoteHoldToPendingWithOutbox(
  input: {
    dateKey: string;
    vehicleSlug: ParrAuthoritativeVehicleSlug;
    internalHoldId: string;
    resellerReference: string;
    metadata: Record<string, unknown>;
  },
  deps?: InventoryRuntimeDeps
): Promise<{
  alreadyConfirmedOrderNumber: string | null;
  outboxId: string;
  reservation: ParrInventoryReservationRecord;
}> {
  const nowFn = deps?.nowMs ?? Date.now;
  const identity = resolveCanonicalServiceShowIdentity({ dateKey: input.dateKey });

  return runAtomicPoolMutation<{
    alreadyConfirmedOrderNumber: string | null;
    outboxId: string;
    reservation: ParrInventoryReservationRecord;
  }>(
    {
      canonicalServiceDate: identity.canonicalServiceDate,
      canonicalShowId: identity.canonicalShowId,
      vehicleSlug: input.vehicleSlug,
    },
    (draft) => {
      const nowMs = nowFn();
      const nowIso = new Date(nowMs).toISOString();
      const rec = draft.reservations.find(
        (r) =>
          r.internalHoldId === input.internalHoldId ||
          (r.resellerReference === input.resellerReference && isUnitConsumingCapacity(r, nowMs))
      );
      if (!rec) {
        throw new Error(`Hold ${input.internalHoldId} not found or already released.`);
      }

      if (rec.state === "confirmed_sold" && rec.rezdyOrderReference) {
        return {
          commit: false,
          result: {
            alreadyConfirmedOrderNumber: rec.rezdyOrderReference,
            outboxId: "already_confirmed",
            reservation: JSON.parse(JSON.stringify(rec)) as ParrInventoryReservationRecord,
          },
        };
      }

      const prev = rec.state;
      rec.state = "payment_booking_pending";
      rec.expiresAt = null;
      rec.updatedAt = nowIso;
      rec.auditHistory.push({
        at: nowIso,
        fromState: prev,
        toState: "payment_booking_pending",
        event: "payment_submission_started",
        actor: "native_checkout",
        detail: "Durable outbox entry created before Rezdy booking submission.",
      });

      const existingOutbox = draft.outbox.find(
        (o) =>
          o.internalHoldId === rec.internalHoldId &&
          o.kind === "REZDY_CREATE_AND_FINALIZE" &&
          o.status === "in_progress"
      );
      const outboxId = existingOutbox?.outboxId ?? `obx_${crypto.randomUUID()}`;
      if (existingOutbox) {
        existingOutbox.attempts += 1;
        existingOutbox.updatedAt = nowIso;
      } else {
        draft.outbox.push({
          outboxId,
          createdAt: nowIso,
          updatedAt: nowIso,
          kind: "REZDY_CREATE_AND_FINALIZE",
          status: "in_progress",
          attempts: 1,
          internalHoldId: rec.internalHoldId,
          resellerReference: rec.resellerReference,
          rezdyOrderReference: null,
          lastError: null,
          metadata: input.metadata,
        });
      }

      return {
        commit: true,
        result: {
          alreadyConfirmedOrderNumber: null,
          outboxId,
          reservation: JSON.parse(JSON.stringify(rec)) as ParrInventoryReservationRecord,
        },
      };
    },
    {
      store: deps?.store,
      bypassInProcessQueueForCasTest: deps?.bypassInProcessQueueForCasTest,
    }
  );
}

/**
 * Section G (Rule 6): Failed payment, rejected booking, or explicit release transitions
 * the hold to `expired` without leaving a partial sale and restores 1 unit to availability.
 */
export async function releaseHoldAfterFailedAttempt(
  input: {
    dateKey: string;
    vehicleSlug: ParrAuthoritativeVehicleSlug;
    internalHoldId: string;
    reason: string;
  },
  deps?: InventoryRuntimeDeps
): Promise<ComputedPoolSummary> {
  const nowFn = deps?.nowMs ?? Date.now;
  const identity = resolveCanonicalServiceShowIdentity({ dateKey: input.dateKey });

  return runAtomicPoolMutation<ComputedPoolSummary>(
    {
      canonicalServiceDate: identity.canonicalServiceDate,
      canonicalShowId: identity.canonicalShowId,
      vehicleSlug: input.vehicleSlug,
    },
    (draft) => {
      const nowMs = nowFn();
      const nowIso = new Date(nowMs).toISOString();
      const rec = draft.reservations.find((r) => r.internalHoldId === input.internalHoldId);
      if (
        rec &&
        (rec.state === "temporarily_held" || rec.state === "payment_booking_pending")
      ) {
        const prev = rec.state;
        rec.state = "expired";
        rec.updatedAt = nowIso;
        rec.expiresAt = nowIso;
        rec.auditHistory.push({
          at: nowIso,
          fromState: prev,
          toState: "expired",
          event: "hold_released_after_failed_payment_or_rejection",
          actor: "native_checkout",
          detail: input.reason,
        });
      }

      for (const obx of draft.outbox) {
        if (obx.internalHoldId === input.internalHoldId && obx.status === "in_progress") {
          obx.status = "completed_released";
          obx.updatedAt = nowIso;
          obx.lastError = input.reason;
        }
      }

      return {
        commit: true,
        result: computePoolSummary(draft, nowMs),
      };
    },
    {
      store: deps?.store,
      bypassInProcessQueueForCasTest: deps?.bypassInProcessQueueForCasTest,
    }
  );
}

/**
 * Section G (Rules 5 & 7):
 * Finalizes a confirmed Rezdy booking locally (`InternalOrderRow`) and converts the hold to `confirmed_sold`.
 * If local finalization fails after Rezdy succeeded, preserves the booking as `reconciliation_blocked`,
 * blocks that inventory unit so it can NEVER be resold, schedules outbox retry, and alerts the owner!
 */
export async function finalizeConfirmedRezdyHold(
  input: {
    dateKey: string;
    vehicleSlug: ParrAuthoritativeVehicleSlug;
    internalHoldId: string;
    rezdyOrderNumber: string;
    resellerReference: string;
    startTimeLocal: string;
    partySize: number;
    customer: Record<string, unknown>;
    pickup: Record<string, unknown>;
    rezdyBookingPayload: Record<string, unknown>;
  },
  deps?: InventoryRuntimeDeps
): Promise<
  | {
      finalizedLocally: true;
      internalOrderId: string;
      bookingToken: string;
      poolSummary: ComputedPoolSummary;
    }
  | {
      finalizedLocally: false;
      reconciliationBlocked: true;
      alert: ParrOwnerReconciliationAlert;
      poolSummary: ComputedPoolSummary;
    }
> {
  const nowFn = deps?.nowMs ?? Date.now;
  const cfg = PARR_2027_OPTION_B_PRICING_AUTHORITY[input.vehicleSlug];
  const identity = resolveCanonicalServiceShowIdentity({ dateKey: input.dateKey });
  const mirrorFn = deps?.finalizeOrderMirrorImpl ?? upsertRezdyNativeOrderMirror;

  let mirrorRes: { internalOrderId: string; bookingToken: string } | null = null;
  let mirrorError: string | null = null;

  try {
    mirrorRes = await mirrorFn({
      orderNumber: input.rezdyOrderNumber,
      resellerReference: input.resellerReference,
      dccProductCode: cfg.dccProductCode,
      rezdyProductCode: cfg.rezdy.previewProductCode,
      serviceDate: identity.canonicalServiceDate,
      canonicalShowId: identity.canonicalShowId,
      startTimeLocal: input.startTimeLocal,
      partySize: input.partySize,
      customer: input.customer,
      pickup: input.pickup,
      totalChargedUsd: cfg.allInTotalUsd,
      basePriceUsd: cfg.basePriceUsd,
      bookingFeeUsd: cfg.bookingFeeUsd,
      rezdyBookingPayload: input.rezdyBookingPayload,
      source: "native_checkout",
    });
  } catch (err) {
    mirrorError = err instanceof Error ? err.message : String(err);
  }

  if (mirrorRes) {
    const summary = await runAtomicPoolMutation(
      {
        canonicalServiceDate: identity.canonicalServiceDate,
        canonicalShowId: identity.canonicalShowId,
        vehicleSlug: input.vehicleSlug,
      },
      (draft) => {
        const nowMs = nowFn();
        const nowIso = new Date(nowMs).toISOString();
        const rec = draft.reservations.find(
          (r) =>
            r.internalHoldId === input.internalHoldId ||
            r.resellerReference === input.resellerReference
        );
        if (!rec) {
          throw new Error(`Cannot finalize missing hold ${input.internalHoldId}`);
        }
        const prev = rec.state;
        rec.state = "confirmed_sold";
        rec.rezdyOrderReference = input.rezdyOrderNumber;
        rec.internalOrderId = mirrorRes.internalOrderId;
        rec.bookingToken = mirrorRes.bookingToken;
        rec.expiresAt = null;
        rec.updatedAt = nowIso;
        rec.lastReconciledAt = nowIso;
        rec.auditHistory.push({
          at: nowIso,
          fromState: prev,
          toState: "confirmed_sold",
          event: "rezdy_confirmed_and_locally_finalized",
          actor: "native_checkout",
          detail: `Rezdy order ${input.rezdyOrderNumber} confirmed & mirrored to ${mirrorRes.internalOrderId}`,
          rezdyOrderReference: input.rezdyOrderNumber,
        });

        for (const obx of draft.outbox) {
          if (obx.internalHoldId === rec.internalHoldId && obx.status === "in_progress") {
            obx.status = "completed_confirmed";
            obx.rezdyOrderReference = input.rezdyOrderNumber;
            obx.updatedAt = nowIso;
          }
        }

        return { commit: true, result: computePoolSummary(draft, nowMs) };
      },
      {
        store: deps?.store,
        bypassInProcessQueueForCasTest: deps?.bypassInProcessQueueForCasTest,
      }
    );

    return {
      finalizedLocally: true,
      internalOrderId: mirrorRes.internalOrderId,
      bookingToken: mirrorRes.bookingToken,
      poolSummary: summary,
    };
  }

  // Requirement G.7: Rezdy succeeded, local finalization failed!
  // Preserve booking as pending reconciliation (`reconciliation_blocked`), block that unit, and alert owner.
  const blockedResult = await runAtomicPoolMutation(
    {
      canonicalServiceDate: identity.canonicalServiceDate,
      canonicalShowId: identity.canonicalShowId,
      vehicleSlug: input.vehicleSlug,
    },
    (draft) => {
      const nowMs = nowFn();
      const nowIso = new Date(nowMs).toISOString();
      const rec = draft.reservations.find(
        (r) =>
          r.internalHoldId === input.internalHoldId ||
          r.resellerReference === input.resellerReference
      );
      if (!rec) {
        throw new Error(`Missing hold ${input.internalHoldId} during reconciliation block`);
      }

      const prev = rec.state;
      rec.state = "reconciliation_blocked";
      rec.rezdyOrderReference = input.rezdyOrderNumber;
      rec.expiresAt = null;
      rec.updatedAt = nowIso;
      rec.reconciliationNote = `Rezdy order ${input.rezdyOrderNumber} CONFIRMED upstream, but local PARR order mirror failed: ${mirrorError}`;
      rec.auditHistory.push({
        at: nowIso,
        fromState: prev,
        toState: "reconciliation_blocked",
        event: "local_finalization_failed_unit_blocked",
        actor: "native_checkout_outbox",
        detail: rec.reconciliationNote,
        rezdyOrderReference: input.rezdyOrderNumber,
      });

      draft.reconciliationBlocked = true;
      const reason = `LOCAL_FINALIZATION_FAILED (${input.rezdyOrderNumber}): ${mirrorError}`;
      if (!draft.reconciliationBlockReasons.includes(reason)) {
        draft.reconciliationBlockReasons.push(reason);
      }

      for (const obx of draft.outbox) {
        if (obx.internalHoldId === rec.internalHoldId) {
          obx.status = "retry_required";
          obx.rezdyOrderReference = input.rezdyOrderNumber;
          obx.lastError = mirrorError;
          obx.updatedAt = nowIso;
        }
      }

      draft.outbox.push({
        outboxId: `obx_${crypto.randomUUID()}`,
        createdAt: nowIso,
        updatedAt: nowIso,
        kind: "LOCAL_ORDER_MIRROR_RETRY",
        status: "retry_required",
        attempts: 1,
        internalHoldId: rec.internalHoldId,
        resellerReference: input.resellerReference,
        rezdyOrderReference: input.rezdyOrderNumber,
        lastError: mirrorError,
        metadata: {
          serviceDate: identity.canonicalServiceDate,
          canonicalShowId: identity.canonicalShowId,
          vehicleSlug: input.vehicleSlug,
          startTimeLocal: input.startTimeLocal,
          partySize: input.partySize,
        },
      });

      const alert: ParrOwnerReconciliationAlert = {
        alertId: `alt_${crypto.randomUUID()}`,
        createdAt: nowIso,
        resolvedAt: null,
        resolvedBy: null,
        resolutionNote: null,
        severity: "critical",
        code: "REZDY_SUCCESS_LOCAL_FINALIZE_FAILED",
        canonicalServiceDate: identity.canonicalServiceDate,
        canonicalShowId: identity.canonicalShowId,
        vehicleSlug: input.vehicleSlug,
        internalHoldId: rec.internalHoldId,
        rezdyOrderReference: input.rezdyOrderNumber,
        summary: `Rezdy confirmed ${input.rezdyOrderNumber}, but PARR local finalization failed (${mirrorError}). Vehicle unit ${rec.internalHoldId} is blocked from resale pending reconciliation.`,
      };
      draft.ownerAlerts.push(alert);
      draft.poolAuditLog.push({
        at: nowIso,
        action: "reconciliation_block_triggered",
        actor: "system",
        detail: alert.summary,
      });

      return {
        commit: true,
        result: {
          alert,
          poolSummary: computePoolSummary(draft, nowMs),
        },
      };
    },
    {
      store: deps?.store,
      bypassInProcessQueueForCasTest: deps?.bypassInProcessQueueForCasTest,
    }
  );

  if (deps?.onOwnerAlert) {
    await Promise.resolve(deps.onOwnerAlert(blockedResult.alert)).catch(() => undefined);
  }

  return {
    finalizedLocally: false,
    reconciliationBlocked: true,
    alert: blockedResult.alert,
    poolSummary: blockedResult.poolSummary,
  };
}

/**
 * Ambiguous upstream failure (e.g. Rezdy POST timed out AND recovery lookup timed out):
 * Blocks the unit in `reconciliation_blocked` so it can never be resold until reconciled.
 */
export async function blockAmbiguousInFlightHold(
  input: {
    dateKey: string;
    vehicleSlug: ParrAuthoritativeVehicleSlug;
    internalHoldId: string;
    resellerReference: string;
    errorDetail: string;
  },
  deps?: InventoryRuntimeDeps
): Promise<{ alert: ParrOwnerReconciliationAlert; poolSummary: ComputedPoolSummary }> {
  const nowFn = deps?.nowMs ?? Date.now;
  const identity = resolveCanonicalServiceShowIdentity({ dateKey: input.dateKey });

  const out = await runAtomicPoolMutation(
    {
      canonicalServiceDate: identity.canonicalServiceDate,
      canonicalShowId: identity.canonicalShowId,
      vehicleSlug: input.vehicleSlug,
    },
    (draft) => {
      const nowMs = nowFn();
      const nowIso = new Date(nowMs).toISOString();
      const rec = draft.reservations.find(
        (r) =>
          r.internalHoldId === input.internalHoldId ||
          r.resellerReference === input.resellerReference
      );
      if (!rec) {
        throw new Error(`Missing hold ${input.internalHoldId} during ambiguous recovery block`);
      }

      const prev = rec.state;
      rec.state = "reconciliation_blocked";
      rec.expiresAt = null;
      rec.updatedAt = nowIso;
      rec.reconciliationNote = `Upstream Rezdy outcome ambiguous (${input.errorDetail}); unit blocked pending reconciliation.`;
      rec.auditHistory.push({
        at: nowIso,
        fromState: prev,
        toState: "reconciliation_blocked",
        event: "ambiguous_rezdy_outcome_unit_blocked",
        actor: "native_checkout_outbox",
        detail: rec.reconciliationNote,
      });

      draft.reconciliationBlocked = true;
      const reason = `AMBIGUOUS_REZDY_OUTCOME (${input.resellerReference}): ${input.errorDetail}`;
      if (!draft.reconciliationBlockReasons.includes(reason)) {
        draft.reconciliationBlockReasons.push(reason);
      }

      const alert: ParrOwnerReconciliationAlert = {
        alertId: `alt_${crypto.randomUUID()}`,
        createdAt: nowIso,
        resolvedAt: null,
        resolvedBy: null,
        resolutionNote: null,
        severity: "critical",
        code: "AMBIGUOUS_REZDY_OUTCOME",
        canonicalServiceDate: identity.canonicalServiceDate,
        canonicalShowId: identity.canonicalShowId,
        vehicleSlug: input.vehicleSlug,
        internalHoldId: rec.internalHoldId,
        rezdyOrderReference: null,
        summary: `Rezdy booking outcome for ${input.resellerReference} was ambiguous (${input.errorDetail}). Unit held in reconciliation_blocked.`,
      };
      draft.ownerAlerts.push(alert);
      return { commit: true, result: { alert, poolSummary: computePoolSummary(draft, nowMs) } };
    },
    {
      store: deps?.store,
      bypassInProcessQueueForCasTest: deps?.bypassInProcessQueueForCasTest,
    }
  );

  if (deps?.onOwnerAlert) {
    await Promise.resolve(deps.onOwnerAlert(out.alert)).catch(() => undefined);
  }
  return out;
}

/**
 * Section G (Rules 8 & 9) + Section J (Tests 9 & 10):
 * Restores 1 inventory unit ONLY when Rezdy confirms `status === "CANCELLED"` and
 * refund/cancellation state is complete (not failed/incomplete).
 * Preserves full booking history (`cancelled_released` — never deletes rows!).
 */
export async function releaseInventoryAfterConfirmedCancellation(
  input: {
    dateKey: string;
    vehicleSlug: ParrAuthoritativeVehicleSlug;
    rezdyOrderNumber: string;
    actor?: string;
  },
  deps?: InventoryRuntimeDeps
): Promise<
  | {
      released: true;
      reservation: ParrInventoryReservationRecord;
      poolSummary: ComputedPoolSummary;
    }
  | {
      released: false;
      reason: string;
      poolSummary: ComputedPoolSummary;
    }
> {
  const nowFn = deps?.nowMs ?? Date.now;
  const identity = resolveCanonicalServiceShowIdentity({ dateKey: input.dateKey });
  const updateStateFn = deps?.updateOrderStateImpl ?? saveInternalOrderStateUpdate;

  // Verify upstream Rezdy booking server-to-server first
  let upstreamBooking: Record<string, unknown> | null = null;
  try {
    const json = await fetchRezdyJsonReadOnly(
      `/bookings/${encodeURIComponent(input.rezdyOrderNumber)}`,
      deps?.fetchImpl
    );
    upstreamBooking =
      json.booking && typeof json.booking === "object"
        ? (json.booking as Record<string, unknown>)
        : json;
  } catch (err) {
    const store = deps?.store ?? resolveDefaultInventoryStore();
    const { ledger } = await store.readPool(
      buildPoolKey(identity.canonicalServiceDate, input.vehicleSlug)
    );
    return {
      released: false,
      reason: `Failed verifying upstream Rezdy cancellation: ${err instanceof Error ? err.message : String(err)}`,
      poolSummary: computePoolSummary(
        ledger ??
          createEmptyPoolLedger({
            canonicalServiceDate: identity.canonicalServiceDate,
            canonicalShowId: identity.canonicalShowId,
            vehicleSlug: input.vehicleSlug,
          }),
        nowFn()
      ),
    };
  }

  const upstreamStatus = String(upstreamBooking?.status || "").trim().toUpperCase();
  const refundStatus = String(upstreamBooking?.refundStatus || "").trim().toUpperCase();
  const totalPaid = Number(upstreamBooking?.totalPaid ?? 0);
  const cancellationConfirmed =
    upstreamStatus === "CANCELLED" &&
    refundStatus !== "FAILED" &&
    refundStatus !== "PENDING_FAILURE" &&
    refundStatus !== "INCOMPLETE";

  if (!cancellationConfirmed) {
    const store = deps?.store ?? resolveDefaultInventoryStore();
    const { ledger } = await store.readPool(
      buildPoolKey(identity.canonicalServiceDate, input.vehicleSlug)
    );
    return {
      released: false,
      reason: `Upstream cancellation/refund is not confirmed (status=${upstreamStatus}, refundStatus=${refundStatus || "N/A"}, totalPaid=${totalPaid})`,
      poolSummary: computePoolSummary(
        ledger ??
          createEmptyPoolLedger({
            canonicalServiceDate: identity.canonicalServiceDate,
            canonicalShowId: identity.canonicalShowId,
            vehicleSlug: input.vehicleSlug,
          }),
        nowFn()
      ),
    };
  }

  const result = await runAtomicPoolMutation<
    | {
        released: true;
        reservation: ParrInventoryReservationRecord;
        poolSummary: ComputedPoolSummary;
      }
    | {
        released: false;
        reason: string;
        poolSummary: ComputedPoolSummary;
      }
  >(
    {
      canonicalServiceDate: identity.canonicalServiceDate,
      canonicalShowId: identity.canonicalShowId,
      vehicleSlug: input.vehicleSlug,
    },
    (draft) => {
      const nowMs = nowFn();
      const nowIso = new Date(nowMs).toISOString();
      const rec = draft.reservations.find(
        (r) => r.rezdyOrderReference === input.rezdyOrderNumber
      );
      if (!rec) {
        return {
          commit: false,
          result: {
            released: false as const,
            reason: `Order ${input.rezdyOrderNumber} not found in pool ledger`,
            poolSummary: computePoolSummary(draft, nowMs),
          },
        };
      }

      if (rec.state === "cancelled_released") {
        return {
          commit: false,
          result: {
            released: true as const,
            reservation: JSON.parse(JSON.stringify(rec)) as ParrInventoryReservationRecord,
            poolSummary: computePoolSummary(draft, nowMs),
          },
        };
      }

      const prev = rec.state;
      rec.state = "cancelled_released";
      rec.updatedAt = nowIso;
      rec.lastReconciledAt = nowIso;
      rec.auditHistory.push({
        at: nowIso,
        fromState: prev,
        toState: "cancelled_released",
        event: "confirmed_cancellation_inventory_restored",
        actor: input.actor || "rezdy_reconcile",
        detail: `Verified Rezdy CANCELLED state for ${input.rezdyOrderNumber}; 1 unit restored without deleting history.`,
        rezdyOrderReference: input.rezdyOrderNumber,
      });

      draft.poolAuditLog.push({
        at: nowIso,
        action: "cancellation_unit_restored",
        actor: input.actor || "rezdy_reconcile",
        detail: `Restored 1 ${draft.vehicleSlug} unit after verified cancellation of ${input.rezdyOrderNumber}`,
      });

      return {
        commit: true,
        result: {
          released: true as const,
          reservation: JSON.parse(JSON.stringify(rec)) as ParrInventoryReservationRecord,
          poolSummary: computePoolSummary(draft, nowMs),
        },
      };
    },
    {
      store: deps?.store,
      bypassInProcessQueueForCasTest: deps?.bypassInProcessQueueForCasTest,
    }
  );

  if (result.released) {
    await updateStateFn({
      eventType: "rezdy.booking.cancelled_confirmed",
      rezdyBookingReference: input.rezdyOrderNumber,
      bookingStatus: "canceled",
      paymentStatus: "unpaid",
      payload: { orderNumber: input.rezdyOrderNumber, restoredInventory: true },
    }).catch(() => undefined);
  }

  return result;
}

/**
 * Section I + Section J (Tests 11 & 12):
 * Reconciles a single `(dateKey, vehicleSlug)` pool against Rezdy:
 * - Detects and counts newly entered manual Rezdy `CONFIRMED` bookings (preserving existing valid orders).
 * - Detects disagreements (missing local confirmed orders in Rezdy, status conflicts, over-capacity,
 *   unexpected amount/quantity mismatches) and blocks new sales ONLY for that affected `(dateKey, vehicleSlug)` pool!
 */
export async function reconcilePoolWithRezdy(
  input: {
    dateKey: string;
    vehicleSlug: ParrAuthoritativeVehicleSlug;
    showId?: string | null;
    actor?: string;
  },
  deps?: InventoryRuntimeDeps
): Promise<{
  manualOrdersAdded: string[];
  disagreementsDetected: string[];
  reconciliationBlocked: boolean;
  poolSummary: ComputedPoolSummary;
  ledger: ParrDateVehiclePoolLedger;
}> {
  const nowFn = deps?.nowMs ?? Date.now;
  const cfg = PARR_2027_OPTION_B_PRICING_AUTHORITY[input.vehicleSlug];
  const identity = resolveCanonicalServiceShowIdentity({
    dateKey: input.dateKey,
    showId: input.showId,
  });
  const mirrorFn = deps?.finalizeOrderMirrorImpl ?? upsertRezdyNativeOrderMirror;

  await ensureOpeningInventorySeeded(
    {
      dateKey: identity.canonicalServiceDate,
      vehicleSlug: input.vehicleSlug,
      showId: identity.canonicalShowId,
    },
    deps
  );

  const upstreamOrders = await fetchUpstreamRezdyOrdersForPool(
    {
      rezdyProductCode: cfg.rezdy.previewProductCode,
      dateKey: identity.canonicalServiceDate,
    },
    { fetchImpl: deps?.fetchImpl }
  );

  const manualToMirror: UpstreamRezdyOrderSnapshot[] = [];

  const mutated = await runAtomicPoolMutation(
    {
      canonicalServiceDate: identity.canonicalServiceDate,
      canonicalShowId: identity.canonicalShowId,
      vehicleSlug: input.vehicleSlug,
    },
    (draft) => {
      const nowMs = nowFn();
      const nowIso = new Date(nowMs).toISOString();
      sweepExpiredHoldsInDraft(draft, nowMs);

      const upstreamByOrderNum = new Map<string, UpstreamRezdyOrderSnapshot>();
      for (const u of upstreamOrders) {
        upstreamByOrderNum.set(u.orderNumber, u);
      }

      const manualOrdersAdded: string[] = [];
      const disagreements: string[] = [];

      // 1. Check all existing PARR confirmed_sold / cancelled_released records against upstream Rezdy
      for (const rec of draft.reservations) {
        if (!rec.rezdyOrderReference) continue;
        const baseOrderNum = rec.rezdyOrderReference.split("#")[0];
        const upstream = upstreamByOrderNum.get(baseOrderNum);

        if (rec.state === "confirmed_sold") {
          if (!upstream) {
            disagreements.push(
              `DISAGREEMENT_MISSING_UPSTREAM: PARR confirmed order ${baseOrderNum} is absent from Rezdy.`
            );
          } else if (upstream.status !== "CONFIRMED") {
            disagreements.push(
              `DISAGREEMENT_STATUS_CONFLICT: PARR has ${baseOrderNum} as confirmed_sold, but Rezdy reports status=${upstream.status}.`
            );
          } else {
            rec.lastReconciledAt = nowIso;
          }
        } else if (rec.state === "cancelled_released") {
          if (upstream && upstream.status === "CONFIRMED") {
            disagreements.push(
              `DISAGREEMENT_CANCELLED_LOCALLY_BUT_CONFIRMED_IN_REZDY: Order ${baseOrderNum} is still CONFIRMED in Rezdy.`
            );
          }
        } else if (rec.state === "reconciliation_blocked") {
          disagreements.push(
            `UNRESOLVED_BLOCKED_UNIT: Hold ${rec.internalHoldId} (${rec.rezdyOrderReference || rec.resellerReference}) requires operator reconciliation.`
          );
        }
      }

      // 2. Detect manual / external confirmed Rezdy bookings not yet in PARR reservations
      for (const u of upstreamOrders) {
        if (u.status !== "CONFIRMED") continue;

        for (let unitIdx = 0; unitIdx < Math.max(1, u.quantity); unitIdx += 1) {
          const unitRef = u.quantity > 1 ? `${u.orderNumber}#${unitIdx + 1}` : u.orderNumber;
          const alreadyTracked = draft.reservations.some(
            (r) =>
              r.rezdyOrderReference === unitRef ||
              r.rezdyOrderReference === u.orderNumber ||
              (u.resellerReference && r.resellerReference === u.resellerReference)
          );
          if (alreadyTracked) continue;

          const rec: ParrInventoryReservationRecord = {
            canonicalServiceDate: identity.canonicalServiceDate,
            canonicalShowId: identity.canonicalShowId,
            vehicleSlug: input.vehicleSlug,
            dccProductCode: cfg.dccProductCode,
            internalHoldId: `hold_manual_${crypto.randomUUID()}`,
            internalOrderId: null,
            bookingToken: null,
            idempotencyKey: u.resellerReference || `manual-rezdy-${unitRef}`,
            resellerReference: u.resellerReference || `MANUAL-${unitRef}`,
            rezdyProductReference: cfg.rezdy.previewProductCode,
            rezdyOrderReference: unitRef,
            source: "manual_rezdy_sync",
            partySize: cfg.maxGuests,
            createdAt: nowIso,
            updatedAt: nowIso,
            expiresAt: null,
            state: "confirmed_sold",
            lastReconciledAt: nowIso,
            reconciliationNote: `Detected manual/external Rezdy booking ${u.orderNumber} during reconciliation.`,
            pricingSnapshot: {
              basePriceCents: cfg.basePriceCents,
              calculatedBookingFeeCents: cfg.calculatedBookingFeeCents,
              allInTotalCents: cfg.allInTotalCents,
              effectiveSeason: cfg.effectiveSeason,
              version: cfg.version,
            },
            auditHistory: [
              {
                at: nowIso,
                fromState: null,
                toState: "confirmed_sold",
                event: "manual_rezdy_booking_detected_and_counted",
                actor: input.actor || "rezdy_reconcile",
                detail: `Imported manual Rezdy order ${u.orderNumber} (${unitRef})`,
                rezdyOrderReference: unitRef,
              },
            ],
          };

          draft.reservations.push(rec);
          manualOrdersAdded.push(unitRef);
          if (unitIdx === 0) {
            manualToMirror.push(u);
          }
        }
      }

      // 3. Check total allocated vs capacity
      const confirmedAfter = draft.reservations.filter((r) =>
        isUnitConsumingCapacity(r, nowMs)
      ).length;
      if (confirmedAfter > draft.capacity) {
        disagreements.push(
          `DISAGREEMENT_OVER_CAPACITY: Active/confirmed units (${confirmedAfter}) exceed pool capacity (${draft.capacity}).`
        );
      }

      draft.lastReconciledAt = nowIso;

      if (disagreements.length > 0) {
        draft.reconciliationBlocked = true;
        for (const d of disagreements) {
          if (!draft.reconciliationBlockReasons.includes(d)) {
            draft.reconciliationBlockReasons.push(d);
            draft.ownerAlerts.push({
              alertId: `alt_${crypto.randomUUID()}`,
              createdAt: nowIso,
              resolvedAt: null,
              resolvedBy: null,
              resolutionNote: null,
              severity: "critical",
              code: "RECONCILIATION_DISAGREEMENT",
              canonicalServiceDate: draft.canonicalServiceDate,
              canonicalShowId: draft.canonicalShowId,
              vehicleSlug: draft.vehicleSlug,
              internalHoldId: null,
              rezdyOrderReference: null,
              summary: d,
            });
          }
        }
      }

      draft.poolAuditLog.push({
        at: nowIso,
        action: "rezdy_reconciliation_completed",
        actor: input.actor || "rezdy_reconcile",
        detail: `manualAdded=${manualOrdersAdded.length}, disagreements=${disagreements.length}, blocked=${draft.reconciliationBlocked}`,
      });

      return {
        commit: true,
        result: {
          manualOrdersAdded,
          disagreementsDetected: disagreements,
          reconciliationBlocked: draft.reconciliationBlocked,
          poolSummary: computePoolSummary(draft, nowMs),
          ledger: JSON.parse(JSON.stringify(draft)) as ParrDateVehiclePoolLedger,
        },
      };
    },
    {
      store: deps?.store,
      bypassInProcessQueueForCasTest: deps?.bypassInProcessQueueForCasTest,
    }
  );

  // Mirror newly discovered manual bookings into `InternalOrderRow` without rewriting existing orders
  for (const m of manualToMirror) {
    await mirrorFn({
      orderNumber: m.orderNumber,
      resellerReference: m.resellerReference,
      dccProductCode: cfg.dccProductCode,
      rezdyProductCode: cfg.rezdy.previewProductCode,
      serviceDate: identity.canonicalServiceDate,
      canonicalShowId: identity.canonicalShowId,
      startTimeLocal: m.startTimeLocal,
      partySize: cfg.maxGuests,
      customer: m.customer,
      pickup: m.pickupLocation ? { address: m.pickupLocation } : null,
      totalChargedUsd: m.totalAmount > 0 ? m.totalAmount : cfg.allInTotalUsd,
      basePriceUsd: cfg.basePriceUsd,
      bookingFeeUsd: cfg.bookingFeeUsd,
      rezdyBookingPayload: m.rawBooking,
      source: "manual_rezdy_sync",
    }).catch(() => undefined);
  }

  return mutated;
}

/**
 * Authenticated owner/admin resolution for a blocked pool (Section I).
 * Records the operator correction in `poolAuditLog` and reservation `auditHistory` before sales resume.
 */
export async function resolvePoolReconciliationDisagreement(
  input: {
    dateKey: string;
    vehicleSlug: ParrAuthoritativeVehicleSlug;
    actor: string;
    note: string;
    promoteBlockedHoldsToSold?: boolean;
  },
  deps?: InventoryRuntimeDeps
): Promise<{ poolSummary: ComputedPoolSummary; ledger: ParrDateVehiclePoolLedger }> {
  const actor = (input.actor || "").trim();
  const note = (input.note || "").trim();
  if (!actor || note.length < 4) {
    throw new Error("Operator actor and resolution note (min 4 chars) are required to clear reconciliation block.");
  }
  const nowFn = deps?.nowMs ?? Date.now;
  const identity = resolveCanonicalServiceShowIdentity({ dateKey: input.dateKey });

  return runAtomicPoolMutation<{
    poolSummary: ComputedPoolSummary;
    ledger: ParrDateVehiclePoolLedger;
  }>(
    {
      canonicalServiceDate: identity.canonicalServiceDate,
      canonicalShowId: identity.canonicalShowId,
      vehicleSlug: input.vehicleSlug,
    },
    (draft) => {
      const nowMs = nowFn();
      const nowIso = new Date(nowMs).toISOString();

      for (const rec of draft.reservations) {
        if (rec.state === "reconciliation_blocked") {
          const nextState: ParrInventoryUnitState =
            input.promoteBlockedHoldsToSold ?? Boolean(rec.rezdyOrderReference)
              ? "confirmed_sold"
              : "expired";
          const prev = rec.state;
          rec.state = nextState;
          rec.updatedAt = nowIso;
          rec.lastReconciledAt = nowIso;
          rec.reconciliationNote = `Resolved by ${actor}: ${note}`;
          rec.auditHistory.push({
            at: nowIso,
            fromState: prev,
            toState: nextState,
            event: "operator_reconciliation_resolved",
            actor,
            detail: note,
            rezdyOrderReference: rec.rezdyOrderReference,
          });
        }
      }

      for (const obx of draft.outbox) {
        if (obx.status === "retry_required") {
          obx.status = "resolved_by_operator";
          obx.updatedAt = nowIso;
        }
      }

      for (const alert of draft.ownerAlerts) {
        if (!alert.resolvedAt) {
          alert.resolvedAt = nowIso;
          alert.resolvedBy = actor;
          alert.resolutionNote = note;
        }
      }

      draft.reconciliationBlocked = false;
      draft.reconciliationBlockReasons = [];
      draft.lastReconciledAt = nowIso;
      draft.poolAuditLog.push({
        at: nowIso,
        action: "operator_reconciliation_cleared",
        actor,
        detail: note,
      });

      return {
        commit: true,
        result: {
          poolSummary: computePoolSummary(draft, nowMs),
          ledger: JSON.parse(JSON.stringify(draft)) as ParrDateVehiclePoolLedger,
        },
      };
    },
    {
      store: deps?.store,
      bypassInProcessQueueForCasTest: deps?.bypassInProcessQueueForCasTest,
    }
  );
}

/**
 * Admin read helper returning all known pool ledgers + computed summaries + unresolved owner alerts.
 */
export async function listAdminInventoryPools(deps?: {
  store?: ParrInventoryCasStore;
  nowMs?: number;
}): Promise<{
  pools: Array<{
    ledger: ParrDateVehiclePoolLedger;
    summary: ComputedPoolSummary;
  }>;
  unresolvedAlerts: ParrOwnerReconciliationAlert[];
}> {
  const store = deps?.store ?? resolveDefaultInventoryStore();
  const nowMs = deps?.nowMs ?? Date.now();
  const keys = await store.listKnownPoolKeys();
  const pools: Array<{ ledger: ParrDateVehiclePoolLedger; summary: ComputedPoolSummary }> = [];
  const unresolvedAlerts: ParrOwnerReconciliationAlert[] = [];

  for (const key of keys) {
    const { ledger } = await store.readPool(key);
    if (!ledger) continue;
    const summary = computePoolSummary(ledger, nowMs);
    pools.push({ ledger, summary });
    for (const alert of ledger.ownerAlerts) {
      if (!alert.resolvedAt) unresolvedAlerts.push(alert);
    }
  }

  return { pools, unresolvedAlerts };
}
