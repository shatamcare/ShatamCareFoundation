# Database Setup Verification

## Quick Check: Are your tables created?

Run this SQL in your Supabase SQL Editor to check if tables exist:

```sql
-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('contacts', 'newsletter_subscribers', 'event_registrations', 'events', 'testimonials', 'donations', 'impact_statistics')
ORDER BY table_name;
```

Expected result should show all 7 tables:
- contacts
- donations  
- event_registrations
- events
- impact_statistics
- newsletter_subscribers
- testimonials

## If tables are missing, run this SQL:

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

## Set up RLS (Row Level Security):

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

## Test if everything works:

1. Go to your website
2. Look for the "Supabase Diagnostic Tool" section at the top
3. Click "Test Connection" - should show green success
4. Click "Test Insert" - should show green success
5. Check your Supabase dashboard > Table Editor > contacts - should see a test entry

## Common Issues:

1. **Table doesn't exist**: Run the CREATE TABLE statements above
2. **RLS blocking access**: Run the RLS policy statements above
3. **Wrong credentials**: Double-check your .env file
4. **Project inactive**: Check your Supabase project status
