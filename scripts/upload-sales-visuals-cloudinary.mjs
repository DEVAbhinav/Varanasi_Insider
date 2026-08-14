import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const cloudinary = require('cloudinary').v2;
const root = process.cwd();
const manifestPath = path.join(root, 'data/sales-visual-assets.json');
const records = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

function legacyConfig() {
  const legacyPath = path.join(root, 'scripts/upload-infographics-cloudinary.js');
  const source = fs.readFileSync(legacyPath, 'utf8');
  const read = (key) => source.match(new RegExp(`${key}:\\s*['\"]([^'\"]+)['\"]`))?.[1];
  return { cloud_name: read('cloud_name'), api_key: read('api_key'), api_secret: read('api_secret') };
}

if (process.env.CLOUDINARY_URL) {
  cloudinary.config({ secure: true });
} else {
  const config = legacyConfig();
  if (!config.cloud_name || !config.api_key || !config.api_secret) throw new Error('Cloudinary configuration is unavailable.');
  cloudinary.config({ ...config, secure: true });
}

for (const record of records) {
  const filePath = path.join(root, 'public', record.localPath);
  const publicId = `kashitaxi/sales-visuals/${record.id}`;
  const result = await cloudinary.uploader.upload(filePath, {
    public_id: publicId,
    overwrite: true,
    resource_type: 'image',
    format: 'webp',
    tags: ['sales-visual', 'section-guide', 'kashitaxi'],
    context: `caption=${record.caption}|credit=${record.credit}|page=${record.route}`,
  });
  record.cloudinaryUrl = result.secure_url.replace('/image/upload/', '/image/upload/f_auto,q_auto:good/');
  record.cloudinaryPublicId = result.public_id;
  record.cloudinaryBytes = result.bytes;
  console.log(`${record.id}: ${(result.bytes / 1024).toFixed(1)} KB`);
}

fs.writeFileSync(manifestPath, `${JSON.stringify(records, null, 2)}\n`);
console.log(`Uploaded ${records.length} assets to Cloudinary.`);
