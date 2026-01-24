import requests
from datetime import datetime, timedelta

CLIENT_ID = "YOUR_SEATGEEK_CLIENT_ID"

def fetch_events(venue_id):
    params = {
        "venue.id": venue_id,
        "per_page": 50,
        "sort": "datetime_local.asc",
        "client_id": CLIENT_ID
    }

    r = requests.get("https://api.seatgeek.com/2/events", params=params)
    r.raise_for_status()
    return r.json().get("events", [])

