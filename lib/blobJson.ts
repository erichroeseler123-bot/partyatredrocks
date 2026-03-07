import { head, list, put } from "@vercel/blob";

type BlobMeta = { url: string; pathname: string };

function timeoutMs() {
  const raw = Number(process.env.BLOB_READ_TIMEOUT_MS ?? 2000);
  return Number.isFinite(raw) && raw > 0 ? raw : 2000;
}

async function withTimeout<T>(p: Promise<T>, ms: number): Promise<T | null> {
  let timer: NodeJS.Timeout | undefined;
  try {
    return await Promise.race([
      p,
      new Promise<null>((resolve) => {
        timer = setTimeout(() => resolve(null), ms);
      }),
    ]);
  } catch {
    return null;
  } finally {
    if (timer) clearTimeout(timer);
  }
}

async function resolveBlobUrl(pathname: string): Promise<string | null> {
  const ms = timeoutMs();

  // Primary: head(pathname)
  const meta = (await withTimeout(
    head(pathname).then((m) => m as unknown as BlobMeta),
    ms
  )) as BlobMeta | null;
  if (meta?.url) return meta.url;

  // Fallback: list by prefix and pick exact match
  const res = await withTimeout(list({ prefix: pathname }), ms);
  const exact = res?.blobs?.find((b) => b.pathname === pathname);
  if (exact?.url) return exact.url;

  return null;
}

export async function blobReadJson<T>(
  pathname: string,
  opts?: { revalidateSeconds?: number }
): Promise<T | null> {
  const url = await resolveBlobUrl(pathname);
  if (!url) return null;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs());
  const res = await fetch(url, {
    signal: controller.signal,
    next: { revalidate: opts?.revalidateSeconds ?? 300 },
  }).catch(() => null);
  clearTimeout(timer);
  if (!res?.ok) return null;

  return (await res.json()) as T;
}

export async function blobWriteJson(
  pathname: string,
  data: unknown,
  opts?: { cacheControlMaxAge?: number }
): Promise<{ url: string; pathname: string }> {
  const blob = await put(pathname, JSON.stringify(data), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    // minimum is 60 seconds
    cacheControlMaxAge: Math.max(60, opts?.cacheControlMaxAge ?? 60),
  });

  return { url: blob.url, pathname: blob.pathname };
}
