# Supabase Setup Guide

This guide will help you set up Supabase for the Shatam Care Foundation website contact form and other backend features.

## Step 1: Create a Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Sign up for a free account
3. Create a new project

## Step 2: Get Your Project Credentials

1. Go to your project dashboard
2. Click on "Settings" in the left sidebar
3. Click on "API" 
4. Copy the following:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **anon/public key** (the "anon" key under "Project API keys")

## Step 3: Set Up Environment Variables

1. In your project root, create a `.env` file
2. Add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 4: Create Database Tables

1. Go to your Supabase dashboard
2. Click on "SQL Editor" in the left sidebar
3. Copy and paste the following SQL commands:

```sql
-- Create contacts table
CREATE TABLE contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'general' CHECK (type IN ('general', 'partnership', 'volunteer', 'media')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create newsletter subscribers table
CREATE TABLE newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  source TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  is_active BOOLEAN DEFAULT true
);

-- Create events table
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  location TEXT NOT NULL,
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  registration_fee DECIMAL(10,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create event registrations table
CREATE TABLE event_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  emergency_contact TEXT,
  medical_conditions TEXT,
  dietary_requirements TEXT,
  experience TEXT,
  motivation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create testimonials table
CREATE TABLE testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  location TEXT,
  program_attended TEXT,
  date_of_experience DATE,
  is_approved BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create donations table
CREATE TABLE donations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  donor_name TEXT NOT NULL,
  donor_email TEXT NOT NULL,
  donor_phone TEXT,
  amount DECIMAL(10,2) NOT NULL,
  purpose TEXT NOT NULL,
  donor_pan TEXT,
  donor_address TEXT,
  payment_id TEXT,
  payment_status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create impact statistics table
CREATE TABLE impact_statistics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name TEXT NOT NULL,
  metric_value INTEGER NOT NULL,
  year INTEGER NOT NULL,
  quarter INTEGER CHECK (quarter >= 1 AND quarter <= 4),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

## Step 5: Set Up Row Level Security (RLS)

For security, enable RLS on your tables:

```sql
-- Enable RLS on all tables
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE impact_statistics ENABLE ROW LEVEL SECURITY;

-- Allow public to insert into contacts table (for contact form)
CREATE POLICY "Allow public to insert contacts" ON contacts
  FOR INSERT TO anon
  WITH CHECK (true);

-- Allow public to read active events
CREATE POLICY "Allow public to read active events" ON events
  FOR SELECT TO anon
  USING (is_active = true);

-- Allow public to insert event registrations
CREATE POLICY "Allow public to insert event registrations" ON event_registrations
  FOR INSERT TO anon
  WITH CHECK (true);

-- Allow public to read approved testimonials
CREATE POLICY "Allow public to read approved testimonials" ON testimonials
  FOR SELECT TO anon
  USING (is_approved = true);

-- Allow public to insert newsletter subscriptions
CREATE POLICY "Allow public to insert newsletter subscriptions" ON newsletter_subscribers
  FOR INSERT TO anon
  WITH CHECK (true);

-- Allow public to read impact statistics
CREATE POLICY "Allow public to read impact statistics" ON impact_statistics
  FOR SELECT TO anon
  USING (true);
```

## Step 6: Add Sample Data (Optional)

For testing purposes, you can add sample data to your tables:

1. In your Supabase SQL Editor, run the SQL from `sample_data.sql`
2. This will create sample events, testimonials, and impact statistics that match your frontend

## Step 7: Test the Setup

1. Save your `.env` file
2. Restart your development server: `npm run dev`
3. Try submitting the contact form on your website
4. Check the "contacts" table in your Supabase dashboard to see if the data was inserted

## Step 8: Optional - Set Up Email Notifications

For advanced email notifications when forms are submitted, you can set up Supabase Edge Functions. This is optional but recommended for production.

## Troubleshooting

- **Environment variables not working**: Make sure your `.env` file is in the project root and restart your dev server
- **Database connection issues**: Double-check your Project URL and anon key
- **RLS policies blocking requests**: Review the RLS policies and make sure they allow public access for the required operations
- **CORS issues**: Supabase should handle CORS automatically for allowed origins

## Next Steps

Once this is working, you can:
1. Set up email notifications with Supabase Edge Functions
2. Add newsletter signup functionality
3. Implement event registration system
4. Add testimonial submission form
5. Integrate donation processing with payment gateways

For help, contact the development team or refer to the [Supabase documentation](https://supabase.com/docs).
