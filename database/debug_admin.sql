-- Debug admin permissions
SELECT 'Current authenticated user:' as info;
SELECT auth.uid() as current_user_id, auth.email() as current_email;

SELECT 'Admin users table:' as info;
SELECT * FROM admin_users;

SELECT 'Auth users table:' as info;
SELECT id, email FROM auth.users WHERE email = 'adarshbalmuchu@gmail.com';

SELECT 'RLS policies on programs:' as info;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'programs';

SELECT 'Check if current user is admin:' as info;
SELECT EXISTS (
    SELECT 1 FROM admin_users WHERE id = auth.uid()
) as is_current_user_admin;
