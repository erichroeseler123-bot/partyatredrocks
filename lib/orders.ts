import "server-only";

import { appendFile, mkdir, readFile } from "node:fs/promises";
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { blobReadJson, blobWriteJson } from "@/lib/blobJson";
import { appendBookingLedgerRow } from "@/lib/bookingLedger";
import {
  assignPrivateInventory,
  type FleetOwner,
  reviewReassignmentDraft,
} from "@/lib/parr/fleet";
type SqliteStatement = {
  run: (...args: unknown[]) => unknown;
  get: (...args: unknown[]) => unknown;
  all: (...args: unknown[]) => unknown[];
};

type SqliteDatabase = {
  exec: (sql: string) => void;
  prepare: (sql: string) => SqliteStatement;
  close: () => void;
};

type SqliteModule = {
  DatabaseSync: new (filename: string) => SqliteDatabase;
};

let sqliteModulePromise: Promise<SqliteModule | null> | null = null;

type JsonRecord = Record<string, unknown>;
type FollowUpStatus = "new" | "contacted" | "waiting" | "resolved" | "needs_review";
type OperatorPaymentStep = "none" | "request_sent" | "paid";

export type InternalOrderRow = {
  internalOrderId: string;
  bookingToken?: string | null;
  createdAt: string;
  lastTouchedAt?: string | null;
  rezdyBookingReference: string | null;
  productCode?: string;
  sessionKey?: string | null;
  customer?: Record<string, unknown> | null;
  booking?: Record<string, unknown> | null;
  rezdyBookingPayload?: Record<string, unknown> | null;
  payment?: Record<string, unknown> | null;
  pickup?: Record<string, unknown> | null;
  notes?: string | null;
  followUpStatus?: FollowUpStatus | null;
  operatorPaymentStep?: OperatorPaymentStep | null;
  paymentRequestSentAt?: string | null;
};

type OrderWriteInput = {
  rezdyBookingReference: string | null;
  rezdyBookingPayload: JsonRecord;
  productCode: string;
  sessionKey: string | null;
  customer: JsonRecord | null;
  booking?: JsonRecord | null;
  payment: JsonRecord;
  pickup: JsonRecord | null;
  bookingToken?: string | null;
};

type OrderStateUpdateInput = {
  eventType: string;
  rezdyBookingReference: string | null;
  bookingStatus: string | null;
  paymentStatus: string | null;
  payload: unknown;
};

function asFollowUpStatus(value: unknown): FollowUpStatus | null {
  return value === "new" ||
    value === "contacted" ||
    value === "waiting" ||
    value === "resolved" ||
    value === "needs_review"
    ? value
    : null;
}

