// This file contains the core logic for fetching data from Markdown files.
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { markdownToHtml } from './markdown';
import { extractItineraryFromMarkdown } from './itinerary';
import sharp from 'sharp';

const contentDirectory = path.join(process.cwd(), 'content');
const imagesDirectory = path.join(process.cwd(), 'public', 'images');
let imageFileNames = [];
try {
  imageFileNames = fs.readdirSync(imagesDirectory);
} catch (err) {
  console.error('Could not read images directory', err);
}

function serializeDate(val) {
  if (!val) return null;
  // gray-matter (js-yaml) may parse YYYY-MM-DD into a Date
  if (val instanceof Date) return val.toISOString().slice(0, 10);
  // allow timestamps or strings safely
  if (typeof val === 'number') {
    try { return new Date(val).toISOString().slice(0, 10); } catch { return String(val); }
  }
  if (typeof val === 'string') return val;
  // Fallback to stringification to avoid Next.js serialization errors
  try { return new Date(val).toISOString().slice(0, 10); } catch { return String(val); }
}

// Helper to create a detailed ImageObject from a URL
async function createImageObject(imageUrl) {
  if (!imageUrl || typeof imageUrl !== 'string') {
    return null;
  }
  const siteUrl = 'https://www.kashitaxi.in';
  // If the URL is already absolute, we need to derive the relative path for local reading
  const relativeImageUrl = imageUrl.startsWith(siteUrl) ? imageUrl.substring(siteUrl.length) : imageUrl;
  const imagePath = path.join(process.cwd(), 'public', relativeImageUrl);

  // First, check if the file exists.
  if (!fs.existsSync(imagePath)) {
    // console.warn(`Image file not found, skipping metadata: ${relativeImageUrl}`);
    return {
      '@type': 'ImageObject',
      url: imageUrl.startsWith('http') ? imageUrl : `${siteUrl}${imageUrl}`,
    };
  }

  try {
    // Get image metadata for width and height
    const metadata = await sharp(imagePath).metadata();

    // Format the name from the filename
    const filename = path.basename(relativeImageUrl);
    const name = filename
      .replace(/\.[^/.]+$/, "") // remove extension
      .replace(/[-_]/g, ' ') // replace hyphens/underscores with spaces
      .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()); // title case

    return {
      '@type': 'ImageObject',
      url: imageUrl.startsWith('http') ? imageUrl : `${siteUrl}${imageUrl}`,
      width: metadata.width,
      height: metadata.height,
      name: name,
    };
  } catch (err) {
    console.error(`Failed to create ImageObject for ${relativeImageUrl}:`, err);
    // Return a basic object if metadata fails, so it doesn't break the whole page
    return {
      '@type': 'ImageObject',
      url: imageUrl.startsWith('http') ? imageUrl : `${siteUrl}${imageUrl}`,
    };
  }
}

