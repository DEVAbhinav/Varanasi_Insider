const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Security through obscurity - using non-standard sitemap name
const SITEMAP_PATH = path.join(__dirname, '../public/kt-secret-map-v9.xml');
const CONTENT_PATH = path.join(__dirname, '../content');
const PAGES_PATH = path.join(__dirname, '../pages');
const BASE_URL = 'https://www.kashitaxi.in';

// Recursively collect static page routes (excluding dynamic & api)
function getPageRoutes(dir, baseRoute = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const routes = [];
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (['api'].includes(entry.name) || entry.name.startsWith('_') || entry.name.startsWith('[')) continue;
      routes.push(...getPageRoutes(path.join(dir, entry.name), path.join(baseRoute, entry.name)));
    } else if (/\.(js|jsx)$/.test(entry.name) && !entry.name.startsWith('_') && !entry.name.startsWith('[')) {
      // Skip backup or draft files (e.g., index.backup.js) so they don't leak into sitemap
      if (entry.name.includes('.backup.')) continue;
      let route = '/' + path.join(baseRoute, entry.name).replace(/\\/g, '/').replace(/\.(js|jsx)$/i, '');
      route = route.replace(/\/(index)$/i, '/').replace(/\/+$/, '/');
      const base = path.basename(route);
      if (!['404', '500', '_error', '_document', '_app', 'sitemap.xml'].includes(base)) routes.push(route);
    }
  }
  return routes;
}

function safeReadFrontmatter(absPath) {
  try {
    const raw = fs.readFileSync(absPath, 'utf-8');
    return matter(raw).data || {};
  } catch { return {}; }
}

function collectContentUrls() {
  const urls = [];
  if (!fs.existsSync(CONTENT_PATH)) return urls;
  const langs = fs.readdirSync(CONTENT_PATH).filter(l => !l.startsWith('.') && !['destinations'].includes(l));
  const sectionFolders = ['packages','bus','services','landing','guides'];
  for (const lang of langs) {
    const langRoot = path.join(CONTENT_PATH, lang);
    // Root-level markdown (posts at /lang/slug)
    const rootFiles = fs.readdirSync(langRoot).filter(f => f.endsWith('.md'));
    rootFiles.forEach(file => {
      const abs = path.join(langRoot, file);
      const fm = safeReadFrontmatter(abs);
      const slug = fm.slug || file.replace(/\.md$/, '');
      const lastmod = fm.lastUpdated || fm.date;
      urls.push({ loc: `${BASE_URL}/${lang}/${slug}`, priority: '0.8', changefreq: 'weekly', lang, slug, type: 'root', lastmod });
    });
    // Section folders
    sectionFolders.forEach(folder => {
      const secDir = path.join(langRoot, folder);
      if (!fs.existsSync(secDir)) return;
      const files = fs.readdirSync(secDir).filter(f => f.endsWith('.md'));
      files.forEach(file => {
        const abs = path.join(secDir, file);
        const fm = safeReadFrontmatter(abs);
        const slug = fm.slug || file.replace(/\.md$/, '');
        const lastmod = fm.lastUpdated || fm.date;
        urls.push({ loc: `${BASE_URL}/${lang}/${folder}/${slug}`, priority: '0.8', changefreq: 'weekly', lang, slug, folder, type: 'section', lastmod });
      });
    });
  }
  
  // Destination pages (content/[lang]/destinations/[destination]/[category]/[slug].md)
  const destLangs = ['en', 'hi'];
  destLangs.forEach(lang => {
    const destRoot = path.join(CONTENT_PATH, lang, 'destinations');
    if (fs.existsSync(destRoot)) {
      const destinations = fs.readdirSync(destRoot).filter(d => !d.startsWith('.') && fs.statSync(path.join(destRoot, d)).isDirectory());
      destinations.forEach(destination => {
        const destDir = path.join(destRoot, destination);
        const categories = fs.readdirSync(destDir).filter(c => !c.startsWith('.') && fs.statSync(path.join(destDir, c)).isDirectory());
        categories.forEach(category => {
          const categoryDir = path.join(destDir, category);
          const files = fs.readdirSync(categoryDir).filter(f => f.endsWith('.md'));
          files.forEach(file => {
            const abs = path.join(categoryDir, file);
            const fm = safeReadFrontmatter(abs);
            const slug = fm.slug || file.replace(/\.md$/, '');
            const lastmod = fm.lastUpdated || fm.date;
            // Map to /lang/city/destination/category/slug (e.g., /en/city/varanasi/tour-packages/same-day-tour)
            urls.push({ loc: `${BASE_URL}/${lang}/city/${destination}/${category}/${slug}`, priority: '0.8', changefreq: 'weekly', lang, slug, destination, category, type: 'destination', lastmod });
          });
        });
      });
    }
  });
  
  return urls;
}

