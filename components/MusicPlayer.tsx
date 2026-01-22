'use client';
import { useEffect, useState } from 'react';

export default function MusicPlayer({ spotifyUrl }: { spotifyUrl?: string }) {
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    async function fetchSmartLink() {
      if (!spotifyUrl || spotifyUrl.includes('seatgeek.com') || spotifyUrl.includes('undefined')) {
        setStatus('error');
        return;
      }

      try {
        const res = await fetch(`/api/odesli?url=${encodeURIComponent(spotifyUrl)}`);
        if (!res.ok) throw new Error('API response not ok');
        const data = await res.json();

        if (data.youtubeId) {
          // Direct track embed with modest branding parameters
          setEmbedUrl(`https://www.youtube.com/embed/${data.youtubeId}?modestbranding=1&rel=0&controls=0&iv_load_policy=3`);
          setStatus('ready');
        } else if (data.isArtistFallback && data.artistName) {
          // Bias search toward live Red Rocks versions for a better vibe
          const query = encodeURIComponent(`${data.artistName} top tracks official audio OR live Red Rocks`);
          setEmbedUrl(`https://www.youtube.com/embed?listType=search&list=${query}&modestbranding=1&rel=0`);
          setStatus('ready');
        } else {
          setStatus('error');
        }
      } catch (e) {
        setStatus('error');
      }
    }
    fetchSmartLink();
  }, [spotifyUrl]);

  if (status === 'loading') return <div className="h-24 animate-pulse bg-zinc-900 rounded-3xl border border-white/5" />;

  if (status === 'error') return (
    <div className="h-24 flex items-center justify-center rounded-[2rem] border border-white/5 bg-zinc-900/10">
      <p className="text-zinc-500 text-[10px] uppercase font-black italic tracking-widest px-4 text-center leading-tight">
        Audio Dispatch Offline – Visit SeatGeek for Music
      </p>
    </div>
  );

  return (
    <div className="relative rounded-[2rem] overflow-hidden border border-white/5 bg-zinc-900/50 h-24 group">
      <iframe
        src={embedUrl!}
        width="100%" height="300" frameBorder="0" allow="autoplay; encrypted-media; fullscreen"
        loading="lazy"
        className="absolute -top-[105px] left-0 w-full opacity-90 group-hover:opacity-100 transition-opacity"
      ></iframe>
    </div>
  );
}
