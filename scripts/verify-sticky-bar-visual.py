#!/usr/bin/env python3
"""
Visual verification script for StickyContactBar component
Captures screenshots of the sticky bar on different page types
"""

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
import time
import os

# Configuration
BASE_URL = "http://localhost:3000"
SCREENSHOT_DIR = "tmp/sticky-bar-screenshots"

# Ensure screenshot directory exists
os.makedirs(SCREENSHOT_DIR, exist_ok=True)

# Test pages
TEST_PAGES = [
    {
        "name": "Homepage",
        "url": f"{BASE_URL}/",
        "variant": "simple",
        "scroll_amount": 500
    },
    {
        "name": "Blog Post (Spiritual)",
        "url": f"{BASE_URL}/en/dev-deepawali-2025-varanasi-ultimate-guide",
        "variant": "spiritual",
        "scroll_amount": 800
    },
    {
        "name": "Service Page",
        "url": f"{BASE_URL}/en/services/airport-taxi-service-varanasi",
        "variant": "service",
        "scroll_amount": 800
    }
]

def setup_driver(width=1920, height=1080):
    """Setup Chrome driver with options"""
    chrome_options = Options()
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    chrome_options.add_argument(f'--window-size={width},{height}')
    
    driver = webdriver.Chrome(options=chrome_options)
    return driver

def capture_sticky_bar(driver, page_info, device="desktop"):
    """Capture screenshots of sticky bar in different states"""
    url = page_info["url"]
    name = page_info["name"]
    variant = page_info["variant"]
    scroll_amount = page_info["scroll_amount"]
    
    print(f"\n{'='*60}")
    print(f"Testing: {name} ({device})")
    print(f"URL: {url}")
    print(f"Expected variant: {variant}")
    print(f"{'='*60}")
    
    try:
        # Load page
        driver.get(url)
        time.sleep(3)  # Wait for page to load
        
        # Screenshot 1: Before scroll (sticky bar should be hidden)
        screenshot_path = f"{SCREENSHOT_DIR}/{name.lower().replace(' ', '-')}-{device}-before-scroll.png"
        driver.save_screenshot(screenshot_path)
        print(f"✅ Screenshot saved: {screenshot_path}")
        
        # Scroll down to trigger sticky bar
        driver.execute_script(f"window.scrollTo(0, {scroll_amount});")
        time.sleep(2)  # Wait for animation
        
        # Screenshot 2: After scroll (sticky bar should be visible)
        screenshot_path = f"{SCREENSHOT_DIR}/{name.lower().replace(' ', '-')}-{device}-after-scroll.png"
        driver.save_screenshot(screenshot_path)
        print(f"✅ Screenshot saved: {screenshot_path}")
        
        # Check if sticky bar is visible
        try:
            if device == "desktop":
                # Desktop sticky bar
                sticky_bar = driver.find_element(By.CSS_SELECTOR, ".fixed.bottom-0.left-0.right-0")
                is_visible = sticky_bar.is_displayed()
                
                # Get computed styles
                bg_color = driver.execute_script(
                    "return window.getComputedStyle(arguments[0]).background;",
                    sticky_bar
                )
                
                print(f"✅ Sticky bar visible: {is_visible}")
                print(f"📊 Background: {bg_color[:100]}...")
                
            else:
                # Mobile floating buttons
                floating_buttons = driver.find_elements(By.CSS_SELECTOR, ".fixed.bottom-6.right-4")
                is_visible = len(floating_buttons) > 0 and floating_buttons[0].is_displayed()
                print(f"✅ Floating buttons visible: {is_visible}")
                
        except Exception as e:
            print(f"⚠️  Could not find sticky bar element: {str(e)}")
        
        # Screenshot 3: Hover state (desktop only)
        if device == "desktop":
            try:
                call_button = driver.find_element(By.CSS_SELECTOR, "a[href^='tel:']")
                driver.execute_script("arguments[0].scrollIntoView(true);", call_button)
                time.sleep(1)
                
                screenshot_path = f"{SCREENSHOT_DIR}/{name.lower().replace(' ', '-')}-{device}-hover-focus.png"
                driver.save_screenshot(screenshot_path)
                print(f"✅ Screenshot saved (with focus): {screenshot_path}")
            except Exception as e:
                print(f"⚠️  Could not capture hover state: {str(e)}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error testing {name}: {str(e)}")
        return False

def main():
    print("🚀 Starting Sticky Bar Visual Verification")
    print(f"Base URL: {BASE_URL}")
    print(f"Screenshots will be saved to: {SCREENSHOT_DIR}")
    
    results = {
        "desktop": {"passed": 0, "failed": 0},
        "mobile": {"passed": 0, "failed": 0}
    }
    
    # Test Desktop view (1920x1080)
    print("\n" + "="*60)
    print("TESTING DESKTOP VIEW (1920x1080)")
    print("="*60)
    
    driver_desktop = setup_driver(1920, 1080)
    
    try:
        for page in TEST_PAGES:
            success = capture_sticky_bar(driver_desktop, page, "desktop")
            if success:
                results["desktop"]["passed"] += 1
            else:
                results["desktop"]["failed"] += 1
    finally:
        driver_desktop.quit()
    
    # Test Mobile view (375x812 - iPhone X)
    print("\n" + "="*60)
    print("TESTING MOBILE VIEW (375x812)")
    print("="*60)
    
    driver_mobile = setup_driver(375, 812)
    
    try:
        for page in TEST_PAGES:
            success = capture_sticky_bar(driver_mobile, page, "mobile")
            if success:
                results["mobile"]["passed"] += 1
            else:
                results["mobile"]["failed"] += 1
    finally:
        driver_mobile.quit()
    
    # Summary
    print("\n" + "="*60)
    print("VISUAL VERIFICATION SUMMARY")
    print("="*60)
    print(f"Desktop: {results['desktop']['passed']} passed, {results['desktop']['failed']} failed")
    print(f"Mobile: {results['mobile']['passed']} passed, {results['mobile']['failed']} failed")
    print(f"\n📸 All screenshots saved to: {SCREENSHOT_DIR}/")
    print("\n✅ Visual verification complete!")
    print("\n💡 Next steps:")
    print("   1. Review screenshots in tmp/sticky-bar-screenshots/")
    print("   2. Check for transparency issues")
    print("   3. Verify text readability")
    print("   4. Confirm color scheme matches variant")

if __name__ == "__main__":
    main()
