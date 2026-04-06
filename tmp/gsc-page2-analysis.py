#!/usr/bin/env python3
"""
GSC Page 2-10 Bump-Up Analysis
Find pages ranking position 11-100 with high impressions that can realistically move to page 1.
"""
import csv
import os
import re
import json
from pathlib import Path
from collections import defaultdict

GSC_DIR = "/Users/britz/Downloads/kashitaxi.in-Performance-on-Search-2026-04-03"
CONTENT_DIR = "/Users/britz/Desktop/Code/Varanasi_Insider/content"

def parse_pct(s):
    return float(s.replace('%','')) if s else 0

def parse_num(s):
    return float(s.replace(',','')) if s else 0

# ── Load Pages CSV ──
pages = []
with open(f"{GSC_DIR}/Pages.csv") as f:
    reader = csv.DictReader(f)
    for row in reader:
        url = row['Top pages']
        clicks = int(parse_num(row['Clicks']))
        impressions = int(parse_num(row['Impressions']))
        ctr = parse_pct(row['CTR'])
        position = float(row['Position'])
        pages.append({
            'url': url,
            'clicks': clicks,
            'impressions': impressions,
            'ctr': ctr,
            'position': position,
        })

# ── Load Queries CSV ──
queries = []
with open(f"{GSC_DIR}/Queries.csv") as f:
    reader = csv.DictReader(f)
    for row in reader:
        query = row['Top queries']
        clicks = int(parse_num(row['Clicks']))
        impressions = int(parse_num(row['Impressions']))
        ctr = parse_pct(row['CTR'])
        position = float(row['Position'])
        queries.append({
            'query': query,
            'clicks': clicks,
            'impressions': impressions,
            'ctr': ctr,
            'position': position,
        })

# ── Filter pages at position 11-100 (page 2-10) ──
page2_10 = [p for p in pages if 11 <= p['position'] <= 100]
# Sort by impressions descending (highest opportunity first)
page2_10.sort(key=lambda x: x['impressions'], reverse=True)

print("=" * 100)
print("GSC PAGE 2-10 ANALYSIS — Bump-Up Candidates")
print(f"Total pages in GSC: {len(pages)}")
print(f"Pages at position 11-100: {len(page2_10)}")
print(f"Total impressions in page 2-10: {sum(p['impressions'] for p in page2_10):,}")
print("=" * 100)

# ── Also identify "striking distance" pages (position 8-20) — easiest to bump ──
striking = [p for p in pages if 8 <= p['position'] <= 20]
striking.sort(key=lambda x: x['impressions'], reverse=True)

print("\n")
print("━" * 100)
print("TIER 1: STRIKING DISTANCE (Position 8-20) — Easiest to bump to page 1")
print("━" * 100)
print(f"{'Pos':>5} {'Imp':>8} {'Clicks':>7} {'CTR':>6}  URL")
print("-" * 100)
for p in striking[:40]:
    short = p['url'].replace('https://www.kashitaxi.in', '')
    print(f"{p['position']:5.1f} {p['impressions']:>8,} {p['clicks']:>7,} {p['ctr']:>5.1f}%  {short}")


# ── Tier 2: High impression pages stuck deeper (position 20-50) ──
deep = [p for p in pages if 20 < p['position'] <= 50 and p['impressions'] >= 100]
deep.sort(key=lambda x: x['impressions'], reverse=True)

print("\n")
print("━" * 100)
print("TIER 2: HIGH-IMPRESSION PAGES STUCK DEEPER (Position 20-50, 100+ imp)")
print("━" * 100)
print(f"{'Pos':>5} {'Imp':>8} {'Clicks':>7} {'CTR':>6}  URL")
print("-" * 100)
for p in deep[:30]:
    short = p['url'].replace('https://www.kashitaxi.in', '')
    print(f"{p['position']:5.1f} {p['impressions']:>8,} {p['clicks']:>7,} {p['ctr']:>5.1f}%  {short}")


# ── Tier 3: Position 50+ with notable impressions ──
far = [p for p in pages if p['position'] > 50 and p['impressions'] >= 50]
far.sort(key=lambda x: x['impressions'], reverse=True)

if far:
    print("\n")
    print("━" * 100)
    print("TIER 3: FAR BACK (Position 50+) with 50+ impressions")
    print("━" * 100)
    print(f"{'Pos':>5} {'Imp':>8} {'Clicks':>7} {'CTR':>6}  URL")
    print("-" * 100)
    for p in far[:20]:
        short = p['url'].replace('https://www.kashitaxi.in', '')
        print(f"{p['position']:5.1f} {p['impressions']:>8,} {p['clicks']:>7,} {p['ctr']:>5.1f}%  {short}")


# ── Query analysis: find high-impression queries at position 8-20 ──
striking_queries = [q for q in queries if 8 <= q['position'] <= 20]
striking_queries.sort(key=lambda x: x['impressions'], reverse=True)

