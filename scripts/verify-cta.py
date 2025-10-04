#!/usr/bin/env python3
"""
CTA Verification Script
Checks if CTA components are rendering on live pages
"""

import time
import json
from datetime import datetime

try:
    from selenium import webdriver
    from selenium.webdriver.common.by import By
    from selenium.webdriver.chrome.options import Options
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
except ImportError:
    print("❌ Selenium not installed. Installing now...")
    import subprocess
    subprocess.check_call(['pip3', 'install', 'selenium'])
    print("✅ Selenium installed. Please run the script again.")
    exit(0)

# Test URLs
TEST_URLS = [
    {
        "name": "Homepage",
        "url": "https://www.kashitaxi.in/",
        "expected_cta": True
    },
    {
        "name": "Blog Post - Navratri Guide",
        "url": "https://www.kashitaxi.in/en/navratri-in-vindhyachal-practical-guide",
        "expected_cta": True
    },
    {
        "name": "Blog Post - Safety Guide",
        "url": "https://www.kashitaxi.in/en/is-varanasi-safe-for-solo-female-travellers",
        "expected_cta": True
    },
    {
        "name": "Service Page - Airport Taxi",
        "url": "https://www.kashitaxi.in/en/services/varanasi-airport-taxi-winter-2025",
        "expected_cta": True
    },
    {
        "name": "Service Page - City Tour",
        "url": "https://www.kashitaxi.in/en/services/varanasi-full-day-city-tour-winter-2025",
        "expected_cta": True
    },
    {
        "name": "Blog Post - Dev Deepawali",
        "url": "https://www.kashitaxi.in/en/dev-deepawali-2025-varanasi-ultimate-guide",
        "expected_cta": True
    }
]

def setup_driver():
    """Setup Chrome driver with headless options"""
    chrome_options = Options()
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('--window-size=1920,1080')
    chrome_options.add_argument('--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36')
    
    try:
        driver = webdriver.Chrome(options=chrome_options)
        return driver
    except Exception as e:
        print(f"❌ Error setting up Chrome driver: {e}")
        print("\n💡 Install ChromeDriver:")
        print("   brew install chromedriver")
        print("   or download from: https://chromedriver.chromium.org/")
        return None

def check_cta_presence(driver, url, page_name):
    """Check if CTA elements are present on the page"""
    result = {
        "page": page_name,
        "url": url,
        "timestamp": datetime.now().isoformat(),
        "cta_found": False,
        "call_button": False,
        "whatsapp_button": False,
        "cta_text": None,
        "sticky_cta": False,
        "sticky_visible_on_scroll": False,
        "error": None
    }
    
    try:
        print(f"\n🔍 Checking: {page_name}")
        print(f"   URL: {url}")
        
        driver.get(url)
        time.sleep(3)  # Wait for page to load
        
        # Check for various CTA selectors
        cta_selectors = [
            # Modular CTA component selectors
            "//section[contains(@class, 'bg-gradient-to-r') and contains(@class, 'from-yellow-500')]",
            "//h3[contains(text(), 'Need help') or contains(text(), 'Ready to book')]",
            "//a[contains(@href, 'tel:')]",
            "//a[contains(@href, 'wa.me')]",
            # Old CTA selectors
            "//section[contains(@class, 'cta')]",
            "//div[contains(@class, 'call-to-action')]"
        ]
        
        cta_found = False
        for selector in cta_selectors:
            try:
                elements = driver.find_elements(By.XPATH, selector)
                if elements:
                    cta_found = True
                    break
            except:
                continue
        
        result["cta_found"] = cta_found
        
        if cta_found:
            print(f"   ✅ CTA Section Found")
            
            # Check for Call button
            try:
                call_buttons = driver.find_elements(By.XPATH, "//a[contains(@href, 'tel:')]")
                if call_buttons:
                    result["call_button"] = True
                    print(f"   ✅ Call Button Found ({len(call_buttons)} instances)")
                    # Get phone number
                    for btn in call_buttons:
                        href = btn.get_attribute('href')
                        if href:
                            print(f"      📞 {href}")
            except Exception as e:
                print(f"   ⚠️ Error checking call button: {e}")
            
            # Check for WhatsApp button
            try:
                wa_buttons = driver.find_elements(By.XPATH, "//a[contains(@href, 'wa.me') or contains(@href, 'whatsapp')]")
                if wa_buttons:
                    result["whatsapp_button"] = True
                    print(f"   ✅ WhatsApp Button Found ({len(wa_buttons)} instances)")
                    for btn in wa_buttons:
                        href = btn.get_attribute('href')
                        if href:
                            print(f"      💬 {href}")
            except Exception as e:
                print(f"   ⚠️ Error checking WhatsApp button: {e}")
            
            # Get CTA text
            try:
                cta_headings = driver.find_elements(By.XPATH, "//h3[contains(text(), 'Need help') or contains(text(), 'Ready to book') or contains(text(), 'planning')]")
                if cta_headings:
                    result["cta_text"] = cta_headings[0].text
                    print(f"   📝 CTA Text: \"{result['cta_text']}\"")
            except:
                pass
        else:
            print(f"   ❌ No CTA Section Found")
            
            # Debug: Get page source snippet
            try:
                body = driver.find_element(By.TAG_NAME, "body")
                body_text = body.text[:200]
                print(f"   📄 Page body starts with: {body_text}...")
            except:
                pass
        
        # Check for sticky CTA bar (like on service pages)
        print(f"\n   🔍 Checking for Sticky CTA Bar...")
        try:
            # Look for sticky contact bar component
            sticky_selectors = [
                "//div[contains(@class, 'fixed') and contains(@class, 'bottom')]",
                "//div[contains(@class, 'sticky')]",
                "//*[@id='sticky-contact-bar']",
                "//nav[contains(@class, 'fixed')]//a[contains(@href, 'tel:')]"
            ]
            
            sticky_found = False
            for selector in sticky_selectors:
                try:
                    elements = driver.find_elements(By.XPATH, selector)
                    for elem in elements:
                        # Check if element contains phone/whatsapp links
                        html = elem.get_attribute('outerHTML')
                        if 'tel:' in html or 'wa.me' in html:
                            sticky_found = True
                            result["sticky_cta"] = True
                            break
                    if sticky_found:
                        break
                except:
                    continue
            
            if sticky_found:
                print(f"   ✅ Sticky CTA Bar Found")
                
                # Test if it appears on scroll
                print(f"   📜 Testing visibility on scroll...")
                try:
                    # Get initial visibility
                    initial_visible = False
                    sticky_elements = driver.find_elements(By.XPATH, "//div[contains(@class, 'fixed') and contains(@class, 'bottom')]")
                    if sticky_elements:
                        initial_visible = sticky_elements[0].is_displayed()
                    
                    # Scroll down
                    driver.execute_script("window.scrollTo(0, 500);")
                    time.sleep(1)
                    
                    # Check visibility after scroll
                    scrolled_visible = False
                    sticky_elements = driver.find_elements(By.XPATH, "//div[contains(@class, 'fixed') and contains(@class, 'bottom')]")
                    if sticky_elements:
                        scrolled_visible = sticky_elements[0].is_displayed()
                    
                    result["sticky_visible_on_scroll"] = scrolled_visible
                    
                    if scrolled_visible:
                        print(f"   ✅ Sticky bar visible after scrolling")
                    else:
                        print(f"   ⚠️ Sticky bar not visible after scrolling")
                    
                    # Scroll back to top
                    driver.execute_script("window.scrollTo(0, 0);")
                    time.sleep(0.5)
                    
                except Exception as e:
                    print(f"   ⚠️ Error testing scroll behavior: {e}")
            else:
                print(f"   ❌ No Sticky CTA Bar Found")
        except Exception as e:
            print(f"   ⚠️ Error checking sticky CTA: {e}")
        
    except Exception as e:
        result["error"] = str(e)
        print(f"   ❌ Error: {e}")
    
    return result

