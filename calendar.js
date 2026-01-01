/* =========================================================
   CONFIG
   ========================================================= */

const API_URL =
  "https://dcc-redrocks-2026.denverairportpickup.workers.dev/api/dcc/red-rocks/2026/events";

const calendarEl = document.getElementById("calendar");
const sidebarTitle = document.getElementById("dcc-title");
const sidebarMeta = document.getElementById("dcc-meta");

/* =========================================================
   HELPERS
   ========================================================= */

function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function firstWeekday(year, month) {
  return new Date(year, month, 1).getDay(); // 0 = Sun
}

function clearSidebar() {
  if (!sidebarTitle || !sidebarMeta) return;
  sidebarTitle.textContent = "No show selected";
  sidebarMeta.textContent = "Hover a date to preview details.";
}

function updateSidebar(event) {
  if (!sidebarTitle || !sidebarMeta) return;

  sidebarTitle.textContent = event.artist;
  sidebarMeta.textContent =
    `${event.date} • ${event.dayOfWeek}\nRed Rocks Amphitheatre`;
}

/* =========================================================
   RENDER CALENDAR
   ========================================================= */

async function renderCalendar() {
  if (!calendarEl) return;

  const res = await fetch(API_URL);
  const data = await res.json();

  const events = data.events || [];

  // Hard-lock to May 2026 (can be made dynamic later)
  const year = 2026;
  const month = 4; // May (0-indexed)

  const totalDays = daysInMonth(year, month);
  const startDay = firstWeekday(year, month);

  // Map events by day
  const eventMap = {};
  events.forEach(ev => {
    const day = new Date(ev.date).getDate();
    eventMap[day] = ev;
  });

  calendarEl.innerHTML = "";

  // Empty padding days
  for (let i = 0; i < startDay; i++) {
    const empty = document.createElement("div");
    empty.className = "calendar-day empty";
    calendarEl.appendChild(empty);
  }

  // Actual days
  for (let day = 1; day <= totalDays; day++) {
    const cell = document.createElement("div");
    cell.className = "calendar-day";

    const num = document.createElement("div");
    num.className = "day-number";
    num.textContent = day;
    cell.appendChild(num);

    const ev = eventMap[day];

    if (ev) {
      const title = document.createElement("div");
      title.className = "event-title";
      title.textContent = ev.artist;
      cell.appendChild(title);

      // Hover → sidebar preview
      cell.addEventListener("mouseenter", () => {
        updateSidebar(ev);
      });

      cell.addEventListener("mouseleave", () => {
        clearSidebar();
      });

      // Click → show page
      cell.addEventListener("click", () => {
        window.location.href =
          `/show.html?eventId=${encodeURIComponent(ev.eventId)}`;
      });
    }

    calendarEl.appendChild(cell);
  }
}

/* =========================================================
   INIT
   ========================================================= */

clearSidebar();
renderCalendar();
