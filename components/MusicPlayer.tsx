'use client';
import { useEffect, useState } from 'react';

export default function MusicPlayer({ artistName }: { artistName: string }) {
  const [trackInfo, setTrackInfo] = useState<{ artist: string; song: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrack() {
      try {
        const res = await fetch(`/api/artist-top-track?artist=${encodeURIComponent(artistName)}`);
        const data = await res.json();
        setTrackInfo(data);
      } catch (e) {
        console.error("Player sync failed");
      } finally {
        setLoading(false);
      }
    }
    fetchTrack();
  }, [artistName]);

  if (loading) return <div className="animate-pulse bg-zinc-900 aspect-video rounded-3xl border border-white/5" />;
  
  // Stable YouTube Search Embed fallback
  const searchQuery = trackInfo ? `${trackInfo.artist} ${trackInfo.song}` : artistName;
  const embedUrl = `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(searchQuery)}`;

  return (
    <div className="rounded-[2.5rem] overflow-hidden border border-white/5 bg-zinc-900/50 aspect-video group relative">
      <iframe
        src={embedUrl}
        width="100%"
        height="100%"
        frameBorder="0"
        allow="autoplay; encrypted-media; fullscreen"
        loading="lazy"
        className="opacity-80 group-hover:opacity-100 transition-opacity duration-700"
      ></iframe>
    </div>
  );
}
