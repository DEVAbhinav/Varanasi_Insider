import { useState } from 'react';
import * as gtag from '../../lib/gtag';
import { CONTACT, getCallTelHref, getWhatsAppUrl } from '@/lib/contact';
import { useBookingForm } from '../BookingWidget/useBookingForm';

export default function HeroBookingWidget() {
  const [step, setStep] = useState(1); // Step 1: Trip details, Step 2: Contact info
  const initialFormData = {
    pickup: '',
    destination: '',
    date: '',
    passengers: '1',
    name: '',
    phone: '',
    email: '',
  };
  const {
    formData,
    setFormData,
    loading,
    success,
    setSuccess,
    error,
    setError,
    handleChange,
    handleSubmit,
  } = useBookingForm({
    initialFormData,
    widgetLabel: 'Hero Booking Widget',
    resetOnSuccess: false,
    clearErrorOnChange: true,
    missingContactMessage: 'Please provide your name and phone number',
    networkErrorMessage: `Network error. Please call us at ${CONTACT.callNumberDisplay.replace('+91 ', '')}`,
    onNetworkError: (err) => console.error('Booking error:', err),
    buildPayload: (data) => ({
      name: data.name,
      phone: data.phone,
      email: data.email,
      passengers: data.passengers,
      tripType: 'Instant Quote Request',
      pickupLocation: data.pickup,
      destination: data.destination,
      pickupDate: data.date,
      message: `Booking Request: ${data.pickup} → ${data.destination} | Date: ${data.date} | Passengers: ${data.passengers}`,
      source: 'Homepage Hero Widget',
    }),
    buildAnalytics: (data) => ({
      trip_origin: data.pickup,
      trip_destination: data.destination,
      travel_date: data.date,
      passenger_count: data.passengers,
      source_widget: 'Hero Booking Widget',
    }),
  });

  const handleSearchRides = (e) => {
    e.preventDefault();
    
    // Track ride search attempt
    gtag.event({
      action: 'search_rides_attempt',
      category: 'Engagement',
      label: 'Hero Booking Widget',
      trip_origin: formData.pickup,
      trip_destination: formData.destination,
      travel_date: formData.date
    });

    // Validate step 1
    if (!formData.pickup || !formData.destination) {
      setError('Please enter both pickup location and destination');
      return;
    }

    if (!formData.date) {
      setError('Please select a travel date');
      return;
    }

    // Move to step 2 for contact details
    setStep(2);
    gtag.event({
      action: 'view_contact_step',
      category: 'Funnel',
      label: 'Hero Booking Widget',
    });
    setError('');
  };

  const handleSubmitBooking = (e) => handleSubmit(e);

  const handleBack = () => {
    setStep(1);
    setError('');
  };

  const resetForm = () => {
    setStep(1);
    setSuccess(false);
    setFormData(initialFormData);
  };

  // Success State
  if (success) {
    return (
      <div className="max-w-5xl mx-auto mt-4">
        <div className="bg-white/90 backdrop-blur-2xl rounded-2xl shadow-[0_20px_80px_rgba(0,0,0,0.25)] p-8 border-2 border-white/40 relative overflow-hidden">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-bounce">✅</div>
            <h3 className="text-2xl md:text-3xl font-bold mb-3 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Booking Request Received!
            </h3>
            <p className="text-gray-700 mb-4">
              Thank you, <strong>{formData.name}</strong>! We'll contact you shortly at <strong>{formData.phone}</strong>
            </p>
            <p className="text-sm text-gray-600 mb-6">
              Chat on WhatsApp for instant confirmation
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href={getWhatsAppUrl(`Hi! I need a taxi from ${formData.pickup} to ${formData.destination} on ${formData.date}. My name is ${formData.name}.`)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => gtag.event({ action: 'whatsapp_redirect', category: 'Conversion', label: 'Hero Widget Success' })}
                data-cta-id="home_quote_success_whatsapp"
                data-cta-location="home_quote_success"
                data-page-type="generic_taxi_owner"
                data-intent-cluster="generic_taxi"
                data-service-type="taxi"
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all shadow-lg"
              >
                💬 Chat on WhatsApp
              </a>
              <button
                onClick={resetForm}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-all"
              >
                🔄 New Booking
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-4">
      <div className="bg-white/90 backdrop-blur-2xl rounded-2xl shadow-[0_20px_80px_rgba(0,0,0,0.25)] p-4 md:p-6 border-2 border-white/40 relative overflow-hidden">
        {/* Subtle shine effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none"></div>
        
        {/* Progress Indicator */}
        <div className="relative flex items-center justify-center mb-4">
          <div className="flex items-center gap-2">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm transition-all ${step === 1 ? 'bg-cyan-500 text-white' : 'bg-green-500 text-white'}`}>
              {step === 1 ? '1' : '✓'}
            </div>
            <div className={`w-12 md:w-24 h-1 rounded-full transition-all ${step === 2 ? 'bg-cyan-500' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm transition-all ${step === 2 ? 'bg-cyan-500 text-white' : 'bg-gray-300 text-gray-600'}`}>
              2
            </div>
          </div>
        </div>

        <h2 className="relative text-lg md:text-xl font-bold text-center mb-4 bg-gradient-to-r from-cyan-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent drop-shadow-sm">
          {step === 1 ? 'Book Varanasi Taxi Online – Get Instant Fare' : 'Almost There! Your Contact Details'}
        </h2>

        {error && (
          <div className="mb-4 bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium flex items-start gap-2">
            <span className="text-lg">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Step 1: Trip Details */}
        {step === 1 && (
          <form onSubmit={handleSearchRides}>
            <div className="relative grid md:grid-cols-4 gap-3 mb-3">
              {/* Pickup Location */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-800">
                  Pickup Location *
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500 text-sm">
                    📍
                  </div>
                  <input
                    type="text"
                    name="pickup"
                    value={formData.pickup}
                    onChange={handleChange}
                    placeholder="e.g. VNS Airport"
                    className="w-full pl-10 pr-3 py-2.5 rounded-lg border-2 border-gray-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 text-gray-800 placeholder-gray-500 transition-all outline-none bg-white/95 shadow-sm text-sm"
                    required
                  />
                </div>
              </div>

              {/* Destination */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-800">
                  Destination *
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500 text-sm">
                    🎯
                  </div>
                  <input
                    type="text"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    placeholder="e.g. Dashashwamedh Ghat"
                    className="w-full pl-10 pr-3 py-2.5 rounded-lg border-2 border-gray-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 text-gray-800 placeholder-gray-500 transition-all outline-none bg-white/95 shadow-sm text-sm"
                    required
                  />
                </div>
              </div>

              {/* Travel Date */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-800">
                  Travel Date *
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500 text-sm">
                    📅
                  </div>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2.5 rounded-lg border-2 border-gray-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 text-gray-800 transition-all outline-none bg-white/95 shadow-sm text-sm"
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
              </div>

              {/* Passengers */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-800">
                  Passengers
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 text-sm">
                    👥
                  </div>
                  <select 
                    name="passengers"
                    value={formData.passengers}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2.5 rounded-lg border-2 border-gray-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 text-gray-800 transition-all outline-none bg-white/95 appearance-none cursor-pointer shadow-sm text-sm"
                  >
                    <option value="1">1 Adult</option>
                    <option value="2">2 Adults</option>
                    <option value="3">3 Adults</option>
                    <option value="4">4 Adults</option>
                    <option value="5-6">5-6 Adults</option>
                    <option value="7+">7+ (Tempo)</option>
                  </select>
                </div>
              </div>
            </div>

            <button 
              type="submit"
              data-cta-id="home_quote_continue"
              data-cta-location="home_booking_widget"
              data-page-type="generic_taxi_owner"
              data-intent-cluster="generic_taxi"
              data-service-type="taxi"
              className="relative w-full py-3 px-6 bg-gradient-to-r from-cyan-500 via-teal-500 to-cyan-600 text-white font-semibold text-sm md:text-base rounded-lg shadow-[0_8px_30px_rgba(6,182,212,0.35)] hover:shadow-[0_10px_35px_rgba(6,182,212,0.45)] hover:scale-[1.01] transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <span className="text-lg relative z-10">🔍</span>
              <span className="relative z-10">Continue to Contact Details</span>
              <span className="text-lg relative z-10">→</span>
            </button>

            {/* Compact Trust Indicators */}
            <div className="relative flex flex-wrap justify-center gap-2 mt-3">
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-br from-white/70 to-white/50 backdrop-blur-md border border-white/50 shadow-md hover:shadow-lg transition-all hover:scale-105">
                <span className="text-teal-600 text-xs font-bold">✓</span>
                <span className="text-gray-800 font-semibold text-[10px] md:text-xs">Instant Confirmation</span>
              </div>
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-br from-white/70 to-white/50 backdrop-blur-md border border-white/50 shadow-md hover:shadow-lg transition-all hover:scale-105">
                <span className="text-teal-600 text-xs font-bold">✓</span>
                <span className="text-gray-800 font-semibold text-[10px] md:text-xs">AC Vehicles</span>
              </div>
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-br from-white/70 to-white/50 backdrop-blur-md border border-white/50 shadow-md hover:shadow-lg transition-all hover:scale-105">
                <span className="text-teal-600 text-xs font-bold">✓</span>
                <span className="text-gray-800 font-semibold text-[10px] md:text-xs">Expert Drivers</span>
              </div>
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-br from-white/70 to-white/50 backdrop-blur-md border border-white/50 shadow-md hover:shadow-lg transition-all hover:scale-105">
                <span className="text-teal-600 text-xs font-bold">✓</span>
                <span className="text-gray-800 font-semibold text-[10px] md:text-xs">Fixed Rates</span>
              </div>
            </div>
          </form>
        )}

        {/* Step 2: Contact Details */}
        {step === 2 && (
          <form onSubmit={handleSubmitBooking}>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              {/* Name */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-800">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 text-gray-800 placeholder-gray-500 transition-all outline-none bg-white/95 shadow-sm text-sm"
                  required
                />
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-800">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 text-gray-800 placeholder-gray-500 transition-all outline-none bg-white/95 shadow-sm text-sm"
                  required
                />
              </div>

              {/* Email (Optional) */}
              <div className="space-y-1 md:col-span-2">
                <label className="block text-xs font-semibold text-gray-800">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 text-gray-800 placeholder-gray-500 transition-all outline-none bg-white/95 shadow-sm text-sm"
                />
              </div>
            </div>

            {/* Trip Summary */}
            <div className="bg-cyan-50 border-2 border-cyan-200 rounded-xl p-4 mb-4">
              <h4 className="text-xs font-bold text-cyan-900 mb-2 uppercase tracking-wide">Trip Summary</h4>
              <div className="space-y-1.5 text-sm text-gray-700">
                <div className="flex items-start gap-2">
                  <span className="text-cyan-600 font-semibold min-w-[80px]">Route:</span>
                  <span className="font-medium">{formData.pickup} → {formData.destination}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-cyan-600 font-semibold min-w-[80px]">Date:</span>
                  <span className="font-medium">{formData.date}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-cyan-600 font-semibold min-w-[80px]">Passengers:</span>
                  <span className="font-medium">{formData.passengers} passenger(s)</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-all text-sm flex items-center gap-2"
              >
                ← Back
              </button>
              <button 
                type="submit"
                disabled={loading}
                data-cta-id="home_quote_submit"
                data-cta-location="home_booking_widget"
                data-page-type="generic_taxi_owner"
                data-intent-cluster="generic_taxi"
                data-service-type="taxi"
                className="relative flex-1 py-3 px-6 bg-gradient-to-r from-cyan-500 via-teal-500 to-cyan-600 text-white font-semibold text-sm md:text-base rounded-lg shadow-[0_8px_30px_rgba(6,182,212,0.35)] hover:shadow-[0_10px_35px_rgba(6,182,212,0.45)] hover:scale-[1.01] transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <span className="relative z-10">
                  {loading ? (
                    <>
                      <span className="inline-block animate-spin mr-2">⏳</span>
                      Sending...
                    </>
                  ) : (
                    <>
                      🚕 Get Instant Quote Now
                    </>
                  )}
                </span>
              </button>
            </div>

            <p className="text-xs text-center text-gray-600 mt-3">
              Or call directly: <a
                href={getCallTelHref()}
                data-cta-id="home_quote_direct_call"
                data-cta-location="home_booking_widget"
                data-page-type="generic_taxi_owner"
                data-intent-cluster="generic_taxi"
                data-service-type="taxi"
                className="text-cyan-600 font-bold hover:text-cyan-700 transition-colors"
              >{CONTACT.callNumberDisplay.replace('+91 ', '')}</a>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
