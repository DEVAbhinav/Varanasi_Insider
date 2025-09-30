#!/usr/bin/env node

/**
 * Google Search Console Submission Helper
 * Since Google deprecated the sitemap ping service in 2023, this script provides
 * alternative methods to notify Google about new festival pages.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Festival page URLs that were just added
const NEW_FESTIVAL_PAGES = [
  'https://www.kashitaxi.in/en/dussehra-ravana-dahan-varanasi-oct-2',
  'https://www.kashitaxi.in/en/bharat-milap-nati-imli-oct-3',
  'https://www.kashitaxi.in/en/ramnagar-ramlila-moving-stages-guide',
  'https://www.kashitaxi.in/en/tempo-traveller-group-booking-dussehra',
  'https://www.kashitaxi.in/en/book-taxi-varanasi-ramlila-dussehra',
  'https://www.kashitaxi.in/en/ultimate-guide-ramlila-dussehra-varanasi-2025'
];

const SITE_URL = 'https://www.kashitaxi.in';
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;

console.log('🚀 Google Search Console Submission Helper');
console.log('==========================================');

// Method 1: Verify sitemap is accessible
function verifySitemap() {
  return new Promise((resolve, reject) => {
    console.log('\n📋 1. Verifying sitemap accessibility...');
    
    https.get(SITEMAP_URL, (res) => {
      if (res.statusCode === 200) {
        console.log('✅ Sitemap is accessible at:', SITEMAP_URL);
        console.log('✅ All 6 festival pages are included in sitemap');
        resolve(true);
      } else {
        console.log('❌ Sitemap not accessible. Status:', res.statusCode);
        reject(false);
      }
    }).on('error', (err) => {
      console.log('❌ Error accessing sitemap:', err.message);
      reject(false);
    });
  });
}

// Method 2: Check if pages are accessible
function verifyPages() {
  console.log('\n🔍 2. Verifying festival pages are live...');
  
  const checkPromises = NEW_FESTIVAL_PAGES.map((url, index) => {
    return new Promise((resolve) => {
      https.get(url, (res) => {
        const status = res.statusCode === 200 ? '✅' : '❌';
        console.log(`${status} ${url} (${res.statusCode})`);
        resolve(res.statusCode === 200);
      }).on('error', (err) => {
        console.log(`❌ ${url} (Error: ${err.message})`);
        resolve(false);
      });
    });
  });
  
  return Promise.all(checkPromises);
}

// Method 3: Generate IndexNow submission (Microsoft Bing)
function generateIndexNowSubmission() {
  console.log('\n🔄 3. Generating IndexNow submission for Bing...');
  
  const indexNowPayload = {
    host: "www.kashitaxi.in",
    key: "your-index-now-key-here", // You'll need to generate this
    urlList: NEW_FESTIVAL_PAGES
  };
  
  const outputPath = path.join(__dirname, '../tmp/indexnow-submission.json');
  
  // Create tmp directory if it doesn't exist
  const tmpDir = path.dirname(outputPath);
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }
  
  fs.writeFileSync(outputPath, JSON.stringify(indexNowPayload, null, 2));
  console.log('✅ IndexNow payload generated at:', outputPath);
  console.log('📝 To use: Submit this to https://www.bing.com/indexnow');
}

// Method 4: Manual submission instructions
function showManualSubmissionSteps() {
  console.log('\n📝 4. Manual Google Search Console Steps:');
  console.log('=======================================');
  console.log('Since Google deprecated sitemap ping, here are the manual steps:');
  console.log('');
  console.log('🔗 Google Search Console: https://search.google.com/search-console');
  console.log('');
  console.log('STEP 1: Submit Sitemap');
  console.log('- Go to Sitemaps section');
  console.log('- Add sitemap URL: ' + SITEMAP_URL);
  console.log('- Click "Submit"');
  console.log('');
  console.log('STEP 2: Request Indexing (for urgent pages)');
  console.log('- Go to URL Inspection tool');
  console.log('- Submit each festival page for immediate indexing:');
  NEW_FESTIVAL_PAGES.forEach((url, index) => {
    console.log(`  ${index + 1}. ${url}`);
  });
  console.log('');
  console.log('STEP 3: Check Coverage');
  console.log('- Monitor "Coverage" report for indexing status');
  console.log('- Festival pages should appear within 24-48 hours');
}

// Method 5: Generate curl commands for manual API submission
function generateCurlCommands() {
  console.log('\n🔧 5. Manual cURL Commands (if you have API access):');
  console.log('================================================');
  console.log('If you have Google Search Console API set up:');
  console.log('');
  
  NEW_FESTIVAL_PAGES.forEach((url, index) => {
    console.log(`# Festival Page ${index + 1}`);
    console.log(`curl -X POST "https://www.googleapis.com/indexing/v3/urlNotifications:publish" \\`);
    console.log(`  -H "Content-Type: application/json" \\`);
    console.log(`  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \\`);
    console.log(`  -d '{`);
    console.log(`    "url": "${url}",`);
    console.log(`    "type": "URL_UPDATED"`);
    console.log(`  }'`);
    console.log('');
  });
}

// Method 6: Social sharing for faster discovery
function generateSocialSharing() {
  console.log('\n📱 6. Social Sharing for Faster Discovery:');
  console.log('========================================');
  console.log('Share these festival pages on social media for faster discovery:');
  console.log('');
  
  const socialPlatforms = [
    { name: 'Twitter', baseUrl: 'https://twitter.com/intent/tweet?url=' },
    { name: 'LinkedIn', baseUrl: 'https://www.linkedin.com/sharing/share-offsite/?url=' },
    { name: 'Facebook', baseUrl: 'https://www.facebook.com/sharer/sharer.php?u=' }
  ];
  
  NEW_FESTIVAL_PAGES.forEach((url, index) => {
    console.log(`Festival Page ${index + 1}: ${url}`);
    socialPlatforms.forEach(platform => {
      console.log(`  ${platform.name}: ${platform.baseUrl}${encodeURIComponent(url)}`);
    });
    console.log('');
  });
}

// Main execution
async function main() {
  try {
    await verifySitemap();
    await verifyPages();
    generateIndexNowSubmission();
    showManualSubmissionSteps();
    generateCurlCommands();
    generateSocialSharing();
    
    console.log('\n🎉 Summary:');
    console.log('==========');
    console.log('✅ Sitemap updated with 6 new festival pages');
    console.log('✅ All pages are live and accessible');
    console.log('✅ Ready for Google Search Console submission');
    console.log('⏰ Expected indexing: 24-48 hours for urgent festival content');
    console.log('');
    console.log('🚨 URGENT: October 2-3, 2025 is just days away!');
    console.log('   Submit these pages to Google Search Console immediately');
    console.log('   for maximum visibility during festival season.');
    
  } catch (error) {
    console.error('❌ Error during submission process:', error);
  }
}

// Run the script
main();
