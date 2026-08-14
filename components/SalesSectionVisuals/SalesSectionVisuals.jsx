import assets from '@/data/sales-visual-assets.json';

export default function SalesSectionVisuals({ route, className = '' }) {
  const items = assets.filter((asset) => asset.route === route).sort((a, b) => a.index - b.index);
  if (items.length === 0) return null;

  return (
    <section className={`sales-visual-gallery ${className}`.trim()} aria-label="Kashi Taxi visual planning guides">
      {items.map((asset) => (
        <figure className="sales-section-visual" data-sales-visual={asset.id} key={asset.id}>
          <a href="/booking" aria-label="Plan and book this trip with Kashi Taxi">
            <img
              src={asset.cloudinaryUrl || asset.localPath}
              alt={asset.alt}
              loading="lazy"
              width={asset.width}
              height={asset.height}
            />
          </a>
          <figcaption>
            {asset.caption} <strong>{asset.credit}</strong>
          </figcaption>
        </figure>
      ))}
    </section>
  );
}
