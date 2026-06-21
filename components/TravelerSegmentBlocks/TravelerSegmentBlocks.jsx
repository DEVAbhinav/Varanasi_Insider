import React from 'react';
import { Users, Heart, Globe, MessageCircle, Baby, Shield, MapPin, Clock, Car, Languages } from 'lucide-react';
import TrustBadge from '../TrustBadge/TrustBadge';
import { CONTACT, getWhatsAppUrl } from '@/lib/contact';

/**
 * TravelerSegmentBlocks - Persona-targeted value proposition blocks
 * Displays 3 segment cards: Families, Solo Women, Foreign Visitors
 * Each with tailored USPs and WhatsApp CTA with pre-filled message
 */
export default function TravelerSegmentBlocks({ phone = CONTACT.whatsappNumberRaw }) {
    const segments = [
        {
            id: 'families',
            icon: Users,
            iconBg: 'bg-amber-100',
            iconColor: 'text-amber-600',
            gradientFrom: 'from-amber-50',
            gradientTo: 'to-orange-50',
            borderColor: 'border-amber-200',
            title: 'Best for Families with Elders',
            subtitle: 'Comfort-first touring',
            highlights: [
                { icon: Car, text: 'AC comfort throughout' },
                { icon: Clock, text: 'Fewer temple queues' },
                { icon: Shield, text: 'Driver assistance at every stop' },
                { icon: MapPin, text: 'Less walking itineraries' },
            ],
            ctaMessage: 'Family tour, elders, need less walking',
            ctaLabel: 'Plan My Family Trip',
        },
        {
            id: 'women',
            icon: Heart,
            iconBg: 'bg-pink-100',
            iconColor: 'text-pink-600',
            gradientFrom: 'from-pink-50',
            gradientTo: 'to-rose-50',
            borderColor: 'border-pink-200',
            title: 'Best for Solo Women & Women Groups',
            subtitle: 'Safety-first experience',
            highlights: [
                { icon: Car, text: 'Pink Taxi with women drivers' },
                { icon: MapPin, text: 'Live location sharing' },
                { icon: Shield, text: 'Verified & trained drivers' },
                { icon: Clock, text: '24/7 support helpline' },
            ],
            ctaMessage: 'Solo woman trip, need safe cab',
            ctaLabel: 'Book Safe Ride',
        },
        {
            id: 'foreign',
            icon: Globe,
            iconBg: 'bg-cyan-100',
            iconColor: 'text-cyan-600',
            gradientFrom: 'from-cyan-50',
            gradientTo: 'to-teal-50',
            borderColor: 'border-cyan-200',
            title: 'Best for First-Time Foreign Visitors',
            subtitle: 'Hassle-free discovery',
            highlights: [
                { icon: Languages, text: 'English-speaking driver/guide' },
                { icon: MapPin, text: 'Curated must-see itinerary' },
                { icon: Shield, text: 'Cultural tips included' },
                { icon: Clock, text: 'Flexible timing' },
            ],
            ctaMessage: 'First time Varanasi, need English guide',
            ctaLabel: 'Get Expert Guide',
        },
    ];

    const buildWhatsAppUrl = (message) => {
        return getWhatsAppUrl(message, phone);
    };

    return (
        <section className="py-8 md:py-12 bg-gradient-to-b from-gray-50 to-white">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-8">
                    <p className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-2">
                        Tailored for You
                    </p>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Which Traveler Are You?
                    </h2>
                    <p className="mt-2 text-gray-600 max-w-xl mx-auto">
                        We customize every tour based on who's traveling. Tell us your needs.
                    </p>
                </div>

                {/* Segment Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {segments.map((segment) => (
                        <div
                            key={segment.id}
                            className={`relative bg-gradient-to-br ${segment.gradientFrom} ${segment.gradientTo} rounded-2xl p-6 border-2 ${segment.borderColor} hover:shadow-xl transition-all duration-300 group`}
                        >
                            {/* Icon Badge */}
                            <div className={`inline-flex items-center justify-center w-12 h-12 ${segment.iconBg} rounded-xl mb-4 group-hover:scale-110 transition-transform`}>
                                <segment.icon className={`w-6 h-6 ${segment.iconColor}`} />
                            </div>

                            {/* Title */}
                            <h3 className="text-lg font-bold text-gray-900 mb-1">
                                {segment.title}
                            </h3>
                            <p className="text-sm text-gray-500 mb-4">
                                {segment.subtitle}
                            </p>

                            {/* Highlights */}
                            <ul className="space-y-2 mb-6">
                                {segment.highlights.map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                                        <item.icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                        <span>{item.text}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* WhatsApp CTA */}
                            <a
                                href={buildWhatsAppUrl(segment.ctaMessage)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <MessageCircle className="w-5 h-5" />
                                {segment.ctaLabel}
                            </a>

                            {/* Trust Badge - Friction Reduction */}
                            <TrustBadge variant="inline" className="mt-3" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
