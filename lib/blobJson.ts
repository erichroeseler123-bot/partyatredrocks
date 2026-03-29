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

  const meta = (await withTimeout(
    head(pathname).then((m) => m as unknown as BlobMeta),
    ms
  )) as BlobMeta | null;
  if (meta?.url) return meta.url;

  const res = await withTimeout(list({ prefix: pathname }), ms);
  const exact = res?.blobs?.find((b) => b.pathname === pathname);
  if (exact?.url) return exact.url;

  return null;
}

async function blobRead(pathname: string, opts?: { revalidateSeconds?: number }) {
  const url = await resolveBlobUrl(pathname);
  if (!url) return null;

  const revalidateSeconds = opts?.revalidateSeconds ?? 300;
  const requestUrl = revalidateSeconds === 0
    ? `${url}${url.includes("?") ? "&" : "?"}ts=${Date.now()}`
    : url;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs());
  const res = await fetch(requestUrl, {
    signal: controller.signal,
    cache: revalidateSeconds === 0 ? "no-store" : undefined,
    next: { revalidate: revalidateSeconds },
  }).catch(() => null);
  clearTimeout(timer);
  if (!res?.ok) return null;

  return res;
}

export async function blobReadJson<T>(
  pathname: string,
  opts?: { revalidateSeconds?: number }
): Promise<T | null> {
  const res = await blobRead(pathname, opts);
  if (!res) return null;
  return (await res.json()) as T;
}

export async function blobReadText(
  pathname: string,
  opts?: { revalidateSeconds?: number }
): Promise<string | null> {
  const res = await blobRead(pathname, opts);
  if (!res) return null;
  return await res.text();
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
    cacheControlMaxAge: Math.max(60, opts?.cacheControlMaxAge ?? 60),
  });

  return { url: blob.url, pathname: blob.pathname };
}

export async function blobWriteText(
  pathname: string,
  data: string,
  opts?: { cacheControlMaxAge?: number; contentType?: string }
): Promise<{ url: string; pathname: string }> {
  const blob = await put(pathname, data, {
    access: "public",
    contentType: opts?.contentType ?? "text/plain; charset=utf-8",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: Math.max(60, opts?.cacheControlMaxAge ?? 60),
  });

  return { url: blob.url, pathname: blob.pathname };
}
