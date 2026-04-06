import csv, re

pages_file = "/Users/britz/Downloads/kashitaxi.in-Performance-on-Search-2026-04-03/Pages.csv"

pages = []
with open(pages_file) as f:
    for r in csv.DictReader(f):
        pos = float(r['Position'])
        imp = int(r['Impressions'].replace(',',''))
        clicks = int(r['Clicks'].replace(',',''))
        url = r['Top pages']
        if 8 <= pos <= 50:
            pages.append({'url': url, 'pos': pos, 'imp': imp, 'clicks': clicks})

done = [
    'varanasi-to-ayodhya', 'varanasi-to-prayagraj', 'varanasi-to-nepal-taxi',
    'tempo-traveller-varanasi', 'varanasi-airport-taxi-price-guide'
]

tier_rules = [
    (1, 6.0, ['taxi', 'cab', 'airport.*transfer', 'airport.*taxi', 'pickup', 'drop']),
    (2, 4.5, ['tour.*package', 'pilgrimage', 'darshan', 'yatra']),
    (3, 5.0, ['tempo.*traveller', 'traveller.*hire']),
    (4, 3.0, ['boat.*ride', 'sunrise.*boat', 'ganga.*aarti']),
    (5, 2.5, ['bike.*rental', 'scooty', 'activa']),
    (6, 2.0, ['hotel', 'stay', 'accommodation']),
    (7, 1.5, ['sightseeing', 'places.*visit', 'tourist.*spot', 'things.*do']),
    (8, 1.0, ['guide', 'timing', 'weather', 'best.*time', 'festival']),
]

def classify(url):
    url_lower = url.lower()
    for tier, mult, patterns in tier_rules:
        for p in patterns:
            if re.search(p, url_lower):
                return tier, mult
    return 9, 0.5

filtered = []
for p in pages:
    skip = any(d in p['url'] for d in done)
    if skip:
        continue
    tier, mult = classify(p['url'])
    proximity = max(0, 51 - p['pos']) / 50
    score = p['imp'] * proximity * mult
    p['tier'] = tier
    p['mult'] = mult
    p['score'] = score
    filtered.append(p)

filtered.sort(key=lambda x: x['score'], reverse=True)

print(f"{'#':>3} {'Tier':>4} {'Pos':>6} {'Imp':>8} {'Clicks':>6} {'Score':>10}  URL")
print("-" * 110)
for i, p in enumerate(filtered[:30]):
    short = p['url'].replace('https://kashitaxi.in', '')
    print(f"{i+1:>3} T{p['tier']:>3} {p['pos']:>6.1f} {p['imp']:>8,} {p['clicks']:>6,} {p['score']:>10,.0f}  {short}")
