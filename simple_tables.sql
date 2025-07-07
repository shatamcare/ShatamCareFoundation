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

-- Allow anyone to insert contact forms
CREATE POLICY "Allow contact submissions" ON contacts
  FOR INSERT
  WITH CHECK (true);

-- Allow reading for authenticated users
CREATE POLICY "View contacts for authenticated users" ON contacts
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Enable RLS for newsletter_subscribers table
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anyone to subscribe to newsletter
CREATE POLICY "Allow newsletter signups" ON newsletter_subscribers
  FOR INSERT
  WITH CHECK (true);

-- Allow reading for authenticated users
CREATE POLICY "View subscribers for authenticated users" ON newsletter_subscribers
  FOR SELECT
  USING (auth.role() = 'authenticated');
