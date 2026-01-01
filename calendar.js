console.log("calendar.js loaded");

(function () {
  const calendar = document.getElementById("calendar");
  const preview = document.getElementById("dcc-preview");

  if (!calendar) {
    console.error("Calendar element missing");
    return;
  }

  // ---- BUILD CALENDAR GRID (May 2026) ----
  const year = 2026;
  const monthIndex = 4; // May
  const month = "05";

  const firstDay = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  // Empty leading cells
  for (let i = 0; i < firstDay; i++) {
    const spacer = document.createElement("div");
    spacer.className = "day spacer";
    calendar.appendChild(spacer);
  }

  // Actual days
  for (let d = 1; d <= daysInMonth; d++) {
    const day = document.createElement("div");
    day.className = "day";
    day.dataset.date =
      year + "-" + month + "-" + String(d).padStart(2, "0");
    day.innerHTML =
      "<span class=\"day-number\">" + d + "</span>";
    calendar.appendChild(day);
  }

  // ---- FETCH EVENTS ----
  fetch("https://dcc-redrocks-2026.denverairportpickup.workers.dev/events/redrocks")
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      if (!data.events || !Array.isArray(data.events)) {
        console.warn("No events returned");
        return;
      }

      data.events.forEach(function (ev) {
        const el = document.querySelector(
          ".day[data-date=\"" + ev.date + "\"]"
        );
        if (!el) return;

        const title =
          ev.artists && ev.artists.length
            ? ev.artists.join(", ")
            : ev.name;

        el.classList.add("has-show");

        el.innerHTML +=
          "<div class=\"show\">" +
          "<strong>" + title + "</strong>" +
          "<span>" + (ev.time || "") + "</span>" +
          "</div>";

        el.addEventListener("mouseenter", function () {
          if (!preview) return;
          preview.innerHTML =
            "<strong>" + title + "</strong><br/>" +
            "<span>" + ev.date + " · " + (ev.time || "") + "</span>";
        });

        el.addEventListener("click", function () {
          window.location.href =
            "/show.html?date=" + ev.date;
        });
      });
    })
    .catch(function (err) {
      console.error("Event fetch failed", err);
    });
})();
