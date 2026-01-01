(async function () {
  console.log("calendar.js loaded");

  const calendar = document.getElementById("calendar");
  const preview = document.getElementById("dcc-preview");
  const label = document.getElementById("month-label");
  const prevBtn = document.getElementById("prevMonth");
  const nextBtn = document.getElementById("nextMonth");

  if (!calendar || !label) {
    console.error("Calendar DOM missing");
    return;
  }

  let year = 2026;
  let month = 4; // May (0-based)
  let events = [];
  let lockedEventId = null;

  async function loadEvents() {
    const res = await fetch(
      "https://dcc-redrocks-2026.denverairportpickup.workers.dev/api/dcc/redrocks"
    );
    const data = await res.json();
    events = data.events || [];
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

    // Empty offset cells
    for (let i = 0; i < offset; i++) {
      const empty = document.createElement("div");
      empty.className = "day empty";
      calendar.appendChild(empty);
    }

    // Group events by day
    const byDay = {};
    events.forEach((e) => {
      const d = new Date(e.date);
      if (d.getFullYear() === year && d.getMonth() === month) {
        const day = d.getDate();
        byDay[day] = byDay[day] || [];
        byDay[day].push(e);
      }
    });

    for (let d = 1; d <= last.getDate(); d++) {
      const cell = document.createElement("div");
      cell.className = "day";
      cell.innerHTML = `<div class="num">${d}</div>`;

      (byDay[d] || []).forEach((event) => {
        const item = document.createElement("div");
        item.className = "event";
        item.textContent = event.artist;

        item.addEventListener("mouseenter", () => {
          if (!lockedEventId) updateSidebar(event);
        });

        item.addEventListener("click", () => {
          lockedEventId = event.eventId;
          updateSidebar(event, true);
        });

        cell.appendChild(item);
      });

      calendar.appendChild(cell);
    }
  }

  function updateSidebar(event, locked = false) {
    if (!preview) return;

    preview.innerHTML = `
      <strong>${event.artist}</strong><br/>
      ${new Date(event.date).toDateString()}<br/>
      Red Rocks Amphitheatre<br/><br/>
      <a href="${event.ticketUrl || "#"}" target="_blank">
        View on Ticketmaster →
      </a>
    `;
  }

  function autoSelectNextShow() {
    const now = new Date();
    const next = events
      .map((e) => ({ ...e, t: new Date(e.date) }))
      .filter((e) => e.t > now)
      .sort((a, b) => a.t - b.t)[0];

    if (next) updateSidebar(next, true);
  }

  prevBtn?.addEventListener("click", () => {
    month--;
    if (month < 0) {
      month = 11;
      year--;
    }
    render();
  });

  nextBtn?.addEventListener("click", () => {
    month++;
    if (month > 11) {
      month = 0;
      year++;
    }
    render();
  });

  await loadEvents();
  render();
  autoSelectNextShow();
})();
