import { fetchJSON } from "@/lib/safeFetch";

type OpenMeteoResponse = {
  current_weather: {
    temperature: number;
    weathercode: number;
    windspeed: number;
  };
};

type OpenMeteoDailyResponse = {
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max?: number[];
  };
};

export async function getWeather() {
  try {
    const data = await fetchJSON<OpenMeteoResponse>(
      "https://api.open-meteo.com/v1/forecast?latitude=39.6654&longitude=-105.2057&current_weather=true&temperature_unit=fahrenheit",
      { next: { revalidate: 600 } }
    );

    return {
      current: {
        temp: Math.round(data.current_weather.temperature),
        condition: data.current_weather.weathercode,
        wind: data.current_weather.windspeed,
      },
    };
  } catch {
    return null;
  }
}

export async function getRedRocks7DayForecast(): Promise<
  Record<string, { highF: number; lowF: number; precipChance?: number }>
> {
  try {
    const data = await fetchJSON<OpenMeteoDailyResponse>(
      "https://api.open-meteo.com/v1/forecast?latitude=39.6654&longitude=-105.2057&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&temperature_unit=fahrenheit&forecast_days=7&timezone=America%2FDenver",
      { next: { revalidate: 1800 } }
    );

    const out: Record<string, { highF: number; lowF: number; precipChance?: number }> = {};
    const days = data.daily?.time ?? [];
    for (let i = 0; i < days.length; i += 1) {
      const dateKey = days[i];
      const highRaw = data.daily.temperature_2m_max?.[i];
      const lowRaw = data.daily.temperature_2m_min?.[i];
      if (typeof highRaw !== "number" || typeof lowRaw !== "number") continue;
      const precipRaw = data.daily.precipitation_probability_max?.[i];
      out[dateKey] = {
        highF: Math.round(highRaw),
        lowF: Math.round(lowRaw),
        precipChance:
          typeof precipRaw === "number" && Number.isFinite(precipRaw)
            ? Math.round(precipRaw)
            : undefined,
      };
    }
    return out;
  } catch {
    return {};
  }
}