function stringValue(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function patchInventoryOwner(record: JsonRecord | null | undefined, owner: FleetOwner | null) {
  if (!owner) return record ?? null;
  return {
    ...(record ?? {}),
    inventoryOwner: owner,
  } satisfies JsonRecord;
}

function asOperatorPaymentStep(value: unknown): OperatorPaymentStep | null {
  return value === "none" || value === "request_sent" || value === "paid" ? value : null;
}

function ndjsonBackupEnabled() {
  return process.env.ORDER_NDJSON_BACKUP !== "0";
}

function orderLogPath() {
  if (process.env.ORDER_LOG_PATH) return process.env.ORDER_LOG_PATH;
  return path.join(process.cwd(), "data", "orders", "orders.ndjson");
}

function orderDbPath() {
  if (process.env.ORDER_DB_PATH) return process.env.ORDER_DB_PATH;
  return path.join(process.cwd(), "data", "orders", "orders.sqlite");
}


const ORDER_BLOB_PATH = "cache/orders/store.json";

type BlobOrderStore = {
  updatedAt: string;
  orders: InternalOrderRow[];
  events: Array<Record<string, unknown>>;
};

function useBlobOrderStore() {
  return process.env.VERCEL === "1" && !!process.env.BLOB_READ_WRITE_TOKEN;
}

function emptyBlobOrderStore(): BlobOrderStore {
  return { updatedAt: new Date(0).toISOString(), orders: [], events: [] };
}

function normalizeBlobOrderStore(value: unknown): BlobOrderStore {
  if (!value || typeof value !== "object") return emptyBlobOrderStore();
  const row = value as Record<string, unknown>;
  const orders = Array.isArray(row.orders)
    ? row.orders.map((item) => normalizeBackupOrder(item as Record<string, unknown>)).filter((item): item is InternalOrderRow => item !== null)
    : [];
  const events = Array.isArray(row.events)
    ? row.events.filter((item): item is Record<string, unknown> => !!item && typeof item === "object")
    : [];
  const updatedAt = typeof row.updatedAt === "string" ? row.updatedAt : new Date(0).toISOString();
  return { updatedAt, orders, events };
}

async function loadBlobOrderStore(): Promise<BlobOrderStore> {
  const value = await blobReadJson<BlobOrderStore>(ORDER_BLOB_PATH, { revalidateSeconds: 0 }).catch(() => null);
  return normalizeBlobOrderStore(value);
}

async function saveBlobOrderStore(state: BlobOrderStore) {
  state.updatedAt = new Date().toISOString();
  await blobWriteJson(ORDER_BLOB_PATH, state, { cacheControlMaxAge: 60 });
}

function sortOrdersDesc(rows: InternalOrderRow[]) {
  return [...rows].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}


async function loadSqliteModule(): Promise<SqliteModule | null> {
  if (sqliteModulePromise) return sqliteModulePromise;

  const importModule = Function("specifier", "return import(specifier)") as (
    specifier: string
  ) => Promise<unknown>;

  sqliteModulePromise = importModule("node:sqlite")
    .then((mod) => {
      if (!mod || typeof mod !== "object" || !("DatabaseSync" in mod)) return null;
      return mod as SqliteModule;
    })
    .catch(() => null);

  return sqliteModulePromise;
}

async function openDb(): Promise<SqliteDatabase | null> {
  const sqlite = await loadSqliteModule();
  if (!sqlite?.DatabaseSync) return null;

  try {
    const dbFile = orderDbPath();
    const dir = path.dirname(dbFile);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    const db = new sqlite.DatabaseSync(dbFile);
    db.exec(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS orders (
        internalOrderId TEXT PRIMARY KEY,
        bookingToken TEXT,
        createdAt TEXT NOT NULL,
        lastTouchedAt TEXT,
        rezdyBookingReference TEXT,
        productCode TEXT NOT NULL,
        sessionKey TEXT,
        customerName TEXT,
        customerEmail TEXT,
        customerJson TEXT,
        bookingStatus TEXT,
        paymentStatus TEXT,
        totalDue REAL,
        totalPaid REAL,
        handoffMode TEXT,
        handoffUrl TEXT,
        operatorAction TEXT,
        notes TEXT,
        followUpStatus TEXT,
        operatorPaymentStep TEXT,
        paymentRequestSentAt TEXT,
        bookingJson TEXT,
        paymentJson TEXT,
        pickupJson TEXT,
        rezdyBookingPayloadJson TEXT
      );
      CREATE INDEX IF NOT EXISTS idx_orders_createdAt ON orders(createdAt DESC);
      CREATE INDEX IF NOT EXISTS idx_orders_bookingRef ON orders(rezdyBookingReference);
      CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_bookingToken ON orders(bookingToken);

      CREATE TABLE IF NOT EXISTS order_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        createdAt TEXT NOT NULL,
        eventType TEXT NOT NULL,
        rezdyBookingReference TEXT,
        bookingStatus TEXT,
        paymentStatus TEXT,
        payloadJson TEXT
      );
      CREATE INDEX IF NOT EXISTS idx_order_events_createdAt ON order_events(createdAt DESC);
      CREATE INDEX IF NOT EXISTS idx_order_events_bookingRef ON order_events(rezdyBookingReference);
    `);
    const orderColumns = db
      .prepare(`PRAGMA table_info(orders)`)
      .all() as Array<{ name?: string }>;
    const hasNotes = orderColumns.some((c) => c.name === "notes");
    const hasFollowUpStatus = orderColumns.some((c) => c.name === "followUpStatus");
    const hasOperatorPaymentStep = orderColumns.some((c) => c.name === "operatorPaymentStep");
    const hasPaymentRequestSentAt = orderColumns.some((c) => c.name === "paymentRequestSentAt");
    const hasLastTouchedAt = orderColumns.some((c) => c.name === "lastTouchedAt");
    const hasBookingToken = orderColumns.some((c) => c.name === "bookingToken");
    if (!hasNotes) db.exec(`ALTER TABLE orders ADD COLUMN notes TEXT`);
    if (!hasFollowUpStatus) db.exec(`ALTER TABLE orders ADD COLUMN followUpStatus TEXT`);
    if (!hasOperatorPaymentStep) db.exec(`ALTER TABLE orders ADD COLUMN operatorPaymentStep TEXT`);
    if (!hasPaymentRequestSentAt) db.exec(`ALTER TABLE orders ADD COLUMN paymentRequestSentAt TEXT`);
    if (!hasLastTouchedAt) db.exec(`ALTER TABLE orders ADD COLUMN lastTouchedAt TEXT`);
    if (!hasBookingToken) db.exec(`ALTER TABLE orders ADD COLUMN bookingToken TEXT`);
    db.exec(`CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_bookingToken ON orders(bookingToken)`);
    return db;
  } catch {
    return null;
  }
}


function readRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

function asJson(value: unknown): string {
  return JSON.stringify(value ?? null);
}

function parseJson(value: unknown): Record<string, unknown> | null {
  if (typeof value !== "string" || !value) return null;
  try {
    const parsed = JSON.parse(value) as unknown;
    return readRecord(parsed);
  } catch {
    return null;
  }
}

function toNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function normalizePaymentStatus(value: string | null): string | null {
  if (!value) return null;
  const lower = value.trim().toLowerCase();
  if (!lower) return null;
  if (lower === "paid") return "paid";
  if (lower === "unpaid") return "unpaid";
  if (lower === "partial") return "partial";
  if (lower.includes("unpaid") || lower.includes("not_paid") || lower.includes("payment_due")) return "unpaid";
  if (lower.includes("partial")) return "partial";
  if (lower.includes("paid")) return "paid";
  return lower;
}

function pickCustomerName(customer: JsonRecord | null): string | null {
  if (!customer) return null;
  const first = typeof customer.firstName === "string" ? customer.firstName : "";
  const last = typeof customer.lastName === "string" ? customer.lastName : "";
  const name = `${first} ${last}`.trim();
  return name || null;
}

function pickCustomerEmail(customer: JsonRecord | null): string | null {
  if (!customer) return null;
  const email = typeof customer.email === "string" ? customer.email.trim() : "";
  return email || null;
}

async function appendJsonLine(filePath: string, row: JsonRecord) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await appendFile(filePath, `${JSON.stringify(row)}\n`, "utf8");
}

async function appendBackupRow(row: JsonRecord) {
  if (!ndjsonBackupEnabled()) return;
  await appendJsonLine(orderLogPath(), row);
}

function latestRowForBookingReference(
  orders: Map<string, InternalOrderRow>,
  rezdyBookingReference: string
): InternalOrderRow | null {
  let match: InternalOrderRow | null = null;
  for (const order of Array.from(orders.values())) {
    if (order.rezdyBookingReference !== rezdyBookingReference) continue;
    if (!match || order.createdAt > match.createdAt) match = order;
  }
  return match;
}

function normalizeBackupOrder(row: Record<string, unknown>): InternalOrderRow | null {
  if (typeof row.internalOrderId !== "string" || typeof row.createdAt !== "string") return null;
  return {
    internalOrderId: String(row.internalOrderId),
    bookingToken: typeof row.bookingToken === "string" ? row.bookingToken : null,
    createdAt: String(row.createdAt),
    lastTouchedAt: typeof row.lastTouchedAt === "string" ? row.lastTouchedAt : null,
    rezdyBookingReference:
      typeof row.rezdyBookingReference === "string" ? row.rezdyBookingReference : null,
    productCode: typeof row.productCode === "string" ? row.productCode : undefined,
    sessionKey: typeof row.sessionKey === "string" ? row.sessionKey : null,
    customer: readRecord(row.customer) ?? null,
    booking: readRecord(row.booking) ?? null,
    rezdyBookingPayload: readRecord(row.rezdyBookingPayload) ?? null,
    payment: readRecord(row.payment) ?? null,
    pickup: readRecord(row.pickup) ?? null,
    notes: typeof row.notes === "string" ? row.notes : null,
    followUpStatus: asFollowUpStatus(row.followUpStatus),
    operatorPaymentStep: asOperatorPaymentStep(row.operatorPaymentStep),
    paymentRequestSentAt:
      typeof row.paymentRequestSentAt === "string" ? row.paymentRequestSentAt : null,
  };
}

function applyBackupStateUpdate(order: InternalOrderRow, row: Record<string, unknown>) {
  const next: InternalOrderRow = { ...order };
  const updatedAt = typeof row.updatedAt === "string" ? row.updatedAt : order.lastTouchedAt ?? order.createdAt;
  const bookingStatus = typeof row.bookingStatus === "string" ? row.bookingStatus : null;
  const paymentStatus = normalizePaymentStatus(typeof row.paymentStatus === "string" ? row.paymentStatus : null);

  next.lastTouchedAt = updatedAt;

  if (bookingStatus) {
    next.booking = { ...(next.booking ?? {}), status: bookingStatus };
  }

  if (paymentStatus) {
    next.payment = { ...(next.payment ?? {}), status: paymentStatus };
    if (paymentStatus === "paid") {
      next.operatorPaymentStep = "paid";
      if (next.followUpStatus === "waiting") next.followUpStatus = "resolved";
    }
  }

  return next;
}

function applyBackupOpsUpdate(order: InternalOrderRow, row: Record<string, unknown>) {
  const next: InternalOrderRow = { ...order };
  next.lastTouchedAt = typeof row.updatedAt === "string" ? row.updatedAt : order.lastTouchedAt ?? order.createdAt;
  if (typeof row.notes === "string") next.notes = row.notes;
  const followUpStatus = asFollowUpStatus(row.followUpStatus);
  if (followUpStatus) next.followUpStatus = followUpStatus;
  const operatorPaymentStep = asOperatorPaymentStep(row.operatorPaymentStep);
  if (operatorPaymentStep) next.operatorPaymentStep = operatorPaymentStep;
  if (typeof row.paymentRequestSentAt === "string") next.paymentRequestSentAt = row.paymentRequestSentAt;
  return next;
}

async function loadOrdersFromBackup(): Promise<InternalOrderRow[]> {
  const raw = await readFile(orderLogPath(), "utf8").catch(() => "");
  if (!raw.trim()) return [];

  const orders = new Map<string, InternalOrderRow>();

  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    let row;
    try {
      row = JSON.parse(trimmed);
    } catch {
      continue;
    }

    if (!row || typeof row !== "object") continue;
    const record = row;

    if (typeof record.internalOrderId === "string" && typeof record.createdAt === "string") {
      const normalized = normalizeBackupOrder(record);
      if (normalized) orders.set(normalized.internalOrderId, normalized);
      continue;
    }

    if (record.type === "internal.order.update" && typeof record.rezdyBookingReference === "string") {
      const existing = latestRowForBookingReference(orders, record.rezdyBookingReference);
      if (existing) orders.set(existing.internalOrderId, applyBackupStateUpdate(existing, record));
      continue;
    }

    if (record.type === "internal.order.ops" && typeof record.internalOrderId === "string") {
      const existing = orders.get(record.internalOrderId);
      if (existing) orders.set(existing.internalOrderId, applyBackupOpsUpdate(existing, record));
    }
  }

  return Array.from(orders.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}


export async function saveInternalOrder(input: OrderWriteInput) {
  const internalOrderId = `ord_${randomUUID()}`;
  const bookingToken = input.bookingToken?.trim() || randomUUID();
  const createdAt = new Date().toISOString();

  const bookingStatus =
    input.booking && typeof input.booking.status === "string" ? input.booking.status : null;
  const paymentStatusRaw =
    input.payment && typeof input.payment.status === "string" ? input.payment.status : null;
  const paymentStatus = normalizePaymentStatus(paymentStatusRaw);
  const totalDue = toNumber(input.payment?.totalDue);
  const totalPaid = toNumber(input.payment?.totalPaid);
  const handoffMode =
    typeof input.payment?.handoffMode === "string" ? String(input.payment.handoffMode) : null;
  const handoffUrl =
    typeof input.payment?.handoffUrl === "string" ? String(input.payment.handoffUrl) : null;
  const operatorAction =
    typeof input.payment?.operatorAction === "string" ? String(input.payment.operatorAction) : null;

  const customerName = pickCustomerName(input.customer);
  const customerEmail = pickCustomerEmail(input.customer);

  if (useBlobOrderStore()) {
    const store = await loadBlobOrderStore();
    store.orders = sortOrdersDesc([
      {
        internalOrderId,
        bookingToken,
        createdAt,
        lastTouchedAt: createdAt,
        rezdyBookingReference: input.rezdyBookingReference,
        productCode: input.productCode,
        sessionKey: input.sessionKey,
        customer: input.customer,
        booking: input.booking ?? null,
        rezdyBookingPayload: input.rezdyBookingPayload,
        payment: input.payment,
        pickup: input.pickup,
        notes: null,
        followUpStatus: "new",
        operatorPaymentStep: "none",
        paymentRequestSentAt: null,
      },
      ...store.orders.filter((order) => order.internalOrderId !== internalOrderId),
    ]);
    store.events.push({
      createdAt,
      eventType: "internal.order.created",
      rezdyBookingReference: input.rezdyBookingReference,
      bookingStatus,
      paymentStatus,
      payload: {
        internalOrderId,
        bookingToken,
        productCode: input.productCode,
        sessionKey: input.sessionKey,
        customerName,
        customerEmail,
        totalDue,
        totalPaid,
        handoffMode,
        handoffUrl,
        operatorAction,
      },
    });
    await saveBlobOrderStore(store);
    await appendBookingLedgerRow(store.orders[0], { eventType: "booking_created" }).catch(() => undefined);
    return { internalOrderId, bookingToken, createdAt };
  }

  const db = await openDb();
  if (db) {
    try {
      db.prepare(
        `INSERT INTO orders (
          internalOrderId, bookingToken, createdAt, lastTouchedAt, rezdyBookingReference, productCode, sessionKey,
          customerName, customerEmail, customerJson, bookingStatus, paymentStatus,
          totalDue, totalPaid, handoffMode, handoffUrl, operatorAction, notes, followUpStatus,
          operatorPaymentStep, paymentRequestSentAt,
          bookingJson, paymentJson, pickupJson, rezdyBookingPayloadJson
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).run(
        internalOrderId,
        bookingToken,
        createdAt,
        createdAt,
        input.rezdyBookingReference,
        input.productCode,
        input.sessionKey,
        customerName,
        customerEmail,
        asJson(input.customer),
        bookingStatus,
        paymentStatus,
        totalDue,
        totalPaid,
        handoffMode,
        handoffUrl,
        operatorAction,
        null,
        "new",
        "none",
        null,
        asJson(input.booking ?? null),
        asJson(input.payment),
        asJson(input.pickup),
        asJson(input.rezdyBookingPayload)
      );
    } finally {
      db.close();
    }
  }

  const createdOrder = {
    internalOrderId,
    bookingToken,
    createdAt,
    lastTouchedAt: createdAt,
    rezdyBookingReference: input.rezdyBookingReference,
    productCode: input.productCode,
    sessionKey: input.sessionKey,
    customer: input.customer,
    booking: input.booking ?? null,
    rezdyBookingPayload: input.rezdyBookingPayload,
    payment: input.payment,
    pickup: input.pickup,
    notes: null,
    followUpStatus: "new" as const,
    operatorPaymentStep: "none" as const,
    paymentRequestSentAt: null,
  };

  await appendBackupRow({
    ...createdOrder,
    pickup: input.pickup,
  });
  await appendBookingLedgerRow(createdOrder, { eventType: "booking_created" }).catch(() => undefined);

  return { internalOrderId, bookingToken, createdAt };
}


