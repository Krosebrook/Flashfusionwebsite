#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseUrl = 'https://flashfusion.dev';
const currentDate = new Date().toISOString().split('T')[0];

const pages = [
  // Public pages
  { url: '/', priority: '1.0', changefreq: 'daily' },
  { url: '/features', priority: '0.9', changefreq: 'weekly' },
  { url: '/pricing', priority: '0.9', changefreq: 'weekly' },
  { url: '/demo', priority: '0.8', changefreq: 'weekly' },
  { url: '/about', priority: '0.7', changefreq: 'monthly' },
  { url: '/contact', priority: '0.7', changefreq: 'monthly' },
  { url: '/testimonials', priority: '0.6', changefreq: 'weekly' },
  { url: '/faq', priority: '0.6', changefreq: 'monthly' },
  
  // Legal pages
  { url: '/privacy', priority: '0.5', changefreq: 'quarterly' },
  { url: '/terms', priority: '0.5', changefreq: 'quarterly' },
  
  // App pages (require authentication but should be indexed)
  { url: '/dashboard', priority: '0.8', changefreq: 'daily' },
  { url: '/tools', priority: '0.7', changefreq: 'weekly' },
  { url: '/projects', priority: '0.7', changefreq: 'daily' },
  { url: '/templates', priority: '0.6', changefreq: 'weekly' },
  { url: '/integrations', priority: '0.6', changefreq: 'weekly' },
  { url: '/analytics', priority: '0.6', changefreq: 'daily' },
  { url: '/deployments', priority: '0.6', changefreq: 'weekly' },
  { url: '/collaboration', priority: '0.6', changefreq: 'weekly' },
  { url: '/cicd', priority: '0.6', changefreq: 'weekly' },
];

const generateSitemap = () => {
  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  const publicDir = path.join(__dirname, '..', 'public');
  const sitemapPath = path.join(publicDir, 'sitemap.xml');
  
  // Ensure public directory exists
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  fs.writeFileSync(sitemapPath, xmlContent);
  console.log(`✅ Sitemap generated at ${sitemapPath}`);
  console.log(`📄 Generated ${pages.length} pages`);
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateSitemap();
}

export default generateSitemap;