/**
 * database-image-cleanup.ts
 * 
 * Utility to help clean up database entries with invalid image references
 */

import { supabase } from '../lib/supabase-secure';

/**
 * Finds events with invalid image URLs and suggests replacements
 */
export async function auditEventImages() {
  try {
    const { data: events, error } = await supabase
      .from('events')
      .select('id, title, image_url')
      .not('image_url', 'is', null);

    if (error) {
      console.error('Error fetching events:', error);
      return;
    }

    const invalidImages = events?.filter(event => 
      event.image_url && 
      event.image_url.startsWith('media/') && 
      !event.image_url.includes('supabase.co')
    ) || [];

    if (invalidImages.length > 0) {
      console.group('🔍 Events with potentially invalid image URLs:');
      invalidImages.forEach(event => {
        console.log(`- Event: "${event.title}" (ID: ${event.id})`);
        console.log(`  Current image: ${event.image_url}`);
        console.log(`  Suggested action: Update to use a valid image or remove image_url`);
      });
      console.groupEnd();
      
      return invalidImages;
    } else {
      console.log('✅ All event images appear to be valid');
      return [];
    }
  } catch (error) {
    console.error('Error during image audit:', error);
    return [];
  }
}

/**
 * Updates an event's image URL to a valid alternative
 */
export async function updateEventImage(eventId: string, newImageUrl: string | null) {
  try {
    const { data, error } = await supabase
      .from('events')
      .update({ image_url: newImageUrl })
      .eq('id', eventId)
      .select();

    if (error) {
      console.error('Error updating event image:', error);
      return false;
    }

    console.log(`✅ Updated event ${eventId} image to: ${newImageUrl || 'null'}`);
    return true;
  } catch (error) {
    console.error('Error updating event image:', error);
    return false;
  }
}

/**
 * Convenience function to run in the browser console for debugging
 */
export function runImageAudit() {
  auditEventImages().then(invalidImages => {
    if (invalidImages.length > 0) {
      console.log('\n💡 To fix these issues, you can:');
      console.log('1. Upload new images to Supabase Storage');
      console.log('2. Update the events to use existing valid images');
      console.log('3. Set image_url to null to use default placeholders');
      console.log('\nExample: updateEventImage("event-id", null)');
    }
  });
}