export async function saveRezdyWebhookEvent(eventType: string, payload: unknown) {
  const createdAt = new Date().toISOString();
  if (useBlobOrderStore()) {
    const store = await loadBlobOrderStore();
    store.events.push({ createdAt, eventType, rezdyBookingReference: null, bookingStatus: null, paymentStatus: null, payload });
    await saveBlobOrderStore(store);
    return;
  }
  const db = await openDb();
  if (db) {
    try {
      db.prepare(
        `INSERT INTO order_events (
          createdAt, eventType, rezdyBookingReference, bookingStatus, paymentStatus, payloadJson
        ) VALUES (?, ?, ?, ?, ?, ?)`
      ).run(createdAt, eventType, null, null, null, asJson(payload));
    } finally {
      db.close();
    }
  }

  await appendBackupRow({
    type: "rezdy.webhook",
    eventType,
    receivedAt: createdAt,
    payload,
  });
}

export async function appendInternalOrderEvent(input: {
  internalOrderId: string;
  eventType: string;
  bookingStatus?: string | null;
  paymentStatus?: string | null;
  payload?: unknown;
}) {
  const eventAt = new Date().toISOString();
  const order = await getInternalOrderById(input.internalOrderId);
  const paymentStatus = normalizePaymentStatus(input.paymentStatus ?? null);

  if (useBlobOrderStore()) {
    const store = await loadBlobOrderStore();
    store.events.push({
      createdAt: eventAt,
      eventType: input.eventType,
      internalOrderId: input.internalOrderId,
      rezdyBookingReference: order?.rezdyBookingReference ?? null,
      bookingStatus: input.bookingStatus ?? null,
      paymentStatus,
      payload: input.payload ?? null,
    });
    await saveBlobOrderStore(store);
    return;
  }

  const db = await openDb();
  if (db) {
    try {
      db.prepare(
        `INSERT INTO order_events (
          createdAt, eventType, rezdyBookingReference, bookingStatus, paymentStatus, payloadJson
        ) VALUES (?, ?, ?, ?, ?, ?)`
      ).run(
        eventAt,
        input.eventType,
        order?.rezdyBookingReference ?? null,
        input.bookingStatus ?? null,
        paymentStatus,
        asJson({
          internalOrderId: input.internalOrderId,
          ...(input.payload && typeof input.payload === "object" ? input.payload as Record<string, unknown> : { payload: input.payload ?? null }),
        })
      );
    } finally {
      db.close();
    }
  }

  await appendBackupRow({
    type: "internal.order.event",
    eventType: input.eventType,
    eventAt,
    internalOrderId: input.internalOrderId,
    rezdyBookingReference: order?.rezdyBookingReference ?? null,
    bookingStatus: input.bookingStatus ?? null,
    paymentStatus,
    payload: input.payload ?? null,
  });
}


