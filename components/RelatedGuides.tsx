import Link from 'next/link';

interface RelatedGuide {
  slug: string;
  title: string;
  desc: string;
  category: 'logistics' | 'local' | 'events';
}

const relatedMap: Record<string, RelatedGuide[]> = {
  'crankdat-march-27': [
    { slug: 'winter-survival', title: 'Winter Survival Guide', desc: 'March is freezing. Gear list included.', category: 'logistics' },
    { slug: 'shuttle-vs-westracks-2026', title: 'vs. Westracks Public', desc: 'Why public transit fails for night shows.', category: 'logistics' },
  ],
  'default': [
    { slug: 'parking-lots', title: 'Parking Lot Guide', desc: 'The "Top Circle" drop-off advantage.', category: 'logistics' },
    { slug: 'bag-policy', title: '2026 Bag Rules', desc: 'New venue security standards.', category: 'logistics' },
  ]
};

export default function RelatedGuides({ currentSlug }: { currentSlug: string }) {
  const suggestions = relatedMap[currentSlug] || relatedMap['default'];

  return (
    <div className="mt-16 pt-12 border-t border-soft">
      <h3 className="text-2xl font-black uppercase text-white mb-8 italic tracking-tighter text-left">Intelligence Cluster</h3>
      <div className="grid md:grid-cols-2 gap-6 text-left">
        {suggestions.map((item) => (
          <Link
            key={item.slug}
            href={`/guide/${item.category}/${item.slug}`}
            className="group block p-6 bg-surface rounded-3xl border border-soft hover:border-red-600 transition shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >
            <h4 className="font-black uppercase text-red-600 mb-2 group-hover:text-red-500 transition">{item.title} →</h4>
            <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
