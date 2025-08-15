#!/usr/bin/env node
/*
  Update all JSON-LD files under content/en/json to ensure
  - BreadcrumbList with category-aware trail (Guides / Services / Packages) using configurable routes
  - Wrap into @graph when needed
  - Normalize publisher to the business Organization (Kashi Taxi | Vinayak Travels Varanasi) with a stable @id
*/

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const DIR = path.join(ROOT, 'content', 'en', 'json');
const DEFAULT_BASE = 'https://www.kashitaxi.in';
const CONFIG_PATH = path.join(ROOT, 'config', 'breadcrumbs.config.json');

// Load config with sane defaults
function loadConfig() {
  const defaults = {
    baseUrl: DEFAULT_BASE,
    categories: {
      guides: { label: 'Travel Guides', path: '/en/', enabled: true },
      services: { label: 'Services', path: '/en/services/', enabled: false },
      packages: { label: 'Packages', path: '/en/packages/', enabled: false }
    }
  };
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const raw = fs.readFileSync(CONFIG_PATH, 'utf8');
      const userCfg = JSON.parse(raw);
      return { ...defaults, ...userCfg, categories: { ...defaults.categories, ...(userCfg.categories || {}) } };
    }
  } catch (e) {
    console.warn('Breadcrumbs config invalid, using defaults:', e.message);
  }
  return defaults;
}

const CFG = loadConfig();

// Canonical Organization node to reference as publisher across pages
const ORG = {
  '@type': 'Organization',
  '@id': `${CFG.baseUrl}#organization`,
  name: 'Kashi Taxi | Vinayak Travels Varanasi',
  legalName: 'Vinayak Travels Varanasi',
  alternateName: ['Kashi Taxi'],
  url: `${CFG.baseUrl}/`,
  logo: {
    '@type': 'ImageObject',
    url: `${CFG.baseUrl}/favicon.jpeg`
  },
  sameAs: [
    'https://maps.app.goo.gl/gbmqXgHE8Nzq5NrbA'
  ]
};

function walk(dir, acc = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (/\.(json|jsonld)$/i.test(e.name)) acc.push(p);
  }
  return acc;
}