export async function saveInternalOrderStateUpdate(input: OrderStateUpdateInput) {
  const updatedAt = new Date().toISOString();
  const paymentStatus = normalizePaymentStatus(input.paymentStatus);
  if (useBlobOrderStore()) {
    const store = await loadBlobOrderStore();
    const existing = input.rezdyBookingReference
      ? latestRowForBookingReference(new Map(store.orders.map((order) => [order.internalOrderId, order])), input.rezdyBookingReference)
      : null;
    if (existing) {
      const nextOrders = store.orders.map((order) => {
        if (order.internalOrderId !== existing.internalOrderId) return order;
        const next = { ...order };
        next.lastTouchedAt = updatedAt;
        if (input.bookingStatus) next.booking = { ...(next.booking ?? {}), status: input.bookingStatus };
        if (paymentStatus) {
          next.payment = { ...(next.payment ?? {}), status: paymentStatus };
          if (paymentStatus === "paid") {
            next.operatorPaymentStep = "paid";
            if (next.followUpStatus === "waiting") next.followUpStatus = "resolved";
          }
        }
        return next;
      });
      store.orders = sortOrdersDesc(nextOrders);
    }
    store.events.push({
      createdAt: updatedAt,
      eventType: input.eventType,
      rezdyBookingReference: input.rezdyBookingReference,
      bookingStatus: input.bookingStatus,
      paymentStatus,
      payload: input.payload,
    });
    await saveBlobOrderStore(store);
    return;
  }
  const db = await openDb();
  if (db) {
    try {
      db.prepare(
        `INSERT INTO order_events (
          createdAt, eventType, rezdyBookingReference, bookingStatus, paymentStatus, payloadJson
        ) VALUES (?, ?, ?, ?, ?, ?)`
      ).run(
        updatedAt,
        input.eventType,
        input.rezdyBookingReference,
        input.bookingStatus,
        paymentStatus,
        asJson(input.payload)
      );

      if (input.rezdyBookingReference) {
        const existing = db
          .prepare(
            `SELECT internalOrderId, paymentJson
             FROM orders
             WHERE rezdyBookingReference = ?
             ORDER BY createdAt DESC
             LIMIT 1`
          )
          .get(input.rezdyBookingReference) as
          | { internalOrderId: string; paymentJson: string | null }
          | undefined;

        if (existing?.internalOrderId) {
          const payment = parseJson(existing.paymentJson) ?? {};
          if (paymentStatus) payment.status = paymentStatus;
          const followUpState = db
            .prepare(`SELECT followUpStatus FROM orders WHERE internalOrderId = ? LIMIT 1`)
            .get(existing.internalOrderId) as { followUpStatus?: string | null } | undefined;
          const nextFollowUpStatus =
            paymentStatus === "paid" && followUpState?.followUpStatus === "waiting"
              ? "resolved"
              : null;
          db.prepare(
            `UPDATE orders
             SET bookingStatus = COALESCE(?, bookingStatus),
                 paymentStatus = COALESCE(?, paymentStatus),
                 operatorPaymentStep = CASE WHEN COALESCE(?, '') = 'paid' THEN 'paid' ELSE operatorPaymentStep END,
                 followUpStatus = COALESCE(?, followUpStatus),
                 lastTouchedAt = ?,
                 paymentJson = ?
             WHERE internalOrderId = ?`
          ).run(
            input.bookingStatus,
            paymentStatus,
            paymentStatus,
            nextFollowUpStatus,
            updatedAt,
            asJson(payment),
            existing.internalOrderId
          );
        }
      }
    } finally {
      db.close();
    }
  }

  await appendBackupRow({
    type: "internal.order.update",
    source: "rezdy.webhook",
    eventType: input.eventType,
    updatedAt,
    rezdyBookingReference: input.rezdyBookingReference,
    bookingStatus: input.bookingStatus,
    paymentStatus,
    payload: input.payload,
  });
}


export async function listInternalOrders(): Promise<InternalOrderRow[]> {
  if (useBlobOrderStore()) {
    const store = await loadBlobOrderStore();
    return sortOrdersDesc(store.orders);
  }
  const db = await openDb();
  if (db) {
    try {
      const rows = db
        .prepare(
          `SELECT
            internalOrderId,
            bookingToken,
            createdAt,
            lastTouchedAt,
            rezdyBookingReference,
            productCode,
            sessionKey,
            bookingJson,
            rezdyBookingPayloadJson,
            paymentJson,
            customerJson,
            bookingStatus,
            paymentStatus,
            totalDue,
            totalPaid,
            handoffMode,
            handoffUrl,
            operatorAction
            ,notes
            ,followUpStatus
            ,operatorPaymentStep
            ,paymentRequestSentAt
          FROM orders
          ORDER BY createdAt DESC`
        )
        .all() as Array<Record<string, unknown>>;

      const mapped = rows.map((row) => {
        const booking = parseJson(row.bookingJson);
          const payment = parseJson(row.paymentJson);
          const customer = parseJson(row.customerJson);
          const pickup = parseJson(row.pickupJson);

        if (booking && typeof row.bookingStatus === "string") booking.status = row.bookingStatus;
        if (payment) {
          if (typeof row.paymentStatus === "string") payment.status = row.paymentStatus;
          if (typeof row.totalDue === "number") payment.totalDue = row.totalDue;
          if (typeof row.totalPaid === "number") payment.totalPaid = row.totalPaid;
          if (typeof row.handoffMode === "string") payment.handoffMode = row.handoffMode;
          if (typeof row.handoffUrl === "string") payment.handoffUrl = row.handoffUrl;
          if (typeof row.operatorAction === "string") payment.operatorAction = row.operatorAction;
        }

        return {
          internalOrderId: String(row.internalOrderId),
          bookingToken: typeof row.bookingToken === "string" ? row.bookingToken : null,
          createdAt: String(row.createdAt),
          lastTouchedAt: typeof row.lastTouchedAt === "string" ? row.lastTouchedAt : null,
          rezdyBookingReference:
            typeof row.rezdyBookingReference === "string" ? row.rezdyBookingReference : null,
          productCode: typeof row.productCode === "string" ? row.productCode : undefined,
          sessionKey: typeof row.sessionKey === "string" ? row.sessionKey : null,
          customer: customer ?? null,
          booking: booking ?? null,
          rezdyBookingPayload: parseJson(row.rezdyBookingPayloadJson) ?? null,
          payment: payment ?? null,
          pickup: pickup ?? null,
          notes: typeof row.notes === "string" ? row.notes : null,
          followUpStatus: asFollowUpStatus(row.followUpStatus),
          operatorPaymentStep: asOperatorPaymentStep(row.operatorPaymentStep),
          paymentRequestSentAt:
            typeof row.paymentRequestSentAt === "string" ? row.paymentRequestSentAt : null,
        };
      });
      if (mapped.length > 0) return mapped;
    } finally {
      db.close();
    }
  }

  return loadOrdersFromBackup();
}


