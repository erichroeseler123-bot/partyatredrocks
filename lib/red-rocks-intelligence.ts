import "server-only";
import { loadShows2026, type Show2026 } from "./shows-2026";

export type PlanningLevel = "normal" | "watch" | "elevated";

export type VenueForecast = {
  available: boolean;
  name?: string;
  temperature?: number;
  temperatureUnit?: string;
  shortForecast?: string;
  windSpeed?: string;
  windDirection?: string;
  updatedAt?: string;
};

export type VenueAlert = {
  id: string;
  event: string;
  headline: string;
  severity: string;
  urgency: string;
  areaDesc: string;
  ends?: string;
};

export type EventContext = {
  available: boolean;
  artist?: string;
  slug?: string;
  date?: string;
  dateKey?: string;
  timeLabel?: string;
  isToday: boolean;
};

export type RedRocksIntelligence = {
  generatedAt: string;
  venue: {
    name: "Red Rocks Amphitheatre";
    latitude: number;
    longitude: number;
  };
  event: EventContext;
  forecast: VenueForecast;
  alerts: VenueAlert[];
  planning: {
    level: PlanningLevel;
    label: string;
    summary: string;
    reasons: string[];
    weatherDerived: true;
    transportationStatusChanged: false;
  };
  officialRoadConditions: {
    provider: "CDOT COtrip";
    url: string;
    verifiedByThisFeed: false;
  };
  sources: Array<{ name: string; url: string; role: string }>;
  degraded: boolean;
};

const VENUE = {
  name: "Red Rocks Amphitheatre" as const,
  latitude: 39.6654,
  longitude: -105.2057,
};

const NWS_BASE = "https://api.weather.gov";
const NWS_HEADERS = {
  Accept: "application/geo+json, application/ld+json, application/json",
  "User-Agent": "PartyAtRedRocks/1.0 (https://www.partyatredrocks.com; live-intelligence)",
};

const WEATHER_TERMS = [
  "thunderstorm",
  "lightning",
  "snow",
  "hail",
  "freezing",
  "ice",
  "high wind",
  "strong wind",
  "dense fog",
  "heavy rain",
];

const SEVERE_EVENTS = [
  "warning",
  "severe thunderstorm",
  "tornado",
  "flash flood",
  "winter storm",
  "blizzard",
  "high wind",
];

type JsonRecord = Record<string, any>;

