
import { CONTACT } from '@/lib/contact';

const SITE_URL = 'https://www.kashitaxi.in';
const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const DEFAULT_HERO_IMAGE = 'https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/varanasi-hero.png';
const MALFORMED_SITE_PREFIX = /^https?:\/\/www\.kashitaxi\.in(https?:\/\/.+)$/i;

const toAbsoluteUrl = (value, fallback = null) => {
    const rawValue = typeof value === 'string' ? value.trim() : '';
    const source = rawValue || fallback;

    if (!source || typeof source !== 'string') {
        return null;
    }

    const malformedMatch = source.match(MALFORMED_SITE_PREFIX);
    if (malformedMatch) {
        return malformedMatch[1];
    }

    if (source.startsWith('http://') || source.startsWith('https://')) {
        return source;
    }

    if (source.startsWith('//')) {
        return `https:${source}`;
    }

    return `${SITE_URL}${source.startsWith('/') ? source : `/${source}`}`;
};

const normalizeDateValue = (value) => {
    if (!value) return null;
    if (value instanceof Date) {
        return Number.isNaN(value.getTime()) ? null : value.toISOString();
    }
    if (typeof value === 'number') {
        const parsed = new Date(value);
        return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
    }
    if (typeof value === 'string') {
        const trimmed = value.trim();
        return trimmed || null;
    }
    return null;
};

const isValidDateValue = (value) => {
    if (!value || typeof value !== 'string') {
        return false;
    }
    return !Number.isNaN(Date.parse(value));
};

export function generateOrganizationSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': ['Organization', 'LocalBusiness', 'TaxiService'],
        '@id': ORGANIZATION_ID,
        name: 'Varanasi Taxi | Vinayak Travels',
        url: SITE_URL,
        logo: `https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/logo.jpeg`,
        sameAs: [
            'https://www.facebook.com/kashitaxi',
            'https://twitter.com/kashitaxi',
            'https://www.instagram.com/kashitaxi',
            'https://www.linkedin.com/company/kashitaxi',
            'https://www.youtube.com/@kashitaxi'
        ],
        contactPoint: [
            {
                '@type': 'ContactPoint',
                telephone: CONTACT.callNumberE164,
                contactType: 'customer service',
                areaServed: ['IN'],
                availableLanguage: ['en', 'hi'],
            },
        ],
        address: {
            '@type': 'PostalAddress',
            streetAddress: 'Shastri Nagar, Sigra',
            addressLocality: 'Varanasi',
            addressRegion: 'Uttar Pradesh',
            postalCode: '221010',
            addressCountry: 'IN',
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: '25.3176',
            longitude: '82.9739'
        },
        openingHoursSpecification: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: [
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
                'Sunday'
            ],
            opens: '00:00',
            closes: '23:59'
        },
        priceRange: '₹₹'
    };
}

export function generateBreadcrumbSchema(crumbs) {
    return {
        '@type': 'BreadcrumbList',
        itemListElement: crumbs.map((crumb, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: crumb.name,
            item: (crumb.url || crumb.item || '').startsWith('http') ? (crumb.url || crumb.item) : `${SITE_URL}${crumb.url || crumb.item}`
        }))
    };
}

export function generateFAQSchema(faqs) {
    if (!faqs || !Array.isArray(faqs) || faqs.length === 0) return null;

    const validFaqs = faqs.filter(faq => (faq.question || faq.q) && (faq.answer || faq.a));
    if (validFaqs.length === 0) return null;

    return {
        '@type': 'FAQPage',
        mainEntity: validFaqs.map(faq => ({
            '@type': 'Question',
            name: faq.question || faq.q,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer || faq.a
            }
        }))
    };
}

