-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Grant privileges to the anon role
DO $$
BEGIN
  GRANT USAGE ON SCHEMA public TO anon;
  GRANT USAGE ON SCHEMA public TO authenticated;
  GRANT USAGE ON SCHEMA public TO service_role;
  
  GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
  GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
  GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
  
  GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon;
  GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
  GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
  
  GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon;
  GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;
  GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role;
END $$;

-- Create events table first
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

-- Create event_registrations table
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

-- Create trigger to update spots_available
CREATE OR REPLACE FUNCTION update_spots_available()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.status = 'confirmed' THEN
        UPDATE events
        SET spots_available = spots_available - 1
        WHERE id = NEW.event_id AND spots_available > 0;
    ELSIF TG_OP = 'DELETE' AND OLD.status = 'confirmed' THEN
        UPDATE events
        SET spots_available = spots_available + 1
        WHERE id = OLD.event_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_spots_after_registration
AFTER INSERT OR DELETE ON event_registrations
FOR EACH ROW
EXECUTE FUNCTION update_spots_available();

-- Add RLS policies
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

-- Allow public read access to events
CREATE POLICY "Events are viewable by everyone"
ON events FOR SELECT
TO public
USING (true);

-- Allow anonymous users to insert registrations
CREATE POLICY "Anyone can register for events"
ON event_registrations FOR INSERT
TO anon
WITH CHECK (true);

-- Allow authenticated users to insert registrations
CREATE POLICY "Users can register for events"
ON event_registrations FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow anonymous users to view registrations
CREATE POLICY "Anonymous users can view registrations"
ON event_registrations FOR SELECT
TO anon
USING (true);

-- Allow authenticated users to view registrations
CREATE POLICY "Users can view registrations"
ON event_registrations FOR SELECT
TO authenticated
USING (true);
