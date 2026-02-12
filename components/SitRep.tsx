export const runtime = "nodejs";

type CurrentWeather = {
  temperature: number;
  windspeed: number;
};

type WeatherResponse = {
  current_weather: CurrentWeather;
};

export default async function SitRep() {
  const res = await fetch(
    "https://api.open-meteo.com/v1/forecast?latitude=39.6654&longitude=-105.2057&current_weather=true&temperature_unit=fahrenheit",
    { next: { revalidate: 600 } }
  );

  if (!res.ok) {
    return (
      <div className="border border-white/10 p-4 bg-zinc-950/50 backdrop-blur-sm text-zinc-400">
        Weather unavailable
      </div>
    );
  }

  const data = (await res.json()) as WeatherResponse;
  const { temperature, windspeed } = data.current_weather;

  return (
    <div className="border border-white/10 p-4 bg-zinc-950/50 backdrop-blur-sm">
      <div className="text-xs uppercase tracking-widest text-zinc-400 mb-2">
        Situation Report
      </div>
      <div className="flex justify-between text-sm">
        <span>Temp</span>
        <span>{temperature}°F</span>
      </div>
      <div className="flex justify-between text-sm">
        <span>Wind</span>
        <span>{windspeed} mph</span>
      </div>
    </div>
  );
}