print("\n")
print("━" * 100)
print("TOP STRIKING-DISTANCE QUERIES (Position 8-20) — What people search")
print("━" * 100)
print(f"{'Pos':>5} {'Imp':>8} {'Clicks':>7} {'CTR':>6}  Query")
print("-" * 100)
for q in striking_queries[:40]:
    print(f"{q['position']:5.1f} {q['impressions']:>8,} {q['clicks']:>7,} {q['ctr']:>5.1f}%  {q['query']}")

# ── Query analysis: high-impression queries at position 20-50 ──
mid_queries = [q for q in queries if 20 < q['position'] <= 50 and q['impressions'] >= 100]
mid_queries.sort(key=lambda x: x['impressions'], reverse=True)

print("\n")
print("━" * 100)
print("HIGH-IMPRESSION QUERIES AT POSITION 20-50")
print("━" * 100)
print(f"{'Pos':>5} {'Imp':>8} {'Clicks':>7} {'CTR':>6}  Query")
print("-" * 100)
for q in mid_queries[:30]:
    print(f"{q['position']:5.1f} {q['impressions']:>8,} {q['clicks']:>7,} {q['ctr']:>5.1f}%  {q['query']}")


# ── Cross-reference: check which page-2 URLs have local content files ──
print("\n")
print("━" * 100)
print("CONTENT FILE CHECK — Do page 2-10 URLs have local .md files?")
print("━" * 100)

# Gather all .md files
all_md = []
for root, dirs, files in os.walk(CONTENT_DIR):
    for f in files:
        if f.endswith('.md'):
            all_md.append(os.path.join(root, f))

# Build slug -> filepath map
slug_to_file = {}
for fp in all_md:
    slug = Path(fp).stem  # filename without .md
    slug_to_file[slug] = fp

missing = []
found = []
for p in page2_10[:50]:
    url = p['url'].replace('https://www.kashitaxi.in', '')
    # Extract the last path segment as the slug
    slug = url.rstrip('/').split('/')[-1]
    if slug in slug_to_file:
        found.append((p, slug_to_file[slug]))
    else:
        missing.append((p, slug))

print(f"\nFound local content: {len(found)}/{len(page2_10[:50])}")
print(f"Missing local content: {len(missing)}/{len(page2_10[:50])}")

if missing:
    print("\nMissing content files (these URLs appear in GSC but have no .md):")
    for p, slug in missing[:15]:
        short = p['url'].replace('https://www.kashitaxi.in', '')
        print(f"  pos {p['position']:5.1f} | {p['impressions']:>6,} imp | {short}  (slug: {slug})")


# ── Priority scoring ──
print("\n")
print("━" * 100)
print("PRIORITY SCORE — Weighted ranking for bump-up potential")
print("━" * 100)
print("Score = impressions × (1 / position_distance_from_10) — higher = more opportunity")
print()

scored = []
for p in page2_10:
    # Pages closer to position 10 with more impressions are higher priority
    dist_from_10 = max(p['position'] - 10, 1)
    score = p['impressions'] / dist_from_10
    scored.append({**p, 'score': score})

scored.sort(key=lambda x: x['score'], reverse=True)

print(f"{'Score':>8} {'Pos':>5} {'Imp':>8} {'Clicks':>7} {'CTR':>6}  URL")
print("-" * 100)
for s in scored[:30]:
    short = s['url'].replace('https://www.kashitaxi.in', '')
    print(f"{s['score']:>8.0f} {s['position']:5.1f} {s['impressions']:>8,} {s['clicks']:>7,} {s['ctr']:>5.1f}%  {short}")


# ── Content depth check for top candidates ──
print("\n")
print("━" * 100)
print("CONTENT DEPTH CHECK — Word count of top 20 candidates")
print("━" * 100)

for s in scored[:20]:
    url = s['url'].replace('https://www.kashitaxi.in', '')
    slug = url.rstrip('/').split('/')[-1]
    if slug in slug_to_file:
        fp = slug_to_file[slug]
        with open(fp) as f:
            content = f.read()
        # Count words (excluding frontmatter)
        parts = content.split('---', 2)
        body = parts[2] if len(parts) >= 3 else content
        word_count = len(body.split())
        
        # Check for faqSchema
        has_faq = 'faqSchema' in content or 'FAQPage' in content
        # Check for schema 
        has_schema = 'schema' in content.lower()
        
        rel_path = fp.replace(CONTENT_DIR + '/', '')
        status = []
        if has_faq: status.append("FAQ✓")
        if has_schema: status.append("Schema✓")
        if word_count < 500: status.append("⚠️ THIN")
        elif word_count < 1000: status.append("🔶 SHORT")
        
        print(f"  pos {s['position']:5.1f} | {s['impressions']:>6,} imp | {word_count:>5} words | {' '.join(status):20s} | {rel_path}")
    else:
        short = s['url'].replace('https://www.kashitaxi.in', '')
        print(f"  pos {s['position']:5.1f} | {s['impressions']:>6,} imp | {'N/A':>5} words | {'NO FILE':20s} | {short}")

print("\n" + "=" * 100)
print("ANALYSIS COMPLETE")
print("=" * 100)
