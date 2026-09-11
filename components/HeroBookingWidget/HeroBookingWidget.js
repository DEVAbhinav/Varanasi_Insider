import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import * as gtag from '../../lib/gtag';
import { CONTACT, getCallTelHref, getWhatsAppUrl } from '@/lib/contact';
import { useBookingForm } from '../BookingWidget/useBookingForm';
import {
  searchPlaces,
  resolveFare,
  recommendVehicle,
  VEHICLE_OPTIONS,
} from '@/lib/pricingEngineResolver';

export default function HeroBookingWidget() {
  const router = useRouter();
  const [step, setStep] = useState(1); // Step 1: Trip details, Step 2: Contact info
  const [tripType, setTripType] = useState('one-way'); // 'one-way' | 'round-trip'
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);

  // Autocomplete dropdown visibility states
  const [pickupOpen, setPickupOpen] = useState(false);
  const [destOpen, setDestOpen] = useState(false);
  const pickupRef = useRef(null);
  const destRef = useRef(null);

  const initialFormData = {
    pickup: '',
    destination: '',
    date: '',
    passengers: '1',
    name: '',
    phone: '',
    email: '',
  };

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (pickupRef.current && !pickupRef.current.contains(event.target)) {
        setPickupOpen(false);
      }
      if (destRef.current && !destRef.current.contains(event.target)) {
        setDestOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    buildPayload: (data) => {
      const activeVehicleObj =
        VEHICLE_OPTIONS.find((v) => v.id === (selectedVehicleId || recommendVehicle(data.passengers))) ||
        VEHICLE_OPTIONS[0];
      const fareQuote = resolveFare({
        pickup: data.pickup,
        destination: data.destination,
        passengers: data.passengers,
        tripType,
        vehicleId: selectedVehicleId || undefined,
      });
      const fareString = fareQuote?.canCompute ? `₹${fareQuote.fare.toLocaleString('en-IN')}` : null;
      const tripTypeLabel = fareQuote?.isOutstation
        ? tripType === 'round-trip'
          ? 'Outstation Round Trip'
          : 'Outstation One Way'
        : 'Local Transfer';

      return {
        name: data.name,
        phone: data.phone,
        email: data.email,
        passengers: data.passengers,
        tripType: tripTypeLabel,
        pickupLocation: data.pickup,
        destination: data.destination,
        pickupDate: data.date,
        estimatedFare: fareString,
        vehicleType: activeVehicleObj.name,
        message: `Booking Request: ${data.pickup} → ${data.destination} | Date: ${data.date} | Passengers: ${data.passengers}${fareString ? ` | Est. Fare: ${fareString} (${activeVehicleObj.name})` : ''}`,
        source: 'Homepage Hero Pricing Widget',
      };
    },
    buildAnalytics: (data) => ({
      trip_origin: data.pickup,
      trip_destination: data.destination,
      travel_date: data.date,
      passenger_count: data.passengers,
      source_widget: 'Hero Booking Widget',
    }),
  });

  // Pre-populate from URL query params (e.g. ?pickup=Airport&destination=Assi%20Ghat&trip=round-trip)
  useEffect(() => {
    if (!router.isReady) return;
    const { pickup, destination, date, passengers, trip } = router.query;
    if (pickup || destination || date || passengers) {
      setFormData((prev) => ({
        ...prev,
        pickup: pickup ? String(pickup) : prev.pickup,
        destination: destination ? String(destination) : prev.destination,
        date: date ? String(date) : prev.date,
        passengers: passengers ? String(passengers) : prev.passengers,
      }));
    }
    if (trip === 'round-trip' || trip === 'one-way') {
      setTripType(trip);
    }
  }, [router.isReady, router.query, setFormData]);

  // Calculate live fare estimate
  const currentVehicleId = selectedVehicleId || recommendVehicle(formData.passengers);
  const activeVehicleObj = VEHICLE_OPTIONS.find((v) => v.id === currentVehicleId) || VEHICLE_OPTIONS[0];

  const fareQuote = useMemo(() => {
    if (!formData.pickup || !formData.destination) return null;
    return resolveFare({
      pickup: formData.pickup,
      destination: formData.destination,
      passengers: formData.passengers,
      tripType,
      vehicleId: currentVehicleId,
    });
  }, [formData.pickup, formData.destination, formData.passengers, tripType, currentVehicleId]);

  // Autocomplete matching lists
  const pickupSuggestions = useMemo(() => searchPlaces(formData.pickup), [formData.pickup]);
  const destSuggestions = useMemo(() => searchPlaces(formData.destination), [formData.destination]);

  // Shallow sync to URL query bar when places or trip type change
  useEffect(() => {
    if (!router.isReady) return;
    if (formData.pickup || formData.destination) {
      const query = { ...router.query };
      let changed = false;
      if (formData.pickup && query.pickup !== formData.pickup) {
        query.pickup = formData.pickup;
        changed = true;
      }
      if (formData.destination && query.destination !== formData.destination) {
        query.destination = formData.destination;
        changed = true;
      }
      if (formData.passengers && formData.passengers !== '1' && query.passengers !== formData.passengers) {
        query.passengers = formData.passengers;
        changed = true;
      }
      if (tripType !== 'one-way' && query.trip !== tripType) {
        query.trip = tripType;
        changed = true;
      }

      if (changed) {
        router.replace({ pathname: router.pathname, query }, undefined, { shallow: true });
      }
    }
  }, [formData.pickup, formData.destination, formData.passengers, tripType, router]);

  // 1-Tap Share Quote with Family on WhatsApp
  const handleShareQuoteWithFamily = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.kashitaxi.in';
    const deepLink = `${origin}/?pickup=${encodeURIComponent(formData.pickup)}&destination=${encodeURIComponent(formData.destination)}&passengers=${formData.passengers}&trip=${tripType}`;
    const fareText = fareQuote?.canCompute ? `₹${fareQuote.fare.toLocaleString('en-IN')}` : 'Fair fixed quote';
    const tripText = tripType === 'round-trip' ? 'Round-trip' : 'One-way';

    const text = `🚕 *Kashi Taxi Quote for Our Trip*\nRoute: ${formData.pickup} → ${formData.destination}\nEstimated Fare: ${fareText} (${tripText} for ${activeVehicleObj.name})\n✓ All-inclusive: fuel, driver bhatta & highway tolls included.\n✓ Fixed rate, no surge, verified local chauffeur.\n\nCheck route details & book here:\n${deepLink}`;

    gtag.event({
      action: 'share_quote_whatsapp',
      category: 'Engagement',
      label: 'Hero Booking Widget',
      trip_origin: formData.pickup,
      trip_destination: formData.destination,
    });

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  const handleSearchRides = (e) => {
    e.preventDefault();

    // Track ride search attempt
    gtag.event({
      action: 'search_rides_attempt',
      category: 'Engagement',
      label: 'Hero Booking Widget',
      trip_origin: formData.pickup,
      trip_destination: formData.destination,
      travel_date: formData.date,
      estimated_fare: fareQuote?.canCompute ? fareQuote.fare : 'unmatched',
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
    setSelectedVehicleId(null);
    setFormData(initialFormData);
  };

  // Success State
  if (success) {
    const successFare = fareQuote?.canCompute ? `₹${fareQuote.fare.toLocaleString('en-IN')}` : null;
    const whatsappMsg = `Hi! I need a taxi from ${formData.pickup} to ${formData.destination} on ${formData.date} for ${formData.passengers} passenger(s)${successFare ? ` [Est. Fare: ${successFare} for ${activeVehicleObj.name}]` : ''}. My name is ${formData.name}.`;

    return (
      <div className="max-w-5xl mx-auto mt-4">
        <div className="bg-white/95 backdrop-blur-2xl rounded-2xl shadow-[0_20px_80px_rgba(0,0,0,0.25)] p-6 md:p-8 border-2 border-white/40 relative overflow-hidden">
          <div className="text-center">
            <div className="text-5xl md:text-6xl mb-3 animate-bounce">✅</div>
            <h3 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Booking Request Received!
            </h3>
            <p className="text-gray-700 mb-2">
              Thank you, <strong>{formData.name}</strong>! We'll contact you shortly at <strong>{formData.phone}</strong>.
            </p>
            {successFare && (
              <div className="inline-block my-2 px-4 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-800 text-sm font-semibold">
                Estimated Fare: {successFare} ({activeVehicleObj.name})
              </div>
            )}
            <p className="text-xs md:text-sm text-gray-600 mb-5">
              Confirm your booking instantly with our dispatch team on WhatsApp:
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href={getWhatsAppUrl(whatsappMsg)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => gtag.event({ action: 'whatsapp_redirect', category: 'Conversion', label: 'Hero Widget Success' })}
                data-cta-id="home_quote_success_whatsapp"
                data-cta-location="home_quote_success"
                data-page-type="generic_taxi_owner"
                data-intent-cluster="generic_taxi"
                data-service-type="taxi"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-all shadow-lg text-sm md:text-base"
              >
                💬 Confirm on WhatsApp
              </a>
              <button
                type="button"
                onClick={handleShareQuoteWithFamily}
                className="inline-flex items-center gap-2 px-5 py-3 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 font-semibold rounded-lg transition-all text-sm"
              >
                📲 Share with Family
              </button>
              <button
                onClick={resetForm}
                className="inline-flex items-center gap-2 px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-all text-sm"
              >
                🔄 New Search
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-4">
      <div className="bg-white/95 backdrop-blur-2xl rounded-2xl shadow-[0_20px_80px_rgba(0,0,0,0.25)] p-4 md:p-6 border-2 border-white/40 relative overflow-hidden">
        {/* Subtle shine effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none"></div>

        {/* Progress Indicator */}
        <div className="relative flex items-center justify-center mb-4">
          <div className="flex items-center gap-2">
            <div className={`flex items-center justify-center w-7 h-7 rounded-full font-bold text-xs transition-all ${step === 1 ? 'bg-cyan-500 text-white' : 'bg-emerald-500 text-white'}`}>
              {step === 1 ? '1' : '✓'}
            </div>
            <div className={`w-12 md:w-20 h-1 rounded-full transition-all ${step === 2 ? 'bg-cyan-500' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center justify-center w-7 h-7 rounded-full font-bold text-xs transition-all ${step === 2 ? 'bg-cyan-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
              2
            </div>
          </div>
        </div>

        <h2 className="relative text-base md:text-xl font-bold text-center mb-4 bg-gradient-to-r from-cyan-700 via-teal-700 to-cyan-800 bg-clip-text text-transparent">
          {step === 1 ? 'Instant Varanasi Cab Fare Calculator & Booking' : 'Confirm Your Contact Details'}
        </h2>

        {error && (
          <div className="mb-4 bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs md:text-sm font-medium flex items-start gap-2">
            <span className="text-base">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Step 1: Trip Details */}
        {step === 1 && (
          <form onSubmit={handleSearchRides}>
            <div className="relative grid md:grid-cols-4 gap-3 mb-3">
              {/* Pickup Location with clean autocomplete */}
              <div className="space-y-1 relative" ref={pickupRef}>
                <label className="block text-xs font-semibold text-gray-800">
                  Pickup Location *
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500 text-sm pointer-events-none">
                    📍
                  </div>
                  <input
                    type="text"
                    name="pickup"
                    value={formData.pickup}
                    onChange={(e) => {
                      handleChange(e);
                      setPickupOpen(true);
                    }}
                    onFocus={() => setPickupOpen(true)}
                    placeholder="e.g. Airport, Cantt, Assi"
                    autoComplete="off"
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border-2 border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 text-gray-800 placeholder-gray-400 transition-all outline-none bg-white shadow-sm text-sm"
                    required
                  />
                </div>

                {/* Autocomplete Suggestions Dropdown */}
                {pickupOpen && pickupSuggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-56 overflow-y-auto divide-y divide-gray-100 text-left">
                    {pickupSuggestions.map((place) => (
                      <button
                        type="button"
                        key={place.id}
                        onMouseDown={(e) => {
                          e.preventDefault(); // Prevent input blur before click registers
                          setFormData((prev) => ({ ...prev, pickup: place.shortName }));
                          setPickupOpen(false);
                        }}
                        className="w-full px-3 py-2 text-xs flex items-center justify-between hover:bg-cyan-50 text-gray-800 transition-colors"
                      >
                        <span className="font-medium truncate">{place.name}</span>
                        <span className="text-[10px] uppercase font-semibold text-cyan-700 bg-cyan-50 px-1.5 py-0.5 rounded border border-cyan-200 shrink-0 ml-2">
                          {place.badge}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Destination with clean autocomplete */}
              <div className="space-y-1 relative" ref={destRef}>
                <label className="block text-xs font-semibold text-gray-800">
                  Destination *
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500 text-sm pointer-events-none">
                    🎯
                  </div>
                  <input
                    type="text"
                    name="destination"
                    value={formData.destination}
                    onChange={(e) => {
                      handleChange(e);
                      setDestOpen(true);
                    }}
                    onFocus={() => setDestOpen(true)}
                    placeholder="e.g. Ayodhya, Assi Ghat"
                    autoComplete="off"
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border-2 border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 text-gray-800 placeholder-gray-400 transition-all outline-none bg-white shadow-sm text-sm"
                    required
                  />
                </div>

                {/* Autocomplete Suggestions Dropdown */}
                {destOpen && destSuggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-56 overflow-y-auto divide-y divide-gray-100 text-left">
                    {destSuggestions.map((place) => (
                      <button
                        type="button"
                        key={place.id}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setFormData((prev) => ({ ...prev, destination: place.shortName }));
                          setDestOpen(false);
                        }}
                        className="w-full px-3 py-2 text-xs flex items-center justify-between hover:bg-cyan-50 text-gray-800 transition-colors"
                      >
                        <span className="font-medium truncate">{place.name}</span>
                        <span className="text-[10px] uppercase font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 shrink-0 ml-2">
                          {place.badge}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Travel Date */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-800">
                  Travel Date *
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-600 text-sm pointer-events-none">
                    📅
                  </div>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border-2 border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 text-gray-800 transition-all outline-none bg-white shadow-sm text-sm"
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
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 text-sm pointer-events-none">
                    👥
                  </div>
                  <select
                    name="passengers"
                    value={formData.passengers}
                    onChange={(e) => {
                      handleChange(e);
                      // Auto-update vehicle when passenger tier shifts unless explicitly customized
                      setSelectedVehicleId(recommendVehicle(e.target.value));
                    }}
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border-2 border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 text-gray-800 transition-all outline-none bg-white appearance-none cursor-pointer shadow-sm text-sm font-medium"
                  >
                    <option value="1">1 Adult (Sedan)</option>
                    <option value="2">2 Adults (Sedan)</option>
                    <option value="3">3 Adults (Sedan)</option>
                    <option value="4">4 Adults (Sedan)</option>
                    <option value="5-6">5-6 Adults (Ertiga / SUV)</option>
                    <option value="7+">7+ Adults (Tempo Traveller)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Real-Time Pricing Engine Output Box */}
            {formData.pickup && formData.destination && (
              <div className="my-3 rounded-xl border border-cyan-200 bg-gradient-to-br from-cyan-50/90 via-teal-50/70 to-blue-50/90 p-3.5 shadow-sm">
                {fareQuote?.canCompute ? (
                  <div>
                    {/* Header Row: Fare + Trip Type Toggle */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-cyan-200/80">
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-900">
                            Estimated Rough Fare:
                          </span>
                          <span className="text-xl md:text-2xl font-extrabold text-cyan-900">
                            ₹{fareQuote.fare.toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs font-semibold text-cyan-800">
                            ({activeVehicleObj.name})
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-600 mt-0.5">
                          {fareQuote.inclusions}
                        </p>
                      </div>

                      {/* Outstation One-Way vs Round-Trip Toggle */}
                      {fareQuote.isOutstation && (
                        <div className="flex items-center rounded-lg bg-white p-1 border border-cyan-200 shadow-sm text-xs font-semibold">
                          <button
                            type="button"
                            onClick={() => setTripType('one-way')}
                            className={`px-3 py-1 rounded-md transition-all ${tripType === 'one-way' ? 'bg-cyan-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                          >
                            One-Way
                          </button>
                          <button
                            type="button"
                            onClick={() => setTripType('round-trip')}
                            className={`px-3 py-1 rounded-md transition-all ${tripType === 'round-trip' ? 'bg-cyan-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                          >
                            Round-Trip
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Vehicle Options Comparison Tabs */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2.5">
                      {VEHICLE_OPTIONS.map((v) => {
                        const vFare = fareQuote.faresByVehicle?.[v.id];
                        const isSelected = activeVehicleId === v.id;
                        return (
                          <button
                            type="button"
                            key={v.id}
                            onClick={() => setSelectedVehicleId(v.id)}
                            className={`px-2.5 py-1.5 rounded-lg border text-left transition-all ${isSelected ? 'border-cyan-600 bg-white shadow-md ring-1 ring-cyan-500' : 'border-gray-200/80 bg-white/70 hover:bg-white text-gray-700'}`}
                          >
                            <div className="text-[11px] font-bold text-gray-800 truncate">
                              {v.name.split(' ')[0]} {v.name.includes('Tempo') ? 'Tempo' : ''}
                            </div>
                            <div className="flex items-center justify-between text-xs mt-0.5">
                              <span className="font-extrabold text-cyan-800">
                                {vFare ? `₹${vFare.toLocaleString('en-IN')}` : 'Quote'}
                              </span>
                              <span className="text-[10px] text-gray-500">{v.seats.split(' ')[0]}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Bottom Row: Share Quote with Family + Canonical Guide Link */}
                    <div className="mt-2.5 pt-2 border-t border-cyan-200/60 flex flex-wrap items-center justify-between gap-2 text-xs">
                      {fareQuote.canonicalUrl ? (
                        <Link
                          href={fareQuote.canonicalUrl}
                          className="inline-flex items-center gap-1 font-semibold text-cyan-800 hover:text-cyan-950 underline underline-offset-2"
                        >
                          📖 View {fareQuote.fromPlace?.shortName || 'Varanasi'} to {fareQuote.toPlace?.shortName} cab guide →
                        </Link>
                      ) : (
                        <span className="text-gray-600">✓ Fixed rate • No surge pricing • Verified chauffeur</span>
                      )}

                      {/* 1-Tap Share Quote with Family on WhatsApp */}
                      <button
                        type="button"
                        onClick={handleShareQuoteWithFamily}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-semibold rounded-md transition-colors"
                        title="Share this fare quote with your family on WhatsApp"
                      >
                        <span>📲 Share Fare with Family</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-2 text-xs text-gray-700">
                    <p>
                      <strong>Custom Route:</strong> Our team will confirm exact door-to-door fares via WhatsApp or Call with zero surge.
                    </p>
                    <button
                      type="button"
                      onClick={handleShareQuoteWithFamily}
                      className="shrink-0 px-2.5 py-1 bg-white border border-gray-200 hover:bg-gray-50 rounded font-medium text-gray-700"
                    >
                      📲 Share Route
                    </button>
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              data-cta-id="home_quote_continue"
              data-cta-location="home_booking_widget"
              data-page-type="generic_taxi_owner"
              data-intent-cluster="generic_taxi"
              data-service-type="taxi"
              className="relative w-full py-3 px-6 bg-gradient-to-r from-cyan-500 via-teal-500 to-cyan-600 text-white font-semibold text-sm md:text-base rounded-lg shadow-[0_8px_30px_rgba(6,182,212,0.35)] hover:shadow-[0_10px_35px_rgba(6,182,212,0.45)] hover:scale-[1.005] transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <span className="text-base relative z-10">
                {fareQuote?.canCompute ? `Lock ₹${fareQuote.fare.toLocaleString('en-IN')} Fare — Continue` : 'Continue to Contact Details'}
              </span>
              <span className="text-base relative z-10">→</span>
            </button>

            {/* Compact Trust Indicators */}
            <div className="relative flex flex-wrap justify-center gap-2 mt-3">
              <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/70 backdrop-blur-md border border-white/50 shadow-sm text-gray-700 text-[10px] md:text-xs font-semibold">
                <span className="text-teal-600 font-bold">✓</span>
                <span>Guaranteed Fixed Rates</span>
              </div>
              <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/70 backdrop-blur-md border border-white/50 shadow-sm text-gray-700 text-[10px] md:text-xs font-semibold">
                <span className="text-teal-600 font-bold">✓</span>
                <span>Tolls & Driver Included</span>
              </div>
              <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/70 backdrop-blur-md border border-white/50 shadow-sm text-gray-700 text-[10px] md:text-xs font-semibold">
                <span className="text-teal-600 font-bold">✓</span>
                <span>Verified Chauffeurs</span>
              </div>
            </div>
          </form>
        )}

        {/* Step 2: Contact Details */}
        {step === 2 && (
          <form onSubmit={handleSubmitBooking}>
            <div className="grid md:grid-cols-2 gap-3 mb-3">
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
                  className="w-full px-3 py-2.5 rounded-lg border-2 border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 text-gray-800 placeholder-gray-400 transition-all outline-none bg-white shadow-sm text-sm"
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
                  className="w-full px-3 py-2.5 rounded-lg border-2 border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 text-gray-800 placeholder-gray-400 transition-all outline-none bg-white shadow-sm text-sm"
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
                  className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 text-gray-800 placeholder-gray-400 transition-all outline-none bg-white shadow-sm text-sm"
                />
              </div>
            </div>

            {/* Trip Summary with Calculated Fare */}
            <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-3.5 mb-3.5">
              <h4 className="text-xs font-bold text-cyan-900 mb-2 uppercase tracking-wide">
                Trip Summary
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-700">
                <div>
                  <span className="text-cyan-700 font-semibold block">Route:</span>
                  <span className="font-medium text-gray-900">{formData.pickup} → {formData.destination}</span>
                </div>
                <div>
                  <span className="text-cyan-700 font-semibold block">Date:</span>
                  <span className="font-medium text-gray-900">{formData.date}</span>
                </div>
                <div>
                  <span className="text-cyan-700 font-semibold block">Passengers & Vehicle:</span>
                  <span className="font-medium text-gray-900">{formData.passengers} pax ({activeVehicleObj.name})</span>
                </div>
                <div>
                  <span className="text-cyan-700 font-semibold block">Estimated Fare:</span>
                  <span className="font-bold text-emerald-800 text-sm">
                    {fareQuote?.canCompute ? `₹${fareQuote.fare.toLocaleString('en-IN')}` : 'Custom Quote on Request'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={handleBack}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-all text-sm flex items-center gap-1.5"
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
                className="relative flex-1 py-3 px-6 bg-gradient-to-r from-cyan-500 via-teal-500 to-cyan-600 text-white font-semibold text-sm md:text-base rounded-lg shadow-[0_8px_30px_rgba(6,182,212,0.35)] hover:shadow-[0_10px_35px_rgba(6,182,212,0.45)] hover:scale-[1.005] transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <span className="relative z-10">
                  {loading ? (
                    <>
                      <span className="inline-block animate-spin mr-2">⏳</span>
                      Confirming Request...
                    </>
                  ) : (
                    <>
                      🚕 Confirm Booking Request
                    </>
                  )}
                </span>
              </button>
            </div>

            <p className="text-xs text-center text-gray-500 mt-2.5">
              Or call dispatch desk directly: <a
                href={getCallTelHref()}
                data-cta-id="home_quote_direct_call"
                data-cta-location="home_booking_widget"
                data-page-type="generic_taxi_owner"
                data-intent-cluster="generic_taxi"
                data-service-type="taxi"
                className="text-cyan-700 font-bold hover:underline"
              >{CONTACT.callNumberDisplay.replace('+91 ', '')}</a>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
