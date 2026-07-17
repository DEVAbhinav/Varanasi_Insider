#!/usr/bin/env node
/**
 * generate-link-graph.js — build-time generator for the automated internal-link
 * & SEO-footer system. Runs like the sitemap (npm `prebuild`), with ZERO manual
 * steps: it re-discovers every page and re-joins the latest Google Search Console
 * export on every build.
 *
 * Pipeline:
 *   1. Crawl content/**  (markdown, routing replicated from the sitemap) and
 *      pages/**  (static JSX/TS routes) → one node per live URL.
 *   2. Auto-select the NEWEST data/gsc/<date>/keyword-page-map.csv and join it:
 *      per page → total clicks, total impressions, best (min) position, dominant
 *      intent, and the best (highest-click) query as a natural anchor.
 *   3. Classify each node: destination, category, productType, intent.
 *   4. Score priority (curated pin > gsc clicks > commercial productType > recency).
 *   5. Apply the curated overlay in config/seoDirectory.js to build per-language
 *      footer groups (pins + GSC-ranked backfill) and cross-sell/related data.
 *   6. Emit data/generated/seo-link-graph.json (consumed by Footer + RelatedLinks).
 *
 * Output is deterministic and committed so `next build` and `next dev` always
 * have data even without a fresh GSC export.
 */
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const ROOT = path.join(__dirname, '..');
const CONTENT_PATH = path.join(ROOT, 'content');
const PAGES_PATH = path.join(ROOT, 'pages');
const GSC_ROOT = path.join(ROOT, 'data', 'gsc');
const OUT_DIR = path.join(ROOT, 'data', 'generated');
const OUT_FILE = path.join(OUT_DIR, 'seo-link-graph.json');

const {
  FOOTER_GROUPS,
  CROSS_SELL_BY_CATEGORY,
  EXCLUDE_PATHS,
  EXCLUDE_PATTERNS,
} = require('../config/seoDirectory.js');

const SMALL_WORDS = new Set(['in', 'on', 'to', 'for', 'and', 'the', 'of', 'a', 'at', 'by', 'from', 'with', 'near']);

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------
function safeFrontmatter(abs) {
  try { return matter(fs.readFileSync(abs, 'utf-8')).data || {}; } catch { return {}; }
}

function titleCase(str) {
  return String(str)
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .map((w, i) => {
      const lower = w.toLowerCase();
      if (i !== 0 && SMALL_WORDS.has(lower)) return lower;
      if (/^\d/.test(w)) return w; // keep numbers/units as-is (2026, 17)
      return w.charAt(0).toUpperCase() + w.slice(1);
    })
    .join(' ');
}

function normPath(p) {
  if (!p) return p;
  let s = p.replace(/^https?:\/\/[^/]+/, '');
  s = s.replace(/\/+$/, '');
  return s || '/';
}

function isExcluded(p) {
  if (EXCLUDE_PATHS.includes(p)) return true;
  return EXCLUDE_PATTERNS.some((frag) => p.includes(frag));
}

