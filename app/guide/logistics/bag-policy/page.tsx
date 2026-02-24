export default function BagPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-black mb-6">Red Rocks Bag Policy 2026: The "Single-Pocket" Rule</h1>
      <p className="text-xl text-strong mb-10">
        Don't get turned away at the gate. Red Rocks has updated their security protocols—multi-pocket 
        hiking backpacks are officially banned for 2026.
      </p>

      <div className="grid gap-8 mb-12">
        <div className="border-l-4 border-green-500 pl-6">
          <h3 className="text-xl font-bold">What IS Allowed:</h3>
          <ul className="list-disc ml-5 text-strong">
            <li><strong>Single-pocket</strong> bags (13” x 15” x 8” or smaller)</li>
            <li>Small purses and fanny packs (6” x 9” or smaller)</li>
            <li>Hydration packs (2L or smaller, emptied, max 1 extra pocket)</li>
            <li>Food in 1-gallon clear plastic bags</li>
          </ul>
        </div>

        <div className="border-l-4 border-red-500 pl-6">
          <h3 className="text-xl font-bold text-red-700">What IS NOT Allowed:</h3>
          <ul className="list-disc ml-5 text-strong">
            <li>Any bag with multiple pockets (backpacks, camelbaks with storage)</li>
            <li>Hard-sided coolers</li>
            <li>Umbrellas or Totems</li>
          </ul>
        </div>
      </div>

      <p className="bg-slate-100 p-6 rounded-2xl italic hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
        "All possessions must fit under your designated seat (18″ x 12″)." — 
        <a href="https://www.redrocksonline.com/plan-your-visit/permitted-prohibited-items/" target="_blank" className="underline font-bold">Official Red Rocks Rules</a>.
      </p>

      <div className="mt-12 bg-red-700 text-white p-8 rounded-2xl text-center shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
        <h2 className="text-white text-2xl mb-4">Need to store your "Prohibited" gear?</h2>
        <p className="mb-6 text-red-100">Our private SUV service allows you to keep your non-permitted items safely locked in the vehicle while you enjoy the show.</p>
        <button className="bg-white text-red-700 px-8 py-3 rounded-full font-bold">View SUV Options</button>
      </div>
    </div>
  );
}
