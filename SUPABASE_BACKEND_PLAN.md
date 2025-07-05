# Shatam Care Foundation - Supabase Backend Implementation

## 🎯 **Why Supabase is Perfect for Your Project**

### **Advantages of Supabase:**
✅ **Built-in Authentication** - User signup/login without custom code  
✅ **Real-time Database** - PostgreSQL with instant APIs  
✅ **Storage** - File uploads for images/documents  
✅ **Edge Functions** - Serverless functions for custom logic  
✅ **Built-in Email** - Authentication emails out of the box  
✅ **Dashboard** - Beautiful admin interface  
✅ **Free Tier** - Perfect for getting started  
✅ **TypeScript Support** - First-class TypeScript integration  

### **What Supabase Handles Automatically:**
- Database setup and management
- API generation (REST + GraphQL)
- Authentication (email, social login)
- Real-time subscriptions
- File storage and CDN
- Database backups
- SSL certificates

## 🗃️ **Database Schema Design for Supabase**

### **Tables to Create:**

#### **1. contacts**
```sql
CREATE TABLE contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(500),
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'general', -- 'general', 'partnership', 'volunteer', 'media'
  priority VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high'
  status VARCHAR(20) DEFAULT 'new', -- 'new', 'in-progress', 'resolved', 'closed'
  assigned_to UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **2. donations**
```sql
CREATE TABLE donations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  donor_name VARCHAR(255) NOT NULL,
  donor_email VARCHAR(255) NOT NULL,
  donor_phone VARCHAR(20),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  purpose VARCHAR(255), -- 'caregiver-training', 'brain-kit', etc.
  payment_method VARCHAR(50),
  transaction_id VARCHAR(255) UNIQUE,
  gateway_transaction_id VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'refunded'
  receipt_number VARCHAR(50) UNIQUE,
  receipt_generated BOOLEAN DEFAULT FALSE,
  receipt_url TEXT,
  is_recurring BOOLEAN DEFAULT FALSE,
  donor_pan VARCHAR(20), -- For 80G receipts
  donor_address TEXT,
  metadata JSONB, -- Store additional payment info
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);
```

#### **3. events**
```sql
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  event_time TIME,
  location VARCHAR(500),
  type VARCHAR(50), -- 'workshop', 'support-group', 'training', 'awareness'
  capacity INTEGER,
  registration_fee DECIMAL(8,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  image_url TEXT,
  facilitators TEXT[],
  requirements TEXT[],
  agenda TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **4. event_registrations**
```sql
CREATE TABLE event_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  emergency_contact VARCHAR(255),
  medical_conditions TEXT,
  dietary_requirements TEXT,
  experience TEXT,
  motivation TEXT,
  status VARCHAR(20) DEFAULT 'registered', -- 'registered', 'confirmed', 'attended', 'cancelled'
  payment_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'paid', 'waived'
  registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  confirmation_sent BOOLEAN DEFAULT FALSE,
  reminders_sent INTEGER DEFAULT 0
);
```

#### **5. testimonials**
```sql
CREATE TABLE testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(100), -- 'caregiver', 'family-member', 'healthcare-professional'
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  is_approved BOOLEAN DEFAULT FALSE,
  is_visible BOOLEAN DEFAULT TRUE,
  image_url TEXT,
  location VARCHAR(255),
  program_attended VARCHAR(255),
  date_of_experience DATE,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES auth.users(id)
);
```

#### **6. newsletter_subscribers**
```sql
CREATE TABLE newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  subscription_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  source VARCHAR(100), -- 'website', 'event', 'social'
  preferences JSONB DEFAULT '{"weeklyUpdates": true, "eventNotifications": true, "impactReports": true}',
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  unsubscribe_reason TEXT
);
```

#### **7. impact_statistics**
```sql
CREATE TABLE impact_statistics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  metric VARCHAR(100) UNIQUE NOT NULL, -- 'caregivers-trained', 'families-helped', etc.
  value INTEGER NOT NULL,
  description TEXT,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id),
  is_visible BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0
);
```

## 🚀 **Implementation Roadmap with Supabase**

### **Phase 1: Setup & Contact Forms (Week 1)**

#### **Day 1-2: Supabase Setup**
1. Create Supabase project
2. Set up database tables
3. Configure Row Level Security (RLS)
4. Set up environment variables

#### **Day 3-4: Contact Form Implementation**
1. Create contact form API using Supabase client
2. Set up email notifications with Supabase Edge Functions
3. Add form validation
4. Test email delivery

#### **Day 5-7: Integration with Frontend**
1. Install Supabase client in frontend
2. Replace mailto links with API calls
3. Add loading states and error handling
4. Test complete flow

### **Phase 2: Newsletter & Basic Admin (Week 2)**

#### **Newsletter Signup**
1. Create subscription form
2. Email verification flow
3. Unsubscribe functionality
4. Admin view of subscribers

#### **Basic Admin Dashboard**
1. Set up admin authentication
2. Contact message management
3. Newsletter subscriber management
4. Basic analytics

### **Phase 3: Events & Testimonials (Week 3)**

#### **Event Registration**
1. Dynamic event listing from database
2. Registration form with validation
3. Email confirmations
4. Admin event management

#### **Testimonial System**
1. Testimonial submission form
2. Admin approval workflow
3. Display approved testimonials
4. Moderation interface

### **Phase 4: Donations & Advanced Features (Week 4)**

#### **Payment Integration**
1. Razorpay integration with Supabase Edge Functions
2. Donation tracking
3. Receipt generation
4. Donor management

## 💻 **Technical Implementation**

### **Frontend Integration (React + Supabase)**

#### **Install Supabase Client**
```bash
npm install @supabase/supabase-js
```

#### **Supabase Configuration**
```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://your-project.supabase.co'
const supabaseAnonKey = 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

#### **Contact Form Implementation**
```typescript
// src/services/contactService.ts
import { supabase } from '@/lib/supabase'

export interface ContactFormData {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  type?: string
}

export const submitContactForm = async (data: ContactFormData) => {
  const { data: contact, error } = await supabase
    .from('contacts')
    .insert([{
      name: data.name,
      email: data.email,
      phone: data.phone,
      subject: data.subject,
      message: data.message,
      type: data.type || 'general'
    }])
    .select()

  if (error) {
    throw new Error(error.message)
  }

  return contact
}
```

#### **Newsletter Subscription**
```typescript
// src/services/newsletterService.ts
export const subscribeToNewsletter = async (email: string, name?: string) => {
  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .insert([{
      email,
      name,
      source: 'website'
    }])
    .select()

  if (error) {
    if (error.code === '23505') { // Unique constraint violation
      throw new Error('Email already subscribed')
    }
    throw new Error(error.message)
  }

  return data
}
```

### **Edge Functions for Email Notifications**

#### **Contact Form Email Function**
```typescript
// supabase/functions/send-contact-email/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  const { record } = await req.json()
  
  // Send email to admin
  const adminEmail = {
    to: 'shatamcare@gmail.com',
    subject: `New Contact Form: ${record.subject}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${record.name}</p>
      <p><strong>Email:</strong> ${record.email}</p>
      <p><strong>Phone:</strong> ${record.phone || 'Not provided'}</p>
      <p><strong>Subject:</strong> ${record.subject}</p>
      <p><strong>Message:</strong></p>
      <p>${record.message}</p>
    `
  }
  
  // Send auto-response to user
  const userEmail = {
    to: record.email,
    subject: 'Thank you for contacting Shatam Care Foundation',
    html: `
      <h2>Thank you for reaching out!</h2>
      <p>Dear ${record.name},</p>
      <p>We have received your message and will get back to you within 24 hours.</p>
      <p>Your message: "${record.subject}"</p>
      <p>Best regards,<br>Shatam Care Foundation Team</p>
    `
  }
  
  // Send emails using your preferred email service
  await sendEmails([adminEmail, userEmail])
  
  return new Response('OK')
})
```

### **Database Triggers and Functions**

#### **Auto-update timestamp trigger**
```sql
-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to tables that need auto-update
CREATE TRIGGER update_contacts_updated_at 
BEFORE UPDATE ON contacts 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 🔒 **Security Configuration**

