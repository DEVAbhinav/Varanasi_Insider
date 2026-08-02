#!/usr/bin/env node
/**
 * Internal Link Checker for Varanasi_Insider
 * Scans content and components for internal links and reports 404s
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.join(__dirname, '..');
const CONTENT_DIR = path.join(PROJECT_ROOT, 'content');
const PAGES_DIR = path.join(PROJECT_ROOT, 'pages');
const COMPONENTS_DIR = path.join(PROJECT_ROOT, 'components');

// Collect all valid routes
const validRoutes = new Set();
const brokenLinks = [];
const linkSources = new Map(); // Track where each broken link appears

// Helper: recursively collect files
function collectFiles(dir, extensions, results = []) {
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === '.next') continue;
      collectFiles(fullPath, extensions, results);
    } else if (extensions.some(ext => entry.name.endsWith(ext))) {
      results.push(fullPath);
    }
  }
  return results;
}

// Build valid routes from content markdown files
function buildValidRoutesFromContent() {
  const langs = ['en', 'hi'];
  
  for (const lang of langs) {
    const langDir = path.join(CONTENT_DIR, lang);
    if (!fs.existsSync(langDir)) continue;
    
    const mdFiles = collectFiles(langDir, ['.md']);
    for (const file of mdFiles) {
      const relativePath = path.relative(langDir, file);
      const slug = path.basename(file, '.md').toLowerCase();
      
      // index.md backs the directory hub route (e.g. destinations/varanasi/taxi/index.md
      // serves /en/city/varanasi/taxi), so register that instead of a slug route.
      if (slug === 'index') {
        const dirPath = path.dirname(relativePath);
        if (dirPath !== '.') {
          const routePath = dirPath.replace(/^destinations\//, 'city/').replace(/\\/g, '/');
          validRoutes.add(`/${lang}/${routePath}`);
          validRoutes.add(`/${lang}/${dirPath.replace(/\\/g, '/')}`);
        }
        continue;
      }
      
      // Determine route based on folder structure
      const dirPath = path.dirname(relativePath);
      
      if (dirPath === '.') {
        // Top-level: /en/slug or /hi/slug
        validRoutes.add(`/${lang}/${slug}`);
      } else {
        // Nested: map destinations/varanasi/taxi/foo -> city/varanasi/taxi/foo
        let routePath = dirPath
          .replace(/^destinations\//, 'city/')
          .replace(/\\/g, '/');
        validRoutes.add(`/${lang}/${routePath}/${slug}`);
        // Also add the old destinations path as a redirect target
        validRoutes.add(`/${lang}/${dirPath.replace(/\\/g, '/')}/${slug}`);
      }
    }
  }
  
  // Add known static pages
  const staticPages = [
    '/', '/en', '/hi',
    '/en/about', '/hi/about',
    '/en/contact', '/hi/contact',
    '/en/services', '/hi/services',
    '/hi/packages',
    '/pink-taxi-varanasi',
    '/bike-rentals-varanasi',
    '/banaras-tour-package',
    '/banaras-travel-agency',
    '/kasi-tour-package',
    '/booking',
  ];
  staticPages.forEach(p => validRoutes.add(p));
}

// Static asset patterns to exclude (not page routes)
const STATIC_ASSET_PATTERNS = [
  /^\/images\//,
  /^\/icons\//,
  /^\/fonts\//,
  /^\/favicon/,
  /^\/robots\.txt/,
  /^\/sitemap/,
  /^\/api\//,
  /^\/_next\//,
  /^\/public\//,
  /\.(jpeg|jpg|png|gif|svg|webp|ico|pdf|mp4|mp3|woff|woff2|ttf|eot)$/i,
];

function isStaticAsset(href) {
  const cleanHref = href.split(' ')[0].split('"')[0]; // Clean up markdown image alt text
  return STATIC_ASSET_PATTERNS.some(pattern => pattern.test(cleanHref));
}

// Extract internal links from file content
function extractInternalLinks(content, filePath) {
  const links = [];
  
  // Markdown links: [text](/path) or [text](path)
  const mdLinkRegex = /\[([^\]]*)\]\(([^)]+)\)/g;
  let match;
  while ((match = mdLinkRegex.exec(content)) !== null) {
    let href = match[2].split('#')[0].split('?')[0]; // Remove anchors and query params
    href = href.split(' ')[0].split('"')[0]; // Clean markdown image syntax
    if (href.startsWith('/') && !href.startsWith('//') && !isStaticAsset(href)) {
      links.push({ href, source: filePath, line: getLineNumber(content, match.index) });
    }
  }
  
  // HTML/JSX href attributes: href="/path" or href='/path'
  const hrefRegex = /href=["']([^"']+)["']/g;
  while ((match = hrefRegex.exec(content)) !== null) {
    const href = match[1].split('#')[0].split('?')[0];
    if (href.startsWith('/') && !href.startsWith('//') && !href.includes('${') && !isStaticAsset(href)) {
      links.push({ href, source: filePath, line: getLineNumber(content, match.index) });
    }
  }
  
  // Next.js Link to prop: to="/path"
  const toRegex = /to=["']([^"']+)["']/g;
  while ((match = toRegex.exec(content)) !== null) {
    const href = match[1].split('#')[0].split('?')[0];
    if (href.startsWith('/') && !href.startsWith('//') && !isStaticAsset(href)) {
      links.push({ href, source: filePath, line: getLineNumber(content, match.index) });
    }
  }
  
  return links;
}

function getLineNumber(content, index) {
  return content.substring(0, index).split('\n').length;
}

// Normalize route for comparison
function normalizeRoute(route) {
  return route
    .toLowerCase()
    .replace(/\/+$/, '') // Remove trailing slashes
    .replace(/\/+/g, '/'); // Collapse multiple slashes
}

// Check if route is valid
function isValidRoute(href) {
  const normalized = normalizeRoute(href);
  
  // Direct match
  if (validRoutes.has(normalized)) return true;
  
  // Check with/without trailing slash
  if (validRoutes.has(normalized + '/')) return true;
  if (normalized.endsWith('/') && validRoutes.has(normalized.slice(0, -1))) return true;
  
  // Dynamic route patterns that are handled by Next.js
  const dynamicPatterns = [
    /^\/en\/city\/[^/]+\/taxi\/[^/]+$/,
    /^\/hi\/city\/[^/]+\/taxi\/[^/]+$/,
    /^\/en\/city\/[^/]+\/events\/[^/]+$/,
    /^\/hi\/city\/[^/]+\/events\/[^/]+$/,
    /^\/en\/city\/[^/]+\/activities\/[^/]+$/,
    /^\/hi\/city\/[^/]+\/activities\/[^/]+$/,
    /^\/en\/city\/[^/]+\/sightseeing\/[^/]+$/,
    /^\/hi\/city\/[^/]+\/sightseeing\/[^/]+$/,
    /^\/en\/city\/[^/]+\/travel-guide\/[^/]+$/,
    /^\/hi\/city\/[^/]+\/travel-guide\/[^/]+$/,
    /^\/en\/city\/[^/]+\/tour-packages\/[^/]+$/,
    /^\/hi\/city\/[^/]+\/tour-packages\/[^/]+$/,
    /^\/en\/services\/[^/]+$/,
    /^\/hi\/services\/[^/]+$/,
    /^\/en\/packages\/[^/]+$/,
    /^\/hi\/packages\/[^/]+$/,
    /^\/en\/bus\/[^/]+$/,
    /^\/hi\/bus\/[^/]+$/,
  ];
  
  for (const pattern of dynamicPatterns) {
    if (pattern.test(normalized)) {
      // Check if content file exists for this route
      return checkContentExists(normalized);
    }
  }
  
  return false;
}

// Check if content file exists for a given route
function checkContentExists(route) {
  const normalized = normalizeRoute(route);
  
  // Parse route: /:lang/:category/:destination/:subcategory/:slug
  const parts = normalized.split('/').filter(Boolean);
  if (parts.length < 2) return false;
  
  const lang = parts[0];
  const slug = parts[parts.length - 1];
  
  // Try to find the markdown file
  const possiblePaths = [];
  
  if (parts.length === 2) {
    // /en/slug -> content/en/slug.md
    possiblePaths.push(path.join(CONTENT_DIR, lang, `${slug}.md`));
  } else if (parts[1] === 'city' && parts.length >= 5) {
    // /en/city/varanasi/taxi/slug -> content/en/destinations/varanasi/taxi/slug.md
    const destination = parts[2];
    const category = parts[3];
    possiblePaths.push(path.join(CONTENT_DIR, lang, 'destinations', destination, category, `${slug}.md`));
  } else if (parts[1] === 'services') {
    possiblePaths.push(path.join(CONTENT_DIR, lang, 'services', `${slug}.md`));
  } else if (parts[1] === 'packages') {
    possiblePaths.push(path.join(CONTENT_DIR, lang, 'packages', `${slug}.md`));
  } else if (parts[1] === 'bus') {
    possiblePaths.push(path.join(CONTENT_DIR, lang, 'bus', `${slug}.md`));
  }
  
  // Also search recursively for the slug
  const allMdFiles = collectFiles(path.join(CONTENT_DIR, lang), ['.md']);
  for (const file of allMdFiles) {
    if (path.basename(file, '.md').toLowerCase() === slug) {
      return true;
    }
  }
  
  return possiblePaths.some(p => fs.existsSync(p));
}

// Main scan function
function scanForBrokenLinks() {
  console.log('🔍 Building valid routes from content...\n');
  buildValidRoutesFromContent();
  console.log(`   Found ${validRoutes.size} valid routes\n`);
  
  console.log('🔍 Scanning files for internal links...\n');
  
  // Scan content files
  const contentFiles = collectFiles(CONTENT_DIR, ['.md', '.json']);
  // Scan component files
  const componentFiles = collectFiles(COMPONENTS_DIR, ['.js', '.jsx', '.tsx']);
  // Scan pages
  const pageFiles = collectFiles(PAGES_DIR, ['.js', '.jsx', '.tsx']);
  
  const allFiles = [...contentFiles, ...componentFiles, ...pageFiles];
  console.log(`   Scanning ${allFiles.length} files...\n`);
  
  const allLinks = [];
  
  for (const file of allFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const links = extractInternalLinks(content, file);
    allLinks.push(...links);
  }
  
  console.log(`   Found ${allLinks.length} internal links\n`);
  
  // Check each link
  const checkedLinks = new Set();
  
  for (const link of allLinks) {
    const normalized = normalizeRoute(link.href);
    
    // Skip if already checked
    if (checkedLinks.has(normalized)) {
      if (!isValidRoute(link.href)) {
        // Add source to existing broken link
        if (!linkSources.has(normalized)) {
          linkSources.set(normalized, []);
        }
        linkSources.get(normalized).push({ file: link.source, line: link.line });
      }
      continue;
    }
    
    checkedLinks.add(normalized);
    
    if (!isValidRoute(link.href)) {
      brokenLinks.push(link.href);
      linkSources.set(normalized, [{ file: link.source, line: link.line }]);
    }
  }
  
  // Report results
  console.log('=' .repeat(80));
  console.log('📊 INTERNAL LINK AUDIT RESULTS');
  console.log('='.repeat(80));
  console.log(`\nTotal unique links checked: ${checkedLinks.size}`);
  console.log(`Broken links found: ${brokenLinks.length}\n`);
  
  if (brokenLinks.length === 0) {
    console.log('✅ No broken internal links found!\n');
  } else {
    console.log('❌ BROKEN LINKS:\n');
    
    // Group by pattern
    const grouped = {
      destinations: [],
      services: [],
      other: []
    };
    
    for (const link of brokenLinks) {
      const normalized = normalizeRoute(link);
      const sources = linkSources.get(normalized) || [];
      
      if (link.includes('/destinations/')) {
        grouped.destinations.push({ link, sources });
      } else if (link.includes('/services/')) {
        grouped.services.push({ link, sources });
      } else {
        grouped.other.push({ link, sources });
      }
    }
    
    if (grouped.destinations.length > 0) {
      console.log('📁 DESTINATIONS PATH ISSUES (need /city/ instead of /destinations/):');
      console.log('-'.repeat(60));
      for (const { link, sources } of grouped.destinations) {
        console.log(`  ${link}`);
        for (const src of sources.slice(0, 2)) {
          const relPath = path.relative(PROJECT_ROOT, src.file);
          console.log(`    └─ ${relPath}:${src.line}`);
        }
        if (sources.length > 2) {
          console.log(`    └─ ...and ${sources.length - 2} more locations`);
        }
      }
      console.log();
    }
    
    if (grouped.services.length > 0) {
      console.log('🔧 SERVICES PATH ISSUES:');
      console.log('-'.repeat(60));
      for (const { link, sources } of grouped.services) {
        console.log(`  ${link}`);
        for (const src of sources.slice(0, 2)) {
          const relPath = path.relative(PROJECT_ROOT, src.file);
          console.log(`    └─ ${relPath}:${src.line}`);
        }
        if (sources.length > 2) {
          console.log(`    └─ ...and ${sources.length - 2} more locations`);
        }
      }
      console.log();
    }
    
    if (grouped.other.length > 0) {
      console.log('📄 OTHER BROKEN LINKS:');
      console.log('-'.repeat(60));
      for (const { link, sources } of grouped.other) {
        console.log(`  ${link}`);
        for (const src of sources.slice(0, 2)) {
          const relPath = path.relative(PROJECT_ROOT, src.file);
          console.log(`    └─ ${relPath}:${src.line}`);
        }
        if (sources.length > 2) {
          console.log(`    └─ ...and ${sources.length - 2} more locations`);
        }
      }
      console.log();
    }
    
    // Summary
    console.log('='.repeat(80));
    console.log('SUMMARY:');
    console.log(`  - Destinations path issues: ${grouped.destinations.length}`);
    console.log(`  - Services path issues: ${grouped.services.length}`);
    console.log(`  - Other broken links: ${grouped.other.length}`);
    console.log('='.repeat(80));
  }
  
  // Write detailed report to file
  const reportPath = path.join(PROJECT_ROOT, 'internal-link-audit.json');
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalLinksChecked: checkedLinks.size,
      brokenLinksCount: brokenLinks.length,
      validRoutesCount: validRoutes.size
    },
    brokenLinks: brokenLinks.map(link => ({
      url: link,
      sources: (linkSources.get(normalizeRoute(link)) || []).map(s => ({
        file: path.relative(PROJECT_ROOT, s.file),
        line: s.line
      }))
    }))
  };
  
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n📄 Detailed report saved to: internal-link-audit.json\n`);
}

// Run
scanForBrokenLinks();
