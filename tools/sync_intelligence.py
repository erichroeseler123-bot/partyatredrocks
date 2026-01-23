import requests
import json

# DCC SETLIST INTELLIGENCE ENGINE
def get_predicted_setlist(artist_name):
    url = f"https://api.setlist.fm/rest/1.0/search/setlists?artistName={artist_name}"
    headers = {'Accept': 'application/json', 'x-api-key': 'YOUR_KEY'}
    
    response = requests.get(url, headers=headers)
    data = response.json()
    
    # Python logic to average the last 5 sets and predict length
    sets = data.get('setlist', [])
    song_counts = [len(s.get('sets', {}).get('set', [{}])[0].get('song', [])) for s in sets[:5]]
    avg_length = sum(song_counts) / len(song_counts) if song_counts else 15
    
    return round(avg_length)

# This script can auto-update your 'RED_ROCKS_SCHEDULE' array
print(f"Intelligence Check: Crankdat predicted length is {get_predicted_setlist('Crankdat')} songs")
