// Import the supabase client
import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client with anon key
const supabase = createClient(
  'https://uumavtvxuncetfqwlgvp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1bWF2dHZ4dW5jZXRmcXdsZ3ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MjM2NTQsImV4cCI6MjA2NzI5OTY1NH0.AAoykuZmtZ3gLtbAXLjlYkyqaVUsghx84CP9nF1xkHU'
);

// Function to get events from database
async function getEvents() {
  const { data, error } = await supabase
    .from('events')
    .select('*');
  
  if (error) {
    console.error('Error fetching events:', error);
    return [];
  }
  
  console.log('Events from database:', data);
  return data;
}

// Function to get formatted events similar to the frontend display
async function getFormattedEvents() {
  const events = await getEvents();
  
  if (!events || events.length === 0) {
    return [];
  }
  
  // Format events like the frontend does
  return events.map(event => {
    // Format time for display (e.g., "10:00 AM")
    const timeStr = event.time.substring(0, 5);
    const hour = parseInt(timeStr.split(':')[0]);
    const formattedTime = `${hour > 12 ? hour - 12 : hour}:${timeStr.split(':')[1]} ${hour >= 12 ? 'PM' : 'AM'}`;
    
    // Map event types based on event titles
    const eventType = 
      event.title.includes('Training') ? 'Workshop' : 
      event.title.includes('Café') ? 'Support Group' : 'Event';
    
    return {
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.date,
      time: formattedTime,
      location: event.location,
      type: eventType,
      spots: `${event.spots_available} ${event.spots_available === 1 ? 'spot' : 'spots'} left`
    };
  });
}

async function registerForEvent(testRegistration) {
  try {
    console.log('Testing registration with:', testRegistration);
    
    const { data, error } = await supabase
      .from('event_registrations')
      .insert([testRegistration])
      .select();
    
    if (error) {
      console.error('Error registering for event:', error);
      return { success: false, error };
    }
    
    console.log('Registration successful:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Registration failed:', error);
    return { success: false, error };
  }
}

// Run tests
async function runTests() {
  console.log('Fetching events...');
  const events = await getEvents();
  
  console.log('Current events in database:', JSON.stringify(events, null, 2));
  console.log('-----------------------------------');

  // Get formatted events (how they will appear in the frontend)
  const formattedEvents = await getFormattedEvents();
  console.log('Formatted events for frontend:');
  formattedEvents.forEach(event => {
    console.log(`  - ${event.title} (${event.type})`);
    console.log(`    ID: ${event.id}`);
    console.log(`    Date: ${event.date}, Time: ${event.time}`);
    console.log(`    Location: ${event.location}`);
    console.log(`    ${event.spots}`);
    console.log('');
  });
  console.log('-----------------------------------');

  // Get current registrations
  const { data: currentRegistrations, error: registrationError } = await supabase
    .from('event_registrations')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);
  
  if (registrationError) {
    console.error('Error fetching current registrations:', registrationError);
  } else {
    console.log('Recent registrations:', JSON.stringify(currentRegistrations, null, 2));
    console.log('-----------------------------------');
  }
  
  if (events && events.length > 0) {
    // Use a real event ID from the database
    const realEventId = events[0].id;
    console.log('Using real event ID:', realEventId);
    
    // Test registration with a real event ID
    const realRegistration = {
      event_id: realEventId,
      name: 'Test User',
      email: `test${Date.now()}@example.com`, // Use unique email to avoid conflicts
      phone: '1234567890',
      emergency_contact: '0987654321',
      medical_conditions: 'None',
      dietary_requirements: 'None',
      experience: 'None',
      motivation: 'Testing',
      status: 'pending'
    };
    
    console.log('Attempting registration with valid ID:', realRegistration);
    const result = await registerForEvent(realRegistration);
    console.log('Registration result:', result);
    console.log('-----------------------------------');
    
    // Check spots_available after registration
    const { data: updatedEvent } = await supabase
      .from('events')
      .select('*')
      .eq('id', realEventId)
      .single();
    
    if (updatedEvent) {
      console.log('Updated event spots:', updatedEvent.spots_available);
    }
  }
  
  // Test with an invalid UUID
  const invalidRegistration = {
    event_id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Test User 2',
    email: `test${Date.now()+1}@example.com`, // Use unique email to avoid conflicts
    phone: '1234567890',
    emergency_contact: '0987654321',
    medical_conditions: 'None',
    dietary_requirements: 'None',
    experience: 'None',
    motivation: 'Testing with invalid ID',
    status: 'pending'
  };
  
  console.log('Attempting registration with invalid ID:', invalidRegistration);
  const invalidResult = await registerForEvent(invalidRegistration);
  console.log('Invalid registration result:', invalidResult);
}

runTests().catch(console.error);
