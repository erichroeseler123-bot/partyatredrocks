(async function () {
  const calendar = document.getElementById("calendar");
  const sidebar = document.getElementById("sidebar");

  try {
    const res = await fetch(
      "https://dcc-redrocks-2026.denverairportpickup.workers.dev/api/dcc/red-rocks/2026/events"
    );
    const data = await res.json();

    if (!data.events || !data.events.length) {
      calendar.innerHTML = "<p>No confirmed shows yet.</p>";
      return;
    }

    calendar.innerHTML = "";

    data.events.forEach(event => {
      const card = document.createElement("a");
      card.href = `/show.html?eventId=${event.eventId}`;
      card.className = "calendar-card";

      card.innerHTML = `
        <strong>${event.artist}</strong>
        <small>${event.date} (${event.dayOfWeek})</small>
      `;

      // Hover → sidebar preview
      card.addEventListener("mouseenter", () => {
        sidebar.innerHTML = `
          ${event.image ? `<img src="${event.image}" />` : ""}
          <h3>${event.artist}</h3>
          <p>${event.date} · ${event.dayOfWeek}</p>
          <p><strong>Venue:</strong> Red Rocks Amphitheatre</p>
          <p>
            <a href="${event.ticketUrl}" target="_blank">
              Buy tickets →
            </a>
          </p>
        `;
      });

      calendar.appendChild(card);
    });

  } catch (err) {
    calendar.innerHTML = "<p>Failed to load events.</p>";
    console.error(err);
  }
})();
