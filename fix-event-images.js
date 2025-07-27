/**
 * fix-event-images.js
 * 
 * Run this in browser console to check and fix event images with relative paths
 */

// Check what events have relative image paths
async function checkEventImages() {
  console.log('🔍 Checking event images...');
  
  try {
    const response = await fetch('https://uumavtvxuncetfqwlgvp.supabase.co/rest/v1/events?select=*', {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1bWF2dHZ4dW5jZXRmcXdsZ3ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MjM2NTQsImV4cCI6MjA2NzI5OTY1NH0.AAoykuZmtZ3gLtbAXLjlYkyqaVUsghx84CP9nF1xkHU',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1bWF2dHZ4dW5jZXRmcXdsZ3ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MjM2NTQsImV4cCI6MjA2NzI5OTY1NH0.AAoykuZmtZ3gLtbAXLjlYkyqaVUsghx84CP9nF1xkHU'
      }
    });
    
    const events = await response.json();
    
    console.log(`📊 Found ${events.length} events`);
    
    const eventsWithRelativePaths = events.filter(event => 
      event.image_url && event.image_url.startsWith('media/')
    );
    
    console.log(`📁 Events with relative paths: ${eventsWithRelativePaths.length}`);
    
    eventsWithRelativePaths.forEach(event => {
      console.log(`- ${event.title}: ${event.image_url}`);
    });
    
    return eventsWithRelativePaths;
    
  } catch (error) {
    console.error('❌ Error checking events:', error);
  }
}

// Run the check
checkEventImages();

// Manual fix function (call this if needed)
async function fixEventImage(eventId, newImageUrl) {
  try {
    const response = await fetch(`https://uumavtvxuncetfqwlgvp.supabase.co/rest/v1/events?id=eq.${eventId}`, {
      method: 'PATCH',
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1bWF2dHZ4dW5jZXRmcXdsZ3ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MjM2NTQsImV4cCI6MjA2NzI5OTY1NH0.AAoykuZmtZ3gLtbAXLjlYkyqaVUsghx84CP9nF1xkHU',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1bWF2dHZ4dW5jZXRmcXdsZ3ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MjM2NTQsImV4cCI6MjA2NzI5OTY1NH0.AAoykuZmtZ3gLtbAXLjlYkyqaVUsghx84CP9nF1xkHU',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        image_url: newImageUrl
      })
    });
    
    if (response.ok) {
      console.log(`✅ Fixed event ${eventId}`);
    } else {
      console.error(`❌ Failed to fix event ${eventId}:`, await response.text());
    }
  } catch (error) {
    console.error(`❌ Error fixing event ${eventId}:`, error);
  }
}

console.log(`
🛠️ Event Image Fixer Loaded!

Commands:
- checkEventImages() - Check which events have relative paths
- fixEventImage(eventId, newImageUrl) - Fix a specific event

The SafeImage component should now handle relative paths automatically,
but you can use these functions to permanently fix the database if needed.
`);
