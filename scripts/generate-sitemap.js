const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { execSync } = require('child_process');

// Generate sitemap with secret filename only
const SITEMAP_OUTPUT_PATHS = [
  path.join(__dirname, '../public/kt-secret-map-v9.xml'),
];
const CONTENT_PATH = path.join(__dirname, '../content');
const PAGES_PATH = path.join(__dirname, '../pages');
const BASE_URL = 'https://www.kashitaxi.in';

function normalizeAbsoluteUrl(url) {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed.replace(/\/+$/, '');
  }
  const normalizedPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return `${BASE_URL}${normalizedPath}`.replace(/\/+$/, '');
}

// Compile Next.js redirect `source` patterns into anchored RegExps so the
// sitemap never lists a URL that immediately 301s. Google reports such URLs as
// "Page with redirect" and drops them from the index, so advertising them in the
// sitemap is self-defeating.
function compileRedirectMatchers(redirects) {
  const matchers = [];
  for (const r of redirects || []) {
    if (!r || typeof r.source !== 'string') continue;
    try {
      const re = r.source
        // Escape regex specials, but keep ( ) | so :param(a|b) groups survive.
        .replace(/[.+?^${}[\]\\]/g, ch => '\\' + ch)
        .replace(/:(\w+)\(([^)]+)\)/g, '(?:$2)') // :param(a|b) -> (?:a|b)
        .replace(/:(\w+)[*+]/g, '.*')            // :param* / :param+ -> .*
        .replace(/:(\w+)\?/g, '[^/]*')           // :param? -> optional segment
        .replace(/:(\w+)/g, '[^/]+');            // :param -> single segment
      matchers.push(new RegExp('^' + re + '$'));
    } catch {
      /* skip malformed source pattern */
    }
  }
  return matchers;
}

async function loadRedirectMatchers() {
  try {
    const cfg = require('../next.config.js');
    if (cfg && typeof cfg.redirects === 'function') {
      return compileRedirectMatchers(await cfg.redirects());
    }
  } catch (e) {
    console.warn('Sitemap: could not load redirects for filtering —', e.message);
  }
  return [];
}

function pathnameOfLoc(loc) {
  return loc.replace(/^https?:\/\/[^/]+/, '') || '/';
}

function shouldEmitCanonicalizedEntry(loc, fm = {}) {
  // Never emit pages that are explicitly noindex or draft.
  if (fm?.noindex === true || fm?.draft === true) return false;
  if (!fm?.canonical) return true;
  const canonical = normalizeAbsoluteUrl(fm.canonical);
  const current = normalizeAbsoluteUrl(loc);
  if (!canonical || !current) return true;
  return canonical === current;
}

