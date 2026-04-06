#!/usr/bin/env python3
"""
Deep GSC audit for the 5 enriched pages.
Cross-reference every query hitting each page and find gaps.
"""
import csv, os, re
from collections import defaultdict

GSC_DIR = "/Users/britz/Downloads/kashitaxi.in-Performance-on-Search-2026-04-03"
CONTENT_DIR = "/Users/britz/Desktop/Code/Varanasi_Insider/content"

# Target pages
TARGETS = {
    'varanasi-to-ayodhya': {
        'url_patterns': ['varanasi-to-ayodhya', 'varanasi-ayodhya', 'kashi-to-ayodhya', 'kashi-ayodhya'],
        'file': 'content/en/varanasi-to-ayodhya.md',
    },
    'varanasi-to-prayagraj': {
        'url_patterns': ['varanasi-to-prayagraj', 'varanasi-prayagraj', 'varanasi-allahabad', 'kashi-prayagraj'],
        'file': 'content/en/varanasi-to-prayagraj.md',
    },
    'varanasi-to-nepal-taxi': {
        'url_patterns': ['varanasi-to-nepal', 'nepal-taxi', 'sunauli'],
        'file': 'content/en/destinations/nepal/taxi/varanasi-to-nepal-taxi.md',
    },
    'tempo-traveller-varanasi': {
        'url_patterns': ['tempo-traveller-varanasi', 'tempo-varanasi'],
        'file': 'content/en/tempo-traveller-varanasi.md',
    },
    'airport-taxi-price-guide': {
        'url_patterns': ['airport-taxi-price', 'airport-taxi-fare', 'airport-cab', 'airport-pickup'],
        'file': 'content/en/varanasi-airport-taxi-price-guide.md',
    },
}

# Load all queries
queries = []
with open(f"{GSC_DIR}/Queries.csv") as f:
    for row in csv.DictReader(f):
        queries.append({
            'query': row['Top queries'],
            'clicks': int(float(row['Clicks'].replace(',',''))),
            'impressions': int(float(row['Impressions'].replace(',',''))),
            'ctr': float(row['CTR'].replace('%','')),
            'position': float(row['Position']),
        })

# Load all pages
pages = []
with open(f"{GSC_DIR}/Pages.csv") as f:
    for row in csv.DictReader(f):
        pages.append({
            'url': row['Top pages'],
            'clicks': int(float(row['Clicks'].replace(',',''))),
            'impressions': int(float(row['Impressions'].replace(',',''))),
            'ctr': float(row['CTR'].replace('%','')),
            'position': float(row['Position']),
        })

# Read content of each target file
def read_content(filepath):
    full = os.path.join("/Users/britz/Desktop/Code/Varanasi_Insider", filepath)
    if os.path.exists(full):
        with open(full) as f:
            return f.read().lower()
    return ""

# Match queries to pages
def find_matching_queries(page_slug, url_patterns):
    """Find queries that likely target this page based on keyword overlap"""
    matching = []
    
    # Build keyword set from slug
    slug_words = set(page_slug.replace('-', ' ').split())
    slug_words -= {'en', 'hi', 'city', 'the', 'a', 'to', 'from', 'in', 'of', 'guide', '2025', '2026', 'taxi', 'price'}
    
    for q in queries:
        ql = q['query'].lower()
        
        # Direct slug word matching
        matches = sum(1 for w in slug_words if w in ql)
        
        # Also check Hindi equivalents
        hindi_match = False
        if 'ayodhya' in page_slug:
            if any(x in ql for x in ['ayodhya', 'अयोध्या', 'ram mandir', 'राम मंदिर', 'कशी से अयोध्या', 'banaras se ayodhya', 'varanasi to ayodhya', 'kashi to ayodhya']):
                hindi_match = True
        if 'prayagraj' in page_slug:
            if any(x in ql for x in ['prayagraj', 'allahabad', 'प्रयागराज', 'sangam', 'triveni', 'banaras se prayagraj', 'varanasi to prayagraj', 'varanasi to allahabad']):
                hindi_match = True
        if 'nepal' in page_slug:
            if any(x in ql for x in ['nepal', 'sunauli', 'kathmandu', 'pokhara', 'lumbini', 'नेपाल']):
                hindi_match = True
        if 'tempo' in page_slug:
            if any(x in ql for x in ['tempo', 'traveller', 'टेम्पो', 'group', '12 seater', '17 seater', 'mini bus']):
                hindi_match = True
        if 'airport' in page_slug:
            if any(x in ql for x in ['airport', 'vns', 'एयरपोर्ट', 'flight', 'pickup', 'airport taxi', 'airport cab']):
                hindi_match = True
        
        if matches >= min(2, len(slug_words)) or hindi_match:
            matching.append(q)
    
    return matching

