/**
 * Deployment Checker Utility
 * Validates if all required infrastructure is properly set up
 */

import { supabase } from '../lib/supabase-secure';
import { logAdminActivity } from '../lib/supabase-secure';

export interface DeploymentCheckResult {
  isReady: boolean;
  checks: {
    database: {
      name: string;
      status: 'success' | 'error' | 'warning';
      message: string;
    }[];
    storage: {
      name: string;
      status: 'success' | 'error' | 'warning';
      message: string;
    }[];
    auth: {
      name: string;
      status: 'success' | 'error' | 'warning';
      message: string;
    }[];
  };
  nextSteps: string[];
}

/**
 * Check if all required database tables exist
 */
export async function checkDatabaseTables(): Promise<{ status: 'success' | 'error'; message: string; tables: string[] }> {
  try {
    const requiredTables = ['site_settings', 'content_items', 'media_files', 'admin_activity_log'];
    const foundTables: string[] = [];
    
    for (const table of requiredTables) {
      try {
        const { error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (!error) {
          foundTables.push(table);
        }
      } catch (err) {
        // Table doesn't exist
      }
    }
    
    if (foundTables.length === requiredTables.length) {
      return {
        status: 'success',
        message: 'All required database tables are present',
        tables: foundTables
      };
    } else {
      const missingTables = requiredTables.filter(table => !foundTables.includes(table));
      return {
        status: 'error',
        message: `Missing tables: ${missingTables.join(', ')}`,
        tables: foundTables
      };
    }
  } catch (error) {
    return {
      status: 'error',
      message: `Database connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      tables: []
    };
  }
}

/**
 * Check if storage bucket exists and is accessible
 */
export async function checkStorageBucket(): Promise<{ status: 'success' | 'error'; message: string }> {
  try {
    const { data, error } = await supabase.storage.getBucket('media');
    
    if (error) {
      if (error.message.includes('not found')) {
        return {
          status: 'error',
          message: 'Storage bucket "media" does not exist'
        };
      }
      return {
        status: 'error',
        message: `Storage error: ${error.message}`
      };
    }
    
    if (data) {
      return {
        status: 'success',
        message: 'Storage bucket "media" is accessible'
      };
    }
    
    return {
      status: 'error',
      message: 'Storage bucket "media" not found'
    };
  } catch (error) {
    return {
      status: 'error',
      message: `Storage check failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Check authentication and admin user setup
 */
export async function checkAuth(): Promise<{ status: 'success' | 'error' | 'warning'; message: string }> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      return {
        status: 'error',
        message: `Authentication error: ${error.message}`
      };
    }
    
    if (!user) {
      return {
        status: 'warning',
        message: 'No user logged in - admin features require authentication'
      };
    }
    
    // Check if user has admin role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    
    if (profileError) {
      return {
        status: 'warning',
        message: 'User profile not found - admin role cannot be verified'
      };
    }
    
    if (profile?.role === 'admin') {
      return {
        status: 'success',
        message: 'User authenticated with admin privileges'
      };
    }
    
    return {
      status: 'warning',
      message: 'User authenticated but admin role not confirmed'
    };
  } catch (error) {
    return {
      status: 'error',
      message: `Auth check failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Test basic CRUD operations
 */
export async function testCrudOperations(): Promise<{ status: 'success' | 'error'; message: string }> {
  try {
    // Test site_settings read
    const { error: settingsError } = await supabase
      .from('site_settings')
      .select('key, value')
      .limit(1);
    
    if (settingsError) {
      return {
        status: 'error',
        message: `Settings table access failed: ${settingsError.message}`
      };
    }
    
    // Test content_items read
    const { error: contentError } = await supabase
      .from('content_items')
      .select('id, title')
      .limit(1);
    
    if (contentError) {
      return {
        status: 'error',
        message: `Content table access failed: ${contentError.message}`
      };
    }
    
    return {
      status: 'success',
      message: 'Basic database operations are working'
    };
  } catch (error) {
    return {
      status: 'error',
      message: `CRUD test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Run comprehensive deployment check
 */
export async function runDeploymentCheck(): Promise<DeploymentCheckResult> {
  const result: DeploymentCheckResult = {
    isReady: false,
    checks: {
      database: [],
      storage: [],
      auth: []
    },
    nextSteps: []
  };
  
  try {
    // Check database tables
    const dbTableCheck = await checkDatabaseTables();
    result.checks.database.push({
      name: 'Database Tables',
      status: dbTableCheck.status,
      message: dbTableCheck.message
    });
    
    // Check CRUD operations
    const crudCheck = await testCrudOperations();
    result.checks.database.push({
      name: 'Database Operations',
      status: crudCheck.status,
      message: crudCheck.message
    });
    
    // Check storage bucket
    const storageCheck = await checkStorageBucket();
    result.checks.storage.push({
      name: 'Media Storage Bucket',
      status: storageCheck.status,
      message: storageCheck.message
    });
    
    // Check authentication
    const authCheck = await checkAuth();
    result.checks.auth.push({
      name: 'Authentication',
      status: authCheck.status,
      message: authCheck.message
    });
    
    // Determine next steps
    if (dbTableCheck.status === 'error') {
      result.nextSteps.push('1. Apply database schema: Run setup_complete.sql in Supabase SQL Editor');
    }
    
    if (storageCheck.status === 'error') {
      result.nextSteps.push('2. Create storage bucket: Go to Supabase → Storage → New bucket → name: "media" → Public');
    }
    
    if (authCheck.status === 'error') {
      result.nextSteps.push('3. Set up authentication: Configure auth providers in Supabase Dashboard');
    }
    
    // Check if deployment is ready
    const allDatabaseChecks = result.checks.database.every(check => check.status === 'success');
    const allStorageChecks = result.checks.storage.every(check => check.status === 'success');
    const hasAuth = result.checks.auth.some(check => check.status === 'success' || check.status === 'warning');
    
    result.isReady = allDatabaseChecks && allStorageChecks && hasAuth;
    
    if (result.isReady) {
      result.nextSteps = ['✅ Deployment is ready! All systems operational.'];
      
      // Log successful deployment check
      try {
        await logAdminActivity(
          'deployment_check',
          'system',
          null,
          { status: 'ready', timestamp: new Date().toISOString() }
        );
      } catch (logError) {
        // Don't fail the check if logging fails
        console.warn('Could not log deployment check:', logError);
      }
    }
    
    return result;
  } catch (error) {
    result.checks.database.push({
      name: 'Deployment Check',
      status: 'error',
      message: `Failed to run deployment check: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
    
    result.nextSteps = [
      '1. Check Supabase connection and credentials',
      '2. Verify project URL and API keys are correct',
      '3. Ensure internet connectivity'
    ];
    
    return result;
  }
}
