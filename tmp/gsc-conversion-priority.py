#!/usr/bin/env python3
"""
GSC Page 2-10 — Prioritized by SALES CONVERSION potential.
Taxi bookings > Tour packages > Boat rides > Pilgrimage services > Tempo/bus > Info pages
"""
import csv, os, re
from pathlib import Path

GSC_DIR = "/Users/britz/Downloads/kashitaxi.in-Performance-on-Search-2026-04-03"

# ── Conversion tier mapping ──
# Tier 1: Direct taxi booking (highest $)
# Tier 2: Tour packages (high $, multi-day)
# Tier 3: Tempo traveller / group bookings
# Tier 4: Boat rides / specific services
# Tier 5: Pilgrimage / spiritual services
# Tier 6: Bike rentals
# Tier 7: Info / guides (lowest conversion but builds funnel)

def classify_conversion_tier(url):
    path = url.replace('https://www.kashitaxi.in', '').replace('http://www.kashitaxi.in', '')
    p = path.lower()

    # Tier 1: Taxi routes (direct booking intent)
    if any(x in p for x in ['/taxi/', 'taxi-service', 'taxi-price', 'taxi-fare', 'taxi-cost',
                              'taxi-guide', 'taxi-rate',
                              '-to-ayodhya', '-to-prayagraj', '-to-gaya', '-to-lucknow',
                              '-to-nepal', '-to-allahabad', '-to-chitrakoot',
                              '-to-mughalsarai', '-to-bodhgaya', '-to-mirzapur',
                              'airport-taxi', 'airport-transfer', 'cab-service',
                              '-to-gorakhpur', '-to-ghazipur', '-to-deoria',
                              'taxi-varanasi', 'outstation']):
        # Sub-rank: airport transfer > outstation > route pages
        if 'airport' in p:
            return (1, 'TAXI-AIRPORT', 1.5)  # tier, label, revenue_multiplier
        if any(x in p for x in ['outstation', 'rate', 'price', 'fare', 'cost']):
            return (1, 'TAXI-RATES', 1.3)
        return (1, 'TAXI-ROUTE', 1.0)

    # Tier 2: Tour packages
    if any(x in p for x in ['tour-package', 'tour-packages', '/packages', 'kasi-tour',
                              'banaras-tour', 'day-tour', '1n2d', '2n3d', '3-day', '2-day',
                              'pilgrimage-taxi', 'yatra']):
        if 'pilgrimage' in p or 'yatra' in p:
            return (2, 'PILGRIMAGE-PKG', 1.4)
        return (2, 'TOUR-PACKAGE', 1.2)

    # Tier 3: Tempo traveller / group bookings (high ticket)
    if any(x in p for x in ['tempo-traveller', 'tempo', 'group-booking']):
        return (3, 'TEMPO-GROUP', 1.5)

    # Tier 4: Boat rides / specific experiences
    if any(x in p for x in ['boat-ride', 'boat', 'ganga-aarti', 'sunrise-boat']):
        return (4, 'BOAT-EXPERIENCE', 0.8)

    # Tier 5: Bike rentals
    if any(x in p for x in ['bike-rental', 'scooty', 'bike-rent']):
        return (5, 'BIKE-RENTAL', 0.6)

    # Tier 6: Service / booking pages
    if any(x in p for x in ['/services', '/booking', 'travel-agent', 'full-day-city-tour',
                              'pink-taxi']):
        return (6, 'SERVICE-PAGE', 1.0)

    # Tier 7: Shopping / food (indirect conversion)
    if any(x in p for x in ['shopping', 'saree', 'silk', 'food', 'malaiyo']):
        return (7, 'SHOPPING-FOOD', 0.4)

    # Tier 8: Sightseeing / guides (funnel top)
    if any(x in p for x in ['sightseeing', 'ghat', 'temple', 'guide', 'timing',
                              'distance', 'sarnath', 'ashoka', 'december', 'april',
                              'shivaratri', 'dev-deepawali', 'ramlila', 'dussehra',
                              'safe', 'music', 'heritage']):
        return (8, 'INFO-GUIDE', 0.3)

    # Default: general info
    return (9, 'OTHER', 0.2)


# ── Load Pages CSV ──
pages = []
with open(f"{GSC_DIR}/Pages.csv") as f:
    reader = csv.DictReader(f)
    for row in reader:
        url = row['Top pages']
        clicks = int(float(row['Clicks'].replace(',','')))
        impressions = int(float(row['Impressions'].replace(',','')))
        ctr = float(row['CTR'].replace('%',''))
        position = float(row['Position'])
        pages.append({
            'url': url, 'clicks': clicks, 'impressions': impressions,
            'ctr': ctr, 'position': position,
        })

# ── Load Queries CSV ──
queries = []
with open(f"{GSC_DIR}/Queries.csv") as f:
    reader = csv.DictReader(f)
    for row in reader:
        queries.append({
            'query': row['Top queries'],
            'clicks': int(float(row['Clicks'].replace(',',''))),
            'impressions': int(float(row['Impressions'].replace(',',''))),
            'ctr': float(row['CTR'].replace('%','')),
            'position': float(row['Position']),
        })

