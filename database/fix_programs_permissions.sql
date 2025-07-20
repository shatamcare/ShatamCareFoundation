-- Fix Programs Permissions Script
-- This script fixes the RLS policies and admin permissions for programs

BEGIN;

-- First, let's check what we're working with
DO $$
DECLARE
    user_uuid UUID;
    user_email TEXT;
    admin_exists BOOLEAN;
BEGIN
    -- Get current user details
    SELECT id, email INTO user_uuid, user_email
    FROM auth.users 
    WHERE email = 'adarshbalmuchu@gmail.com';
    
    RAISE NOTICE 'Found user: % with ID: %', user_email, user_uuid;
    
    -- Check if admin_users table exists and has the user
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'admin_users') THEN
        SELECT EXISTS (
            SELECT 1 FROM admin_users WHERE id = user_uuid
        ) INTO admin_exists;
        
        IF admin_exists THEN
            RAISE NOTICE 'User is already an admin';
        ELSE
            RAISE NOTICE 'User is NOT in admin_users table - this is the problem!';
            -- Try to add the user as admin
            INSERT INTO admin_users (id, email, name, role) 
            VALUES (user_uuid, user_email, 'Adarsh Admin', 'admin')
            ON CONFLICT (id) DO UPDATE SET
                email = EXCLUDED.email,
                name = EXCLUDED.name,
                role = EXCLUDED.role;
            RAISE NOTICE 'Added user to admin_users table';
        END IF;
    ELSE
        RAISE NOTICE 'admin_users table does not exist!';
    END IF;
END $$;

-- Drop and recreate the admin policy with better logic
DROP POLICY IF EXISTS "Admins can manage programs" ON programs;

-- Create a more permissive admin policy that should work
CREATE POLICY "Admins can manage programs"
ON programs FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM admin_users 
        WHERE admin_users.id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM admin_users 
        WHERE admin_users.id = auth.uid()
    )
);

-- Also create individual policies for each operation to be more explicit
DROP POLICY IF EXISTS "Admins can insert programs" ON programs;
DROP POLICY IF EXISTS "Admins can update programs" ON programs;
DROP POLICY IF EXISTS "Admins can delete programs" ON programs;

CREATE POLICY "Admins can insert programs"
ON programs FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM admin_users 
        WHERE admin_users.id = auth.uid()
    )
);

CREATE POLICY "Admins can update programs"
ON programs FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM admin_users 
        WHERE admin_users.id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM admin_users 
        WHERE admin_users.id = auth.uid()
    )
);

CREATE POLICY "Admins can delete programs"
ON programs FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM admin_users 
        WHERE admin_users.id = auth.uid()
    )
);

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON programs TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Test the setup
SELECT 'Testing admin permissions...' as status;
SELECT auth.uid() as current_user_id;
SELECT COUNT(*) as admin_count FROM admin_users WHERE id = auth.uid();

COMMIT;

-- Final verification queries
SELECT 'Final verification:' as info;
SELECT 'Programs count:' as info, COUNT(*) as count FROM programs;
SELECT 'Admin users count:' as info, COUNT(*) as count FROM admin_users;
SELECT 'RLS enabled on programs:' as info, relrowsecurity FROM pg_class WHERE relname = 'programs';
