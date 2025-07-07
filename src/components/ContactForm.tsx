import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';

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
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage('Please fill in all required fields.');
      setSubmitStatus('error');
      setIsSubmitting(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage('Please enter a valid email address.');
      setSubmitStatus('error');
      setIsSubmitting(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('contacts')
        .insert([{
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone?.trim() || null,
          message: formData.message.trim(),
          type: 'general',
          status: 'new',
          created_at: new Date().toISOString()
        }])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      console.log('Contact form submitted successfully:', data);
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
      
      if (error instanceof Error) {
        if (error.message.includes('contacts')) {
          setErrorMessage('The contacts table is not set up. Please contact the administrator.');
        } else {
          setErrorMessage(`Error: ${error.message}`);
        }
      } else {
        setErrorMessage('Failed to send message. Please try again or contact us directly.');
      }
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
                  <MapPin className="h-5 w-5 text-warm-teal" />
                </div>
                <div>
                  <p className="font-medium">Mumbai, Maharashtra</p>
                  <p className="text-sm text-gray-500">Serving 7+ cities in India</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="md:col-span-3">
              {submitStatus === 'success' && (
                <Alert className="mb-6 border-green-200 bg-green-50/95 backdrop-blur-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Thank you for reaching out! We'll get back to you soon.
                  </AlertDescription>
                </Alert>
              )}

              {submitStatus === 'error' && (
                <Alert className="mb-6 border-red-200 bg-red-50/95 backdrop-blur-sm">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    {errorMessage}
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                    placeholder="Your Name *"
                    className="bg-gray-50/50"
                  />
                  <Input
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    type="email"
                    required
                    placeholder="Email Address *"
                    className="bg-gray-50/50"
                  />
                </div>
                
                <Input
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  type="tel"
                  placeholder="Phone Number (Optional)"
                  className="bg-gray-50/50"
                />
                
                <Textarea
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  required
                  rows={4}
                  placeholder="Your Message *"
                  className="bg-gray-50/50"
                />

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-warm-teal hover:bg-warm-teal/90 text-white font-medium py-3 rounded-lg transition-all duration-200"
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  ) : (
                    <span className="flex items-center justify-center">
                      Send Message <Send className="ml-2 h-4 w-4" />
                    </span>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
