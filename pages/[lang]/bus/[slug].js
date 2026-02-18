// pages/[lang]/bus/[slug].js
// Dynamic Bus / Pilgrimage page loader for content stored in /content/<lang>/bus/<slug>.md
// Mirrors the generic article pattern but namespaces route under /bus for clearer IA & internal links.

import NavBar from '../../../components/NavBar/NavBar';
import Footer from '../../../components/Footer/Footer';
import HeadForBlogs from '../../../components/SEO/HeadForBlogs';
import StickyContactBar from '../../../components/ServicePage/StickyContactBar';
import CTASection from '../../../components/CTA/CTASection';
import ArticleSection from '../../../components/ArticleSection/ArticleSection';

export default function BusPilgrimagePage({ postData, relatedBusPages, jsonLdData, pageLang, pageSlug, alternateLanguages = [] }) {
  return (
    <>
  <HeadForBlogs postData={postData} pageLang={pageLang} pageSlug={`bus/${pageSlug}`} jsonLdData={jsonLdData} alternateLanguages={alternateLanguages} />
      <NavBar />
      <StickyContactBar phone={postData.phone || '8062182380'} />
      <main>
        <div className="container mx-auto px-4 py-8">
          <ArticleSection contentHtml={postData.contentHtml} />
        </div>
        <CTASection
          phone={postData.phone || '8062182380'}
          title="Need help with multi-city pilgrimage logistics?"
          subtitle="WhatsApp us for variant feasibility & buffer strategy"
          variant="default"
        />
        {relatedBusPages?.length > 1 && (
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
        )}
      </main>
      <Footer allPosts={[]} />
    </>
  );
}

export async function getStaticProps({ params }) {
  const fs = await import('fs');
  const fsp = await import('fs/promises');
  const path = await import('path');
  const matter = (await import('gray-matter')).default;
  const { markdownToHtml } = await import('../../../lib/markdown');
  const { buildAlternateLanguageUrls } = await import('../../../lib/hreflang');

  const baseDir = path.join(process.cwd(), 'content', params.lang, 'bus');
  const filePath = path.join(baseDir, `${params.slug}.md`);
  if (!fs.existsSync(filePath)) {
    return { notFound: true };
  }
  const raw = await fsp.readFile(filePath, 'utf8');
  const { data: frontmatter, content } = matter(raw);
  const contentHtml = await markdownToHtml(content);

  // Attempt to load JSON-LD sidecar if present at content/<lang>/json/<slug>.json
  let jsonLdData = null;
  try {
    const jsonPath = path.join(process.cwd(), 'content', params.lang, 'json', `${params.slug}.json`);
    if (fs.existsSync(jsonPath)) {
      jsonLdData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    }
  } catch {}

  // Collect all bus pages for related list
  let relatedBusPages = [];
  try {
    const entries = fs.readdirSync(baseDir).filter(f => f.endsWith('.md'));
    relatedBusPages = entries.map(fname => {
      const full = path.join(baseDir, fname);
      try {
        const { data } = matter(fs.readFileSync(full, 'utf8'));
        return {
          title: data.title || fname.replace(/\.md$/, ''),
            slug: fname.replace(/\.md$/, ''),
            excerpt: data.excerpt || '',
            seoDescription: data.seoDescription || '',
            lang: params.lang,
        };
      } catch { return null; }
    }).filter(Boolean);
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
