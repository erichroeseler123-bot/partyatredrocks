import { getRedRocksEvents } from "@/lib/redrocksEvents";
import RedRocksShowsGrid from "@/components/RedRocksShowsGrid";

export default function RedRocksPage() {
  const events = getRedRocksEvents();

  return (
    <main className="min-h-screen bg-surface text-white px-6 py-20">
      <header className="mb-12">
        <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tight">
          Red Rocks Amphitheatre
        </h1>

        <p className="text-zinc-400 max-w-2xl">
          Morrison, CO · Live events pulled from SeatGeek · Venue ID 196
        </p>
      </header>

      <section>
        <h2 className="text-3xl font-bold mb-8">
          Upcoming Shows
        </h2>

        <RedRocksShowsGrid events={events} />
      </section>
    </main>
  );
}
