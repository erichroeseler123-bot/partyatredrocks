// STOP if we are on the show page
if (window.location.pathname.endsWith("show.html")) {
  console.log("Show page detected — skipping calendar render");
  return;
}
/**
 * Party At Red Rocks — DCC Frontend
 * --------------------------------
 * Responsibilities:
 * 1. Fetch live 2026 Red Rocks events from DCC
 * 2. Render calendar + event list
 * 3. Handle navigation to show pages
 * 4. Keep sidebar persistent
 */

const DCC_EVENTS_API =
  "https://dcc-redrocks-2026.denverairportpickup.workers.dev/api/dcc/red-rocks/2026/events";

/**
 * Fetch events from DCC
 */
async function fetchEvents() {
  const res = await fetch(DCC_EVENTS_API);
  if (!res.ok) throw new Error("Failed to load DCC events");
  const data = await res.json();
  return data.events || [];
}

/**
 * Render event list (used on index + calendar clicks)
 */
function renderEventList(events) {
  const container = document.getElementById("event-list");
  if (!container) return;

  container.innerHTML = "";

  events.forEach((event) => {
    const el = document.createElement("div");
    el.className = "event-row";
    el.innerHTML = `
      <strong>${event.artist}</strong><br/>
      ${event.date} (${event.dayOfWeek})<br/>
      <button data-event="${event.eventId}">View Show</button>
    `;

    el.querySelector("button").onclick = () => {
      window.location.href = `/show.html?eventId=${event.eventId}`;
    };

    container.appendChild(el);
  });
}

/**
 * Load show detail page
 */
async function loadShowPage() {
  const params = new URLSearchParams(window.location.search);
  const eventId = params.get("eventId");
  if (!eventId) return;

  const events = await fetchEvents();
  const event = events.find((e) => e.eventId === eventId);
  if (!event) return;

  // Sidebar (persistent)
  document.getElementById("sidebar").innerHTML = `
    <h2>${event.artist}</h2>
    <p>${event.date} (${event.dayOfWeek})</p>
    <img src="${event.image}" style="width:100%;border-radius:6px;" />
    <p><a href="${event.ticketUrl}" target="_blank">View Tickets</a></p>
  `;

  // Main content
  document.getElementById("main").innerHTML = `
    <h1>Book Transportation</h1>

    <div class="booking-card">
      <h3>$59 Party Shuttle</h3>
      <p>Shared party shuttle to Red Rocks</p>
      <button>Book Shuttle</button>
    </div>

    <div class="booking-card">
      <h3>$499 Private Suburban</h3>
      <p>Private SUV (up to 7 passengers)</p>
      <button>Book Suburban</button>
    </div>
  `;
}

/**
 * Entry
 */
document.addEventListener("DOMContentLoaded", async () => {
  try {
    if (document.getElementById("event-list")) {
      const events = await fetchEvents();
      renderEventList(events);
    }

    if (document.getElementById("sidebar")) {
      loadShowPage();
    }
  } catch (err) {
    console.error(err);
  }
});