// ---------------------------------------------------------------------------
// 1. page discovery
// ---------------------------------------------------------------------------
function collectContentNodes() {
  const nodes = [];
  if (!fs.existsSync(CONTENT_PATH)) return nodes;
  const langs = fs.readdirSync(CONTENT_PATH).filter((l) => !l.startsWith('.') && l !== 'destinations');
  const sectionRoute = { services: 'services', landing: 'services', guides: 'services' };
  const sectionFolders = ['packages', 'bus', 'services', 'landing', 'guides'];

  for (const lang of langs) {
    const langRoot = path.join(CONTENT_PATH, lang);
    if (!fs.statSync(langRoot).isDirectory()) continue;

    // root-level markdown -> /lang/slug
    for (const file of fs.readdirSync(langRoot).filter((f) => f.endsWith('.md'))) {
      const abs = path.join(langRoot, file);
      const fm = safeFrontmatter(abs);
      const slug = fm.slug || file.replace(/\.md$/, '');
      nodes.push(makeNode({ lang, slug, fm, urlPath: `/${lang}/${slug}`, kind: 'root' }));
    }
    // section folders
    for (const folder of sectionFolders) {
      const dir = path.join(langRoot, folder);
      if (!fs.existsSync(dir)) continue;
      for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.md'))) {
        const abs = path.join(dir, file);
        const fm = safeFrontmatter(abs);
        const slug = fm.slug || file.replace(/\.md$/, '');
        const base = sectionRoute[folder] || folder;
        nodes.push(makeNode({ lang, slug, fm, urlPath: `/${lang}/${base}/${slug}`, kind: base, folder: base }));
      }
    }
  }

  // destinations -> /lang/city/dest/category/slug
  for (const lang of ['en', 'hi']) {
    const destRoot = path.join(CONTENT_PATH, lang, 'destinations');
    if (!fs.existsSync(destRoot)) continue;
    for (const dest of fs.readdirSync(destRoot).filter((d) => !d.startsWith('.') && fs.statSync(path.join(destRoot, d)).isDirectory())) {
      const destDir = path.join(destRoot, dest);
      for (const cat of fs.readdirSync(destDir).filter((c) => !c.startsWith('.') && fs.statSync(path.join(destDir, c)).isDirectory())) {
        const catDir = path.join(destDir, cat);
        for (const file of fs.readdirSync(catDir).filter((f) => f.endsWith('.md'))) {
          const abs = path.join(catDir, file);
          const fm = safeFrontmatter(abs);
          const slug = fm.slug || file.replace(/\.md$/, '');
          nodes.push(makeNode({ lang, slug, fm, urlPath: `/${lang}/city/${dest}/${cat}/${slug}`, kind: 'destination', destination: dest, destCategory: cat }));
        }
      }
    }
  }
  return nodes;
}

function collectPageRoutes(dir, base = '') {
  const routes = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (entry.name === 'api' || entry.name.startsWith('_') || entry.name.startsWith('[')) continue;
      routes.push(...collectPageRoutes(path.join(dir, entry.name), path.join(base, entry.name)));
    } else if (/\.(js|jsx|ts|tsx)$/i.test(entry.name) && !entry.name.startsWith('_') && !entry.name.startsWith('[')) {
      if (entry.name.includes('.backup.') || entry.name.endsWith('.d.ts')) continue;
      let route = '/' + path.join(base, entry.name).replace(/\\/g, '/').replace(/\.(js|jsx|ts|tsx)$/i, '');
      route = route.replace(/\/index$/i, '') || '/';
      const b = path.basename(route);
      if (['404', '500', '_error', '_document', '_app', 'sitemap.xml', 'booking'].includes(b)) continue;
      routes.push(route);
    }
  }
  return routes;
}

