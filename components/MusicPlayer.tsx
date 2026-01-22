'use client';

export default function MusicPlayer({ artistName }: { artistName: string }) {
  // Fixes the 404 by using the absolute Spotify search embed
  const searchQuery = encodeURIComponent(artistName);
  const embedUrl = `https://open.spotify.com/embed/search/${searchQuery}`;

  return (
    <div className="rounded-[2.5rem] overflow-hidden border border-white/5 bg-zinc-900/50 aspect-video">
      <iframe 
        src={embedUrl}
        width="100%" 
        height="380" 
        frameBorder="0" 
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
        loading="lazy"
      ></iframe>
    </div>
  );
}