// Recursively collect static page routes (excluding dynamic & api)
function getPageRoutes(dir, baseRoute = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const routes = [];
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (['api'].includes(entry.name) || entry.name.startsWith('_') || entry.name.startsWith('[')) continue;
      routes.push(...getPageRoutes(path.join(dir, entry.name), path.join(baseRoute, entry.name)));
    } else if (/(\.(js|jsx|ts|tsx))$/i.test(entry.name) && !entry.name.startsWith('_') && !entry.name.startsWith('[')) {
      // Skip backup or draft files (e.g., index.backup.js) so they don't leak into sitemap
      if (entry.name.includes('.backup.')) continue;
      if (entry.name.endsWith('.d.ts')) continue;
      let route = '/' + path.join(baseRoute, entry.name).replace(/\\/g, '/').replace(/\.(js|jsx|ts|tsx)$/i, '');
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

// Deterministic <lastmod> fallback for pages without a frontmatter date.
// Uses the file's last git commit date (the real content-change signal),
// which is stable across builds — unlike a wall-clock timestamp, which would
// churn every build and falsely tell crawlers every page changed. Returns null
// when git history is unavailable so the caller can omit <lastmod> entirely
// rather than emit a misleading date.
const _gitDateCache = new Map();
function gitLastModifiedIso(absPath) {
  if (_gitDateCache.has(absPath)) return _gitDateCache.get(absPath);
  let iso = null;
  try {
    const out = execSync(`git log -1 --format=%cI -- "${absPath}"`, {
      stdio: ['ignore', 'pipe', 'ignore'],
    }).toString().trim();
    if (out) iso = new Date(out).toISOString();
  } catch { /* git unavailable or file untracked */ }
  _gitDateCache.set(absPath, iso);
  return iso;
}

function collectContentUrls() {
  const urls = [];
  if (!fs.existsSync(CONTENT_PATH)) return urls;
  const langs = fs.readdirSync(CONTENT_PATH).filter(l => !l.startsWith('.') && !['destinations'].includes(l));
  const sectionFolders = ['packages','bus','services','landing','guides'];
  const routeBaseMap = {
    services: 'services',
    landing: 'services',
    guides: 'services',
  };
  for (const lang of langs) {
    const langRoot = path.join(CONTENT_PATH, lang);
    // Root-level markdown (posts at /lang/slug)
    const rootFiles = fs.readdirSync(langRoot).filter(f => f.endsWith('.md'));
    rootFiles.forEach(file => {
      const abs = path.join(langRoot, file);
      const fm = safeReadFrontmatter(abs);
      const slug = fm.slug || file.replace(/\.md$/, '');
      const lastmod = fm.lastUpdated || fm.date || gitLastModifiedIso(abs);
      const loc = `${BASE_URL}/${lang}/${slug}`;
      if (!shouldEmitCanonicalizedEntry(loc, fm)) return;
      urls.push({ loc, priority: '0.8', changefreq: 'weekly', lang, slug, type: 'root', lastmod });
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
        const lastmod = fm.lastUpdated || fm.date || gitLastModifiedIso(abs);
        const routeBase = routeBaseMap[folder] || folder;
        const loc = `${BASE_URL}/${lang}/${routeBase}/${slug}`;
        if (!shouldEmitCanonicalizedEntry(loc, fm)) return;
        urls.push({ loc, priority: '0.8', changefreq: 'weekly', lang, slug, folder: routeBase, type: 'section', lastmod });
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
            const isIndex = file.toLowerCase() === 'index.md';
            const slug = isIndex ? category : (fm.slug || file.replace(/\.md$/, ''));
            const lastmod = fm.lastUpdated || fm.date || gitLastModifiedIso(abs);
            // Map to /lang/city/destination/category/slug (e.g., /en/city/varanasi/tour-packages/same-day-tour)
            const categoryBase = `${BASE_URL}/${lang}/city/${destination}/${category}`;
            const loc = isIndex ? categoryBase : `${categoryBase}/${slug}`;
            if (!shouldEmitCanonicalizedEntry(loc, fm)) return;
            urls.push({
              loc,
              priority: '0.8',
              changefreq: 'weekly',
              lang,
              slug,
              destination,
              category,
              type: isIndex ? 'destination-index' : 'destination',
              lastmod,
            });
          });
        });
      });
    }
  });
  
  return urls;
}

