import { useState } from 'react';
import * as gtag from '../../lib/gtag';
import styles from './BookingWidget.module.css';

export default function BookingWidget() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    from: '',
    to: '',
    date: '',
    passengers: '1',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    // Track form interaction start (once)
    if (!formData[e.target.name] && e.target.value) {
      gtag.event({
        action: 'form_start',
        category: 'Form',
        label: 'Booking Widget',
      });
    }
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    // Validate
    if (!formData.name || !formData.phone) {
      setError('Please fill in your name and phone number');
      setLoading(false);
      return;
    }

    try {
      // Submit to API
      const response = await fetch('/api/contact-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          passengers: formData.passengers,
          tripType: 'Booking',
          pickupDate: formData.date,
          message: `From: ${formData.from}\nTo: ${formData.to}\nDate: ${formData.date}\nPassengers: ${formData.passengers}`,
          source: 'Booking Widget',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);

        // Track successful lead generation
        gtag.event({
          action: 'generate_lead',
          category: 'Form',
          label: 'Booking Widget',
          value: 1, // Lead Value
          trip_origin: formData.from,
          trip_destination: formData.to,
          travel_date: formData.date,
          passenger_count: formData.passengers,
          source_widget: 'Booking Widget'
        });

        // Redirect to WhatsApp as backup
        setTimeout(() => {
          gtag.event({
            action: 'whatsapp_redirect',
            category: 'Conversion',
            label: 'Booking Widget Success',
          });
          window.open(data.whatsappLink, '_blank');
        }, 1500);
        
        // Reset form
        setFormData({
          name: '',
          phone: '',
          email: '',
          from: '',
          to: '',
          date: '',
          passengers: '1',
        });
      } else {
        setError(data.error || 'Something went wrong. Please call us instead.');
      }
    } catch (err) {
      setError('Network error. Please WhatsApp or call us directly.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={styles.bookingWidget}>
        <div className="text-center p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
          <div className="text-5xl mb-4">✅</div>
          <h3 className="text-2xl font-bold text-green-600 mb-3">Thank You!</h3>
          <p className="text-gray-700 mb-4">
            We received your inquiry and will contact you shortly.
          </p>
          <p className="text-sm text-gray-600">
            Opening WhatsApp for instant confirmation...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.bookingWidget}>
      <h2 className={styles.title}>Quick Booking</h2>

      {error && (
        <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>Your Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            className={styles.input}
            required
          />
        </div>

        {/* Phone */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>Phone Number *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+91 98765 43210"
            className={styles.input}
            required
          />
        </div>

        {/* Email (optional) */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>Email (optional)</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            className={styles.input}
          />
        </div>

        {/* From */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>From</label>
          <input
            type="text"
            name="from"
            value={formData.from}
            onChange={handleChange}
            placeholder="Pickup location"
            className={styles.input}
          />
        </div>

        {/* To */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>To</label>
          <input
            type="text"
            name="to"
            value={formData.to}
            onChange={handleChange}
            placeholder="Destination"
            className={styles.input}
          />
        </div>

        {/* Date */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={styles.input}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        {/* Passengers */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>Passengers</label>
          <select
            name="passengers"
            value={formData.passengers}
            onChange={handleChange}
            className={styles.input}
          >
            <option value="1">1 person</option>
            <option value="2">2 people</option>
            <option value="3">3 people</option>
            <option value="4">4 people</option>
            <option value="5-6">5-6 people</option>
            <option value="7+">7+ people (Tempo Traveller)</option>
          </select>
        </div>

        {/* CTA Button */}
        <button 
          type="submit"
          className={styles.ctaButton}
          disabled={loading}
        >
          {loading ? 'Sending...' : '🚕 Get Quote & Book Now'}
        </button>

        <p className="text-xs text-gray-600 text-center mt-4 font-medium">
          Or call directly: <a href="tel:+918062182380" className="text-cyan-600 font-bold hover:text-cyan-700 transition-colors">80621 82380</a>
        </p>
      </form>
    </div>
  );
}
