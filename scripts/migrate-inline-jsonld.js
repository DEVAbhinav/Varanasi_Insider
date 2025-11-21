const fs = require('fs');
const path = require('path');

const CONTENT_ROOT = path.join(__dirname, '..', 'content');

const JSON_LD_REGEX = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function parseJsonSafe(block, filePath) {
  try {
    const trimmed = block.trim();
    if (!trimmed) return null;
    return JSON.parse(trimmed);
  } catch (err) {
    console.error(`Failed to parse JSON-LD in ${filePath}:`, err);
    return null;
  }
}

function buildJsonPayload(items) {
  const valid = items.filter(Boolean);
  if (valid.length === 0) return null;
  if (valid.length === 1) return valid[0];
  return {
    '@context': 'https://schema.org',
    '@graph': valid,
  };
}

function migrateFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  let match;
  const blocks = [];
  let updated = raw;

  while ((match = JSON_LD_REGEX.exec(raw)) !== null) {
    if (match[1]) {
      blocks.push(parseJsonSafe(match[1], filePath));
    }
  }

  if (blocks.length === 0) {
    return false;
  }

  updated = updated.replace(JSON_LD_REGEX, '').trimEnd() + '\n';
  const jsonPayload = buildJsonPayload(blocks);
  if (!jsonPayload) {
    console.warn(`No valid JSON-LD blocks extracted from ${filePath}`);
    return false;
  }

  const dir = path.dirname(filePath);
  const jsonDir = path.join(dir, 'json');
  ensureDir(jsonDir);
  const slug = path.basename(filePath, path.extname(filePath));
  const jsonPath = path.join(jsonDir, `${slug}.json`);

  if (fs.existsSync(jsonPath)) {
    console.warn(`Skipping ${filePath} because JSON file already exists at ${jsonPath}`);
    return false;
  }

  fs.writeFileSync(jsonPath, JSON.stringify(jsonPayload, null, 2));
  fs.writeFileSync(filePath, updated);
  console.log(`Migrated JSON-LD for ${filePath} -> ${jsonPath}`);
  return true;
}

function walkDir(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  entries.forEach((entry) => {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      migrateFile(fullPath);
    }
  });
}

function main() {
  const langs = fs.readdirSync(CONTENT_ROOT).filter((entry) => !entry.startsWith('.'));
  langs.forEach((lang) => {
    const destinationsDir = path.join(CONTENT_ROOT, lang, 'destinations');
    if (fs.existsSync(destinationsDir)) {
      walkDir(destinationsDir);
    }
  });
}

main();
