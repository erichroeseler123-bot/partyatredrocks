'use client';
import { useEffect, useState, useRef } from 'react';

export default function ArtistGuide({ artistName, venue }: { artistName: string, venue: string }) {
  const [guide, setGuide] = useState('');
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

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

  // Check if text is long enough to need a "Read More" button
  useEffect(() => {
    if (textRef.current) {
      const isTruncated = textRef.current.scrollHeight > textRef.current.clientHeight;
      setShowButton(isTruncated);
    }
  }, [guide]);

  if (loading) return <div className="animate-pulse text-zinc-500 text-sm italic">Gathering intel on {artistName}...</div>;

  return (
    <div className="space-y-4">
      <div 
        ref={textRef}
        className={`text-zinc-300 leading-relaxed whitespace-pre-wrap italic transition-all duration-500 ${!isExpanded ? 'line-clamp-3' : ''}`}
      >
        {guide}
      </div>
      
      {showButton && (
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-red-600 text-xs font-black uppercase tracking-widest hover:text-white transition-colors"
        >
          {isExpanded ? 'Show Less ↑' : 'Read More ↓'}
        </button>
      )}
    </div>
  );
}
