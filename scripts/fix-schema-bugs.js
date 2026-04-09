#!/usr/bin/env node
/**
 * Fix schema bugs across JSON and markdown files.
 *
 * Bug 1: Malformed double-domain URLs in JSON companion files
 * Bug 2: "OpeningHouresSpecification" typo
 * Bug 3: Invalid "TourOperator" @type → "TravelAgency"
 * Bug 4: Strip inline <script type="application/ld+json"> from markdown body
 *         (the rendering pipeline generates these from companion JSON + frontmatter)
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const MALFORMED_RE = /https?:\/\/www\.kashitaxi\.in(https?:\/\/)/g;

let stats = { bug1: 0, bug2: 0, bug3: 0, bug4: 0, filesModified: 0 };

// ── Helpers ──────────────────────────────────────────────────

function walk(dir, ext, results = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, ext, results);
    else if (full.endsWith(ext)) results.push(full);
  }
  return results;
}

// ── Bug 1 + Bug 2: Fix JSON companion files ─────────────────

function fixJsonFiles() {
  const dirs = [
    path.join(ROOT, 'json'),
    path.join(ROOT, 'content', 'en', 'json'),
    path.join(ROOT, 'content', 'hi', 'json'),
  ];

  for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue;
    for (const file of walk(dir, '.json')) {
      let raw = fs.readFileSync(file, 'utf-8');
      let changed = false;

      // Bug 1: Fix malformed double-domain URLs
      if (MALFORMED_RE.test(raw)) {
        raw = raw.replace(MALFORMED_RE, '$1');
        stats.bug1++;
        changed = true;
      }

      // Bug 2: Fix OpeningHouresSpecification typo
      if (raw.includes('OpeningHouresSpecification')) {
        raw = raw.replace(/OpeningHouresSpecification/g, 'OpeningHoursSpecification');
        stats.bug2++;
        changed = true;
      }

      if (changed) {
        fs.writeFileSync(file, raw, 'utf-8');
        stats.filesModified++;
        console.log(`  FIXED: ${path.relative(ROOT, file)}`);
      }
    }
  }
}

// ── Bug 3: Fix TourOperator → TravelAgency in markdown ──────

function fixTourOperator() {
  const files = walk(path.join(ROOT, 'content'), '.md');
  for (const file of files) {
    let raw = fs.readFileSync(file, 'utf-8');
    if (raw.includes('"TourOperator"')) {
      raw = raw.replace(/"TourOperator"/g, '"TravelAgency"');
      fs.writeFileSync(file, raw, 'utf-8');
      stats.bug3++;
      stats.filesModified++;
      console.log(`  FIXED @type: ${path.relative(ROOT, file)}`);
    }
  }
}

// ── Bug 4: Strip inline <script type="application/ld+json"> from md body ─

function fixInlineJsonLd() {
  const files = walk(path.join(ROOT, 'content'), '.md');
  // Match <script type="application/ld+json">...{...}...</script>
  // Handles multiline JSON blocks
  const INLINE_RE = /<script\s+type\s*=\s*["']application\/ld\+json["']\s*>\s*\n?([\s\S]*?)<\/script>/gi;

  for (const file of files) {
    let raw = fs.readFileSync(file, 'utf-8');
    if (!INLINE_RE.test(raw)) continue;
    INLINE_RE.lastIndex = 0;

    // Check if there's a companion JSON file — if not, skip (the schema would be lost)
    const slug = path.basename(file, '.md');
    const relDir = path.dirname(path.relative(path.join(ROOT, 'content'), file));
    const jsonDir = path.join(ROOT, 'content', relDir, 'json');
    const altJsonDir = path.join(ROOT, 'json');
    const hasCompanion = [
      path.join(jsonDir, `${slug}.json`),
      path.join(altJsonDir, `${slug}.json`),
    ].some(p => fs.existsSync(p));

    // Also check if the rendering pipeline will generate schema from frontmatter
    const matter = require('gray-matter');
    const { data } = matter(raw);
    const hasFrontmatterSchema = !!(data.faqSchema || data.faq || data.eventSchema || data.startDate);

    // Parse what schemas are inline
    INLINE_RE.lastIndex = 0;
    const matches = [...raw.matchAll(INLINE_RE)];
    let inlineTypes = new Set();
    for (const m of matches) {
      try {
        const obj = JSON.parse(m[1]);
        if (obj['@type']) inlineTypes.add(String(obj['@type']));
        if (obj['@graph']) obj['@graph'].forEach(n => n['@type'] && inlineTypes.add(String(n['@type'])));
      } catch {}
    }

    if (!hasCompanion && !hasFrontmatterSchema) {
      // Safety: keep inline if no other source exists, but fix double-domain URLs in it
      let cleaned = raw;
      if (MALFORMED_RE.test(cleaned)) {
        cleaned = cleaned.replace(MALFORMED_RE, '$1');
        if (cleaned !== raw) {
          fs.writeFileSync(file, cleaned, 'utf-8');
          stats.bug1++;
          stats.filesModified++;
          console.log(`  FIXED URLs (kept inline): ${path.relative(ROOT, file)}`);
        }
      }
      continue;
    }

    // Safe to strip — pipeline or companion JSON handles schema
    INLINE_RE.lastIndex = 0;
    const stripped = raw.replace(INLINE_RE, '').replace(/\n{3,}/g, '\n\n');
    if (stripped !== raw) {
      fs.writeFileSync(file, stripped, 'utf-8');
      stats.bug4++;
      stats.filesModified++;
      console.log(`  STRIPPED inline JSON-LD: ${path.relative(ROOT, file)} (had: ${[...inlineTypes].join(', ')})`);
    }
  }
}

// ── Run ──────────────────────────────────────────────────────

console.log('Bug 1+2: Fixing JSON companion files...');
fixJsonFiles();

console.log('\nBug 3: Fixing TourOperator @type...');
fixTourOperator();

console.log('\nBug 4: Stripping inline JSON-LD from markdown...');
fixInlineJsonLd();

console.log('\n=== Summary ===');
console.log(`Bug 1 (double-domain URLs): ${stats.bug1} files fixed`);
console.log(`Bug 2 (OpeningHoures typo): ${stats.bug2} files fixed`);
console.log(`Bug 3 (TourOperator→TravelAgency): ${stats.bug3} files fixed`);
console.log(`Bug 4 (inline JSON-LD stripped): ${stats.bug4} files fixed`);
console.log(`Total files modified: ${stats.filesModified}`);
