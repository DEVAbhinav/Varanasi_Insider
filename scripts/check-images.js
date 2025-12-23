#!/usr/bin/env node
/**
 * Image 404 Checker for Varanasi_Insider
 * Scans content, components, and pages for image references and reports missing images
 * 
 * Usage:
 *   node scripts/check-images.js           # Check for broken images
 *   node scripts/check-images.js --fix     # Fix broken images (remove or replace)
 *   node scripts/check-images.js --report  # Generate detailed JSON report
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.join(__dirname, '..');
const PUBLIC_DIR = path.join(PROJECT_ROOT, 'public');
const CONTENT_DIR = path.join(PROJECT_ROOT, 'content');
const PAGES_DIR = path.join(PROJECT_ROOT, 'pages');
const COMPONENTS_DIR = path.join(PROJECT_ROOT, 'components');

// Supported image extensions
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif', '.ico', '.avif'];

// Collect all existing images in public folder
const existingImages = new Map(); // lowercase path -> actual path (for case-insensitive matching)
const brokenImages = [];
const imageUsage = new Map(); // Track where each broken image appears

// ============== HELPER FUNCTIONS ==============

function collectFiles(dir, extensions, results = []) {
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '.git', '.next', 'test-results'].includes(entry.name)) continue;
      collectFiles(fullPath, extensions, results);
    } else if (extensions.some(ext => entry.name.toLowerCase().endsWith(ext))) {
      results.push(fullPath);
    }
  }
  return results;
}

function buildExistingImagesIndex() {
  console.log('📁 Building image index from public folder...');
  
  const allImages = collectFiles(PUBLIC_DIR, IMAGE_EXTENSIONS);
  
  for (const imagePath of allImages) {
    // Store relative path from public folder
    const relativePath = '/' + path.relative(PUBLIC_DIR, imagePath).replace(/\\/g, '/');
    existingImages.set(relativePath.toLowerCase(), relativePath);
    
    // Also index just the filename for fuzzy matching
    const filename = path.basename(imagePath).toLowerCase();
    if (!existingImages.has(filename)) {
      existingImages.set(filename, relativePath);
    }
  }
  
  console.log(`   Found ${existingImages.size / 2} images in public/\n`);
}

// ============== IMAGE EXTRACTION PATTERNS ==============

// Markdown image patterns - handle optional title: ![alt](path "title") or ![alt](path)
const MARKDOWN_IMAGE_REGEX = /!\[([^\]]*)\]\(([^\s")]+)(?:\s+"[^"]*")?\)/g;
const MARKDOWN_FRONTMATTER_IMAGE = /^(image|featuredImage|heroImage|ogImage|thumbnail):\s*['"]?([^'"\n]+?)['"]?\s*$/gm;

// JSX/HTML patterns
const JSX_SRC_REGEX = /(?:src|href)=["']([^"']+\.(?:jpg|jpeg|png|webp|svg|gif|ico|avif))["']/gi;
const JSX_IMAGE_IMPORT = /(?:from|require\()['"]([^'"]+\.(?:jpg|jpeg|png|webp|svg|gif|ico|avif))['"](?:\))?/gi;
const NEXT_IMAGE_SRC = /<Image[^>]*src=["']([^"']+)["']/gi;
const BACKGROUND_IMAGE = /(?:backgroundImage|background):\s*(?:url\()?['"]?([^'")]+\.(?:jpg|jpeg|png|webp|svg|gif))['"]?\)?/gi;

// CSS url() pattern
const CSS_URL_REGEX = /url\(['"]?([^'")]+\.(?:jpg|jpeg|png|webp|svg|gif|ico))['"]?\)/gi;

function extractImagePaths(content, filePath) {
  const images = new Set();
  const ext = path.extname(filePath).toLowerCase();
  
  // For markdown files
  if (ext === '.md') {
    // Frontmatter images
    let match;
    while ((match = MARKDOWN_FRONTMATTER_IMAGE.exec(content)) !== null) {
      images.add(match[2].trim());
    }
    // Inline markdown images
    while ((match = MARKDOWN_IMAGE_REGEX.exec(content)) !== null) {
      images.add(match[2].trim());
    }
    // HTML img tags in markdown
    while ((match = JSX_SRC_REGEX.exec(content)) !== null) {
      images.add(match[1]);
    }
  }
  
  // For JS/JSX/TSX files
  if (['.js', '.jsx', '.ts', '.tsx'].includes(ext)) {
    let match;
    while ((match = JSX_SRC_REGEX.exec(content)) !== null) {
      images.add(match[1]);
    }
    while ((match = NEXT_IMAGE_SRC.exec(content)) !== null) {
      images.add(match[1]);
    }
    while ((match = BACKGROUND_IMAGE.exec(content)) !== null) {
      images.add(match[1]);
    }
    while ((match = JSX_IMAGE_IMPORT.exec(content)) !== null) {
      images.add(match[1]);
    }
  }
  
  // For CSS files
  if (['.css', '.scss'].includes(ext)) {
    let match;
    while ((match = CSS_URL_REGEX.exec(content)) !== null) {
      images.add(match[1]);
    }
  }
  
  return Array.from(images);
}

// ============== IMAGE VALIDATION ==============

function isExternalUrl(url) {
  return url.startsWith('http://') || 
         url.startsWith('https://') || 
         url.startsWith('//') ||
         url.startsWith('data:');
}

function normalizeImagePath(imagePath, sourceFile) {
  // Skip external URLs
  if (isExternalUrl(imagePath)) return null;
  
  // Skip Next.js special paths
  if (imagePath.startsWith('/_next/')) return null;
  
  // Clean up the path
  let cleanPath = imagePath
    .split('?')[0]  // Remove query params
    .split('#')[0]; // Remove hash
  
  // Handle relative paths
  if (!cleanPath.startsWith('/')) {
    // For paths like "../images/foo.jpg" or "./images/foo.jpg"
    if (cleanPath.startsWith('.')) {
      const sourceDir = path.dirname(sourceFile);
      cleanPath = '/' + path.relative(PROJECT_ROOT, path.resolve(sourceDir, cleanPath)).replace(/\\/g, '/');
      // If resolved path starts with public/, strip it
      cleanPath = cleanPath.replace(/^\/public\//, '/');
    } else {
      // Assume it's relative to public/
      cleanPath = '/' + cleanPath;
    }
  }
  
  // Ensure path starts with /
  if (!cleanPath.startsWith('/')) {
    cleanPath = '/' + cleanPath;
  }
  
  return cleanPath;
}

function imageExists(imagePath) {
  // Direct match (case-sensitive)
  if (existingImages.has(imagePath.toLowerCase())) {
    return { exists: true, actualPath: existingImages.get(imagePath.toLowerCase()) };
  }
  
  // Try without leading slash
  const withoutSlash = imagePath.replace(/^\//, '').toLowerCase();
  if (existingImages.has(withoutSlash)) {
    return { exists: true, actualPath: existingImages.get(withoutSlash) };
  }
  
  // Check if file exists directly (for paths outside public/)
  const fullPath = path.join(PUBLIC_DIR, imagePath);
  if (fs.existsSync(fullPath)) {
    return { exists: true, actualPath: imagePath };
  }
  
  return { exists: false, actualPath: null };
}

function findSimilarImage(brokenPath) {
  const brokenFilename = path.basename(brokenPath).toLowerCase();
  const brokenBasename = brokenFilename.replace(/\.[^.]+$/, '');
  
  const suggestions = [];
  
  for (const [key, actualPath] of existingImages.entries()) {
    const existingFilename = path.basename(actualPath).toLowerCase();
    const existingBasename = existingFilename.replace(/\.[^.]+$/, '');
    
    // Exact filename match (different case or path)
    if (existingFilename === brokenFilename) {
      suggestions.push({ path: actualPath, score: 100, reason: 'exact filename match' });
      continue;
    }
    
    // Same base name, different extension
    if (existingBasename === brokenBasename) {
      suggestions.push({ path: actualPath, score: 90, reason: 'same name, different extension' });
      continue;
    }
    
    // Levenshtein-like similarity for filenames
    const similarity = calculateSimilarity(brokenBasename, existingBasename);
    if (similarity > 0.7) {
      suggestions.push({ path: actualPath, score: Math.round(similarity * 80), reason: 'similar name' });
    }
  }
  
  // Sort by score descending and return top 3
  return suggestions
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

function calculateSimilarity(str1, str2) {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

function levenshteinDistance(str1, str2) {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}

// ============== SCANNING ==============

// Manual mappings for known broken images → best replacement
const MANUAL_MAPPINGS = {
  '/images/tempo-traveller-fleet.jpg': '/images/Tempo-Travellar_landscape_Village.jpeg',
  '/images/varanasi-ghat-evening-p.jpeg': '/images/varanashi-ghat-evening-P.jpeg',
  '/images/ganga-aarti2.jpeg': '/images/ganga-aarti.jpeg',
  '/images/varanasi-ghats-morning.jpeg': '/images/varanasi-ghat-early-morning.jpeg',
  '/images/Vindhyachal2.jpg': '/images/Vindhyachal1.jpg',
  '/images/varanasi-river-bajra.jpeg': '/images/varanasi-boat-eve-l.jpeg',
  '/images/GayaTaxi.jpg': '/images/seden.png',
  '/images/trust-badge-1.png': null, // Remove - doesn't exist
  '/images/trust-badge-2.png': null,
  '/images/trust-badge-3.png': null,
  '/images/trust-badge-4.png': null,
  '/images/posts/about-banarasi-kashitaxi.jpg': '/images/aboutUs.svg',
  '/images/posts/contact-banarasi-kashitaxi.jpg': '/images/aboutUs.svg',
  '/images/about-us-hero.jpeg': '/images/aboutUs.svg',
  '/images/Temp-Travellar-Inside_Square_1by1.jpeg': '/images/tempo-travellar-inside.jpeg',
  '/images/Tempo_travellar_neon_inside.jpeg': '/images/tempo-travellar-inside.jpeg',
  '/images/varanasi%20tourist%20map-flat-lanscape.jpeg': '/images/varanasi tourist map-flat-lanscape.jpeg',
  '/images/varanasi-tourist-map-flat-landscape.jpeg': '/images/varanasi tourist map-flat-lanscape.jpeg',
};

function scanFiles() {
  console.log('🔍 Scanning files for image references...\n');
  
  const allFiles = [
    ...collectFiles(CONTENT_DIR, ['.md']),
    ...collectFiles(PAGES_DIR, ['.js', '.jsx', '.ts', '.tsx']),
    ...collectFiles(COMPONENTS_DIR, ['.js', '.jsx', '.ts', '.tsx']),
    ...collectFiles(path.join(PROJECT_ROOT, 'styles'), ['.css', '.scss']),
  ];
  
  console.log(`   Scanning ${allFiles.length} files...\n`);
  
  let totalImagesChecked = 0;
  
  for (const file of allFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const images = extractImagePaths(content, file);
    
    for (const imagePath of images) {
      const normalizedPath = normalizeImagePath(imagePath, file);
      if (!normalizedPath) continue; // Skip external/special URLs
      
      totalImagesChecked++;
      const result = imageExists(normalizedPath);
      
      if (!result.exists) {
        const relativeSource = path.relative(PROJECT_ROOT, file);
        
        // Track this broken image
        if (!imageUsage.has(normalizedPath)) {
          imageUsage.set(normalizedPath, []);
          
          // Check manual mapping first
          const manualReplacement = MANUAL_MAPPINGS[normalizedPath];
          let suggestions = [];
          if (manualReplacement !== undefined) {
            if (manualReplacement === null) {
              suggestions = [{ path: null, score: 100, reason: 'remove (no replacement)' }];
            } else {
              suggestions = [{ path: manualReplacement, score: 100, reason: 'manual mapping' }];
            }
          } else {
            suggestions = findSimilarImage(normalizedPath);
          }
          
          brokenImages.push({
            path: normalizedPath,
            originalPath: imagePath,
            suggestions,
          });
        }
        imageUsage.get(normalizedPath).push(relativeSource);
      }
    }
  }
  
  console.log(`   Total image references checked: ${totalImagesChecked}`);
  console.log(`   Broken images found: ${brokenImages.length}\n`);
}

// ============== FIXING ==============

function fixBrokenImages() {
  console.log('🔧 Attempting to fix broken images...\n');
  
  let fixedCount = 0;
  let removedCount = 0;
  let manualCount = 0;
  
  for (const broken of brokenImages) {
    const sources = imageUsage.get(broken.path) || [];
    const bestSuggestion = broken.suggestions[0];
    
    for (const sourceFile of sources) {
      const fullPath = path.join(PROJECT_ROOT, sourceFile);
      let content = fs.readFileSync(fullPath, 'utf-8');
      const originalContent = content;
      
      // Handle removal case (null path)
      if (bestSuggestion && bestSuggestion.path === null) {
        if (sourceFile.endsWith('.md')) {
          // Remove markdown image syntax
          const mdImagePattern = new RegExp(`!\\[[^\\]]*\\]\\(${escapeRegex(broken.originalPath)}(?:\\s+"[^"]*")?\\)`, 'g');
          content = content.replace(mdImagePattern, '');
          
          // Remove frontmatter image line
          const frontmatterPattern = new RegExp(`^(image|featuredImage|heroImage|ogImage|thumbnail):\\s*['"]?${escapeRegex(broken.originalPath)}['"]?\\s*$`, 'gm');
          content = content.replace(frontmatterPattern, '');
        } else if (sourceFile.endsWith('.js') || sourceFile.endsWith('.jsx')) {
          // Remove JSX image lines
          const jsxSrcPattern = new RegExp(`src=["']${escapeRegex(broken.originalPath)}["']`, 'g');
          content = content.replace(jsxSrcPattern, 'src=""');
        }
        
        if (content !== originalContent) {
          fs.writeFileSync(fullPath, content, 'utf-8');
          console.log(`   🗑️  Removed from ${sourceFile}: ${broken.originalPath}`);
          removedCount++;
        }
        continue;
      }
      
      // Replace with best match if score >= 58 (lower threshold for more matches)
      if (bestSuggestion && bestSuggestion.score >= 58) {
        content = content.split(broken.originalPath).join(bestSuggestion.path);
        
        if (content !== originalContent) {
          fs.writeFileSync(fullPath, content, 'utf-8');
          console.log(`   ✅ Fixed in ${sourceFile}:`);
          console.log(`      ${broken.originalPath} → ${bestSuggestion.path}`);
          fixedCount++;
        }
      } else {
        // No good match - remove image reference for markdown or flag for manual
        if (sourceFile.endsWith('.md')) {
          // Remove markdown image syntax
          const mdImagePattern = new RegExp(`!\\[[^\\]]*\\]\\(${escapeRegex(broken.originalPath)}(?:\\s+"[^"]*")?\\)`, 'g');
          content = content.replace(mdImagePattern, '');
          
          // Remove frontmatter image line
          const frontmatterPattern = new RegExp(`^(image|featuredImage|heroImage|ogImage|thumbnail):\\s*['"]?${escapeRegex(broken.originalPath)}['"]?\\s*$`, 'gm');
          content = content.replace(frontmatterPattern, '');
          
          if (content !== originalContent) {
            fs.writeFileSync(fullPath, content, 'utf-8');
            console.log(`   🗑️  Removed from ${sourceFile}: ${broken.originalPath}`);
            removedCount++;
          }
        } else {
          console.log(`   ⚠️  Manual fix needed in ${sourceFile}: ${broken.originalPath}`);
          manualCount++;
        }
      }
    }
  }
  
  console.log(`\n   Fixed: ${fixedCount}, Removed: ${removedCount}, Manual: ${manualCount}`);
}

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ============== REPORTING ==============

function printReport() {
  if (brokenImages.length === 0) {
    console.log('✅ No broken images found!\n');
    return;
  }
  
  console.log('❌ BROKEN IMAGES REPORT\n');
  console.log('=' .repeat(80) + '\n');
  
  for (const broken of brokenImages) {
    const sources = imageUsage.get(broken.path) || [];
    
    console.log(`📷 ${broken.path}`);
    console.log(`   Original: ${broken.originalPath}`);
    console.log(`   Used in ${sources.length} file(s):`);
    sources.forEach(s => console.log(`      - ${s}`));
    
    if (broken.suggestions.length > 0) {
      console.log('   Suggestions:');
      broken.suggestions.forEach(s => {
        console.log(`      → ${s.path} (${s.score}% - ${s.reason})`);
      });
    } else {
      console.log('   Suggestions: None found');
    }
    console.log('');
  }
  
  console.log('=' .repeat(80));
  console.log(`\nSummary: ${brokenImages.length} broken images in ${countUniqueFiles()} files`);
}

function countUniqueFiles() {
  const files = new Set();
  for (const sources of imageUsage.values()) {
    sources.forEach(s => files.add(s));
  }
  return files.size;
}

function generateJsonReport() {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalBroken: brokenImages.length,
      totalFiles: countUniqueFiles(),
    },
    brokenImages: brokenImages.map(b => ({
      ...b,
      sources: imageUsage.get(b.path) || [],
    })),
  };
  
  const reportPath = path.join(PROJECT_ROOT, 'broken-images-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n📄 JSON report saved to: broken-images-report.json`);
}

// ============== MAIN ==============

function main() {
  const args = process.argv.slice(2);
  const shouldFix = args.includes('--fix');
  const shouldReport = args.includes('--report');
  
  console.log('\n🖼️  IMAGE 404 CHECKER\n');
  console.log('=' .repeat(50) + '\n');
  
  buildExistingImagesIndex();
  scanFiles();
  
  if (brokenImages.length > 0) {
    printReport();
    
    if (shouldFix) {
      fixBrokenImages();
    } else {
      console.log('\n💡 Run with --fix to automatically fix/remove broken images');
    }
    
    if (shouldReport) {
      generateJsonReport();
    }
  } else {
    console.log('✅ All image references are valid!\n');
  }
}

main();
