import Link from "next/link";
import { GuideLocalInfo } from "@/components/guide/GuideLocalInfo";
import { GuideVisualHero } from "@/components/guide/GuideVisualHero";
import { guideVisuals } from "@/lib/guideVisuals";

export const metadata = {
  title: "Red Rocks Visiting Guide",
  description:
    "Core Red Rocks facts, visiting rules, trails, elevation, and practical planning basics before show night.",
  alternates: {
    canonical: "/guide/red-rocks-intelligence-hub",
  },
};

const sections = [
  {
    kicker: "Basic Facts",
    title: "Red Rocks at a glance",
    bullets: [
      "Location: near Morrison, Colorado, roughly 10 miles west of Denver.",
      "Elevation: about 6,435 feet above sea level.",
      "Capacity: about 9,525 seats.",
      "Opened as an amphitheatre: 1941.",
      "Owner: City and County of Denver.",
    ],
  },
  {
    kicker: "Geology",
    title: "Why the rocks are red",
    bullets: [
      "The rocks are part of the Fountain Formation, built from ancient sediment deposits.",
      "The red color mainly comes from iron oxide in the sandstone.",
      "Similar Front Range formations appear at Garden of the Gods and the Flatirons.",
    ],
  },
  {
    kicker: "Formation",
    title: "How the amphitheatre works naturally",
    bullets: [
      "The bowl shape is a result of uplift and erosion over millions of years.",
      "The best-known formations are Creation Rock, Ship Rock, and Stage Rock.",
      "The monoliths create the natural acoustic shell that makes the venue famous.",
    ],
  },
  {
    kicker: "Visiting",
    title: "Park access and timing",
    bullets: [
      "Park access is typically available from one hour before sunrise to one hour after sunset.",
      "On event days, amphitheatre areas may close in the afternoon for show preparation.",
      "Daytime park admission is usually free when no ticketed event restrictions apply.",
    ],
  },
  {
    kicker: "Trails",
    title: "Most useful trails",
    bullets: [
      "Trading Post Trail: short scenic loop through formations and meadows.",
      "Red Rocks Trail: multi-use route that connects with adjacent park systems.",
      "Funicular Trail: steeper route following the old incline alignment.",
      "Geologic Overlook Trail: short path to a viewpoint and interpretive markers.",
    ],
  },
  {
    kicker: "Practical",
    title: "Altitude and show-night reality",
    bullets: [
      "At this elevation, stairs feel harder and fatigue sets in faster.",
      "Sun exposure and dry air are stronger than many visitors expect.",
      "Hydration, layers, and a clear ride plan make the night smoother.",
    ],
  },
] as const;

const faqRows = [
  "How high is Red Rocks?",
  "Why are the rocks red?",
  "Can you visit Red Rocks without a concert ticket?",
  "Which trail should first-time visitors do?",
  "How many stairs are in the amphitheatre workout route?",
  "What should I plan for weather and altitude?",
  "Is camping allowed inside Red Rocks Park?",
  "What is the fastest way out after a show?",
];

export default function RedRocksIntelHubPage() {
  return (
    <main className="min-h-screen bg-surface px-6 py-20 text-white">
      <section className="mx-auto max-w-5xl">
        <GuideVisualHero
          eyebrow={guideVisuals.general.eyebrow}
          title="Red Rocks Visiting Guide"
          copy="Core Red Rocks facts, visiting rules, trails, and practical planning basics before show night."
          imageSrc={guideVisuals.general.imageSrc}
          imageAlt={guideVisuals.general.imageAlt}
          actions={
            <>
              <Link className="btn-primary" href="/shuttles">
                See Shuttle Options
              </Link>
              <Link className="btn-ghost" href="/week/red-rocks">
                Live Lineup
              </Link>
              <Link className="btn-ghost" href="/guide/red-rocks-faq">
                Venue FAQ
              </Link>
            </>
          }
        />

        <section className="mt-10">
          <GuideLocalInfo />
        </section>

        <section className="mt-10 grid gap-4 md:grid-cols-2">
          {sections.map((section) => (
            <article key={section.title} className="rounded-3xl border border-soft bg-surface-strong p-6">
              <div className="text-[11px] font-black uppercase tracking-[0.25em] text-[#ffb07c]">
                {section.kicker}
              </div>
              <h2 className="mt-3 text-2xl font-black tracking-tight">{section.title}</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-soft leading-relaxed">
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section className="mt-10 rounded-3xl border border-soft bg-surface-strong p-6 md:p-8">
          <h2 className="text-2xl font-black tracking-tight">Questions people ask first</h2>
          <div className="mt-5 grid gap-3">
            {faqRows.map((q) => (
              <div key={q} className="rounded-2xl border border-soft bg-surface/30 p-5 text-base font-black tracking-tight text-strong">
                {q}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-soft bg-surface-strong p-6 md:p-8">
          <h2 className="text-2xl font-black tracking-tight">Before show night</h2>
          <p className="mt-4 text-soft leading-relaxed">
            Once you know your date and venue plan, choose your ride option and book before show night.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link className="btn-primary" href="/book">
              Book a Ride
            </Link>
            <Link className="btn-ghost" href="/week/red-rocks">
              Upcoming Shows
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
