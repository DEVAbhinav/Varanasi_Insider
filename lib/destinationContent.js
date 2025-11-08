import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { markdownToHtml } from './markdown';

const getDestinationsRoot = (lang = 'en') => (
  path.join(process.cwd(), 'content', lang, 'destinations')
);

export const DESTINATION_CATEGORIES = {
  TOUR_PACKAGES: 'tour-packages',
  TAXI: 'taxi',
  SIGHTSEEING: 'sightseeing',
  TRAVEL_GUIDE: 'travel-guide',
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

  const rawContent = fs.readFileSync(entryPath, 'utf8');
  const { data, content } = matter(rawContent);
  const contentHtml = await markdownToHtml(content || '');

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

  return {
    slug,
    destination,
    category,
    contentHtml,
    jsonLd,
    ...frontmatter,
    date: serializeDate(frontmatter.date),
    lastUpdated: serializeDate(frontmatter.lastUpdated),
  };
};
