import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pages = JSON.parse(fs.readFileSync(path.join(root, 'data/sales-visual-pages.json'), 'utf8'));

const positive = [
  ['route', 12], ['रूट', 12], ['मार्ग', 12], ['pickup', 11], ['पिकअप', 11],
  ['fare', 10], ['price', 10], ['cost', 10], ['किराया', 10], ['कीमत', 10],
  ['comparison', 9], [' vs ', 9], ['तुलना', 9], ['timing', 8], ['समय', 8],
  ['how to book', 8], ['बुक', 8], ['included', 7], ['शामिल', 7],
  ['vehicle', 7], ['सीटर', 7], ['safety', 7], ['सुरक्षा', 7],
  ['itinerary', 6], ['यात्रा कार्यक्रम', 6], ['entry rules', 6], ['queue', 6],
  ['border', 7], ['station', 5], ['airport', 5], ['darshan', 5], ['दर्शन', 5],
  ['use case', 5], ['who should', 5], ['package', 4]
];
const negative = ['faq', 'related', 'why choose', 'why trust', 'book your', 'contact', 'और देखें'];

function sections(markdown) {
  const lines = markdown.split(/\r?\n/);
  const out = [];
  let current = null;
  for (const line of lines) {
    const match = /^(##)\s+(.+?)\s*$/.exec(line);
    if (match) {
      if (current) out.push(current);
      current = { heading: match[2].replace(/\s*\{#[^}]+\}\s*$/, ''), lines: [] };
    } else if (current && !/^###\s+/.test(line)) {
      current.lines.push(line);
    }
  }
  if (current) out.push(current);
  return out.map((item) => ({
    heading: item.heading,
    facts: item.lines.join('\n')
      .replace(/\{\{CTA:[^}]+\}\}/g, '')
      .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      .replace(/[*_`>#]/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  })).filter((item) => item.facts.length > 80);
}

function score(section, used) {
  const value = ` ${section.heading.toLowerCase()} `;
  let total = 0;
  for (const [term, points] of positive) if (value.includes(term)) total += points;
  for (const term of negative) if (value.includes(term)) total -= 20;
  if (used.some((item) => item.heading === section.heading)) total -= 100;
  if (used.length && used[0].heading.toLowerCase().includes('route') && value.includes('route')) total -= 8;
  if (used.length && /fare|price|cost|किराया|कीमत/.test(used[0].heading.toLowerCase()) && /fare|price|cost|किराया|कीमत/.test(value)) total -= 8;
  return total;
}

function choose(page) {
  if (page.manualSections) return page.manualSections;
  const markdown = fs.readFileSync(path.join(root, page.source), 'utf8');
  const candidates = sections(markdown);
  const selected = [];
  for (const preferred of page.preferredHeadings || []) {
    const match = candidates.find((item) => item.heading === preferred);
    if (match) selected.push(match);
  }
  while (selected.length < 2) {
    const next = candidates
      .filter((item) => !selected.includes(item))
      .sort((a, b) => score(b, selected) - score(a, selected))[0];
    if (!next) throw new Error(`Could not select two sections for ${page.route}`);
    selected.push(next);
  }
  return selected.slice(0, 2);
}

const approvedStyle = `commissioned editorial field guide; realistic photographed service objects integrated with hand-drawn watercolor and precise ink cartography on tactile uncoated paper; restrained Swiss information hierarchy with Indian material character; asymmetric wide 3:2 composition; warm raw paper, river blue, muted brick red, graphite, deep green and charcoal; purposeful imperfections, no generative gloss`;

const prompts = [];
for (const page of pages) {
  choose(page).forEach((section, index) => {
    const facts = section.facts.slice(0, 3600);
    prompts.push({
      id: `${page.route.replace(/^\/+|\/+$/g, '').replace(/[^a-z0-9]+/gi, '-') || 'home'}-${index + 1}`,
      route: page.route,
      source: page.source,
      section: section.heading,
      index: index + 1,
      prompt: `Use case: infographic-diagram\nAsset type: standalone visual for exactly one sales-page section\nPage route: ${page.route}\nSection title: ${section.heading}\nPrimary request: turn only the supplied section facts into one useful decision graphic. Do not summarize the whole page. Show the specific sequence, comparison, boundary, workflow or choice that makes this section valuable.\nSection facts (authoritative):\n${facts}\nStyle/medium: ${approvedStyle}\nComposition/framing: one clear reading path, two to nine meaningful visual stops depending on the facts, generous negative space, no unrelated props\nText policy: use only short labels and figures explicitly present in the supplied facts; spell them exactly; no invented facts\nBranding space: reserve a quiet footer area for deterministic Kashi Taxi and kashitaxi.in attribution added later\nConstraints: specific to this section only; culturally respectful; mechanically and operationally plausible; no fake logos or watermark\nAvoid: generic travel montage, whole-page summary, ornamental temple collage, repeated monuments, decorative cards, fake app UI, glossy CGI, AI symmetry, invented geography or prices`,
      excerpt: facts
    });
  });
}

if (pages.length !== 50 || prompts.length !== 100) throw new Error(`Expected 50 pages and 100 prompts; got ${pages.length} and ${prompts.length}`);
fs.writeFileSync(path.join(root, 'data/sales-visual-prompts.json'), `${JSON.stringify(prompts, null, 2)}\n`);
console.log(`Wrote ${prompts.length} section-specific prompts for ${pages.length} pages.`);
for (const item of prompts) console.log(`${item.id}\t${item.section}`);
