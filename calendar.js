(async function () {
  const calendar = document.getElementById("calendar");
  if (!calendar) {
    console.error("Calendar element missing");
    return;
  }

  // BUILD GRID
  const year = 2026;
  const monthIndex = 4; // May
  const month = "05";

  const firstDay = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    const spacer = document.createElement("div");
    spacer.className = "day spacer";
    calendar.appendChild(spacer);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const day = document.createElement("div");
    day.className = "day";
    day.dataset.date = `${year}-${month}-${String(d).padStart(2, "0")}`;
    day.innerHTML = `<span class="day-number">${d}</span>`;
    calendar.appendChild(day);
  }

  // FETCH EVENTS
  const res = await fetch(
    "https://dcc-redrocks-2026.denverairportpickup.workers.dev/events/redrocks"
  );
  const data = await res.json();

  data.events.forEach(ev => {
    const el = document.querySelector(
      `.day[data-date="${ev.date}"]`
    );
    if (!el) return;

    el.classList.add("has-show");
    el.innerHTML += `
      <div class="show">
        <strong>${ev.artists.join(", ") || ev.name}</strong>
        <span>${ev.time || ""}</span>
      </div>
    `;

    el.onmouseenter = () => {
      document.getElementById("dcc-preview").innerHTML = `
        <strong>${ev.artists.join(", ") || ev.name}</strong><br/>
        <span>${ev.date} · ${ev.time || ""}</span>
      `;
    };

    el.onclick = () => {
      window.location.href = `/show.html?date=${ev.date}`;
    };
  });
})();
