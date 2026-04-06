import csv, re, os, glob

# === CONFIG ===
pages_csv = "/Users/britz/Downloads/kashitaxi.in-Performance-on-Search-2026-04-03/Pages.csv"
queries_csv = "/Users/britz/Downloads/kashitaxi.in-Performance-on-Search-2026-04-03/Queries.csv"
content_dir = "/Users/britz/Desktop/Code/Varanasi_Insider/content"

# Top 5 sales pages (manually selected from next5-sales.py output)
targets = [
    "/en/varanasi-sightseeing-complete-guide",      # 27.8K imp, pos 8.7, drives city tour bookings 
    "/en/ayodhya-to-varanasi-taxi",                  # 7.7K imp, pos 9.3, direct taxi sale
    "/en/city/varanasi/sightseeing/dashashwamedh-ghat-boat-ride-ganga-aarti-guide",  # 7.6K imp, pos 8.8
    "/en/prayagraj-to-varanasi-taxi",                # 4.1K imp, pos 8.6, direct taxi
    "/en/travel-from-varanasi-to-vindhyachal",       # 3.4K imp, pos 11.5, outstation taxi
]

# === Load all GSC queries ===
queries = []
with open(queries_csv) as f:
    for r in csv.DictReader(f):
        queries.append({
            'query': r['Top queries'],
            'clicks': int(r['Clicks'].replace(',','')),
            'imp': int(r['Impressions'].replace(',','')),
            'ctr': r['CTR'],
            'pos': float(r['Position'])
        })

# === Load all page stats ===
page_stats = {}
with open(pages_csv) as f:
    for r in csv.DictReader(f):
        url = r['Top pages'].replace('https://www.kashitaxi.in', '').replace('https://kashitaxi.in', '').replace('http://www.kashitaxi.in', '')
        page_stats[url] = {
            'imp': int(r['Impressions'].replace(',','')),
            'clicks': int(r['Clicks'].replace(',','')),
            'pos': float(r['Position']),
            'ctr': r['CTR']
        }

# === Load all content files for KV matching ===
all_files = {}
for ext in ['md']:
    for fpath in glob.glob(f"{content_dir}/**/*.{ext}", recursive=True):
        rel = fpath.replace(content_dir, '').replace('.md', '')
        # Read first 20 lines (frontmatter with keywords/meta)
        with open(fpath, 'r', errors='ignore') as fp:
            content = fp.read()
        # Extract keywords, metaTitle, metaDescription
        meta_block = content[:2000].lower()
        all_files[rel] = {
            'path': fpath,
            'meta': meta_block,
            'full': content.lower(),
            'word_count': len(content.split())
        }

# === For each target, find matching queries and check KV ===
for target_path in targets:
    stats = page_stats.get(target_path, {})
    print(f"\n{'='*100}")
    print(f"PAGE: {target_path}")
    print(f"  Position: {stats.get('pos','?')} | Impressions: {stats.get('imp','?'):,} | Clicks: {stats.get('clicks','?')} | CTR: {stats.get('ctr','?')}")
    
    # Find content file
    content_file = None
    for key, val in all_files.items():
        if target_path.rstrip('/') == key.rstrip('/'):
            content_file = val
            break
    if not content_file:
        # Try partial match
        slug = target_path.split('/')[-1]
        for key, val in all_files.items():
            if slug in key:
                content_file = val
                break
    
    if content_file:
        print(f"  Content file: {content_file['path']}")
        print(f"  Word count: {content_file['word_count']}")
    else:
        print(f"  !! Content file NOT FOUND")
    
    # Find matching queries (crude: slug words appear in query)
    slug = target_path.split('/')[-1]
    slug_words = set(re.split(r'[-/]', slug))
    slug_words.discard('')
    # Key matching words (drop common filler)
    filler = {'en', 'hi', 'city', 'varanasi', 'taxi', 'guide', 'the', 'to', 'from', 'in', 'of', 'a', '2025', '2026', 'distance'}
    match_words = slug_words - filler
    
    matching = []
    for q in queries:
        query_lower = q['query'].lower()
        # Check if key slug words appear in query
        words_found = sum(1 for w in match_words if w in query_lower)
        # Also check full slug as substring
        slug_clean = slug.replace('-', ' ')
        if words_found >= max(1, len(match_words) - 1) or slug_clean in query_lower:
            matching.append(q)
    
    matching.sort(key=lambda x: x['imp'], reverse=True)
    
    print(f"\n  TOP MATCHING GSC QUERIES ({len(matching)} found):")
    for q in matching[:15]:
        # Check if query appears in page content
        in_content = "YES" if content_file and q['query'].lower() in content_file['full'] else "NO"
        print(f"    [{in_content:>3}] imp={q['imp']:>6,} pos={q['pos']:>5.1f} clicks={q['clicks']:>4} | {q['query']}")
    
    # === KV CHECK: Which other pages also contain these query terms? ===
    print(f"\n  CANNIBALIZATION CHECK (top queries vs other pages):")
    for q in matching[:8]:
        query_lower = q['query'].lower()
        query_words = set(query_lower.split())
        query_words -= {'in', 'to', 'from', 'the', 'a', 'of', 'for', 'is', 'how', 'what', 'and', 'or'}
        
        competing = []
        for key, val in all_files.items():
            if target_path.rstrip('/') == key.rstrip('/'):
                continue
            # Check if query words appear significantly in other page's meta
            meta = val['meta']
            words_in_meta = sum(1 for w in query_words if w in meta)
            if words_in_meta >= max(2, len(query_words) - 1):
                competing.append((key, words_in_meta, len(query_words)))
        
        if competing:
            competing.sort(key=lambda x: x[1], reverse=True)
            print(f"    QUERY: \"{q['query']}\" (imp={q['imp']:,})")
            for c in competing[:3]:
                print(f"      -> COMPETING: {c[0]} ({c[1]}/{c[2]} words match)")
        
    print()

print("\n" + "="*100)
print("DONE")
