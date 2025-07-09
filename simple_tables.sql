-- Simple table creation for immediate use
-- Run this first to get the basic functionality working

-- Create contacts table (simplified version)
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create newsletter_subscribers table (simplified version)
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  source TEXT DEFAULT 'website',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS for contacts table
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Clean up old policy first
DROP POLICY IF EXISTS "Allow contact submissions" ON contacts;

-- Allow anonymous users to insert contact forms
DROP POLICY IF EXISTS "Allow anonymous contact submissions" ON contacts;
CREATE POLICY "Allow anonymous contact submissions" ON contacts
  FOR INSERT TO anon WITH CHECK (true);

-- Allow authenticated users to insert contact forms
DROP POLICY IF EXISTS "Allow authenticated contact submissions" ON contacts;
CREATE POLICY "Allow authenticated contact submissions" ON contacts
  FOR INSERT TO authenticated WITH CHECK (true);


-- Allow reading for authenticated users
DROP POLICY IF EXISTS "View contacts for authenticated users" ON contacts;
CREATE POLICY "View contacts for authenticated users" ON contacts
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Enable RLS for newsletter_subscribers table
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Clean up old policy first
DROP POLICY IF EXISTS "Allow newsletter signups" ON newsletter_subscribers;

-- Allow anonymous users to subscribe
DROP POLICY IF EXISTS "Allow anonymous newsletter signups" ON newsletter_subscribers;
CREATE POLICY "Allow anonymous newsletter signups" ON newsletter_subscribers
  FOR INSERT TO anon WITH CHECK (true);

-- Allow authenticated users to subscribe
DROP POLICY IF EXISTS "Allow authenticated newsletter signups" ON newsletter_subscribers;
CREATE POLICY "Allow authenticated newsletter signups" ON newsletter_subscribers
  FOR INSERT TO authenticated WITH CHECK (true);


-- Allow reading for authenticated users
DROP POLICY IF EXISTS "View subscribers for authenticated users" ON newsletter_subscribers;
CREATE POLICY "View subscribers for authenticated users" ON newsletter_subscribers
  FOR SELECT
  USING (auth.role() = 'authenticated');