export async function getInternalOrderByBookingReference(
  rezdyBookingReference: string
): Promise<InternalOrderRow | null> {
  const bookingRef = rezdyBookingReference.trim();
  if (!bookingRef) return null;

  if (useBlobOrderStore()) {
    const store = await loadBlobOrderStore();
    return store.orders.find((order) => order.rezdyBookingReference === bookingRef) ?? null;
  }

  const db = await openDb();
  if (db) {
    try {
      const row = db
        .prepare(
          `SELECT
            internalOrderId,
            bookingToken,
            createdAt,
            lastTouchedAt,
            rezdyBookingReference,
            productCode,
            sessionKey,
            bookingJson,
            rezdyBookingPayloadJson,
            paymentJson,
            pickupJson,
            customerJson,
            notes,
            followUpStatus,
            operatorPaymentStep,
            paymentRequestSentAt
          FROM orders
          WHERE rezdyBookingReference = ?
          ORDER BY createdAt DESC
          LIMIT 1`
        )
        .get(bookingRef) as Record<string, unknown> | undefined;

      if (!row) return null;

      return {
        internalOrderId: String(row.internalOrderId),
        bookingToken: typeof row.bookingToken === "string" ? row.bookingToken : null,
        createdAt: String(row.createdAt),
        lastTouchedAt: typeof row.lastTouchedAt === "string" ? row.lastTouchedAt : null,
        rezdyBookingReference:
          typeof row.rezdyBookingReference === "string" ? row.rezdyBookingReference : null,
        productCode: typeof row.productCode === "string" ? row.productCode : undefined,
        sessionKey: typeof row.sessionKey === "string" ? row.sessionKey : null,
        customer: parseJson(row.customerJson) ?? null,
        booking: parseJson(row.bookingJson) ?? null,
        rezdyBookingPayload: parseJson(row.rezdyBookingPayloadJson) ?? null,
        payment: parseJson(row.paymentJson) ?? null,
        pickup: parseJson(row.pickupJson) ?? null,
        notes: typeof row.notes === "string" ? row.notes : null,
        followUpStatus: asFollowUpStatus(row.followUpStatus),
        operatorPaymentStep: asOperatorPaymentStep(row.operatorPaymentStep),
        paymentRequestSentAt:
          typeof row.paymentRequestSentAt === "string" ? row.paymentRequestSentAt : null,
      };
    } finally {
      db.close();
    }
  }

  const orders = await loadOrdersFromBackup();
  return orders.find((order) => order.rezdyBookingReference === bookingRef) ?? null;
}


export async function getInternalOrderById(
  internalOrderId: string
): Promise<InternalOrderRow | null> {
  const id = internalOrderId.trim();
  if (!id) return null;

  if (useBlobOrderStore()) {
    const store = await loadBlobOrderStore();
    return store.orders.find((order) => order.internalOrderId === id) ?? null;
  }

  const db = await openDb();
  if (db) {
    try {
      const row = db
        .prepare(
          `SELECT
            internalOrderId,
            bookingToken,
            createdAt,
            lastTouchedAt,
            rezdyBookingReference,
            productCode,
            sessionKey,
            bookingJson,
            rezdyBookingPayloadJson,
            paymentJson,
            pickupJson,
            customerJson,
            notes,
            followUpStatus,
            operatorPaymentStep,
            paymentRequestSentAt
          FROM orders
          WHERE internalOrderId = ?
          LIMIT 1`
        )
        .get(id) as Record<string, unknown> | undefined;

      if (!row) return null;

      return {
        internalOrderId: String(row.internalOrderId),
        bookingToken: typeof row.bookingToken === "string" ? row.bookingToken : null,
        createdAt: String(row.createdAt),
        lastTouchedAt: typeof row.lastTouchedAt === "string" ? row.lastTouchedAt : null,
        rezdyBookingReference:
          typeof row.rezdyBookingReference === "string" ? row.rezdyBookingReference : null,
        productCode: typeof row.productCode === "string" ? row.productCode : undefined,
        sessionKey: typeof row.sessionKey === "string" ? row.sessionKey : null,
        customer: parseJson(row.customerJson) ?? null,
        booking: parseJson(row.bookingJson) ?? null,
        rezdyBookingPayload: parseJson(row.rezdyBookingPayloadJson) ?? null,
        payment: parseJson(row.paymentJson) ?? null,
        pickup: parseJson(row.pickupJson) ?? null,
        notes: typeof row.notes === "string" ? row.notes : null,
        followUpStatus: asFollowUpStatus(row.followUpStatus),
        operatorPaymentStep: asOperatorPaymentStep(row.operatorPaymentStep),
        paymentRequestSentAt:
          typeof row.paymentRequestSentAt === "string" ? row.paymentRequestSentAt : null,
      };
    } finally {
      db.close();
    }
  }

  const orders = await loadOrdersFromBackup();
  return orders.find((order) => order.internalOrderId === id) ?? null;
}

export async function getInternalOrderByBookingToken(
  bookingToken: string
): Promise<InternalOrderRow | null> {
  const token = bookingToken.trim();
  if (!token) return null;

  if (useBlobOrderStore()) {
    const store = await loadBlobOrderStore();
    return store.orders.find((order) => order.bookingToken === token) ?? null;
  }

  const db = await openDb();
  if (db) {
    try {
      const row = db
        .prepare(
          `SELECT
            internalOrderId,
            bookingToken,
            createdAt,
            lastTouchedAt,
            rezdyBookingReference,
            productCode,
            sessionKey,
            bookingJson,
            rezdyBookingPayloadJson,
            paymentJson,
            pickupJson,
            customerJson,
            notes,
            followUpStatus,
            operatorPaymentStep,
            paymentRequestSentAt
          FROM orders
          WHERE bookingToken = ?
          LIMIT 1`
        )
        .get(token) as Record<string, unknown> | undefined;

      if (!row) return null;

      return {
        internalOrderId: String(row.internalOrderId),
        bookingToken: typeof row.bookingToken === "string" ? row.bookingToken : null,
        createdAt: String(row.createdAt),
        lastTouchedAt: typeof row.lastTouchedAt === "string" ? row.lastTouchedAt : null,
        rezdyBookingReference:
          typeof row.rezdyBookingReference === "string" ? row.rezdyBookingReference : null,
        productCode: typeof row.productCode === "string" ? row.productCode : undefined,
        sessionKey: typeof row.sessionKey === "string" ? row.sessionKey : null,
        customer: parseJson(row.customerJson) ?? null,
        booking: parseJson(row.bookingJson) ?? null,
        rezdyBookingPayload: parseJson(row.rezdyBookingPayloadJson) ?? null,
        payment: parseJson(row.paymentJson) ?? null,
        pickup: parseJson(row.pickupJson) ?? null,
        notes: typeof row.notes === "string" ? row.notes : null,
        followUpStatus: asFollowUpStatus(row.followUpStatus),
        operatorPaymentStep: asOperatorPaymentStep(row.operatorPaymentStep),
        paymentRequestSentAt:
          typeof row.paymentRequestSentAt === "string" ? row.paymentRequestSentAt : null,
      };
    } finally {
      db.close();
    }
  }

  const orders = await loadOrdersFromBackup();
  return orders.find((order) => order.bookingToken === token) ?? null;
}

function normalizeLookupId(value: string | null | undefined) {
  return String(value || "").trim().toLowerCase();
}

