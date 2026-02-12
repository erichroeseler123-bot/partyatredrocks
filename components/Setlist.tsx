'use client';
import { useEffect, useState } from 'react';

export default function Setlist({ artistName }: { artistName: string }) {
  const [songs, setSongs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSetlist() {
      try {
        const res = await fetch(`/api/setlists?artist=${encodeURIComponent(artistName)}`);
        const data = await res.json();
        setSongs(data.songs || []);
      } catch (err) {
        console.error("Setlist fetch failed");
      } finally {
        setLoading(false);
      }
    }
    fetchSetlist();
  }, [artistName]);

  if (loading) return <div className="text-zinc-500 text-xs animate-pulse italic">Scanning archives for setlists...</div>;
  if (songs.length === 0) return <div className="text-zinc-600 text-xs italic">Setlist data unavailable for this tour.</div>;

  return (
    <div className="bg-zinc-950/50 p-6 rounded-3xl border border-white/5 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      <h3 className="text-red-600 font-black uppercase text-[10px] tracking-[0.2em] mb-4">Probable Setlist</h3>
      <ul className="space-y-2">
        {songs.slice(0, 10).map((song, i) => (
          <li key={i} className="text-zinc-300 text-sm font-medium flex gap-3">
            <span className="text-zinc-600 font-mono text-[10px] w-4">{i + 1}</span>
            {song}
          </li>
        ))}
      </ul>
      <p className="text-[9px] text-zinc-600 mt-4 uppercase tracking-widest">Based on recent performances</p>
    </div>
  );
}
