import csv
import subprocess
import sys

GSC_CSV = '/Users/britz/Downloads/kashitaxi.in-Performance-on-Search-2026-04-03/Pages.csv'
BASE = 'http://localhost:3111'

# 1. Load GSC data
pages = {}
with open(GSC_CSV, 'r') as f:
    reader = csv.DictReader(f)
    for row in reader:
        url = row.get('Top pages', '')
        imp = int(row.get('Impressions', 0))
        clicks = int(row.get('Clicks', 0))
        if imp > 0:
            pages[url] = {'imp': imp, 'clicks': clicks}

total_imp = sum(p['imp'] for p in pages.values())
total_clicks = sum(p['clicks'] for p in pages.values())
print(f"GSC total: {len(pages)} URLs, {total_imp:,} impressions, {total_clicks:,} clicks\n")

# 2. Redirected pages and their winners
redirects = {
    'varanasi-1n2d-tour': 'varanasi-2-day-tour',
    'varanasi-2n3d-tour': 'varanasi-3-day-tour',
    'ayodhya-1n2d-tour': 'ayodhya-2-day-tour',
    'varanasi-airport-to-ddu-junction-distance': 'varanasi-airport-to-mughalsarai-distance',
    'varanasi-to-bodhgaya-taxi': 'varanasi-to-bodhgaya-taxi-cost',
    'lucknow-to-varanasi-taxi-fare': 'lucknow-to-varanasi-taxi',
}

print("=" * 80)
print("REDIRECT AUDIT: Every redirected page → winner")
print("=" * 80)

lost_imp = 0
lost_clicks = 0

for loser_slug, winner_slug in redirects.items():
    # Find GSC data for loser
    loser_url = None
    loser_data = {'imp': 0, 'clicks': 0}
    for url, data in pages.items():
        if loser_slug in url and winner_slug not in url:
            loser_url = url
            loser_data = data
            break
    
    # Find GSC data for winner
    winner_url = None
    winner_data = {'imp': 0, 'clicks': 0}
    for url, data in pages.items():
        if winner_slug in url:
            winner_url = url
            winner_data = data
            break
    
    status = "OK"
    if not winner_url:
        status = "WARN: winner not in GSC yet"
    
    print(f"\n  LOSER:  {loser_data['imp']:>6,} imp {loser_data['clicks']:>4} clicks  {loser_slug}")
    print(f"  WINNER: {winner_data['imp']:>6,} imp {winner_data['clicks']:>4} clicks  {winner_slug}")
    print(f"  → 301 consolidates {loser_data['imp'] + winner_data['imp']:,} impressions into one URL [{status}]")

# 3. Check ALL GSC URLs against localhost
print("\n" + "=" * 80)
print("FULL SITE AUDIT: Checking every GSC URL against current build")
print("=" * 80)

# Extract paths from full URLs
site_base = 'https://www.kashitaxi.in'
problems = []
checked = 0

for url, data in sorted(pages.items(), key=lambda x: -x[1]['imp']):
    if not url.startswith(site_base):
        continue
    
    path = url[len(site_base):]
    if not path:
        path = '/'
    
    # curl the local server
    try:
        result = subprocess.run(
            ['curl', '-s', '-o', '/dev/null', '-w', '%{http_code}', '-L', f'{BASE}{path}'],
            capture_output=True, text=True, timeout=10
        )
        code = result.stdout.strip()
    except Exception:
        code = 'ERR'
    
    checked += 1
    
    if code == '200':
        pass  # good
    elif code == '308' or code == '301':
        pass  # redirect, also good
    else:
        problems.append((data['imp'], data['clicks'], code, path))
        
if problems:
    print(f"\n{'PROBLEM':>10} URLs (not 200 after following redirects):\n")
    problems.sort(key=lambda x: -x[0])
    total_problem_imp = 0
    for imp, clicks, code, path in problems:
        print(f"  {imp:>6,} imp  {clicks:>4} clicks  HTTP {code}  {path}")
        total_problem_imp += imp
    print(f"\n  TOTAL AT RISK: {total_problem_imp:,} impressions ({total_problem_imp/total_imp*100:.1f}% of site total)")
else:
    print(f"\n  ALL {checked} GSC URLs return 200 (directly or via redirect). ZERO impression loss.")

print(f"\n  Checked {checked} URLs total.")
