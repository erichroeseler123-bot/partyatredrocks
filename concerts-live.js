/**
 * PartyAtRedRocks — Live Data Bridge
 * Replaces cached static concerts.js with Worker-powered data
 */

(async function () {
  console.log("DCC: Initializing Live Events Bridge");

  const WORKER_URL =
    "https://dcc-bandsintown.denverairportpickup.workers.dev/api/calendar?per_page=50";

  try {
    const res = await fetch(WORKER_URL);
    const data = await res.json();

    if (!data.events || !Array.isArray(data.events)) {
      throw new Error("Invalid API response");
    }

    const grid = document.getElementById("cards");
    grid.innerHTML = "";

    data.events.forEach(e => {
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <img src="${e.best_image}" alt="${e.title}">
        <h3>${e.title}</h3>
        <div>${e.date}</div>
        <a class="btn btn-shuttle" href="/book?event=${encodeURIComponent(
          e.title
        )}">
          Book Shuttle ($59)
        </a>
        <a class="btn btn-private" href="/private">
          Private Suburban ($449)
        </a>
      `;

      grid.appendChild(card);
    });

    console.log("DCC: Live Events Loaded", data.events.length);
  } catch (err) {
    console.error("DCC: Failed to load events", err);
  }
})();
