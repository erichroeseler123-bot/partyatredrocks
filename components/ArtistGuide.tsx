'use client';
import { useEffect, useState } from 'react';

export default function ArtistGuide({ artistName }: { artistName: string }) {
  const [info, setInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInfo() {
      try {
        const res = await fetch(`/api/artist-info?artist=${encodeURIComponent(artistName)}`);
        const data = await res.json();
        setInfo(data);
      } catch (e) {
        console.error("Last.fm Fetch Failed");
      } finally {
        setLoading(false);
      }
    }
    fetchInfo();
  }, [artistName]);

  if (loading) return <div className="animate-pulse text-zinc-500 uppercase font-black italic">Syncing Intel...</div>;

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {info?.tags?.map((tag: string) => (
          <span key={tag} className="px-3 py-1 bg-red-600/10 border border-red-600/20 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-full">
            {tag}
          </span>
        ))}
      </div>
      <p className="text-zinc-400 text-sm leading-relaxed font-medium">
        {info?.bio || "Dispatch Intel Unavailable."}
      </p>
    </div>
  );
}
