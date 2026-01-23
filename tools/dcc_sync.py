import requests
import json

# DCC INTELLIGENCE CONFIG
SEATGEEK_VENUE_ID = 196  # Red Rocks
SETLIST_API_KEY = "YOUR_KEY"

def fetch_venue_intelligence():
    # Automatically verify every show in your 90+ list
    url = f"https://api.seatgeek.com/2/events?venue.id={SEATGEEK_VENUE_ID}&client_id=YOUR_ID"
    response = requests.get(url).json()
    
    events = []
    for event in response.get('events', []):
        # Generate the Python-backed intelligence for each show
        events.append({
            "event": event['title'],
            "date": event['datetime_local'],
            "schema": {
                "@context": "https://schema.org",
                "@type": "Event",
                "name": event['title'],
                "location": "Red Rocks Amphitheatre"
            }
        })
    return events

# Run this script to auto-generate your Next.js schedule data
if __name__ == "__main__":
    intelligence_feed = fetch_venue_intelligence()
    with open('data/red_rocks_schedule.json', 'w') as f:
        json.dump(intelligence_feed, f, indent=2)
