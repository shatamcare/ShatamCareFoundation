-- Test Programs Permissions
-- Run this to verify admin permissions are working

SELECT 'Current user authentication:' as test;
SELECT auth.uid() as user_id, auth.email() as user_email;

SELECT 'Admin status check:' as test;
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()) 
        THEN 'User IS an admin - permissions should work'
        ELSE 'User is NOT an admin - this is the problem'
    END as admin_status;

SELECT 'Admin users in table:' as test;
SELECT id, email, name, role FROM admin_users;

SELECT 'Programs table permissions test:' as test;
SELECT 
    has_table_privilege('programs', 'SELECT') as can_select,
    has_table_privilege('programs', 'INSERT') as can_insert,
    has_table_privilege('programs', 'UPDATE') as can_update,
    has_table_privilege('programs', 'DELETE') as can_delete;

SELECT 'RLS policies on programs:' as test;
SELECT policyname, cmd, permissive, roles, qual 
FROM pg_policies 
WHERE tablename = 'programs'
ORDER BY cmd;
