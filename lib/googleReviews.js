// lib/googleReviews.js
// Google Places API integration for fetching business reviews

import { BUSINESS } from '@/config/business';

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const PLACE_ID = BUSINESS.placeId; // Vinayak Travels place ID

/**
 * Fetch business details and reviews from Google Places API
 */
export async function fetchGoogleBusinessData() {
  if (!GOOGLE_PLACES_API_KEY) {
    console.warn('Google Places API key not configured, using mock data');
    return getMockReviews();
  }

  try {
    // First, get place details
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=name,rating,user_ratings_total,reviews,formatted_address,geometry&key=${GOOGLE_PLACES_API_KEY}`;
    
    const response = await fetch(detailsUrl);
    const data = await response.json();

    if (data.status !== 'OK') {
      throw new Error(`Google Places API error: ${data.status}`);
    }

    const place = data.result;
    
    // Transform Google reviews to our format
    const transformedReviews = place.reviews?.map((review, index) => ({
      id: index + 1,
      author: review.author_name,
      rating: review.rating,
      text: review.text,
      date: formatRelativeTime(review.time),
      verified: true,
      profilePhotoUrl: review.profile_photo_url,
      authorUrl: review.author_url,
    })) || [];

    return {
      businessName: place.name,
      averageRating: place.rating,
      totalReviews: place.user_ratings_total,
      reviews: transformedReviews,
      address: place.formatted_address,
      coordinates: place.geometry?.location,
    };
  } catch (error) {
    console.error('Error fetching Google Business data:', error);
    // Fallback to mock data
    return getMockReviews();
  }
}

/**
 * Format timestamp to relative time
 */
function formatRelativeTime(timestamp) {
  const now = Date.now();
  const reviewTime = timestamp * 1000; // Convert to milliseconds
  const diffInDays = Math.floor((now - reviewTime) / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return '1 day ago';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 14) return '1 week ago';
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 60) return '1 month ago';
  return `${Math.floor(diffInDays / 30)} months ago`;
}

/**
 * Fallback data used when the Places API key is absent or the API call fails.
 *
 * These are REAL reviews exported from the Google Business Profile API
 * (accounts/108260916532676950345 → locations/16805355982216334281) on
 * 2026-08-02. Do not replace them with invented testimonials: publishing
 * fabricated reviews is both a consumer-protection risk and grounds for
 * structured-data penalties.
 */
function getMockReviews() {
  return {
    businessName: BUSINESS.legalName,
    averageRating: BUSINESS.rating,
    totalReviews: BUSINESS.reviewCount,
    reviews: [
      {
        id: 1,
        author: 'A Shiv',
        rating: 5,
        text: "Best tour and travels service offered in City Varanasi, with well behaved driver and clean taxi. We had taken service from him and it was excellent experience. It's most recommended if you are coming with family.",
        date: formatRelativeTime(Date.parse('2026-07-21T07:43:18Z') / 1000),
        verified: true,
      },
      {
        id: 2,
        author: 'Kulwant Kapoor',
        rating: 5,
        text: 'Great hospitality and Not any additional charges. Fixed rate/price which you discussed during booking.',
        date: formatRelativeTime(Date.parse('2026-06-23T13:05:29Z') / 1000),
        verified: true,
      },
      {
        id: 3,
        author: 'Nooka Ratnam',
        rating: 5,
        text: 'Rajan Driver is very good driver and helped us in Ayodhya and Varanasi. I recommend him for our future tours also. Thank you.',
        date: formatRelativeTime(Date.parse('2026-04-17T04:11:50Z') / 1000),
        verified: true,
      },
      {
        id: 4,
        author: 'Yashoda Kotha',
        rating: 5,
        text: 'Driver Rajan was very good in driving & assisting us every where throughout our travel to varanasi & Ayodhya. I recommend him to send him for new travelers to these places.',
        date: formatRelativeTime(Date.parse('2026-04-17T04:06:04Z') / 1000),
        verified: true,
      },
      {
        id: 5,
        author: 'Sri Koundinya Mutnuri',
        rating: 5,
        text: 'Thank you so much for organising our entire trip at such short notice and making it a hassle free experience. Your commitment and warmth made this trip a genuinely wonderful experience.',
        date: formatRelativeTime(Date.parse('2026-02-17T05:24:45Z') / 1000),
        verified: true,
      },
    ],
  };
}

/**
 * Client-side fetch function for use in components
 */
export async function fetchReviewsClientSide() {
  try {
    const response = await fetch('/api/google-reviews');
    if (!response.ok) {
      throw new Error('Failed to fetch reviews');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return getMockReviews();
  }
}
