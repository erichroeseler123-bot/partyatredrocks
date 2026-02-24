"use client";

import { useEffect, useMemo, useState } from "react";

type ArtistIntel =
  | { found: false; name: string; error?: string; detail?: string }
  | {
      found: true;
      mbid: string;
      name: string;
      disambiguation: string | null;
      type: string | null;
      country: string | null;
      area: string | null;
      lifeSpan: { begin?: string; end?: string; ended?: boolean } | null;
      tags: string[];
      genres: string[];
      urls: Record<string, string | null>;
      score: number | null;
      partial?: boolean;
    };

type TopTrack = {
  title: string;
  url?: string | null;
  provider?: string | null;
};

function prettyKey(k: string) {
  return k.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
}

function cleanName(name: string) {
  return (name || "")
    .replace(/\s+\(\d+\+\)\s*$/g, "")
    .replace(/\s+-\s+.*$/g, "")
    .trim();
}

export default function ArtistIntelDrawer({ artistName }: { artistName: string }) {
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ArtistIntel | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const [tracksLoading, setTracksLoading] = useState(false);
  const [tracksErr, setTracksErr] = useState<string | null>(null);
  const [topTracks, setTopTracks] = useState<TopTrack[]>([]);

  const [nonce, setNonce] = useState(0);

  const safeName = useMemo(() => cleanName((artistName || "").trim()), [artistName]);

  useEffect(() => {
    if (!open) return;
    if (!safeName) return;

    let cancelled = false;

    (async () => {
      setLoading(true);
      setErr(null);
      setData(null);

      try {
        const res = await fetch(
          `/api/artist-intel?name=${encodeURIComponent(safeName)}&n=${nonce}`,
          { cache: "no-store" }
        );
        const json = await res.json();

        if (cancelled) return;

        // Our API returns 200 even on upstream fail; treat found:false + error as a soft error
        if (json?.found === false && json?.error) {
          setErr(json.error);
          setData(json);
        } else if (!res.ok) {
          setErr(json?.error || "Artist lookup failed");
          setData(null);
        } else {
          setData(json);
        }
      } catch (e: any) {
        if (cancelled) return;
        setErr(e?.message || "fetch failed");
        setData(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, safeName, nonce]);

  useEffect(() => {
    if (!open) return;
    if (!safeName) return;

    let cancelled = false;

    (async () => {
      setTracksLoading(true);
      setTracksErr(null);
      setTopTracks([]);

      try {
        const res = await fetch(`/api/artist-top-track?name=${encodeURIComponent(safeName)}&n=${nonce}`, {
          cache: "no-store",
        });
        const json = await res.json();

        if (cancelled) return;

        if (!res.ok) {
          setTracksErr(json?.error || "Top track lookup failed");
          setTopTracks([]);
        } else {
          const tracks = Array.isArray(json?.tracks)
            ? json.tracks
            : json?.title
            ? [json]
            : [];
          setTopTracks(
            tracks.slice(0, 5).map((t: any) => ({
              title: String(t.title || t.name || "Top Track"),
              url: t.url || t.link || null,
              provider: t.provider || t.source || null,
            }))
          );
        }
      } catch (e: any) {
        if (cancelled) return;
        setTracksErr(e?.message || "fetch failed");
        setTopTracks([]);
      } finally {
        if (!cancelled) setTracksLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, safeName, nonce]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="px-3 py-2 rounded-full border border-soft text-xs font-bold uppercase tracking-widest text-white hover:border-soft"
      >
        Artist Info
      </button>

      {open ? (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/70" onClick={() => setOpen(false)} />

          <div className="absolute right-0 top-0 h-full w-full sm:w-[560px] bg-black border-l border-soft p-6 overflow-y-auto">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-widest text-muted">
                  Artist Intelligence
                </div>
                <h3 className="mt-2 text-2xl font-black text-white">
                  {safeName || "Artist"}
                </h3>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setNonce((n) => n + 1)}
                  className="px-3 py-2 rounded-full border border-soft text-xs font-bold uppercase tracking-widest text-white hover:border-soft"
                >
                  Retry
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-3 py-2 rounded-full border border-soft text-xs font-bold uppercase tracking-widest text-white hover:border-soft"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="mt-6">
              {loading ? (
                <div className="text-muted">Loading MusicBrainz…</div>
              ) : err ? (
                <div className="text-red-300">
                  {err}
                  <div className="mt-3 text-xs text-muted">
                    If MusicBrainz is rate-limiting, Retry in a few seconds.
                  </div>
                </div>
              ) : data ? (
                "found" in data && data.found ? (
                  <div className="space-y-5">
                    <div className="rounded-2xl border border-soft p-4 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                      <div className="grid gap-3 text-sm text-soft">
                        {data.type ? (
                          <div>
                            <div className="text-xs uppercase tracking-widest text-muted">Type</div>
                            <div className="text-strong">{data.type}</div>
                          </div>
                        ) : null}

                        {data.lifeSpan?.begin ? (
                          <div>
                            <div className="text-xs uppercase tracking-widest text-muted">Active</div>
                            <div className="text-strong">
                              {data.lifeSpan.begin}
                              {data.lifeSpan.end
                                ? ` → ${data.lifeSpan.end}`
                                : data.lifeSpan.ended
                                ? " → ended"
                                : " → present"}
                            </div>
                          </div>
                        ) : null}

                        {(data.area || data.country) ? (
                          <div>
                            <div className="text-xs uppercase tracking-widest text-muted">Region</div>
                            <div className="text-strong">
                              {[data.area, data.country].filter(Boolean).join(" · ")}
                            </div>
                          </div>
                        ) : null}

                        {data.disambiguation ? (
                          <div>
                            <div className="text-xs uppercase tracking-widest text-muted">Note</div>
                            <div className="text-strong">{data.disambiguation}</div>
                          </div>
                        ) : null}

                        {typeof data.score === "number" ? (
                          <div>
                            <div className="text-xs uppercase tracking-widest text-muted">Match Score</div>
                            <div className="text-strong">{data.score}</div>
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-soft p-4 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                      <div className="text-xs uppercase tracking-widest text-muted">Top Tracks</div>

                      <div className="mt-3">
                        {tracksLoading ? (
                          <div className="text-muted text-sm">Loading…</div>
                        ) : tracksErr ? (
                          <div className="text-muted text-sm">{tracksErr}</div>
                        ) : topTracks.length ? (
                          <div className="grid gap-2">
                            {topTracks.map((t, idx) => (
                              <div
                                key={`${t.title}-${idx}`}
                                className="flex items-center justify-between gap-3 rounded-2xl border border-soft px-3 py-2 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                              >
                                <div className="min-w-0">
                                  <div className="text-strong text-sm font-semibold truncate">
                                    {t.title}
                                  </div>
                                  {t.provider ? (
                                    <div className="text-xs text-muted uppercase tracking-widest">
                                      {t.provider}
                                    </div>
                                  ) : null}
                                </div>

                                {t.url ? (
                                  <a
                                    href={t.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="shrink-0 px-3 py-2 rounded-full border border-soft text-xs font-bold uppercase tracking-widest text-white hover:border-soft"
                                  >
                                    Listen
                                  </a>
                                ) : null}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-muted text-sm">No tracks found.</div>
                        )}
                      </div>
                    </div>

                    {(data.genres?.length || data.tags?.length) ? (
                      <div className="rounded-2xl border border-soft p-4 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                        {data.genres?.length ? (
                          <div>
                            <div className="text-xs uppercase tracking-widest text-muted">Genres</div>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {data.genres.map((g) => (
                                <span
                                  key={g}
                                  className="px-3 py-1 rounded-full border border-soft text-xs text-strong"
                                >
                                  {g}
                                </span>
                              ))}
                            </div>
                          </div>
                        ) : null}

                        {data.tags?.length ? (
                          <div className="mt-4">
                            <div className="text-xs uppercase tracking-widest text-muted">Tags</div>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {data.tags.map((t) => (
                                <span
                                  key={t}
                                  className="px-3 py-1 rounded-full border border-soft text-xs text-soft"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    ) : null}

                    <div className="rounded-2xl border border-soft p-4 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                      <div className="text-xs uppercase tracking-widest text-muted">Links</div>

                      <div className="mt-3 grid gap-2 text-sm">
                        {Object.entries(data.urls || {}).map(([k, v]) =>
                          v ? (
                            <a
                              key={k}
                              href={v}
                              target="_blank"
                              rel="noreferrer"
                              className="text-strong hover:text-white underline underline-offset-4"
                            >
                              {prettyKey(k)}
                            </a>
                          ) : null
                        )}

                        <a
                          href={`https://musicbrainz.org/artist/${data.mbid}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-strong hover:text-white underline underline-offset-4"
                        >
                          MusicBrainz Profile
                        </a>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-muted">No MusicBrainz match found.</div>
                )
              ) : (
                <div className="text-muted">No data.</div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
