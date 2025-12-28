import Head from 'next/head'
import HreflangTags from './HreflangTags'

/**
 * HeadForBlogs
 * Centralized SEO head for Markdown-driven article pages.
 *
 * Props:
 * - postData: frontmatter + slug + fields from lib/posts (title, description, keywords, tags, author, date, lastUpdated, featuredImage, lang)
 * - pageLang: dynamic route lang (for canonical building)
 * - pageSlug: dynamic route slug (for canonical building)
 * - jsonLdData: optional JSON-LD object to inline
 * - siteBase: override site origin (defaults to https://www.kashitaxi.in)
 * - alternateLanguages: optional array of {lang, url} for hreflang tags
 */
export default function HeadForBlogs({ postData, pageLang = 'en', pageSlug, jsonLdData, siteBase = 'https://www.kashitaxi.in', alternateLanguages = [] }) {
  if (!postData) return null

  const SITE = siteBase
  const langForPath = pageLang || 'en'
  const slugForPath = pageSlug || postData.slug
  const urlPath = `/${langForPath}/${slugForPath}`
  const canonical = `${SITE}${urlPath}`

  // Prefer metaTitle/metaDescription for SERP; fall back to title/description
  const title = postData.metaTitle || postData.title || 'Varanasi Taxi'
  const description = postData.metaDescription || postData.description || ''
  const keywords = postData.keywords || (Array.isArray(postData.tags) ? postData.tags.join(', ') : undefined)
  const author = postData.author || 'Varanasi Taxi'
  const published = postData.date || undefined
  const modified = postData.lastUpdated || postData.date || undefined
  const ogLocale = (postData.lang || (langForPath === 'hi' ? 'hi-IN' : 'en-IN')).replace('-', '_')

  const ogImage = postData.featuredImage
    ? (postData.featuredImage.startsWith('http') ? postData.featuredImage : `${SITE}${postData.featuredImage}`)
    : `${SITE}https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/varanasi-hero.png`

  return (
    <Head>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={canonical} />

      <HreflangTags pageLang={langForPath} canonical={canonical} alternates={alternateLanguages} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}        
      <meta property="og:type" content="article" />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Varanasi Taxi" />
      <meta property="og:locale" content={ogLocale} />
      {published && <meta property="article:published_time" content={published} />}
      {modified && <meta property="article:modified_time" content={modified} />}
      {Array.isArray(postData.tags) && postData.tags.slice(0, 6).map((t) => (
        <meta key={t} property="article:tag" content={t} />
      ))}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD */}
      {jsonLdData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />
      )}
    </Head>
  )
}
