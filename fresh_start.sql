-- STEP 1: Complete cleanup - run this first
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

-- STEP 2: Create fresh tables - run this second
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

-- STEP 3: Enable RLS
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- STEP 4: Create simple policies for anonymous users
CREATE POLICY "contacts_insert_policy" ON contacts
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "newsletter_insert_policy" ON newsletter_subscribers
  FOR INSERT TO anon
  WITH CHECK (true);

-- STEP 5: Verify setup
SELECT 'Setup complete!' as status;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
