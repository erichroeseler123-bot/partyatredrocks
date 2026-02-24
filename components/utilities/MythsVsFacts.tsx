// components/utilities/MythsVsFacts.tsx
export default function MythsVsFacts() {
  const items = [
    { myth: "Parking is easy", fact: "Lots fill 2+ hours early — shuttles avoid waits" },
    { myth: "Rideshares are cheap", fact: "Post-show surges hit $100+ — fixed $59 with us" },
    { myth: "Weather is always perfect", fact: "Nights drop 20°F — pack layers (see our guide)" },
    { myth: "Tailgating is unlimited", fact: "2-hour limit, no fires — plan accordingly" },
    { myth: "All bags OK", fact: "Clear 12x6x12 max — check prohibited items" },
  ];

  return (
    <div className="panel-soft rounded-2xl p-6 mb-10 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      <h3 className="text-xl font-black uppercase mb-4 tracking-tight">Red Rocks Myths vs Facts</h3>
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="grid grid-cols-2 gap-4 text-sm">
            <p className="text-red-400 font-bold">Myth: {item.myth}</p>
            <p className="text-soft">Fact: {item.fact}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-muted italic">Based on 2026 policies — always verify with venue.</p>
    </div>
  );
}
