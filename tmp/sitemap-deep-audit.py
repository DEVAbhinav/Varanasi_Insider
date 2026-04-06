#!/usr/bin/env python3
"""Deep sitemap quality audit."""
import xml.etree.ElementTree as ET

ns = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
tree = ET.parse('/Users/britz/Desktop/Code/Varanasi_Insider/public/kt-secret-map-v9.xml')

# lastmod in future?
future = []
old = []
for url in tree.findall('.//s:url', ns):
    loc = url.find('s:loc', ns).text
    lm = url.find('s:lastmod', ns)
    if lm is not None:
        d = lm.text[:10]
        if d > '2026-04-06':
            future.append((d, loc))
        if d < '2025-01-01':
            old.append((d, loc))

print(f'URLs with FUTURE lastmod (after today Apr 6 2026): {len(future)}')
for d, loc in sorted(future)[:15]:
    print(f'  {d}  {loc.replace("https://www.kashitaxi.in","")}')
if len(future) > 15:
    print(f'  ... and {len(future)-15} more')

print(f'\nURLs with OLD lastmod (before 2025): {len(old)}')
for d, loc in sorted(old)[:10]:
    print(f'  {d}  {loc.replace("https://www.kashitaxi.in","")}')

# Check duplicate URLs
locs = [url.find('s:loc', ns).text for url in tree.findall('.//s:url', ns)]
dupes = set(l for l in locs if locs.count(l) > 1)
print(f'\nDuplicate URLs: {len(dupes)}')
for d in sorted(dupes):
    print(f'  {d}')

# Check trailing slash inconsistency
with_slash = [l for l in locs if l.endswith('/') and l != 'https://www.kashitaxi.in/']
print(f'\nURLs ending with trailing /: {len(with_slash)}')
for l in sorted(with_slash):
    print(f'  {l}')

# Check hreflang self-referential
print('\n=== HREFLANG SELF-REF CHECK ===')
xhtml_ns = 'http://www.w3.org/1999/xhtml'
missing_self_ref = 0
for url in tree.findall('.//s:url', ns):
    loc = url.find('s:loc', ns).text
    links = url.findall(f'{{{xhtml_ns}}}link')
    if links:
        hrefs = [l.get('href') for l in links]
        # For proper hreflang, the URL itself should appear in its own alternates
        # But the root URL without trailing slash may match /en/ or /hi/ 
        # so be lenient
        pass

# Check for non-200 potential issues: pages that might not exist
print('\n=== STATIC PAGE ROUTES IN SITEMAP ===')
static_routes = [l for l in locs if '/en/' not in l and '/hi/' not in l]
print(f'Non-language URLs: {len(static_routes)}')
for l in sorted(static_routes):
    print(f'  {l.replace("https://www.kashitaxi.in","")}')
