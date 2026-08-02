import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { markdownToHtml, demoteContentHeadings } from './markdown';
import { normalizeContactData } from './contact';

const getDestinationsRoot = (lang = 'en') => (
  path.join(process.cwd(), 'content', lang, 'destinations')
);

const getCategoryDir = (lang, destination, category) => (
  path.join(getDestinationsRoot(lang), destination, category)
);

const getIndexFilePath = (lang, destination, category) => (
  path.join(getCategoryDir(lang, destination, category), 'index.md')
);

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

const ensureArray = (value) => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

const normaliseTabs = (tabs) => {
  if (!Array.isArray(tabs) || tabs.length === 0) {
    return [{ id: 'all', label: 'All Destinations' }];
  }

  return tabs.map((tab, index) => ({
    id: tab?.id || tab?.key || `tab-${index + 1}`,
    label: tab?.label || tab?.title || `Tab ${index + 1}`,
    description: tab?.description || null,
    matches: ensureArray(tab?.matches || tab?.patterns || tab?.keywords || null),
    slugs: ensureArray(tab?.slugs || []),
    default: tab?.default === true,
    order: typeof tab?.order === 'number' ? tab.order : index,
  }));
};

const matchesPattern = (pattern, target) => {
  if (!pattern || !target) return false;
  const trimmed = String(pattern).trim();
  if (!trimmed) return false;

  if (trimmed.startsWith('/') && trimmed.endsWith('/')) {
    try {
      const regexBody = trimmed.slice(1, -1);
      const regex = new RegExp(regexBody, 'i');
      return regex.test(target);
    } catch (err) {
      return false;
    }
  }

  return target.includes(trimmed.toLowerCase());
};

const resolveTabId = (tabs, slug, frontmatter) => {
  if (!tabs || tabs.length === 0) {
    return 'all';
  }

  const preferred = frontmatter?.clusterTab || frontmatter?.clusterGroup || frontmatter?.directoryTab;
  if (preferred && tabs.some((tab) => tab.id === preferred)) {
    return preferred;
  }

  const candidateTextParts = [slug, frontmatter?.title, frontmatter?.description]
    .concat(ensureArray(frontmatter?.tags))
    .concat(ensureArray(frontmatter?.keywords))
    .filter(Boolean)
    .map((value) => String(value).toLowerCase());

  const candidateText = candidateTextParts.join(' ');

  for (const tab of tabs) {
    if (tab.slugs && tab.slugs.includes(slug)) {
      return tab.id;
    }

    if (tab.matches && tab.matches.some((pattern) => matchesPattern(pattern, candidateText))) {
      return tab.id;
    }
  }

  return tabs.find((tab) => tab.default)?.id || tabs[0].id;
};

const collectChildEntries = (lang, destination, category, tabs) => {
  const categoryDir = getCategoryDir(lang, destination, category);
  const files = safeReadDir(categoryDir).filter((file) => file.endsWith('.md') && file !== 'index.md');

  const entries = files.map((file) => {
    const slug = file.replace(/\.md$/, '');
    const filePath = path.join(categoryDir, file);
    let frontmatter = {};

    try {
      const raw = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(raw);
      frontmatter = normalizeContactData(data || {});
    } catch (err) {
      frontmatter = {};
    }

    const order = typeof frontmatter.listOrder === 'number'
      ? frontmatter.listOrder
      : (typeof frontmatter.order === 'number' ? frontmatter.order : Number.MAX_SAFE_INTEGER);

    const tab = resolveTabId(tabs, slug, frontmatter);

    return {
      slug,
      tab,
      title: frontmatter.cardTitle || frontmatter.title || slug,
      description: frontmatter.cardDescription || frontmatter.description || '',
      image: frontmatter.cardImage || frontmatter.featuredImage || null,
      metaLine: frontmatter.directoryMeta || frontmatter.metaLine || null,
      href: `/${lang}/city/${destination}/${category}/${slug}`,
      order,
    };
  });

  return entries.sort((a, b) => {
    if (a.tab !== b.tab) {
      return a.tab.localeCompare(b.tab);
    }
    if (a.order !== b.order) {
      return a.order - b.order;
    }
    return a.title.localeCompare(b.title);
  });
};

export const getCategoryIndexPaths = (category, lang) => {
  const destinationsRoot = getDestinationsRoot(lang);
  const destinations = safeReadDir(destinationsRoot).filter((entry) => (
    isDirectory(path.join(destinationsRoot, entry))
  ));

  const paths = [];

  destinations.forEach((destination) => {
    const categoryDir = path.join(destinationsRoot, destination, category);
    if (!isDirectory(categoryDir)) {
      return;
    }

    const indexPath = path.join(categoryDir, 'index.md');
    if (fs.existsSync(indexPath)) {
      paths.push({ lang, destination });
    }
  });

  return paths;
};

export const getCategoryDirectoryEntry = async (lang, destination, category) => {
  const indexPath = getIndexFilePath(lang, destination, category);
  if (!fs.existsSync(indexPath)) {
    throw new Error(`Category index not found for ${destination}/${category} (${lang})`);
  }

  const raw = fs.readFileSync(indexPath, 'utf8');
  const { data, content } = matter(raw);
  const normalizedData = normalizeContactData(data || {});
  const tabs = normaliseTabs(normalizedData?.tabs);
  // CategoryDirectoryPage renders its own <h1>, so demote the body's leading
  // markdown H1 to H2 to avoid a duplicate H1 on the page.
  const contentHtml = demoteContentHeadings(await markdownToHtml(content || ''));
  const entries = collectChildEntries(lang, destination, category, tabs);

  return {
    lang,
    destination,
    category,
    slug: 'index',
    title: normalizedData?.title || `${destination} ${category}`,
    description: normalizedData?.description || '',
    eyebrow: normalizedData?.eyebrow || null,
    featuredImage: normalizedData?.featuredImage || null,
    ctaTitle: normalizedData?.ctaTitle || null,
    ctaSubtitle: normalizedData?.ctaSubtitle || null,
    ctaVariant: normalizedData?.ctaVariant || null,
    phone: normalizedData?.phone || null,
    metaTitle: normalizedData?.metaTitle || normalizedData?.title || null,
    metaDescription: normalizedData?.metaDescription || normalizedData?.description || null,
    keywords: normalizedData?.keywords || null,
    contentHtml,
    clusterTitle: normalizedData?.clusterTitle || normalizedData?.directoryTitle || null,
    clusterDescription: normalizedData?.clusterDescription || normalizedData?.directoryDescription || null,
    clusterTabs: tabs,
    clusterEntries: entries,
    date: normalizedData?.date || null,
    lastUpdated: normalizedData?.lastUpdated || null,
  };
};
