cd ~/partyatredrocks
cat <<'EOF' > calendar.js
(async function () {
  // ----- BASIC DOM CHECK -----
  const calendar = document.getElementById("calendar");
  const preview = document.getElementById("dcc-preview");

  if (!calendar) {
    console.error("Calendar element missing");
    return;
  }

  // ----- BUILD CALENDAR GRID (May 2026) -----
  const year = 2026;
  const monthIndex = 4; // May (0-based)
  const month = "05";

  const firstDay = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  // Leading empty cells
  for (let i = 0; i < firstDay; i++) {
    const spacer = document.createElement("div");
    spacer.className = "day spacer";
    calendar.appendChild(spacer);
  }

  // Actual days
  for (let d = 1; d <= daysInMonth; d++) {
    const day = document.createElement("div");
    day.className = "day";
    day.dataset.date = `${year}-${month}-${String(d).padStart(2, "0")}`;
    day.innerHTML = `<span class="day-number">${d}</span>`;
    calendar.appendChild(day);
  }

  // ----- FETCH EVENTS FROM WORKER -----
  let data;
  try {
    const res = await fetch(
      "https://dcc-redrocks-2026.denverairportpickup.workers.dev/events/redrocks"
    );
    data = await res.json();
  } catch (err) {
    console.error("Failed to fetch events", err);
    return;
  }

  if (!data.events || !Array.isArray(data.events)) {
    console.warn("No events returned");
    return;
  }

  // ----- BIND EVENTS TO DAYS -----
  data.events.forEach(ev => {
    const el = document.querySelector(
      `.day[data-date="${ev.date}"]`
    );
    if (!el) return;

    const title = ev.artists && ev.artists.length
      ? ev.artists.join(", ")
      : ev.name;

    el.classList.add("has-show");

    el.innerHTML += `
      <div class="show">
        <strong>${title}</strong>
        <span>${ev.time || ""}</span>
      </div>
    `;

    // Hover → sidebar preview
    el.addEventListener("mouseenter", () => {
      if (!preview) return;
      preview.innerHTML = `
        <strong>${title}</strong><br/>
        <span>${ev.date} · ${ev.time || ""}</span>
      `;
    });

    // Click → show page
    el.addEventListener("click", () => {
      window.location.href = `/show.html?date=${ev.date}`;
    });
  });
})();
EOF
