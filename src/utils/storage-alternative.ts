import { supabase } from '../lib/supabase-secure';

// Alternative storage functions that avoid the problematic getBucket() call

export async function checkBucketExistsAlternative(): Promise<boolean> {
  try {
    // Instead of getBucket(), try to list files - this works even if getBucket() fails
    const { data, error } = await supabase.storage.from('media').list('', { limit: 1 });
    
    if (error) {
      // If we get a "Bucket not found" error, bucket doesn't exist
      if (error.message?.includes('bucket') && error.message?.includes('not found')) {
        return false;
      }
      // For other errors, assume bucket exists but has permission issues
      return true;
    }
    
    // If we can list files, bucket definitely exists
    return true;
  } catch (error) {
    console.warn('Bucket check failed, assuming it exists:', error);
    return true;
  }
}

export async function testStorageUpload(): Promise<{ success: boolean; error?: string }> {
  try {
    const testContent = new Blob(['test upload'], { type: 'text/plain' });
    const testPath = `test-${Date.now()}.txt`;
    
    const { data, error } = await supabase.storage
      .from('media')
      .upload(testPath, testContent);
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    // Clean up test file
    await supabase.storage.from('media').remove([testPath]);
    
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

export async function uploadFile(file: File, path: string): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const { data, error } = await supabase.storage
      .from('media')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type, // Preserve original file type
      });
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(path);
    
    return { success: true, url: publicUrl };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

interface StorageFile {
  name: string;
  id?: string;
  updated_at?: string;
  created_at?: string;
  last_accessed_at?: string;
  metadata?: {
    eTag?: string;
    size?: number;
    mimetype?: string;
    cacheControl?: string;
    lastModified?: string;
    contentLength?: number;
    httpStatusCode?: number;
  };
}

export async function listMediaFiles(): Promise<{ success: boolean; files?: StorageFile[]; error?: string }> {
  try {
    // First, list all items in the root
    const { data: rootItems, error: rootError } = await supabase.storage
      .from('media')
      .list('', {
        limit: 100,
        offset: 0
      });
    
    if (rootError) {
      return { success: false, error: rootError.message };
    }
    
    const allFiles: StorageFile[] = [];
    
    for (const item of rootItems || []) {
      if (item.name.includes('.')) {
        // It's a file (has extension)
        allFiles.push(item);
      } else {
        // It's a folder, list its contents
        const { data: folderFiles, error: folderError } = await supabase.storage
          .from('media')
          .list(item.name, {
            limit: 100,
            offset: 0
          });
        
        if (!folderError && folderFiles) {
          // Add folder path to each file
          const filesWithPath = folderFiles.map(file => ({
            ...file,
            name: `${item.name}/${file.name}`
          }));
          allFiles.push(...filesWithPath);
        }
      }
    }
    
    return { success: true, files: allFiles };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

export async function deleteFile(path: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.storage
      .from('media')
      .remove([path]);
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}
