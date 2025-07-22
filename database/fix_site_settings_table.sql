-- Fix site_settings table to ensure proper key constraints and structure

-- Check if the site_settings table exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'site_settings') THEN
        -- Create the table if it doesn't exist
        CREATE TABLE site_settings (
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            key TEXT UNIQUE NOT NULL,
            value JSONB NOT NULL,
            description TEXT,
            category TEXT DEFAULT 'general',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
        );
    ELSE
        -- If the table exists, ensure the key column has a unique constraint
        IF NOT EXISTS (
            SELECT 1 FROM pg_constraint 
            WHERE conname = 'site_settings_key_key' AND conrelid = 'site_settings'::regclass
        ) THEN
            ALTER TABLE site_settings ADD CONSTRAINT site_settings_key_key UNIQUE (key);
        END IF;
    END IF;
END $$;

-- Add RLS policies to allow admin users to manage site settings
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Policy to allow admins to manage site_settings
CREATE POLICY "Admins can manage site settings" 
ON site_settings 
FOR ALL 
TO authenticated
USING (auth.uid() IN (SELECT id FROM admin_users))
WITH CHECK (auth.uid() IN (SELECT id FROM admin_users));

-- Grant privileges to roles
GRANT ALL ON site_settings TO service_role;
GRANT SELECT ON site_settings TO authenticated;

-- Insert default settings if they don't exist
INSERT INTO site_settings (key, value, description, category)
VALUES 
    ('site_name', '"Shatam Care Foundation"', 'Name of the site', 'general'),
    ('site_description', '"Caring for Our Elderly with Compassion and Dignity"', 'Description of the site', 'general'),
    ('contact_email', '"shatamcare@gmail.com"', 'Primary contact email', 'contact'),
    ('contact_phone', '"91 9158566665"', 'Primary contact phone number', 'contact'),
    ('address', '"Mumbai, Maharashtra, India"', 'Physical address', 'contact'),
    ('facebook_url', '""', 'Facebook page URL', 'social'),
    ('twitter_url', '""', 'Twitter profile URL', 'social'),
    ('linkedin_url', '""', 'LinkedIn profile URL', 'social'),
    ('instagram_url', '""', 'Instagram profile URL', 'social'),
    ('from_name', '"Shatam Care Foundation"', 'Sender name for emails', 'email'),
    ('from_email', '"shatamcare@gmail.com"', 'Sender email address', 'email'),
    ('reply_to', '"shatamcare@gmail.com"', 'Reply-to email address', 'email'),
    ('enable_newsletter', 'true', 'Enable newsletter signup functionality', 'features'),
    ('enable_events', 'true', 'Enable event registration functionality', 'features'),
    ('enable_contact_form', 'true', 'Enable contact form functionality', 'features'),
    ('enable_donations', 'false', 'Enable donations functionality', 'features')
ON CONFLICT (key) DO NOTHING;