// Get all posts sorted by date for a given language
export function getSortedPostsData(lang) {
  const langDirectory = path.join(contentDirectory, lang);
  let fileNames = [];
  try {
    // Filter for .md files only
    fileNames = fs.readdirSync(langDirectory).filter(file => file.endsWith('.md'));
  } catch (err) {
    console.error(`Error reading directory for language: ${lang}`, err);
    return []; // Return empty array if language directory doesn't exist
  }

  const allPostsData = fileNames
    .map((fileName) => {
      try {
        // Remove ".md" from file name to get slug
        const slug = fileName.replace(/\.md$/, '');

        // Read markdown file as string
        const fullPath = path.join(langDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        // Use gray-matter to parse the post metadata section
        const matterResult = matter(fileContents);

        // Combine the data with the slug and ensure dates are serializable strings
        const fm = matterResult.data || {};
        return {
          slug,
          ...fm,
          date: serializeDate(fm.date),
          lastUpdated: serializeDate(fm.lastUpdated),
        };
      } catch (err) {
        console.error(`Error parsing markdown file: ${fileName}`, err);
        return null; // Return null for files that cause errors
      }
    })
    .filter(Boolean); // Filter out null values

  // Sort posts by date (newest first). Works for ISO date strings too.
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

// Get all possible paths for posts (for getStaticPaths)
export function getAllPostPaths() {
  let languages = [];
  try {
    languages = fs.readdirSync(contentDirectory);
  } catch (err) {
    console.error(`Error reading content directory: ${contentDirectory}`, err);
    return [];
  }
  let paths = [];

  languages.forEach((lang) => {
    const langDirectory = path.join(contentDirectory, lang);
    let fileNames = [];
    try {
      // Filter for .md files only
      fileNames = fs.readdirSync(langDirectory).filter(file => file.endsWith('.md'));
    } catch (err) {
      console.error(`Error reading language directory: ${langDirectory}`, err);
      return; // skip this language
    }

    fileNames.forEach((fileName) => {
      // Convert slug to lowercase for consistent URLs
      const slug = fileName.replace(/\.md$/, '').toLowerCase();
      paths.push({
        params: {
          lang: lang,
          slug: slug,
        },
      });
    });
  });

  return paths;
}

// Get data for a single post by lang and slug
export async function getPostData(lang, slug) {
  // Convert slug to lowercase for case-insensitive matching
  const normalizedSlug = slug.toLowerCase();

  // Try to find the file with case-insensitive matching
  let actualFileName = `${normalizedSlug}.md`;
  const langDirectory = path.join(contentDirectory, lang);

  try {
    // Get all markdown files in the directory
    const files = fs.readdirSync(langDirectory).filter(file => file.endsWith('.md'));

    // Find the file case-insensitively
    const matchedFile = files.find(file => file.toLowerCase() === `${normalizedSlug}.md`);

    if (matchedFile) {
      actualFileName = matchedFile;
    }
  } catch (err) {
    console.error(`Error reading directory for case-insensitive lookup: ${langDirectory}`, err);
  }

  const fullPath = path.join(langDirectory, actualFileName);
  try {
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);
    const fm = matterResult.data || {};
    const content = matterResult.content || '';

    // Extract itinerary segments (auto + optional frontmatter merge)
    const extracted = extractItineraryFromMarkdown(content);
    const autoItinerary = extracted?.itinerary || null;
    const range = extracted?.range || null;

    const contentHtmlFull = await markdownToHtml(content);
    let contentHtmlBefore = contentHtmlFull;
    let contentHtmlAfter = null;

    if (range) {
      const { start, end } = range;
      const beforeMarkdown = content.slice(0, start);
      const afterMarkdown = content.slice(end);

      contentHtmlBefore = await markdownToHtml(beforeMarkdown || '');
      contentHtmlAfter = afterMarkdown.trim() ? await markdownToHtml(afterMarkdown) : null;
    }

    let itinerarySections = [];
    if (autoItinerary?.days?.length) {
      itinerarySections = await Promise.all(
        autoItinerary.days.map(async (day, index) => {
          const segmentRange = day?.sourceRange;
          let segmentHtml = null;

          if (
            segmentRange
            && typeof segmentRange.start === 'number'
            && typeof segmentRange.end === 'number'
            && segmentRange.end > segmentRange.start
          ) {
            const segmentMarkdown = content.slice(segmentRange.start, segmentRange.end);
            if (segmentMarkdown.trim()) {
              segmentHtml = await markdownToHtml(segmentMarkdown);
            }
          }

          return { index, html: segmentHtml };
        })
      );
    }

    let itinerary = autoItinerary;
    if (fm?.itinerary && typeof fm.itinerary === 'object') {
      itinerary = {
        ...autoItinerary,
        ...fm.itinerary,
        days: autoItinerary?.days || [],
      };
    }

    // Find the best image for this post
    const { primaryImage } = findRelevantImages(slug);

    // Set featuredImage from our algorithm if not already set in frontmatter
    if (!fm.featuredImage && primaryImage) {
      fm.featuredImage = primaryImage;
    }

    return {
      slug,
      contentHtml: contentHtmlFull,
      contentHtmlBefore,
      contentHtmlAfter,
      itinerary,
      itinerarySections,
      ...fm,
      date: serializeDate(fm.date),
      lastUpdated: serializeDate(fm.lastUpdated),
    };
  } catch (err) {
    console.error(`Error getting post data for slug "${slug}" in lang "${lang}"`, err);
    // Re-throw the error to be handled by getStaticProps
    throw err;
  }
}

// Get JSON-LD data for a single post by lang and slug
export async function getJsonLdData(lang, slug) {
  const { generateArticleSchema, generateBreadcrumbSchema, generateFAQSchema } = await import('./schemaGenerator');
  const { primaryImage, otherImages } = findRelevantImages(slug);

  const jsonPath = path.join(contentDirectory, lang, 'json', `${slug}.json`);
  let jsonLdData;
  let postData;

  try {
    const mdPath = path.join(contentDirectory, lang, `${slug}.md`);
    const fileContents = fs.readFileSync(mdPath, 'utf8');
    postData = matter(fileContents).data;
  } catch (err) {
    // If markdown is not found, maybe it's in a subdirectory (handled by caller usually, but here we might fail)
    // For now, assume if we can't find markdown, we can't generate much.
    // However, the caller might have passed a scoped slug like 'services/foo'.
    // Let's try to resolve the markdown path using the slug directly if it contains slashes.
    try {
      const directPath = path.join(contentDirectory, lang, `${slug}.md`);
      if (fs.existsSync(directPath)) {
        const fileContents = fs.readFileSync(directPath, 'utf8');
        postData = matter(fileContents).data;
      } else {
        // Try to find it in subdirectories if slug doesn't have slashes but file is deep
        // This is hard without scanning. Let's assume the slug passed here matches the file structure
        // or the caller has already resolved it.
        // If we fail to read postData, we fall back to basic defaults.
        postData = { title: '', description: '' };
      }
    } catch (e) {
      postData = { title: '', description: '' };
    }
  }

  try {
    const fileContents = fs.readFileSync(jsonPath, 'utf8');
    jsonLdData = JSON.parse(fileContents);
  } catch (err) {
    if (err.code === 'ENOENT') {
      // JSON file not found, generate it dynamically
      jsonLdData = { '@context': 'https://schema.org', '@graph': [] };

      const siteUrl = 'https://www.kashitaxi.in';
      const pageUrl = `${siteUrl}/${lang}/${slug}`;

      // Generate Article Schema
      const articleSchema = generateArticleSchema({
        title: postData.title,
        description: postData.description,
        url: pageUrl,
        image: postData.featuredImage || primaryImage,
        datePublished: serializeDate(postData.date),
        dateModified: serializeDate(postData.lastUpdated),
        authorName: postData.author
      });
      jsonLdData['@graph'].push(articleSchema);

      // Generate Breadcrumb Schema
      const breadcrumbs = [
        { name: 'Home', url: '/' },
        { name: postData.title || slug, url: pageUrl }
      ];
      // If it's a service or other category, we could add more crumbs, but this is a safe default
      const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);
      jsonLdData['@graph'].push(breadcrumbSchema);

    } else {
      console.error(`Error getting JSON-LD data for slug "${slug}" in lang "${lang}"`, err);
      return null;
    }
  }

  if (!jsonLdData['@graph']) {
    jsonLdData['@graph'] = [];
  }

  // --- FAQ Schema from frontmatter (faqSchema or faq) ---
  // Only add if the graph doesn't already have a FAQPage
  const graphHasFaqPage = jsonLdData['@graph'].some((node) => {
    const type = node?.['@type'];
    if (!type) return false;
    if (Array.isArray(type)) return type.includes('FAQPage');
    return type === 'FAQPage';
  });

  if (!graphHasFaqPage && (postData.faqSchema || postData.faq)) {
    const faqSchema = generateFAQSchema(postData.faqSchema || postData.faq);
    if (faqSchema) {
      jsonLdData['@graph'].push(faqSchema);
    }
  }

  // Ensure WebPage object exists (if not generated above)
  let webPageObject = jsonLdData['@graph'].find(item => item['@type'] === 'WebPage');
  if (!webPageObject) {
    // We might have generated Article, but maybe we want a specific WebPage node too?
    // The Article schema has mainEntityOfPage pointing to the URL.
    // Let's add a WebPage node just in case, or rely on Article.
    // Existing logic added WebPage, so let's keep it if we loaded from JSON file.
    // If we generated it, we might not need it if Article covers it, but having it doesn't hurt.
  }

  return jsonLdData;
}

