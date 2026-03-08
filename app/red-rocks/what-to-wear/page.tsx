import Link from "next/link";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

export const metadata = {
  title: "What to Wear to Red Rocks Concert 2026 | Layering Guide",
  description:
    "Red Rocks Amphitheatre outfit and layering guide for 2026 shows. Seasonal packing list, weather tips, and why shuttle rides make packing easier.",
  alternates: { canonical: `${SITE}/red-rocks/what-to-wear` },
};

export default function RedRocksWhatToWearPage() {
  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap max-w-4xl mx-auto">
        <div className="comic-hero text-center">
          <div className="comic-kicker">Red Rocks Planning Guide</div>
          <h1 className="comic-title">What to Wear to Red Rocks Concert 2026</h1>
          <p className="comic-copy text-xl mt-4">
            Altitude plus open-air venue means big temperature swings. Use this layering guide for spring, summer,
            and fall shows.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 mt-8">
            <Link href="/find" className="comic-btn comic-btn-primary min-w-[220px] text-center">
              Book Shuttle Ride →
            </Link>
          </div>
        </div>

        <section className="comic-panel mt-12">
          <div className="comic-tag">Red Rocks Layering Essentials</div>
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div>
              <h3 className="font-bold text-lg">Base Layer</h3>
              <ul className="comic-copy mt-2 space-y-2">
                <li>Moisture-wicking shirt (short or long sleeve)</li>
                <li>Light hoodie or flannel for mid-layer</li>
                <li>Sunscreen (high altitude burns fast)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg">Outer Layer</h3>
              <ul className="comic-copy mt-2 space-y-2">
                <li>Waterproof/windproof jacket (rain common)</li>
                <li>Light puffy or fleece for cold nights</li>
                <li>Hat/beanie plus gloves for wind</li>
              </ul>
            </div>
          </div>
          <p className="comic-copy mt-6 text-center font-semibold">
            Temperatures can drop 20-30F after sunset, especially with wind.
          </p>
        </section>

        <section className="comic-panel mt-8">
          <div className="comic-tag">Seasonal Packing List</div>
          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <div className="comic-panel">
              <h3 className="font-bold text-center">Spring (Apr-May)</h3>
              <ul className="comic-copy mt-2 space-y-2 list-disc pl-6">
                <li>Waterproof jacket</li>
                <li>Long layers</li>
                <li>Closed-toe shoes (mud possible)</li>
                <li>Beanie/hat</li>
              </ul>
            </div>
            <div className="comic-panel">
              <h3 className="font-bold text-center">Summer (Jun-Aug)</h3>
              <ul className="comic-copy mt-2 space-y-2 list-disc pl-6">
                <li>Light base layer</li>
                <li>Light jacket for night</li>
                <li>Sunscreen/hat/sunglasses</li>
                <li>Comfortable walking shoes</li>
              </ul>
            </div>
            <div className="comic-panel">
              <h3 className="font-bold text-center">Fall (Sep-Oct)</h3>
              <ul className="comic-copy mt-2 space-y-2 list-disc pl-6">
                <li>Fleece/puffy jacket</li>
                <li>Gloves/beanie</li>
                <li>Waterproof layer</li>
                <li>Closed-toe shoes</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="comic-panel mt-8">
          <div className="comic-tag">Why Shuttle Makes Packing Easier</div>
          <p className="comic-copy mt-4">
            No car means less stress over parking and long post-show walks in cold or rain. Pre-booked return transport
            keeps your night simple.
          </p>
          <div className="flex justify-center mt-6">
            <Link href="/find" className="comic-btn comic-btn-primary">
              Book Weather-Proof Shuttle →
            </Link>
          </div>
        </section>

        <section className="comic-panel mt-12 text-center">
          <h2 className="comic-h3">Ready for Your Red Rocks Night?</h2>
          <p className="comic-copy mt-4">
            Check forecast, layer smart, and lock your ride early.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
            <Link href="/red-rocks/weather" className="comic-btn comic-btn-secondary min-w-[240px]">
              Back to Weather Guide →
            </Link>
            <Link href="/find" className="comic-btn comic-btn-primary min-w-[240px]">
              Book Ride Now →
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
