'use client';

import { useState } from 'react';

export default function MusicPlayer({ artistName }: { artistName: string }) {
  // 1. Encode the artist name properly
  const encodedArtistName = encodeURIComponent(artistName);
  
  // 2. Use the CORRECT, full HTTPS URL with the backticks for variable insertion
  const embedUrl = `https://open.spotify.com/embed/search/${encodedArtistName}`;

  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="rounded-[2.5rem] overflow-hidden border border-white/5 bg-zinc-900/50 aspect-video relative group">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 z-0">
          <div className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse italic">
            Initializing Dispatch Audio...
          </div>
        </div>
      )}
      <iframe
        src={embedUrl}
        width="100%"
        height="100%"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        className={`relative z-10 transition-opacity duration-700 ${isLoading ? 'opacity-0' : 'opacity-80 group-hover:opacity-100'}`}
        onLoad={() => setIsLoading(false)}
        title={`Spotify player for ${artistName}`}
      ></iframe>
    </div>
  );
}
