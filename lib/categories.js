import fs from 'fs';
import path from 'path';

const CONFIG_PATH = path.join(process.cwd(), 'config', 'breadcrumbs.config.json');

export function getBreadcrumbConfig() {
  const defaults = {
    baseUrl: 'https://www.kashitaxi.in',
    categories: {
      guides: { label: 'Travel Guides', path: '/en/', enabled: true },
      services: { label: 'Services', path: '/en/services/', enabled: true },
      packages: { label: 'Packages', path: '/en/packages/', enabled: true }
    }
  };
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const raw = fs.readFileSync(CONFIG_PATH, 'utf8');
      const user = JSON.parse(raw);
      return { ...defaults, ...user, categories: { ...defaults.categories, ...(user.categories || {}) } };
    }
  } catch (e) {
    console.warn('Breadcrumbs config invalid, using defaults:', e.message);
  }
  return defaults;
}

// Heuristic classification mirroring the JSON-LD updater
const serviceHints = ['taxi','cab','airport','outstation','fare','price','charges','rental','bike','scooty','booking'];
const packageHints = ['package','tour','itinerary','day-tour'];
const guideHints = ['guide','timings','best','ghat','aarti','boat','things to do','how to','temple'];

export function classifyPost(meta = {}) {
  const slug = (meta.slug || '').toLowerCase();
  const title = (meta.title || '').toLowerCase();
  const tags = Array.isArray(meta.tags) ? meta.tags.map(t => String(t).toLowerCase()) : [];
  const category = (meta.category || meta.type || '').toString().toLowerCase();

  // Explicit override via frontmatter
  if (['services','service'].includes(category)) return 'services';
  if (['packages','package'].includes(category)) return 'packages';
  if (['guides','guide','article','blog'].includes(category)) return 'guides';

  if (tags.includes('service')) return 'services';
  if (tags.includes('package')) return 'packages';
  if (tags.includes('guide')) return 'guides';

  // Heuristics
  if (serviceHints.some(h => slug.includes(h) || title.includes(h))) return 'services';
  if (packageHints.some(h => slug.includes(h) || title.includes(h))) return 'packages';
  if (guideHints.some(h => slug.includes(h) || title.includes(h))) return 'guides';

  return 'guides';
}

export function listByCategory(posts = [], cat) {
  return posts.filter(p => classifyPost(p) === cat);
}
