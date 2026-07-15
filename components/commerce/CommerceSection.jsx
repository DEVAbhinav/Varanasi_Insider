// components/commerce/CommerceSection.jsx
// The composed, opt-in commerce block for a money page. Owns interactive state
// (selected offer, quantity, add-ons) and derives a live estimate that flows
// into the price breakdown and the enquiry form. Renders nothing if no data.

import React, { useMemo, useState, useEffect } from 'react';
import PriceAnchor from './PriceAnchor';
import BadgeRow from './BadgeRow';
import FactRow from './FactRow';
import InclusionsList from './InclusionsList';
import ItineraryAccordion from './ItineraryAccordion';
import VariantSelector from './VariantSelector';
import AddonPicker from './AddonPicker';
import PriceBreakdown from './PriceBreakdown';
import TrustRibbon from './TrustRibbon';
import ReviewHighlights from './ReviewHighlights';
import EnquiryForm from './EnquiryForm';
import { estimate as computeEstimate } from '@/lib/pricing';
import { trackCommerce, COMMERCE_EVENTS } from '@/lib/analyticsEvents';

export default function CommerceSection({ product, meta = {} }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [quantity, setQuantity] = useState(2);
  const [addonIds, setAddonIds] = useState([]);

  const offer = product?.offers?.[selectedIndex] || product?.offers?.[0] || null;
  const selectedAddons = useMemo(
    () => (product?.addons || []).filter((a) => addonIds.includes(a.id)),
    [product, addonIds]
  );

  const est = useMemo(
    () => computeEstimate({ offer, quantity, selector: product?.selector, addons: selectedAddons }),
    [offer, quantity, product, selectedAddons]
  );

  useEffect(() => {
    if (!product) return;
    trackCommerce(COMMERCE_EVENTS.VIEW_OFFER, {
      product_type: product.productType,
      product_slug: meta.slug,
    });
    // fire once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!product) return null;

  const facts = [
    { key: 'duration', value: product.duration },
    { key: 'passengers', value: product.passengerRange },
    { key: 'seats', value: product.seats ? `${product.seats} seats` : '' },
    { key: 'distance', value: product.distanceIncludedKm ? `${product.distanceIncludedKm} km incl.` : '' },
    { key: 'pickup', value: product.pickupCoverage },
  ];

  const handleSelectOffer = (i) => {
    setSelectedIndex(i);
    trackCommerce(COMMERCE_EVENTS.SELECT_VARIANT, {
      product_slug: meta.slug,
      selected_offer: product.offers[i]?.name,
    });
  };

  const handleToggleAddon = (id) => {
    setAddonIds((prev) => {
      const has = prev.includes(id);
      trackCommerce(has ? COMMERCE_EVENTS.REMOVE_ADDON : COMMERCE_EVENTS.ADD_ADDON, {
        product_slug: meta.slug,
        addon_id: id,
      });
      return has ? prev.filter((x) => x !== id) : [...prev, id];
    });
  };

  return (
    <section id="book" className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        {/* Left: offer detail */}
        <div className="space-y-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wide text-primary">
              {product.typeLabel}
            </span>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">
              {product.productName}
            </h2>
            {product.bestFor && (
              <p className="mt-1 text-sm text-muted-foreground">Best for: {product.bestFor}</p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <PriceAnchor
              price={product.startingPrice}
              unit={product.startingPriceUnit}
              priceType="from"
            />
            <BadgeRow badges={product.badges} />
          </div>

          <FactRow facts={facts} />

          <TrustRibbon className="border-y py-3" />

          <InclusionsList
            inclusions={product.inclusions}
            exclusions={product.exclusions}
            expandableAfter={product.expandableAfter}
          />

          {product.itinerary?.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Itinerary
              </h3>
              <ItineraryAccordion itinerary={product.itinerary} />
            </div>
          )}

          {product.requirements?.length > 0 && (
            <div className="rounded-xl border bg-muted/30 p-4 text-sm">
              <p className="mb-1 font-semibold">Good to know</p>
              <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                {product.requirements.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
              {product.cancellationPolicy && (
                <p className="mt-2 text-muted-foreground">{product.cancellationPolicy}</p>
              )}
            </div>
          )}

          {product.reviewHighlights?.length > 0 && (
            <ReviewHighlights highlights={product.reviewHighlights} />
          )}
        </div>

        {/* Right: sticky configurator + enquiry */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="space-y-5 rounded-2xl border bg-card p-5 shadow-sm">
            <VariantSelector
              offers={product.offers}
              selectedIndex={selectedIndex}
              quantity={quantity}
              selector={product.selector}
              onSelectOffer={handleSelectOffer}
              onChangeQuantity={setQuantity}
            />
            <AddonPicker
              addons={product.addons}
              selectedIds={addonIds}
              onToggle={handleToggleAddon}
            />
            <PriceBreakdown estimate={est} />
            {(offer?.priceIncludes?.length > 0 || offer?.priceExcludes?.length > 0) && (
              <InclusionsList
                inclusions={offer.priceIncludes}
                exclusions={offer.priceExcludes}
              />
            )}
          </div>

          <div className="mt-4">
            <EnquiryForm
              product={product}
              offer={offer}
              estimate={est}
              addons={selectedAddons}
              meta={meta}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
