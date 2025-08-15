// pages/api/google-reviews.js
// API route for fetching Google Business reviews

import { fetchGoogleBusinessData } from '../../lib/googleReviews';

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const businessData = await fetchGoogleBusinessData();
    
    // Cache the response for 1 hour
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    
    return res.status(200).json(businessData);
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch reviews',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
}
