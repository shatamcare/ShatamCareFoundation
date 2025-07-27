/**
 * check-storage-files.js
 * 
 * Run this in browser console to see what files are actually in Supabase storage
 */

async function checkStorageFiles() {
  console.log('📁 Checking Supabase storage files...');
  
  try {
    // Check root level files
    const response = await fetch('https://uumavtvxuncetfqwlgvp.supabase.co/storage/v1/bucket/media', {
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1bWF2dHZ4dW5jZXRmcXdsZ3ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MjM2NTQsImV4cCI6MjA2NzI5OTY1NH0.AAoykuZmtZ3gLtbAXLjlYkyqaVUsghx84CP9nF1xkHU'
      }
    });
    
    if (response.ok) {
      console.log('✅ Storage bucket exists');
    } else {
      console.error('❌ Storage bucket check failed:', response.status);
    }
    
    // List files in the media bucket
    const listResponse = await fetch('https://uumavtvxuncetfqwlgvp.supabase.co/storage/v1/object/list/media', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1bWF2dHZ4dW5jZXRmcXdsZ3ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MjM2NTQsImV4cCI6MjA2NzI5OTY1NH0.AAoykuZmtZ3gLtbAXLjlYkyqaVUsghx84CP9nF1xkHU',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        limit: 100,
        offset: 0,
        sortBy: { column: "name", order: "asc" }
      })
    });
    
    if (listResponse.ok) {
      const files = await listResponse.json();
      console.log(`📄 Found ${files.length} files in storage:`);
      
      files.forEach(file => {
        const url = `https://uumavtvxuncetfqwlgvp.supabase.co/storage/v1/object/public/media/${encodeURIComponent(file.name)}`;
        console.log(`- ${file.name} (${url})`);
      });
      
      // Test a few URLs
      console.log('\n🔗 Testing some URLs...');
      const testFiles = files.slice(0, 3);
      
      for (const file of testFiles) {
        const url = `https://uumavtvxuncetfqwlgvp.supabase.co/storage/v1/object/public/media/${encodeURIComponent(file.name)}`;
        try {
          const testResponse = await fetch(url, { method: 'HEAD' });
          console.log(`${testResponse.ok ? '✅' : '❌'} ${file.name}: ${testResponse.status}`);
        } catch (error) {
          console.log(`❌ ${file.name}: Error testing URL`);
        }
      }
      
      return files;
      
    } else {
      console.error('❌ Failed to list files:', listResponse.status, await listResponse.text());
    }
    
  } catch (error) {
    console.error('❌ Error checking storage:', error);
  }
}

// Run the check
checkStorageFiles();

console.log(`
📁 Storage File Checker Loaded!

This will show you:
- What files are actually in your Supabase storage
- The correct URLs to access them
- Test if the URLs are working

If you see files with spaces in names, they should now work with the SafeImage fix!
`);
