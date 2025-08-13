const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuration - Update these with your current project details
const CURRENT_SUPABASE_URL = 'https://uumavtvxuncetfqwlgvp.supabase.co';
const CURRENT_SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key-here';

const supabase = createClient(CURRENT_SUPABASE_URL, CURRENT_SUPABASE_KEY);

async function exportStorageFiles() {
  console.log('🗄️ Exporting storage files...');
  
  try {
    // Create storage backup directory
    const storageDir = path.join(__dirname, 'storage');
    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir, { recursive: true });
    }

    // List all storage buckets
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('❌ Error fetching buckets:', bucketsError);
      return;
    }

    console.log(`📁 Found ${buckets.length} storage buckets`);

    for (const bucket of buckets) {
      console.log(`\n📂 Processing bucket: ${bucket.name}`);
      
      // Create bucket directory
      const bucketDir = path.join(storageDir, bucket.name);
      if (!fs.existsSync(bucketDir)) {
        fs.mkdirSync(bucketDir, { recursive: true });
      }

      // List all files in bucket
      const { data: files, error: filesError } = await supabase.storage
        .from(bucket.name)
        .list('', { limit: 1000, sortBy: { column: 'name', order: 'asc' } });

      if (filesError) {
        console.error(`❌ Error listing files in bucket ${bucket.name}:`, filesError);
        continue;
      }

      console.log(`📄 Found ${files.length} files in bucket ${bucket.name}`);

      // Download each file
      for (const file of files) {
        if (file.name) {
          try {
            const { data, error } = await supabase.storage
              .from(bucket.name)
              .download(file.name);

            if (error) {
              console.error(`❌ Error downloading ${file.name}:`, error);
              continue;
            }

            const filePath = path.join(bucketDir, file.name);
            const buffer = Buffer.from(await data.arrayBuffer());
            fs.writeFileSync(filePath, buffer);
            
            console.log(`✅ Downloaded: ${file.name}`);
          } catch (err) {
            console.error(`❌ Error processing file ${file.name}:`, err);
          }
        }
      }
    }

    // Create manifest file
    const manifest = {
      exportDate: new Date().toISOString(),
      projectId: 'uumavtvxuncetfqwlgvp',
      buckets: buckets.map(b => ({
        name: b.name,
        id: b.id,
        public: b.public,
        createdAt: b.created_at,
        updatedAt: b.updated_at
      }))
    };

    fs.writeFileSync(
      path.join(storageDir, 'manifest.json'),
      JSON.stringify(manifest, null, 2)
    );

    console.log('\n✅ Storage export completed!');
    console.log(`📁 Files saved to: ${storageDir}`);
    
  } catch (error) {
    console.error('❌ Export failed:', error);
  }
}

// Run the export
if (require.main === module) {
  exportStorageFiles();
}

module.exports = { exportStorageFiles };
