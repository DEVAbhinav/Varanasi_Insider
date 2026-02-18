import { SEO_FOOTER_LINKS } from '../../lib/seoFooterLinks';

function getAnchorLabel(url) {
  return url.replace('https://', '').replace(/\/$/, '');
}

export default function SeoFooterLinks() {
  return (
    <section className="border-t border-gray-200 bg-white py-6">
      <div className="container mx-auto px-4">
        <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-4 sm:p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-600">
            Bharat Tourism Pages
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            Partner links
          </p>
          <ul className="mt-3 grid gap-x-6 gap-y-1 text-xs sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {SEO_FOOTER_LINKS.map((url) => (
              <li key={url}>
                <a
                  href={url}
                  className="break-all text-gray-600 transition-colors hover:text-gray-900 hover:underline"
                >
                  {getAnchorLabel(url)}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