def main():
    print("=" * 80)
    print("🔍 CTA VERIFICATION TEST")
    print("=" * 80)
    print(f"Testing {len(TEST_URLS)} pages for CTA presence...")
    
    driver = setup_driver()
    if not driver:
        return
    
    results = []
    
    try:
        for test_case in TEST_URLS:
            result = check_cta_presence(driver, test_case["url"], test_case["name"])
            results.append(result)
            time.sleep(2)  # Be nice to the server
        
        # Summary
        print("\n" + "=" * 80)
        print("📊 SUMMARY")
        print("=" * 80)
        
        total = len(results)
        with_cta = sum(1 for r in results if r["cta_found"])
        with_call = sum(1 for r in results if r["call_button"])
        with_wa = sum(1 for r in results if r["whatsapp_button"])
        with_sticky = sum(1 for r in results if r.get("sticky_cta", False))
        sticky_works = sum(1 for r in results if r.get("sticky_visible_on_scroll", False))
        
        print(f"\n📈 Overall Statistics:")
        print(f"   Total Pages Tested: {total}")
        print(f"   Pages with CTA: {with_cta} ({with_cta/total*100:.1f}%)")
        print(f"   Pages with Call Button: {with_call} ({with_call/total*100:.1f}%)")
        print(f"   Pages with WhatsApp: {with_wa} ({with_wa/total*100:.1f}%)")
        print(f"   Pages with Sticky CTA: {with_sticky} ({with_sticky/total*100:.1f}%)")
        print(f"   Sticky CTAs Working on Scroll: {sticky_works} ({sticky_works/total*100:.1f}%)")
        
        print(f"\n📋 Detailed Results:")
        for r in results:
            status = "✅" if r["cta_found"] else "❌"
            print(f"\n{status} {r['page']}")
            print(f"   CTA: {'Yes' if r['cta_found'] else 'No'}")
            print(f"   Call: {'Yes' if r['call_button'] else 'No'}")
            print(f"   WhatsApp: {'Yes' if r['whatsapp_button'] else 'No'}")
            print(f"   Sticky Bar: {'Yes' if r.get('sticky_cta', False) else 'No'}")
            print(f"   Sticky on Scroll: {'Yes' if r.get('sticky_visible_on_scroll', False) else 'No'}")
            if r["error"]:
                print(f"   Error: {r['error']}")
        
        # Save results to file
        output_file = "cta-verification-results.json"
        with open(output_file, 'w') as f:
            json.dump({
                "timestamp": datetime.now().isoformat(),
                "summary": {
                    "total": total,
                    "with_cta": with_cta,
                    "with_call_button": with_call,
                    "with_whatsapp": with_wa,
                    "with_sticky_cta": with_sticky,
                    "sticky_works_on_scroll": sticky_works
                },
                "results": results
            }, f, indent=2)
        
        print(f"\n💾 Results saved to: {output_file}")
        
        # Final verdict
        if with_cta == total:
            print("\n🎉 SUCCESS! All tested pages have CTAs!")
        else:
            print(f"\n⚠️ WARNING! {total - with_cta} page(s) missing CTAs!")
        
    finally:
        driver.quit()
        print("\n✅ Browser closed")

if __name__ == "__main__":
    main()
