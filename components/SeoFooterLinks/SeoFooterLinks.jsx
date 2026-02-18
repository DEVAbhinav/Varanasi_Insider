import { SEO_FOOTER_LINKS } from '../../lib/seoFooterLinks';

function getAnchorLabel(url) {
  return url.replace('https://', '').replace(/\/$/, '');
}

export default function SeoFooterLinks() {
  return (
    <section className="border-t border-gray-200 bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-600">
          Bharat Tourism Links
        </h2>
        <ul className="mt-4 grid gap-2 text-sm md:grid-cols-2">
          {SEO_FOOTER_LINKS.map((url) => (
            <li key={url}>
              <a
                href={url}
                className="break-all text-blue-700 hover:text-blue-800 hover:underline"
              >
                {getAnchorLabel(url)}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