export function generateServiceSchema(data) {
    const {
        title,
        description,
        url,
        image,
        offers,
        provider,
        areaServed,
        aggregateRating,
        location // Add location
    } = data;

    const schema = {
        '@type': 'Service',
        name: title || '',
        description: description || '',
        url: (url || '').startsWith('http') ? url : `${SITE_URL}${url}`,
        provider: {
            '@type': 'LocalBusiness',
            '@id': ORGANIZATION_ID,
            name: provider?.name || 'Varanasi Taxi',
            telephone: provider?.telephone || CONTACT.callNumberE164,
            url: provider?.url || SITE_URL
        },
        areaServed: areaServed || (location ? [{
            '@type': 'Place',
            name: location.name || 'Varanasi',
            address: {
                '@type': 'PostalAddress',
                streetAddress: location.address || 'Varanasi',
                addressLocality: 'Varanasi',
                addressCountry: 'IN'
            }
        }] : ['Varanasi', 'Sarnath', 'Ramnagar', 'Mughalsarai']),
    };

    if (image) {
        schema.image = image.startsWith('http') ? image : `${SITE_URL}${image}`;
    }

    if (offers && Array.isArray(offers)) {
        schema.hasOfferCatalog = {
            '@type': 'OfferCatalog',
            name: 'Service Offerings',
            itemListElement: offers.map(offer => ({
                '@type': 'Offer',
                name: offer.name,
                price: offer.price,
                priceCurrency: offer.priceCurrency || 'INR',
                description: offer.description || ''
            }))
        };
    }

    if (aggregateRating) {
        schema.aggregateRating = {
            '@type': 'AggregateRating',
            ratingValue: aggregateRating.ratingValue,
            reviewCount: aggregateRating.reviewCount,
            bestRating: '5',
            worstRating: '1'
        };
    }

    return schema;
}

export function generateArticleSchema(data) {
    const {
        title,
        description,
        url,
        image,
        datePublished,
        dateModified,
        authorName,
        publisherName,
        publisherLogo
    } = data;

    const pageUrl = toAbsoluteUrl(url, SITE_URL);

    const schema = {
        '@type': 'BlogPosting',
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': pageUrl
        },
        headline: title || '',
        description: description || '',
        author: {
            '@type': 'Person',
            name: authorName || 'Varanasi Taxi Team'
        },
        publisher: {
            '@type': 'Organization',
            name: publisherName || 'Varanasi Taxi',
            logo: {
                '@type': 'ImageObject',
                url: toAbsoluteUrl(publisherLogo, '/favicon.jpeg')
            }
        }
    };

    if (image) {
        schema.image = toAbsoluteUrl(image);
    }

    if (datePublished) {
        schema.datePublished = datePublished;
    }

    if (dateModified || datePublished) {
        schema.dateModified = dateModified || datePublished;
    }

    return schema;
}

export function generateCollectionPageSchema(data) {
    const {
        title,
        description,
        url,
        items
    } = data;

    const pageUrl = (url || '').startsWith('http') ? url : `${SITE_URL}${url}`;

    return {
        '@type': 'CollectionPage',
        '@id': pageUrl,
        name: title || '',
        description: description || '',
        url: pageUrl,
        isPartOf: { '@id': WEBSITE_ID },
        about: items.map(item => ({
            '@type': 'Thing',
            name: item.name,
            url: (item.url || '').startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
            description: item.description || ''
        })),
        publisher: { '@id': ORGANIZATION_ID }
    };
}

export function generateProductSchema(data) {
    const {
        title,
        description,
        url,
        image,
        offers,
        aggregateRating,
        brand,
        location // Add location
    } = data;

    const schema = {
        '@type': 'Product',
        name: title || '',
        description: description || '',
        url: (url || '').startsWith('http') ? url : `${SITE_URL}${url}`,
        brand: {
            '@type': 'Brand',
            name: brand || 'Varanasi Taxi'
        }
    };

    if (image) {
        schema.image = image.startsWith('http') ? image : `${SITE_URL}${image}`;
    }

    if (offers && Array.isArray(offers)) {
        // Product usually has one main offer or an AggregateOffer, but we can list multiple
        // For simplicity, if multiple offers, we might use AggregateOffer or just the first one as the main price
        // Let's use the first offer as the main price spec if available, or list them
        // Schema.org Product expects 'offers' to be an Offer or AggregateOffer
        if (offers.length > 0) {
            const mainOffer = offers[0];
            const offerSchema = {
                '@type': 'Offer',
                price: mainOffer.price,
                priceCurrency: mainOffer.priceCurrency || 'INR',
                availability: 'https://schema.org/InStock',
                url: (url || '').startsWith('http') ? url : `${SITE_URL}${url}`
            };

            if (location) {
                offerSchema.areaServed = {
                    '@type': 'Place',
                    name: location.name || 'Varanasi',
                    address: {
                        '@type': 'PostalAddress',
                        streetAddress: location.address || 'Varanasi',
                        addressLocality: 'Varanasi',
                        addressCountry: 'IN'
                    }
                };
            }

            schema.offers = offerSchema;
        }
    }

    if (aggregateRating) {
        schema.aggregateRating = {
            '@type': 'AggregateRating',
            ratingValue: aggregateRating.ratingValue,
            reviewCount: aggregateRating.reviewCount,
            bestRating: '5',
            worstRating: '1'
        };
    }

    return schema;
}