// Find relevant images based on slug keywords
export function findRelevantImages(slug) {
  if (!slug || imageFileNames.length === 0) {
    return { primaryImage: null, otherImages: [] };
  }

  // Prioritize longer, more specific keywords
  const keywords = slug.split('-').filter((k) => k.length > 3);
  if (keywords.length === 0) return { primaryImage: null, otherImages: [] };

  const scoredImages = imageFileNames
    .map((fileName) => {
      // Normalize filename to match keywords (lowercase, remove extension)
      const cleanFileName = path.parse(fileName).name.toLowerCase().replace(/[-_]/g, ' ');
      let score = 0;
      const matched = new Set();

      keywords.forEach((keyword) => {
        if (cleanFileName.includes(keyword)) {
          score += 1;
          // Bonus for keyword being a whole word in the filename
          if (new RegExp(`\\b${keyword}\\b`).test(cleanFileName)) {
            score += 1;
          }
          matched.add(keyword);
        }
      });

      // Bonus for matching more unique keywords
      score += matched.size * 2;

      return {
        fileName: `/images/${fileName}`,
        score,
      };
    })
    .filter((img) => img.score > 0);

  if (scoredImages.length === 0) {
    return { primaryImage: null, otherImages: [] };
  }

  // Sort by score (descending)
  scoredImages.sort((a, b) => b.score - a.score);

  const primaryImage = scoredImages[0]?.fileName || null;
  // Get top 5 other images, excluding the primary one
  const otherImages = scoredImages
    .slice(1, 6)
    .map((img) => img.fileName);

  return { primaryImage, otherImages };
}

