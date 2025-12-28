#!/bin/bash
# Batch upload all images to Cloudinary

OUTPUT_FILE="scripts/cloudinary-mappings.json"
echo "{" > "$OUTPUT_FILE"
first=true

for file in public/images/*.{jpg,jpeg,png,webp,svg,gif} 2>/dev/null; do
  if [ -f "$file" ]; then
    filename=$(basename "$file")
    echo "Uploading: $filename"
    
    # Use public_id to preserve original filename
    basename_no_ext="${filename%.*}"
    
    response=$(curl -s -X POST "https://api.cloudinary.com/v1_1/dkntlqbwr/image/upload" \
      -F "file=@$file" \
      -F "upload_preset=kashitaxi_preset" \
      -F "public_id=kashitaxi/$basename_no_ext" \
      --max-time 120)
    
    secure_url=$(echo "$response" | grep -o '"secure_url":"[^"]*"' | cut -d'"' -f4)
    
    if [ -n "$secure_url" ]; then
      if [ "$first" = true ]; then
        first=false
      else
        echo "," >> "$OUTPUT_FILE"
      fi
      echo "  \"/images/$filename\": \"$secure_url\"" >> "$OUTPUT_FILE"
      echo "  ✓ $filename -> $secure_url"
    else
      echo "  ✗ Failed: $filename"
      echo "    Response: $response"
    fi
  fi
done

echo "" >> "$OUTPUT_FILE"
echo "}" >> "$OUTPUT_FILE"

echo ""
echo "Mapping saved to $OUTPUT_FILE"
