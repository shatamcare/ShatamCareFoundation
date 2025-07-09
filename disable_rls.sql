-- EMERGENCY BACKUP - Disable RLS completely
-- Use this ONLY if the other approach doesn't work
-- This is less secure but will definitely work for testing

-- Disable RLS on existing tables
ALTER TABLE contacts DISABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers DISABLE ROW LEVEL SECURITY;

-- Grant all permissions to anon role
GRANT ALL ON contacts TO anon;
GRANT ALL ON newsletter_subscribers TO anon;

-- Test
SELECT 'RLS disabled - forms should work now' as status;
