#!/usr/bin/env python3
"""
Migrate inline JSON-LD from 5 event markdown files:
1. Extract FAQ Q&As from inline <script type="application/ld+json"> blocks
2. Add them as faqSchema in YAML frontmatter
3. Strip all inline <script type="application/ld+json"> blocks

The pipeline (lib/destinationContent.js) generates Event schema from
frontmatter startDate/location, so inline Event scripts are redundant.
Service/TouristAttraction/Festival types are non-essential extras.
"""
import re, json, sys, textwrap, os

FILES = [
    'content/en/destinations/varanasi/events/banaras-lit-fest-2026-taxi-booking.md',
    'content/en/destinations/varanasi/events/kartik-purnima-ganga-snan-varanasi-2026.md',
    'content/en/destinations/varanasi/events/kashi-tamil-sangamam-2026-varanasi.md',
    'content/en/destinations/varanasi/events/makar-sankranti-ganga-snan-varanasi-2026.md',
    'content/en/destinations/varanasi/events/mauni-amavasya-ganga-snan-varanasi-2026.md',
]

def extract_faqs(raw):
    """Extract FAQ Q&As from inline JSON-LD script blocks."""
    scripts = re.findall(r'<script[^>]*application/ld\+json[^>]*>\s*\n?([\s\S]*?)</script>', raw, re.I)
    faqs = []
    for s in scripts:
        try:
            obj = json.loads(s)
            nodes = obj.get('@graph', [obj])
            for n in nodes:
                if n.get('@type') == 'FAQPage':
                    for me in n.get('mainEntity', []):
                        q = me.get('name', '').strip()
                        a = me.get('acceptedAnswer', {}).get('text', '').strip()
                        if q and a:
                            faqs.append((q, a))
        except json.JSONDecodeError:
            pass
    return faqs

def yaml_escape(s):
    """Escape a string for YAML. If it contains special chars, quote it."""
    # Replace any internal double quotes with escaped quotes
    if any(c in s for c in [':', '#', '{', '}', '[', ']', ',', '&', '*', '?', '|', '-', '<', '>', '=', '!', '%', '@', '`', '"', "'"]):
        # Use double quotes with escaped internal double quotes
        return '"' + s.replace('\\', '\\\\').replace('"', '\\"') + '"'
    return s

def format_faq_yaml(faqs):
    """Format FAQ list as YAML faqSchema block."""
    lines = ['faqSchema:']
    for q, a in faqs:
        lines.append(f'  - q: {yaml_escape(q)}')
        # Wrap long answers using >- block scalar
        lines.append('    a: >-')
        # Wrap at ~76 chars with 6-space indent
        wrapped = textwrap.fill(a, width=76, initial_indent='      ', subsequent_indent='      ')
        lines.append(wrapped)
    return '\n'.join(lines)

def strip_inline_jsonld(raw):
    """Remove all inline <script type="application/ld+json"> blocks from markdown body."""
    return re.sub(r'\n*<script[^>]*application/ld\+json[^>]*>\s*\n?[\s\S]*?</script>\n*', '\n\n', raw, flags=re.I)

def process_file(filepath, dry_run=False):
    """Process a single file: extract FAQs, add to frontmatter, strip inline scripts."""
    raw = open(filepath).read()
    
    # Extract FAQs before stripping
    faqs = extract_faqs(raw)
    
    # Split frontmatter from body
    parts = raw.split('---', 2)
    if len(parts) < 3:
        print(f'  ERROR: Cannot parse frontmatter in {filepath}')
        return False
    
    frontmatter = parts[1]
    body = parts[2]
    
    # Strip inline JSON-LD from body
    new_body = strip_inline_jsonld(body)
    
    # Add faqSchema to frontmatter if we have FAQs and frontmatter doesn't already have it
    if faqs and 'faqSchema:' not in frontmatter:
        faq_yaml = format_faq_yaml(faqs)
        # Insert before the last line of frontmatter
        frontmatter = frontmatter.rstrip() + '\n' + faq_yaml + '\n'
        print(f'  Added {len(faqs)} FAQs to faqSchema')
    elif faqs:
        print(f'  faqSchema already exists, skipping FAQ migration ({len(faqs)} FAQs in inline)')
    else:
        print(f'  No FAQs to migrate')
    
    # Count scripts removed
    old_count = len(re.findall(r'<script[^>]*application/ld\+json', raw, re.I))
    new_count = len(re.findall(r'<script[^>]*application/ld\+json', new_body, re.I))
    print(f'  Stripped {old_count - new_count} inline JSON-LD script(s)')
    
    result = '---' + frontmatter + '---' + new_body
    
    if not dry_run:
        open(filepath, 'w').write(result)
        print(f'  Written: {filepath}')
    else:
        print(f'  DRY RUN: would write {filepath}')
    
    return True

if __name__ == '__main__':
    dry_run = '--dry-run' in sys.argv
    target = sys.argv[-1] if len(sys.argv) > 1 and not sys.argv[-1].startswith('-') else None
    
    for f in FILES:
        basename = os.path.basename(f)
        if target and target != basename and target not in f:
            continue
        print(f'\n=== {basename} ===')
        process_file(f, dry_run=dry_run)
    
    print('\nDone!')
