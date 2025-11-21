import fs from 'fs';
import path from 'path';

/**
 * Hreflang Utilities
 * Helper functions to generate proper hreflang tags for international SEO
 * Prevents duplicate content penalties by properly declaring language/region variants
 */

const SITE_BASE = 'https://www.kashitaxi.in';
const CONTENT_ROOT = path.join(process.cwd(), 'content');

/**
 * Generate hreflang alternate language objects
 * @param {string} baseUrl - Base URL without language prefix (e.g., '/destinations/varanasi/sightseeing/package')
 * @param {Array<string>} availableLangs - Array of available language codes (e.g., ['en', 'hi'])
 * @param {string} siteBase - Site base URL (default: https://www.kashitaxi.in)
 * @returns {Array<{lang: string, url: string}>} Array of alternate language objects
 */
export function generateHreflangAlternates(baseUrl, availableLangs = ['en'], siteBase = 'https://www.kashitaxi.in') {
  const alternates = [];
  
  // Ensure baseUrl doesn't start with /
  const cleanUrl = baseUrl.startsWith('/') ? baseUrl.slice(1) : baseUrl;
  
  availableLangs.forEach(lang => {
    const fullUrl = `${siteBase}/${lang}/${cleanUrl}`;
    
    // Add base language code
    alternates.push({ lang, url: fullUrl });
    
    // Add regional variants for English
    if (lang === 'en') {
      alternates.push({ lang: 'en-IN', url: fullUrl });
      alternates.push({ lang: 'en-US', url: fullUrl });
      alternates.push({ lang: 'en-GB', url: fullUrl });
      alternates.push({ lang: 'en-AU', url: fullUrl });
    }
    
    // Add regional variant for Hindi
    if (lang === 'hi') {
      alternates.push({ lang: 'hi-IN', url: fullUrl });
    }
  });
  
  // Add x-default (prefer English if available)
  const defaultUrl = availableLangs.includes('en') 
    ? `${siteBase}/en/${cleanUrl}`
    : `${siteBase}/${availableLangs[0]}/${cleanUrl}`;
  
  alternates.push({ lang: 'x-default', url: defaultUrl });
  
  return alternates;
}

/**
 * Generate hreflang link tags for a single language page
 * Used for pages that don't have translations
 * @param {string} currentUrl - Current page URL
 * @param {string} lang - Current language (default: 'en')
 * @returns {Array<{lang: string, url: string}>} Array for single page with regional variants
 */
export function generateSingleLanguageHreflang(currentUrl, lang = 'en') {
  const alternates = [];
  
  // Add base language
  alternates.push({ lang, url: currentUrl });
  
  // Add regional variants
  if (lang === 'en') {
    alternates.push({ lang: 'en-IN', url: currentUrl });
    alternates.push({ lang: 'en-US', url: currentUrl });
    alternates.push({ lang: 'en-GB', url: currentUrl });
    alternates.push({ lang: 'en-AU', url: currentUrl });
  } else if (lang === 'hi') {
    alternates.push({ lang: 'hi-IN', url: currentUrl });
  }
  
  // x-default points to current URL
  alternates.push({ lang: 'x-default', url: currentUrl });
  
  return alternates;
}

/**
 * Get alternate languages from post data or file system
 * Checks if translations exist for a given slug
 * @param {string} slug - Post slug
 * @param {string} currentLang - Current language
 * @param {Array} allPosts - All posts (optional, for checking translations)
 * @returns {Array<{lang: string, slug: string}>} Available translations
 */
export function getAvailableTranslations(slug, currentLang = 'en', allPosts = []) {
  if (!allPosts || allPosts.length === 0) {
    // If no posts provided, return only current language
    return [{ lang: currentLang, slug }];
  }
  
  // Find posts with same slug in different languages
  const translations = allPosts
    .filter(post => post.slug === slug && post.lang !== currentLang)
    .map(post => ({ lang: post.lang, slug: post.slug }));
  
  // Include current language
  translations.unshift({ lang: currentLang, slug });
  
  return translations;
}

/**
 * Generate complete hreflang meta tags for Next.js Head component
 * @param {Array<{lang: string, url: string}>} alternates - Array of alternate language objects
 * @returns {Array<JSX.Element>} Array of link elements
 */
