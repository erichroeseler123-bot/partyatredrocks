'use client';

export default function MusicPlayer({ artistName }: { artistName: string }) {
  // We'll use a generic search embed for the artist
  // For production, you'd ideally pass a specific Spotify Artist ID
  const embedUrl = `https://open.spotify.com/embed/search/${encodeURIComponent(artistName)}`;

  return (
    <div className="rounded-3xl overflow-hidden border border-white/10 bg-zinc-900 shadow-2xl">
      <iframe 
        src={embedUrl}
        width="100%" 
        height="380" 
        frameBorder="0" 
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
        loading="lazy"
        className="opacity-90 hover:opacity-100 transition-opacity"
      ></iframe>
    </div>
  );
}