function compactLookupId(value: string | null | undefined) {
  return normalizeLookupId(value).replace(/[^a-z0-9]/g, "");
}

function lookupCandidates(order: InternalOrderRow) {
  return [
    order.internalOrderId,
    order.bookingToken,
    order.rezdyBookingReference,
    order.sessionKey,
    typeof order.booking?.orderNumber === "string" ? order.booking.orderNumber : null,
    typeof order.booking?.squareOrderId === "string" ? order.booking.squareOrderId : null,
    typeof order.payment?.squareOrderId === "string" ? order.payment.squareOrderId : null,
    typeof order.payment?.squarePaymentId === "string" ? order.payment.squarePaymentId : null,
    typeof order.payment?.paymentLinkId === "string" ? order.payment.paymentLinkId : null,
  ].filter((value): value is string => Boolean(value && value.trim()));
}

export async function getInternalOrderByAnyReference(
  reference: string
): Promise<InternalOrderRow | null> {
  const raw = reference.trim();
  if (!raw) return null;

  const direct =
    await getInternalOrderById(raw) ||
    await getInternalOrderByBookingToken(raw) ||
    await getInternalOrderByBookingReference(raw);
  if (direct) return direct;

  const normalized = normalizeLookupId(raw);
  const compact = compactLookupId(raw);
  const orders = await listInternalOrders();

  return orders.find((order) =>
    lookupCandidates(order).some((candidate) =>
      normalizeLookupId(candidate) === normalized || compactLookupId(candidate) === compact
    )
  ) ?? null;
}

export async function updateInternalOrderPaymentById(
  internalOrderId: string,
  input: {
    bookingStatus?: string | null;
    paymentStatus?: string | null;
    bookingPatch?: JsonRecord | null;
    paymentPatch?: JsonRecord | null;
    eventType: string;
    payload: unknown;
  }
): Promise<InternalOrderRow | null> {
  const existing = await getInternalOrderById(internalOrderId);
  if (!existing) return null;

  const updatedAt = new Date().toISOString();
  const nextBooking = { ...(existing.booking ?? {}), ...(input.bookingPatch ?? {}) };
  const nextPayment = { ...(existing.payment ?? {}), ...(input.paymentPatch ?? {}) };
  if (input.bookingStatus) nextBooking.status = input.bookingStatus;
  if (input.paymentStatus) nextPayment.status = input.paymentStatus;

  const paymentStatus = normalizePaymentStatus(input.paymentStatus ?? null);
  const totalDue = toNumber(nextPayment.totalDue);
  const totalPaid = toNumber(nextPayment.totalPaid);
  const handoffMode = typeof nextPayment.handoffMode === "string" ? nextPayment.handoffMode : null;
  const handoffUrl = typeof nextPayment.handoffUrl === "string" ? nextPayment.handoffUrl : null;
  const operatorAction = typeof nextPayment.operatorAction === "string" ? nextPayment.operatorAction : null;

  if (useBlobOrderStore()) {
    const store = await loadBlobOrderStore();
    store.orders = sortOrdersDesc(store.orders.map((order) => {
      if (order.internalOrderId !== internalOrderId) return order;
      return {
        ...order,
        lastTouchedAt: updatedAt,
        booking: nextBooking,
        payment: nextPayment,
        operatorPaymentStep: paymentStatus === "paid" ? "paid" : order.operatorPaymentStep ?? "none",
      };
    }));
    store.events.push({
      createdAt: updatedAt,
      eventType: input.eventType,
      rezdyBookingReference: existing.rezdyBookingReference,
      bookingStatus: input.bookingStatus ?? null,
      paymentStatus,
      payload: input.payload,
    });
    await saveBlobOrderStore(store);
    return store.orders.find((order) => order.internalOrderId === internalOrderId) ?? null;
  }

  const db = await openDb();
  if (db) {
    try {
      db.prepare(
        `UPDATE orders
         SET bookingStatus = COALESCE(?, bookingStatus),
             paymentStatus = COALESCE(?, paymentStatus),
             bookingJson = ?,
             paymentJson = ?,
             totalDue = ?,
             totalPaid = ?,
             handoffMode = ?,
             handoffUrl = ?,
             operatorAction = ?,
             operatorPaymentStep = CASE WHEN COALESCE(?, '') = 'paid' THEN 'paid' ELSE operatorPaymentStep END,
             lastTouchedAt = ?
         WHERE internalOrderId = ?`
      ).run(
        input.bookingStatus ?? null,
        paymentStatus,
        asJson(nextBooking),
        asJson(nextPayment),
        totalDue,
        totalPaid,
        handoffMode,
        handoffUrl,
        operatorAction,
        paymentStatus,
        updatedAt,
        internalOrderId
      );

      db.prepare(
        `INSERT INTO order_events (
          createdAt, eventType, rezdyBookingReference, bookingStatus, paymentStatus, payloadJson
        ) VALUES (?, ?, ?, ?, ?, ?)`
      ).run(
        updatedAt,
        input.eventType,
        existing.rezdyBookingReference,
        input.bookingStatus ?? null,
        paymentStatus,
        asJson(input.payload)
      );
    } finally {
      db.close();
    }
  }

  await appendBackupRow({
    internalOrderId: existing.internalOrderId,
    bookingToken: existing.bookingToken ?? null,
    createdAt: existing.createdAt,
    lastTouchedAt: updatedAt,
    rezdyBookingReference: existing.rezdyBookingReference,
    productCode: existing.productCode,
    sessionKey: existing.sessionKey,
    customer: existing.customer,
    booking: nextBooking,
    payment: nextPayment,
    pickup: null,
    rezdyBookingPayload: existing.rezdyBookingPayload,
    notes: existing.notes ?? null,
    followUpStatus: existing.followUpStatus ?? "new",
    operatorPaymentStep: paymentStatus === "paid" ? "paid" : existing.operatorPaymentStep ?? "none",
    paymentRequestSentAt: existing.paymentRequestSentAt ?? null,
  });

  return getInternalOrderById(internalOrderId);
}