export function generateEventSchema(data) {
    const {
        title,
        description,
        url,
        image,
        startDate,
        endDate,
        location,
        offers,
        organizer,
        performer
    } = data;

    const normalizedStartDate = normalizeDateValue(startDate);
    if (!isValidDateValue(normalizedStartDate)) {
        return null;
    }

    const normalizedEndDate = normalizeDateValue(endDate);
    const safeEndDate = isValidDateValue(normalizedEndDate) ? normalizedEndDate : normalizedStartDate;

    const eventUrl = toAbsoluteUrl(url, SITE_URL);
    const imageUrl = toAbsoluteUrl(image, DEFAULT_HERO_IMAGE);

    const locationName = typeof location === 'string'
        ? location
        : location?.name;
    const locationAddress = typeof location === 'string'
        ? location
        : location?.address;

    const schema = {
        '@type': 'Event',
        name: title || '',
        description: description || '',
        url: eventUrl,
        startDate: normalizedStartDate,
        endDate: safeEndDate,
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        location: {
            '@type': 'Place',
            name: locationName || 'Varanasi',
            address: {
                '@type': 'PostalAddress',
                streetAddress: locationAddress || 'Varanasi',
                addressLocality: 'Varanasi',
                addressCountry: 'IN'
            }
        }
    };

    if (imageUrl) {
        schema.image = imageUrl;
    }

    if (organizer) {
        schema.organizer = {
            '@type': 'Organization',
            name: organizer.name || 'Varanasi Taxi',
            url: organizer.url || SITE_URL
        };
    } else {
        schema.organizer = {
            '@type': 'Organization',
            name: 'Varanasi Taxi',
            url: SITE_URL
        };
    }

    if (performer) {
        const performers = Array.isArray(performer) ? performer : [performer];
        schema.performer = performers
            .filter(Boolean)
            .map((p) => (typeof p === 'string'
                ? { '@type': 'Person', name: p }
                : { '@type': p['@type'] || 'Person', name: p.name }));
    }

    if (offers && Array.isArray(offers) && offers.length > 0) {
        const mappedOffers = offers.map((offer) => ({
            '@type': 'Offer',
            price: offer.price,
            priceCurrency: offer.priceCurrency || 'INR',
            url: offer.url
                ? toAbsoluteUrl(offer.url, eventUrl)
                : eventUrl,
            availability: offer.availability || 'https://schema.org/InStock',
            validFrom: offer.validFrom || normalizedStartDate || undefined,
        }));

        schema.offers = mappedOffers.length === 1 ? mappedOffers[0] : mappedOffers;
    }

    return schema;
}

export function generateTouristAttractionSchema(data) {
    const {
        title,
        description,
        url,
        image,
        geo,
        address,
        aggregateRating
    } = data;

    const schema = {
        '@type': 'TouristAttraction',
        name: title || '',
        description: description || '',
        url: (url || '').startsWith('http') ? url : `${SITE_URL}${url}`,
    };

    if (image) {
        schema.image = image.startsWith('http') ? image : `${SITE_URL}${image}`;
    }

    if (geo) {
        schema.geo = {
            '@type': 'GeoCoordinates',
            latitude: geo.latitude,
            longitude: geo.longitude
        };
    }

    if (address) {
        schema.address = {
            '@type': 'PostalAddress',
            streetAddress: address.streetAddress || '',
            addressLocality: address.addressLocality || 'Varanasi',
            addressRegion: address.addressRegion || 'Uttar Pradesh',
            postalCode: address.postalCode || '',
            addressCountry: 'IN'
        };
    }

    if (aggregateRating) {
        schema.aggregateRating = {
            '@type': 'AggregateRating',
            ratingValue: aggregateRating.ratingValue,
            reviewCount: aggregateRating.reviewCount,
            bestRating: '5',
            worstRating: '1'
        };
    }

    return schema;
}

export function generateWebPageSchema(data) {
    const {
        title,
        description,
        url,
        image,
        datePublished,
        dateModified,
        breadcrumb,
        lang
    } = data;

    const inLanguage = lang === 'hi' ? 'hi' : 'en-IN';

    const schema = {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url: url,
        name: title || '',
        description: description || '',
        isPartOf: { '@id': WEBSITE_ID },
        inLanguage,
    };

    if (image) {
        schema.primaryImageOfPage = {
            '@type': 'ImageObject',
            url: image.startsWith('http') ? image : `${SITE_URL}${image}`
        };
    }

    if (datePublished) schema.datePublished = datePublished;
    if (dateModified) schema.dateModified = dateModified;
    if (breadcrumb) {
        schema.breadcrumb = breadcrumb;
    }

    return schema;
}
