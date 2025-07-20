-- Final Permission Fix
-- This fixes the INSERT policy and ensures all operations work

BEGIN;

-- Fix the INSERT policy that's missing the admin check
DROP POLICY IF EXISTS "Admins can insert programs" ON programs;

CREATE POLICY "Admins can insert programs"
ON programs FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM admin_users 
        WHERE admin_users.id = auth.uid()
    )
);

-- Also ensure the service_role has full access (for admin operations)
GRANT ALL PRIVILEGES ON programs TO service_role;
GRANT ALL PRIVILEGES ON admin_users TO service_role;

-- Double-check that your specific user has admin access
DO $$
BEGIN
    -- Verify the specific admin user exists
    IF NOT EXISTS (
        SELECT 1 FROM admin_users 
        WHERE id = '57476614-a4b6-4f05-8781-aa09879be8ee'::uuid
    ) THEN
        INSERT INTO admin_users (id, email, name, role) 
        VALUES (
            '57476614-a4b6-4f05-8781-aa09879be8ee'::uuid,
            'adarshbalmuchu@gmail.com',
            'Adarsh Admin',
            'admin'
        );
        RAISE NOTICE 'Admin user added';
    ELSE
        RAISE NOTICE 'Admin user already exists';
    END IF;
END $$;

COMMIT;

-- Test the fix
SELECT 'Testing admin permissions for user:' as test;
SELECT '57476614-a4b6-4f05-8781-aa09879be8ee'::uuid = auth.uid() as is_current_user;
SELECT EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = '57476614-a4b6-4f05-8781-aa09879be8ee'::uuid
) as admin_exists;
