'use client';
import { useEffect, useState } from 'react';

export default function MusicPlayer({ spotifyUrl }: { spotifyUrl?: string }) {
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSmartLink() {
      if (!spotifyUrl) {
        setIsLoading(false);
        return;
      }

      try {
        // We now call our OWN internal Vercel route
        const res = await fetch(`/api/odesli?url=${encodeURIComponent(spotifyUrl)}`);
        const { youtubeId } = await res.json();
        
        if (youtubeId) {
          // Cropped audio-only layout
          setEmbedUrl(`https://www.youtube.com/embed/${youtubeId}?modestbranding=1&rel=0`);
        }
      } catch (e) {
        console.error("Vercel Proxy Fetch Failed");
      } finally {
        setIsLoading(false);
      }
    }
    fetchSmartLink();
  }, [spotifyUrl]);

  if (isLoading) return <div className="h-24 animate-pulse bg-zinc-900 rounded-3xl border border-white/5" />;
  if (!embedUrl) return <div className="h-24 flex items-center justify-center text-zinc-500 italic text-xs text-center px-4">Audio Dispatch Unavailable</div>;

  return (
    <div className="relative rounded-[2rem] overflow-hidden border border-white/5 bg-zinc-900/50 h-24 group">
      <iframe
        src={embedUrl}
        width="100%"
        height="300"
        frameBorder="0"
        allow="autoplay; encrypted-media; fullscreen"
        loading="lazy"
        className="absolute -top-[105px] left-0 w-full opacity-90 group-hover:opacity-100 transition-opacity duration-700"
      ></iframe>
    </div>
  );
}
