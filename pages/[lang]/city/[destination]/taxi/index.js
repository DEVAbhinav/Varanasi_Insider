import CategoryDirectoryPage from '@/components/CategoryPage/CategoryDirectoryPage';

const CATEGORY = 'taxi';

export default function TaxiCategoryDirectory(props) {
  return <CategoryDirectoryPage {...props} />;
}

export async function getStaticProps({ params }) {
  const { getCategoryDirectoryEntry } = await import('@/lib/categoryDirectory');
  const { getAllPostsMeta } = await import('@/lib/posts');

  const entry = await getCategoryDirectoryEntry(params.lang, params.destination, CATEGORY);
  const allPosts = getAllPostsMeta();

  return {
    props: {
      entry,
      allPosts,
    },
  };
}

export async function getStaticPaths() {
  const { getCategoryIndexPaths } = await import('@/lib/categoryDirectory');
  const langs = ['en', 'hi'];
  const allPaths = [];

  langs.forEach((lang) => {
    const paths = getCategoryIndexPaths(CATEGORY, lang);
    paths.forEach(({ destination }) => {
      allPaths.push({
        params: {
          lang,
          destination,
        },
      });
    });
  });

  return {
    paths: allPaths,
    fallback: false,
  };
}
