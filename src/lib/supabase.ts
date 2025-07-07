import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set correctly.'
  )
}

// Initialize Supabase client with proper error handling
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'Content-Type': 'application/json'
    }
  }
})

// Test connection on init
supabase.auth.getSession().catch(error => {
  console.error('Supabase connection error:', error)
})

// Database type definitions
export interface ContactFormData {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  type?: 'general' | 'partnership' | 'volunteer' | 'media'
}

export interface NewsletterSubscription {
  email: string
  name?: string
  source?: string
}

export interface EventRegistration {
  event_id: string
  name: string
  email: string
  phone: string
  emergency_contact?: string
  medical_conditions?: string
  dietary_requirements?: string
  experience?: string
  motivation?: string
  created_at?: string
  status?: 'pending' | 'confirmed' | 'waitlist'
}

// Helper function to check if Supabase is connected
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('health_check')
      .select('status')
      .single()
    
    if (error) throw error
    return { ok: true, data }
  } catch (error) {
    console.error('Supabase health check failed:', error)
    return { ok: false, error }
  }
}

// Utility function for error handling
export const handleSupabaseError = (error: any) => {
  if (error.code === '23505') {
    return 'This record already exists.'
  }
  if (error.code === 'PGRST116') {
    return 'Invalid input data. Please check your form entries.'
  }
  return 'An unexpected error occurred. Please try again.'
}

// Helper functions for database operations
export const insertContact = async (contactData: ContactFormData) => {
  const { data, error } = await supabase
    .from('contacts')
    .insert([{
      name: contactData.name,
      email: contactData.email,
      phone: contactData.phone || null,
      subject: contactData.subject,
      message: contactData.message,
      type: contactData.type || 'general',
      created_at: new Date().toISOString()
    }])
    .select()
  
  return { data, error }
}

export const subscribeToNewsletter = async (subscriptionData: NewsletterSubscription) => {
  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .insert([{
      email: subscriptionData.email,
      name: subscriptionData.name || null,
      source: subscriptionData.source || 'website',
      created_at: new Date().toISOString()
    }])
    .select()
  
  return { data, error }
}

export const registerForEvent = async (registrationData: EventRegistration) => {
  const { data, error } = await supabase
    .from('event_registrations')
    .insert([{
      event_id: registrationData.event_id,
      name: registrationData.name,
      email: registrationData.email,
      phone: registrationData.phone,
      emergency_contact: registrationData.emergency_contact || null,
      medical_conditions: registrationData.medical_conditions || null,
      dietary_requirements: registrationData.dietary_requirements || null,
      experience: registrationData.experience || null,
      motivation: registrationData.motivation || null,
      created_at: new Date().toISOString()
    }])
    .select()
  
  return { data, error }
}

export const getActiveEvents = async () => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('is_active', true)
    .order('date', { ascending: true })
  
  return { data, error }
}

export const getApprovedTestimonials = async () => {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('is_approved', true)
    .order('created_at', { ascending: false })
  
  return { data, error }
}
