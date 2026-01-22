'use client';
import { useEffect, useState } from 'react';

export default function MusicPlayer({ artistName }: { artistName: string }) {
  const [artistId, setArtistId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchId() {
      try {
        const res = await fetch(`/api/spotify-id?artist=${encodeURIComponent(artistName)}`);
        const data = await res.json();
        setArtistId(data.id);
      } catch (e) {
        console.error("Player sync failed");
      } finally {
        setLoading(false);
      }
    }
    fetchId();
  }, [artistName]);

  if (loading) return <div className="animate-pulse bg-zinc-900 aspect-video rounded-3xl" />;
  if (!artistId) return <div className="text-zinc-500 italic p-10">Audio Intel Unavailable.</div>;

  return (
    <div className="rounded-[2.5rem] overflow-hidden border border-white/5 bg-zinc-900/50 aspect-video">
      <iframe
        src={`https://open.spotify.com/embed/artist/${artistId}`}
        width="100%"
        height="100%"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      ></iframe>
    </div>
  );
}
