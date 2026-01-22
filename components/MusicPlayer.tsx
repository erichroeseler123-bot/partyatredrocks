'use client';
import { useEffect, useState } from 'react';

export default function MusicPlayer({ spotifyUrl }: { spotifyUrl?: string }) {
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSmartLink() {
      // If you don't have a Spotify URL yet, we skip the fetch
      if (!spotifyUrl) {
        setLoading(false);
        return;
      }

      try {
        // Step 1: Hit the Odesli API
        const res = await fetch(`https://api.song.link/v1-alpha.1/links?url=${encodeURIComponent(spotifyUrl)}&userCountry=US`);
        const data = await res.json();

        // Step 2: Extract the YouTube Video ID from the universal results
        const youtubeId = data.linksByPlatform?.youtube?.url?.split('v=')[1];
        
        if (youtubeId) {
          setEmbedUrl(`https://www.youtube.com/embed/${youtubeId}?modestbranding=1&rel=0`);
        }
      } catch (e) {
        console.error("Smart Link Dispatch Failed");
      } finally {
        setLoading(false);
      }
    }
    fetchSmartLink();
  }, [spotifyUrl]);

  if (loading) return <div className="h-24 animate-pulse bg-zinc-900 rounded-3xl border border-white/5" />;
  if (!embedUrl) return <div className="h-24 flex items-center justify-center text-zinc-500 italic text-xs">Awaiting Spotify Link in Dispatch...</div>;

  return (
    <div className="relative rounded-[2rem] overflow-hidden border border-white/5 bg-zinc-900/50 h-24 group">
      <iframe
        src={embedUrl}
        width="100%"
        height="300"
        frameBorder="0"
        allow="autoplay; encrypted-media; fullscreen"
        loading="lazy"
        // Crop the frame to show only the audio controls
        className="absolute -top-[105px] left-0 w-full opacity-90 group-hover:opacity-100 transition-opacity duration-700"
      ></iframe>
    </div>
  );
}
