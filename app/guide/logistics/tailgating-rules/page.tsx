export default function TailgatingRules() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-black mb-6">Tailgating at Red Rocks: 2026 Rules & Hacks</h1>
      
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-green-50 p-6 rounded-2xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <h3 className="text-green-800 font-bold mb-2">The "Do's"</h3>
          <ul className="list-disc ml-5 space-y-2">
            <li>Tailgate directly behind your vehicle only.</li>
            <li>Use 1-gallon clear plastic bags for food (Venue Rule).</li>
            <li>Keep it small; lots are for parking, not parties.</li>
          </ul>
        </div>
        <div className="rounded-2xl bg-[#3df3ff]/10 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
          <h3 className="mb-2 font-bold text-[#4cc9f0]">The "Don'ts"</h3>
          <ul className="list-disc ml-5 space-y-2 text-soft">
            <li>No glass bottles (Strictly enforced).</li>
            <li>No canopies or oversized sunshades.</li>
            <li>No personal grills in the Upper Lots.</li>
          </ul>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4 text-slate-900">Reddit-Sourced Fan Hacks</h2>
      <blockquote className="border-l-4 p-4 bg-slate-50 italic mb-8">
        "If you're in the Lower North lot, bring a collapsible wagon. The walk to the gate is longer than you think, even if you're tailgating near the entrance." — r/RedRocks
      </blockquote>

      <p className="rounded-2xl border border-[#3df3ff]/30 bg-[linear-gradient(180deg,rgba(61,243,255,0.18),rgba(29,191,211,0.16))] p-8 text-center text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
        <strong>The Ultimate Hack:</strong> Let us handle the gear. Our Sprinters have ample storage for your pre-show supplies.
      </p>
    </div>
  );
}
