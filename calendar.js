(async function () {
  const calendar = document.getElementById("calendar");
  const preview = document.getElementById("dcc-preview");
  const label = document.getElementById("month-label");

  if (!calendar || !preview || !label) {
    console.error("Missing required DOM elements");
    return;
  }

  let lockedEventId = null;

  const res = await fetch(
    "https://dcc-redrocks-2026.denverairportpickup.workers.dev/api/dcc/red-rocks/2026/events"
  );
  const data = await res.json();
  const events = data.events || [];

  let year = 2026;
  let month = 4; // May (0-based)

  function updateSidebar(event, locked = false) {
    preview.innerHTML = `
      <div class="dcc-event ${locked ? "locked" : ""}">
        <h3>${event.artist}</h3>
        <div class="dcc-date">${event.date} (${event.dayOfWeek})</div>
        <div class="dcc-venue">Red Rocks Amphitheatre</div>

        <a class="dcc-link" href="/show.html?eventId=${event.eventId}">
          View show →
        </a>

        <a class="dcc-ticket" href="${event.ticketUrl}" target="_blank">
          Buy tickets →
        </a>
      </div>
    `;
  }

  function clearSidebar() {
    if (lockedEventId) return;
    preview.innerHTML = `<div class="dcc-muted">Hover a show to preview</div>`;
  }

  function render() {
    calendar.innerHTML = "";

    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const offset = first.getDay();

    label.textContent = first.toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });

    const byDay = {};
    events.forEach((e) => {
      const d = new Date(e.date);
      if (d.getMonth() === month) {
        const day = d.getDate();
        if (!byDay[day]) byDay[day] = [];
        byDay[day].push(e);
      }
    });

    // Empty cells before month start
    for (let i = 0; i < offset; i++) {
      const empty = document.createElement("div");
      empty.className = "calendar-empty";
      calendar.appendChild(empty);
    }

    // Actual days
    for (let d = 1; d <= last.getDate(); d++) {
      const cell = document.createElement("div");
      cell.className = "calendar-day";

      cell.innerHTML = `<div class="day-number">${d}</div>`;

      (byDay[d] || []).forEach((event) => {
        const item = document.createElement("div");
        item.className = "calendar-event";
        item.textContent = event.artist;

        // 🔥 THIS IS WHAT YOU WERE ASKING ABOUT
        item.addEventListener("mouseenter", () => {
          if (!lockedEventId) updateSidebar(event);
        });

        item.addEventListener("mouseleave", () => {
          clearSidebar();
        });

        item.addEventListener("click", () => {
          lockedEventId = event.eventId;
          updateSidebar(event, true);
          window.location.href = `/show.html?eventId=${event.eventId}`;
        });

        cell.appendChild(item);
      });

      calendar.appendChild(cell);
    }
  }

  render();
})();
