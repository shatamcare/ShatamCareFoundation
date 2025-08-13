const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuration - Update these with your NEW project details
const NEW_SUPABASE_URL = 'https://[NEW_PROJECT_ID].supabase.co';
const NEW_SUPABASE_KEY = 'your-new-anon-key-here';
const NEW_SERVICE_ROLE_KEY = 'your-new-service-role-key-here'; // Required for storage operations

const supabase = createClient(NEW_SUPABASE_URL, NEW_SERVICE_ROLE_KEY);

async function importStorageFiles() {
  console.log('📤 Importing storage files to new project...');
  
  try {
    const storageDir = path.join(__dirname, 'storage');
    
    if (!fs.existsSync(storageDir)) {
      console.error('❌ Storage backup directory not found. Run export-storage.js first.');
      return;
    }

    // Read manifest
    const manifestPath = path.join(storageDir, 'manifest.json');
    if (!fs.existsSync(manifestPath)) {
      console.error('❌ Storage manifest not found.');
      return;
    }

    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    console.log(`📋 Found manifest with ${manifest.buckets.length} buckets`);

    for (const bucketInfo of manifest.buckets) {
      console.log(`\n🪣 Creating bucket: ${bucketInfo.name}`);
      
      // Create bucket in new project
      const { data: bucket, error: bucketError } = await supabase.storage.createBucket(
        bucketInfo.name,
        { public: bucketInfo.public }
      );

      if (bucketError && !bucketError.message.includes('already exists')) {
        console.error(`❌ Error creating bucket ${bucketInfo.name}:`, bucketError);
        continue;
      }

      const bucketDir = path.join(storageDir, bucketInfo.name);
      
      if (!fs.existsSync(bucketDir)) {
        console.log(`⚠️ No files found for bucket ${bucketInfo.name}`);
        continue;
      }

      // Upload files from bucket directory
      const files = fs.readdirSync(bucketDir);
      console.log(`📁 Uploading ${files.length} files to bucket ${bucketInfo.name}`);

      for (const fileName of files) {
        const filePath = path.join(bucketDir, fileName);
        
        if (fs.statSync(filePath).isFile()) {
          try {
            const fileBuffer = fs.readFileSync(filePath);
            
            const { data, error } = await supabase.storage
              .from(bucketInfo.name)
              .upload(fileName, fileBuffer, {
                upsert: true,
                contentType: getContentType(fileName)
              });

            if (error) {
              console.error(`❌ Error uploading ${fileName}:`, error);
              continue;
            }

            console.log(`✅ Uploaded: ${fileName}`);
          } catch (err) {
            console.error(`❌ Error processing file ${fileName}:`, err);
          }
        }
      }
    }

    console.log('\n✅ Storage import completed!');
    
  } catch (error) {
    console.error('❌ Import failed:', error);
  }
}

function getContentType(fileName) {
  const ext = path.extname(fileName).toLowerCase();
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.txt': 'text/plain',
    '.csv': 'text/csv',
    '.json': 'application/json',
    '.mp4': 'video/mp4',
    '.avi': 'video/avi',
    '.mov': 'video/quicktime'
  };
  
  return mimeTypes[ext] || 'application/octet-stream';
}

// Configuration validation
function validateConfig() {
  if (NEW_SUPABASE_URL.includes('[NEW_PROJECT_ID]')) {
    console.error('❌ Please update NEW_SUPABASE_URL with your actual new project URL');
    return false;
  }
  
  if (NEW_SUPABASE_KEY === 'your-new-anon-key-here') {
    console.error('❌ Please update NEW_SUPABASE_KEY with your actual new project anon key');
    return false;
  }
  
  if (NEW_SERVICE_ROLE_KEY === 'your-new-service-role-key-here') {
    console.error('❌ Please update NEW_SERVICE_ROLE_KEY with your actual new project service role key');
    return false;
  }
  
  return true;
}

// Run the import
if (require.main === module) {
  if (validateConfig()) {
    importStorageFiles();
  }
}

module.exports = { importStorageFiles };
