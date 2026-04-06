#!/usr/bin/env python3
"""Audit sitemap vs content files."""
import glob, os, re

BASE = '/Users/britz/Desktop/Code/Varanasi_Insider/content/en'
SITEMAP = open('/tmp/sitemap-urls.txt').read()

missing_files = [
    'OKR.md',
    'destinations/README.md',
    'destinations/allahabad/taxi/varanasi-to-allahabad-taxi.md',
    'destinations/ayodhya/tour-packages/ayodhya-1n2d-tour.md',
    'destinations/varanasi/taxi/index.md',
    'destinations/varanasi/tour-packages/varanasi-1n2d-tour.md',
    'destinations/varanasi/tour-packages/varanasi-2n3d-tour.md',
    'destinations/varanasi/varanasi-december-2026-experience-hub.md',
    'destinations/varanasi/varanasi-january-weather-travel-guide.md',
    'family-tour-varanasi-3-days-parents.md',
    'ganga-aarti-boat-booking-price.md',
    'guides/best-experience-dev-deepawali-ghat-boat-guide.md',
    'landing/dev-deepawali-taxi-booking-varanasi.md',
    'sunrise-boat-ride-ganges.md',
    'travel-from-varanasi-to-vindhyachal-guide.md',
    'varanasi-to-allahabad-tempo-traveller.md',
]

for f in missing_files:
    full = os.path.join(BASE, f)
    if not os.path.exists(full):
        print(f'FILE NOT FOUND: {f}')
        continue
    with open(full) as fh:
        raw = fh.read()
    
    canonical = slug_val = published = redirect = ''
    wc = len(raw.split())
    
    if raw.startswith('---'):
        parts = raw.split('---', 2)
        if len(parts) >= 3:
            fm = parts[1]
            for line in fm.split('\n'):
                l = line.strip()
                if l.startswith('canonical:'): canonical = l
                if l.startswith('published:'): published = l
                if l.startswith('slug:'): slug_val = l
                if l.startswith('redirect:'): redirect = l
    
    reason = ''
    basename = os.path.basename(f).replace('.md','')
    
    if basename in ('OKR', 'README', 'index'):
        reason = 'NOT A PAGE (internal/index file)'
    elif canonical:
        reason = f'CANONICAL REDIRECT -> {canonical}'
    elif redirect:
        reason = f'REDIRECT -> {redirect}'
    elif published == 'published: false':
        reason = 'UNPUBLISHED'
    elif 'destinations/varanasi/varanasi-' in f:
        reason = 'STRUCTURAL: file is directly under destinations/varanasi/ (no category subfolder)'
    else:
        reason = 'GENUINE MISSING - should be in sitemap'
    
    print(f'\n{f} ({wc} words)')
    if canonical: print(f'  {canonical}')
    if published: print(f'  {published}')
    if slug_val: print(f'  {slug_val}')
    if redirect: print(f'  {redirect}')
    print(f'  -> {reason}')

# Also check hreflang coverage
print('\n\n=== HREFLANG AUDIT ===')
en_slugs = set()
hi_slugs = set()
for line in SITEMAP.strip().split('\n'):
    url = line.strip()
    if '/en/' in url:
        en_slugs.add(url.replace('https://www.kashitaxi.in/en/', ''))
    elif '/hi/' in url:
        hi_slugs.add(url.replace('https://www.kashitaxi.in/hi/', ''))

en_only = en_slugs - hi_slugs
hi_only = hi_slugs - en_slugs

print(f'\nEN-only pages (no Hindi version): {len(en_only)}')
for s in sorted(en_only)[:20]:
    print(f'  /en/{s}')
if len(en_only) > 20:
    print(f'  ... and {len(en_only)-20} more')

print(f'\nHI-only pages (no English version): {len(hi_only)}')
for s in sorted(hi_only):
    print(f'  /hi/{s}')

# Check priority distribution
print('\n\n=== PRIORITY AUDIT ===')
import xml.etree.ElementTree as ET
tree = ET.parse('/Users/britz/Desktop/Code/Varanasi_Insider/public/kt-secret-map-v9.xml')
ns = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
priorities = {}
for url in tree.findall('.//s:url', ns):
    p = url.find('s:priority', ns)
    if p is not None:
        pv = p.text
        priorities[pv] = priorities.get(pv, 0) + 1

for p in sorted(priorities.keys(), reverse=True):
    print(f'  priority {p}: {priorities[p]} URLs')

# Check lastmod freshness
print('\n=== LASTMOD AUDIT ===')
dates = {}
for url in tree.findall('.//s:url', ns):
    lm = url.find('s:lastmod', ns)
    if lm is not None:
        d = lm.text[:10]
        dates[d] = dates.get(d, 0) + 1
for d in sorted(dates.keys(), reverse=True)[:5]:
    print(f'  {d}: {dates[d]} URLs')
if len(dates) > 5:
    print(f'  ... {len(dates)} distinct dates total')
