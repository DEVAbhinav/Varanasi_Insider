const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dkntlqbwr',
  api_key: '715287725442418',
  api_secret: 'luxe_hivkI3dDu2rrlnLe1Z8YPE'
});

const infographicsDir = path.join(__dirname, '../public/images/infographics');

// List of infographics to upload
const infographics = [
  'lucknow-varanasi-flight-train-taxi-comparison.png',
  'lucknow-varanasi-86-trains-filter.png',
  'lucknow-varanasi-nawabi-to-shiva-journey.png',
  'ayodhya-varanasi-complete-guide.png',
  'ayodhya-station-confusion-comparison.png',
  'ayodhya-varanasi-vande-bharat-taxi-calculator.png',
  'prayagraj-varanasi-same-day-timeline.png',
  'prayagraj-varanasi-shortest-route-comparison.png',
  'prayagraj-kumbh-mela-2026-calendar.png',
  'gaya-varanasi-express-vs-direct-train.png',
  'gaya-varanasi-ancestor-liberation-circuit.png'
];

async function uploadInfographics() {
  // Check if directory exists
  if (!fs.existsSync(infographicsDir)) {
    console.error(`❌ Directory not found: ${infographicsDir}`);
    console.log('\nPlease ensure all infographic images are saved to:');
    console.log('  /public/images/infographics/\n');
    return;
  }

  const existingFiles = fs.readdirSync(infographicsDir).filter(f => 
    /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(f)
  );
  
  console.log(`📁 Found ${existingFiles.length} images in infographics folder`);
  console.log(`📋 Expected ${infographics.length} infographics\n`);
  
  const results = [];
  const missing = [];
  
  for (const file of infographics) {
    const filePath = path.join(infographicsDir, file);
    
    if (!fs.existsSync(filePath)) {
      missing.push(file);
      console.log(`⏭️  Skipped: ${file} (file not found)`);
      continue;
    }

    const publicId = `kashitaxi/infographics/${path.parse(file).name}`;
    
    try {
      console.log(`⬆️  Uploading: ${file}...`);
      const result = await cloudinary.uploader.upload(filePath, {
        public_id: publicId,
        overwrite: true,
        resource_type: 'image',
        folder: 'kashitaxi/infographics',
        tags: ['infographic', 'taxi-routes', 'kashitaxi']
      });
      
      results.push({
        original: `/images/infographics/${file}`,
        cloudinary: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        size: result.bytes
      });
      
      console.log(`   ✅ Success -> ${result.secure_url}`);
      console.log(`   📐 Dimensions: ${result.width}x${result.height}px`);
      console.log(`   💾 Size: ${(result.bytes / 1024).toFixed(2)} KB\n`);
    } catch (err) {
      console.error(`   ❌ Failed: ${file} - ${err.message}\n`);
    }
  }
  
  // Save mapping for reference
  const mappingPath = path.join(__dirname, 'cloudinary-infographics-mapping.json');
  fs.writeFileSync(
    mappingPath,
    JSON.stringify(results, null, 2)
  );
  
  console.log('━'.repeat(60));
  console.log(`\n✅ Uploaded ${results.length}/${infographics.length} infographics`);
  console.log(`📄 Mapping saved to: scripts/cloudinary-infographics-mapping.json`);
  
  if (missing.length > 0) {
    console.log(`\n⚠️  Missing files (${missing.length}):`);
    missing.forEach(file => console.log(`   - ${file}`));
    console.log('\n💡 Tip: Save these infographic designs to /public/images/infographics/');
  }
  
  console.log('\n━'.repeat(60));
}

uploadInfographics().catch(console.error);
