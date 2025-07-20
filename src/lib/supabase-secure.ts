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
  image_url?: string;
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

export interface Program {
  id: string;
  title: string;
  description: string;
  details: string;
  image_url?: string;
  icon: string;
  cta_text: string;
  impact_text: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ProgramForDisplay extends Program {
  image?: string;
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
      .eq('status', 'active') // Explicitly filter for active events
      .order('date', { ascending: true });
    
    if (error) {
      console.error('Error fetching events:', error);
      return [];
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    // Map event types based on event titles for display
    const eventTypeMap: Record<string, string> = {
      'Caregiver Training Workshop': 'Workshop',
      'Memory Café Meetup': 'Support Group',
      'Therapy Session': 'Therapy',
      'Fundraiser Event': 'Fundraiser'
    };
    
    // Format the events for frontend display with optimized processing
    return data.map(event => {
      // Optimized time formatting
      const [hour, minute] = event.time.substring(0, 5).split(':').map(Number);
      const formattedTime = hour > 12 
        ? `${hour - 12}:${minute.toString().padStart(2, '0')} PM`
        : `${hour}:${minute.toString().padStart(2, '0')} ${hour === 12 ? 'PM' : 'AM'}`;
      
      return {
        id: event.id,
        title: event.title,
        description: event.description,
        date: event.date,
        time: formattedTime,
        location: event.location,
        capacity: event.capacity,
        spots_available: event.spots_available,
        image_url: event.image_url, // Include the image_url from database
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

// Program Management Functions

// Function to get all active programs (works for anonymous users)
export async function getPrograms(): Promise<ProgramForDisplay[]> {
  try {
    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });
    
    if (error) {
      console.error('Error fetching programs:', error);
      return [];
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    // Format the programs for frontend display
    return data.map(program => ({
      ...program,
      // Add image property for compatibility with existing frontend
      image: program.image_url
    }));
  } catch (err) {
    console.error('Failed to fetch programs:', err);
    return [];
  }
}

// Function to get all programs (including inactive) for admin
export async function getAllPrograms(): Promise<Program[]> {
  try {
    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (error) {
      console.error('Error fetching all programs:', error);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error('Failed to fetch all programs:', err);
    return [];
  }
}

// Function to create a new program (admin only)
export async function createProgram(programData: Omit<Program, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const { data, error } = await supabase
      .from('programs')
      .insert([programData])
      .select();
    
    if (error) {
      console.error('Error creating program:', error);
      throw new Error(`Failed to create program: ${error.message}`);
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Program creation failed:', error);
    throw error;
  }
}

// Function to update a program (admin only)
export async function updateProgram(programId: string, updates: Partial<Program>) {
  try {
    console.log('Attempting to update program:', { programId, updates });
    
    const { data, error } = await supabase
      .from('programs')
      .update(updates)
      .eq('id', programId)
      .select();
    
    if (error) {
      console.error('Error updating program:', error);
      throw new Error(`Failed to update program: ${error.message}`);
    }
    
    if (!data || data.length === 0) {
      console.warn('No data returned from update. Program may not exist.');
      throw new Error('Program update failed - no data returned');
    }
    
    console.log('Program updated successfully:', data[0]);
    return { success: true, data: data[0] };
  } catch (error) {
    console.error('Program update failed:', error);
    throw error;
  }
}

// Function to delete a program (admin only)
export async function deleteProgram(programId: string) {
  try {
    console.log('Attempting to delete program with ID:', programId);
    
    const { data, error, count } = await supabase
      .from('programs')
      .delete()
      .eq('id', programId)
      .select();
    
    if (error) {
      console.error('Error deleting program:', error);
      throw new Error(`Failed to delete program: ${error.message}`);
    }
    
    console.log('Delete operation response:', { data, count });
    
    // Verify deletion was successful
    if (!data || data.length === 0) {
      console.warn('No rows were deleted. Program may not exist or permission denied.');
      throw new Error('No program was deleted. Please check if the program exists and you have permission.');
    }
    
    console.log('Program deleted successfully:', data[0]);
    return { success: true, deletedProgram: data[0] };
  } catch (error) {
    console.error('Program deletion failed:', error);
    throw error;
  }
}

// Function to get a single program by ID
export async function getProgramById(programId: string): Promise<Program | null> {
  try {
    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .eq('id', programId)
      .single();
    
    if (error) {
      console.error('Error fetching program:', error);
      return null;
    }
    
    return data;
  } catch (err) {
    console.error('Failed to fetch program:', err);
    return null;
  }
}
