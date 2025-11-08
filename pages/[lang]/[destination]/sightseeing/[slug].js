import DestinationContentPage from '@/components/DestinationPage/DestinationContentPage';
import { DESTINATION_CATEGORIES, getDestinationEntry, getDestinationPaths } from '@/lib/destinationContent';
import { getAllPostsMeta } from '@/lib/posts';

const CATEGORY = DESTINATION_CATEGORIES.SIGHTSEEING;

export default function SightseeingPage({ entry, allPosts }) {
  return <DestinationContentPage entry={entry} category={CATEGORY} allPosts={allPosts} />;
}

export async function getStaticProps({ params }) {
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
