import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  checkBucketExists, 
  setupStorageBucket, 
  validateBucketConfig,
  getSetupInstructions,
  type BucketSetupResult 
} from '@/utils/storage-setup';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  ExternalLink, 
  RefreshCw,
  Database,
  Folder,
  Settings
} from 'lucide-react';

interface ValidationResult {
  isValid: boolean;
  issues: string[];
  recommendations: string[];
}

const SetupAssistant: React.FC = () => {
  const [setupStatus, setSetupStatus] = useState<BucketSetupResult | null>(null);
  const [checking, setChecking] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);

  const checkSetupStatus = async () => {
    setChecking(true);
    try {
      const bucketExists = await checkBucketExists();
      const validation = await validateBucketConfig();
      
      setSetupStatus({
        success: bucketExists && validation.isValid,
        message: bucketExists 
          ? (validation.isValid ? 'Storage is ready!' : 'Storage needs configuration')
          : 'Storage bucket missing',
        bucketExists,
        policiesApplied: validation.isValid
      });
      
      setValidationResult(validation);
    } catch (error) {
      setSetupStatus({
        success: false,
        message: `Check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        bucketExists: false,
        policiesApplied: false
      });
    } finally {
      setChecking(false);
    }
  };

  const attemptAutoSetup = async () => {
    setChecking(true);
    try {
      const result = await setupStorageBucket();
      setSetupStatus(result);
      
      // Re-validate after setup attempt
      await checkSetupStatus();
    } catch (error) {
      setSetupStatus({
        success: false,
        message: `Auto-setup failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        bucketExists: false,
        policiesApplied: false
      });
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkSetupStatus();
  }, []);

  const instructions = getSetupInstructions();

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Storage Setup Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Status */}
        <div className="flex items-center justify-between p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            {setupStatus?.success ? (
              <CheckCircle className="h-6 w-6 text-green-600" />
            ) : (
              <XCircle className="h-6 w-6 text-red-600" />
            )}
            <div>
              <h3 className="font-medium">
                {setupStatus?.success ? 'Storage Ready' : 'Setup Required'}
              </h3>
              <p className="text-sm text-gray-600">
                {setupStatus?.message || 'Checking status...'}
              </p>
            </div>
          </div>
          <Button 
            onClick={checkSetupStatus}
            disabled={checking}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${checking ? 'animate-spin' : ''}`} />
            Check Status
          </Button>
        </div>

        {/* Detailed Status */}
        {setupStatus && !setupStatus.success && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Bucket Status */}
            <div className="p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <Folder className="h-5 w-5" />
                <h4 className="font-medium">Storage Bucket</h4>
              </div>
              <div className="flex items-center gap-2">
                {setupStatus.bucketExists ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <span className="text-sm">
                  {setupStatus.bucketExists ? 'Bucket exists' : 'Bucket missing'}
                </span>
              </div>
            </div>

            {/* Database Status */}
            <div className="p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <Database className="h-5 w-5" />
                <h4 className="font-medium">Database Tables</h4>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span className="text-sm">Needs verification</span>
              </div>
            </div>
          </div>
        )}

        {/* Issues and Recommendations */}
        {validationResult && !validationResult.isValid && (
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                {validationResult.issues.length > 0 && (
                  <div>
                    <strong>Issues found:</strong>
                    <ul className="list-disc list-inside mt-1 text-sm">
                      {validationResult.issues.map((issue: string, idx: number) => (
                        <li key={idx}>{issue}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {validationResult.recommendations.length > 0 && (
                  <div>
                    <strong>Recommendations:</strong>
                    <ul className="list-disc list-inside mt-1 text-sm">
                      {validationResult.recommendations.map((rec: string, idx: number) => (
                        <li key={idx}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Manual Setup Instructions */}
        {setupStatus && !setupStatus.success && (
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Manual Setup Steps</h3>
            
            <Alert className="border-blue-200 bg-blue-50">
              <AlertDescription>
                <strong>⚠️ IMPORTANT: Step 1 - Create Storage Bucket Manually</strong>
                <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-sm font-medium text-yellow-800 mb-2">
                    🚨 Bucket MUST be created via Supabase Dashboard (NOT SQL Editor)
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-700">
                    <li>Go to Supabase Dashboard → Storage → Buckets</li>
                    <li>Click "New bucket" button</li>
                    <li>Enter name: <code className="bg-white px-1 rounded">media</code></li>
                    <li>✅ Check "Public bucket" checkbox</li>
                    <li>Click "Create bucket"</li>
                  </ol>
                </div>
              </AlertDescription>
            </Alert>

            <Alert className="border-purple-200 bg-purple-50">
              <AlertDescription>
                <strong>Step 2: Apply Database Schema (SQL Editor)</strong>
                <ol className="list-decimal list-inside mt-2 space-y-1 text-sm">
                  <li>Go to Supabase Dashboard → SQL Editor</li>
                  <li>Copy all content from <code className="bg-white px-1 rounded">database/setup_complete.sql</code></li>
                  <li>Paste into SQL Editor and click "Run"</li>
                  <li>Verify all tables are created successfully</li>
                </ol>
              </AlertDescription>
            </Alert>

            <Alert className="border-green-200 bg-green-50">
              <AlertDescription>
                <strong>Step 3: Apply Storage Policies (Choose One)</strong>
                <div className="mt-2 space-y-2">
                  <div className="p-2 bg-green-50 border border-green-200 rounded">
                    <p className="text-sm font-medium text-green-800">Option A: Ultra Minimal (Most Compatible)</p>
                    <p className="text-xs text-green-600">Run <code className="bg-white px-1 rounded">database/storage_ultra_minimal.sql</code> - No type casting issues</p>
                  </div>
                  <div className="p-2 bg-blue-50 border border-blue-200 rounded">
                    <p className="text-sm font-medium text-blue-800">Option B: Standard Minimal</p>
                    <p className="text-xs text-blue-600">Run <code className="bg-white px-1 rounded">database/storage_minimal.sql</code> - Basic setup</p>
                  </div>
                  <div className="p-2 bg-gray-50 border border-gray-200 rounded">
                    <p className="text-sm font-medium text-gray-800">Option C: Full Policies</p>
                    <p className="text-xs text-gray-600">Run <code className="bg-white px-1 rounded">database/storage_policies_safe.sql</code> - Advanced features</p>
                  </div>
                  <p className="text-xs text-orange-600">
                    💡 If you get UUID/type errors, use Option A
                  </p>
                </div>
              </AlertDescription>
            </Alert>

            {/* Troubleshooting */}
            <Alert className="border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>⚠️ Common Issues & Solutions</strong>
                <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-orange-700">
                  <li><strong>"must be owner" error:</strong> Use database/storage_ultra_minimal.sql</li>
                  <li><strong>"operator does not exist: text = uuid":</strong> Use database/storage_ultra_minimal.sql</li>
                  <li><strong>"bucket not found":</strong> Create bucket manually in Dashboard first</li>
                  <li><strong>"syntax error":</strong> Don't run TypeScript files in SQL Editor</li>
                  <li><strong>Still not working:</strong> Try just creating a public bucket without policies</li>
                </ul>
              </AlertDescription>
            </Alert>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={() => window.open('https://supabase.com/dashboard', '_blank')}
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Open Supabase Dashboard
              </Button>
              
              <Button
                onClick={attemptAutoSetup}
                disabled={checking}
                variant="outline"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${checking ? 'animate-spin' : ''}`} />
                Try Auto-Setup
              </Button>
            </div>
          </div>
        )}

        {/* Success Message */}
        {setupStatus?.success && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>✅ Setup Complete!</strong>
              <p className="mt-1">Your storage bucket and database are ready. You can now upload media files.</p>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default SetupAssistant;
