-- Complete cleanup and fresh setup for Supabase
-- Run this entire script in your Supabase SQL Editor

-- Step 1: Drop all existing tables and policies (cleanup)
-- This will remove everything and start fresh

-- Drop all policies first
DROP POLICY IF EXISTS "Allow contact submissions" ON contacts;
DROP POLICY IF EXISTS "Allow anonymous contact submissions" ON contacts;
DROP POLICY IF EXISTS "Allow authenticated contact submissions" ON contacts;
DROP POLICY IF EXISTS "View contacts for authenticated users" ON contacts;
DROP POLICY IF EXISTS "Allow newsletter signups" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Allow anonymous newsletter signups" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Allow authenticated newsletter signups" ON newsletter_subscribers;
DROP POLICY IF EXISTS "View subscribers for authenticated users" ON newsletter_subscribers;

-- Drop all tables
DROP TABLE IF EXISTS contacts CASCADE;
DROP TABLE IF EXISTS newsletter_subscribers CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS event_registrations CASCADE;

-- Step 2: Create fresh tables with proper structure

-- Create contacts table
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create newsletter_subscribers table
CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  source TEXT DEFAULT 'website',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create events table (for future use)
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  max_participants INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create event_registrations table (for future use)
CREATE TABLE event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Enable RLS on all tables
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

-- Step 4: Create RLS policies

-- Contacts table policies
CREATE POLICY "Allow anonymous contact submissions" ON contacts
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Allow authenticated contact submissions" ON contacts
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to read contacts" ON contacts
  FOR SELECT TO authenticated
  USING (true);

-- Newsletter subscribers table policies
CREATE POLICY "Allow anonymous newsletter signups" ON newsletter_subscribers
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Allow authenticated newsletter signups" ON newsletter_subscribers
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to read subscribers" ON newsletter_subscribers
  FOR SELECT TO authenticated
  USING (true);

-- Events table policies (public read, authenticated write)
CREATE POLICY "Allow public to read events" ON events
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Allow authenticated users to manage events" ON events
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- Event registrations table policies
CREATE POLICY "Allow anonymous event registrations" ON event_registrations
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Allow authenticated event registrations" ON event_registrations
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to read registrations" ON event_registrations
  FOR SELECT TO authenticated
  USING (true);

-- Step 5: Insert some sample data for testing (optional)
INSERT INTO events (title, description, date, location, max_participants) VALUES
  ('Memory Care Workshop', 'Learn about memory care techniques and strategies', '2025-08-15 10:00:00+00:00', 'Community Center', 50),
  ('Caregiver Support Group', 'Monthly support group for caregivers', '2025-08-20 18:00:00+00:00', 'Online', 100);

-- Verify tables were created successfully
SELECT 'Tables created successfully' as status;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
