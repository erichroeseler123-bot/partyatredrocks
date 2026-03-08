import type { Metadata } from "next";
import Link from "next/link";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Dead & Company at Red Rocks | Event Guide and Shuttle Planning",
  description:
    "Dead & Company planning guide for Red Rocks nights: arrival windows, weather/layer notes, and pre-booked return transport strategy.",
  alternates: { canonical: `${SITE}/dead-and-company-red-rocks` },
};

export default function DeadAndCompanyRedRocksPage() {
  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap max-w-4xl mx-auto">
        <div className="comic-hero text-center">
          <div className="comic-kicker">Special Event Guide</div>
          <h1 className="comic-title">Dead & Company at Red Rocks</h1>
          <p className="comic-copy text-xl mt-4">
            High-demand jam nights at Red Rocks require a full operating plan: timing, layers, parking tradeoffs, and
            guaranteed return transport.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 mt-8">
            <Link href="/find?venue=red-rocks-amphitheatre&qty=2" className="comic-btn comic-btn-primary min-w-[240px] text-center">
              Book Shuttle Ride →
            </Link>
            <Link href="/scene/jam" className="comic-btn comic-btn-secondary min-w-[240px] text-center">
              Back to Jam Scene
            </Link>
          </div>
        </div>

        <section className="comic-grid mt-8">
          <article className="comic-panel">
            <div className="comic-tag">Arrival Strategy</div>
            <ul className="comic-copy mt-4 space-y-2 list-disc pl-6">
              <li>Target arrival 2.5 to 3.5 hours before showtime on peak nights.</li>
              <li>Lower lots fill earliest and reduce stair effort later in the night.</li>
              <li>Lock your meetup and return trigger before doors.</li>
            </ul>
          </article>

          <article className="comic-panel">
            <div className="comic-tag">What Changes the Night</div>
            <ul className="comic-copy mt-4 space-y-2 list-disc pl-6">
              <li>Weather shifts can add friction at both ingress and egress.</li>
              <li>Encore close creates the sharpest pickup congestion window.</li>
              <li>Group coordination failures usually happen after final set break.</li>
            </ul>
          </article>

          <article className="comic-panel">
            <div className="comic-tag">Transport Execution</div>
            <ul className="comic-copy mt-4 space-y-2 list-disc pl-6">
              <li>Pre-booked return transport protects against rideshare surge spikes.</li>
              <li>Use one coordinator contact for all ride updates.</li>
              <li>Build a fallback regroup point in case of crowd separation.</li>
            </ul>
            <div className="mt-6">
              <Link href="/find?venue=red-rocks-amphitheatre&qty=2" className="comic-btn comic-btn-primary w-full text-center">
                Reserve Return Ride
              </Link>
            </div>
          </article>
        </section>

        <section className="comic-panel mt-8 text-center">
          <h2 className="comic-h3">Complete Your Plan</h2>
          <p className="comic-copy mt-4">
            Build from weather, arrival timing, and transport in that order. That sequence avoids most Red Rocks show-night failures.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
            <Link href="/red-rocks/weather" className="comic-btn comic-btn-secondary min-w-[220px]">
              Weather Guide
            </Link>
            <Link href="/red-rocks/best-time-to-arrive" className="comic-btn comic-btn-secondary min-w-[220px]">
              Best Time to Arrive
            </Link>
            <Link href="/find?venue=red-rocks-amphitheatre&qty=2" className="comic-btn comic-btn-primary min-w-[220px]">
              Book Ride
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
