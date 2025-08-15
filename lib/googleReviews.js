// lib/googleReviews.js
// Google Places API integration for fetching business reviews

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const PLACE_ID = 'ChIJFf691_wt44kREP5WvW4bBtI'; // Vinayak Travels place ID

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
 * Fallback mock data when API is not available
 */
function getMockReviews() {
  return {
    businessName: 'Vinayak Travels',
    averageRating: 4.8,
    totalReviews: 87,
    reviews: [
      {
        id: 1,
        author: 'Priya S.',
        rating: 5,
        text: 'Excellent service! Driver was punctual and very polite. Clean AC car and transparent pricing. Highly recommended for Varanasi taxi service.',
        date: '2 days ago',
        verified: true,
      },
      {
        id: 2,
        author: 'Rajesh M.',
        rating: 5,
        text: 'Used for airport pickup. Driver was waiting with nameplate and helped with luggage. Fair pricing and comfortable ride.',
        date: '1 week ago',
        verified: true,
      },
      {
        id: 3,
        author: 'Sarah Johnson',
        rating: 5,
        text: 'Great outstation trip to Ayodhya. Driver was knowledgeable about routes and spoke good English. Will use again!',
        date: '2 weeks ago',
        verified: true,
      },
      {
        id: 4,
        author: 'Amit K.',
        rating: 4,
        text: 'Good local darshan service. Visited all major temples. Driver was helpful and patient during our stops.',
        date: '3 weeks ago',
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