function generateSitemap() {
  const urlEntries = new Map();
  const contentUrls = collectContentUrls();
  
  const add = (loc, priority = '0.8', changefreq = 'weekly', meta = {}) => {
    urlEntries.set(loc, { priority, changefreq, ...meta });
  };

  // Core landings with hreflang
  add(`${BASE_URL}/`, '0.9', 'weekly', { hreflang: [
    { lang: 'x-default', url: `${BASE_URL}/` },
    { lang: 'en', url: `${BASE_URL}/en/` },
    { lang: 'hi', url: `${BASE_URL}/hi/` }
  ]});
  add(`${BASE_URL}/en/`, '0.7', 'weekly', { hreflang: [
    { lang: 'x-default', url: `${BASE_URL}/` },
    { lang: 'en', url: `${BASE_URL}/en/` },
    { lang: 'hi', url: `${BASE_URL}/hi/` }
  ]});
  add(`${BASE_URL}/hi/`, '0.7', 'weekly', { hreflang: [
    { lang: 'x-default', url: `${BASE_URL}/` },
    { lang: 'en', url: `${BASE_URL}/en/` },
    { lang: 'hi', url: `${BASE_URL}/hi/` }
  ]});

  // Build hreflang map for content pages
  const hreflangMap = new Map();
  
  contentUrls.forEach(u => {
    const key = `${u.type}:${u.folder || ''}:${u.destination || ''}:${u.category || ''}:${u.slug}`;
    if (!hreflangMap.has(key)) {
      hreflangMap.set(key, {});
    }
    hreflangMap.get(key)[u.lang] = u.loc;
  });

  // Content-derived URLs with hreflang
  contentUrls.forEach(u => {
    const key = `${u.type}:${u.folder || ''}:${u.destination || ''}:${u.category || ''}:${u.slug}`;
    const alternates = hreflangMap.get(key);
    const hreflang = [];
    
    // Add alternates for all available languages
    if (alternates.en) {
      hreflang.push({ lang: 'en', url: alternates.en });
    }
    if (alternates.hi) {
      hreflang.push({ lang: 'hi', url: alternates.hi });
    }
    
    // Add x-default (prefer EN if available, otherwise use current)
    if (alternates.en) {
      hreflang.push({ lang: 'x-default', url: alternates.en });
    }
    
    add(u.loc, u.priority, u.changefreq, { 
      hreflang: hreflang.length > 1 ? hreflang : [],
      lastmod: u.lastmod 
    });
  });

  // Static page routes from /pages (excluding dynamic because content pages cover them)
  getPageRoutes(PAGES_PATH).forEach(r => add(`${BASE_URL}${r}`, r === '/' ? '0.9' : '0.7', 'monthly'));

  // Reinforce root path frequency (ensure weekly, may have been overridden by page enumeration logic)
  add(`${BASE_URL}/`, '0.9', 'weekly', { hreflang: [
    { lang: 'x-default', url: `${BASE_URL}/` },
    { lang: 'en', url: `${BASE_URL}/en/` },
    { lang: 'hi', url: `${BASE_URL}/hi/` }
  ]});

  // Build XML with hreflang support
  const nowIso = new Date().toISOString();
  const sorted = Array.from(urlEntries.keys()).sort();
  const body = sorted.map(loc => {
    const { priority, changefreq, hreflang, lastmod } = urlEntries.get(loc);
    
    let finalLastmod = nowIso;
    if (lastmod) {
      const d = new Date(lastmod);
      if (!isNaN(d.getTime())) {
        finalLastmod = d.toISOString();
      }
    }

    let urlBlock = `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${finalLastmod}</lastmod>\n    <priority>${priority}</priority>\n    <changefreq>${changefreq}</changefreq>`;
    
    // Add hreflang links if available
    if (hreflang && hreflang.length > 0) {
      hreflang.forEach(alt => {
        urlBlock += `\n    <xhtml:link rel="alternate" hreflang="${alt.lang}" href="${alt.url}" />`;
      });
    }
    
    urlBlock += '\n  </url>';
    return urlBlock;
  }).join('\n');
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${body}\n</urlset>`;
  fs.writeFileSync(SITEMAP_PATH, xml);
  console.log('Sitemap regenerated with hreflang tags. URLs:', sorted.length);
}

generateSitemap();
