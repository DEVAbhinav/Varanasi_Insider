// This page lists all blog posts for a specific language.
import NavBar from '../../components/NavBar/NavBar';
import Footer from '../../components/Footer/Footer';
import Link from 'next/link';
import { getSortedPostsData } from '../../lib/posts';

export async function getStaticPaths() {
  // Define the languages you support
  const languages = ['en', 'hi'];
  const paths = languages.map(lang => ({ params: { lang } }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const allPostsData = getSortedPostsData(params.lang);
  return {
    props: {
      allPostsData,
      lang: params.lang,
    },
  };
}

export default function LangHome({ allPostsData, lang }) {
  return (
    <>
      <NavBar />
      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <section>
          <h1 className="text-4xl font-bold mb-8 font-serif">Latest Articles</h1>
          {lang === 'en' && (
            <div className="flex gap-4 mb-6">
              <Link href="/en/services/" className="text-yellow-700 font-semibold">Services →</Link>
              <Link href="/en/packages/" className="text-yellow-700 font-semibold">Packages →</Link>
            </div>
          )}
          <ul className="space-y-10">
            {allPostsData.map(({ slug, date, title, description }) => (
              <li key={slug}>
                <p className="text-sm text-gray-500 mb-1">{date}</p>
                <Link href={`/${lang}/${slug}`}>
                  <h2 className="text-3xl font-bold text-gray-800 hover:text-yellow-600 transition-colors font-serif">{title}</h2>
                </Link>
                <p className="text-lg text-gray-600 mt-2" style={{lineHeight: 1.7}}>{description}</p>
                <Link href={`/${lang}/${slug}`} className="text-yellow-600 hover:text-yellow-700 font-bold mt-3 inline-block">
                    Read More &rarr;
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <Footer />
    </>
  );
}
