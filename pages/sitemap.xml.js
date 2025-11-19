// Security: Return 404 for old sitemap.xml requests
// Actual sitemap is at kt-secret-map-v9.xml (hidden from competitors)

export default function SitemapXml() {
  return null;
}

export async function getServerSideProps({ res }) {
  // Return 404 status
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Not Found');
  
  return {
    props: {},
  };
}
