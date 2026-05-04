import "server-only";

import { appendFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { blobReadJson, blobWriteJson } from "@/lib/blobJson";

export type ParrStoredTelemetryEvent = {
  id: string;
  name:
    | "page_viewed"
    | "handoff_viewed"
    | "shortlist_rendered"
    | "product_opened"
    | "checkout_started"
    | "navigation_clicked"
    | "decision_cta_clicked"
    | "booking_confirmed"
    | "booking_completed";
  createdAt: string;
  sessionId: string;
  page: string;
  handoffId?: string | null;
  props: Record<string, unknown>;
};

type ParrTelemetryBlobStore = {
  updatedAt: string;
  events: ParrStoredTelemetryEvent[];
};

const PARR_TELEMETRY_BLOB_PATH = "cache/telemetry/parr-events.json";
const MAX_STORED_EVENTS = 1500;

function useBlobStore() {
  return process.env.VERCEL === "1" && !!process.env.BLOB_READ_WRITE_TOKEN;
}

function telemetryLogPath() {
  return path.join(process.cwd(), "data", "telemetry", "parr-events.ndjson");
}

function emptyStore(): ParrTelemetryBlobStore {
  return {
    updatedAt: new Date(0).toISOString(),
    events: [],
  };
}

function normalizeEvent(value: unknown): ParrStoredTelemetryEvent | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  if (
    typeof row.id !== "string" ||
    typeof row.name !== "string" ||
    typeof row.createdAt !== "string" ||
    typeof row.sessionId !== "string" ||
    typeof row.page !== "string"
  ) {
    return null;
  }

  return {
    id: row.id,
    name: row.name as ParrStoredTelemetryEvent["name"],
    createdAt: row.createdAt,
    sessionId: row.sessionId,
    page: row.page,
    handoffId: typeof row.handoffId === "string" ? row.handoffId : null,
    props: row.props && typeof row.props === "object" ? (row.props as Record<string, unknown>) : {},
  };
}

function normalizeStore(value: unknown): ParrTelemetryBlobStore {
  if (!value || typeof value !== "object") return emptyStore();
  const row = value as Record<string, unknown>;
  return {
    updatedAt: typeof row.updatedAt === "string" ? row.updatedAt : new Date(0).toISOString(),
    events: Array.isArray(row.events)
      ? row.events.map(normalizeEvent).filter((event): event is ParrStoredTelemetryEvent => !!event)
      : [],
  };
}

async function loadBlobStore(): Promise<ParrTelemetryBlobStore> {
  const value = await blobReadJson<ParrTelemetryBlobStore>(PARR_TELEMETRY_BLOB_PATH, {
    revalidateSeconds: 0,
  }).catch(() => null);
  return normalizeStore(value);
}

async function saveBlobStore(store: ParrTelemetryBlobStore) {
  store.updatedAt = new Date().toISOString();
  await blobWriteJson(PARR_TELEMETRY_BLOB_PATH, store, { cacheControlMaxAge: 60 });
}

async function appendNdjson(event: ParrStoredTelemetryEvent) {
  const filePath = telemetryLogPath();
  await mkdir(path.dirname(filePath), { recursive: true });
  await appendFile(filePath, `${JSON.stringify(event)}\n`, "utf8");
}

async function readNdjsonEvents(): Promise<ParrStoredTelemetryEvent[]> {
  const filePath = telemetryLogPath();
  const text = await readFile(filePath, "utf8").catch(() => "");
  if (!text.trim()) return [];
  return text
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => {
      try {
        return normalizeEvent(JSON.parse(line));
      } catch {
        return null;
      }
    })
    .filter((event): event is ParrStoredTelemetryEvent => !!event)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function recordParrTelemetryEvent(event: ParrStoredTelemetryEvent) {
  if (useBlobStore()) {
    const store = await loadBlobStore();
    store.events = [event, ...store.events.filter((row) => row.id !== event.id)].slice(0, MAX_STORED_EVENTS);
    await saveBlobStore(store);
  }
  await appendNdjson(event).catch(() => undefined);
}

export async function listRecentParrTelemetryEvents(limit = 100): Promise<ParrStoredTelemetryEvent[]> {
  if (useBlobStore()) {
    const store = await loadBlobStore();
    return store.events.slice(0, limit);
  }
  return (await readNdjsonEvents()).slice(0, limit);
}
