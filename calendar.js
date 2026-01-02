document.addEventListener("DOMContentLoaded", () => {
  const calendar = document.getElementById("calendar");
  const preview = document.getElementById("dcc-preview");

  const year = 2026;
  const monthIndex = 4; // May

  const firstDay = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    calendar.appendChild(Object.assign(document.createElement("div"), { className: "day spacer" }));
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const date = `${year}-05-${String(d).padStart(2,"0")}`;
    const el = document.createElement("div");
    el.className = "day";
    el.dataset.date = date;
    el.innerHTML = `<span class="day-number">${d}</span>`;
    calendar.appendChild(el);
  }

  window.CONCERTS.forEach(show => {
    const day = document.querySelector(`.day[data-date="${show.start}"]`);
    if (!day) return;

    day.classList.add("has-show");
    day.innerHTML += `<div class="show"><strong>${show.title}</strong></div>`;

    day.onclick = () => window.open(show.url, "_blank");
    day.onmouseenter = () => preview.textContent = `${show.title} — ${show.start}`;
  });
});
