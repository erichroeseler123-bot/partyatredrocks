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
        // Step 1: Hit the public Odesli API
        const res = await fetch(`https://api.song.link/v1-alpha.1/links?url=${encodeURIComponent(spotifyUrl)}&userCountry=US`);
        const data = await res.json();

        // Step 2: Extract the YouTube Video ID from the universal translation
        const youtubeId = data.linksByPlatform?.youtube?.url?.split('v=')[1];
        
        if (youtubeId) {
          // Rel=0 and modestbranding=1 make it look professional
          setEmbedUrl(`https://www.youtube.com/embed/${youtubeId}?modestbranding=1&rel=0&autoplay=0`);
        }
      } catch (e) {
        console.error("Odesli Dispatch Failed");
      } finally {
        setIsLoading(false);
      }
    }
    fetchSmartLink();
  }, [spotifyUrl]);

  if (isLoading) return <div className="h-24 animate-pulse bg-zinc-900 rounded-3xl border border-white/5" />;
  if (!embedUrl) return <div className="h-24 flex items-center justify-center text-zinc-500 italic text-xs">Audio Dispatch Pending Link...</div>;

  return (
    <div className="relative rounded-[2rem] overflow-hidden border border-white/5 bg-zinc-900/50 h-24 group">
      <iframe
        src={embedUrl}
        width="100%"
        height="300"
        frameBorder="0"
        allow="autoplay; encrypted-media; fullscreen"
        loading="lazy"
        // This negative top value crops the video out, leaving just the audio bar
        className="absolute -top-[105px] left-0 w-full opacity-90 group-hover:opacity-100 transition-opacity duration-700"
      ></iframe>
    </div>
  );
}