function collectStaticPageNodes(contentPaths) {
  const nodes = [];
  const seen = new Set(contentPaths);
  for (const route of collectPageRoutes(PAGES_PATH)) {
    const p = normPath(route);
    if (p === '/' || seen.has(p)) continue;
    // language of a bare page route: /en/... or /hi/... else language-neutral (en)
    const m = p.match(/^\/(en|hi)\//);
    const lang = m ? m[1] : 'en';
    const langNeutral = !m;
    const slug = p.split('/').filter(Boolean).pop();
    nodes.push(makeNode({ lang, slug, fm: {}, urlPath: p, kind: 'page', langNeutral }));
    seen.add(p);
  }
  return nodes;
}

// ---------------------------------------------------------------------------
// classification
// ---------------------------------------------------------------------------
function classify({ urlPath, slug, fm, destCategory }) {
  const s = slug.toLowerCase();
  const fmType = fm.productType || null;
  const fmCat = (fm.category || '').toLowerCase();

  // productType first (most specific), then derive category from it.
  let productType = fmType;
  if (!productType) {
    if (/^(about|contact|privacy-policy|terms|refund|disclaimer|sitemap)/.test(s) || /about-us|contact-us/.test(s)) productType = 'company';
    else if (/bike|scooty|scooter|rental/.test(s)) productType = 'bike';
    else if (/where-to-stay|dharamshala|guest-house|guesthouse|homestay|hotel|accommodation|stay-in/.test(s)) productType = 'accommodation';
    else if (/tempo|urbania|force-urbania|\d+-seater|-seater-/.test(s) || /tempo[- ]traveller/.test(s)) productType = 'vehicle';
    else if (/(package|group-tour|darshan-package|pind-daan|tour-package)/.test(s) || fmCat.includes('package')) productType = 'tour_package';
    else if (/(taxi|cab|transfer|airport-to)/.test(s) || /-to-[a-z-]+-(taxi|cab|fare)/.test(s)) productType = 'route_taxi';
    else if (/boat/.test(s)) productType = 'boat';
    else if (/(aarti|ghat)/.test(s)) productType = 'activity';
    else productType = 'guide';
  }

  // category
  let category = destCategory || null;
  if (!category) {
    switch (productType) {
      case 'company': category = 'company'; break;
      case 'bike': category = 'bike'; break;
      case 'accommodation': category = 'accommodation'; break;
      case 'vehicle': category = 'vehicle'; break;
      case 'tour_package': category = 'tour-packages'; break;
      case 'route_taxi': category = 'taxi'; break;
      case 'boat':
      case 'activity': category = 'activities'; break;
      default: category = fmCat || 'guide';
    }
  }
  return { category, productType };
}

// Footer/anchor labels must stay short. Strip SEO tails (| – : —) and clamp.
function shortLabel(text) {
  let t = String(text).split(/\s+[|–—]\s+|:\s+/)[0].trim();
  t = t.replace(/\s*\(20\d\d\)\s*$/, '').trim();
  if (t.length > 52) {
    const cut = t.slice(0, 52);
    t = cut.slice(0, cut.lastIndexOf(' ') > 20 ? cut.lastIndexOf(' ') : 52).trim() + '…';
  }
  return t;
}

function makeNode({ lang, slug, fm, urlPath, kind, folder, destination, destCategory, langNeutral }) {
  const p = normPath(urlPath);
  const { category, productType } = classify({ urlPath: p, slug, fm, destCategory });
  const commercial = ['route_taxi', 'tour_package', 'vehicle', 'boat', 'sightseeing', 'darshan', 'accommodation'].includes(productType);
  return {
    path: p,
    lang,
    slug,
    title: fm.title || titleCase(slug),
    kind,
    folder: folder || null,
    destination: destination || null,
    category,
    productType,
    commercial,
    noindex: fm.noindex === true || fm.draft === true,
    canonical: fm.canonical ? normPath(fm.canonical) : null,
    lastmod: fm.lastUpdated || fm.date || null,
    langNeutral: !!langNeutral,
    // GSC (filled later)
    clicks: 0,
    impressions: 0,
    position: null,
    intent: null,
    gscAnchor: null,
  };
}

// ---------------------------------------------------------------------------
// 2. GSC join
// ---------------------------------------------------------------------------
function latestKeywordMap() {
  if (!fs.existsSync(GSC_ROOT)) return null;
  const dated = fs.readdirSync(GSC_ROOT)
    .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d))
    .filter((d) => fs.existsSync(path.join(GSC_ROOT, d, 'keyword-page-map.csv')))
    .sort();
  if (!dated.length) return null;
  return { date: dated[dated.length - 1], file: path.join(GSC_ROOT, dated[dated.length - 1], 'keyword-page-map.csv') };
}

function parseCsv(text) {
  // simple CSV parser (handles quoted fields with commas)
  const rows = [];
  const lines = text.split(/\r?\n/).filter((l) => l.length);
  const header = splitCsvLine(lines[0]);
  for (let i = 1; i < lines.length; i++) {
    const cells = splitCsvLine(lines[i]);
    const obj = {};
    header.forEach((h, idx) => (obj[h] = cells[idx] ?? ''));
    rows.push(obj);
  }
  return rows;
}
function splitCsvLine(line) {
  const out = [];
  let cur = '', q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (q) {
      if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (c === '"') q = false;
      else cur += c;
    } else if (c === '"') q = true;
    else if (c === ',') { out.push(cur); cur = ''; }
    else cur += c;
  }
  out.push(cur);
  return out;
}

