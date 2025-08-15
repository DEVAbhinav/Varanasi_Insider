# Dynamic Google Business Reviews Setup

This implementation provides dynamic Google Business reviews for the Varanasi Insider website using the Google Places API.

## Features

✅ **Dynamic Google Reviews** - Fetches real reviews from Google Business Profile  
✅ **Fallback System** - Uses mock data when API is unavailable  
✅ **Caching** - Server-side caching for better performance  
✅ **Error Handling** - Graceful degradation if API fails  
✅ **Responsive Design** - Works on all device sizes  

## Setup Instructions

### 1. Get Google Places API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Places API (New)**
4. Go to **APIs & Services > Credentials**
5. Click **Create Credentials > API Key**
6. Copy your API key

### 2. Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Add your API key to `.env.local`:
   ```env
   GOOGLE_PLACES_API_KEY=your_actual_api_key_here
   ```

### 3. Test the Setup

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Visit the homepage - you should see the Google Reviews section

3. Check the API endpoint directly:
   ```
   http://localhost:3000/api/google-reviews
   ```

## API Endpoints

### `/api/google-reviews`
- **Method**: GET
- **Returns**: Business data including reviews, ratings, and business info
- **Cache**: 1 hour server-side cache
- **Fallback**: Mock data if API fails

## Files Added/Modified

### New Files:
- `lib/googleReviews.js` - Google Places API integration
- `pages/api/google-reviews.js` - API route for fetching reviews
- `.env.example` - Environment variables template

### Modified Files:
- `components/GoogleReviews/GoogleReviews.jsx` - Updated to use dynamic data
- `components/GoogleReviews/GoogleReviews.module.css` - Added error state styling

## Business Information

- **Business Name**: Vinayak Travels
- **Place ID**: `ChIJFf691_wt44kREP5WvW4bBtI`
- **Google Maps**: https://maps.app.goo.gl/gbmqXgHE8Nzq5NrbA
- **Coordinates**: 25.287133678944816, 82.94264689837131

## Cost Considerations

Google Places API pricing (as of 2024):
- **Place Details**: $17 per 1,000 requests
- **Reviews included**: No additional cost for reviews in Place Details

With 1-hour caching, costs are minimal for typical website traffic.

## Monitoring

- Reviews update every hour (cache duration)
- Check API usage in Google Cloud Console
- Monitor error logs for API failures
- Fallback ensures site always works

## Security Notes

- API key is server-side only (not exposed to clients)
- Environment variables are not committed to version control
- CORS protection via Next.js API routes

## Troubleshooting

### No reviews showing:
1. Check API key is correct in `.env.local`
2. Verify Places API is enabled in Google Cloud
3. Check browser console for errors
4. Test API endpoint directly

### API quota exceeded:
1. Check usage in Google Cloud Console
2. Increase quota or add billing
3. Fallback will show mock data

### Wrong business data:
1. Verify Place ID is correct
2. Check coordinates match your business
3. Update Place ID in `lib/googleReviews.js`
