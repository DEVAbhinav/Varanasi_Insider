"""Validate the query-content-match output for bidirectional consistency and correctness."""
import json
import re
from pathlib import Path

OUT = Path("tmp/query-content-match-output")
CONTENT = Path("content")

kp = json.load(open(OUT / "keyword_to_pages.json"))
pk = json.load(open(OUT / "page_to_keywords.json"))
summary = json.load(open(OUT / "summary.json"))

print("=== 1. Bidirectional symmetry ===")
errors_fwd = 0
for query, pages in kp.items():
    for entry in pages:
        page, freq = entry["page"], entry["freq"]
        if page not in pk:
            print(f"  MISSING PAGE in pk: {page}")
            errors_fwd += 1
            continue
        if not any(k["keyword"] == query and k["freq"] == freq for k in pk[page]):
            print(f"  FWD MISMATCH: q={query!r} p={page} f={freq}")
            errors_fwd += 1

errors_rev = 0
for page, keywords in pk.items():
    for entry in keywords:
        kw, freq = entry["keyword"], entry["freq"]
        if kw not in kp:
            print(f"  MISSING KW in kp: {kw!r}")
            errors_rev += 1
            continue
        if not any(p["page"] == page and p["freq"] == freq for p in kp[kw]):
            print(f"  REV MISMATCH: p={page} q={kw!r} f={freq}")
            errors_rev += 1

kp_pairs = sum(len(v) for v in kp.values())
pk_pairs = sum(len(v) for v in pk.values())
print(f"  fwd errors: {errors_fwd}, rev errors: {errors_rev}")
print(f"  kp pairs: {kp_pairs}, pk pairs: {pk_pairs}, match: {kp_pairs == pk_pairs}")
print(f"  SYMMETRIC: {errors_fwd == 0 and errors_rev == 0 and kp_pairs == pk_pairs}")

print("\n=== 2. Summary stats consistency ===")
s = summary
assert s["total_unique_queries"] == len(kp), f"query count mismatch: {s['total_unique_queries']} vs {len(kp)}"
assert s["total_markdown_pages"] == len(pk), f"page count mismatch: {s['total_markdown_pages']} vs {len(pk)}"
assert s["keywords_with_matches"] == sum(1 for v in kp.values() if v), "keywords_with_matches wrong"
assert s["keywords_without_matches"] == sum(1 for v in kp.values() if not v), "keywords_without_matches wrong"
assert s["pages_with_matches"] == sum(1 for v in pk.values() if v), "pages_with_matches wrong"
assert s["pages_without_matches"] == sum(1 for v in pk.values() if not v), "pages_without_matches wrong"
assert s["total_keyword_page_pairs"] == kp_pairs, "total_keyword_page_pairs wrong"
print("  All summary stats PASS")

print("\n=== 3. Spot-check freq counts against real files ===")
spot_checks = 0
spot_errors = 0
# Pick 5 random (query, page, freq) triples and verify freq
import random
random.seed(42)
all_triples = []
for q, pages in kp.items():
    for entry in pages:
        all_triples.append((q, entry["page"], entry["freq"]))
samples = random.sample(all_triples, min(10, len(all_triples)))

for query, page, expected_freq in samples:
    spot_checks += 1
    text = (CONTENT / page).read_text(encoding="utf-8", errors="ignore").lower()
    actual = sum(1 for _ in re.finditer(re.escape(query.lower()), text))
    if actual != expected_freq:
        print(f"  FREQ MISMATCH: q={query!r} p={page} expected={expected_freq} actual={actual}")
        spot_errors += 1
    else:
        print(f"  OK: q={query!r} p={page} freq={actual}")

print(f"  Spot checks: {spot_checks}, errors: {spot_errors}")

print("\n=== 4. Coverage check ===")
# How many actual .md files exist vs what's in the output?
actual_md = sorted(p.relative_to(CONTENT).as_posix() for p in CONTENT.rglob("*.md") if p.is_file())
output_pages = sorted(pk.keys())
if actual_md == output_pages:
    print(f"  All {len(actual_md)} markdown files accounted for")
else:
    missing = set(actual_md) - set(output_pages)
    extra = set(output_pages) - set(actual_md)
    if missing:
        print(f"  MISSING from output ({len(missing)}): {list(missing)[:5]}...")
    if extra:
        print(f"  EXTRA in output ({len(extra)}): {list(extra)[:5]}...")

print("\n=== 5. Non-MD content coverage gap ===")
# Check if there are pages/ .js files that generate content routes not covered
pages_dir = Path("pages")
js_pages = sorted(p.stem for p in pages_dir.glob("*.js") if not p.stem.startswith("_") and not p.stem.startswith("["))
md_stems = set(p.stem for p in CONTENT.rglob("*.md"))
js_not_in_md = [j for j in js_pages if j not in md_stems]
if js_not_in_md:
    print(f"  JS pages with NO matching MD content file ({len(js_not_in_md)}):")
    for j in js_not_in_md:
        print(f"    pages/{j}.js")
else:
    print("  All JS pages have matching MD content")

print("\nDONE")
