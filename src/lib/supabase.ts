import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
}

export interface Event {
  id: string
  title: string
  description?: string
  date: string
  time: string
  location: string
  max_participants?: number
  current_participants?: number
  registration_fee?: number
  is_active?: boolean
}

export interface Testimonial {
  name: string
  role: string
  content: string
  rating: number
  location?: string
  program_attended?: string
  date_of_experience?: string
  is_approved?: boolean
  is_featured?: boolean
}

export interface Donation {
  donor_name: string
  donor_email: string
  donor_phone?: string
  amount: number
  purpose: string
  donor_pan?: string
  donor_address?: string
  payment_id?: string
  payment_status?: 'pending' | 'success' | 'failed'
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
