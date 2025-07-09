import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase';
import { Mail, Phone, Send, CheckCircle, AlertCircle, Shield } from 'lucide-react';

interface ContactFormProps {
  className?: string;
}

type FormData = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

const ContactForm: React.FC<ContactFormProps> = ({ className = '' }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error' | 'rate_limited'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState<Partial<FormData>>({});

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<FormData> = {};
    
    // Name validation
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    } else if (formData.name.trim().length > 100) {
      errors.name = 'Name must be less than 100 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else {
      const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = 'Please enter a valid email address';
      }
    }

    // Phone validation (optional but if provided, must be valid)
    if (formData.phone.trim()) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
        errors.phone = 'Please enter a valid phone number';
      }
    }

    // Message validation
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters';
    } else if (formData.message.trim().length > 2000) {
      errors.message = 'Message must be less than 2000 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const checkRateLimit = async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .rpc('check_rate_limit', {
          p_email: formData.email.trim(),
          p_action: 'contact_form',
          p_limit: 3, // 3 submissions per hour
          p_window_minutes: 60
        });

      if (error) {
        console.error('Rate limit check error:', error);
        return true; // Allow submission if rate limit check fails
      }

      return data;
    } catch (error) {
      console.error('Rate limit error:', error);
      return true; // Allow submission if rate limit check fails
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    // Validate form
    if (!validateForm()) {
      setSubmitStatus('error');
      setErrorMessage('Please fix the errors above');
      setIsSubmitting(false);
      return;
    }

    try {
      // Check rate limit
      const canSubmit = await checkRateLimit();
      if (!canSubmit) {
        setSubmitStatus('rate_limited');
        setErrorMessage('Too many submissions. Please try again later.');
        setIsSubmitting(false);
        return;
      }

      // Submit form
      const { error } = await supabase
        .from('contacts')
        .insert({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || null,
          message: formData.message.trim(),
          status: 'new',
          priority: 'normal'
        });

      if (error) {
        console.error('Supabase error:', error);
        
        if (error.message.includes('email')) {
          throw new Error('Please enter a valid email address');
        } else if (error.message.includes('name_length')) {
          throw new Error('Name must be between 2 and 100 characters');
        } else if (error.message.includes('message_length')) {
          throw new Error('Message must be between 10 and 2000 characters');
        } else {
          throw new Error('Failed to send message. Please try again.');
        }
      }

      console.log('Contact form submitted successfully');
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className={`py-12 bg-gradient-to-b from-light-gray to-white ${className}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-dark-charcoal mb-2 font-poppins">
            Get in Touch
          </h2>
          <p className="text-gray-600">We're here to help and answer any questions you might have</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* Contact Information */}
            <div className="md:col-span-2 space-y-6">
              <div className="flex items-center space-x-4 text-gray-700">
                <div className="bg-warm-teal/10 p-3 rounded-lg">
                  <Phone className="h-5 w-5 text-warm-teal" />
                </div>
                <div>
                  <p className="font-medium">+91 9158566665</p>
                  <p className="text-sm text-gray-500">Mon-Sat, 9AM - 6PM</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-gray-700">
                <div className="bg-warm-teal/10 p-3 rounded-lg">
                  <Mail className="h-5 w-5 text-warm-teal" />
                </div>
                <div>
                  <p className="font-medium">shatamcare@gmail.com</p>
                  <p className="text-sm text-gray-500">Always here to help</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-gray-700">
                <div className="bg-warm-teal/10 p-3 rounded-lg">
                  <Shield className="h-5 w-5 text-warm-teal" />
                </div>
                <div>
                  <p className="font-medium">Secure & Private</p>
                  <p className="text-sm text-gray-500">Your data is protected</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="md:col-span-3">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`w-full ${validationErrors.name ? 'border-red-500' : ''}`}
                      required
                    />
                    {validationErrors.name && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full ${validationErrors.email ? 'border-red-500' : ''}`}
                      required
                    />
                    {validationErrors.email && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 9876543210"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full ${validationErrors.phone ? 'border-red-500' : ''}`}
                  />
                  {validationErrors.phone && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.phone}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Tell us how we can help you..."
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    className={`w-full h-32 resize-none ${validationErrors.message ? 'border-red-500' : ''}`}
                    required
                  />
                  <div className="flex justify-between items-center mt-1">
                    {validationErrors.message && (
                      <p className="text-sm text-red-600">{validationErrors.message}</p>
                    )}
                    <p className="text-sm text-gray-500 ml-auto">
                      {formData.message.length}/2000
                    </p>
                  </div>
                </div>

                {submitStatus === 'success' && (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Thank you for your message! We'll get back to you within 24 hours.
                    </AlertDescription>
                  </Alert>
                )}

                {submitStatus === 'error' && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      {errorMessage}
                    </AlertDescription>
                  </Alert>
                )}

                {submitStatus === 'rate_limited' && (
                  <Alert className="border-yellow-200 bg-yellow-50">
                    <Shield className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-800">
                      {errorMessage}
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-warm-teal hover:bg-warm-teal-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  We respect your privacy and will never share your information with third parties.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
