'use client';
import { useEffect, useState } from 'react';

export default function SetlistDisplay({ artistName }: { artistName: string }) {
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSetlist() {
      try {
        // Querying your internal DCC route that handles the Setlist.fm handshake
        const res = await fetch(`/api/setlist?artist=${encodeURIComponent(artistName)}`);
        const data = await res.json();
        setSongs(data.setlist || []);
      } catch (e) {
        console.error("Setlist fetch error");
      } finally {
        setLoading(false);
      }
    }
    fetchSetlist();
  }, [artistName]);

  if (loading) return <div className="text-faint uppercase font-black italic text-xs animate-pulse">Accessing archives...</div>;
  if (!songs.length) return <div className="text-faint italic uppercase font-black text-xs">No recent setlist intelligence found.</div>;

  return (
    <ul className="space-y-4">
      {songs.map((song, i) => (
        <li key={i} className="flex items-center gap-6 border-b border-soft pb-4 group hover:border-red-600/20 transition">
          <span className="text-faint font-black italic text-2xl group-hover:text-red-600/40 transition">{(i + 1).toString().padStart(2, '0')}</span>
          <span className="text-muted font-bold uppercase tracking-wider text-sm group-hover:text-white transition">{song.name}</span>
        </li>
      ))}
    </ul>
  );
}