export async function updateInternalOrderOps(
  internalOrderId: string,
  input: { notes?: string; followUpStatus?: FollowUpStatus; markPaymentRequestSent?: boolean }
) {
  if (useBlobOrderStore()) {
    const store = await loadBlobOrderStore();
    const current = store.orders.find((order) => order.internalOrderId === internalOrderId);
    if (!current) return { ok: false as const, reason: "not_found" as const };
    const nextNotes = typeof input.notes === "string" ? input.notes.trim() : current.notes ?? null;
    const nextFollow = asFollowUpStatus(input.followUpStatus) ?? current.followUpStatus ?? "new";
    const markSent = input.markPaymentRequestSent === true;
    const currentStep = current.operatorPaymentStep ?? "none";
    const nextStep: OperatorPaymentStep = markSent
      ? currentStep === "paid"
        ? "paid"
        : "request_sent"
      : currentStep;
    const nextSentAt = markSent
      ? current.paymentRequestSentAt ?? new Date().toISOString()
      : current.paymentRequestSentAt ?? null;
    const nextFollowAdjusted: FollowUpStatus =
      markSent && nextFollow !== "resolved" ? "waiting" : nextFollow;
    const touchedAt = new Date().toISOString();
    store.orders = sortOrdersDesc(store.orders.map((order) => order.internalOrderId !== internalOrderId ? order : {
      ...order,
      notes: nextNotes || null,
      followUpStatus: nextFollowAdjusted,
      operatorPaymentStep: nextStep,
      paymentRequestSentAt: nextSentAt,
      lastTouchedAt: touchedAt,
    }));
    store.events.push({
      type: "internal.order.ops",
      internalOrderId,
      updatedAt: touchedAt,
      notes: nextNotes,
      followUpStatus: nextFollowAdjusted,
      operatorPaymentStep: nextStep,
      paymentRequestSentAt: nextSentAt,
    });
    await saveBlobOrderStore(store);
    return { ok: true as const };
  }
  const db = await openDb();
  if (db) {
    try {
      const current = db
        .prepare(
          `SELECT notes, followUpStatus, operatorPaymentStep, paymentRequestSentAt
           FROM orders WHERE internalOrderId = ? LIMIT 1`
        )
        .get(internalOrderId) as
        | {
            notes?: string | null;
            followUpStatus?: string | null;
            operatorPaymentStep?: string | null;
            paymentRequestSentAt?: string | null;
          }
        | undefined;
      if (!current) return { ok: false as const, reason: "not_found" as const };

      const nextNotes = typeof input.notes === "string" ? input.notes.trim() : current.notes ?? null;
      const nextFollow = asFollowUpStatus(input.followUpStatus) ?? asFollowUpStatus(current.followUpStatus) ?? "new";
      const markSent = input.markPaymentRequestSent === true;
      const currentStep = asOperatorPaymentStep(current.operatorPaymentStep) ?? "none";
      const nextStep: OperatorPaymentStep = markSent
        ? currentStep === "paid"
          ? "paid"
          : "request_sent"
        : currentStep;
      const nextSentAt = markSent
        ? current.paymentRequestSentAt ?? new Date().toISOString()
        : current.paymentRequestSentAt ?? null;
      const nextFollowAdjusted: FollowUpStatus =
        markSent && nextFollow !== "resolved" ? "waiting" : nextFollow;

      const touchedAt = new Date().toISOString();
      db.prepare(
        `UPDATE orders
         SET notes = ?,
             followUpStatus = ?,
             operatorPaymentStep = ?,
             paymentRequestSentAt = ?,
             lastTouchedAt = ?
         WHERE internalOrderId = ?`
      ).run(
        nextNotes || null,
        nextFollowAdjusted,
        nextStep,
        nextSentAt,
        touchedAt,
        internalOrderId
      );
      return { ok: true as const };
    } finally {
      db.close();
    }
  }

  const orders = await loadOrdersFromBackup();
  const current = orders.find((order) => order.internalOrderId === internalOrderId);
  if (!current) return { ok: false as const, reason: "not_found" as const };

  const nextNotes = typeof input.notes === "string" ? input.notes.trim() : current.notes ?? null;
  const nextFollow = asFollowUpStatus(input.followUpStatus) ?? current.followUpStatus ?? "new";
  const markSent = input.markPaymentRequestSent === true;
  const currentStep = current.operatorPaymentStep ?? "none";
  const nextStep: OperatorPaymentStep = markSent
    ? currentStep === "paid"
      ? "paid"
      : "request_sent"
    : currentStep;
  const nextSentAt = markSent
    ? current.paymentRequestSentAt ?? new Date().toISOString()
    : current.paymentRequestSentAt ?? null;
  const nextFollowAdjusted: FollowUpStatus =
    markSent && nextFollow !== "resolved" ? "waiting" : nextFollow;
  const touchedAt = new Date().toISOString();

  await appendBackupRow({
    type: "internal.order.ops",
    internalOrderId,
    updatedAt: touchedAt,
    notes: nextNotes,
    followUpStatus: nextFollowAdjusted,
    operatorPaymentStep: nextStep,
    paymentRequestSentAt: nextSentAt,
  });

  return { ok: true as const };
}

export type InternalOrderPaymentAction =
  | "mark_unpaid"
  | "mark_partial"
  | "mark_paid"
  | "mark_manual_review";

export async function updateInternalOrderPaymentState(
  internalOrderId: string,
  input: {
    action: InternalOrderPaymentAction;
    amountPaidDollars?: number | null;
    reason?: string | null;
  }
): Promise<InternalOrderRow | null> {
  const existing = await getInternalOrderById(internalOrderId);
  if (!existing) return null;

  const totalDue =
    typeof existing.payment?.totalDue === "number" && Number.isFinite(existing.payment.totalDue)
      ? existing.payment.totalDue
      : 0;
  const currentPaid =
    typeof existing.payment?.totalPaid === "number" && Number.isFinite(existing.payment.totalPaid)
      ? existing.payment.totalPaid
      : 0;

  let nextTotalPaid = currentPaid;
  let nextStatus: string | null = existing.payment?.status && typeof existing.payment.status === "string"
    ? existing.payment.status
    : null;

  if (input.action === "mark_unpaid") {
    nextTotalPaid = 0;
    nextStatus = "unpaid";
  } else if (input.action === "mark_partial") {
    const requested = typeof input.amountPaidDollars === "number" ? input.amountPaidDollars : NaN;
    if (!Number.isFinite(requested) || requested <= 0 || requested >= totalDue) {
      throw new Error("Partial amount must be greater than 0 and less than total due.");
    }
    nextTotalPaid = Number(requested.toFixed(2));
    nextStatus = "partial";
  } else if (input.action === "mark_paid") {
    nextTotalPaid = totalDue;
    nextStatus = "paid";
  } else if (input.action === "mark_manual_review") {
    nextTotalPaid = currentPaid;
    nextStatus = "manual_review";
  }

  const paymentPatch: JsonRecord = {
    totalDue,
    totalPaid: nextTotalPaid,
    status: nextStatus,
  };
  if (input.reason?.trim()) {
    paymentPatch.opsReason = input.reason.trim();
  }

  return updateInternalOrderPaymentById(internalOrderId, {
    paymentStatus: nextStatus,
    paymentPatch,
    eventType: "internal.order.payment_state_changed",
    payload: {
      action: input.action,
      amountPaidDollars: nextTotalPaid,
      totalDue,
      reason: input.reason?.trim() || null,
    },
  });
}

