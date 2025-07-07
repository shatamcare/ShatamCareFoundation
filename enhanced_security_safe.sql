-- ENHANCED SECURITY AND POLICIES (SAFE VERSION)
-- Run this after fixing data constraints with fix_data_constraints.sql

-- STEP 1: Create admin users table (for managing the system)
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- STEP 2: Add status and priority fields to existing tables (if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contacts' AND column_name = 'status') THEN
    ALTER TABLE contacts ADD COLUMN status TEXT DEFAULT 'new';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contacts' AND column_name = 'priority') THEN
    ALTER TABLE contacts ADD COLUMN priority TEXT DEFAULT 'normal';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contacts' AND column_name = 'assigned_to') THEN
    ALTER TABLE contacts ADD COLUMN assigned_to UUID REFERENCES admin_users(id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contacts' AND column_name = 'responded_at') THEN
    ALTER TABLE contacts ADD COLUMN responded_at TIMESTAMP WITH TIME ZONE;
  END IF;
END $$;

-- STEP 3: Add validation and constraints (safely)
DO $$ 
BEGIN
  -- Add email constraints if they don't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.constraint_column_usage WHERE constraint_name = 'contacts_valid_email') THEN
    ALTER TABLE contacts ADD CONSTRAINT contacts_valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.constraint_column_usage WHERE constraint_name = 'newsletter_valid_email') THEN
    ALTER TABLE newsletter_subscribers ADD CONSTRAINT newsletter_valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
  END IF;
  
  -- Add length constraints if they don't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.constraint_column_usage WHERE constraint_name = 'contacts_name_length') THEN
    ALTER TABLE contacts ADD CONSTRAINT contacts_name_length CHECK (char_length(name) >= 2 AND char_length(name) <= 100);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.constraint_column_usage WHERE constraint_name = 'contacts_message_length') THEN
    ALTER TABLE contacts ADD CONSTRAINT contacts_message_length CHECK (char_length(message) >= 10 AND char_length(message) <= 2000);
  END IF;
EXCEPTION
  WHEN check_violation THEN
    RAISE NOTICE 'Some constraints could not be added due to existing data. Please run fix_data_constraints.sql first.';
END $$;

-- STEP 4: Create rate limiting table
CREATE TABLE IF NOT EXISTS rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address INET,
  email TEXT,
  action TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- STEP 5: Enable RLS on new tables
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- STEP 6: Create comprehensive policies (drop existing ones first)

-- Admin users policies
DROP POLICY IF EXISTS "admin_users_authenticated_read" ON admin_users;
CREATE POLICY "admin_users_authenticated_read" ON admin_users
  FOR SELECT TO authenticated
  USING (auth.email() = email);

DROP POLICY IF EXISTS "admin_users_authenticated_update" ON admin_users;
CREATE POLICY "admin_users_authenticated_update" ON admin_users
  FOR UPDATE TO authenticated
  USING (auth.email() = email);

-- Enhanced contact policies
DROP POLICY IF EXISTS "contacts_admin_read" ON contacts;
CREATE POLICY "contacts_admin_read" ON contacts
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE email = auth.email() 
      AND role IN ('admin', 'manager')
    )
  );

DROP POLICY IF EXISTS "contacts_admin_update" ON contacts;
CREATE POLICY "contacts_admin_update" ON contacts
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE email = auth.email() 
      AND role IN ('admin', 'manager')
    )
  );

-- Newsletter subscribers policies
DROP POLICY IF EXISTS "newsletter_admin_read" ON newsletter_subscribers;
CREATE POLICY "newsletter_admin_read" ON newsletter_subscribers
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE email = auth.email() 
      AND role IN ('admin', 'manager')
    )
  );

-- Rate limiting policies
DROP POLICY IF EXISTS "rate_limits_insert" ON rate_limits;
CREATE POLICY "rate_limits_insert" ON rate_limits
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "rate_limits_admin_read" ON rate_limits;
CREATE POLICY "rate_limits_admin_read" ON rate_limits
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE email = auth.email() 
      AND role = 'admin'
    )
  );

