const fs = require('fs');
const path = require('path');

// This script processes your show data into a clean JSON for the Next.js build
async function buildEventData() {
    const rawDataPath = path.join(__dirname, '../data/shows.json'); // Adjust to your data source
    const outputPath = path.join(__dirname, '../lib/events-cache.json');

    try {
        const rawData = JSON.parse(fs.readFileSync(rawDataPath, 'utf8'));
        
        // Transform your SeatGeek/TM data into SEO-ready objects
        const formattedEvents = rawData.map(event => ({
            slug: event.title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
            artist: event.title,
            date: event.datetime_local,
            image: event.performers[0]?.image || '/images/default-redrocks.jpg',
            description: `Official shuttle and transport logistics for ${event.title} at Red Rocks.`
        }));

        fs.writeFileSync(outputPath, JSON.stringify(formattedEvents, null, 2));
        console.log('✅ 2026 Event Cache Built for SEO Engine');
    } catch (err) {
        console.error('❌ Data build failed. Ensure shows.json exists in /data');
    }
}

buildEventData();
