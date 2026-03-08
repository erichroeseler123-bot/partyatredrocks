'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function GlobalSearch() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <section className="mb-16">
      <p className="mb-3 text-xs font-mono uppercase tracking-[0.35em] text-neon-blue font-bold italic">
        // Global_Intelligence_Query
      </p>
      <form onSubmit={handleSearch} className="flex w-full md:w-1/2 min-w-[320px] border border-zinc-700 bg-black/60 backdrop-blur-md">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="SEARCH ARTIST, VENUE, OR CARRIER" 
          className="flex-grow bg-transparent px-5 py-4 text-sm font-mono uppercase tracking-widest text-white placeholder-zinc-500 focus:outline-none"
        />
        <button type="submit" className="px-8 bg-neon-blue text-black font-black uppercase tracking-widest text-sm hover:bg-surface/40 transition-colors">
          SEARCH →
        </button>
      </form>
    </section>
  );
}