export function renderHreflangTags(alternates) {
  if (!alternates || alternates.length === 0) return null;
  
  return alternates.map((alt, index) => ({
    rel: 'alternate',
    hrefLang: alt.lang,
    href: alt.url,
    key: `hreflang-${alt.lang}-${index}`
  }));
}

/**
 * Validate hreflang setup
 * Checks for common issues in hreflang configuration
 * @param {Array<{lang: string, url: string}>} alternates
 * @returns {Object} Validation result with warnings
 */
export function validateHreflang(alternates) {
  const warnings = [];
  const langCodes = alternates.map(a => a.lang);
  
  // Check for x-default
  if (!langCodes.includes('x-default')) {
    warnings.push('Missing x-default hreflang tag');
  }
  
  // Check for duplicate language codes
  const duplicates = langCodes.filter((lang, index) => langCodes.indexOf(lang) !== index);
  if (duplicates.length > 0) {
    warnings.push(`Duplicate hreflang codes: ${duplicates.join(', ')}`);
  }
  
  // Check for self-referencing (each URL should reference itself)
  const urls = new Set(alternates.map(a => a.url));
  if (urls.size !== alternates.length) {
    warnings.push('Some URLs are identical - ensure proper language variants');
  }
  
  return {
    isValid: warnings.length === 0,
    warnings
  };
}

// Export regional language mappings
export const REGIONAL_VARIANTS = {
  en: ['en', 'en-IN', 'en-US', 'en-GB', 'en-AU'],
  hi: ['hi', 'hi-IN']
};

// Export for sitemap generation
export function getHreflangForSitemap(url, availableLangs = ['en'], baseUrl = 'https://www.kashitaxi.in') {
  const hreflang = [];
  
  availableLangs.forEach(lang => {
    const fullUrl = url.includes(baseUrl) ? url : `${baseUrl}${url}`;
    
    if (lang === 'en') {
      hreflang.push({ lang: 'en', url: fullUrl });
      hreflang.push({ lang: 'en-IN', url: fullUrl });
      hreflang.push({ lang: 'en-US', url: fullUrl });
      hreflang.push({ lang: 'en-GB', url: fullUrl });
      hreflang.push({ lang: 'en-AU', url: fullUrl });
    } else if (lang === 'hi') {
      hreflang.push({ lang: 'hi', url: fullUrl });
      hreflang.push({ lang: 'hi-IN', url: fullUrl });
    }
  });
  
  // x-default
  const defaultUrl = availableLangs.includes('en') 
    ? (availableLangs[0] === 'en' ? url : url.replace(/\/(hi|en)\//, '/en/'))
    : url;
  
  hreflang.push({ lang: 'x-default', url: defaultUrl.includes(baseUrl) ? defaultUrl : `${baseUrl}${defaultUrl}` });
  
  return hreflang;
}

const listContentLanguages = () => {
  try {
    return fs
      .readdirSync(CONTENT_ROOT)
      .filter((entry) => {
        const entryPath = path.join(CONTENT_ROOT, entry);
        try {
          return fs.statSync(entryPath).isDirectory();
        } catch {
          return false;
        }
      });
  } catch {
    return [];
  }
};

const normalizeRelativePath = (relPath = '') => relPath.replace(/^\/+/, '');

const normalizeRoutePath = (routePath = '') => normalizeRelativePath(routePath).replace(/\/+$/, '');

export function findLanguagesForContent(relativeFilePath) {
  const cleanPath = normalizeRelativePath(relativeFilePath);
  if (!cleanPath) return [];

  return listContentLanguages().filter((lang) => {
    const candidatePath = path.join(CONTENT_ROOT, lang, cleanPath);
    try {
      return fs.existsSync(candidatePath);
    } catch {
      return false;
    }
  });
}

export function buildAlternateLanguageUrls({
  relativeFilePath,
  routePath,
  siteBase = SITE_BASE,
  fallbackLangs = [],
}) {
  if (!relativeFilePath) return [];

  const languages = findLanguagesForContent(relativeFilePath);
  const uniqueLangs = Array.from(new Set([...(languages || []), ...fallbackLangs].filter(Boolean)));
  const normalizedRoute = normalizeRoutePath(routePath);
  const base = siteBase.replace(/\/+$/, '');

  return uniqueLangs.map((lang) => ({
    lang,
    url: normalizedRoute ? `${base}/${lang}/${normalizedRoute}` : `${base}/${lang}/`,
  }));
}
