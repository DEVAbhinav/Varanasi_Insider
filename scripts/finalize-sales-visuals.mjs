import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const sourceDir = path.join(root, 'public/images/sales-visuals/source-approved');
const finalDir = path.join(root, 'public/images/sales-visuals/final');
const prompts = JSON.parse(fs.readFileSync(path.join(root, 'data/sales-visual-prompts.json'), 'utf8'));
const maxBytes = 250 * 1024;

fs.mkdirSync(finalDir, { recursive: true });

function escapeXml(value = '') {
  return String(value).replace(/[<>&'"]/g, (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[char]));
}

function footerSvg(width, section) {
  const shortSection = section.length > 58 ? `${section.slice(0, 55)}…` : section;
  return Buffer.from(`<svg width="${width}" height="92" xmlns="http://www.w3.org/2000/svg">
    <rect width="${width}" height="92" fill="#173d3a"/>
    <rect width="8" height="92" fill="#c95f3d"/>
    <text x="34" y="38" fill="#fffaf0" font-family="Arial, Helvetica, sans-serif" font-size="25" font-weight="700" letter-spacing="1">KASHI TAXI</text>
    <text x="34" y="68" fill="#d9e6df" font-family="Arial, Helvetica, sans-serif" font-size="17">${escapeXml(shortSection)}</text>
    <text x="${width - 34}" y="38" text-anchor="end" fill="#fffaf0" font-family="Arial, Helvetica, sans-serif" font-size="23" font-weight="700">kashitaxi.in</text>
    <text x="${width - 34}" y="68" text-anchor="end" fill="#f0c67d" font-family="Arial, Helvetica, sans-serif" font-size="17" font-weight="700">PLAN &amp; BOOK THIS TRIP →</text>
  </svg>`);
}

async function encodeUnderLimit(input, output, section) {
  const width = 1200;
  const artworkHeight = 800;
  const canvas = await sharp(input)
    .resize(width, artworkHeight, { fit: 'cover', position: 'centre' })
    .extend({ bottom: 92, background: '#173d3a' })
    .composite([{ input: footerSvg(width, section), top: artworkHeight, left: 0 }])
    .toBuffer();

  for (const quality of [82, 78, 74, 70, 66, 62, 58]) {
    const encoded = await sharp(canvas).webp({ quality, effort: 6, smartSubsample: true }).toBuffer();
    if (encoded.length <= maxBytes) {
      fs.writeFileSync(output, encoded);
      return { bytes: encoded.length, quality, width, height: artworkHeight + 92 };
    }
  }

  const encoded = await sharp(canvas)
    .resize(1080)
    .webp({ quality: 56, effort: 6, smartSubsample: true })
    .toBuffer();
  if (encoded.length > maxBytes) throw new Error(`${path.basename(input)} remains above 250 KB (${encoded.length})`);
  fs.writeFileSync(output, encoded);
  const metadata = await sharp(encoded).metadata();
  return { bytes: encoded.length, quality: 56, width: metadata.width, height: metadata.height };
}

const records = [];
for (const item of prompts) {
  const input = path.join(sourceDir, `${item.id}.png`);
  const output = path.join(finalDir, `${item.id}.webp`);
  if (!fs.existsSync(input)) throw new Error(`Missing source: ${input}`);
  const result = await encodeUnderLimit(input, output, item.section);
  records.push({
    id: item.id,
    route: item.route,
    section: item.section,
    index: item.index,
    localPath: `/images/sales-visuals/final/${item.id}.webp`,
    cloudinaryUrl: null,
    alt: `${item.section} — visual field guide by Kashi Taxi`,
    caption: `${item.section}. A section-specific planning graphic prepared by Kashi Taxi using the details on this page.`,
    credit: 'Kashi Taxi · kashitaxi.in',
    ...result,
  });
  console.log(`${item.id}: ${(result.bytes / 1024).toFixed(1)} KB at q${result.quality}`);
}

fs.writeFileSync(path.join(root, 'data/sales-visual-assets.json'), `${JSON.stringify(records, null, 2)}\n`);
console.log(`Finalized ${records.length} assets; max ${(Math.max(...records.map((item) => item.bytes)) / 1024).toFixed(1)} KB.`);
