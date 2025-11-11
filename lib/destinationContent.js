import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { markdownToHtml } from './markdown';
import { extractItineraryFromMarkdown } from './itinerary';

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
    contentHtml: contentHtmlFull,
    contentHtmlBefore,
    contentHtmlAfter,
    itinerarySections,
    jsonLd,
    ...frontmatter,
    itinerary,
    date: serializeDate(frontmatter.date),
    lastUpdated: serializeDate(frontmatter.lastUpdated),
  };
};
