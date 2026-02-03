import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/_parked/'], 
    },
    sitemap: 'https://partyatredrocks.com/sitemap.xml',
  }
}