// Build related posts list from a post's frontmatter (relatedPosts array)
export function getRelatedPosts(lang, slug) {
  const markdownPath = path.join(contentDirectory, lang, `${slug}.md`);
  try {
    const fileContents = fs.readFileSync(markdownPath, 'utf8');
    const matterResult = matter(fileContents);
    const related = matterResult.data?.relatedPosts;
    if (!Array.isArray(related) || related.length === 0) return [];

    // Load all posts in language to resolve metadata quickly
    const allInLang = getSortedPostsData(lang);
    return related
      .map((relSlug) => {
        const found = allInLang.find((p) => p.slug === relSlug);
        return found
          ? {
            slug: found.slug,
            title: found.title || found.slug,
            description: found.description || '',
            featuredImage: found.featuredImage || '',
            lang,
          }
          : null;
      })
      .filter(Boolean);
  } catch (err) {
    console.error(`Error getting related posts for slug "${slug}" in lang "${lang}"`, err);
    return [];
  }
}

// Return minimal metadata for all posts across languages
export function getAllPostsMeta() {
  let languages = [];
  try {
    languages = fs.readdirSync(contentDirectory).filter((entry) => {
      const entryPath = path.join(contentDirectory, entry);
      try {
        return fs.statSync(entryPath).isDirectory();
      } catch {
        return false;
      }
    });
  } catch (err) {
    console.error(`Error reading content directory: ${contentDirectory}`, err);
    return [];
  }

  const meta = [];
  languages.forEach((lang) => {
    const postsInLang = getSortedPostsData(lang);
    postsInLang.forEach((p) => {
      meta.push({
        lang,
        slug: p.slug,
        title: p.title || p.slug,
        date: serializeDate(p.date),
        tags: Array.isArray(p.tags) ? p.tags : [],
      });
    });
  });

  return meta;
}