function joinGsc(nodes) {
  const map = latestKeywordMap();
  const byPath = new Map(nodes.map((n) => [n.path, n]));
  if (!map) return { date: null, matched: 0 };
  const rows = parseCsv(fs.readFileSync(map.file, 'utf-8'));
  const agg = new Map(); // path -> {clicks, impr, minPos, intents{}, best:{q,clicks}}
  for (const r of rows) {
    const p = normPath(r.mapped_page);
    if (!p) continue;
    const clicks = parseFloat(r.clicks) || 0;
    const impr = parseFloat(r.impressions) || 0;
    const pos = parseFloat(r.position) || null;
    let a = agg.get(p);
    if (!a) { a = { clicks: 0, impr: 0, minPos: null, intents: {}, best: { q: null, clicks: -1 } }; agg.set(p, a); }
    a.clicks += clicks; a.impr += impr;
    if (pos != null) a.minPos = a.minPos == null ? pos : Math.min(a.minPos, pos);
    const it = (r.intent || 'other').trim();
    a.intents[it] = (a.intents[it] || 0) + clicks + impr * 0.001;
    if (clicks > a.best.clicks) a.best = { q: r.query, clicks };
  }
  let matched = 0;
  for (const [p, a] of agg) {
    const n = byPath.get(p);
    if (!n) continue;
    matched++;
    n.clicks = Math.round(a.clicks);
    n.impressions = Math.round(a.impr);
    n.position = a.minPos != null ? Math.round(a.minPos * 10) / 10 : null;
    n.intent = Object.entries(a.intents).sort((x, y) => y[1] - x[1])[0]?.[0] || null;
    if (a.best.q) n.gscAnchor = titleCase(a.best.q);
  }
  return { date: map.date, matched };
}

// ---------------------------------------------------------------------------
// 4. priority score
// ---------------------------------------------------------------------------
function scoreNode(n) {
  let score = 0;
  score += Math.min(n.clicks, 500) * 4;           // proven demand dominates
  score += Math.min(n.impressions, 10000) * 0.02; // latent demand
  if (n.commercial) score += 40;                   // money pages
  if (n.intent === 'sales') score += 60;
  if (n.position != null && n.position <= 20 && n.position >= 8) score += 15; // page-2 boost target
  if (n.lastmod) {
    const days = (Date.now() - new Date(n.lastmod).getTime()) / 86400000;
    if (!Number.isNaN(days)) score += Math.max(0, 30 - days / 30);
  }
  return Math.round(score);
}

// ---------------------------------------------------------------------------
// 5. footer groups
// ---------------------------------------------------------------------------
const LANGS = ['en', 'hi'];

function localizePath(p, lang) {
  if (lang === 'en') return p;
  if (p.startsWith('/en/')) return '/hi/' + p.slice(4);
  return null; // language-neutral or already-hi: no hi equivalent to guarantee
}

function anchorFor(node) {
  // prefer natural GSC anchor, then title, then prettified slug — always clamped
  return shortLabel(node.gscAnchor || node.title || titleCase(node.slug));
}

