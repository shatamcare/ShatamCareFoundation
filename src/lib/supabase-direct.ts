import { createClient } from '@supabase/supabase-js';

// Direct Supabase configuration without environment variables
const SUPABASE_URL = 'https://uumavtvxuncetfqwlgvp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1bWF2dHZ4dW5jZXRmcXdsZ3ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MjM2NTQsImV4cCI6MjA2NzI5OTY1NH0.AAoykuZmtZ3gLtbAXLjlYkyqaVUsghx84CP9nF1xkHU';

// Initialize Supabase client with minimal configuration
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true
  }
});

// Type definitions for database entities
export interface EventRegistration {
  event_id: string;
  name: string;
  email: string;
  phone: string;
  emergency_contact?: string;
  medical_conditions?: string;
  dietary_requirements?: string;
  experience?: string;
  motivation?: string;
  status?: string;
  created_at?: string;
}

// Helper function for event registration
export async function registerForEvent(formData: EventRegistration) {
  try {
    console.log('Submitting registration with helper:', formData);
    
    const { data, error } = await supabase
      .from('event_registrations')
      .insert([{
        ...formData,
        status: 'confirmed',
        created_at: new Date().toISOString()
      }]);
    
    if (error) {
      console.error('Registration error:', error);
      if (error.code === '23505') {
        throw new Error('You have already registered for this event.');
      } else if (error.code === '23503') {
        throw new Error('This event is no longer available.');
      } else {
        throw new Error(`Database error: ${error.message}`);
      }
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
}

// Helper for handling Supabase errors
export const handleSupabaseError = (error: unknown): string => {
  if (typeof error === 'object' && error !== null) {
    if ('message' in error && typeof error.message === 'string') {
      return error.message;
    }
  }
  return 'An unexpected error occurred. Please try again.';
};
