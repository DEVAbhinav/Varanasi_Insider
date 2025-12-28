const fs = require('fs');
const path = require('path');

// Cloudinary base URL
const CLOUDINARY_BASE = 'https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi';

// Get all image files
const imagesDir = path.join(__dirname, '..', 'public', 'images');
const imageFiles = fs.readdirSync(imagesDir).filter(f => /\.(jpg|jpeg|png|webp|svg|gif)$/i.test(f));

// Build mapping
const mapping = {};
imageFiles.forEach(filename => {
  const basename = filename.replace(/\.[^.]+$/, '');
  const ext = filename.match(/\.[^.]+$/)[0];
  mapping[`/images/${filename}`] = `${CLOUDINARY_BASE}/${basename}${ext}`;
});

console.log(`Found ${Object.keys(mapping).length} images to map`);

// Directories to search
const searchDirs = ['components', 'pages', 'content', 'lib', 'data', 'config'];

function processFile(filePath) {
  const stat = fs.statSync(filePath);
  // Skip files larger than 1MB
  if (stat.size > 1024 * 1024) {
    console.log(`Skipping large file: ${filePath}`);
    return false;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  for (const [localPath, cloudinaryUrl] of Object.entries(mapping)) {
    // Match various patterns
    const patterns = [
      // src="/images/file.jpg"
      new RegExp(`(src=["'])${localPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(["'])`, 'g'),
      // image: /images/file.jpg (in markdown frontmatter)
      new RegExp(`(image:\\s*)${localPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g'),
      // featuredImage: /images/file.jpg
      new RegExp(`(featuredImage:\\s*)${localPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g'),
      // heroImage: /images/file.jpg
      new RegExp(`(heroImage:\\s*)${localPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g'),
      // url("/images/file.jpg")
      new RegExp(`(url\\(["']?)${localPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(["']?\\))`, 'g'),
      // backgroundImage: "/images/file.jpg"
      new RegExp(`(backgroundImage:\\s*["'])${localPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(["'])`, 'g'),
      // "/images/file.jpg" in JSON
      new RegExp(`"${localPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'g'),
      // '/images/file.jpg' in JS
      new RegExp(`'${localPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'`, 'g'),
    ];

    for (const pattern of patterns) {
      if (pattern.test(content)) {
        content = content.replace(pattern, (match, prefix, suffix) => {
          if (prefix && suffix) {
            return `${prefix}${cloudinaryUrl}${suffix}`;
          } else if (prefix) {
            return `${prefix}${cloudinaryUrl}`;
          } else {
            // For quoted string replacement
            return match.startsWith('"') ? `"${cloudinaryUrl}"` : `'${cloudinaryUrl}'`;
          }
        });
        modified = true;
      }
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
}

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      walkDir(filePath, callback);
    } else if (stat.isFile() && /\.(js|jsx|ts|tsx|md|mdx|json|css)$/.test(file)) {
      callback(filePath);
    }
  });
}

const baseDir = path.join(__dirname, '..');
let updatedCount = 0;

searchDirs.forEach(dir => {
  walkDir(path.join(baseDir, dir), (filePath) => {
    if (processFile(filePath)) {
      console.log(`Updated: ${path.relative(baseDir, filePath)}`);
      updatedCount++;
    }
  });
});

console.log(`\nTotal files updated: ${updatedCount}`);
console.log('\nNext steps:');
console.log('1. Review the changes');
console.log('2. Run: npm run build to verify');
console.log('3. Delete public/images/ folder to reduce size');
