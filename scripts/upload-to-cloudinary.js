const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dkntlqbwr',
  api_key: '715287725442418',
  api_secret: 'luxe_hivkI3dDu2rrlnLe1Z8YPE'
});

const imagesDir = path.join(__dirname, '../public/images');

async function uploadImages() {
  const files = fs.readdirSync(imagesDir).filter(f => 
    /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(f)
  );
  
  console.log(`Found ${files.length} images to upload...`);
  
  const results = [];
  
  for (const file of files) {
    const filePath = path.join(imagesDir, file);
    const publicId = `kashitaxi/${path.parse(file).name}`;
    
    try {
      console.log(`Uploading: ${file}...`);
      const result = await cloudinary.uploader.upload(filePath, {
        public_id: publicId,
        overwrite: true,
        resource_type: 'image'
      });
      results.push({
        original: `/images/${file}`,
        cloudinary: result.secure_url,
        publicId: result.public_id
      });
      console.log(`  ✓ ${file} -> ${result.secure_url}`);
    } catch (err) {
      console.error(`  ✗ Failed: ${file} - ${err.message}`);
    }
  }
  
  // Save mapping for reference
  fs.writeFileSync(
    path.join(__dirname, 'cloudinary-mapping.json'),
    JSON.stringify(results, null, 2)
  );
  
  console.log(`\nUploaded ${results.length}/${files.length} images`);
  console.log('Mapping saved to scripts/cloudinary-mapping.json');
}

uploadImages().catch(console.error);
