import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase, EventRegistration, handleSupabaseError } from '@/lib/supabase';
import { Calendar, Clock, MapPin, Users, CheckCircle, AlertCircle, Send } from 'lucide-react';

interface EventRegistrationModalProps {
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  spotsLeft?: string;
  children: React.ReactNode;
}

const EventRegistrationModal: React.FC<EventRegistrationModalProps> = ({
  eventId,
  eventTitle,
  eventDate,
  eventTime,
  eventLocation,
  spotsLeft,
  children
}) => {
  const [formData, setFormData] = useState<EventRegistration>({
    event_id: eventId,
    name: '',
    email: '',
    phone: '',
    emergency_contact: '',
    medical_conditions: '',
    dietary_requirements: '',
    experience: '',
    motivation: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Scroll the modal content into view with smooth behavior
      const modalContent = document.querySelector('[role="dialog"]');
      if (modalContent) {
        modalContent.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [isOpen]);

  const validateForm = () => {
    if (!formData.name.trim()) return 'Name is required';
    if (!formData.email.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Please enter a valid email address';
    if (!formData.phone.trim()) return 'Phone number is required';
    if (!/^[0-9+\-()\s]*$/.test(formData.phone)) return 'Please enter a valid phone number';
    if (formData.emergency_contact && !/^[0-9+\-()\s]*$/.test(formData.emergency_contact)) return 'Please enter a valid emergency contact number';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      // Insert registration - the trigger will handle updating the count
      const { data, error } = await supabase
        .from('event_registrations')
        .insert([{
          ...formData,
          status: 'confirmed',
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          throw new Error('You have already registered for this event.');
        } else if (error.code === '23503') { // Foreign key violation
          throw new Error('This event is no longer available.');
        } else {
          throw error;
        }
      }

      setSubmitStatus('success');
      setTimeout(() => setIsOpen(false), 2000); // Close modal after success
      
      // Reset form
      setFormData({
        event_id: eventId,
        name: '',
        email: '',
        phone: '',
        emergency_contact: '',
        medical_conditions: '',
        dietary_requirements: '',
        experience: '',
        motivation: ''
      });
    } catch (error) {
      console.error('Registration error:', error);
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.');
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Register for Event</DialogTitle>
        </DialogHeader>

        {/* Event Details */}
        <Card className="border-0 bg-gray-50/50">
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg mb-3">{eventTitle}</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-warm-teal" />
                <span>{eventDate}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-warm-teal" />
                <span>{eventTime}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-warm-teal" />
                <span>{eventLocation}</span>
              </div>
              {spotsLeft && (
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-warm-teal" />
                  <span>{spotsLeft}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Status Messages */}
        {submitStatus === 'success' && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Registration successful! We'll send you a confirmation email shortly.
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

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              placeholder="Enter your full name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              required
              placeholder="Enter your phone number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergency_contact">Emergency Contact (Optional)</Label>
            <Input
              id="emergency_contact"
              value={formData.emergency_contact}
              onChange={(e) => setFormData(prev => ({ ...prev, emergency_contact: e.target.value }))}
              placeholder="Name and phone number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="medical_conditions">Medical Conditions (Optional)</Label>
            <Textarea
              id="medical_conditions"
              value={formData.medical_conditions}
              onChange={(e) => setFormData(prev => ({ ...prev, medical_conditions: e.target.value }))}
              placeholder="Any medical conditions we should be aware of"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-warm-teal hover:bg-warm-teal/90"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                <span>Registering...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Send className="h-4 w-4 mr-2" />
                <span>Register Now</span>
              </div>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EventRegistrationModal;
