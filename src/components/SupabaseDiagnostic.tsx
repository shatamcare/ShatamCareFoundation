import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase';
import { CheckCircle, AlertCircle, Database } from 'lucide-react';

const SupabaseDiagnostic = () => {
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [isTestingInsert, setIsTestingInsert] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [insertStatus, setInsertStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const testConnection = async () => {
    setIsTestingConnection(true);
    setConnectionStatus('idle');
    setErrorMessage('');

    try {
      // Test basic connection by trying to read from a table
      const { data, error } = await supabase
        .from('contacts')
        .select('count')
        .limit(1);

      if (error) {
        console.error('Connection test error:', error);
        throw error;
      }

      setConnectionStatus('success');
      console.log('Connection test successful:', data);
    } catch (error) {
      console.error('Connection test failed:', error);
      setConnectionStatus('error');
      setErrorMessage(`Connection failed: ${error.message || 'Unknown error'}`);
    } finally {
      setIsTestingConnection(false);
    }
  };

  const testInsert = async () => {
    setIsTestingInsert(true);
    setInsertStatus('idle');
    setErrorMessage('');

    try {
      // Test insert with minimal data
      const { data, error } = await supabase
        .from('contacts')
        .insert([{
          name: 'Test User',
          email: 'test@example.com',
          subject: 'Test Subject',
          message: 'Test Message',
          type: 'general'
        }])
        .select();

      if (error) {
        console.error('Insert test error:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        throw error;
      }

      setInsertStatus('success');
      console.log('Insert test successful:', data);
    } catch (error) {
      console.error('Insert test failed:', error);
      setInsertStatus('error');
      setErrorMessage(`Insert failed: ${error.message || 'Unknown error'}`);
    } finally {
      setIsTestingInsert(false);
    }
  };

  const testEventExists = async () => {
    try {
      // Check if events exist
      const { data, error } = await supabase
        .from('events')
        .select('id, title')
        .limit(5);

      if (error) {
        console.error('Events check error:', error);
        return false;
      }

      console.log('Events found:', data);
      return data && data.length > 0;
    } catch (error) {
      console.error('Events check failed:', error);
      return false;
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Supabase Diagnostic Tool
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Current Supabase URL: <code className="bg-gray-100 px-2 py-1 rounded text-xs">{import.meta.env.VITE_SUPABASE_URL}</code>
            </p>
            <p className="text-sm text-gray-600">
              Anon Key: <code className="bg-gray-100 px-2 py-1 rounded text-xs">{import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Not Set'}</code>
            </p>
          </div>

          {/* Connection Test */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">Test Connection</span>
              <Button
                onClick={testConnection}
                disabled={isTestingConnection}
                variant="outline"
                size="sm"
              >
                {isTestingConnection ? 'Testing...' : 'Test Connection'}
              </Button>
            </div>
            
            {connectionStatus === 'success' && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Connection successful! Can read from database.
                </AlertDescription>
              </Alert>
            )}
            
            {connectionStatus === 'error' && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {errorMessage}
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Insert Test */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">Test Insert</span>
              <Button
                onClick={testInsert}
                disabled={isTestingInsert}
                variant="outline"
                size="sm"
              >
                {isTestingInsert ? 'Testing...' : 'Test Insert'}
              </Button>
            </div>
            
            {insertStatus === 'success' && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Insert successful! Database is working correctly.
                </AlertDescription>
              </Alert>
            )}
            
            {insertStatus === 'error' && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {errorMessage}
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div className="pt-4 border-t">
            <p className="text-xs text-gray-500">
              Check the browser console for detailed error messages.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupabaseDiagnostic;
