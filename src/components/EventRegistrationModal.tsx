import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase, EventRegistration } from '@/lib/supabase';
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

  const handleInputChange = (field: keyof EventRegistration, value: string) => {
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

    try {
      const { error } = await supabase
        .from('event_registrations')
        .insert([{
          event_id: formData.event_id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          emergency_contact: formData.emergency_contact || null,
          medical_conditions: formData.medical_conditions || null,
          dietary_requirements: formData.dietary_requirements || null,
          experience: formData.experience || null,
          motivation: formData.motivation || null
        }]);

      if (error) {
        console.error('Supabase error:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        throw error;
      }

      setSubmitStatus('success');
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
      console.error('Error registering for event:', error);
      setSubmitStatus('error');
      setErrorMessage('Failed to register. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-dark-charcoal">
            Register for Event
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Details */}
          <Card className="bg-gradient-to-br from-warm-teal/5 to-sunrise-orange/5 border-warm-teal/20">
            <CardHeader>
              <CardTitle className="text-xl text-warm-teal">{eventTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center text-gray-700">
                  <Calendar className="h-5 w-5 text-warm-teal mr-3" />
                  <span>{formatDate(eventDate)}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Clock className="h-5 w-5 text-sunrise-orange mr-3" />
                  <span>{eventTime}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <MapPin className="h-5 w-5 text-sage-600 mr-3" />
                  <span>{eventLocation}</span>
                </div>
                {spotsLeft && (
                  <div className="flex items-center text-gray-700">
                    <Users className="h-5 w-5 text-blue-500 mr-3" />
                    <span>{spotsLeft}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Success/Error Messages */}
          {submitStatus === 'success' && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Registration successful! You'll receive a confirmation email shortly.
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
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
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  required
                  placeholder="Enter your phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergency_contact">Emergency Contact</Label>
                <Input
                  id="emergency_contact"
                  type="text"
                  value={formData.emergency_contact}
                  onChange={(e) => handleInputChange('emergency_contact', e.target.value)}
                  placeholder="Emergency contact name & number"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="medical_conditions">Medical Conditions</Label>
              <Textarea
                id="medical_conditions"
                value={formData.medical_conditions}
                onChange={(e) => handleInputChange('medical_conditions', e.target.value)}
                placeholder="Any medical conditions we should be aware of?"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dietary_requirements">Dietary Requirements</Label>
              <Textarea
                id="dietary_requirements"
                value={formData.dietary_requirements}
                onChange={(e) => handleInputChange('dietary_requirements', e.target.value)}
                placeholder="Any dietary restrictions or requirements?"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Previous Experience</Label>
              <Textarea
                id="experience"
                value={formData.experience}
                onChange={(e) => handleInputChange('experience', e.target.value)}
                placeholder="Tell us about your caregiving experience (if any)"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="motivation">What motivates you?</Label>
              <Textarea
                id="motivation"
                value={formData.motivation}
                onChange={(e) => handleInputChange('motivation', e.target.value)}
                placeholder="What motivates you to join this program?"
                rows={3}
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-warm-teal hover:bg-warm-teal/90 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Registering...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Register for Event</span>
                </>
              )}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventRegistrationModal;
