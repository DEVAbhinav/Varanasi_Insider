import csv, re

# Load redirects from next.config.js
with open('next.config.js') as f:
    config = f.read()
redirect_sources = set(re.findall(r"source:\s*'([^']+)'", config))

gsc_dir = '/Users/britz/Downloads/kashitaxi.in-Performance-on-Search-2026-04-03'

# 1. Find missing redirects for 2025 URLs
print("=" * 80)
print("MISSING REDIRECTS FOR 2025 URLs WITH TRAFFIC")
print("=" * 80)
missing = []
with open(f'{gsc_dir}/Pages.csv') as f:
    reader = csv.DictReader(f)
    for row in reader:
        url = row['Top pages']
        if '2025' not in url:
            continue
        clicks = int(row['Clicks'])
        imp = int(row['Impressions'].replace(',', ''))
        path = '/' + url.split('kashitaxi.in/')[-1] if 'kashitaxi.in/' in url else url
        path = path.rstrip('/')
        has_redirect = path in redirect_sources
        if not has_redirect and (clicks > 0 or imp > 1000):
            missing.append((clicks, imp, path, has_redirect))

missing.sort(key=lambda x: (-x[0], -x[1]))
print(f"{'Clicks':>6} {'Impr':>7} {'Redirect?':>10} Path")
print("-" * 80)
for c, i, p, r in missing:
    print(f"{c:>6} {i:>7} {'YES' if r else 'NO':>10} {p}")

# 2. Striking distance queries (position 5-15, impressions > 1000)
print("\n" + "=" * 80)
print("STRIKING DISTANCE QUERIES (pos 5-15, impr > 1000)")
print("=" * 80)
striking = []
with open(f'{gsc_dir}/Queries.csv') as f:
    reader = csv.DictReader(f)
    for row in reader:
        clicks = int(row['Clicks'])
        imp = int(row['Impressions'].replace(',', ''))
        pos = float(row['Position'])
        ctr = row['CTR'].replace('%', '')
        query = row['Top queries']
        if imp > 1000 and 5 < pos <= 15:
            striking.append((imp, clicks, pos, ctr, query))

striking.sort(key=lambda x: -x[0])
print(f"{'Impr':>7} {'Clicks':>6} {'Pos':>5} {'CTR':>6} Query")
print("-" * 80)
for i, c, p, ctr, q in striking[:30]:
    print(f"{i:>7} {c:>6} {p:>5.1f} {ctr:>5}% {q}")

# 3. Top queries ranked #1-3 with low CTR
print("\n" + "=" * 80)
print("TOP POSITION (#1-3) WITH LOW CTR — TITLE/META FIXES NEEDED")
print("=" * 80)
low_ctr = []
with open(f'{gsc_dir}/Queries.csv') as f:
    reader = csv.DictReader(f)
    for row in reader:
        clicks = int(row['Clicks'])
        imp = int(row['Impressions'].replace(',', ''))
        pos = float(row['Position'])
        ctr_val = float(row['CTR'].replace('%', ''))
        query = row['Top queries']
        if pos <= 3 and imp > 1000 and ctr_val < 5:
            low_ctr.append((imp, clicks, pos, ctr_val, query))

low_ctr.sort(key=lambda x: -x[0])
print(f"{'Impr':>7} {'Clicks':>6} {'Pos':>5} {'CTR':>6} Query")
print("-" * 80)
for i, c, p, ctr, q in low_ctr[:20]:
    print(f"{i:>7} {c:>6} {p:>5.1f} {ctr:>5.1f}% {q}")

# 4. Hindi pages underperforming
print("\n" + "=" * 80)
print("HINDI PAGES — HIGH IMPRESSIONS BUT LOW CTR")
print("=" * 80)
hindi = []
with open(f'{gsc_dir}/Pages.csv') as f:
    reader = csv.DictReader(f)
    for row in reader:
        url = row['Top pages']
        if '/hi/' not in url:
            continue
        clicks = int(row['Clicks'])
        imp = int(row['Impressions'].replace(',', ''))
        pos = float(row['Position'])
        ctr_val = float(row['CTR'].replace('%', ''))
        if imp > 5000:
            hindi.append((imp, clicks, pos, ctr_val, url.split('kashitaxi.in')[-1]))

hindi.sort(key=lambda x: -x[0])
print(f"{'Impr':>7} {'Clicks':>6} {'Pos':>5} {'CTR':>6} Path")
print("-" * 80)
for i, c, p, ctr, u in hindi[:20]:
    print(f"{i:>7} {c:>6} {p:>5.1f} {ctr:>5.1f}% {u}")
