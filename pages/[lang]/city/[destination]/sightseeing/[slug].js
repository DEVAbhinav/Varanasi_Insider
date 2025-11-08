import DestinationContentPage from '@/components/DestinationPage/DestinationContentPage';

const CATEGORY = 'sightseeing';

export default function SightseeingPage({ entry, allPosts }) {
  return <DestinationContentPage entry={entry} category={CATEGORY} allPosts={allPosts} />;
}

export async function getStaticProps({ params }) {
  const { getDestinationEntry } = await import('@/lib/destinationContent');
  const { getAllPostsMeta } = await import('@/lib/posts');
  
  const entry = await getDestinationEntry(params.lang, CATEGORY, params.destination, params.slug);
  const allPosts = getAllPostsMeta();

  return {
    props: {
      entry,
      allPosts,
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
