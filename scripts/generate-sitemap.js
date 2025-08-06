const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const SITEMAP_PATH = path.join(__dirname, '../public/sitemap.xml');
const CONTENT_PATH = path.join(__dirname, '../content');
const BASE_URL = 'https://www.kashitaxi.in';

function getMarkdownFiles(dir) {
  const files = fs.readdirSync(dir);
  return files.filter(file => file.endsWith('.md'));
}

function generateSitemap() {
  const sitemapContent = fs.readFileSync(SITEMAP_PATH, 'utf-8');
  const existingUrls = sitemapContent.match(/<loc>(.*?)<\/loc>/g)?.map(tag => tag.replace(/<\/?loc>/g, '')) || [];

  const urls = new Set(existingUrls);

  // Add home page
  urls.add(`${BASE_URL}/`);

  // Add English posts
  const enFiles = getMarkdownFiles(path.join(CONTENT_PATH, 'en'));
  enFiles.forEach(file => {
    const content = fs.readFileSync(path.join(CONTENT_PATH, 'en', file), 'utf-8');
    const { data } = matter(content);
    if (data.slug) {
      urls.add(`${BASE_URL}/en/${data.slug}`);
    }
  });

  // Add Hindi posts
  const hiFiles = getMarkdownFiles(path.join(CONTENT_PATH, 'hi'));
  hiFiles.forEach(file => {
    const content = fs.readFileSync(path.join(CONTENT_PATH, 'hi', file), 'utf-8');
    const { data } = matter(content);
    if (data.slug) {
      urls.add(`${BASE_URL}/hi/${data.slug}`);
    }
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...urls].map(url => `
  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <priority>0.8</priority>
    <changefreq>weekly</changefreq>
  </url>`).join('')}
</urlset>`;

  fs.writeFileSync(SITEMAP_PATH, sitemap);
  console.log('Sitemap generated successfully!');
}

generateSitemap();
