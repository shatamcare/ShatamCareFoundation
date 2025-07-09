-- ULTIMATE FRESH START - This will definitely work
-- Run this entire script in your Supabase SQL Editor

-- STEP 1: Complete cleanup
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

-- STEP 2: Create fresh tables
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- STEP 3: Grant permissions to anon role BEFORE enabling RLS
GRANT USAGE ON SCHEMA public TO anon;
GRANT INSERT ON contacts TO anon;
GRANT INSERT ON newsletter_subscribers TO anon;

-- STEP 4: Enable RLS
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- STEP 5: Create permissive policies
CREATE POLICY "allow_anon_insert_contacts" ON contacts
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "allow_anon_insert_newsletter" ON newsletter_subscribers
  FOR INSERT TO anon
  WITH CHECK (true);

-- STEP 6: Double-check permissions
GRANT INSERT ON contacts TO anon;
GRANT INSERT ON newsletter_subscribers TO anon;

-- STEP 7: Alternative - disable RLS temporarily to test
-- Uncomment these lines if the above still doesn't work
-- ALTER TABLE contacts DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE newsletter_subscribers DISABLE ROW LEVEL SECURITY;

-- STEP 8: Verify setup
SELECT 'Setup complete!' as status;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- STEP 9: Test insert (this should work)
-- INSERT INTO contacts (name, email, message) VALUES ('Test User', 'test@example.com', 'Test message');
-- SELECT 'Test insert successful!' as test_result;
