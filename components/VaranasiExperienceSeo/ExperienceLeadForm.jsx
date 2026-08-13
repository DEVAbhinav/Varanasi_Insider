/**
 * ExperienceLeadForm — the conversion point of /ganga-aarti.
 *
 * The immersive scroll earns attention but a WhatsApp deep link only converts
 * people who are willing to leave the page. This captures the lead in place
 * through the same /api/contact-form pipeline every other widget uses, so the
 * enquiry reaches the operator inbox (and the ERP) tagged to this experience.
 */

import { useState } from 'react';
import { CONTACT, getCallTelHref, getWhatsAppUrl } from '@/lib/contact';
import { logClick } from '@/lib/logClick';
import { useBookingForm } from '@/components/BookingWidget/useBookingForm';
import styles from './ExperienceLeadForm.module.css';

const SOURCE = 'Immersive Varanasi Experience (/ganga-aarti)';
const PAGE_URL = 'https://www.kashitaxi.in/ganga-aarti';

const INTERESTS = [
  'Sunrise boat ride',
  'Kashi Vishwanath darshan',
  'Ganga Aarti seating',
  'Sarnath half day',
  'Full day, all of it',
];

export default function ExperienceLeadForm() {
  const [interest, setInterest] = useState('Full day, all of it');

  const {
    formData,
    loading,
    success,
    error,
    handleChange,
    handleSubmit,
    whatsappLink,
  } = useBookingForm({
    initialFormData: { name: '', phone: '', date: '', passengers: '2' },
    widgetLabel: 'Immersive Varanasi Experience',
    clearErrorOnChange: true,
    resetOnSuccess: false,
    // Field names follow the /api/contact-form (Azure Function) contract exactly;
    // parentPageUrl is what the ERP uses to attribute the lead to this page.
    buildPayload: (data) => ({
      name: data.name,
      phone: data.phone,
      passengers: data.passengers,
      tripType: `Varanasi Day Experience — ${interest}`,
      pickupDate: data.date,
      message: `Interested in: ${interest}. Travel date: ${data.date || 'flexible'}. Travellers: ${data.passengers || 'not specified'}. Lead came from the immersive Ganga Aarti experience page.`,
      source: SOURCE,
      parentPageTitle: typeof document !== 'undefined' ? document.title : null,
      parentPageUrl: typeof window !== 'undefined' ? window.location.href : PAGE_URL,
      visitorLanguage: typeof navigator !== 'undefined' ? navigator.language : 'en',
    }),
    buildAnalytics: (data) => ({
      travel_date: data.date,
      passenger_count: data.passengers,
      trip_destination: interest,
      source_widget: 'Immersive Varanasi Experience',
      intent_cluster: 'varanasi-sightseeing',
    }),
  });

  if (success) {
    return (
      <div className={styles.form} role="status">
        <p className={styles.successTitle}>Got it — we will call you back.</p>
        <p className={styles.successCopy}>
          Your enquiry is with our Varanasi desk. If you would rather talk right now, WhatsApp is
          the fastest way to reach us.
        </p>
        <a
          href={whatsappLink || CONTACT.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.submit}
          onClick={() => logClick('WHATSAPP')}
          data-cta-id="immersive-varanasi-post-lead-whatsapp"
          data-cta-location="experience-lead-form"
          data-page-type="experience"
          data-intent-cluster="varanasi-sightseeing"
          data-service-type="tour"
        >
          Continue on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <p className={styles.formTitle}>Get a plan for your date</p>

      <div className={styles.chips} role="group" aria-label="What are you most interested in?">
        {INTERESTS.map((item) => (
          <button
            key={item}
            type="button"
            className={interest === item ? styles.chipActive : styles.chip}
            aria-pressed={interest === item}
            onClick={() => setInterest(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div className={styles.row}>
        <label className={styles.field}>
          <span>Name</span>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            autoComplete="name"
            placeholder="Your name"
            required
          />
        </label>
        <label className={styles.field}>
          <span>Phone / WhatsApp</span>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            autoComplete="tel"
            inputMode="numeric"
            placeholder="10-digit number"
            required
          />
        </label>
      </div>

      <div className={styles.row}>
        <label className={styles.field}>
          <span>Travel date</span>
          <input type="date" name="date" value={formData.date} onChange={handleChange} />
        </label>
        <label className={styles.field}>
          <span>Travellers</span>
          <input
            type="number"
            name="passengers"
            min="1"
            max="30"
            value={formData.passengers}
            onChange={handleChange}
          />
        </label>
      </div>

      {error ? <p className={styles.error} role="alert">{error}</p> : null}

      <button
        type="submit"
        className={styles.submit}
        disabled={loading}
        data-cta-id="immersive-varanasi-lead-submit"
        data-cta-location="experience-lead-form"
        data-page-type="experience"
        data-intent-cluster="varanasi-sightseeing"
        data-service-type="tour"
      >
        {loading ? 'Sending…' : 'Send my enquiry'}
      </button>

      <p className={styles.alt}>
        or{' '}
        <a
          href={getWhatsAppUrl(`Namaste, I saw the immersive Varanasi day on kashitaxi.in. I am interested in: ${interest}.`)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => logClick('WHATSAPP')}
          data-cta-id="immersive-varanasi-form-whatsapp"
          data-cta-location="experience-lead-form"
          data-page-type="experience"
          data-intent-cluster="varanasi-sightseeing"
          data-service-type="tour"
        >
          message us on WhatsApp
        </a>{' '}
        ·{' '}
        <a
          href={getCallTelHref()}
          onClick={() => logClick('CALL')}
          data-cta-id="immersive-varanasi-form-call"
          data-cta-location="experience-lead-form"
          data-page-type="experience"
          data-intent-cluster="varanasi-sightseeing"
          data-service-type="tour"
        >
          call {CONTACT.callNumberDisplay}
        </a>
      </p>
    </form>
  );
}