print("=" * 120)
print("DEEP GSC AUDIT — 5 Enriched Pages vs Query Coverage")
print("=" * 120)

for slug, config in TARGETS.items():
    content = read_content(config['file'])
    
    # Find page-level GSC data
    page_data = None
    for p in pages:
        if slug in p['url'].lower():
            if page_data is None or p['impressions'] > page_data['impressions']:
                page_data = p
    
    matching_qs = find_matching_queries(slug, config['url_patterns'])
    matching_qs.sort(key=lambda x: x['impressions'], reverse=True)
    
    total_query_imp = sum(q['impressions'] for q in matching_qs)
    
    print(f"\n{'━' * 120}")
    print(f"PAGE: {slug}")
    if page_data:
        print(f"  GSC: pos {page_data['position']:.1f} | {page_data['impressions']:,} imp | {page_data['clicks']:,} clicks | {page_data['ctr']:.1f}% CTR")
    print(f"  Matching queries: {len(matching_qs)} | Total query impressions: {total_query_imp:,}")
    print(f"  Content file: {config['file']}")
    print()
    
    # Check which queries are NOT addressed in content
    missing_in_content = []
    present_in_content = []
    
    for q in matching_qs:
        ql = q['query'].lower()
        # Check if key content words from query appear in page content
        query_words = set(ql.split()) - {'in', 'to', 'from', 'the', 'a', 'is', 'of', 'ka', 'ki', 'se', 'ke', 'hai', 'kya', 'how', 'what', 'which', 'best', 'much', 'far'}
        
        found_words = sum(1 for w in query_words if w in content)
        coverage = found_words / max(len(query_words), 1)
        
        if coverage < 0.5 and q['impressions'] >= 100:
            missing_in_content.append((q, coverage))
        else:
            present_in_content.append((q, coverage))
    
    # Show top queries
    print(f"  TOP 15 MATCHING QUERIES:")
    print(f"  {'Pos':>5} {'Imp':>7} {'Click':>5} {'CTR':>5} {'Cover':>5}  Query")
    print(f"  {'-'*100}")
    for q in matching_qs[:15]:
        ql = q['query'].lower()
        query_words = set(ql.split()) - {'in', 'to', 'from', 'the', 'a', 'is', 'of', 'ka', 'ki', 'se', 'ke', 'hai', 'kya', 'how', 'what', 'which', 'best', 'much', 'far'}
        found_words = sum(1 for w in query_words if w in content)
        coverage = found_words / max(len(query_words), 1)
        flag = "✓" if coverage >= 0.5 else "⚠️"
        print(f"  {q['position']:5.1f} {q['impressions']:>7,} {q['clicks']:>5,} {q['ctr']:>4.1f}% {coverage:>4.0%}  {flag} {q['query']}")
    
    # Show content gaps
    if missing_in_content:
        missing_in_content.sort(key=lambda x: x[0]['impressions'], reverse=True)
        print(f"\n  ⚠️ CONTENT GAPS — Queries with 100+ imp NOT well-covered in content:")
        for q, cov in missing_in_content[:10]:
            print(f"    {q['position']:5.1f} | {q['impressions']:>6,} imp | {cov:.0%} coverage | {q['query']}")
    else:
        print(f"\n  ✅ No significant content gaps found!")
    
    # Check specific SEO elements
    print(f"\n  SEO CHECKLIST:")
    has_faq = 'faqschema' in content or 'faqpage' in content
    has_table = '|' in content and '---' in content
    has_h2 = '## ' in content
    has_links = '](/en/' in content or '](/hi/' in content
    has_cta = 'whatsapp' in content or 'book' in content or 'call' in content
    
    # Count internal links
    import re as regex
    internal_links = len(regex.findall(r'\]\(/(?:en|hi)/', content))
    
    # Count H2s
    h2_count = content.count('\n## ')
    
    # Count tables
    table_count = len(regex.findall(r'\n\|.*\|.*\|', content)) // 3  # rough estimate
    
    # Word count (body only)
    parts = content.split('---', 2)
    body = parts[2] if len(parts) >= 3 else content
    word_count = len(body.split())
    
    print(f"    {'✅' if has_faq else '❌'} faqSchema")
    print(f"    {'✅' if h2_count >= 5 else '🔶'} H2 sections: {h2_count}")
    print(f"    {'✅' if table_count >= 3 else '🔶'} Tables: ~{table_count}")
    print(f"    {'✅' if internal_links >= 4 else '🔶'} Internal links: {internal_links}")
    print(f"    {'✅' if has_cta else '❌'} CTA / booking")
    print(f"    {'✅' if word_count >= 1500 else '🔶'} Word count: {word_count}")
    
    # Check for keyword density of primary query
    if matching_qs:
        primary_q = matching_qs[0]['query'].lower()
        primary_count = content.count(primary_q)
        print(f"    Primary query '{primary_q}' appears {primary_count}x in content")


