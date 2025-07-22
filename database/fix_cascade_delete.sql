-- Fix Event Deletion Issues with Proper Cascade Delete
-- This script adds proper foreign key constraints with CASCADE DELETE

-- First, drop the existing foreign key constraint
ALTER TABLE event_registrations 
DROP CONSTRAINT IF EXISTS event_registrations_event_id_fkey;

-- Add the foreign key constraint with CASCADE DELETE
ALTER TABLE event_registrations 
ADD CONSTRAINT event_registrations_event_id_fkey 
FOREIGN KEY (event_id) 
REFERENCES events(id) 
ON DELETE CASCADE;

-- Verify the constraint
SELECT 
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    rc.delete_rule
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
JOIN information_schema.referential_constraints AS rc
    ON tc.constraint_name = rc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name = 'event_registrations'
    AND kcu.column_name = 'event_id';