async function generateSitemap() {
  const urlEntries = new Map();
  const contentUrls = collectContentUrls();
  const redirectMatchers = await loadRedirectMatchers();
  const isRedirectingLoc = (loc) => {
    const p = pathnameOfLoc(loc);
    return redirectMatchers.some(rx => rx.test(p));
  };

  const add = (loc, priority = '0.8', changefreq = 'weekly', meta = {}) => {
    urlEntries.set(loc, { priority, changefreq, ...meta });
  };

  // Core landings with hreflang - using proper ISO language-region codes
  add(`${BASE_URL}/`, '0.9', 'weekly', { hreflang: [
    { lang: 'x-default', url: `${BASE_URL}/` },
    { lang: 'en', url: `${BASE_URL}/en/` },
    { lang: 'en-IN', url: `${BASE_URL}/en/` },
    { lang: 'en-US', url: `${BASE_URL}/en/` },
    { lang: 'en-GB', url: `${BASE_URL}/en/` },
    { lang: 'en-AU', url: `${BASE_URL}/en/` },
    { lang: 'hi', url: `${BASE_URL}/hi/` },
    { lang: 'hi-IN', url: `${BASE_URL}/hi/` }
  ]});
  add(`${BASE_URL}/en/`, '0.7', 'weekly', { hreflang: [
    { lang: 'x-default', url: `${BASE_URL}/` },
    { lang: 'en', url: `${BASE_URL}/en/` },
    { lang: 'en-IN', url: `${BASE_URL}/en/` },
    { lang: 'en-US', url: `${BASE_URL}/en/` },
    { lang: 'en-GB', url: `${BASE_URL}/en/` },
    { lang: 'en-AU', url: `${BASE_URL}/en/` },
    { lang: 'hi', url: `${BASE_URL}/hi/` },
    { lang: 'hi-IN', url: `${BASE_URL}/hi/` }
  ]});
  add(`${BASE_URL}/hi/`, '0.7', 'weekly', { hreflang: [
    { lang: 'x-default', url: `${BASE_URL}/` },
    { lang: 'en', url: `${BASE_URL}/en/` },
    { lang: 'en-IN', url: `${BASE_URL}/en/` },
    { lang: 'en-US', url: `${BASE_URL}/en/` },
    { lang: 'en-GB', url: `${BASE_URL}/en/` },
    { lang: 'en-AU', url: `${BASE_URL}/en/` },
    { lang: 'hi', url: `${BASE_URL}/hi/` },
    { lang: 'hi-IN', url: `${BASE_URL}/hi/` }
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

  // Content-derived URLs with hreflang - using proper ISO codes to prevent duplicate content
  contentUrls.forEach(u => {
    const key = `${u.type}:${u.folder || ''}:${u.destination || ''}:${u.category || ''}:${u.slug}`;
    const alternates = hreflangMap.get(key);
    const hreflang = [];
    
    // Add alternates for all available languages with regional codes
    if (alternates.en) {
      hreflang.push({ lang: 'en', url: alternates.en });
      hreflang.push({ lang: 'en-IN', url: alternates.en });
      hreflang.push({ lang: 'en-US', url: alternates.en });
      hreflang.push({ lang: 'en-GB', url: alternates.en });
      hreflang.push({ lang: 'en-AU', url: alternates.en });
    }
    if (alternates.hi) {
      hreflang.push({ lang: 'hi', url: alternates.hi });
      hreflang.push({ lang: 'hi-IN', url: alternates.hi });
    }
    
    // Add x-default (prefer EN if available, otherwise use current)
    if (alternates.en) {
      hreflang.push({ lang: 'x-default', url: alternates.en });
    } else {
      hreflang.push({ lang: 'x-default', url: u.loc });
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
    { lang: 'en-IN', url: `${BASE_URL}/en/` },
    { lang: 'en-US', url: `${BASE_URL}/en/` },
    { lang: 'en-GB', url: `${BASE_URL}/en/` },
    { lang: 'en-AU', url: `${BASE_URL}/en/` },
    { lang: 'hi', url: `${BASE_URL}/hi/` },
    { lang: 'hi-IN', url: `${BASE_URL}/hi/` }
  ]});

  // Drop any URL that immediately 301s (redirect source) so we never advertise a
  // redirecting URL to crawlers, and scrub redirecting hreflang alternates.
  let removedRedirecting = 0;
  for (const loc of Array.from(urlEntries.keys())) {
    if (isRedirectingLoc(loc)) {
      urlEntries.delete(loc);
      removedRedirecting++;
    }
  }
  for (const meta of urlEntries.values()) {
    if (Array.isArray(meta.hreflang) && meta.hreflang.length) {
      meta.hreflang = meta.hreflang.filter(alt => !isRedirectingLoc(alt.url));
      if (meta.hreflang.length <= 1) meta.hreflang = [];
    }
  }

  // Build XML with hreflang support
  const sorted = Array.from(urlEntries.keys()).sort();
  const body = sorted.map(loc => {
    const { priority, changefreq, hreflang, lastmod } = urlEntries.get(loc);

    // Resolve <lastmod> from a real date only. If none is known we OMIT the tag
    // rather than emit the build time — a build-time lastmod churns every deploy
    // and falsely signals to crawlers that every page changed. Future dates are
    // capped to now, since they look broken to crawlers.
    let finalLastmod = null;
    if (lastmod) {
      const d = new Date(lastmod);
      if (!isNaN(d.getTime())) {
        finalLastmod = d.getTime() > Date.now() ? new Date().toISOString() : d.toISOString();
      }
    }

    let urlBlock = `  <url>\n    <loc>${loc}</loc>`;
    if (finalLastmod) urlBlock += `\n    <lastmod>${finalLastmod}</lastmod>`;
    urlBlock += `\n    <priority>${priority}</priority>\n    <changefreq>${changefreq}</changefreq>`;
    
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

  SITEMAP_OUTPUT_PATHS.forEach((outPath) => {
    fs.writeFileSync(outPath, xml);
  });

  console.log('Sitemap regenerated with hreflang tags. URLs:', sorted.length);
  if (removedRedirecting) {
    console.log(`Excluded ${removedRedirecting} redirecting URL(s) from sitemap.`);
  }
  console.log('Sitemap outputs:');
  SITEMAP_OUTPUT_PATHS.forEach((p) => console.log('-', p));
}

generateSitemap().catch((e) => {
  console.error('Sitemap generation failed:', e);
  process.exit(1);
});
