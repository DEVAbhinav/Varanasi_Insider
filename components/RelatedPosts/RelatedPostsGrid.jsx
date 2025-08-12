import Link from 'next/link'

// Inline SVG gradient placeholder for broken/missing images
const FALLBACK_IMG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="960" height="540" viewBox="0 0 960 540">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#faf5ff"/>
      <stop offset="1" stop-color="#ffe4e6"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji'" font-size="28" fill="#475569">Varanasi Guide</text>
</svg>`)

export default function RelatedPostsGrid({ items = [], lang = 'en' }) {
  if (!items || items.length === 0) return null
  return (
    <section aria-labelledby="related-posts-heading" className="mx-auto mt-10 w-full max-w-5xl px-4">
      <h2 id="related-posts-heading" className="text-2xl font-bold tracking-tight text-gray-900">
        Read Next
      </h2>
      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((post) => {
          const href = `/${post.lang || lang}/${post.slug}`
          const img = post.featuredImage
          const hasImg = !!img
          return (
            <Link
              key={`${post.lang || lang}-${post.slug}`}
              href={href}
              className="group relative block overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              {/* Media */}
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-t-2xl">
                {hasImg ? (
                  <>
                    <img
                      src={img}
                      alt={post.title || post.slug}
                      width={960}
                      height={540}
                      className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]"
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const el = e.currentTarget
                        // Prevent infinite loop
                        el.onerror = null
                        el.src = FALLBACK_IMG
                      }}
                    />
                    {/* Subtle overlay only for real images */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 via-black/0 to-transparent" />
                  </>
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-50 via-rose-50 to-orange-50">
                    <div className="flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-white/60">
                      <span className="text-xl">🪔</span>
                      <span>Varanasi Guide</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="line-clamp-2 text-base font-semibold text-gray-900 group-hover:text-orange-700">
                  {post.title || post.slug}
                </h3>
                {post.description && (
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-600">{post.description}</p>
                )}
                <div className="mt-3 inline-flex items-center text-sm font-medium text-orange-700">
                  Read more <span className="ml-1 transition-transform group-hover:translate-x-0.5">→</span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
