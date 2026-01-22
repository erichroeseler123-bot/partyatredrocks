'use client';
import { useEffect, useState } from 'react';

export default function ArtistGuide({ artistName, venue }: { artistName: string, venue: string }) {
  const [guide, setGuide] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGuide() {
      try {
        const res = await fetch('/api/gemini-content', {
          method: 'POST',
          body: JSON.stringify({ artistName, venue }),
          headers: { 'Content-Type': 'application/json' }
        });
        const data = await res.json();
        setGuide(data.text);
      } catch (err) {
        console.error("Failed to load guide");
      } finally {
        setLoading(false);
      }
    }
    fetchGuide();
  }, [artistName, venue]);

  if (loading) return <div className="animate-pulse text-zinc-500 text-sm">Generating artist guide...</div>;

  return (
    <div className="prose prose-invert max-w-none">
      <p className="text-zinc-300 leading-relaxed italic">
        "{guide}"
      </p>
    </div>
  );
}
