import Link from 'next/link';

export default function RelatedGuides() {
  const guides = [
    { title: "Parking Hacks", slug: "/guide/logistics/parking-lots", desc: "Avoid the 380-stair climb." },
    { title: "Sold-Out Prep", slug: "/guide/logistics/sold-out-survival", desc: "Beat the $150 Uber surge." },
    { title: "Bag Rules", slug: "/guide/logistics/bag-policy", desc: "Know the 2026 single-pocket rule." },
  ];

  return (
    <div className="mt-20 pt-10 border-t border-zinc-800">
      <h3 className="text-xl font-black uppercase italic mb-8">More Red Rocks Intelligence</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {guides.map((guide) => (
          <Link key={guide.slug} href={guide.slug} className="block p-6 bg-zinc-950 border border-zinc-800 rounded-3xl hover:border-red-600 transition group">
            <div className="font-black uppercase text-red-600 group-hover:text-red-500 transition">{guide.title}</div>
            <div className="text-sm text-zinc-500 mt-1">{guide.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
