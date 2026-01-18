import React from 'react';
import { ShieldCheck, Clock, Wallet } from 'lucide-react';

/**
 * TrustBadge - Friction-reduction messaging near CTAs
 * Displays trust signals: Free cancellation, transparent pricing, no hidden charges
 * 
 * Strategic placement near call/WhatsApp buttons to reduce hesitation
 */
export default function TrustBadge({ variant = 'default', className = '' }) {
    const isCompact = variant === 'compact';
    const isInline = variant === 'inline';

    const badges = [
        { icon: Clock, text: 'Free cancellation 24 hrs', shortText: 'Free cancel' },
        { icon: Wallet, text: 'Transparent prices', shortText: 'No surprises' },
        { icon: ShieldCheck, text: 'No hidden charges', shortText: 'All-inclusive' },
    ];

    if (isInline) {
        // Single line for tight spaces
        return (
            <div className={`flex items-center justify-center gap-1.5 text-xs text-gray-500 ${className}`}>
                <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                <span>Free cancellation • Transparent prices • No hidden charges</span>
            </div>
        );
    }

    if (isCompact) {
        // Compact pill badges
        return (
            <div className={`flex flex-wrap items-center justify-center gap-2 ${className}`}>
                {badges.map((badge, idx) => (
                    <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-[10px] font-medium rounded-full border border-green-100"
                    >
                        <badge.icon className="w-3 h-3" />
                        {badge.shortText}
                    </span>
                ))}
            </div>
        );
    }

    // Default: Full badges with icons
    return (
        <div className={`flex flex-wrap items-center justify-center gap-3 ${className}`}>
            {badges.map((badge, idx) => (
                <div
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 text-xs font-medium rounded-full border border-green-100 shadow-sm"
                >
                    <badge.icon className="w-4 h-4 text-green-600" />
                    <span>{badge.text}</span>
                </div>
            ))}
        </div>
    );
}