# ── Filter: position >= 8 (page 2+, plus borderline page 1 that could improve) ──
candidates = [p for p in pages if p['position'] >= 8]

# ── Score each page ──
scored = []
for p in candidates:
    tier, label, rev_mult = classify_conversion_tier(p['url'])
    
    # Composite score:
    # - Higher impressions = more opportunity
    # - Closer to page 1 = easier to push
    # - Higher conversion tier = more revenue per click
    # - Revenue multiplier amplifies high-ticket items
    
    dist_from_page1 = max(p['position'] - 10, 0.5)
    proximity_score = 1.0 / dist_from_page1  # closer = higher
    
    # Revenue-weighted score
    revenue_score = p['impressions'] * proximity_score * rev_mult * (10 - tier + 1)
    
    scored.append({
        **p,
        'tier': tier,
        'label': label,
        'rev_mult': rev_mult,
        'revenue_score': revenue_score,
    })

# Sort by revenue_score descending
scored.sort(key=lambda x: x['revenue_score'], reverse=True)

print("=" * 120)
print("GSC BUMP-UP ANALYSIS — PRIORITIZED BY SALES CONVERSION POTENTIAL")
print("=" * 120)
print(f"Total candidates (pos >= 8): {len(scored)}")
print()
print(f"{'#':>3} {'Score':>9} {'Tier':>3} {'Label':>16} {'Pos':>5} {'Imp':>8} {'Click':>6} {'CTR':>6}  URL")
print("-" * 120)

for i, s in enumerate(scored[:50], 1):
    short = s['url'].replace('https://www.kashitaxi.in', '').replace('http://www.kashitaxi.in', '')
    if not short: short = '/'
    print(f"{i:>3} {s['revenue_score']:>9.0f}  T{s['tier']}  {s['label']:>16} {s['position']:5.1f} {s['impressions']:>8,} {s['clicks']:>6,} {s['ctr']:>5.1f}%  {short}")


# ── Now also show the top converting QUERIES ──
print()
print("=" * 120)
print("TOP 30 BOOKING-INTENT QUERIES (pos 8-25)")
print("=" * 120)

booking_keywords = ['taxi', 'cab', 'fare', 'price', 'cost', 'rent', 'hire', 'book',
                     'tour', 'package', 'tempo', 'traveller', 'boat', 'ride',
                     'किराया', 'भाड़ा', 'बुक', 'टैक्सी', 'कैब',
                     'service', 'transfer', 'pickup', 'drop']

booking_queries = []
for q in queries:
    if 8 <= q['position'] <= 25:
        ql = q['query'].lower()
        if any(kw in ql for kw in booking_keywords):
            booking_queries.append(q)

booking_queries.sort(key=lambda x: x['impressions'], reverse=True)

print(f"{'Pos':>5} {'Imp':>8} {'Click':>6} {'CTR':>6}  Query")
print("-" * 120)
for q in booking_queries[:30]:
    print(f"{q['position']:5.1f} {q['impressions']:>8,} {q['clicks']:>6,} {q['ctr']:>5.1f}%  {q['query']}")


# ── Match queries to pages for the top 15 candidates ──
print()
print("=" * 120)
print("TOP 15 CANDIDATES — MATCHING QUERIES (what drives their impressions)")
print("=" * 120)

for i, s in enumerate(scored[:15], 1):
    short = s['url'].replace('https://www.kashitaxi.in', '').replace('http://www.kashitaxi.in', '')
    if not short: short = '/'
    slug = short.rstrip('/').split('/')[-1]
    
    # Find queries that likely match this page
    slug_words = set(slug.replace('-', ' ').split())
    # Remove very common words
    slug_words -= {'en', 'hi', 'city', 'varanasi', 'the', 'a', 'to', 'from', 'in', 'of', 'guide', '2025', '2026'}
    
    matching_queries = []
    for q in queries:
        ql = q['query'].lower()
        # Check if significant slug words appear in query
        matches = sum(1 for w in slug_words if w in ql)
        if matches >= min(2, len(slug_words)):
            matching_queries.append(q)
    
    matching_queries.sort(key=lambda x: x['impressions'], reverse=True)
    
    print(f"\n{'─'*100}")
    print(f"#{i} [{s['label']}] pos {s['position']:.1f} | {s['impressions']:,} imp | score {s['revenue_score']:.0f}")
    print(f"   {short}")
    if matching_queries[:5]:
        for mq in matching_queries[:5]:
            print(f"   ├─ pos {mq['position']:5.1f} | {mq['impressions']:>6,} imp | {mq['query']}")
    else:
        print(f"   └─ (no direct query matches found — may be long-tail)")
    

print()
print("=" * 120)
print("DONE")
print("=" * 120)
