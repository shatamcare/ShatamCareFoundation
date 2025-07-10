import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client with anon key and specific storage key
export const supabase = createClient(
  'https://uumavtvxuncetfqwlgvp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1bWF2dHZ4dW5jZXRmcXdsZ3ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MjM2NTQsImV4cCI6MjA2NzI5OTY1NH0.AAoykuZmtZ3gLtbAXLjlYkyqaVUsghx84CP9nF1xkHU',
  {
    auth: {
      storage: window.localStorage,
      storageKey: 'shatam-care-auth',
      persistSession: true,
      detectSessionInUrl: true
    }
  }
);

// Type definitions for database entities
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  spots_available: number;
  created_at?: string;
  updated_at?: string;
}

export interface EventForDisplay extends Event {
  type?: string;
  image?: string;
  spots?: string;
}

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

// Function to register for an event (works for anonymous users)
export async function registerForEvent(formData: EventRegistration) {
  try {
    console.log('Submitting registration with secure setup:', formData);
    
    const { data, error } = await supabase
      .from('event_registrations')
      .insert([{
        ...formData,
        status: 'confirmed',
        created_at: new Date().toISOString()
      }]);
    
    if (error) {
      console.error('Error registering for event:', error);
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

// Function to view events (works for anonymous users)
export async function getEvents(): Promise<EventForDisplay[]> {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true });
    
    if (error) {
      console.error('Error fetching events:', error);
      return [];
    }
    
    if (!data || data.length === 0) {
      console.warn('No events found in database');
      return [];
    }
    
    console.log('Raw events from database:', data);
    
    // Map event types based on event titles for display
    const eventTypeMap: Record<string, string> = {
      'Caregiver Training Workshop': 'Workshop',
      'Memory Café Meetup': 'Support Group',
      'Therapy Session': 'Therapy',
      'Fundraiser Event': 'Fundraiser'
    };
    
    // Format the events for frontend display
    return data.map(event => {
      // Format time for display (e.g., "10:00 AM")
      const timeStr = event.time.substring(0, 5);
      const hour = parseInt(timeStr.split(':')[0]);
      const formattedTime = `${hour > 12 ? hour - 12 : hour}:${timeStr.split(':')[1]} ${hour >= 12 ? 'PM' : 'AM'}`;
      
      return {
        id: event.id,
        title: event.title,
        description: event.description,
        date: event.date,
        time: formattedTime,
        location: event.location,
        capacity: event.capacity,
        spots_available: event.spots_available,
        created_at: event.created_at,
        updated_at: event.updated_at,
        // UI specific properties
        type: eventTypeMap[event.title] || 'Event',
        spots: `${event.spots_available} ${event.spots_available === 1 ? 'spot' : 'spots'} left`
      };
    });
  } catch (err) {
    console.error('Failed to fetch events:', err);
    return [];
  }
}

// Function to get a single event by ID
export async function getEventById(eventId: string) {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', eventId)
    .single();
  
  if (error) {
    console.error('Error fetching event:', error);
    return null;
  }
  
  return data;
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
