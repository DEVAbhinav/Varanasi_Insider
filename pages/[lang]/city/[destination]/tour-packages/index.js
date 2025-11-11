import CategoryPageLayout from '@/components/CategoryPage/CategoryPageLayout';
import { DESTINATION_CATEGORIES, getDestinationEntries, getDestinationEntry } from '@/lib/destinationContent';

const CATEGORY = DESTINATION_CATEGORIES.TOUR_PACKAGES || 'tour-packages';

const formatDestinationName = (slug) => (
  slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
);

const createHeroCopy = (destinationName) => ({
  title: `${destinationName} Tour Packages`,
  subtitle: `Browse locally curated itineraries, boats, guides, and concierge-managed experiences for ${destinationName}.`,
  badge: `${destinationName} Specials`,
});

export default function TourPackagesIndexPage({
  title,
  metaTitle,
  metaDescription,
  heroTitle,
  heroSubtitle,
  heroBadge,
  items,
}) {
  return (
    <CategoryPageLayout
      title={title}
      metaTitle={metaTitle}
      metaDescription={metaDescription}
      heroTitle={heroTitle}
      heroSubtitle={heroSubtitle}
      heroBadge={heroBadge}
      items={items}
    />
  );
}

export async function getStaticProps({ params }) {
  const { lang, destination } = params;
  const destinationEntries = getDestinationEntries(CATEGORY, lang).filter(
    (entry) => entry.destination === destination,
  );

  if (destinationEntries.length === 0) {
    return { notFound: true };
  }

  const pages = await Promise.all(
    destinationEntries.map(({ slug }) => (
      getDestinationEntry(lang, CATEGORY, destination, slug)
    )),
  );

  const destinationName = formatDestinationName(destination);
  const { title: heroTitle, subtitle: heroSubtitle, badge: heroBadge } = createHeroCopy(destinationName);

  const items = pages
    .map((page) => ({
      slug: page.slug,
      title: page.heading || page.title,
      description: page.description || page.metaDescription || null,
      href: `/${lang}/city/${destination}/${CATEGORY}/${page.slug}`,
      ctaText: 'View itinerary',
    }))
    .sort((a, b) => a.title.localeCompare(b.title));

  const metaTitle = `${destinationName} Tour Packages | Kashi Taxi`;
  const metaDescription = `Compare ${pages.length} curated tour packages for ${destinationName}. Each itinerary includes darshan planning, trusted drivers, and concierge support.`;

  return {
    props: {
      title: `${destinationName} Tour Packages`,
      metaTitle,
      metaDescription,
      heroTitle,
      heroSubtitle,
      heroBadge,
      items,
    },
  };
}

export async function getStaticPaths() {
  const langs = ['en', 'hi'];
  const paths = [];

  langs.forEach((lang) => {
    const entries = getDestinationEntries(CATEGORY, lang);
    const destinations = new Set(entries.map((entry) => entry.destination));
    destinations.forEach((destination) => {
      paths.push({
        params: { lang, destination },
      });
    });
  });

  return {
    paths,
    fallback: false,
  };
}
