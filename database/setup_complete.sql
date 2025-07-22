-- Setup script for Supabase Storage and Database
-- Run this in your Supabase SQL Editor

-- 1. First, create the storage bucket (if it doesn't exist)
-- Note: This might need to be done via Supabase Dashboard > Storage

-- 2. Apply the complete admin schema
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Site Settings Table
CREATE TABLE IF NOT EXISTS site_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'general',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 2. Content Management Table
CREATE TABLE IF NOT EXISTS content_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('page', 'section', 'component')),
    page TEXT NOT NULL,
    section TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    meta_description TEXT,
    meta_keywords TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 3. Media Files Table
CREATE TABLE IF NOT EXISTS media_files (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    original_name TEXT NOT NULL,
    url TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('image', 'document', 'video', 'other')),
    mime_type TEXT NOT NULL,
    size INTEGER NOT NULL,
    category TEXT DEFAULT 'uncategorized',
    alt_text TEXT,
    description TEXT,
    uploaded_by UUID REFERENCES auth.users(id),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 4. Admin Activity Log Table
CREATE TABLE IF NOT EXISTS admin_activity_log (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    admin_id UUID NOT NULL REFERENCES auth.users(id),
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 5. Enhanced Admin Users Table (add missing columns)
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'editor'));
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS permissions JSONB DEFAULT '{}';

-- Enable Row Level Security on new tables
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for site_settings
DROP POLICY IF EXISTS "Admins can manage site settings" ON site_settings;
CREATE POLICY "Admins can manage site settings"
ON site_settings FOR ALL
TO authenticated
USING (auth.uid() IN (SELECT id FROM admin_users WHERE is_active = true));

DROP POLICY IF EXISTS "Public can view published settings" ON site_settings;
CREATE POLICY "Public can view published settings"
ON site_settings FOR SELECT
TO anon, authenticated
USING (category = 'public');

-- RLS Policies for content_items
DROP POLICY IF EXISTS "Admins can manage content" ON content_items;
CREATE POLICY "Admins can manage content"
ON content_items FOR ALL
TO authenticated
USING (auth.uid() IN (SELECT id FROM admin_users WHERE is_active = true));

DROP POLICY IF EXISTS "Public can view published content" ON content_items;
CREATE POLICY "Public can view published content"
ON content_items FOR SELECT
TO anon, authenticated
USING (status = 'published');

-- RLS Policies for media_files
DROP POLICY IF EXISTS "Admins can manage media" ON media_files;
CREATE POLICY "Admins can manage media"
ON media_files FOR ALL
TO authenticated
USING (auth.uid() IN (SELECT id FROM admin_users WHERE is_active = true));

DROP POLICY IF EXISTS "Public can view media" ON media_files;
CREATE POLICY "Public can view media"
ON media_files FOR SELECT
TO anon, authenticated
USING (true);

-- RLS Policies for admin_activity_log
DROP POLICY IF EXISTS "Admins can view activity log" ON admin_activity_log;
CREATE POLICY "Admins can view activity log"
ON admin_activity_log FOR SELECT
TO authenticated
USING (auth.uid() IN (SELECT id FROM admin_users WHERE role IN ('super_admin', 'admin')));

DROP POLICY IF EXISTS "System can insert activity log" ON admin_activity_log;
CREATE POLICY "System can insert activity log"
ON admin_activity_log FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IN (SELECT id FROM admin_users WHERE is_active = true));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(key);
CREATE INDEX IF NOT EXISTS idx_site_settings_category ON site_settings(category);
CREATE INDEX IF NOT EXISTS idx_content_items_page ON content_items(page);
CREATE INDEX IF NOT EXISTS idx_content_items_status ON content_items(status);
CREATE INDEX IF NOT EXISTS idx_content_items_type ON content_items(type);
CREATE INDEX IF NOT EXISTS idx_media_files_type ON media_files(type);
CREATE INDEX IF NOT EXISTS idx_media_files_category ON media_files(category);
CREATE INDEX IF NOT EXISTS idx_admin_activity_admin_id ON admin_activity_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_created_at ON admin_activity_log(created_at);