-- STEP 7: Create functions for rate limiting
CREATE OR REPLACE FUNCTION check_rate_limit(
  p_email TEXT,
  p_action TEXT,
  p_limit INTEGER DEFAULT 5,
  p_window_minutes INTEGER DEFAULT 60
) RETURNS BOOLEAN AS $$
BEGIN
  -- Check if user has exceeded rate limit
  IF (
    SELECT COUNT(*) 
    FROM rate_limits 
    WHERE email = p_email 
    AND action = p_action 
    AND created_at > NOW() - INTERVAL '1 minute' * p_window_minutes
  ) >= p_limit THEN
    RETURN FALSE;
  END IF;
  
  -- Log this attempt
  INSERT INTO rate_limits (email, action) VALUES (p_email, p_action);
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- STEP 8: Create trigger for automatic timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at columns (if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contacts' AND column_name = 'updated_at') THEN
    ALTER TABLE contacts ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'newsletter_subscribers' AND column_name = 'updated_at') THEN
    ALTER TABLE newsletter_subscribers ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
END $$;

-- Create triggers (drop existing ones first)
DROP TRIGGER IF EXISTS update_contacts_updated_at ON contacts;
CREATE TRIGGER update_contacts_updated_at 
  BEFORE UPDATE ON contacts 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_newsletter_updated_at ON newsletter_subscribers;
CREATE TRIGGER update_newsletter_updated_at 
  BEFORE UPDATE ON newsletter_subscribers 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- STEP 9: Create views for reporting (drop existing ones first)
DROP VIEW IF EXISTS contact_summary;
CREATE VIEW contact_summary AS
SELECT 
  COALESCE(status, 'new') as status,
  COUNT(*) as count,
  AVG(EXTRACT(EPOCH FROM (responded_at - created_at))/3600) as avg_response_hours
FROM contacts 
GROUP BY status;

DROP VIEW IF EXISTS daily_submissions;
CREATE VIEW daily_submissions AS
SELECT 
  contact_date as date,
  contacts,
  COALESCE(newsletter_signups, 0) as newsletter_signups
FROM (
  SELECT 
    DATE(created_at) as contact_date,
    COUNT(*) as contacts
  FROM contacts
  GROUP BY DATE(created_at)
) c
LEFT JOIN (
  SELECT 
    DATE(created_at) as newsletter_date,
    COUNT(*) as newsletter_signups
  FROM newsletter_subscribers
  GROUP BY DATE(created_at)
) n ON c.contact_date = n.newsletter_date
ORDER BY contact_date DESC;

-- STEP 10: Insert sample admin user (if not exists)
INSERT INTO admin_users (email, name, role) 
SELECT 'shatamcare@gmail.com', 'Admin User', 'admin'
WHERE NOT EXISTS (SELECT 1 FROM admin_users WHERE email = 'shatamcare@gmail.com');

-- STEP 11: Grant permissions for functions and views
GRANT EXECUTE ON FUNCTION check_rate_limit TO anon, authenticated;
GRANT SELECT ON contact_summary TO authenticated;
GRANT SELECT ON daily_submissions TO authenticated;

-- STEP 12: Create backup/export function
CREATE OR REPLACE FUNCTION export_contacts_csv()
RETURNS TEXT AS $$
DECLARE
  result TEXT;
BEGIN
  -- Only admins can export
  IF NOT EXISTS (
    SELECT 1 FROM admin_users 
    WHERE email = auth.email() 
    AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  SELECT string_agg(
    format('%s,%s,%s,%s,%s,%s',
      quote_literal(name),
      quote_literal(email),
      quote_literal(COALESCE(phone, '')),
      quote_literal(left(message, 100)),
      quote_literal(COALESCE(status, 'new')),
      quote_literal(created_at::TEXT)
    ), E'\n'
  ) INTO result
  FROM contacts;
  
  RETURN 'name,email,phone,message,status,created_at' || E'\n' || COALESCE(result, '');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- STEP 13: Verify enhanced setup
SELECT 'Enhanced security setup complete!' as status;

-- Show final table info
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('contacts', 'newsletter_subscribers', 'admin_users', 'rate_limits')
ORDER BY table_name, ordinal_position;
