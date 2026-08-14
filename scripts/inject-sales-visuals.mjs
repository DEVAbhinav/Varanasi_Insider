import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pages = JSON.parse(fs.readFileSync(path.join(root, 'data/sales-visual-pages.json'), 'utf8'));
const assets = JSON.parse(fs.readFileSync(path.join(root, 'data/sales-visual-assets.json'), 'utf8'));

function escapeHtml(value = '') {
  return String(value).replace(/[<>&'"]/g, (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&#39;', '"': '&quot;' }[char]));
}

for (const page of pages.filter((item) => item.source)) {
  const filePath = path.join(root, page.source);
  let markdown = fs.readFileSync(filePath, 'utf8');
  const pageAssets = assets.filter((item) => item.route === page.route).sort((a, b) => a.index - b.index);
  if (pageAssets.length !== 2) throw new Error(`${page.route} has ${pageAssets.length} assets`);

  for (const asset of pageAssets) {
    if (markdown.includes(`data-sales-visual="${asset.id}"`)) continue;
    const headingLine = markdown.split(/\r?\n/).find((line) => line.startsWith('## ') && line.replace(/^##\s+/, '').replace(/\s*\{#[^}]+\}\s*$/, '') === asset.section);
    if (!headingLine) throw new Error(`Heading not found for ${asset.id}: ${asset.section}`);
    const figure = `\n\n<figure class="sales-section-visual" data-sales-visual="${asset.id}">\n  <a href="/booking" aria-label="Plan and book this trip with Kashi Taxi">\n    <img src="${asset.cloudinaryUrl}" alt="${escapeHtml(asset.alt)}" loading="lazy" width="${asset.width}" height="${asset.height}" />\n  </a>\n  <figcaption>${escapeHtml(asset.caption)} <strong>${escapeHtml(asset.credit)}</strong></figcaption>\n</figure>`;
    markdown = markdown.replace(headingLine, `${headingLine}${figure}`);
  }
  fs.writeFileSync(filePath, markdown);
  console.log(`Integrated 2 assets: ${page.source}`);
}
