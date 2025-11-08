const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const SITEMAP_PATH = path.join(__dirname, '../public/sitemap.xml');
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
      if (!['404', '500', '_error', '_document', '_app'].includes(base)) routes.push(route);
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
      urls.push({ loc: `${BASE_URL}/${lang}/${slug}`, priority: '0.8', changefreq: 'weekly' });
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
        urls.push({ loc: `${BASE_URL}/${lang}/${folder}/${slug}`, priority: '0.8', changefreq: 'weekly' });
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
            // Map to /lang/destination/category/slug (e.g., /en/varanasi/tour-packages/same-day-tour)
            urls.push({ loc: `${BASE_URL}/${lang}/${destination}/${category}/${slug}`, priority: '0.8', changefreq: 'weekly' });
          });
        });
      });
    }
  });
  
  return urls;
}

function generateSitemap() {
  const urlEntries = new Map();
  const add = (loc, priority = '0.8', changefreq = 'weekly') => urlEntries.set(loc, { priority, changefreq });

  // Core landings
  add(`${BASE_URL}/`, '0.9', 'weekly');
  add(`${BASE_URL}/en/`, '0.7', 'weekly');
  add(`${BASE_URL}/hi/`, '0.7', 'weekly');

  // Content-derived URLs
  collectContentUrls().forEach(u => add(u.loc, u.priority, u.changefreq));

  // Static page routes from /pages (excluding dynamic because content pages cover them)
  getPageRoutes(PAGES_PATH).forEach(r => add(`${BASE_URL}${r}`, r === '/' ? '0.9' : '0.7', 'monthly'));

  // Reinforce root path frequency (ensure weekly, may have been overridden by page enumeration logic)
  add(`${BASE_URL}/`, '0.9', 'weekly');

  // Build XML
  const nowIso = new Date().toISOString();
  const sorted = Array.from(urlEntries.keys()).sort();
  const body = sorted.map(loc => {
    const { priority, changefreq } = urlEntries.get(loc);
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${nowIso}</lastmod>\n    <priority>${priority}</priority>\n    <changefreq>${changefreq}</changefreq>\n  </url>`;
  }).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`;
  fs.writeFileSync(SITEMAP_PATH, xml);
  console.log('Sitemap regenerated (fresh, no merge). URLs:', sorted.length);
}

generateSitemap();
