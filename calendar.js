// ===============================
// DCC Red Rocks Calendar Engine
// ===============================

const calendar = document.getElementById("calendar");
const preview = document.getElementById("dcc-preview");
const label = document.getElementById("month-label");
const prevBtn = document.getElementById("prev-month");
const nextBtn = document.getElementById("next-month");

let events = [];
let lockedEventId = null;

// CONFIG
let year = 2026;
let month = 4; // May (0-indexed)

// ===============================
// Fetch Events
// ===============================

async function loadEvents() {
  const res = await fetch(
    "https://dcc-redrocks-2026.denverairportpickup.workers.dev/api/dcc/events"
  );
  const data = await res.json();
  events = data.events || [];
  render();
}

function getTicketmasterLink(ev) {
  if (ev.ticketmasterUrl) return ev.ticketmasterUrl;

  if (ev.ticketmasterEventId) {
    return `https://www.ticketmaster.com/event/${ev.ticketmasterEventId}`;
  }

  // fallback: Red Rocks TM search
  const q = encodeURIComponent(`${ev.artist} Red Rocks`);
  return `https://www.ticketmaster.com/search?q=${q}`;
}


// ===============================
// Sidebar Logic
// ===============================
function updateSidebar(ev, locked = false) {
  if (!preview || !ev) return;

  const ticketUrl = getTicketmasterLink(ev);

  preview.classList.add("active");
  preview.innerHTML = `
    <strong>${ev.artist}</strong>
    <div>${new Date(ev.date).toLocaleDateString()}</div>
    <div>Red Rocks Amphitheatre</div>

    <div class="sidebar-actions">
      <a href="${ticketUrl}" target="_blank" rel="noopener" class="tm-link">
        🎟 Buy tickets
      </a>

      <a href="/show.html?eventId=${ev.eventId}" class="details-link">
        View show →
      </a>
    </div>
  `;

  if (locked) lockedEventId = ev.eventId;
}
// ===============================
// Calendar Render
// ===============================

function render() {
  calendar.innerHTML = "";

  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const offset = first.getDay();

  label.textContent = first.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Group events by day
  const byDay = {};
  events.forEach(ev => {
    const d = new Date(ev.date);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate();
      if (!byDay[day]) byDay[day] = [];
      byDay[day].push(ev);
    }
  });

  // Empty offset cells
  for (let i = 0; i < offset; i++) {
    const empty = document.createElement("div");
    empty.className = "day empty";
    calendar.appendChild(empty);
  }

  // Day cells
  for (let d = 1; d <= last.getDate(); d++) {
    const cell = document.createElement("div");
    cell.className = "day";

    const num = document.createElement("div");
    num.className = "num";
    num.textContent = d;
    cell.appendChild(num);

    const eventsForDay = byDay[d];

    if (eventsForDay && eventsForDay.length) {
      cell.classList.add("has-event");

      eventsForDay.forEach(ev => {
        const link = document.createElement("a");
        link.href = `/show.html?eventId=${ev.eventId}`;
        link.textContent = ev.artist;
        link.className = "artist";
        cell.appendChild(link);

        // Hover / click wiring
        cell.addEventListener("mouseenter", () => {
          if (!lockedEventId) updateSidebar(ev);
        });

        cell.addEventListener("mouseleave", () => {
          clearSidebar();
        });

        cell.addEventListener("click", () => {
          updateSidebar(ev, true);
        });
      });
    }

    calendar.appendChild(cell);
  }
}

// ===============================
// Month Navigation
// ===============================

prevBtn.addEventListener("click", () => {
  month--;
  if (month < 0) {
    month = 11;
    year--;
  }
  lockedEventId = null;
  clearSidebar();
  render();
});

nextBtn.addEventListener("click", () => {
  month++;
  if (month > 11) {
    month = 0;
    year++;
  }
  lockedEventId = null;
  clearSidebar();
  render();
});

// ===============================
// Optional: Auto-select NEXT show
// (INTENTIONALLY OFF)
// ===============================

// function autoSelectNextShow() {
//   const now = new Date();
//   const next = events
//     .map(ev => ({ ...ev, dateObj: new Date(ev.date) }))
//     .filter(ev => ev.dateObj > now)
//     .sort((a, b) => a.dateObj - b.dateObj)[0];
//
//   if (next) updateSidebar(next, true);
// }

// ===============================
// Boot
// ===============================

loadEvents();
