import React from 'react';

/**
 * MapWidget Component
 * Embeds a Google Map using an iframe.
 * Supports direct embed URL (src), Place ID, or search query.
 * 
 * @param {Object} props
 * @param {string} [props.src] - Direct iframe embed URL (e.g. from Google Maps "Share -> Embed")
 * @param {string} [props.placeId] - Google Maps Place ID (requires API key if using official Embed API, or used in query)
 * @param {string} [props.query] - Search query (e.g. "Kashi Vishwanath Temple")
 * @param {string} [props.title] - Title for the iframe accessibility
 * @param {string} [props.className] - Additional CSS classes
 */
const MapWidget = ({ src, placeId, query, title = "Map", className = "" }) => {
    // If no source data is provided, don't render anything
    if (!src && !placeId && !query) return null;

    let embedUrl = src;

    // Construct URL if not provided directly
    if (!embedUrl) {
        if (placeId) {
            // Using the "search" mode with Place ID is a robust fallback without an API key
            // format: https://www.google.com/maps?q=place_id:<id>&output=embed
            embedUrl = `https://www.google.com/maps?q=place_id:${placeId}&output=embed`;
        } else if (query) {
            // Fallback to search query
            const encodedQuery = encodeURIComponent(query);
            embedUrl = `https://www.google.com/maps?q=${encodedQuery}&output=embed`;
        }
    }

    return (
        <div className={`w-full rounded-xl overflow-hidden shadow-lg border border-neutral-200 bg-neutral-50 ${className}`}>
            <div className="relative w-full" style={{ paddingTop: '56.25%' }}> {/* 16:9 Aspect Ratio */}
                <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={embedUrl}
                    title={title}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </div>
        </div>
    );
};

export default MapWidget;
