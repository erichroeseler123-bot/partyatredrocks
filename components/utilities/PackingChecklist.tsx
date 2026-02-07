// components/utilities/PackingChecklist.tsx

export default function PackingChecklist() {
  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 mb-10">
      <h3 className="text-xl font-black uppercase mb-4 tracking-tight">
        Quick Red Rocks Packing List
      </h3>

      <ul className="space-y-3 text-sm text-zinc-300">

        <li className="flex items-center gap-2">
          <span className="text-red-500">✓</span> Ticket + ID
        </li>

        <li className="flex items-center gap-2">
          <span className="text-red-500">✓</span> Clear bag (max 12x6x12")
        </li>

        <li className="flex items-center gap-2">
          <span className="text-red-500">✓</span> Layers (nights drop 20°F)
        </li>

        <li className="flex items-center gap-2">
          <span className="text-red-500">✓</span> Water bottle (empty, under 32oz)
        </li>

        <li className="flex items-center gap-2">
          <span className="text-red-500">✓</span> Sunscreen + hat
        </li>

        <li className="flex items-center gap-2">
          <span className="text-red-500">✓</span> Cash for merch / parking
        </li>

      </ul>

      <p className="mt-4 text-xs text-zinc-500 italic">
        See full prohibited items in our bag policy guide.
      </p>
    </div>
  );
}