# ── Cross-page cannibalization check ──
print(f"\n{'━' * 120}")
print("CANNIBALIZATION CHECK — Multiple pages competing for same query?")
print(f"{'━' * 120}")

# For each target, find if other site pages rank for the same high-value queries
for slug, config in TARGETS.items():
    matching_qs = find_matching_queries(slug, config['url_patterns'])
    top_queries = [q for q in matching_qs if q['impressions'] >= 500]
    
    # Find competing pages on the same site
    competing = []
    for q in top_queries[:5]:
        ql = q['query'].lower()
        for p in pages:
            if slug not in p['url'].lower() and any(w in p['url'].lower() for w in slug.split('-') if len(w) > 3):
                competing.append((q['query'], p['url'], p['position'], p['impressions']))
    
    if competing:
        print(f"\n  {slug}:")
        seen = set()
        for qtext, url, pos, imp in competing[:5]:
            key = f"{qtext}|{url}"
            if key not in seen:
                seen.add(key)
                short = url.replace('https://www.kashitaxi.in', '')
                print(f"    Query: {qtext}")
                print(f"    Competing: {short} (pos {pos:.1f}, {imp:,} imp)")


# ── Final recommendations ──
print(f"\n{'=' * 120}")
print("FINAL RECOMMENDATIONS")
print(f"{'=' * 120}")

# Check for Hindi counterparts
print("\n📊 HINDI COUNTERPART STATUS:")
hindi_files = {
    'varanasi-to-ayodhya': 'content/hi/varanasi-to-ayodhya.md',
    'varanasi-to-prayagraj': 'content/hi/varanasi-to-prayagraj.md',
    'varanasi-to-nepal-taxi': None,  # check if exists
    'tempo-traveller-varanasi': 'content/hi/tempo-traveller-varanasi.md',
    'airport-taxi-price-guide': None,
}

for slug, hi_path in hindi_files.items():
    if hi_path:
        full = os.path.join("/Users/britz/Desktop/Code/Varanasi_Insider", hi_path)
        exists = os.path.exists(full)
        if exists:
            with open(full) as f:
                hi_content = f.read()
            hi_words = len(hi_content.split())
            print(f"  {'✅' if hi_words > 500 else '🔶'} {slug}: Hindi exists ({hi_words} words)")
        else:
            print(f"  ❌ {slug}: Hindi file MISSING at {hi_path}")
    else:
        # Search for it
        found = False
        for root, dirs, files in os.walk(os.path.join("/Users/britz/Desktop/Code/Varanasi_Insider", "content/hi")):
            for f in files:
                if slug.replace('-guide', '').replace('-price', '') in f:
                    fp = os.path.join(root, f)
                    with open(fp) as fh:
                        hi_words = len(fh.read().split())
                    print(f"  {'✅' if hi_words > 500 else '🔶'} {slug}: Hindi found at {fp.replace('/Users/britz/Desktop/Code/Varanasi_Insider/', '')} ({hi_words} words)")
                    found = True
                    break
        if not found:
            print(f"  ❌ {slug}: No Hindi counterpart found")

print("\n" + "=" * 120)
print("AUDIT COMPLETE")
print("=" * 120)
