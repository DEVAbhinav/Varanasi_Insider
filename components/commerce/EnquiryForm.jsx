// components/commerce/EnquiryForm.jsx
// Order enquiry form. Reuses the shared useBookingForm hook + /api/contact-form
// contract, but builds a product-aware payload (buildOrderPayload) so the lead
// names the exact product, variant, price, and add-ons the user selected.

import React from 'react';
import { useBookingForm } from '../BookingWidget/useBookingForm';
import { Button } from '@/components/ui/button';
import { CONTACT, getCallTelHref, getWhatsAppUrl } from '@/lib/contact';
import { buildOrderPayload, buildOrderAnalytics } from '@/lib/orderPayload';
import { trackCommerce, COMMERCE_EVENTS } from '@/lib/analyticsEvents';

export default function EnquiryForm({ product, offer, estimate, addons = [], meta = {} }) {
  const initialFormData = { name: '', phone: '', email: '', date: '', pickup: '', notes: '' };

  const {
    formData,
    loading,
    success,
    error,
    handleChange,
    handleSubmit,
    whatsappLink,
  } = useBookingForm({
    initialFormData,
    widgetLabel: `Commerce Enquiry: ${product?.productName || ''}`,
    resetOnSuccess: false,
    clearErrorOnChange: true,
    buildPayload: (data) =>
      buildOrderPayload({ product, offer, estimate, addons, form: data, meta }),
    buildAnalytics: () => buildOrderAnalytics({ product, offer, estimate, addons, meta }),
  });

  const onSubmit = (e) => {
    trackCommerce(COMMERCE_EVENTS.SUBMIT_ENQUIRY, buildOrderAnalytics({ product, offer, estimate, addons, meta }));
    return handleSubmit(e);
  };

  const waText = `Hi, I'm interested in ${product?.productName || 'a package'}${
    offer?.name ? ` (${offer.name})` : ''
  }${addons.length ? ` + ${addons.map((a) => a.label).join(', ')}` : ''}.`;

  if (success) {
    return (
      <div className="rounded-2xl border border-cyan-100 bg-white p-6 text-center shadow-sm">
        <div className="mb-2 text-4xl">✅</div>
        <h3 className="text-lg font-semibold text-slate-900">Enquiry received!</h3>
        <p className="mt-1 text-sm text-slate-500">
          Thanks {formData.name || ''} — we'll call you shortly at {formData.phone}.
        </p>
        <div className="mt-4 flex justify-center gap-2">
          <Button asChild className="bg-emerald-500 text-white hover:bg-emerald-600">
            <a
              href={whatsappLink || getWhatsAppUrl(waText)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackCommerce(COMMERCE_EVENTS.CLICK_WHATSAPP, { product_slug: meta.slug })}
            >
              Confirm on WhatsApp
            </a>
          </Button>
        </div>
      </div>
    );
  }

  const inputCls =
    'w-full rounded-lg border-2 border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-cyan-500';

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-cyan-100 bg-white p-5 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900">Get a quote / book</h3>
      <p className="mt-0.5 text-xs text-slate-500">
        No advance needed. We confirm availability by call/WhatsApp.
      </p>

      {error && (
        <div className="mt-3 rounded-lg border-2 border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your name *"
          className={inputCls}
          required
        />
        <input
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone *"
          className={inputCls}
          required
        />
        <input
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          min={new Date().toISOString().split('T')[0]}
          className={inputCls}
          aria-label="Travel date"
        />
        <input
          name="pickup"
          value={formData.pickup}
          onChange={handleChange}
          placeholder="Pickup / city"
          className={inputCls}
        />
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Anything specific? (optional)"
          rows={2}
          className={`${inputCls} sm:col-span-2`}
        />
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Button type="submit" size="lg" variant="brand" className="flex-1" disabled={loading}>
          {loading ? 'Sending…' : `${product?.ctaVerb || 'Enquire'} now`}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="border-cyan-500 text-cyan-700 hover:bg-cyan-50 hover:text-cyan-800"
          asChild
        >
          <a
            href={getCallTelHref()}
            onClick={() => trackCommerce(COMMERCE_EVENTS.CLICK_CALL, { product_slug: meta.slug })}
          >
            Call {CONTACT.callNumberDisplay.replace('+91 ', '')}
          </a>
        </Button>
      </div>
    </form>
  );
}
