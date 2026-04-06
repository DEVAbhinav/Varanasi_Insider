#!/usr/bin/env python3
"""Audit content/en/ markdown files for missing E-E-A-T signals."""
import os
import re

base = "content/en"
results = []

# Collect all target .md files
targets = []
for root, dirs, files in os.walk(base):
    if "/hi/" in root or root.endswith("/hi"):
        continue
    for f in files:
        if not f.endswith(".md"):
            continue
        path = os.path.join(root, f)
        if f in ("README.md", "OKR.md", "privacy-policy.md", "contact.md"):
            continue
        targets.append(path)

# First-person / EEAT signal patterns (broad)
fp_patterns = re.compile(
    r"\b("
    r"I've|I\u2019ve|I can tell|I recommend|I suggest|I always|"
    r"my experience|my years|personally|I remember|I know from|"
    r"our team|our drivers|we've|we\u2019ve|we have been|"
    r"as a local|as a guide|our fleet|having guided|having driven|"
    r"I tell my|in my|from my|I\u2019ve seen|I\u2019ve guided|"
    r"I\u2019ve noticed|I\u2019ve witnessed|our local|we ensure|"
    r"we take pride|we provide|our Kashi|our Varanasi|"
    r"my clients|my guests|firsthand|first-hand"
    r")\b",
    re.IGNORECASE,
)

# Also check for weaker signals (author bio, about section, etc.)
weak_signals = re.compile(
    r"\b(years of experience|trusted by|locally operated|born and raised|"
    r"local expertise|insider knowledge|insider tip|pro tip|local tip)\b",
    re.IGNORECASE,
)


def priority(path):
    p = path.lower()
    if "/packages/" in p or "tour-package" in p:
        return 1
    if "/tour-packages/" in p:
        return 1
    if "-tour" in p and "package" in p:
        return 1
    if "/services/" in p:
        return 2
    if "booking" in p or "book-" in p:
        return 2
    if "taxi" in p and ("service" in p or "airport" in p or "rates" in p):
        return 3
    if "taxi" in p and "fare" in p:
        return 3
    if "tempo-traveller" in p:
        return 4
    if "taxi" in p:
        return 4
    if "/sightseeing/" in p or "/activities/" in p or "/shopping/" in p:
        return 5
    if "/events/" in p or "festival" in p:
        return 6
    if "guide" in p:
        return 6
    if "/food/" in p:
        return 7
    return 8


for path in sorted(targets):
    with open(path, "r", encoding="utf-8") as fh:
        content = fh.read()

    # Split frontmatter and body
    parts = content.split("---")
    if len(parts) >= 3:
        body = "---".join(parts[2:]).strip()
    else:
        body = content.strip()

    has_fp = bool(fp_patterns.search(body))
    has_weak = bool(weak_signals.search(body))

    if not has_fp:
        # Get first meaningful paragraph lines
        lines = []
        for l in body.split("\n"):
            s = l.strip()
            if not s:
                continue
            if s.startswith("#") or s.startswith("import ") or s.startswith("<"):
                continue
            if s.startswith("{") or s.startswith("!["):
                continue
            if s.startswith("```"):
                continue
            lines.append(s)
            if len(lines) >= 3:
                break

        opening = " ".join(lines)[:280] if lines else "(empty body)"
        word_count = len(body.split())

        what_missing = []
        if not has_fp:
            what_missing.append("no first-person experience")
        if not has_weak:
            what_missing.append("no local-knowledge signals")

        results.append(
            {
                "path": path,
                "priority": priority(path),
                "word_count": word_count,
                "opening": opening,
                "missing": ", ".join(what_missing),
                "has_weak": has_weak,
            }
        )

# Sort by priority then word count desc (bigger = more impactful)
results.sort(key=lambda x: (x["priority"], -x["word_count"]))

total = len(results)
total_files = len(targets)
print(f"EEAT AUDIT: {total} of {total_files} files missing first-person signals")
print(f"{'='*80}")

for i, r in enumerate(results[:25], 1):
    rel = r["path"]
    print(f"\n#{i}  {rel}")
    print(f"    Priority: {r['priority']} | Words: {r['word_count']} | Weak signals: {'yes' if r['has_weak'] else 'NO'}")
    print(f"    Missing: {r['missing']}")
    print(f"    Opening: {r['opening'][:250]}")
