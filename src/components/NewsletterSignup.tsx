import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase, NewsletterSubscription } from '@/lib/supabase';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';

interface NewsletterSignupProps {
  className?: string;
}

const NewsletterSignup: React.FC<NewsletterSignupProps> = ({ className = '' }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{
          email,
          name: name || null,
          source: 'website'
        }]);

      if (error) {
        // Handle duplicate email gracefully
        if (error.code === '23505') {
          setErrorMessage('This email is already subscribed to our newsletter.');
        } else {
          console.error('Supabase error:', error);
          throw error;
        }
        setSubmitStatus('error');
      } else {
        setSubmitStatus('success');
        setEmail('');
        setName('');
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
    <div className={`bg-gradient-to-r from-warm-teal to-warm-teal-600 py-16 ${className}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-white/20 rounded-full mb-4">
            <Mail className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4 font-poppins">
            Stay Connected
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Get the latest updates on our programs, success stories, and how you can make a difference in the lives of elderly individuals.
          </p>
        </div>

        <div className="max-w-md mx-auto">
          {/* Success/Error Messages */}
          {submitStatus === 'success' && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Thank you for subscribing! You'll receive our latest updates soon.
              </AlertDescription>
            </Alert>
          )}

          {submitStatus === 'error' && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {errorMessage}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Your Name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/70 focus:border-white/50"
              />
            </div>
            <div>
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/70 focus:border-white/50"
              />
            </div>
            <Button
              type="submit"
              disabled={isSubmitting || !email.trim()}
              className="w-full bg-sunrise-orange hover:bg-sunrise-orange/90 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Subscribing...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Subscribe to Newsletter
                </>
              )}
            </Button>
          </form>

          <p className="text-xs text-white/60 mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewsletterSignup;
