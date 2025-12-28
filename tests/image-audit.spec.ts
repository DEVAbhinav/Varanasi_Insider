import { test, expect } from '@playwright/test';

// Critical pages to audit for images
const PAGES_TO_AUDIT = [
  { url: '/', name: 'Home Page' },
  { url: '/en/dashashwamedh-ghat-ganga-aarti-timing', name: 'Dashashwamedh Ghat Aarti' },
  { url: '/en/varanasi-travel-agent', name: 'Travel Agent Page' },
  { url: '/en/tempo-traveller-varanasi', name: 'Tempo Traveller Page' },
  { url: '/en/tourist-spots-varanasi', name: 'Tourist Spots' },
  { url: '/en/sarnath-complete-guide', name: 'Sarnath Guide' },
  { url: '/en/varanasi-airport-taxi-guide', name: 'Airport Taxi Guide' },
  { url: '/pink-taxi-varanasi', name: 'Pink Taxi Page' },
  { url: '/rates/outstation-taxi-varanasi', name: 'Outstation Rates' },
  { url: '/bike-rentals-varanasi', name: 'Bike Rentals' },
];

test.describe('Image Audit - Cloudinary Migration', () => {
  
  test('All pages should not have broken images', async ({ page }) => {
    const brokenImages: { page: string; src: string; error: string }[] = [];
    
    for (const pageInfo of PAGES_TO_AUDIT) {
      console.log(`\n🔍 Checking: ${pageInfo.name} (${pageInfo.url})`);
      
      // Navigate to page
      const response = await page.goto(pageInfo.url, { waitUntil: 'networkidle' });
      expect(response?.status()).toBeLessThan(400);
      
      // Get all images on the page
      const images = await page.locator('img').all();
      console.log(`   Found ${images.length} images`);
      
      for (const img of images) {
        const src = await img.getAttribute('src');
        if (!src) continue;
        
        // Skip data URLs and SVGs
        if (src.startsWith('data:') || src.endsWith('.svg')) continue;
        
        // Check if image loaded correctly
        const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
        const complete = await img.evaluate((el: HTMLImageElement) => el.complete);
        
        if (naturalWidth === 0 || !complete) {
          brokenImages.push({
            page: pageInfo.name,
            src: src.substring(0, 100),
            error: `naturalWidth=${naturalWidth}, complete=${complete}`
          });
          console.log(`   ❌ BROKEN: ${src.substring(0, 80)}...`);
        }
      }
    }
    
    // Report broken images
    if (brokenImages.length > 0) {
      console.log('\n\n❌ BROKEN IMAGES FOUND:');
      brokenImages.forEach(img => {
        console.log(`   Page: ${img.page}`);
        console.log(`   Src: ${img.src}`);
        console.log(`   Error: ${img.error}\n`);
      });
    } else {
      console.log('\n\n✅ All images loaded successfully!');
    }
    
    expect(brokenImages.length).toBe(0);
  });

  test('Home page images should load from Cloudinary', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Check for Cloudinary URLs
    const images = await page.locator('img').all();
    let cloudinaryCount = 0;
    let localCount = 0;
    
    for (const img of images) {
      const src = await img.getAttribute('src');
      if (!src) continue;
      
      if (src.includes('cloudinary.com')) {
        cloudinaryCount++;
      } else if (src.startsWith('/images/') || src.includes('/images/')) {
        localCount++;
        console.log(`⚠️ Local image found: ${src}`);
      }
    }
    
    console.log(`\n📊 Home Page Image Stats:`);
    console.log(`   Cloudinary: ${cloudinaryCount}`);
    console.log(`   Local /images/: ${localCount}`);
    
    // Should have no local images (except maybe SVGs)
    expect(localCount).toBe(0);
  });

  test('No 404 errors for images across site', async ({ page }) => {
    const failedRequests: string[] = [];
    
    // Listen for failed requests
    page.on('response', response => {
      const url = response.url();
      if (response.status() >= 400 && (
        url.includes('.jpg') || 
        url.includes('.jpeg') || 
        url.includes('.png') || 
        url.includes('.webp')
      )) {
        failedRequests.push(`${response.status()}: ${url}`);
      }
    });
    
    for (const pageInfo of PAGES_TO_AUDIT) {
      await page.goto(pageInfo.url, { waitUntil: 'networkidle' });
    }
    
    if (failedRequests.length > 0) {
      console.log('\n❌ Failed image requests:');
      failedRequests.forEach(r => console.log(`   ${r}`));
    }
    
    expect(failedRequests.length).toBe(0);
  });

  test('Trip assurance section images load correctly', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Wait for the Trip assurance section
    const section = page.locator('text=Trip assurance highlights').first();
    await expect(section).toBeVisible({ timeout: 10000 });
    
    // Find the carousel/slider images in this section
    const carouselImages = await page.locator('img[alt*="KashiTaxi"], img[alt*="driver"], img[alt*="taxi"]').all();
    
    console.log(`\n📸 Trip Assurance Section: Found ${carouselImages.length} images`);
    
    let loadedCount = 0;
    for (const img of carouselImages) {
      const src = await img.getAttribute('src');
      const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
      
      if (naturalWidth > 0) {
        loadedCount++;
        console.log(`   ✅ Loaded: ${src?.substring(0, 60)}...`);
      } else {
        console.log(`   ❌ Failed: ${src?.substring(0, 60)}...`);
      }
    }
    
    expect(loadedCount).toBeGreaterThan(0);
  });
});

test.describe('Specific Image Spot Checks', () => {
  
  test('Ganga Aarti page featured image loads', async ({ page }) => {
    await page.goto('/en/dashashwamedh-ghat-ganga-aarti-timing', { waitUntil: 'networkidle' });
    
    // Check for featured/hero image
    const heroImage = page.locator('img').first();
    await expect(heroImage).toBeVisible();
    
    const src = await heroImage.getAttribute('src');
    console.log(`Featured image src: ${src}`);
    
    expect(src).toContain('cloudinary.com');
  });

  test('Pink Taxi page images load', async ({ page }) => {
    await page.goto('/pink-taxi-varanasi', { waitUntil: 'networkidle' });
    
    const images = await page.locator('img').all();
    let loaded = 0;
    
    for (const img of images) {
      const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
      if (naturalWidth > 0) loaded++;
    }
    
    console.log(`Pink Taxi: ${loaded}/${images.length} images loaded`);
    expect(loaded).toBe(images.length);
  });

  test('Outstation rates page images load', async ({ page }) => {
    await page.goto('/rates/outstation-taxi-varanasi', { waitUntil: 'networkidle' });
    
    const images = await page.locator('img').all();
    let loaded = 0;
    let broken: string[] = [];
    
    for (const img of images) {
      const src = await img.getAttribute('src');
      const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
      if (naturalWidth > 0) {
        loaded++;
      } else if (src) {
        broken.push(src);
      }
    }
    
    console.log(`Outstation Rates: ${loaded}/${images.length} images loaded`);
    if (broken.length > 0) {
      console.log('Broken:', broken);
    }
    
    expect(broken.length).toBe(0);
  });
});
