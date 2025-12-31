// Security: Return 404 for old sitemap.xml requests
// Actual sitemap is at kt-secret-map-v9.xml (hidden from competitors)

export const runtime = 'experimental-edge';

export default function SitemapXml() {
  return null;
}

export async function getServerSideProps() {
  // Return 404 status using Next.js compatible return for Edge
  return {
    notFound: true,
  };
}
