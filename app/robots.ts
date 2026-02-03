import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: [
        '/',
        '/guide/',
        '/venues/',
        '/book-shuttle',
        '/private-suburban',
      ],
      disallow: [
        '/api/',      // Protects your backend routes
        '/_next/',    // Standard Next.js internal folder
        '/static/',   // Direct asset access
        '/shows/',    // Older show data folders
        '/admin/',    // Future admin panels
        '/_parked/',  // Your parked assets folder
      ],
    },
    sitemap: 'https://partyatredrocks.com/sitemap.xml',
  }
}
