import { CloudMoon, CloudSun, Clock3, MapPinned, Sparkles, Wind } from "lucide-react";
import { GuideLocalTime } from "@/components/guide/GuideLocalTime";
import { getWeather } from "@/lib/weather";

export type GuideLocalInfoVariant =
  | "general"
  | "transportation"
  | "parking"
  | "policies"
  | "show-night"
  | "tailgating";

const snapshotCopy: Record<
  GuideLocalInfoVariant,
  {
    title: string;
    description: string;
    liveTag: string;
    timeHint: string;
    zoneHint: string;
    weatherHint: string;
  }
> = {
  general: {
    title: "Know the night before you leave",
    description: "Real-time Denver mountain context for pickup timing, layers, and the walk back after the encore.",
    liveTag: "Updated live for Red Rocks planning",
    timeHint: "Show timing, weather, and traffic all move on Mountain Time.",
    zoneHint: "America/Denver for doors, weather swings, and pickup coordination.",
    weatherHint: "Use current conditions to plan layers and walkback comfort.",
  },
  transportation: {
    title: "Time your ride before the scramble starts",
    description: "Use the local clock and current conditions to avoid surge windows, pickup confusion, and cold waits after the encore.",
    liveTag: "Built for ride-planning decisions",
    timeHint: "Arrival and return timing matter more than the ride type brochure.",
    zoneHint: "America/Denver is the clock that matters for pickup windows.",
    weatherHint: "Weather changes how long people linger, regroup, and request rides.",
  },
  parking: {
    title: "Read the lot conditions before you commit",
    description: "Parking strategy gets worse when weather shifts, sunset hits, and the walkback feels longer than expected.",
    liveTag: "Useful for lot and walkback planning",
    timeHint: "Your lot options change quickly as the evening gets later.",
    zoneHint: "America/Denver governs doors, sunset timing, and exit traffic buildup.",
    weatherHint: "Cold, wind, and moisture make stairs and long walks feel much worse.",
  },
  policies: {
    title: "Get through the gate without preventable mistakes",
    description: "Use the local context to stay aligned on entry timing, weather-driven bag choices, and what you actually want to carry in.",
    liveTag: "Built for gate-readiness decisions",
    timeHint: "Late arrivals make screening and repacking much more painful.",
    zoneHint: "America/Denver is the timing reference for doors and entry lines.",
    weatherHint: "Weather matters because extra layers and gear often create gate friction.",
  },
  "show-night": {
    title: "Stay ahead of the pressure points",
    description: "Arrival, weather, and post-show extraction all tighten up at once. This panel keeps the key local context visible.",
    liveTag: "Built for the full show-night timeline",
    timeHint: "The best exit plan starts before the opener, not after encore.",
    zoneHint: "America/Denver keeps meetup plans and departure calls aligned.",
    weatherHint: "Weather shifts affect comfort, regroup speed, and ride-home timing.",
  },
  tailgating: {
    title: "Tailgate with the walk back in mind",
    description: "Great tailgates start with early arrival, but the real quality check is how the night feels once it gets colder and darker.",
    liveTag: "Built for tailgate timing and comfort",
    timeHint: "The earlier you stage, the easier it is to settle in without rushing.",
    zoneHint: "America/Denver matters for doors, sunset, and how long your setup window lasts.",
    weatherHint: "Wind and temperature swings decide whether a tailgate feels easy or exhausting.",
  },
};

function getWeatherLabel(code?: number) {
  if (typeof code !== "number") return "Live conditions";
  if (code === 0) return "Clear skies";
  if (code <= 3) return "Partly cloudy";
  if (code <= 48) return "Cloud cover";
  if (code <= 67) return "Rain moving through";
  if (code <= 77) return "Snow or ice";
  if (code <= 82) return "Showers nearby";
  if (code <= 86) return "Snow showers";
  if (code <= 99) return "Storm risk";
  return "Live conditions";
}

function SnapshotCard({
  icon,
  label,
  accent,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <div className="brand-card relative overflow-hidden rounded-[26px] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.28)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,91,46,0.12),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.1),transparent_28%)]" />
      <div className="relative">
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/12"
            style={{ backgroundColor: accent }}
          >
            {icon}
          </div>
          <div className="text-[11px] font-black uppercase tracking-[0.2em] text-white/55">{label}</div>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

export async function GuideLocalInfo({
  variant = "general",
}: {
  variant?: GuideLocalInfoVariant;
}) {
  const weather = await getWeather();
  const weatherLabel = getWeatherLabel(weather?.current?.condition);
  const copy = snapshotCopy[variant];

  return (
    <section className="brand-panel relative overflow-hidden rounded-[32px] p-6 shadow-[0_28px_100px_rgba(0,0,0,0.45)] sm:p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,91,46,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.14),transparent_26%)]" />
      <div className="relative">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--brand-orange)]/20 bg-[var(--brand-orange)]/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.22em] text-[var(--brand-orange)]">
              <Sparkles className="h-3.5 w-3.5" />
              Red Rocks Live Snapshot
            </div>
            <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">
              {copy.title}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/70 sm:text-base">
              {copy.description}
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-white/72">
            <CloudMoon className="h-4 w-4 text-[var(--brand-cyan)]" />
            {copy.liveTag}
          </div>
        </div>

        <div className="mt-7 grid gap-4 lg:grid-cols-[1.05fr_0.9fr_1.05fr]">
          <SnapshotCard
            icon={<Clock3 className="h-5 w-5 text-[var(--brand-orange)]" />}
            label="Current Time"
            accent="rgba(255,91,46,0.12)"
          >
            <div className="text-2xl font-black tracking-[-0.04em] text-white sm:text-3xl">
              <GuideLocalTime />
            </div>
            <div className="mt-2 text-sm text-white/60">{copy.timeHint}</div>
          </SnapshotCard>

          <SnapshotCard
            icon={<MapPinned className="h-5 w-5 text-[var(--brand-orange)]" />}
            label="Time Zone"
            accent="rgba(255,91,46,0.14)"
          >
            <div className="text-2xl font-black tracking-[-0.04em] text-white sm:text-3xl">Mountain Time</div>
            <div className="mt-2 text-sm text-white/60">{copy.zoneHint}</div>
          </SnapshotCard>

          <SnapshotCard
            icon={<CloudSun className="h-5 w-5 text-[var(--brand-cyan)]" />}
            label="Current Weather"
            accent="rgba(59,130,246,0.12)"
          >
            {weather?.current ? (
              <>
                <div className="flex items-end gap-3">
                  <div className="text-3xl font-black tracking-[-0.05em] text-white sm:text-4xl">
                    {weather.current.temp}°F
                  </div>
                  <div className="mb-1 rounded-full border border-white/12 bg-white/8 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-[var(--brand-cyan)]">
                    {weatherLabel}
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-sm text-white/60">
                  <Wind className="h-4 w-4" />
                  {Math.round(weather.current.wind)} mph wind at Red Rocks
                </div>
                <div className="mt-2 text-sm text-white/60">{copy.weatherHint}</div>
              </>
            ) : (
              <div className="text-sm text-white/60">Weather unavailable right now.</div>
            )}
          </SnapshotCard>
        </div>
      </div>
    </section>
  );
}
