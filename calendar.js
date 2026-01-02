document.addEventListener("DOMContentLoaded", () => {
  const calendar = document.getElementById("calendar");
  const preview = document.getElementById("dcc-preview");

  if (!calendar || !window.CONCERTS) {
    console.error("Calendar element or CONCERTS missing");
    return;
  }

  const year = 2026;
  const monthIndex = 4; // May (0-based)
  const month = "05";

  const firstDay = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  // Add blank spacers
  for (let i = 0; i < firstDay; i++) {
    const spacer = document.createElement("div");
    spacer.className = "day spacer";
    calendar.appendChild(spacer);
  }

  // Create day cells
  for (let d = 1; d <= daysInMonth; d++) {
    const date = `${year}-${month}-${String(d).padStart(2, "0")}`;

    const day = document.createElement("div");
    day.className = "day";
    day.dataset.date = date;
    day.innerHTML = `<span class="day-number">${d}</span>`;

    calendar.appendChild(day);
  }

  // Populate concerts
  window.CONCERTS.forEach(show => {
    const day = document.querySelector(
      `.day[data-date="${show.start}"]`
    );
    if (!day) return;

    day.classList.add("has-show");
    day.innerHTML += `
      <div class="show">
        <strong>${show.title}</strong>
      </div>
    `;

    if (preview) {
      day.addEventListener("mouseenter", () => {
        preview.textContent = `${show.title} — ${show.start}`;
      });
    }

    if (show.url) {
      day.addEventListener("click", () => {
        window.open(show.url, "_blank");
      });
    }
  });
});
