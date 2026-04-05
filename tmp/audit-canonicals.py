import os, re
from pathlib import Path

content_root = Path('content')
problems = []

for md_file in content_root.rglob('*.md'):
    text = md_file.read_text(errors='ignore')
    m = re.search(r'^canonical:\s*["\'](.+?)["\']', text, re.MULTILINE)
    if not m:
        continue
    canonical = m.group(1).rstrip('/')

    rel = str(md_file.relative_to(content_root))
    parts = rel.split('/')
    lang = parts[0]
    rest = '/'.join(parts[1:]).replace('.md', '')

    if rest.startswith('destinations/'):
        dest_parts = rest.split('/')
        if len(dest_parts) >= 4:
            destination = dest_parts[1]
            category = dest_parts[2]
            slug = dest_parts[3]
            expected_path = f'/{lang}/city/{destination}/{category}/{slug}'
        else:
            continue
    else:
        slug = rest
        expected_path = f'/{lang}/{slug}'

    expected_full = f'https://www.kashitaxi.in{expected_path}'

    if canonical != expected_full:
        problems.append((str(md_file), canonical, expected_full))

print(f'Found {len(problems)} canonical mismatches:\n')
for f, actual, expected in sorted(problems):
    print(f'  FILE: {f}')
    print(f'    HAS:    {actual}')
    print(f'    SHOULD: {expected}')
    print()
