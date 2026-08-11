import Link from "next/link";
import { buildBookingHref } from "@/lib/parrHandoff";

export default function SoldOutSurvival() {
  const privateHref = buildBookingHref({
    target: "private",
    venue: "red-rocks-amphitheatre",
  });

  const survivalSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Red Rocks Sold-Out Show Survival Guide 2026",
    description:
      "How to plan parking, rideshare, private transportation, arrival timing, and your ride home for high-demand Red Rocks concerts in 2026.",
    author: { "@type": "Organization", name: "Party at Red Rocks" },
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(survivalSchema) }} />

      <h1 className="text-5xl font-black mb-6 leading-tight">
        Sold-Out Survival: <span className="text-[#4cc9f0]">Have Your Red Rocks Exit Plan Before the Show</span>
      </h1>

      <p className="text-xl text-strong mb-12 leading-relaxed">
        High-demand Red Rocks nights put more pressure on roads, parking, rideshare pickup, and post-show transportation.
        The safest planning move is simple: decide how your group is getting there and getting home before you arrive at the venue.
      </p>

      <section className="mb-12 bg-surface text-white p-8 rounded-3xl shadow-2xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
        <h2 className="mb-3 text-2xl font-black">What changes on a sold-out night</h2>
        <div className="grid gap-5 md:grid-cols-2 text-base border-t border-slate-700 pt-6">
          <div>
            <p className="font-bold text-lg">Parking and road traffic</p>
            <p className="mt-2 text-slate-300">Expect more competition for convenient parking and more congestion around arrival and departure windows.</p>
          </div>
          <div>
            <p className="font-bold text-lg">Rideshare demand</p>
            <p className="mt-2 text-slate-300">Uber and Lyft pricing, ETAs, and pickup availability can change quickly when thousands of people leave at once.</p>
          </div>
          <div>
            <p className="font-bold text-lg">Meeting your group</p>
            <p className="mt-2 text-slate-300">Set a meeting point before the show. Cell service, crowds, and moving pickup instructions can make last-minute coordination harder.</p>
          </div>
          <div>
            <p className="font-bold text-lg">Weather and walking</p>
            <p className="mt-2 text-slate-300">Red Rocks involves elevation changes and outdoor walking, so check the forecast and wear footwear you can comfortably walk in.</p>
          </div>
        </div>
      </section>

      <h2 className="text-3xl font-bold mb-6">A better sold-out-night plan</h2>
      <ul className="space-y-4 mb-12">
        <li className="flex items-start">
          <span className="mr-3 rounded bg-[#3df3ff]/16 p-1 text-[#4cc9f0]">✔</span>
          <span><strong>Choose transportation before show day.</strong> Do not make the ride home the last unsolved part of the night.</span>
        </li>
        <li className="flex items-start">
          <span className="mr-3 rounded bg-[#3df3ff]/16 p-1 text-[#4cc9f0]">✔</span>
          <span><strong>Leave buffer for traffic.</strong> High-demand events can make normal Denver-to-Morrison travel times less predictable.</span>
        </li>
        <li className="flex items-start">
          <span className="mr-3 rounded bg-[#3df3ff]/16 p-1 text-[#4cc9f0]">✔</span>
          <span><strong>Know your return plan.</strong> If you are driving or ridesharing, decide where your group will regroup after the encore.</span>
        </li>
        <li className="flex items-start">
          <span className="mr-3 rounded bg-[#3df3ff]/16 p-1 text-[#4cc9f0]">✔</span>
          <span><strong>For a private ride, keep one vehicle for the night.</strong> Party at Red Rocks offers a $399 private Suburban and a $599 private van; the vehicle waits through the show.</span>
        </li>
      </ul>

      <div className="rounded-3xl border border-[#3df3ff]/30 bg-[linear-gradient(180deg,rgba(61,243,255,0.18),rgba(29,191,211,0.16))] p-10 text-center text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
        <h2 className="text-white text-3xl font-black mb-4 uppercase">Lock In the Ride Before the Crowd</h2>
        <p className="text-lg mb-8 max-w-xl mx-auto">
          Private Suburban $399 or private van $599. Door-to-door for your group, no shared passengers, and your vehicle waits through the show.
        </p>
        <Link href={privateHref} className="inline-block rounded-full bg-[#3df3ff] px-10 py-4 text-xl font-black text-[#08111e] transition hover:bg-[#62f6ff] shadow-lg">
          Book Private Ride
        </Link>
      </div>
    </div>
  );
}
