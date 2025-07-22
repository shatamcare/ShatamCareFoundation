import React, { useState } from 'react';
import { supabase } from '../../lib/supabase-secure';

interface DiagnosticTest {
  name: string;
  status: 'success' | 'error' | 'pending';
  message: string;
  data?: unknown;
}

interface DiagnosticResults {
  timestamp: string;
  tests: DiagnosticTest[];
  summary: {
    total: number;
    passed: number;
    failed: number;
  };
}

const StorageDiagnostic: React.FC = () => {
  const [results, setResults] = useState<DiagnosticResults | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runDiagnostic = async () => {
    setIsRunning(true);
    setResults(null);

    const diagnosticResults: DiagnosticResults = {
      timestamp: new Date().toISOString(),
      tests: [],
      summary: { total: 0, passed: 0, failed: 0 }
    };

    // Test 1: Basic Supabase connection
    try {
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      diagnosticResults.tests.push({
        name: "Storage API Access",
        status: bucketsError ? "error" : "success",
        message: bucketsError ? `Error: ${bucketsError.message}` : `✅ Found ${buckets?.length || 0} buckets`,
        data: buckets
      });
    } catch (error) {
      diagnosticResults.tests.push({
        name: "Storage API Access",
        status: "error",
        message: `❌ Storage API failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        data: null
      });
    }

    // Test 2: Check if media bucket exists and is accessible
    try {
      const { data: bucket, error: bucketError } = await supabase.storage.getBucket('media');
      if (bucketError) {
        diagnosticResults.tests.push({
          name: "Media Bucket Access", 
          status: "error",
          message: `❌ Bucket access error: ${bucketError.message}`,
          data: { error: bucketError }
        });
      } else {
        diagnosticResults.tests.push({
          name: "Media Bucket Access",
          status: "success", 
          message: `✅ Media bucket exists (public: ${bucket?.public})`,
          data: bucket
        });
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      diagnosticResults.tests.push({
        name: "Media Bucket Access",
        status: "error",
        message: `❌ Bucket API call failed: ${errorMsg}`,
        data: { error: errorMsg }
      });
    }

    // Test 3: Test file list capability
    try {
      const { data: files, error: listError } = await supabase.storage
        .from('media')
        .list('', { limit: 5 });

      if (listError) {
        diagnosticResults.tests.push({
          name: "File List Test",
          status: "error",
          message: `❌ Cannot list files: ${listError.message}`,
          data: { listError }
        });
      } else {
        diagnosticResults.tests.push({
          name: "File List Test",
          status: "success",
          message: `✅ Can list files (found ${files?.length || 0} items)`,
          data: { fileCount: files?.length || 0 }
        });
      }
    } catch (error) {
      diagnosticResults.tests.push({
        name: "File List Test",
        status: "error",
        message: `❌ File list failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        data: null
      });
    }

    // Test 4: Test file upload capability
    try {
      const testFileName = `diagnostic-test-${Date.now()}.txt`;
      const testContent = new Blob(['diagnostic test'], { type: 'text/plain' });
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media')
        .upload(testFileName, testContent);

      if (uploadError) {
        diagnosticResults.tests.push({
          name: "Upload Test",
          status: "error",
          message: `❌ Upload failed: ${uploadError.message}`,
          data: { uploadError }
        });
      } else {
        // Clean up test file
        await supabase.storage.from('media').remove([testFileName]);
        diagnosticResults.tests.push({
          name: "Upload Test",
          status: "success",
          message: "✅ File upload and cleanup works correctly",
          data: { uploadData }
        });
      }
    } catch (error) {
      diagnosticResults.tests.push({
        name: "Upload Test",
        status: "error",
        message: `❌ Upload test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        data: null
      });
    }

    // Test 5: Environment variables check
    const envVars = {
      VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
      VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY
    };

    const envStatus = envVars.VITE_SUPABASE_URL && envVars.VITE_SUPABASE_ANON_KEY ? 'success' : 'error';
    diagnosticResults.tests.push({
      name: "Environment Variables",
      status: envStatus,
      message: envStatus === 'success' 
        ? "✅ Environment variables are configured"
        : "❌ Missing environment variables",
      data: {
        url: envVars.VITE_SUPABASE_URL ? `${envVars.VITE_SUPABASE_URL.substring(0, 30)}...` : 'MISSING',
        hasKey: !!envVars.VITE_SUPABASE_ANON_KEY
      }
    });

    // Calculate summary
    diagnosticResults.summary.total = diagnosticResults.tests.length;
    diagnosticResults.summary.passed = diagnosticResults.tests.filter(t => t.status === 'success').length;
    diagnosticResults.summary.failed = diagnosticResults.tests.filter(t => t.status === 'error').length;

    setResults(diagnosticResults);
    setIsRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'pending': return '⏳';
      default: return '❓';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'pending': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">🔍 Storage Diagnostic Tool</h3>
        <button
          onClick={runDiagnostic}
          disabled={isRunning}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isRunning ? '🔍 Running...' : '🔍 Run Diagnostic'}
        </button>
      </div>

      <div className="text-sm text-gray-600 mb-4">
        Since your bucket exists and is public, this will help identify why you're getting 400 errors.
      </div>

      {results && (
        <div className="space-y-4">
          {/* Summary */}
          <div className="bg-gray-50 p-4 rounded">
            <h4 className="font-medium mb-2">📊 Summary</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>Total Tests: {results.summary.total}</div>
              <div className="text-green-600">✅ Passed: {results.summary.passed}</div>
              <div className="text-red-600">❌ Failed: {results.summary.failed}</div>
            </div>
          </div>

          {/* Individual Tests */}
          <div className="space-y-2">
            <h4 className="font-medium">🧪 Test Results</h4>
            {results.tests.map((test, index) => (
              <div key={index} className="border rounded p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{test.name}</span>
                  <span className={getStatusColor(test.status)}>
                    {getStatusIcon(test.status)} {test.status.toUpperCase()}
                  </span>
                </div>
                <div className="text-sm text-gray-700 mb-2">{test.message}</div>
                {test.data && (
                  <details className="text-xs text-gray-500">
                    <summary className="cursor-pointer">🔍 View Details</summary>
                    <pre className="mt-2 bg-gray-100 p-2 rounded overflow-auto max-h-32">
                      {JSON.stringify(test.data, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>

          {/* Recommendations */}
          {results.summary.failed > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
              <h4 className="font-medium text-yellow-800 mb-2">🔧 Next Steps</h4>
              <div className="text-sm text-yellow-700 space-y-1">
                {results.tests
                  .filter(t => t.status === 'error')
                  .map((test, index) => (
                    <div key={index}>• {test.name}: {test.message}</div>
                  ))}
              </div>
            </div>
          )}

          <div className="text-xs text-gray-500">
            ⏰ Completed at: {new Date(results.timestamp).toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
};

export default StorageDiagnostic;
