-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop any existing tables (careful with this in production)
DROP TABLE IF EXISTS event_registrations;
DROP TABLE IF EXISTS events;

-- Create events table first
CREATE TABLE events (
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

-- Create event_registrations table
CREATE TABLE event_registrations (
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

-- Create trigger to update spots_available when registrations change
CREATE OR REPLACE FUNCTION update_spots_available()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Decrease spots when a registration is added
        UPDATE events
        SET spots_available = spots_available - 1
        WHERE id = NEW.event_id AND spots_available > 0;
    ELSIF TG_OP = 'DELETE' THEN
        -- Increase spots when a registration is deleted
        UPDATE events
        SET spots_available = spots_available + 1
        WHERE id = OLD.event_id AND spots_available < capacity;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to execute the function
CREATE TRIGGER update_spots_after_registration
AFTER INSERT OR DELETE ON event_registrations
FOR EACH ROW
EXECUTE FUNCTION update_spots_available();

-- Turn off Row Level Security for development
ALTER TABLE events DISABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations DISABLE ROW LEVEL SECURITY;

-- Grant all privileges to anon role
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO service_role;

GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- Insert some sample data
INSERT INTO events (
    title, 
    description, 
    date, 
    time, 
    location, 
    capacity, 
    spots_available
) VALUES (
    'Caregiver Training Workshop',
    'A comprehensive workshop for new caregivers to learn essential skills.',
    '2025-08-15',
    '10:00:00',
    'Shatam Care Center, Mumbai',
    30,
    30
);

INSERT INTO events (
    title, 
    description, 
    date, 
    time, 
    location, 
    capacity, 
    spots_available
) VALUES (
    'Memory Café Meetup',
    'Monthly gathering for people with dementia and their caregivers.',
    '2025-07-30',
    '16:00:00',
    'Community Center, Delhi',
    25,
    25
);
