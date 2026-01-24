import requests
import json
from datetime import datetime

SEATGEEK_CLIENT_ID = "NTUyMjcyMDV8MTc2NzU1MDc0Ni41MDEyNjgx"
VENUE_ID = 196  # Red Rocks Amphitheatre
BASE_URL = "https://api.seatgeek.com/2/events"

all_events = []
page = 1
per_page = 100

while True:
    params = {
        "client_id": CLIENT_ID,
        "venue.id": VENUE_ID,
        "per_page": per_page,
        "page": page,
        "sort": "datetime_local.asc",
    }

    r = requests.get(BASE_URL, params=params)
    r.raise_for_status()
    data = r.json()

    events = data.get("events", [])
    if not events:
        break

    for event in events:
        performers = event.get("performers", [])
        image = None

        if performers:
            image = (
                performers[0].get("images", {}).get("huge")
                or performers[0].get("image")
            )

        all_events.append({
            "id": event["id"],
            "title": event["title"],
            "datetime": event["datetime_local"],
            "url": event["url"],
            "image": image,
        })

    page += 1

print(f"Fetched {len(all_events)} events")

# Write to Next.js-friendly static JSON
with open("public/data/redrocks-events.json", "w") as f:
    json.dump(all_events, f, indent=2)

print("Wrote public/data/redrocks-events.json")
