// show.js

const params = new URLSearchParams(window.location.search);
const eventId = params.get("id");

const event = window.redRocks2026Events.find(e => e.id === eventId);

if (!event) {
  document.body.innerHTML = "<h1>Event not found</h1>";
  throw new Error("Invalid event ID");
}

document.getElementById("title").textContent = event.title;
document.getElementById("date").textContent = event.date;
document.getElementById("venue").textContent = event.venue;
document.getElementById("description").textContent = event.description;

document.getElementById("ticketLink").href = event.ticket_url;
document.getElementById("shuttleLink").href = event.shuttle_url;
document.getElementById("suburbanLink").href = event.suburban_url;
