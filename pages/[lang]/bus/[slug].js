// pages/[lang]/bus/[slug].js
// Dynamic Bus / Pilgrimage page loader for content stored in /content/<lang>/bus/<slug>.md

import ContentPageLayout from '../../../components/layouts/ContentPageLayout';
import HeadForBlogs from '../../../components/SEO/HeadForBlogs';
import ArticleSection from '../../../components/ArticleSection/ArticleSection';
import ContentEnhancements from '../../../components/ArticleSection/ContentEnhancements';
import { CONTACT } from '@/lib/contact';

export default function BusPilgrimagePage({ postData, relatedBusPages, jsonLdData, pageLang, pageSlug, alternateLanguages = [] }) {
  const relatedGrid = relatedBusPages?.length > 1 ? (
    <section className="container mx-auto px-4 pb-16">
      <h2 className="text-2xl font-semibold mb-4">Related Pilgrimage Routes</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {relatedBusPages.filter(p => p.slug !== pageSlug).slice(0, 6).map(p => (
          <a key={p.slug} href={`/${p.lang}/bus/${p.slug}`} className="block rounded-xl border p-4 hover:shadow-sm transition bg-white/60 dark:bg-zinc-900/50">
            <h3 className="font-medium text-lg leading-snug mb-1">{p.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-3">{p.excerpt || p.seoDescription || ''}</p>
          </a>
        ))}
      </div>
    </section>
  ) : null;

  return (
    <ContentPageLayout
      head={<HeadForBlogs postData={postData} pageLang={pageLang} pageSlug={`bus/${pageSlug}`} jsonLdData={jsonLdData} alternateLanguages={alternateLanguages} />}
      phone={postData.phone || CONTACT.callNumberRaw}
      pageTitle={postData.title}
      pageUrl={`/${pageLang}/bus/${pageSlug}`}
      contentHtml={postData.contentHtml}
      faqSchema={postData.faqSchema}
      cta={{ title: 'Need help with multi-city pilgrimage logistics?', subtitle: 'WhatsApp us for variant feasibility & buffer strategy' }}
      allPosts={[]}
      afterMain={relatedGrid}
    >
      <ArticleSection contentHtml={postData.contentHtml} />
      <ContentEnhancements.Inline html={postData.contentHtml} quickFacts={postData.quickFacts} />
    </ContentPageLayout>
  );
}

export async function getStaticProps({ params }) {
  const fs = await import('fs');
  const path = await import('path');
  const { loadMarkdownContent } = await import('../../../lib/posts');
  const { buildAlternateLanguageUrls } = await import('../../../lib/hreflang');

  const baseDir = path.join(process.cwd(), 'content', params.lang, 'bus');
  const filePath = path.join(baseDir, `${params.slug}.md`);
  if (!fs.existsSync(filePath)) {
    return { notFound: true };
  }
  const { frontmatter, contentHtml } = await loadMarkdownContent(params.lang, `bus/${params.slug}`);

  let jsonLdData = null;
  try {
    const jsonPath = path.join(process.cwd(), 'content', params.lang, 'json', `${params.slug}.json`);
    if (fs.existsSync(jsonPath)) {
      jsonLdData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    }
  } catch {}

  let relatedBusPages = [];
  try {
    const entries = fs.readdirSync(baseDir).filter(f => f.endsWith('.md'));
    relatedBusPages = (await Promise.all(entries.map(async (fname) => {
      try {
        const slug = fname.replace(/\.md$/, '');
        const { frontmatter: data } = await loadMarkdownContent(params.lang, `bus/${slug}`);
        return {
          title: data.title || fname.replace(/\.md$/, ''),
            slug,
            excerpt: data.excerpt || '',
            seoDescription: data.seoDescription || '',
            lang: params.lang,
        };
      } catch { return null; }
    }))).filter(Boolean);
  } catch {}

  const alternateLanguages = buildAlternateLanguageUrls({
    relativeFilePath: path.join('bus', `${params.slug}.md`),
    routePath: `bus/${params.slug}`,
    fallbackLangs: [params.lang],
  });

  return {
    props: {
      postData: { ...frontmatter, contentHtml },
      relatedBusPages,
      jsonLdData,
      pageLang: params.lang,
      pageSlug: params.slug,
      alternateLanguages,
    },
  };
}

export async function getStaticPaths() {
  const fs = await import('fs');
  const path = await import('path');
  const root = path.join(process.cwd(), 'content');
  let paths = [];
  try {
    const langs = fs.readdirSync(root).filter(l => !l.startsWith('.'));
    for (const lang of langs) {
      const busDir = path.join(root, lang, 'bus');
      if (!fs.existsSync(busDir)) continue;
      const files = fs.readdirSync(busDir).filter(f => f.endsWith('.md'));
      files.forEach(f => {
        paths.push({ params: { lang, slug: f.replace(/\.md$/, '') } });
      });
    }
  } catch {}
  return { paths, fallback: false };
}
