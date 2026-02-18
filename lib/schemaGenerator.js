
import { CONTACT } from '@/lib/contact';

const SITE_URL = 'https://www.kashitaxi.in';
const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

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

    return {
        '@type': 'FAQPage',
        mainEntity: faqs.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer
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

    const schema = {
        '@type': 'BlogPosting',
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': (url || '').startsWith('http') ? url : `${SITE_URL}${url}`
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
                url: publisherLogo || `${SITE_URL}https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/logo.jpeg`
            }
        },
        datePublished: datePublished || '',
        dateModified: dateModified || datePublished || ''
    };

    if (image) {
        schema.image = image.startsWith('http') ? image : `${SITE_URL}${image}`;
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

    const eventUrl = (url || '').startsWith('http') ? url : `${SITE_URL}${url}`;
    const imageUrl = image
        ? (image.startsWith('http') ? image : `${SITE_URL}${image}`)
        : `${SITE_URL}https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/varanasi-hero.png`;

    const schema = {
        '@type': 'Event',
        name: title || '',
        description: description || '',
        url: eventUrl,
        startDate: startDate || '',
        endDate: endDate || startDate || '', // Fallback to start date if end date missing
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode'
    };

    if (imageUrl) {
        schema.image = imageUrl;
    }

    if (location) {
        schema.location = {
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
                ? (offer.url.startsWith('http') ? offer.url : `${SITE_URL}${offer.url}`)
                : eventUrl,
            availability: offer.availability || 'https://schema.org/InStock',
            validFrom: offer.validFrom || startDate || undefined,
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
        breadcrumb
    } = data;

    const schema = {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url: url,
        name: title || '',
        description: description || '',
        isPartOf: { '@id': WEBSITE_ID },
        inLanguage: 'en-US', // Should be dynamic
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
