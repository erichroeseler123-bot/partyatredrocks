import type { Metadata } from "next";
import { getRedRocksIntelligence } from "@/lib/red-rocks-intelligence";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Red Rocks Live Planning Intelligence | Party at Red Rocks",
  description: "Live Red Rocks event and weather planning intelligence for private transportation planning.",
  robots: {
    index: false,
    follow: false,
  },
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZoneName: "short",
  timeZone: "America/Denver",
});

const eventDateFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  timeZone: "America/Denver",
});

function formatTime(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return dateFormatter.format(date);
}

function formatEventDate(value?: string) {
  if (!value) return null;
  const dateKey = value.slice(0, 10);
  const date = new Date(`${dateKey}T12:00:00-06:00`);
  if (Number.isNaN(date.getTime())) return null;
  return eventDateFormatter.format(date);
}

export default async function RedRocksLivePage() {
  const intelligence = await getRedRocksIntelligence();
  const eventDate = formatEventDate(intelligence.event.date);

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <p className={styles.eyebrow}>Party at Red Rocks · live planning layer</p>
        <h1 className={styles.title}>What matters around Red Rocks right now?</h1>
        <p className={styles.intro}>
          A quiet planning layer that combines the existing Party at Red Rocks event calendar with public weather data near the venue. It does not change pricing, booking availability, reservations, pickup instructions, or transportation status.
        </p>

        <div className={styles.statusRow} aria-label="Intelligence feed status">
          <span className={styles.pill}>● Feed {intelligence.degraded ? "partially available" : "online"}</span>
          <span className={styles.pill}>No API key required</span>
          <span className={styles.pill}>Updated {formatTime(intelligence.generatedAt)}</span>
        </div>

        <section className={styles.heroGrid} aria-label="Current planning context">
          <article className={styles.eventCard}>
            <p className={styles.cardEyebrow}>{intelligence.event.isToday ? "Tonight at Red Rocks" : "Next Red Rocks event"}</p>
            {intelligence.event.available ? (
              <>
                <h2 className={styles.eventName}>{intelligence.event.artist}</h2>
                <p className={styles.eventMeta}>
                  {eventDate || intelligence.event.dateKey}
                  {intelligence.event.timeLabel ? ` · ${intelligence.event.timeLabel}` : ""}
                </p>
              </>
            ) : (
              <>
                <h2 className={styles.eventName}>Event data unavailable</h2>
                <p className={styles.eventMeta}>The live weather layer remains independent from event data.</p>
              </>
            )}
          </article>

          <article className={styles.signalCard} data-level={intelligence.planning.level}>
            <p className={styles.cardEyebrow}>Transportation planning signal</p>
            <h2 className={styles.signalTitle}>{intelligence.planning.label}</h2>
            <p className={styles.signalSummary}>{intelligence.planning.summary}</p>
            {intelligence.planning.reasons.length > 0 ? (
              <ul className={styles.reasons}>
                {intelligence.planning.reasons.map((reason) => <li key={reason}>{reason}</li>)}
              </ul>
            ) : null}
          </article>
        </section>

        <section className={styles.section} aria-labelledby="weather-heading">
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.cardEyebrow}>Morrison, Colorado</p>
              <h2 id="weather-heading" className={styles.sectionTitle}>Current venue weather</h2>
            </div>
            <p className={styles.sectionNote}>Public National Weather Service data near Red Rocks Amphitheatre.</p>
          </div>

          <div className={styles.weatherGrid}>
            <article className={styles.weatherCard}>
              {intelligence.forecast.available ? (
                <>
                  <div className={styles.weatherTop}>
                    <div>
                      <strong>{intelligence.forecast.shortForecast || "Forecast available"}</strong>
                      <p>{intelligence.forecast.name || "Current period"}</p>
                    </div>
                    {typeof intelligence.forecast.temperature === "number" ? (
                      <div className={styles.temperature}>{intelligence.forecast.temperature}°{intelligence.forecast.temperatureUnit}</div>
                    ) : null}
                  </div>
                  <p className={styles.weatherDetail}>
                    {intelligence.forecast.windDirection && intelligence.forecast.windSpeed
                      ? `Wind ${intelligence.forecast.windDirection} ${intelligence.forecast.windSpeed}`
                      : "Wind detail unavailable"}
                  </p>
                </>
              ) : (
                <>
                  <strong>Public forecast temporarily unavailable</strong>
                  <p className={styles.weatherDetail}>This does not affect Party at Red Rocks booking or transportation operations.</p>
                </>
              )}
            </article>

            <article className={styles.weatherCard}>
              <strong>Active venue-area alerts</strong>
              <div className={styles.alertCount}>{intelligence.alerts.length}</div>
              <p className={styles.weatherDetail}>
                {intelligence.alerts.length > 0
                  ? "NWS alerts currently intersect the Red Rocks point."
                  : "No active NWS alerts were returned for the venue point at this update."}
              </p>
            </article>
          </div>

          {intelligence.alerts.length > 0 ? (
            <div className={styles.alertList}>
              {intelligence.alerts.map((alert) => (
                <article className={styles.alertCard} key={alert.id}>
                  <div>
                    <strong>{alert.event}</strong>
                    <span>{alert.severity} · {alert.urgency}</span>
                  </div>
                  <p>{alert.headline}</p>
                </article>
              ))}
            </div>
          ) : null}
        </section>

        <section className={styles.roadBox} aria-labelledby="road-heading">
          <div>
            <p className={styles.cardEyebrow}>Road conditions</p>
            <h2 id="road-heading">CDOT remains the roadway authority.</h2>
            <p>
              This layer does not claim roads are open, closed, clear, delayed, or restricted. Official roadway status stays with CDOT COtrip.
            </p>
          </div>
          <a href={intelligence.officialRoadConditions.url} target="_blank" rel="noreferrer">Check COtrip ↗</a>
        </section>

        <section className={styles.machineBox} aria-labelledby="machine-heading">
          <h2 id="machine-heading">Machine-readable intelligence</h2>
          <p>
            The normalized feed is available at <code>/api/red-rocks-intelligence</code>. It is intentionally isolated from booking, payment, pricing, analytics, and reservation authority.
          </p>
        </section>

        <p className={styles.disclaimer}>
          Weather and alert information can change quickly. A weather-derived planning signal is informational only and never changes a Party at Red Rocks reservation, pickup plan, price, availability, or transportation status.
        </p>
      </div>
    </main>
  );
}
