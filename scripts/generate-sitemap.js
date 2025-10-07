const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const SITEMAP_PATH = path.join(__dirname, '../public/sitemap.xml');
const CONTENT_PATH = path.join(__dirname, '../content');
const PAGES_PATH = path.join(__dirname, '../pages');
const BASE_URL = 'https://www.kashitaxi.in';

function getMarkdownFiles(dir) {
  const files = fs.readdirSync(dir);
  return files.filter(file => file.endsWith('.md'));
}

// Recursively collect Next.js page routes
function getPageRoutes(dir, baseRoute = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const routes = [];
  for (const entry of entries) {
    // Skip API, dynamic segments and special/underscore dirs
    if (entry.isDirectory()) {
      if (entry.name === 'api' || entry.name.startsWith('[') || entry.name.startsWith('_')) continue;
      const subBase = path.join(baseRoute, entry.name);
      routes.push(...getPageRoutes(path.join(dir, entry.name), subBase));
      continue;
    }
    // Files: include .js/.jsx only; skip special files
    if (!entry.name.match(/\.(js|jsx)$/)) continue;
    if (entry.name.startsWith('_') || entry.name.startsWith('[')) continue;

    const rel = path.join(baseRoute, entry.name).replace(/\\/g, '/');
    // Derive route path
    let route = '/' + rel.replace(/\.(js|jsx)$/i, '');
    // index files map to folder route
    route = route.replace(/\/(index)$/i, '/');
    // Normalize double slashes
    route = route.replace(/\/+$/, '/');

    // Skip error pages
    const basename = path.basename(route);
    if (['404', '500', '_error', '_document', '_app'].includes(basename)) continue;

    routes.push(route);
  }
  return routes;
}

function generateSitemap() {
  const sitemapContent = fs.existsSync(SITEMAP_PATH) ? fs.readFileSync(SITEMAP_PATH, 'utf-8') : '';
  const existingUrls = sitemapContent.match(/<loc>(.*?)<\/loc>/g)?.map(tag => tag.replace(/<\/?loc>/g, '')) || [];

  // Use a Map to keep meta per URL (we'll always set lastmod to now)
  const urlMap = new Map(existingUrls.map(u => [u, { priority: '0.8', changefreq: 'weekly' }]));

  const addUrl = (loc, _lastmodIgnored, priority = '0.8', changefreq = 'weekly') => {
    urlMap.set(loc, { priority, changefreq });
  };

  // Helper: add packages from content/<lang>/packages/*.md
  function addPackagesForLang(lang) {
    const pkgDir = path.join(CONTENT_PATH, lang, 'packages');
    if (!fs.existsSync(pkgDir)) return;
    const files = fs.readdirSync(pkgDir).filter(f => f.endsWith('.md'));
    files.forEach(file => {
      const abs = path.join(pkgDir, file);
      const content = fs.readFileSync(abs, 'utf-8');
      let slug = file.replace(/\.md$/, '');
      try {
        const { data } = matter(content);
        if (data && typeof data.slug === 'string' && data.slug.trim()) {
          slug = data.slug.trim();
        }
      } catch {}
      const loc = `${BASE_URL}/${lang}/packages/${slug}`;
      addUrl(loc, undefined, '0.8', 'weekly');
    });
  }

  // Add home page (always lastmod now)
  addUrl(`${BASE_URL}/`, undefined, '0.9', 'weekly');

  // Add language landing pages if present in project
  addUrl(`${BASE_URL}/en/`, undefined, '0.7', 'weekly');
  addUrl(`${BASE_URL}/hi/`, undefined, '0.7', 'weekly');

  // Add English posts (ignore frontmatter dates for lastmod)
  const enDir = path.join(CONTENT_PATH, 'en');
  if (fs.existsSync(enDir)) {
    const enFiles = getMarkdownFiles(enDir);
    enFiles.forEach(file => {
      const abs = path.join(enDir, file);
      const content = fs.readFileSync(abs, 'utf-8');
      const { data } = matter(content);
      if (data.slug) {
        addUrl(`${BASE_URL}/en/${data.slug}`, undefined, '0.8', 'weekly');
      }
    });
  }

  // Add Hindi posts (ignore frontmatter dates for lastmod)
  const hiDir = path.join(CONTENT_PATH, 'hi');
  if (fs.existsSync(hiDir)) {
    const hiFiles = getMarkdownFiles(hiDir);
    hiFiles.forEach(file => {
      const abs = path.join(hiDir, file);
      const content = fs.readFileSync(abs, 'utf-8');
      const { data } = matter(content);
      if (data.slug) {
        addUrl(`${BASE_URL}/hi/${data.slug}`, undefined, '0.8', 'weekly');
      }
    });
  }

  // Add package detail pages from content/<lang>/packages
  addPackagesForLang('en');
  addPackagesForLang('hi');

  // Add static Next.js pages (non-dynamic, non-API); lastmod always now
  const pageRoutes = getPageRoutes(PAGES_PATH);
  pageRoutes.forEach(route => {
    const loc = `${BASE_URL}${route}`;
    addUrl(loc, undefined, route === '/' ? '0.9' : '0.7', 'monthly');
  });

  // Build XML (sorted by loc for stability) with lastmod = now
  const sorted = Array.from(urlMap.entries()).sort(([a],[b]) => a.localeCompare(b));
  const nowIso = new Date().toISOString();
  const urlsXml = sorted.map(([loc, meta]) => {
    const { priority = '0.8', changefreq = 'weekly' } = meta || {};
    return `\n  <url>\n    <loc>${loc}</loc>\n    <lastmod>${nowIso}</lastmod>\n    <priority>${priority}</priority>\n    <changefreq>${changefreq}</changefreq>\n  </url>`;
  }).join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlsXml}\n</urlset>`;

  fs.writeFileSync(SITEMAP_PATH, sitemap);
  console.log('Sitemap generated successfully!');
}

generateSitemap();