async function fetchJson(url: string): Promise<JsonRecord | null> {
  try {
    const response = await fetch(url, {
      headers: NWS_HEADERS,
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return null;
    return (await response.json()) as JsonRecord;
  } catch {
    return null;
  }
}

function coloradoDateKey(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Denver",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function formatShowTime(dateValue?: string) {
  const match = dateValue?.match(/T(\d{2}):(\d{2})/);
  if (!match) return undefined;
  const hour = Number(match[1]);
  const minute = match[2];
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minute} ${suffix}`;
}

function getEventContext(): EventContext {
  try {
    const today = coloradoDateKey();
    const shows = loadShows2026()
      .filter((show: Show2026) => !show.isGhostEvent && show.date?.slice(0, 10) >= today)
      .sort((a, b) => a.date.localeCompare(b.date));
    const show = shows[0];
    if (!show) return { available: false, isToday: false };
    const dateKey = show.date.slice(0, 10);
    return {
      available: true,
      artist: show.artist,
      slug: show.slug,
      date: show.date,
      dateKey,
      timeLabel: formatShowTime(show.date),
      isToday: dateKey === today,
    };
  } catch {
    return { available: false, isToday: false };
  }
}

async function getVenueForecast(): Promise<VenueForecast> {
  const point = await fetchJson(`${NWS_BASE}/points/${VENUE.latitude},${VENUE.longitude}`);
  const forecastUrl = point?.properties?.forecastHourly as string | undefined;
  if (!forecastUrl) return { available: false };
  const forecast = await fetchJson(forecastUrl);
  const current = forecast?.properties?.periods?.[0];
  if (!current) return { available: false };
  return {
    available: true,
    name: current.name,
    temperature: current.temperature,
    temperatureUnit: current.temperatureUnit,
    shortForecast: current.shortForecast,
    windSpeed: current.windSpeed,
    windDirection: current.windDirection,
    updatedAt: forecast?.properties?.updated,
  };
}

async function getVenueAlerts(): Promise<VenueAlert[]> {
  const data = await fetchJson(`${NWS_BASE}/alerts/active?point=${VENUE.latitude},${VENUE.longitude}`);
  const features = Array.isArray(data?.features) ? data.features : [];
  return features.slice(0, 8).map((feature: JsonRecord) => {
    const props = feature?.properties ?? {};
    return {
      id: String(feature?.id ?? props?.id ?? `${props?.event}-${props?.sent}`),
      event: String(props?.event ?? "Weather alert"),
      headline: String(props?.headline ?? props?.event ?? "National Weather Service alert"),
      severity: String(props?.severity ?? "Unknown"),
      urgency: String(props?.urgency ?? "Unknown"),
      areaDesc: String(props?.areaDesc ?? "Morrison, Colorado"),
      ends: props?.ends ? String(props.ends) : undefined,
    };
  });
}

function containsAny(value: string, terms: string[]) {
  const normalized = value.toLowerCase();
  return terms.some((term) => normalized.includes(term));
}

function buildPlanningSignal(forecast: VenueForecast, alerts: VenueAlert[], event: EventContext) {
  const significantAlerts = alerts.filter((alert) => {
    const text = `${alert.event} ${alert.headline}`;
    const severity = alert.severity.toLowerCase();
    return severity === "severe" || severity === "extreme" || containsAny(text, SEVERE_EVENTS);
  });
  const weatherWatch = forecast.available && containsAny(forecast.shortForecast ?? "", WEATHER_TERMS);

  const reasons: string[] = [];
  if (significantAlerts.length) {
    reasons.push(`${significantAlerts.length} active significant weather alert${significantAlerts.length === 1 ? "" : "s"} near Red Rocks`);
  }
  if (weatherWatch && forecast.shortForecast) {
    reasons.push(`current venue forecast: ${forecast.shortForecast}`);
  }

  let level: PlanningLevel = "normal";
  if (significantAlerts.length > 0 && weatherWatch) level = "elevated";
  else if (significantAlerts.length > 0 || weatherWatch) level = "watch";

  const timing = event.isToday ? "tonight" : "right now";
  const label = level === "elevated" ? "Elevated planning conditions" : level === "watch" ? "Conditions to watch" : "Normal planning signal";
  const summary = level === "elevated"
    ? `Weather near Red Rocks may make transportation planning more important ${timing}. This is a planning signal only; existing reservations and transportation status are not changed by this feed.`
    : level === "watch"
      ? `Some current weather signals near Red Rocks are worth watching ${timing}. This does not change transportation status or promise a traffic condition.`
      : `No major weather-derived transportation planning signal is visible near Red Rocks ${timing}. Conditions and traffic can still change quickly.`;

  return {
    level,
    label,
    summary,
    reasons,
    weatherDerived: true as const,
    transportationStatusChanged: false as const,
  };
}

export async function getRedRocksIntelligence(): Promise<RedRocksIntelligence> {
  const event = getEventContext();
  const [forecastResult, alertsResult] = await Promise.allSettled([
    getVenueForecast(),
    getVenueAlerts(),
  ]);

  const forecast: VenueForecast = forecastResult.status === "fulfilled" ? forecastResult.value : { available: false };
  const alerts: VenueAlert[] = alertsResult.status === "fulfilled" ? alertsResult.value : [];

  return {
    generatedAt: new Date().toISOString(),
    venue: VENUE,
    event,
    forecast,
    alerts,
    planning: buildPlanningSignal(forecast, alerts, event),
    officialRoadConditions: {
      provider: "CDOT COtrip",
      url: "https://www.cotrip.org/",
      verifiedByThisFeed: false,
    },
    sources: [
      { name: "National Weather Service", url: "https://www.weather.gov/", role: "venue forecast and weather alerts" },
      { name: "CDOT COtrip", url: "https://www.cotrip.org/", role: "official roadway conditions and restrictions" },
    ],
    degraded: forecastResult.status === "rejected" || alertsResult.status === "rejected" || !forecast.available,
  };
}
