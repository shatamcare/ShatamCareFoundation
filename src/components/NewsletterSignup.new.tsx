import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';

interface NewsletterSignupProps {
  className?: string;
}

const NewsletterSignup: React.FC<NewsletterSignupProps> = ({ className = '' }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    // Basic validation
    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      setSubmitStatus('error');
      setIsSubmitting(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address.');
      setSubmitStatus('error');
      setIsSubmitting(false);
      return;
    }

    try {
      // Simple insert - no select after insert
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert({
          email: email.trim()
        });

      if (error) {
        if (error.code === '23505') {
          setErrorMessage('This email is already subscribed to our newsletter.');
        } else {
          console.error('Supabase error:', error);
          setErrorMessage('Failed to subscribe. Please try again.');
        }
        setSubmitStatus('error');
      } else {
        setSubmitStatus('success');
        setEmail('');
      }
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      setSubmitStatus('error');
      setErrorMessage('Failed to subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`bg-gradient-to-r from-warm-teal to-warm-teal-600 py-8 ${className}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between md:space-x-8">
          <div className="flex-shrink-0 mb-6 md:mb-0 text-left">
            <div className="flex items-center space-x-3 mb-2">
              <Mail className="h-5 w-5 text-white opacity-90" />
              <h2 className="text-2xl font-semibold text-white font-poppins">
                Stay Connected
              </h2>
            </div>
            <p className="text-white/80 text-sm max-w-md">
              Join our community to receive updates on our programs and ways to make a difference.
            </p>
          </div>

          <div className="flex-grow max-w-lg">
            {submitStatus === 'success' ? (
              <Alert className="border-green-200 bg-green-50/95 backdrop-blur-sm">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Thank you for subscribing! You'll receive our updates soon.
                </AlertDescription>
              </Alert>
            ) : submitStatus === 'error' ? (
              <Alert className="border-red-200 bg-red-50/95 backdrop-blur-sm">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {errorMessage}
                </AlertDescription>
              </Alert>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <div className="flex-grow">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/95 backdrop-blur-sm border-0 focus:ring-2 focus:ring-white/50 text-gray-900 placeholder-gray-500"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-white text-warm-teal hover:bg-white/90 font-medium px-6 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 whitespace-nowrap"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-warm-teal"></div>
                      <span>Subscribing...</span>
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4" />
                      <span>Subscribe</span>
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterSignup;
