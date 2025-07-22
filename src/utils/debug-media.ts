// Debug utilities for MediaPage troubleshooting

import { supabase } from '../lib/supabase-secure';
import { listMediaFiles, uploadFile, deleteFile } from './storage-alternative';

export async function debugMediaPage() {
  console.log('🔍 Starting MediaPage Debug...');
  
  // Test 1: Check Supabase client
  console.log('📡 Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
  console.log('🔑 Supabase Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
  
  // Test 2: Check if client is initialized
  try {
    const { data: user, error } = await supabase.auth.getUser();
    console.log('👤 Auth check:', { user: !!user, error: !!error });
  } catch (error) {
    console.error('❌ Auth error:', error);
  }
  
  // Test 3: Test storage listing
  console.log('📂 Testing storage listing...');
  try {
    const result = await listMediaFiles();
    console.log('✅ Storage list result:', result);
    console.log('📁 Files found:', result.files?.map(f => ({
      name: f.name,
      size: f.metadata?.size,
      created_at: f.created_at
    })));
  } catch (error) {
    console.error('❌ Storage list error:', error);
  }
  
  // Test 4: Direct storage check
  console.log('🗃️ Direct storage check...');
  try {
    const { data, error } = await supabase.storage.from('media').list('', { limit: 1 });
    console.log('✅ Direct list result:', { data, error });
  } catch (error) {
    console.error('❌ Direct list error:', error);
  }
  
  // Test 5: Check if URLs are accessible
  console.log('🔗 Testing image URLs...');
  try {
    const result = await listMediaFiles();
    if (result.success && result.files && result.files.length > 0) {
      const testFile = result.files[0];
      const testUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/media/${testFile.name}`;
      console.log('🌐 Testing URL:', testUrl);
      
      // Try to fetch the image
      const response = await fetch(testUrl, { method: 'HEAD' });
      console.log('📊 URL Response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers)
      });
    }
  } catch (error) {
    console.error('❌ URL test error:', error);
  }
  
  console.log('🔍 Debug complete!');
}

// Quick test function
export function testMediaDebug() {
  debugMediaPage().catch(console.error);
}
