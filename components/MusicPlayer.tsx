'use client';

export default function MusicPlayer({ artistName }: { artistName: string }) {
  // Use the standard Spotify search embed URL to avoid 404s
  const embedUrl = `https://open.spotify.com/embed/search/${encodeURIComponent(artistName)}`;

  return (
    <div className="rounded-[2rem] overflow-hidden border border-white/10 bg-zinc-900">
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
