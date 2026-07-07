import DestinationContentPage from '@/components/DestinationPage/DestinationContentPage';

const DESTINATION_CATEGORY_ROUTES = [
  'activities',
  'events',
  'food',
  'shopping',
  'sightseeing',
  'taxi',
  'tour-packages',
  'travel-guide',
];

export default function DestinationCategoryPage({ entry, category, allPosts, pageLang, hreflangAlternates }) {
  return (
    <DestinationContentPage
      entry={entry}
      category={category}
      allPosts={allPosts}
      pageLang={pageLang}
      hreflangAlternates={hreflangAlternates}
    />
  );
}

export async function getStaticProps({ params }) {
  if (!DESTINATION_CATEGORY_ROUTES.includes(params.category)) {
    return { notFound: true };
  }

  const { getDestinationEntry } = await import('@/lib/destinationContent');
  const { getAllPostsMeta } = await import('@/lib/posts');
  const { buildAlternateLanguageUrls } = await import('@/lib/hreflang');

  const entry = await getDestinationEntry(params.lang, params.category, params.destination, params.slug);
  const allPosts = getAllPostsMeta();
  const relativeContentPath = `destinations/${params.destination}/${params.category}/${params.slug}.md`;
  const routePath = `city/${params.destination}/${params.category}/${params.slug}`;
  const hreflangAlternates = buildAlternateLanguageUrls({
    relativeFilePath: relativeContentPath,
    routePath,
    fallbackLangs: [params.lang],
  });

  return {
    props: {
      entry,
      category: params.category,
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

  langs.forEach((lang) => {
    DESTINATION_CATEGORY_ROUTES.forEach((category) => {
      const paths = getDestinationPaths(category, lang);
      paths.forEach(({ destination, slug }) => {
        allPaths.push({
          params: { lang, destination, category, slug },
        });
      });
    });
  });

  return {
    paths: allPaths,
    fallback: false,
  };
}
