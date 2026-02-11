import fs from 'fs';
import path from 'path';

export default function SitemapXml() {
  return null;
}

export async function getServerSideProps({ res }) {
  const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');

  if (!fs.existsSync(sitemapPath)) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Sitemap not generated. Run: npm run generate-sitemap');
    return { props: {} };
  }

  const xml = fs.readFileSync(sitemapPath, 'utf-8');

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400');
  res.end(xml);

  return { props: {} };
}
