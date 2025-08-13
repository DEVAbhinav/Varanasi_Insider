// This file contains the core logic for fetching data from Markdown files.
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';

const contentDirectory = path.join(process.cwd(), 'content');

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

        // Combine the data with the slug
        return {
          slug,
          ...matterResult.data,
        };
      } catch (err) {
        console.error(`Error parsing markdown file: ${fileName}`, err);
        return null; // Return null for files that cause errors
      }
    })
    .filter(Boolean); // Filter out null values

  // Sort posts by date
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
      paths.push({
        params: {
          lang: lang,
          slug: fileName.replace(/\.md$/, ''),
        },
      });
    });
  });

  return paths;
}

// Get data for a single post by lang and slug
export async function getPostData(lang, slug) {
  const fullPath = path.join(contentDirectory, lang, `${slug}.md`);
  try {
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Use remark to convert markdown into HTML string
    const processedContent = await remark()
      .use(html)
      .use(remarkGfm)
      .process(matterResult.content);
    const contentHtml = processedContent.toString();

    // Combine the data with the slug and contentHtml
    return {
      slug,
      contentHtml,
      ...matterResult.data,
    };
  } catch (err) {
    console.error(`Error getting post data for slug "${slug}" in lang "${lang}"`, err);
    // Re-throw the error to be handled by getStaticProps
    throw err;
  }
}

// Get JSON-LD data for a single post by lang and slug
export function getJsonLdData(lang, slug) {
  const jsonPath = path.join(contentDirectory, lang, 'json', `${slug}.json`);
  try {
    const fileContents = fs.readFileSync(jsonPath, 'utf8');
    return JSON.parse(fileContents);
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.error(`Error getting JSON-LD data for slug "${slug}" in lang "${lang}"`, err);
    }
    // Return null if the file doesn't exist or is invalid
    return null;
  }
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
        date: p.date || null,
        tags: Array.isArray(p.tags) ? p.tags : [],
      });
    });
  });

  return meta;
}