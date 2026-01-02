import os
import re

content_dir = '/Users/britz/Desktop/Code/Varanasi_Insider/content/en'
results = []

for root, dirs, files in os.walk(content_dir):
    for f in files:
        if f.endswith('.md'):
            path = os.path.join(root, f)
            try:
                with open(path, 'r', encoding='utf-8') as fp:
                    content = fp.read()
                    count = len(re.findall(r'!\[', content))
                    if count < 2:
                        rel_path = path.replace(content_dir + '/', '')
                        results.append((count, f, rel_path))
            except Exception as e:
                print(f"Error reading {path}: {e}")

results.sort()
for c, f, p in results[:30]:
    print(f'{c}|{p}')
