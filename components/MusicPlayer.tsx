'use client';

import { useState } from 'react';

export default function MusicPlayer({ artistName }: { artistName: string }) {
  // Use the official Spotify embed URL format for a search query.
  // This is the most reliable way to get a player without a specific Spotify ID.
  const encodedArtistName = encodeURIComponent(artistName);
  const embedUrl = `https://open.spotify.com/embed/search/${encodedArtistName}`;
  
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="rounded-[2rem] overflow-hidden border border-white/10 bg-zinc-900 aspect-video relative">
      {/* Loading state for better UX */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center text-zinc-500 text-xs animate-pulse italic z-0">
          Loading Spotify Player...
        </div>
      )}
      <iframe
        src={embedUrl}
        width="100%"
        height="100%" // Fill the container's aspect ratio
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        // Smooth fade-in once loaded
        className={`w-full h-full transition-opacity duration-500 relative z-10 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onLoad={() => setIsLoading(false)}
        title={`Spotify player for ${artistName}`}
      ></iframe>
    </div>
  );
}
