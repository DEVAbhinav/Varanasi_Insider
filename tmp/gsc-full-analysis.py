#!/usr/bin/env python3
import csv, collections, re

pages_path = '/Users/britz/Downloads/kashitaxi.in-Performance-on-Search-2026-04-03/Pages.csv'
queries_path = '/Users/britz/Downloads/kashitaxi.in-Performance-on-Search-2026-04-03/Queries.csv'

def pn(s): return int(s.replace(',',''))
def pp(s): return float(s.replace('%',''))

pages = []
with open(pages_path) as f:
    for row in csv.DictReader(f):
        pages.append({'url':row['Top pages'],'clicks':pn(row['Clicks']),'imp':pn(row['Impressions']),'ctr':pp(row['CTR']),'pos':float(row['Position'])})

queries = []
with open(queries_path) as f:
    for row in csv.DictReader(f):
        queries.append({'q':row['Top queries'],'clicks':pn(row['Clicks']),'imp':pn(row['Impressions']),'ctr':pp(row['CTR']),'pos':float(row['Position'])})

tc = sum(p['clicks'] for p in pages)
ti = sum(p['imp'] for p in pages)
tqc = sum(q['clicks'] for q in queries)
tqi = sum(q['imp'] for q in queries)

print("="*70)
print("GSC SNAPSHOT  (kashitaxi.in  —  export 2026-04-03)")
print("="*70)
print(f"Pages:   {len(pages):>5}  |  Clicks {tc:>8,}  |  Impressions {ti:>10,}")
print(f"Queries: {len(queries):>5}  |  Clicks {tqc:>8,}  |  Impressions {tqi:>10,}")

# 1
print("\n"+"-"*70)
print("1. TOP 15 PAGES BY CLICKS")
print("-"*70)
for p in sorted(pages, key=lambda x:-x['clicks'])[:15]:
    s=p['url'].replace('https://www.kashitaxi.in','')
    print(f"  {p['clicks']:>5} clicks | {p['imp']:>7,} imp | {p['ctr']:>5.1f}% | pos {p['pos']:>5.1f} | {s}")

# 2
print("\n"+"-"*70)
print("2. HIGH-IMPRESSION PAGES WITH LOW CTR  (imp>=10k, CTR<1%)")
print("-"*70)
lc=[p for p in pages if p['imp']>=10000 and p['ctr']<1.0]
for p in sorted(lc, key=lambda x:-x['imp'])[:20]:
    s=p['url'].replace('https://www.kashitaxi.in','')
    m=int(p['imp']*0.02)-p['clicks']
    print(f"  {p['imp']:>7,} imp | {p['ctr']:>5.2f}% | pos {p['pos']:>5.1f} | missed~{m:>4} | {s}")

# 3
print("\n"+"-"*70)
print("3. STRIKING-DISTANCE PAGES  (pos 5-15, imp>=5k)")
print("-"*70)
st=[p for p in pages if 5<=p['pos']<=15 and p['imp']>=5000]
for p in sorted(st, key=lambda x:-x['imp'])[:20]:
    s=p['url'].replace('https://www.kashitaxi.in','')
    print(f"  pos {p['pos']:>5.1f} | {p['imp']:>7,} imp | {p['clicks']:>5} clicks | {s}")

# 4
print("\n"+"-"*70)
print("4. HINDI PAGES (/hi/) PERFORMANCE")
print("-"*70)
hp=[p for p in pages if '/hi/' in p['url'] or p['url'].endswith('/hi')]
hp.sort(key=lambda x:-x['imp'])
hc=sum(p['clicks'] for p in hp)
hi=sum(p['imp'] for p in hp)
print(f"  Total Hindi pages: {len(hp)}  |  Clicks: {hc:,}  |  Impressions: {hi:,}")
print(f"  Hindi share: {hc/tc*100:.1f}% clicks, {hi/ti*100:.1f}% impressions")
for p in hp[:20]:
    s=p['url'].replace('https://www.kashitaxi.in','')
    print(f"  {p['imp']:>7,} imp | {p['clicks']:>4} clicks | {p['ctr']:>5.2f}% | pos {p['pos']:>5.1f} | {s}")

# 5
print("\n"+"-"*70)
print("5. TOP HINDI QUERIES (Devanagari)")
print("-"*70)
hq=[q for q in queries if re.search(r'[\u0900-\u097F]',q['q']) or 'hindi' in q['q'].lower()]
hq.sort(key=lambda x:-x['imp'])
print(f"  Hindi queries found: {len(hq)}")
for q in hq[:25]:
    print(f"  {q['imp']:>7,} imp | {q['clicks']:>4} clicks | {q['ctr']:>5.2f}% | pos {q['pos']:>5.1f} | {q['q']}")

# 6
print("\n"+"-"*70)
print("6. TOP 20 QUERIES BY IMPRESSIONS")
print("-"*70)
for q in sorted(queries, key=lambda x:-x['imp'])[:20]:
    print(f"  {q['imp']:>7,} imp | {q['clicks']:>4} clicks | {q['ctr']:>5.2f}% | pos {q['pos']:>5.1f} | {q['q']}")

# 7
print("\n"+"-"*70)
print("7. WINNING QUERIES  (pos<5, CTR>=3%)")
print("-"*70)
w=[q for q in queries if q['pos']<5 and q['ctr']>=3.0]
w.sort(key=lambda x:-x['clicks'])
for q in w[:15]:
    print(f"  pos {q['pos']:>4.1f} | {q['ctr']:>5.1f}% | {q['clicks']:>4} clicks | {q['imp']:>7,} imp | {q['q']}")

# 8
print("\n"+"-"*70)
print("8. OPPORTUNITY QUERIES  (pos 4-12, imp>=2k, CTR<2%)")
print("-"*70)
op=[q for q in queries if 4<=q['pos']<=12 and q['imp']>=2000 and q['ctr']<2.0]
op.sort(key=lambda x:-x['imp'])
for q in op[:25]:
    print(f"  pos {q['pos']:>5.1f} | {q['imp']:>7,} imp | {q['clicks']:>4} clicks | {q['ctr']:>5.2f}% | {q['q']}")

# 9
print("\n"+"-"*70)
print("9. ZERO-CLICK QUERIES  (0 clicks, imp>=500)")
print("-"*70)
z=[q for q in queries if q['clicks']==0 and q['imp']>=500]
z.sort(key=lambda x:-x['imp'])
for q in z[:20]:
    print(f"  pos {q['pos']:>5.1f} | {q['imp']:>6,} imp | {q['q']}")

# 10
print("\n"+"-"*70)
print("10. LANGUAGE & PATH SPLIT")
print("-"*70)
bk=collections.Counter()
for p in pages:
    u=p['url'].replace('https://www.kashitaxi.in','')
    if u.startswith('/hi'): bk['Hindi /hi/']+=p['clicks']
    elif u.startswith('/en'): bk['English /en/']+=p['clicks']
    elif '/bike' in u or '/pink' in u: bk['Bike/Pink']+=p['clicks']
    else: bk['Other (root)']+=p['clicks']
for k,v in bk.most_common():
    print(f"  {k:<20} {v:>6,} clicks  ({v/tc*100:.1f}%)")
print("="*70)
