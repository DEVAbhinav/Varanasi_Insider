const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Cloudinary base URL
const CLOUDINARY_BASE = 'https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi';

// Get all image files
const imagesDir = path.join(__dirname, '..', 'public', 'images');
const imageFiles = fs.readdirSync(imagesDir).filter(f => /\.(jpg|jpeg|png|svg|gif)$/i.test(f));

console.log(`Processing ${imageFiles.length} images...`);

// Process each image
let replacements = 0;
for (const filename of imageFiles) {
  const basename = filename.replace(/\.[^.]+$/, '');
  const ext = filename.match(/\.[^.]+$/)[0];
  const localPath = `/images/${filename}`;
  const cloudinaryUrl = `${CLOUDINARY_BASE}/${basename}${ext}`;
  
  // Use grep + sed to find and replace
  const escapedLocal = localPath.replace(/\//g, '\\/').replace(/\./g, '\\.');
  const escapedCloud = cloudinaryUrl.replace(/\//g, '\\/');
  
  try {
    // Find files containing this image path
    const grepCmd = `grep -rl "${localPath}" components/ pages/ content/ lib/ data/ config/ 2>/dev/null || true`;
    const files = execSync(grepCmd, { cwd: path.join(__dirname, '..'), encoding: 'utf8' }).trim().split('\n').filter(Boolean);
    
    if (files.length > 0) {
      console.log(`\n${filename} found in ${files.length} files:`);
      for (const file of files) {
        // Replace in file
        const filePath = path.join(__dirname, '..', file);
        let content = fs.readFileSync(filePath, 'utf8');
        const newContent = content.split(localPath).join(cloudinaryUrl);
        if (content !== newContent) {
          fs.writeFileSync(filePath, newContent, 'utf8');
          console.log(`  Updated: ${file}`);
          replacements++;
        }
      }
    }
  } catch (err) {
    console.error(`Error processing ${filename}: ${err.message}`);
  }
}

console.log(`\n✅ Done! Made ${replacements} replacements.`);
console.log('\nNext: Run npm run build to verify, then delete public/images/');