-- Update triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_site_settings_updated_at ON site_settings;
CREATE TRIGGER update_site_settings_updated_at 
    BEFORE UPDATE ON site_settings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_content_items_updated_at ON content_items;
CREATE TRIGGER update_content_items_updated_at 
    BEFORE UPDATE ON content_items 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default site settings
INSERT INTO site_settings (key, value, description, category) VALUES
('site_name', '"Shatam Care Foundation"', 'Website name', 'general'),
('site_description', '"Caring for Our Elderly with Compassion and Dignity"', 'Website description', 'general'),
('contact_email', '"shatamcare@gmail.com"', 'Main contact email', 'contact'),
('contact_phone', '"+91 9158566665"', 'Main contact phone', 'contact'),
('address', '"Mumbai, Maharashtra, India"', 'Organization address', 'contact'),
('facebook_url', '""', 'Facebook page URL', 'social'),
('twitter_url', '""', 'Twitter profile URL', 'social'),
('linkedin_url', '""', 'LinkedIn profile URL', 'social'),
('instagram_url', '""', 'Instagram profile URL', 'social'),
('enable_newsletter', 'true', 'Enable newsletter signup', 'features'),
('enable_events', 'true', 'Enable event registration', 'features'),
('enable_contact_form', 'true', 'Enable contact form', 'features'),
('enable_donations', 'false', 'Enable donation system', 'features'),
('from_name', '"Shatam Care Foundation"', 'Email from name', 'email'),
('from_email', '"shatamcare@gmail.com"', 'Email from address', 'email'),
('reply_to', '"shatamcare@gmail.com"', 'Email reply-to address', 'email')
ON CONFLICT (key) DO NOTHING;

-- Insert default content items
INSERT INTO content_items (title, content, type, page, section, status) VALUES
('Hero Title', 'Caring for Our Elderly with Compassion and Dignity', 'section', 'home', 'hero', 'published'),
('Hero Subtitle', 'Shatam Care Foundation is dedicated to improving the quality of life for elderly individuals through comprehensive care, support services, and community engagement.', 'section', 'home', 'hero', 'published'),
('About Us Title', 'About Shatam Care Foundation', 'section', 'about', 'intro', 'published'),
('About Us Content', 'We are committed to providing exceptional care and support for elderly individuals and their families. Our comprehensive approach includes medical care, social activities, and emotional support.', 'section', 'about', 'intro', 'published'),
('Mission Statement', 'To enhance the quality of life for elderly individuals through compassionate care, innovative programs, and community support.', 'section', 'about', 'mission', 'published'),
('Vision Statement', 'A world where every elderly person lives with dignity, purpose, and joy.', 'section', 'about', 'vision', 'published')
ON CONFLICT DO NOTHING;

-- Create function to log admin activity
CREATE OR REPLACE FUNCTION log_admin_activity(
    p_admin_id UUID,
    p_action TEXT,
    p_resource_type TEXT,
    p_resource_id TEXT DEFAULT NULL,
    p_details JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    activity_id UUID;
BEGIN
    INSERT INTO admin_activity_log (admin_id, action, resource_type, resource_id, details)
    VALUES (p_admin_id, p_action, p_resource_type, p_resource_id, p_details)
    RETURNING id INTO activity_id;
    
    RETURN activity_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Storage bucket policies (run these after creating the 'media' bucket)
-- These need to be run separately after the bucket is created

/*
-- Storage policies for media bucket (run after bucket creation)

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'media');

-- Allow authenticated users to update files they uploaded
CREATE POLICY "Users can update own media"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'media' AND auth.uid()::text = owner);

-- Allow authenticated users to delete files they uploaded
CREATE POLICY "Users can delete own media"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'media' AND auth.uid()::text = owner);

-- Allow public read access to media files
CREATE POLICY "Public can view media"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'media');

*/
