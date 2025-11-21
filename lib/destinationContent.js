import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { markdownToHtml } from './markdown';
import { extractItineraryFromMarkdown } from './itinerary';
import { getBreadcrumbConfig } from './categories';

const getDestinationsRoot = (lang = 'en') => (
  path.join(process.cwd(), 'content', lang, 'destinations')
);

export const DESTINATION_CATEGORIES = {
  TOUR_PACKAGES: 'tour-packages',
  TAXI: 'taxi',
  SIGHTSEEING: 'sightseeing',
  TRAVEL_GUIDE: 'travel-guide',
};

const DEFAULT_SITE_BASE = 'https://www.kashitaxi.in';

const CATEGORY_TO_SITE_CATEGORY = {
  taxi: 'services',
  'tour-packages': 'packages',
  sightseeing: 'guides',
  'travel-guide': 'guides',
};

const CATEGORY_DISPLAY_LABELS = {
  taxi: 'Taxi Services',
  'tour-packages': 'Tour Packages',
  sightseeing: 'Sightseeing Guides',
  'travel-guide': 'Travel Guides',
};

const slugToTitleCase = (value = '') => (
  value
    .split(/[-_/\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
);

const trimTrailingSlash = (value = '') => value.replace(/\/+$/, '');

const ensureTrailingSlash = (value = '') => {
  if (!value) {
    return '/';
  }
  return value.endsWith('/') ? value : `${value}/`;
};

const ensureAbsoluteUrl = (url, baseUrl = DEFAULT_SITE_BASE) => {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith('//')) return `https:${url}`;
  const base = trimTrailingSlash(baseUrl || DEFAULT_SITE_BASE);
  const normalizedPath = url.startsWith('/') ? url : `/${url}`;
  return `${base}${normalizedPath}`;
};

const adaptPathForLang = (pathStr = '/', lang = 'en') => {
  if (!pathStr) return `/${lang}/`;
  if (/^https?:\/\//i.test(pathStr)) return pathStr;
  const initial = pathStr.startsWith('/') ? pathStr : `/${pathStr}`;
  if (initial === '/' || initial === '') {
    return `/${lang}/`;
  }
  if (/^\/[a-z]{2}(?=\/)/i.test(initial)) {
    return initial.replace(/^\/[a-z]{2}(?=\/)/i, `/${lang}`);
  }
  return `/${lang}${initial}`;
};

const hasCategoryIndexPage = (lang, destination, category) => {
  const indexPath = path.join(getDestinationsRoot(lang), destination, category, 'index.md');
  return fs.existsSync(indexPath);
};

const normalizeCustomBreadcrumbs = (crumbs, baseUrl) => {
  if (!Array.isArray(crumbs)) return [];
  return crumbs
    .map((crumb) => {
      if (!crumb) return null;
      if (typeof crumb === 'string') return null;
      const name = crumb.name || crumb.label || null;
      const rawItem = crumb.item || crumb.url || crumb.href || null;
      if (!name || !rawItem) return null;
      const item = ensureAbsoluteUrl(rawItem, baseUrl);
      if (!item) return null;
      return {
        name: String(name).trim(),
        item,
      };
    })
    .filter(Boolean);
};

const buildAutoBreadcrumbs = ({ cfg, baseUrl, lang, destination, category, canonicalUrl, pageTitle }) => {
  const crumbs = [];
  const homeUrl = ensureTrailingSlash(`${baseUrl}/`);
  crumbs.push({ name: 'Home', item: homeUrl });

  const siteCategoryKey = CATEGORY_TO_SITE_CATEGORY[category] || 'guides';
  const fallbackCategory = { label: 'Travel Guides', path: '/en/' };
  const siteCategoryConfig = (cfg.categories && cfg.categories[siteCategoryKey]) || cfg.categories?.guides || fallbackCategory;

  if (siteCategoryConfig && siteCategoryConfig.enabled !== false && siteCategoryConfig.label && siteCategoryConfig.path) {
    let categoryUrl = siteCategoryConfig.path;
    if (!/^https?:\/\//i.test(categoryUrl)) {
      const langAwarePath = ensureTrailingSlash(adaptPathForLang(categoryUrl, lang));
      categoryUrl = `${baseUrl}${langAwarePath}`;
    }
    crumbs.push({ name: siteCategoryConfig.label, item: ensureTrailingSlash(categoryUrl) });
  }

  if (hasCategoryIndexPage(lang, destination, category)) {
    const destinationLabel = `${slugToTitleCase(destination)} ${CATEGORY_DISPLAY_LABELS[category] || 'Guides'}`;
    const categoryPath = `/${lang}/city/${destination}/${category}/`;
    const categoryUrl = `${baseUrl}${categoryPath}`;
    crumbs.push({ name: destinationLabel.trim(), item: ensureTrailingSlash(categoryUrl) });
  }

  crumbs.push({ name: pageTitle || slugToTitleCase(destination), item: canonicalUrl });
  return crumbs;
};

const resolveBreadcrumbs = ({ cfg, baseUrl, lang, destination, category, canonicalUrl, pageTitle, customBreadcrumbs }) => {
  const custom = normalizeCustomBreadcrumbs(customBreadcrumbs, baseUrl);
  if (custom.length >= 2) {
    return custom;
  }
  return buildAutoBreadcrumbs({ cfg, baseUrl, lang, destination, category, canonicalUrl, pageTitle });
};

const serializeDate = (value) => {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === 'number') {
    try {
      return new Date(value).toISOString().slice(0, 10);
    } catch (err) {
      return String(value);
    }
  }
  if (typeof value === 'string') return value;
  try {
    return new Date(value).toISOString().slice(0, 10);
  } catch (err) {
    return String(value);
  }
};

const safeReadDir = (targetPath) => {
  try {
    return fs.readdirSync(targetPath);
  } catch (err) {
    return [];
  }
};

const isDirectory = (targetPath) => {
  try {
    return fs.statSync(targetPath).isDirectory();
  } catch (err) {
    return false;
  }
};

const getEntryFilePath = (lang, category, destination, slug) => (
  path.join(getDestinationsRoot(lang), destination, category, `${slug}.md`)
);

const getJsonFilePath = (lang, category, destination, slug) => (
  path.join(getDestinationsRoot(lang), destination, category, 'json', `${slug}.json`)
);

export const getDestinationEntries = (category, lang = 'en') => {
  const destinationsRoot = getDestinationsRoot(lang);
  const entries = [];
  const destinations = safeReadDir(destinationsRoot).filter((entry) => (
    isDirectory(path.join(destinationsRoot, entry))
  ));

  destinations.forEach((destination) => {
    const categoryDir = path.join(destinationsRoot, destination, category);
    if (!isDirectory(categoryDir)) {
      return;
    }

    const files = safeReadDir(categoryDir).filter((file) => file.endsWith('.md'));
    files.forEach((file) => {
      const slug = file.replace(/\.md$/, '');
      entries.push({ destination, slug });
    });
  });

  return entries;
};

export const getDestinationPaths = (category, lang = 'en') => (
  getDestinationEntries(category, lang).map(({ destination, slug }) => ({ destination, slug }))
);

export const getDestinationEntry = async (lang, category, destination, slug) => {
  const entryPath = getEntryFilePath(lang, category, destination, slug);

  if (!fs.existsSync(entryPath)) {
    throw new Error(`Destination content not found for ${destination}/${category}/${slug}`);
  }

  const cfg = getBreadcrumbConfig();
  const baseUrl = trimTrailingSlash(cfg?.baseUrl || DEFAULT_SITE_BASE);
  const slugPath = `/city/${destination}/${category}/${slug}`;
  const localizedPath = `/${lang}${slugPath}`;
  const canonicalUrl = `${baseUrl}${localizedPath}`;

  const rawContent = fs.readFileSync(entryPath, 'utf8');
  const { data, content } = matter(rawContent);
  const extracted = extractItineraryFromMarkdown(content || '');
  const autoItinerary = extracted?.itinerary || null;
  const range = extracted?.range || null;

  const contentHtmlFull = await markdownToHtml(content || '');

  let beforeMarkdown = content || '';
  let afterMarkdown = '';

  if (range) {
    const { start, end } = range;
    beforeMarkdown = (content || '').slice(0, start);
    afterMarkdown = (content || '').slice(end);
  }

  const contentHtmlBefore = await markdownToHtml(beforeMarkdown || '');
  const contentHtmlAfter = range ? await markdownToHtml(afterMarkdown || '') : null;

  let itinerarySections = [];
  if (autoItinerary?.days?.length) {
    itinerarySections = await Promise.all(
      autoItinerary.days.map(async (day, index) => {
        const segmentRange = day?.sourceRange;
        let segmentHtml = null;

        if (segmentRange && typeof segmentRange.start === 'number' && typeof segmentRange.end === 'number' && segmentRange.end > segmentRange.start) {
          const segmentMarkdown = (content || '').slice(segmentRange.start, segmentRange.end);
          segmentHtml = await markdownToHtml(segmentMarkdown || '');
        }

        return {
          index,
          html: segmentHtml,
        };
      })
    );
  }

  const jsonPath = getJsonFilePath(lang, category, destination, slug);
  let jsonLd = null;
  if (fs.existsSync(jsonPath)) {
    try {
      jsonLd = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    } catch (err) {
      console.error(`Failed to parse JSON-LD for ${destination}/${category}/${slug}:`, err);
    }
  }

  const frontmatter = data || {};
  let itinerary = autoItinerary;
  const pageTitle = frontmatter.heading || frontmatter.title || slugToTitleCase(slug);
  const breadcrumbs = resolveBreadcrumbs({
    cfg,
    baseUrl,
    lang,
    destination,
    category,
    canonicalUrl,
    pageTitle,
    customBreadcrumbs: frontmatter.breadcrumbs || frontmatter.breadcrumbTrail || null,
  });

  if (frontmatter?.itinerary) {
    const frontmatterItinerary = frontmatter.itinerary;
    if (frontmatterItinerary && typeof frontmatterItinerary === 'object') {
      itinerary = {
        ...autoItinerary,
        ...frontmatterItinerary,
        days: autoItinerary?.days || [],
      };
    }
  }

  return {
    slug,
    destination,
    category,
    localizedPath,
    canonicalUrl,
    siteBase: baseUrl,
    contentHtml: contentHtmlFull,
    contentHtmlBefore,
    contentHtmlAfter,
    itinerarySections,
    jsonLd,
    ...frontmatter,
    itinerary,
    breadcrumbs,
    date: serializeDate(frontmatter.date),
    lastUpdated: serializeDate(frontmatter.lastUpdated),
  };
};
