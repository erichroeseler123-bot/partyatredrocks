(async function () {
  const calendar = document.getElementById("calendar");
  const preview = document.getElementById("dcc-preview");
  const monthLabel = document.getElementById("month-label");

  if (!calendar) return;

  let lockedEventId = null;

  const res = await fetch(
    "https://dcc-redrocks-2026.denverairportpickup.workers.dev/api/dcc/red-rocks/2026/events"
  );

  const data = await res.json();
  const events = data.events || [];

  const year = 2026;
  const month = 4; // MAY (0-based)

  function updateSidebar(ev, locked = false) {
    if (!preview) return;

    preview.innerHTML = `
      <div class="dcc-card">
        <div class="dcc-title">${ev.artist}</div>
        <div class="dcc-date">${ev.date} (${ev.dayOfWeek})</div>
        <div class="dcc-venue">Red Rocks Amphitheatre</div>
        <a class="dcc-link" href="/show.html?eventId=${ev.eventId}">
          View Show →
        </a>
      </div>
    `;

    if (locked) lockedEventId = ev.eventId;
  }

  function clearSidebar() {
    if (!preview || lockedEventId) return;
    preview.innerHTML = `<div class="dcc-muted">Hover a show to preview</div>`;
  }

  function render() {
    calendar.innerHTML = "";

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    monthLabel.textContent = firstDay.toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });

    const byDay = {};
    events.forEach(ev => {
      const d = new Date(ev.date);
      if (d.getMonth() === month) {
        const day = d.getDate();
        if (!byDay[day]) byDay[day] = [];
        byDay[day].push(ev);
      }
    });

    // Empty cells before month start
    for (let i = 0; i < firstDay.getDay(); i++) {
      const empty = document.createElement("div");
      empty.className = "calendar-cell empty";
      calendar.appendChild(empty);
    }

    // Real days
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const cell = document.createElement("div");
      cell.className = "calendar-cell";

      const num = document.createElement("div");
      num.className = "day-num";
      num.textContent = d;
      cell.appendChild(num);

      (byDay[d] || []).forEach(ev => {
        const a = document.createElement("a");
        a.className = "event-link";
        a.href = `/show.html?eventId=${ev.eventId}`;
        a.textContent = ev.artist;

        a.addEventListener("mouseenter", () => {
          if (!lockedEventId) updateSidebar(ev);
        });

        a.addEventListener("mouseleave", clearSidebar);

        a.addEventListener("click", () => {
          lockedEventId = ev.eventId;
          updateSidebar(ev, true);
        });

        cell.appendChild(a);
      });

      calendar.appendChild(cell);
    }
  }

  render();
})();
