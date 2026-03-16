import { CloudSun, Clock3, MapPinned, Wind } from "lucide-react";
import { getWeather } from "@/lib/weather";
import { GuideLocalTime } from "@/components/guide/GuideLocalTime";

export async function GuideLocalInfo() {
  const weather = await getWeather();

  return (
    <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(20,16,12,0.96),rgba(10,10,10,0.98))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.42)]">
      <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#f5c66c]">
        Local Snapshot
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
          <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-white/50">
            <Clock3 className="h-4 w-4 text-[#f5c66c]" />
            Current Time
          </div>
          <div className="mt-3 text-lg font-black text-white">
            <GuideLocalTime />
          </div>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
          <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-white/50">
            <MapPinned className="h-4 w-4 text-[#f5c66c]" />
            Time Zone
          </div>
          <div className="mt-3 text-lg font-black text-white">Mountain Time</div>
          <div className="mt-1 text-sm text-white/60">America/Denver</div>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
          <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-white/50">
            <CloudSun className="h-4 w-4 text-[#f5c66c]" />
            Current Weather
          </div>
          {weather?.current ? (
            <>
              <div className="mt-3 text-lg font-black text-white">{weather.current.temp}°F at Red Rocks</div>
              <div className="mt-1 flex items-center gap-2 text-sm text-white/60">
                <Wind className="h-4 w-4" />
                {Math.round(weather.current.wind)} mph wind
              </div>
            </>
          ) : (
            <div className="mt-3 text-sm text-white/60">Weather unavailable right now.</div>
          )}
        </div>
      </div>
    </section>
  );
}

