import { SEO_FOOTER_LINKS } from '../../lib/seoFooterLinks';

export default function SeoFooterLinks() {
  return (
    <section className="border-t border-gray-200 bg-white py-6">
      <div className="container mx-auto px-4">
        <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-4 sm:p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-600">
            Explore More Destinations
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            Pilgrimage &amp; travel guides across North India
          </p>
          <ul className="mt-3 grid gap-x-6 gap-y-1 text-xs sm:grid-cols-2 lg:grid-cols-3">
            {SEO_FOOTER_LINKS.map((link) => (
              <li key={link.url}>
                <a
                  href={link.url}
                  className="text-gray-600 transition-colors hover:text-gray-900 hover:underline"
                >
                  {link.anchor}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
