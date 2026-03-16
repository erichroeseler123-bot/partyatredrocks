import { CloudMoon, CloudSun, Clock3, MapPinned, Sparkles, Wind } from "lucide-react";
import { GuideLocalTime } from "@/components/guide/GuideLocalTime";
import { getWeather } from "@/lib/weather";

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
    <div className="relative overflow-hidden rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.28)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,198,108,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(61,243,255,0.12),transparent_28%)]" />
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

export async function GuideLocalInfo() {
  const weather = await getWeather();
  const weatherLabel = getWeatherLabel(weather?.current?.condition);

  return (
    <section className="relative overflow-hidden rounded-[32px] border border-[#f5c66c]/18 bg-[linear-gradient(180deg,rgba(20,16,12,0.97),rgba(7,7,8,0.99))] p-6 shadow-[0_28px_100px_rgba(0,0,0,0.45)] sm:p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,198,108,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(61,243,255,0.14),transparent_26%)]" />
      <div className="relative">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#f5c66c]/20 bg-[#f5c66c]/8 px-3 py-1 text-[11px] font-black uppercase tracking-[0.22em] text-[#f5c66c]">
              <Sparkles className="h-3.5 w-3.5" />
              Red Rocks Live Snapshot
            </div>
            <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">
              Know the night before you leave
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/70 sm:text-base">
              Real-time Denver mountain context for pickup timing, layers, and the walk back after the encore.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-white/72">
            <CloudMoon className="h-4 w-4 text-[#8fd0ff]" />
            Updated live for Red Rocks planning
          </div>
        </div>

        <div className="mt-7 grid gap-4 lg:grid-cols-[1.05fr_0.9fr_1.05fr]">
          <SnapshotCard
            icon={<Clock3 className="h-5 w-5 text-[#f5c66c]" />}
            label="Current Time"
            accent="rgba(245,198,108,0.12)"
          >
            <div className="text-2xl font-black tracking-[-0.04em] text-white sm:text-3xl">
              <GuideLocalTime />
            </div>
            <div className="mt-2 text-sm text-white/60">Concert timing shifts fast when traffic stacks up.</div>
          </SnapshotCard>

          <SnapshotCard
            icon={<MapPinned className="h-5 w-5 text-[#f5c66c]" />}
            label="Time Zone"
            accent="rgba(255,176,124,0.14)"
          >
            <div className="text-2xl font-black tracking-[-0.04em] text-white sm:text-3xl">Mountain Time</div>
            <div className="mt-2 text-sm text-white/60">America/Denver for doors, weather swings, and pickup coordination.</div>
          </SnapshotCard>

          <SnapshotCard
            icon={<CloudSun className="h-5 w-5 text-[#3df3ff]" />}
            label="Current Weather"
            accent="rgba(61,243,255,0.12)"
          >
            {weather?.current ? (
              <>
                <div className="flex items-end gap-3">
                  <div className="text-3xl font-black tracking-[-0.05em] text-white sm:text-4xl">
                    {weather.current.temp}°F
                  </div>
                  <div className="mb-1 rounded-full border border-white/12 bg-white/8 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-[#8fd0ff]">
                    {weatherLabel}
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-sm text-white/60">
                  <Wind className="h-4 w-4" />
                  {Math.round(weather.current.wind)} mph wind at Red Rocks
                </div>
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
