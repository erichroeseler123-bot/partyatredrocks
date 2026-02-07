import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";

type Show = {
  slug: string;
  artist: string;
  date: string;
  img?: string;
  venue: string;
  operational?: any;
};

// Load generated file ONCE
function getShows(): Show[] {
  const filePath = path.join(
    process.cwd(),
    "public/data/shows-2026.js"
  );

  const raw = fs.readFileSync(filePath, "utf8");

  // Remove window.RED_ROCKS_2026 =
  const json = raw
    .replace("window.RED_ROCKS_2026 =", "")
    .trim()
    .replace(/;$/, "");

  return JSON.parse(json);
}

export default function EventPage({
  params,
}: {
  params: { slug: string };
}) {
  const shows = getShows();

  const show = shows.find(
    (s) => s.slug === params.slug
  );

  if (!show) return notFound();

  const date = new Date(show.date);

  return (
    <div className="max-w-4xl mx-auto px-6 py-24 bg-black text-white">

      {/* TITLE */}
      <h1 className="text-5xl font-black uppercase italic mb-4">
        {show.artist}
      </h1>

      {/* DATE */}
      <p className="text-red-500 font-mono uppercase tracking-widest text-sm mb-6">
        {date.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
      </p>

      {/* IMAGE */}
      {show.img && (
        <img
          src={show.img}
          alt={show.artist}
          className="rounded-2xl mb-8 border border-zinc-800"
        />
      )}

      {/* VENUE */}
      <p className="text-zinc-400 mb-8">
        📍 {show.venue}
      </p>

      {/* BIO */}
      {show.operational?.bio && (
        <div className="mb-10">
          <h3 className="font-black uppercase mb-2">
            Artist Overview
          </h3>

          <p className="text-zinc-300 leading-relaxed">
            {show.operational.bio}
          </p>
        </div>
      )}

      {/* LOGISTICS */}
      {show.operational?.logistics && (
        <div className="mb-10">
          <h3 className="font-black uppercase mb-4">
            Show Intelligence
          </h3>

          <div className="grid md:grid-cols-2 gap-4 text-sm">

            <div>Group Size: {show.operational.logistics.avgGroupSize}</div>
            <div>Arrival: {show.operational.logistics.arrivalWave}</div>
            <div>Vehicle: {show.operational.logistics.vehicleBias}</div>
            <div>Alcohol: {show.operational.logistics.alcoholLikelihood}</div>
            <div>Parking: {show.operational.logistics.parkingAvoidance}</div>

          </div>
        </div>
      )}

      {/* CTA */}
      <div className="mt-12 p-6 border border-red-600 rounded-2xl text-center">

        <h3 className="font-black text-xl mb-3">
          Ride to This Show
        </h3>

        <p className="text-zinc-400 mb-4">
          $55 round trip · No parking · No stress
        </p>

        <a
          href="/book"
          className="inline-block bg-red-600 hover:bg-red-700 px-8 py-3 rounded-full font-bold transition"
        >
          Book Shuttle
        </a>

      </div>

    </div>
  );
}
