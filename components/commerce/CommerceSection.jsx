// components/commerce/CommerceSection.jsx
// The composed, opt-in commerce block for a money page. Owns interactive state
// (selected offer, quantity, add-ons) and derives a live estimate that flows
// into the price breakdown and the enquiry form. Renders nothing if no data.

import React, { useMemo, useState, useEffect } from 'react';
import PriceAnchor from './PriceAnchor';
import PolkaOverlay from './PolkaOverlay';
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
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-500 via-cyan-500 to-teal-500 p-6 text-white shadow-sm md:p-7">
            <PolkaOverlay />
            <div className="relative z-10">
              <span className="text-xs font-semibold uppercase tracking-wide text-white/85">
                {product.typeLabel}
              </span>
              <h2 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">
                {product.productName}
              </h2>
              {product.bestFor && (
                <p className="mt-1.5 text-sm text-white/90">Best for: {product.bestFor}</p>
              )}
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <PriceAnchor
                  price={product.startingPrice}
                  unit={product.startingPriceUnit}
                  priceType="from"
                  tone="light"
                />
                <BadgeRow badges={product.badges} tone="light" />
              </div>
            </div>
          </div>

          <FactRow facts={facts} />

          <TrustRibbon className="border-y border-cyan-100 py-3" />

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
            <div className="rounded-xl border border-cyan-100 bg-cyan-50/60 p-4 text-sm">
              <p className="mb-1 font-semibold text-slate-800">Good to know</p>
              <ul className="list-disc space-y-1 pl-5 text-slate-600">
                {product.requirements.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
              {product.cancellationPolicy && (
                <p className="mt-2 text-slate-600">{product.cancellationPolicy}</p>
              )}
            </div>
          )}

          {product.reviewHighlights?.length > 0 && (
            <ReviewHighlights highlights={product.reviewHighlights} />
          )}
        </div>

        {/* Right: sticky configurator + enquiry */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="overflow-hidden rounded-2xl border border-cyan-100 bg-white shadow-sm">
            <div className="relative overflow-hidden bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-500 px-5 py-3 text-white">
              <PolkaOverlay opacity={0.18} />
              <p className="relative z-10 text-sm font-semibold">Build your booking</p>
            </div>
            <div className="space-y-5 p-5">
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
