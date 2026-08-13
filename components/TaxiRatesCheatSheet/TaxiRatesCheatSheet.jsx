import React from 'react';
import { useRouter } from 'next/router';
import TrustBadge from '../TrustBadge/TrustBadge';
import { Plane, Clock, Car, Users, Phone, MessageCircle } from 'lucide-react';
import { CONTACT, getCallTelHref } from '@/lib/contact';
import { TAXI_RATE_CARDS } from '@/lib/taxiRates';
import { formatINR } from '@/lib/pricing';

/**
 * TaxiRatesCheatSheet - A visually scannable pricing block for Kashitaxi
 * Displays 4 common use cases: Airport, Half-Day, Full-Day, Extended
 * 
 * @param {Object} props
 * @param {'compact'|'full'} props.variant - 'compact' for sightseeing pages, 'full' for homepage
 * @param {boolean} props.showCTA - Whether to show booking buttons
 */
export default function TaxiRatesCheatSheet({ variant = 'full', showCTA = true }) {
    const router = useRouter();
    const lang = router.query.lang || 'en';
    const icons = { airport: Plane, 'half-day': Clock, 'full-day': Car, extended: Users };
    const rateCards = TAXI_RATE_CARDS.map((card) => ({ ...card, icon: icons[card.id] }));

    const isCompact = variant === 'compact';

    return (
        <section
            className={`relative overflow-hidden ${isCompact ? 'py-8' : 'py-12 md:py-16'}`}
            aria-labelledby="rates-heading"
        >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-white to-teal-50" />

            {/* Subtle pattern */}
            <div className="absolute inset-0 opacity-[0.06]">
                <div className="absolute inset-0" style={{
                    backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(6,182,212,0.4) 2px, transparent 2px),
            radial-gradient(circle at 70% 60%, rgba(20,184,166,0.3) 1.5px, transparent 1.5px),
            radial-gradient(circle at 40% 80%, rgba(6,182,212,0.35) 2px, transparent 2px)
          `,
                    backgroundSize: '300px 300px',
                }} />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <div className={`text-center ${isCompact ? 'mb-6' : 'mb-8 md:mb-10'}`}>
                    <div className="inline-flex items-center gap-2 mb-3 px-4 py-1.5 bg-cyan-100/60 backdrop-blur-sm rounded-full border border-cyan-200/50">
                        <span className="text-xs font-semibold uppercase tracking-wider text-cyan-700">
                            Indicative 2026 Rates
                        </span>
                    </div>
                    <h2
                        id="rates-heading"
                        className={`font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent ${isCompact ? 'text-2xl md:text-3xl' : 'text-3xl md:text-4xl'
                            }`}
                    >
                        Varanasi Taxi Rates – 2026 Cheat Sheet
                    </h2>
                    <p className="mt-2 text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
                        Starting examples; confirm the complete route and vehicle quote before booking
                    </p>
                </div>

                {/* Rate Cards Grid */}
                <div className={`grid gap-x-4 gap-y-5 md:gap-6 max-w-5xl mx-auto ${isCompact
                    ? 'grid-cols-2 lg:grid-cols-4'
                    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                    }`}>
                    {rateCards.map((card) => (
                        <div
                            key={card.id}
                            className={`relative bg-white rounded-2xl shadow-lg border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${card.highlight
                                ? 'border-cyan-300 ring-2 ring-cyan-100'
                                : card.popular
                                    ? 'border-teal-300 ring-2 ring-teal-100'
                                    : 'border-gray-100'
                                }`}
                        >
                            {/* Popular badge */}
                            {card.popular && (
                                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-10 w-max max-w-[95%]">
                                    <span className="block whitespace-nowrap px-2.5 py-1 bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-[9px] md:text-[10px] leading-none font-bold uppercase tracking-wide rounded-full shadow-md">
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            {/* Card Header */}
                            <div className={`p-4 ${card.popular ? 'pt-5' : ''} ${isCompact ? 'pb-3' : 'pb-4'} border-b border-gray-100`}>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${card.highlight
                                        ? 'bg-cyan-100 text-cyan-600'
                                        : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        <card.icon className="w-4 h-4" />
                                    </span>
                                    <h3 className="font-bold text-gray-900 text-sm md:text-base">
                                        {card.title}
                                    </h3>
                                </div>
                                <p className="text-xs text-gray-500 ml-10">
                                    {card.subtitle}
                                </p>
                            </div>

                            {/* Rates List */}
                            <div className={`p-4 ${isCompact ? 'pt-3' : 'pt-4'} space-y-2`}>
                                {card.rates.map((rate, idx) => (
                                    <div
                                        key={rate.vehicle}
                                        className={`flex items-center justify-between py-1.5 ${idx !== card.rates.length - 1 ? 'border-b border-gray-50' : ''
                                            }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${rate.vehicle === 'Sedan'
                                                ? 'bg-blue-50 text-blue-700'
                                                : rate.vehicle === 'Ertiga' || rate.vehicle === 'Innova'
                                                    ? 'bg-purple-50 text-purple-700'
                                                    : 'bg-orange-50 text-orange-700'
                                                }`}>
                                                {rate.vehicle}
                                            </span>
                                            {rate.note && (
                                                <span className="text-[10px] text-gray-400 hidden sm:inline">
                                                    {rate.note}
                                                </span>
                                            )}
                                        </div>
                                        <span className="font-bold text-gray-900 text-sm md:text-base">
                                            {formatINR(rate.amount)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Notes & CTA */}
                <div className={`mt-6 md:mt-8 text-center ${isCompact ? 'max-w-xl' : 'max-w-2xl'} mx-auto`}>
                    {/* Fine print */}
                    <p className="text-xs text-gray-500 mb-4">
                        * Final quote confirms pickup time, included kilometres, toll or parking assumptions, and access restrictions •
                        <a href={`/${lang}/varanasi-transport-price-guide-2026`} className="text-cyan-600 hover:underline ml-1">
                            View full price guide →
                        </a>
                    </p>

                    {/* CTA Buttons */}
                    {showCTA && (
                        <div className="flex flex-wrap items-center justify-center gap-3">
                            <a
                                href={CONTACT.whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <MessageCircle className="w-4 h-4" />
                                WhatsApp Quote
                            </a>
                            <a
                                href={getCallTelHref()}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-full border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
                            >
                                <Phone className="w-4 h-4" />
                                {`Call ${CONTACT.callNumberDisplay.replace('+91 ', '')}`}
                            </a>
                        </div>
                    )}

                    {/* Trust Badge - Friction Reduction */}
                    {showCTA && (
                        <TrustBadge variant="compact" className="mt-4" />
                    )}

                    {/* Powered by badge */}
                    <p className="mt-4 text-xs text-gray-400">
                        📊 Powered by <span className="font-medium text-gray-500">Kashitaxi Research</span> •
                        2000+ trips completed
                    </p>
                </div>
            </div>
        </section>
    );
}
