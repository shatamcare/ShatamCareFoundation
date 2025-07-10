-- Public Registration Access Setup

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables if they don't exist (don't drop in production)
CREATE TABLE IF NOT EXISTS events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    time TIME NOT NULL,
    location TEXT NOT NULL,
    capacity INT NOT NULL,
    spots_available INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE TABLE IF NOT EXISTS event_registrations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_id UUID NOT NULL REFERENCES events(id),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    emergency_contact TEXT,
    medical_conditions TEXT,
    dietary_requirements TEXT,
    experience TEXT,
    motivation TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    UNIQUE(event_id, email)
);

-- Create an admin_users table to track admin privileges
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS "Public can view events" ON events;
DROP POLICY IF EXISTS "Admins can manage events" ON events;
DROP POLICY IF EXISTS "Anyone can register for events" ON event_registrations;
DROP POLICY IF EXISTS "Public can view their own registrations" ON event_registrations;
DROP POLICY IF EXISTS "Admins can manage all registrations" ON event_registrations;
DROP POLICY IF EXISTS "Only admins can access admin_users" ON admin_users;

-- Create RLS policies for events table
CREATE POLICY "Public can view events"
ON events FOR SELECT
TO authenticated, anon
USING (true);

CREATE POLICY "Admins can manage events"
ON events FOR ALL
TO authenticated
USING (
    auth.uid() IN (SELECT id FROM admin_users)
);

-- Create RLS policies for event_registrations table
-- Allow anyone (including anonymous users) to insert registrations
CREATE POLICY "Anyone can register for events"
ON event_registrations FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow users to view registrations by email (for both anon and authenticated)
CREATE POLICY "Public can view their own registrations"
ON event_registrations FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admins can manage all registrations"
ON event_registrations FOR ALL
TO authenticated
USING (
    auth.uid() IN (SELECT id FROM admin_users)
);

-- Create RLS policies for admin_users table
CREATE POLICY "Only admins can access admin_users"
ON admin_users FOR ALL
TO authenticated
USING (
    auth.uid() IN (SELECT id FROM admin_users)
);

-- Create a trigger to update spots_available when registrations change
CREATE OR REPLACE FUNCTION update_spots_available()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.status = 'confirmed' THEN
        -- Decrease spots when a confirmed registration is added
        UPDATE events
        SET spots_available = spots_available - 1
        WHERE id = NEW.event_id AND spots_available > 0;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.status != 'confirmed' AND NEW.status = 'confirmed' THEN
            -- Decrease spots when a registration is confirmed
            UPDATE events
            SET spots_available = spots_available - 1
            WHERE id = NEW.event_id AND spots_available > 0;
        ELSIF OLD.status = 'confirmed' AND NEW.status != 'confirmed' THEN
            -- Increase spots when a confirmed registration is cancelled
            UPDATE events
            SET spots_available = spots_available + 1
            WHERE id = NEW.event_id AND spots_available < capacity;
        END IF;
    ELSIF TG_OP = 'DELETE' AND OLD.status = 'confirmed' THEN
        -- Increase spots when a confirmed registration is deleted
        UPDATE events
        SET spots_available = spots_available + 1
        WHERE id = OLD.event_id AND spots_available < capacity;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for the update_spots_available function
DROP TRIGGER IF EXISTS update_spots_on_registration ON event_registrations;
CREATE TRIGGER update_spots_on_registration
AFTER INSERT OR UPDATE OR DELETE ON event_registrations
FOR EACH ROW EXECUTE FUNCTION update_spots_available();

-- Grant permissions to roles
-- For anon and authenticated users
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON events TO anon, authenticated;
GRANT SELECT, INSERT ON event_registrations TO anon, authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- For service_role (used by server-side operations)
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- Admin Management Functions

-- Function to add an admin user by email
CREATE OR REPLACE FUNCTION add_admin_by_email(admin_email TEXT)
RETURNS TEXT AS $$
DECLARE
    user_id UUID;
BEGIN
    -- Get the user ID from auth.users
    SELECT id INTO user_id
    FROM auth.users
    WHERE email = admin_email;
    
    IF user_id IS NULL THEN
        RETURN 'User not found with email: ' || admin_email;
    END IF;
    
    -- Insert into admin_users if not already an admin
    INSERT INTO admin_users (id)
    VALUES (user_id)
    ON CONFLICT (id) DO NOTHING;
    
    RETURN 'User added as admin: ' || admin_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if a user is an admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (SELECT EXISTS (
        SELECT 1 FROM admin_users
        WHERE id = auth.uid()
    ));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert sample data for testing
INSERT INTO events (title, description, date, time, location, capacity, spots_available)
VALUES
    ('Caregiver Workshop - July', 'Learn essential caregiving skills and techniques for dementia patients', '2025-07-20', '10:00:00', 'Shatam Care Center, Mumbai', 25, 25),
    ('Memory Café Meetup', 'Social gathering for people with dementia and their caregivers', '2025-08-05', '15:00:00', 'Community Hall, Delhi', 30, 30),
    ('Family Support Session', 'Support group for families of dementia patients', '2025-08-15', '18:00:00', 'Online Zoom Session', 50, 50)
ON CONFLICT DO NOTHING;
