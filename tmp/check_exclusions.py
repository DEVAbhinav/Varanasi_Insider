done = {
    "varanasi-to-ayodhya",
    "varanasi-to-prayagraj",
    "varanasi-to-nepal-taxi",
    "tempo-traveller-varanasi",
    "varanasi-airport-taxi-price-guide",
    "sarnath-timing-visit-guide",
    "sarnath-complete-guide",
    "varanasi-in-april",
    "tourist-spots-varanasi",
    "ashoka-pillar-sarnath-guide",
    "varanasi-airport-to-manikarnika-distance",
    "varanasi-airport-to-sarnath-distance",
    "dashashwamedh-ghat-ganga-aarti-timing",
    "malaiyo-varanasi-guide",
}

test_urls = [
    "/en/varanasi-to-ayodhya-taxi",
    "/en/varanasi-to-prayagraj-taxi",
    "/en/city/prayagraj/taxi/varanasi-to-prayagraj-taxi",
    "/en/varanasi-to-prayagraj",
    "/en/travel-from-varanasi-to-vindhyachal",
    "/en/varanasi-travel-agent",
    "/en/city/varanasi/shopping/banarasi-silk-saree-shopping-varanasi-2025",
    "/en/luxury-maharaja-tempo-traveller-varanasi",
    "/en/packages",
    "/en/varanasi-to-allahabad-taxi",
]

for url in test_urls:
    excluded = any(d in url for d in done)
    tag = "EXCLUDED" if excluded else "MISSED  "
    print(f"{tag}: {url}")
    if excluded:
        for d in done:
            if d in url:
                print(f"  -> matched by: {d}")
