import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";
import type { FaqRow } from "@/lib/faqs/schema";

const FAQS_DIR = path.join(process.cwd(), "data", "faqs");

async function readRows(relPath: string): Promise<FaqRow[]> {
  try {
    const raw = await readFile(path.join(FAQS_DIR, relPath), "utf8");
    const parsed = JSON.parse(raw) as FaqRow[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (row) =>
        row &&
        typeof row.id === "string" &&
        typeof row.question === "string" &&
        typeof row.answer === "string"
    );
  } catch {
    return [];
  }
}

export async function getFaqRows(relPath: string): Promise<FaqRow[]> {
  return readRows(relPath);
}

export async function getFaqRowsWithGlobal(relPath: string): Promise<FaqRow[]> {
  const [globalRows, pageRows] = await Promise.all([readRows("global.json"), readRows(relPath)]);
  const seen = new Set<string>();
  const out: FaqRow[] = [];
  for (const row of [...pageRows, ...globalRows]) {
    if (seen.has(row.id)) continue;
    seen.add(row.id);
    out.push(row);
  }
  return out;
}
