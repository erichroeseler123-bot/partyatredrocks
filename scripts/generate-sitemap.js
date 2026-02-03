const fs = require('fs');
const { globby } = require('globby');

async function generate() {
  const baseUrl = 'https://partyatredrocks.com';

  // 1. Find all 'page.tsx' files in the app directory
  const pages = await globby([
    'app/**/page.tsx',
    '!app/api',        // Ignore API routes
    '!app/guide/events/[slug]', // Ignore the dynamic template (handled separately)
    '!app/layout.tsx',
    '!app/loading.tsx',
  ]);

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${pages
      .map((page) => {
        // Convert file path to URL slug
        let path = page
          .replace('app', '')
          .replace('/page.tsx', '')
          .replace('page.tsx', '');
        
        // Handle the home page case
        if (path === '') path = '/';

        // Set priority based on directory depth
        let priority = 0.7;
        if (path === '/') priority = 1.0;
        if (path.includes('/guide')) priority = 0.9;
        if (path.includes('/shuttle')) priority = 0.8;

        return `
    <url>
        <loc>${baseUrl}${path}</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>${path === '/' ? 'daily' : 'weekly'}</changefreq>
        <priority>${priority}</priority>
    </url>`;
      })
      .join('')}
</urlset>`;

  fs.writeFileSync('public/sitemap.xml', sitemap);
  console.log('🚀 Sitemap generated with all new Authority and Logistics routes!');
}

generate();