### **Row Level Security (RLS) Policies**

#### **Contacts Table**
```sql
-- Enable RLS
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (for contact form)
CREATE POLICY "Anyone can insert contacts" ON contacts
  FOR INSERT WITH CHECK (true);

-- Only admins can read/update
CREATE POLICY "Only admins can read contacts" ON contacts
  FOR SELECT USING (auth.role() = 'admin');
```

#### **Testimonials Table**
```sql
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Anyone can insert testimonials
CREATE POLICY "Anyone can insert testimonials" ON testimonials
  FOR INSERT WITH CHECK (true);

-- Anyone can read approved testimonials
CREATE POLICY "Anyone can read approved testimonials" ON testimonials
  FOR SELECT USING (is_approved = true AND is_visible = true);

-- Only admins can update
CREATE POLICY "Only admins can update testimonials" ON testimonials
  FOR UPDATE USING (auth.role() = 'admin');
```

## 🎛️ **Admin Dashboard with Supabase**

### **Admin Authentication**
```typescript
// Admin login
const signInAsAdmin = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) throw error
  
  // Check if user has admin role
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', data.user.id)
    .single()
    
  if (profile?.role !== 'admin') {
    throw new Error('Unauthorized')
  }
  
  return data
}
```

### **Real-time Dashboard Updates**
```typescript
// Listen to new contacts in real-time
useEffect(() => {
  const channel = supabase
    .channel('contacts-changes')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'contacts' },
      (payload) => {
        // Update UI with new contact
        setContacts(prev => [payload.new, ...prev])
        // Show notification
        showNotification('New contact received!')
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}, [])
```

## 💰 **Cost Analysis: Supabase vs Custom Backend**

### **Supabase Pricing**
- **Free Tier**: 50,000 monthly active users, 500 MB database, 1 GB storage
- **Pro Tier**: $25/month - 100,000 users, 8 GB database, 100 GB storage
- **Perfect for NGO**: Start free, upgrade when needed

### **Custom Backend Costs**
- **Server**: $20-50/month
- **Database**: $15-30/month  
- **Email Service**: $10-20/month
- **Development Time**: 4-6 weeks
- **Total**: $45-100/month + development time

### **Supabase Advantages**
✅ **80% less development time**  
✅ **50% lower monthly costs**  
✅ **Built-in admin dashboard**  
✅ **Automatic scaling**  
✅ **Real-time features**  
✅ **Built-in authentication**  

## 🎯 **Next Steps with Supabase**

1. **Create Supabase Account** - Sign up at supabase.com
2. **Set up Database** - Create tables using the schemas above
3. **Configure RLS** - Set up security policies
4. **Install Client** - Add Supabase to your React project
5. **Implement Contact Form** - Start with the first feature

**Would you like me to:**
1. **Help you set up the Supabase project?**
2. **Create the actual implementation files?**
3. **Walk through the database setup?**
4. **Start with the contact form integration?**

Supabase will make your backend development **much faster and simpler** while giving you all the features you need! 🚀