function toTitle(str) {
  return str
    .replace(/[-_/]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function ensureArray(x) { return Array.isArray(x) ? x : [x]; }

function getPageUrl(data, filePath, slug) {
  // Try @graph BlogPosting/WebPage mainEntityOfPage.@id
  if (data['@graph']) {
    const node = data['@graph'].find(n => {
      const t = n['@type'];
      return t === 'BlogPosting' || t === 'WebPage' || (Array.isArray(t) && (t.includes('BlogPosting') || t.includes('WebPage')));
    });
    if (node && node.mainEntityOfPage && node.mainEntityOfPage['@id']) return node.mainEntityOfPage['@id'];
    if (node && node['@id'] && typeof node['@id'] === 'string') {
      return node['@id'].split('#')[0];
    }
  }
  // Non-graph fallback
  if (data.mainEntityOfPage && data.mainEntityOfPage['@id']) return data.mainEntityOfPage['@id'];
  // Construct from slug
  return `${CFG.baseUrl}/en/${slug}/`;
}

function getTitle(data, slug) {
  if (data.headline) return data.headline;
  if (data.name) return data.name;
  if (data['@graph']) {
    const node = data['@graph'].find(n => n.headline || n.name);
    if (node) return node.headline || node.name;
  }
  return toTitle(slug);
}

function ensureOrgInGraph(graph) {
  const hasOrg = graph.some(n => n['@id'] === ORG['@id']);
  if (!hasOrg) graph.push(ORG);
}

function normalizePublisher(node, graph) {
  if (!node) return;
  ensureOrgInGraph(graph);
  if (!node.publisher || typeof node.publisher !== 'object') {
    node.publisher = { '@type': 'Organization', '@id': ORG['@id'], name: ORG.name };
    return;
  }
  node.publisher['@type'] = 'Organization';
  node.publisher['@id'] = ORG['@id'];
  node.publisher.name = ORG.name;
}

// Heuristic classification for breadcrumb middle tier
function classifyCategory(pageUrl, title, graph) {
  const url = (pageUrl || '').toLowerCase();
  const ttl = (title || '').toLowerCase();

  // Force guides for Place-like content (temples, attractions)
  const forceGuidesTypes = ['Place', 'HinduTemple', 'TouristAttraction', 'LandmarksOrHistoricalBuildings'];
  const hasType = (t) => graph && graph.some(n => {
    const ty = n['@type'];
    return ty === t || (Array.isArray(ty) && ty.includes(t));
  });
  if (forceGuidesTypes.some(hasType)) return 'guides';

  if (hasType('Service') || hasType('TaxiService')) return 'services';

  const serviceHints = ['taxi', 'cab', 'airport', 'outstation', 'fare', 'price', 'charges', 'rental', 'bike', 'scooty', 'booking'];
  if (serviceHints.some(h => url.includes(h))) return 'services';

  const packageHints = ['package', 'tour', 'itinerary', 'day-tour'];
  if (packageHints.some(h => url.includes(h) || ttl.includes(h))) return 'packages';

  const guideHints = ['guide', 'timings', 'best', 'ghat', 'aarti', 'boat', 'things to do', 'how to', 'temple'];
  if (guideHints.some(h => url.includes(h) || ttl.includes(h))) return 'guides';

  return 'guides';
}

function categoryParent(category) {
  const cfgCat = CFG.categories[category] || CFG.categories.guides;
  if (!cfgCat.enabled || !cfgCat.path) return CFG.categories.guides;
  return cfgCat;
}

function joinUrl(base, pathPart) {
  const b = (base || '').replace(/\/+$/, '');
  const p = (pathPart || '').replace(/^\/+/, '');
  return p ? `${b}/${p}` : `${b}/`;
}

function buildBreadcrumbs(pageUrl, title, category) {
  const parent = categoryParent(category);
  const parentItem = joinUrl(CFG.baseUrl, parent.path);
  return {
    '@type': 'BreadcrumbList',
    '@id': `${pageUrl}#breadcrumbs`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: joinUrl(CFG.baseUrl, '/') },
      { '@type': 'ListItem', position: 2, name: parent.label, item: parentItem },
      { '@type': 'ListItem', position: 3, name: title.replace(/\s+/g, ' ').trim(), item: pageUrl }
    ]
  };
}

function processFile(filePath) {
  const slug = path.basename(filePath).replace(/\.(json|jsonld)$/i, '');
  let raw = fs.readFileSync(filePath, 'utf8');
  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    console.error('Skip (invalid JSON):', filePath);
    return false;
  }

  // Normalize into @graph structure
  let graph = [];
  if (data['@graph']) {
    graph = data['@graph'];
  } else {
    graph = [Object.fromEntries(Object.entries(data).filter(([k]) => k !== '@context'))];
  }

  // Ensure org exists in graph before normalization
  ensureOrgInGraph(graph);

  // Normalize publisher on primary node
  const primary = graph.find(n => {
    const t = n['@type'];
    return t === 'BlogPosting' || (Array.isArray(t) && t.includes('BlogPosting')) || t === 'Article' || t === 'WebPage' || t === 'Service' || t === 'Place' || t === 'HinduTemple' || t === 'TouristAttraction';
  });
  if (primary) normalizePublisher(primary, graph);

  const pageUrl = getPageUrl({ '@graph': graph }, filePath, slug);
  const title = getTitle({ '@graph': graph }, slug);
  const category = classifyCategory(pageUrl, title, graph);

  // Remove existing BreadcrumbList nodes to avoid duplicates
  graph = graph.filter(n => n['@type'] !== 'BreadcrumbList');
  graph.push(buildBreadcrumbs(pageUrl, title, category));

  const out = { '@context': 'https://schema.org', '@graph': graph };
  fs.writeFileSync(filePath, JSON.stringify(out, null, 2));
  return true;
}

function main() {
  if (!fs.existsSync(DIR)) {
    console.error('Directory not found:', DIR);
    process.exit(1);
  }
  const files = walk(DIR);
  let updated = 0;
  for (const f of files) {
    if (processFile(f)) updated++;
  }
  console.log(`Updated ${updated} JSON-LD file(s).`);
}

main();
