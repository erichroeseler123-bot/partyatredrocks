(async function () {
  const calendar = document.getElementById("calendar");
  if (!calendar) return;

  const YEAR = 2026;
  const MONTH = 4; // May (0 = Jan)

  const res = await fetch(
    "https://dcc-redrocks-2026.denverairportpickup.workers.dev/api/dcc/red-rocks/2026/events"
  );
  const data = await res.json();
  const events = data.events || [];

  // Group events by date
  const eventsByDate = {};
  events.forEach(ev => {
    if (!eventsByDate[ev.date]) eventsByDate[ev.date] = [];
    eventsByDate[ev.date].push(ev);
  });

  const firstDay = new Date(YEAR, MONTH, 1);
  const lastDay = new Date(YEAR, MONTH + 1, 0);
  const startWeekday = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  calendar.innerHTML = "";

  // Weekday headers
  ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].forEach(d => {
    const h = document.createElement("div");
    h.className = "calendar-header";
    h.textContent = d;
    calendar.appendChild(h);
  });

  // Empty leading cells
  for (let i = 0; i < startWeekday; i++) {
    calendar.appendChild(document.createElement("div"));
  }

  // Day cells
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${YEAR}-05-${String(day).padStart(2,"0")}`;
    const cell = document.createElement("div");
    cell.className = "calendar-day";

    const num = document.createElement("div");
    num.className = "day-number";
    num.textContent = day;
    cell.appendChild(num);

    (eventsByDate[dateStr] || []).forEach(ev => {
      const link = document.createElement("a");
      link.href = `/show.html?eventId=${ev.eventId}`;
      link.className = "calendar-event";
      link.textContent = ev.artist;
      cell.appendChild(link);
    });

    calendar.appendChild(cell);
  }
})();
