import { useRouter } from 'next/router';
import * as gtag from '../../lib/gtag';
import styles from './SidebarBookingWidget.module.css';
import { CONTACT, getCallTelHref } from '@/lib/contact';
import { useBookingForm } from './useBookingForm';

export default function SidebarBookingWidget({ pageTitle, pageUrl }) {
  const router = useRouter();
  const getWidgetContext = () => {
  const widgetPageTitle = pageTitle || (typeof document !== 'undefined' ? document.title : '');
  const browserLocation = typeof window !== 'undefined' ? window.location.href : '';
  const widgetPageUrl = browserLocation || pageUrl || router.asPath || '';

  return { widgetPageTitle, widgetPageUrl };
  };
  const { formData, loading, success, error, whatsappLink, handleChange, handleSubmit } = useBookingForm({
  initialFormData: {
    name: '',
    phone: '',
    email: '',
    passengers: '1',
    date: '',
  },
  widgetLabel: 'Sidebar Booking Widget',
  invalidPhoneMessage: 'Please enter a valid 10-digit phone number',
  submitErrorMessage: 'Something went wrong',
  networkErrorMessage: 'Network error. Please call us directly.',
  buildPayload: (data, { widgetPageTitle, widgetPageUrl }) => ({
    name: data.name,
    phone: data.phone,
    email: data.email,
    passengers: data.passengers,
    tripType: 'Quick Inquiry',
    pickupDate: data.date,
    message: `Quick inquiry from sidebar widget.${widgetPageTitle ? ` Page: ${widgetPageTitle}.` : ''} Date: ${data.date}, Passengers: ${data.passengers}${widgetPageUrl ? `. Link: ${widgetPageUrl}` : ''}`,
    source: 'Sidebar Widget',
    parentPageTitle: widgetPageTitle || null,
    parentPageUrl: widgetPageUrl || null,
  }),
  buildAnalytics: (data, { widgetPageUrl }) => ({
    trip_origin: 'Varanasi',
    travel_date: data.date,
    passenger_count: data.passengers,
    source_widget: 'Sidebar Booking Widget',
    page_location: widgetPageUrl,
  }),
  });

  if (success) {
    return (
      <div className={styles.widget}>
        <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="text-4xl mb-3">✅</div>
          <h3 className="text-lg font-bold text-green-600 mb-2">Thank You!</h3>
          <p className="text-sm text-gray-700 mb-3">
            We'll contact you shortly
          </p>
          {whatsappLink && (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => gtag.event({ action: 'whatsapp_redirect', category: 'Conversion', label: 'Sidebar Widget Success' })}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-lg transition-all"
            >
              💬 WhatsApp
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.widget}>
      <div className="bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-400 text-white p-5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 20px 20px, white 1.5%, transparent 0%), radial-gradient(circle at 60px 60px, white 1.5%, transparent 0%)',
            backgroundSize: '80px 80px'
          }}></div>
        </div>
        <div className="relative z-10">
          <h3 className="text-xl font-bold mb-1 drop-shadow-md">🚕 Quick Booking</h3>
          <p className="text-sm text-blue-50">Get instant quote</p>
        </div>
      </div>

      <form onSubmit={(e) => handleSubmit(e, getWidgetContext())} className="p-5 space-y-3.5">
        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-3 py-2.5 rounded-xl text-xs font-medium">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-gray-800 mb-1.5 uppercase tracking-wide">
            Your Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter name"
            className="w-full px-3.5 py-2.5 text-sm border-2 border-blue-100 rounded-xl focus:ring-3 focus:ring-cyan-200 focus:border-cyan-400 transition-all bg-white hover:border-cyan-200 placeholder-gray-400"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-800 mb-1.5 uppercase tracking-wide">
            Phone Number *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+91 98765 43210"
            className="w-full px-3.5 py-2.5 text-sm border-2 border-blue-100 rounded-xl focus:ring-3 focus:ring-cyan-200 focus:border-cyan-400 transition-all bg-white hover:border-cyan-200"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Travel Date
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 text-sm border-2 border-blue-100 rounded-xl focus:ring-3 focus:ring-cyan-200 focus:border-cyan-400 transition-all bg-white hover:border-cyan-200"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Passengers
          </label>
          <select
            name="passengers"
            value={formData.passengers}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 text-sm border-2 border-blue-100 rounded-xl focus:ring-3 focus:ring-cyan-200 focus:border-cyan-400 transition-all bg-white hover:border-cyan-200"
          >
            <option value="1">1 person</option>
            <option value="2">2 people</option>
            <option value="3">3 people</option>
            <option value="4">4 people</option>
            <option value="5-6">5-6 people</option>
            <option value="7+">7+ (Tempo)</option>
          </select>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 hover:from-blue-700 hover:via-cyan-700 hover:to-teal-600 text-white font-extrabold py-3.5 px-4 rounded-xl transition-all duration-300 text-base disabled:opacity-50 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 uppercase tracking-wide flex items-center justify-center gap-2"
        >
          {loading ? 'Sending...' : (
            <>
              <span>🚀</span>
              <span>GET MY FREE QUOTE</span>
            </>
          )}
        </button>

        <p className="text-xs text-gray-500 text-center mt-3 font-medium">
          Prefer talking? Call <a href={getCallTelHref()} className="text-cyan-700 font-bold hover:text-cyan-800 transition-colors underline decoration-cyan-300 decoration-2 underline-offset-2">{CONTACT.callNumberDisplay.replace('+91 ', '')}</a>
        </p>
      </form>
    </div>
  );
}