export async function updateInternalOrderScheduleById(
  internalOrderId: string,
  input: {
    productCode?: string | null;
    sessionKey?: string | null;
    pickup?: JsonRecord | null;
    reason?: string | null;
  }
): Promise<{
  order: InternalOrderRow | null;
  warnings: string[];
  flaggedForReview: boolean;
}> {
  const existing = await getInternalOrderById(internalOrderId);
  if (!existing) return { order: null, warnings: [], flaggedForReview: false };

  const nextProductCode = typeof input.productCode === "string" && input.productCode.trim()
    ? input.productCode.trim()
    : existing.productCode;
  const nextSessionKey = typeof input.sessionKey === "string"
    ? input.sessionKey.trim() || null
    : existing.sessionKey ?? null;
  const nextPickup = input.pickup ?? existing.pickup ?? null;
  const allOrders = await listInternalOrders();
  const review = reviewReassignmentDraft({
    productCode: nextProductCode,
    sessionKey: nextSessionKey,
    pickupLabel: stringValue(nextPickup?.label),
    fallbackServiceDate:
      stringValue(existing.booking?.date) ||
      stringValue(existing.booking?.eventDate) ||
      stringValue(existing.rezdyBookingPayload?.date) ||
      stringValue(existing.rezdyBookingPayload?.eventDate),
  });
  if (review.malformedReason) {
    throw new Error(review.malformedReason);
  }
  const inferredOwner: FleetOwner | null =
    typeof nextProductCode === "string" && nextProductCode.startsWith("shared-")
      ? "parr"
      : review.serviceDate && nextProductCode
        ? assignPrivateInventory(allOrders, {
            serviceDate: review.serviceDate,
            productCode: nextProductCode,
            excludeInternalOrderId: internalOrderId,
          }).owner
        : nextProductCode
          ? "parr"
          : null;
  const flaggedForReview = review.warnings.length > 0;
  const nextFollowUpStatus: FollowUpStatus = flaggedForReview
    ? "needs_review"
    : existing.followUpStatus ?? "new";
  const nextBooking = patchInventoryOwner(existing.booking, inferredOwner);
  const nextPayment = patchInventoryOwner(existing.payment, inferredOwner);
  const nextRezdyBookingPayload = patchInventoryOwner(existing.rezdyBookingPayload, inferredOwner);
  const nextPickupPatched = patchInventoryOwner(nextPickup, inferredOwner);
  const touchedAt = new Date().toISOString();

  if (useBlobOrderStore()) {
    const store = await loadBlobOrderStore();
    store.orders = sortOrdersDesc(
      store.orders.map((order) =>
        order.internalOrderId !== internalOrderId
          ? order
          : {
              ...order,
              productCode: nextProductCode,
              sessionKey: nextSessionKey,
              booking: nextBooking,
              payment: nextPayment,
              rezdyBookingPayload: nextRezdyBookingPayload,
              pickup: nextPickupPatched,
              followUpStatus: nextFollowUpStatus,
              lastTouchedAt: touchedAt,
            }
      )
    );
    store.events.push({
      type: "internal.order.schedule",
      internalOrderId,
      updatedAt: touchedAt,
      productCode: nextProductCode,
      sessionKey: nextSessionKey,
      pickup: nextPickupPatched,
      inventoryOwner: inferredOwner,
      followUpStatus: nextFollowUpStatus,
      warnings: review.warnings,
      reason: input.reason?.trim() || null,
    });
    await saveBlobOrderStore(store);
    return {
      order: store.orders.find((order) => order.internalOrderId === internalOrderId) ?? null,
      warnings: review.warnings,
      flaggedForReview,
    };
  }

  const db = await openDb();
  if (db) {
    try {
      db.prepare(
        `UPDATE orders
         SET productCode = ?,
             sessionKey = ?,
             bookingJson = ?,
             paymentJson = ?,
             pickupJson = ?,
             rezdyBookingPayloadJson = ?,
             followUpStatus = ?,
             lastTouchedAt = ?
         WHERE internalOrderId = ?`
      ).run(
        nextProductCode,
        nextSessionKey,
        asJson(nextBooking),
        asJson(nextPayment),
        asJson(nextPickupPatched),
        asJson(nextRezdyBookingPayload),
        nextFollowUpStatus,
        touchedAt,
        internalOrderId
      );

      db.prepare(
        `INSERT INTO order_events (
          createdAt, eventType, rezdyBookingReference, bookingStatus, paymentStatus, payloadJson
        ) VALUES (?, ?, ?, ?, ?, ?)`
      ).run(
        touchedAt,
        "internal.order.schedule_changed",
        existing.rezdyBookingReference,
        typeof existing.booking?.status === "string" ? existing.booking.status : null,
        typeof existing.payment?.status === "string" ? existing.payment.status : null,
        asJson({
          from: {
            productCode: existing.productCode ?? null,
            sessionKey: existing.sessionKey ?? null,
            pickup: existing.pickup ?? null,
          },
          to: {
            productCode: nextProductCode ?? null,
            sessionKey: nextSessionKey,
            pickup: nextPickupPatched,
            inventoryOwner: inferredOwner,
            followUpStatus: nextFollowUpStatus,
          },
          warnings: review.warnings,
          reason: input.reason?.trim() || null,
        })
      );
    } finally {
      db.close();
    }
  }

  await appendBackupRow({
    internalOrderId: existing.internalOrderId,
    bookingToken: existing.bookingToken ?? null,
    createdAt: existing.createdAt,
    lastTouchedAt: touchedAt,
    rezdyBookingReference: existing.rezdyBookingReference,
    productCode: nextProductCode,
    sessionKey: nextSessionKey,
    customer: existing.customer,
    booking: nextBooking,
    payment: nextPayment,
    pickup: nextPickupPatched,
    rezdyBookingPayload: nextRezdyBookingPayload,
    notes: existing.notes ?? null,
    followUpStatus: nextFollowUpStatus,
    operatorPaymentStep: existing.operatorPaymentStep ?? "none",
    paymentRequestSentAt: existing.paymentRequestSentAt ?? null,
  });

  return {
    order: await getInternalOrderById(internalOrderId),
    warnings: review.warnings,
    flaggedForReview,
  };
}

export async function cancelInternalOrderById(
  internalOrderId: string,
  input: { reason?: string | null }
): Promise<InternalOrderRow | null> {
  const existing = await getInternalOrderById(internalOrderId);
  if (!existing) return null;

  const touchedAt = new Date().toISOString();
  const reason = input.reason?.trim() || null;
  const nextBooking = {
    ...(existing.booking ?? {}),
    status: "canceled",
    canceledAt: touchedAt,
    cancellationReason: reason,
  } satisfies JsonRecord;

  if (useBlobOrderStore()) {
    const store = await loadBlobOrderStore();
    store.orders = sortOrdersDesc(
      store.orders.map((order) =>
        order.internalOrderId !== internalOrderId
          ? order
          : {
              ...order,
              booking: nextBooking,
              followUpStatus: "resolved",
              lastTouchedAt: touchedAt,
            }
      )
    );
    store.events.push({
      type: "internal.order.canceled",
      internalOrderId,
      updatedAt: touchedAt,
      reason,
    });
    await saveBlobOrderStore(store);
    return store.orders.find((order) => order.internalOrderId === internalOrderId) ?? null;
  }

  const db = await openDb();
  if (db) {
    try {
      db.prepare(
        `UPDATE orders
         SET bookingStatus = ?,
             bookingJson = ?,
             followUpStatus = ?,
             lastTouchedAt = ?
         WHERE internalOrderId = ?`
      ).run("canceled", asJson(nextBooking), "resolved", touchedAt, internalOrderId);

      db.prepare(
        `INSERT INTO order_events (
          createdAt, eventType, rezdyBookingReference, bookingStatus, paymentStatus, payloadJson
        ) VALUES (?, ?, ?, ?, ?, ?)`
      ).run(
        touchedAt,
        "internal.order.canceled",
        existing.rezdyBookingReference,
        "canceled",
        typeof existing.payment?.status === "string" ? existing.payment.status : null,
        asJson({
          reason,
        })
      );
    } finally {
      db.close();
    }
  }

  await appendBackupRow({
    internalOrderId: existing.internalOrderId,
    bookingToken: existing.bookingToken ?? null,
    createdAt: existing.createdAt,
    lastTouchedAt: touchedAt,
    rezdyBookingReference: existing.rezdyBookingReference,
    productCode: existing.productCode,
    sessionKey: existing.sessionKey,
    customer: existing.customer,
    booking: nextBooking,
    payment: existing.payment,
    pickup: existing.pickup ?? null,
    rezdyBookingPayload: existing.rezdyBookingPayload,
    notes: existing.notes ?? null,
    followUpStatus: "resolved",
    operatorPaymentStep: existing.operatorPaymentStep ?? "none",
    paymentRequestSentAt: existing.paymentRequestSentAt ?? null,
  });

  return getInternalOrderById(internalOrderId);
}
