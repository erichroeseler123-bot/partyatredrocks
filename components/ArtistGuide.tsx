'use client';
import { useEffect, useState } from 'react';

export default function ArtistGuide({ artistName }: { artistName: string }) {
  const [bio, setBio] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBio() {
      try {
        const res = await fetch(`/api/artist-info?artist=${encodeURIComponent(artistName)}`);
        const data = await res.json();
        // Last.fm bios often come with a link at the end; we clean that up
        const cleanBio = data.bio?.split('<a href')[0] || "Intelligence archives for this artist are currently restricted.";
        setBio(cleanBio);
      } catch (e) {
        setBio("Sync error: Could not retrieve artist dossier.");
      } finally {
        setLoading(false);
      }
    }
    fetchBio();
  }, [artistName]);

  if (loading) return <div className="animate-pulse text-zinc-500 uppercase font-black italic">Syncing Intel...</div>;

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <span className="bg-red-600/10 text-red-500 text-[10px] font-black px-2 py-1 rounded uppercase tracking-tighter">Verified Performer</span>
        <span className="bg-zinc-800 text-zinc-500 text-[10px] font-black px-2 py-1 rounded uppercase tracking-tighter">Live Dossier</span>
      </div>
      <p className="text-zinc-400 text-sm leading-relaxed font-medium">
        {bio}
      </p>
    </div>
  );
}
