/**
 * calendar.js
 *
 * Responsibilities:
 * 1. Fetch live 2026 Red Rocks events from DCC Worker
 * 2. Render calendar cards
 * 3. Link each card → show.html?eventId=XXXX
 * 4. Update sidebar preview on hover
 */

(async function () {
  const calendarEl = document.getElementById("calendar");
  const sidebarPreview = document.getElementById("sidebar-preview");

  if (!calendarEl) {
    console.error("❌ calendar element not found");
    return;
  }

  const API_URL =
    "https://dcc-redrocks-2026.denverairportpickup.workers.dev/api/dcc/red-rocks/2026/events";

  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    if (!data.events || !data.events.length) {
      calendarEl.innerHTML = "<p>No confirmed events yet.</p>";
      return;
    }

    // Clear loading state
    calendarEl.innerHTML = "";

    data.events.forEach(event => {
      const card = document.createElement("a");
      card.className = "calendar-card";
      card.href = `/show.html?eventId=${event.eventId}`;

      card.innerHTML = `
        <div class="card-inner">
          <strong>${event.artist}</strong>
          <div class="date">
            ${event.date} (${event.dayOfWeek})
          </div>
        </div>
      `;

      /**
       * HOVER → update sidebar preview
       * (NO booking buttons here by design)
       */
      card.addEventListener("mouseenter", () => {
        if (!sidebarPreview) return;

        sidebarPreview.innerHTML = `
          <h3>${event.artist}</h3>
          <p><strong>${event.date}</strong> (${event.dayOfWeek})</p>
          <p>Venue: Red Rocks Amphitheatre</p>
          <p class="muted">Click to view show details and booking options.</p>
        `;
      });

      /**
       * MOUSE LEAVE → reset sidebar
       */
      card.addEventListener("mouseleave", () => {
        if (!sidebarPreview) return;

        sidebarPreview.innerHTML = `
          <p><strong>No show selected yet.</strong></p>
        `;
      });

      calendarEl.appendChild(card);
    });
  } catch (err) {
    console.error("❌ Failed to load events", err);
    calendarEl.innerHTML =
      "<p>Failed to load events. Please try again later.</p>";
  }
})();
