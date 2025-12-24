import DestinationContentPage from '@/components/DestinationPage/DestinationContentPage';

const CATEGORY = 'food';

export default function DestinationFoodPage({ entry, allPosts, pageLang, hreflangAlternates }) {
  return (
    <DestinationContentPage
      entry={entry}
      category={CATEGORY}
      allPosts={allPosts}
      pageLang={pageLang}
      hreflangAlternates={hreflangAlternates}
    />
  );
}

export async function getStaticProps({ params }) {
  const { getDestinationEntry } = await import('@/lib/destinationContent');
  const { getAllPostsMeta } = await import('@/lib/posts');
  const { buildAlternateLanguageUrls } = await import('@/lib/hreflang');
  
  const entry = await getDestinationEntry(params.lang, CATEGORY, params.destination, params.slug);
  const allPosts = getAllPostsMeta();
  const relativeContentPath = `destinations/${params.destination}/${CATEGORY}/${params.slug}.md`;
  const routePath = `city/${params.destination}/${CATEGORY}/${params.slug}`;
  const hreflangAlternates = buildAlternateLanguageUrls({
    relativeFilePath: relativeContentPath,
    routePath,
    fallbackLangs: [params.lang],
  });

  return {
    props: {
      entry,
      allPosts,
      pageLang: params.lang,
      hreflangAlternates,
    },
  };
}

export async function getStaticPaths() {
  const { getDestinationPaths } = await import('@/lib/destinationContent');
  const langs = ['en', 'hi'];
  const allPaths = [];
  
  langs.forEach(lang => {
    const paths = getDestinationPaths(CATEGORY, lang);
    paths.forEach(({ destination, slug }) => {
      allPaths.push({
        params: { lang, destination, slug }
      });
    });
  });

  return {
    paths: allPaths,
    fallback: false,
  };
}
