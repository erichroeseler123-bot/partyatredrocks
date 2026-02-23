import { head, list, put } from "@vercel/blob";

type BlobMeta = { url: string; pathname: string };

async function resolveBlobUrl(pathname: string): Promise<string | null> {
  // Primary: head(pathname)
  try {
    const meta = (await head(pathname)) as unknown as BlobMeta;
    if (meta?.url) return meta.url;
  } catch {}

  // Fallback: list by prefix and pick exact match
  try {
    const res = await list({ prefix: pathname });
    const exact = res.blobs?.find((b) => b.pathname === pathname);
    return exact?.url ?? null;
  } catch {}

  return null;
}

export async function blobReadJson<T>(
  pathname: string,
  opts?: { revalidateSeconds?: number }
): Promise<T | null> {
  const url = await resolveBlobUrl(pathname);
  if (!url) return null;

  const res = await fetch(url, {
    next: { revalidate: opts?.revalidateSeconds ?? 300 },
  });
  if (!res.ok) return null;

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