function buildFooter(nodes) {
  const byPath = new Map(nodes.map((n) => [n.path, n]));
  const result = {};
  for (const lang of LANGS) {
    const groups = [];
    const usedGlobal = new Set(); // dedupe a page across all groups in this language
    // Pre-reserve EVERY pinned path (all groups) so GSC backfill never steals a
    // curated pin that belongs to a later group (e.g. Company at the end).
    const pinnedPaths = new Set();
    for (const g of FOOTER_GROUPS) {
      for (const pin of g.pins || []) {
        const lp = lang === 'en' ? pin.path : localizePath(pin.path, lang);
        if (lp) pinnedPaths.add(lp);
      }
    }
    for (const g of FOOTER_GROUPS) {
      const links = [];
      // pins (pins always win over any backfill placement)
      for (const pin of g.pins || []) {
        const lp = lang === 'en' ? pin.path : localizePath(pin.path, lang);
        if (!lp || usedGlobal.has(lp)) continue;
        const node = byPath.get(lp);
        if (!node || node.noindex) continue;
        // EN uses the curated keyword-rich label; other languages use the
        // localized page's own title/anchor so labels stay in that language.
        const label = lang === 'en' ? pin.label : anchorFor(node);
        links.push({ href: lp, label });
        usedGlobal.add(lp);
      }
      // backfill by facet, ranked by score
      if (g.fill) {
        const { category, productType, destination, max = 8 } = g.fill;
        const candidates = nodes
          .filter((n) => n.lang === lang && !n.noindex && !isExcluded(n.path)
            && !usedGlobal.has(n.path) && !pinnedPaths.has(n.path))
          .filter((n) => (!category || n.category === category)
            && (!productType || n.productType === productType)
            && (!destination || n.destination === destination))
          .sort((a, b) => scoreNode(b) - scoreNode(a));
        for (const n of candidates) {
          if (links.length >= max) break;
          links.push({ href: n.path, label: anchorFor(n) });
          usedGlobal.add(n.path);
        }
      }
      // fixed extra links (e.g. parent company) — not deduped
      for (const ex of g.extraLinks || []) links.push(ex);
      if (links.length) groups.push({ id: g.id, title: g.title, links });
    }
    result[lang] = groups;
  }
  return result;
}

// ---------------------------------------------------------------------------
// cross-sell / related links
// ---------------------------------------------------------------------------
function buildCrossSell(nodes) {
  const byPath = new Map(nodes.map((n) => [n.path, n]));
  const resolved = {};
  for (const lang of LANGS) {
    resolved[lang] = {};
    for (const [cat, targets] of Object.entries(CROSS_SELL_BY_CATEGORY)) {
      const out = [];
      for (const t of targets) {
        const lp = lang === 'en' ? t : localizePath(t, lang);
        if (!lp) continue;
        const node = byPath.get(lp);
        if (!node || node.noindex) continue;
        out.push({ href: lp, label: shortLabel(node.title || anchorFor(node)) });
      }
      if (out.length) resolved[lang][cat] = out;
    }
  }
  return resolved;
}

// ---------------------------------------------------------------------------
// per-page RelatedLinks (contextual, SEO-jump oriented)
//   Lever A — money funnel  (config cross-sell): info page -> the sale
//   Lever B — rank-rescue    (position 8-20, high impressions): pass equity to
//             page-2 URLs from relevant pages to push them onto page 1
//   Lever C — topical cluster (same destination+category siblings)
//   Lever D — parent hub      (category directory / owner) when discoverable
// All anchors are keyword-rich (GSC query first). Never self / cross-language.
// ---------------------------------------------------------------------------
const STOP_TOKENS = new Set(['varanasi', 'the', 'to', 'in', 'of', 'a', 'and', 'for', 'guide', '2026', '2027', 'kashi', 'banaras']);

function tokensOf(node) {
  return new Set(
    String(node.slug)
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((t) => t.length > 2 && !STOP_TOKENS.has(t))
  );
}

function shareToken(aTokens, b) {
  for (const t of tokensOf(b)) if (aTokens.has(t)) return true;
  return false;
}

