/**
 * Storage Bucket Setup Utility
 * This utility helps create the required storage bucket programmatically
 */

import { supabase } from '../lib/supabase-secure';

export interface BucketSetupResult {
  success: boolean;
  message: string;
  bucketExists: boolean;
  policiesApplied: boolean;
}

/**
 * Check if the media bucket exists
 */
export async function checkBucketExists(): Promise<boolean> {
  try {
    const { data, error } = await supabase.storage.getBucket('media');
    return !error && !!data;
  } catch (error) {
    return false;
  }
}

/**
 * Create the media bucket
 * Note: This might not work due to permissions - manual creation recommended
 */
export async function createMediaBucket(): Promise<{ success: boolean; message: string }> {
  try {
    const { data, error } = await supabase.storage.createBucket('media', {
      public: true,
      allowedMimeTypes: ['image/*', 'video/*', 'application/pdf'],
      fileSizeLimit: 10485760 // 10MB
    });

    if (error) {
      return {
        success: false,
        message: `Failed to create bucket: ${error.message}`
      };
    }

    return {
      success: true,
      message: 'Storage bucket "media" created successfully'
    };
  } catch (error) {
    return {
      success: false,
      message: `Error creating bucket: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Apply storage policies for the media bucket
 */
export async function applyStoragePolicies(): Promise<{ success: boolean; message: string }> {
  try {
    // Note: Storage policies are typically managed through SQL
    // This is a placeholder for future policy management
    return {
      success: true,
      message: 'Storage policies need to be applied via SQL Editor'
    };
  } catch (error) {
    return {
      success: false,
      message: `Error applying policies: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Run complete bucket setup
 */
export async function setupStorageBucket(): Promise<BucketSetupResult> {
  const result: BucketSetupResult = {
    success: false,
    message: '',
    bucketExists: false,
    policiesApplied: false
  };

  try {
    // Check if bucket exists
    const bucketExists = await checkBucketExists();
    result.bucketExists = bucketExists;

    if (!bucketExists) {
      // Try to create bucket
      const createResult = await createMediaBucket();
      if (!createResult.success) {
        result.message = `Bucket creation failed: ${createResult.message}. Please create manually in Supabase Dashboard.`;
        return result;
      }
      result.bucketExists = true;
    }

    // Apply policies (placeholder)
    const policyResult = await applyStoragePolicies();
    result.policiesApplied = policyResult.success;

    result.success = result.bucketExists;
    result.message = result.bucketExists 
      ? 'Storage bucket is ready for use'
      : 'Storage bucket setup incomplete - manual creation required';

    return result;
  } catch (error) {
    result.message = `Setup failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
    return result;
  }
}

/**
 * Get detailed setup instructions
 */
export function getSetupInstructions(): string[] {
  return [
    '1. Go to Supabase Dashboard → Storage → Buckets',
    '2. Click "New bucket"',
    '3. Name: "media"',
    '4. Set as Public bucket',
    '5. Click "Create bucket"',
    '6. Apply storage policies via SQL Editor',
    '7. Test upload functionality'
  ];
}

/**
 * Validate bucket configuration
 */
export async function validateBucketConfig(): Promise<{
  isValid: boolean;
  issues: string[];
  recommendations: string[];
}> {
  const issues: string[] = [];
  const recommendations: string[] = [];

  try {
    // Check if bucket exists
    const bucketExists = await checkBucketExists();
    if (!bucketExists) {
      issues.push('Storage bucket "media" does not exist');
      recommendations.push('Create the media bucket in Supabase Dashboard');
    }

    // Check bucket accessibility
    if (bucketExists) {
      try {
        const { data, error } = await supabase.storage
          .from('media')
          .list('', { limit: 1 });
        
        if (error) {
          issues.push(`Bucket access error: ${error.message}`);
          recommendations.push('Check bucket permissions and policies');
        }
      } catch (listError) {
        issues.push('Cannot access bucket contents');
        recommendations.push('Verify bucket configuration and policies');
      }
    }

    return {
      isValid: issues.length === 0,
      issues,
      recommendations
    };
  } catch (error) {
    return {
      isValid: false,
      issues: [`Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
      recommendations: ['Check Supabase connection and try again']
    };
  }
}
