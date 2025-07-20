import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase-secure';
import { 
  LogIn, 
  Eye, 
  EyeOff, 
  User, 
  Lock,
  AlertCircle,
  Home
} from 'lucide-react';

const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      // Sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        throw authError;
      }

      if (!authData.user) {
        throw new Error('Authentication failed');
      }

      // Check if user is an admin
      console.log('Checking admin status for user:', authData.user.id);
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      console.log('Admin query result:', { adminData, adminError });

      if (adminError) {
        console.error('Admin check error details:', adminError);
        // Sign out the user since they're not an admin
        await supabase.auth.signOut();
        throw new Error(`Admin check failed: ${adminError.message}`);
      }

      if (!adminData) {
        // Sign out the user since they're not an admin
        await supabase.auth.signOut();
        throw new Error('You do not have admin access to this system');
      }

      // Redirect to admin dashboard
      navigate('/admin');
    } catch (error) {
      console.error('Sign in error:', error);
      setError(error instanceof Error ? error.message : 'Failed to sign in. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        throw authError;
      }

      if (!authData.user) {
        throw new Error('Sign up failed');
      }

      setSuccessMessage(
        'Account created successfully! You can now sign in. Note: Admin access must be granted separately by an administrator.'
      );
      
      // Switch to sign-in mode
      setIsSignUp(false);
      
    } catch (error) {
      console.error('Sign up error:', error);
      setError(error instanceof Error ? error.message : 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-warm-teal rounded-full flex items-center justify-center mb-4">
            <span className="text-white font-bold text-xl">SC</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin {isSignUp ? 'Sign Up' : 'Login'}</h1>
          <p className="text-gray-600">Shatam Care Foundation</p>
        </div>

        {/* Login/Signup Form */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-lg">
              {isSignUp ? 'Create your account' : 'Sign in to your account'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="mb-4 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            {successMessage && (
              <Alert className="mb-4 border-green-200 bg-green-50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="pl-10"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="pl-10 pr-10"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading || !email || !password}
                className="w-full bg-warm-teal hover:bg-warm-teal-600 text-white font-medium py-3"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {isSignUp ? 'Creating account...' : 'Signing in...'}
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    {isSignUp ? 'Create Account' : 'Sign In'}
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 mb-3">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              </p>
              <Button
                type="button"
                variant="link"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                  setSuccessMessage('');
                }}
                className="text-warm-teal hover:text-warm-teal-600"
                disabled={loading}
              >
                {isSignUp ? 'Sign in instead' : 'Create account'}
              </Button>
            </div>

            {!isSignUp && (
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  Need admin access? Contact your system administrator.
                </p>
              </div>
            )}

            {isSignUp && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700">
                  <strong>Note:</strong> Creating an account here only sets up your login credentials. 
                  Admin access must be granted separately by running database commands.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Back to Website */}
        <div className="mt-6 text-center">
          <Button
            variant="outline"
            onClick={() => window.location.href = '/'}
            className="text-gray-600 hover:text-gray-900"
          >
            <Home className="h-4 w-4 mr-2" />
            Back to Website
          </Button>
        </div>

        {/* Development Note */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-sm font-medium text-blue-900 mb-2">For Development/Testing:</h3>
          <p className="text-sm text-blue-700">
            To get admin access after creating an account:
          </p>
          <ol className="text-sm text-blue-700 mt-2 list-decimal list-inside space-y-1">
            <li>Create an account using the "Create account" option above</li>
            <li>Run the admin setup SQL commands in your Supabase dashboard</li>
            <li>Use: <code className="bg-blue-100 px-1 rounded">SELECT add_admin_by_email('your-email@example.com');</code></li>
            <li>Then sign in with admin privileges</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