function buildRelated(nodes, crossSell) {
  const byPath = new Map(nodes.map((n) => [n.path, n]));
  // Rank-rescue pool per language: real page-2 opportunities with demand.
  const rescuePool = { en: [], hi: [] };
  for (const n of nodes) {
    if (n.noindex || isExcluded(n.path)) continue;
    if (n.position != null && n.position >= 8 && n.position <= 20 && n.impressions >= 120) {
      (rescuePool[n.lang] || (rescuePool[n.lang] = [])).push(n);
    }
  }
  for (const l of Object.keys(rescuePool)) rescuePool[l].sort((a, b) => b.impressions - a.impressions);

  const MAX = 6;
  const related = {};
  for (const s of nodes) {
    if (s.noindex || isExcluded(s.path)) continue;
    const lang = s.lang;
    const used = new Set([s.path, s.canonical].filter(Boolean));
    const sTokens = tokensOf(s);
    const picks = [];

    const push = (node, reason) => {
      if (!node || node.noindex || used.has(node.path) || isExcluded(node.path)) return;
      picks.push({ href: node.path, label: anchorFor(node), reason });
      used.add(node.path);
    };

    // A — money funnel (max 2). Skip if the page itself is the money page.
    if (!s.commercial) {
      const funnel = (crossSell[lang] && crossSell[lang][s.category]) || [];
      let added = 0;
      for (const f of funnel) {
        if (added >= 2) break;
        const node = byPath.get(f.href);
        if (node && !used.has(node.path)) { push(node, 'book'); added++; }
      }
    }

    // B — rank-rescue (max 2): relevant page-2 pages get an equity boost.
    let rescued = 0;
    for (const r of rescuePool[lang] || []) {
      if (rescued >= 2) break;
      if (r.path === s.path) continue;
      const relevant = (r.destination && r.destination === s.destination) || r.category === s.category || shareToken(sTokens, r);
      if (relevant && !used.has(r.path)) { push(r, 'rescue'); rescued++; }
    }

    // C — topical cluster siblings, ranked by score, to fill up to MAX.
    const siblings = nodes
      .filter((n) => n.lang === lang && !n.noindex && !isExcluded(n.path) && !used.has(n.path) && n.path !== s.path)
      .filter((n) => (s.destination ? n.destination === s.destination && n.category === s.category : n.category === s.category))
      .sort((a, b) => b.score - a.score);
    for (const n of siblings) {
      if (picks.length >= MAX) break;
      push(n, 'related');
    }

    // C2 — if still short, widen to same-category across destinations.
    if (picks.length < MAX) {
      const wide = nodes
        .filter((n) => n.lang === lang && !n.noindex && !isExcluded(n.path) && !used.has(n.path) && n.category === s.category && n.path !== s.path)
        .sort((a, b) => b.score - a.score);
      for (const n of wide) {
        if (picks.length >= MAX) break;
        push(n, 'related');
      }
    }

    if (picks.length >= 3) related[s.path] = picks.slice(0, MAX);
  }
  return related;
}

// ---------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------
function main() {
  const contentNodes = collectContentNodes();
  const contentPaths = contentNodes.map((n) => n.path);
  const pageNodes = collectStaticPageNodes(contentPaths);
  const nodes = [...contentNodes, ...pageNodes];

  const gsc = joinGsc(nodes);
  nodes.forEach((n) => { n.score = scoreNode(n); });

  const footer = buildFooter(nodes);
  const crossSell = buildCrossSell(nodes);
  const related = buildRelated(nodes, crossSell);

  // compact node index for RelatedLinks (drop heavy internals)
  const index = {};
  for (const n of nodes) {
    index[n.path] = {
      lang: n.lang,
      title: n.title,
      anchor: anchorFor(n),
      category: n.category,
      productType: n.productType,
      destination: n.destination,
      commercial: n.commercial,
      intent: n.intent,
      clicks: n.clicks,
      score: n.score,
    };
  }

  const out = {
    gscDate: gsc.date,
    gscMatched: gsc.matched,
    totalNodes: nodes.length,
    footer,
    crossSell,
    related,
    index,
  };

  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(out, null, 2));

  // validate pins resolved
  const enGroups = footer.en || [];
  const enLinkCount = enGroups.reduce((s, g) => s + g.links.length, 0);
  console.log(`link-graph: ${nodes.length} nodes | GSC ${gsc.date || 'none'} matched ${gsc.matched} pages`);
  console.log(`link-graph: EN footer ${enGroups.length} groups / ${enLinkCount} links · HI ${footer.hi?.length || 0} groups`);
  console.log(`link-graph: related-links generated for ${Object.keys(related).length} pages`);
  // warn on dead pins
  const byPath = new Set(nodes.map((n) => n.path));
  for (const g of FOOTER_GROUPS) {
    for (const pin of g.pins || []) {
      if (!byPath.has(pin.path)) console.warn(`link-graph: WARN pin not found -> ${pin.path} (group ${g.id})`);
    }
  }
  console.log(`link-graph: wrote ${path.relative(ROOT, OUT_FILE)}`);
}

main();
