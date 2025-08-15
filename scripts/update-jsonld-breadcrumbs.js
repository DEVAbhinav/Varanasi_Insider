#!/usr/bin/env node
/*
  Update all JSON-LD files under content/en/json to ensure
  - BreadcrumbList with category-aware trail (Guides / Services / Packages)
  - Wrap into @graph when needed
  - Normalize publisher to the business Organization (Kashi Taxi | Vinayak Travels Varanasi) with a stable @id
*/

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const DIR = path.join(ROOT, 'content', 'en', 'json');
const BASE = 'https://www.kashitaxi.in';

// Canonical Organization node to reference as publisher across pages
const ORG = {
  '@type': 'Organization',
  '@id': `${BASE}#organization`,
  name: 'Kashi Taxi | Vinayak Travels Varanasi',
  legalName: 'Vinayak Travels Varanasi',
  // Add recognizable alternates if needed
  alternateName: ['Kashi Taxi'],
  url: `${BASE}/`,
  logo: {
    '@type': 'ImageObject',
    url: `${BASE}/favicon.jpeg`
  },
  sameAs: [
    // Google Business Profile short URL
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
  return `${BASE}/en/${slug}/`;
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
  // Ensure the canonical Organization node exists in the graph
  ensureOrgInGraph(graph);

  // If no publisher or not an object, reference the org by @id
  if (!node.publisher || typeof node.publisher !== 'object') {
    node.publisher = { '@type': 'Organization', '@id': ORG['@id'], name: ORG.name };
    return;
  }
  // Normalize existing publisher object
  node.publisher['@type'] = 'Organization';
  node.publisher['@id'] = ORG['@id'];
  node.publisher.name = ORG.name;
}

// Heuristic classification for breadcrumb middle tier
function classifyCategory(pageUrl, title, graph) {
  const url = (pageUrl || '').toLowerCase();
  const ttl = (title || '').toLowerCase();

  // Type-based hints
  const hasType = (t) => graph && graph.some(n => {
    const ty = n['@type'];
    return ty === t || (Array.isArray(ty) && ty.includes(t));
  });

  if (hasType('Service') || hasType('TaxiService')) return 'services';

  // URL hints for services
  const serviceHints = ['taxi', 'cab', 'airport', 'outstation', 'fare', 'price', 'charges', 'rental', 'bike', 'scooty', 'booking'];
  if (serviceHints.some(h => url.includes(h))) return 'services';

  // Packages
  const packageHints = ['package', 'tour', 'itinerary', 'day-tour'];
  if (packageHints.some(h => url.includes(h) || ttl.includes(h))) return 'packages';

  // Guides default
  const guideHints = ['guide', 'timings', 'best', 'ghat', 'aarti', 'boat', 'things to do', 'how to'];
  if (guideHints.some(h => url.includes(h) || ttl.includes(h))) return 'guides';

  return 'guides';
}

function categoryParent(category) {
  switch (category) {
    case 'services': return { name: 'Services', item: `${BASE}/en/services/` };
    case 'packages': return { name: 'Packages', item: `${BASE}/en/packages/` };
    case 'guides':
    default: return { name: 'Travel Guides', item: `${BASE}/en/` };
  }
}

function buildBreadcrumbs(pageUrl, title, category) {
  const parent = categoryParent(category);
  return {
    '@type': 'BreadcrumbList',
    '@id': `${pageUrl}#breadcrumbs`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE}/` },
      { '@type': 'ListItem', position: 2, name: parent.name, item: parent.item },
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
    return t === 'BlogPosting' || (Array.isArray(t) && t.includes('BlogPosting')) || t === 'Article' || t === 'WebPage' || t === 'Service';
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
