-- Step-by-step diagnosis
-- Run each query one by one to identify the issue

-- Step 1: Check if you're authenticated
SELECT 'Step 1: Authentication check' as step;
SELECT auth.uid() as current_user_id;

-- Step 2: Check if auth.email() works
SELECT 'Step 2: Email check' as step;
SELECT auth.email() as current_user_email;

-- Step 3: Check if admin_users table exists and has data
SELECT 'Step 3: Admin users table' as step;
SELECT COUNT(*) as admin_users_count FROM admin_users;

-- Step 4: Check if your user is in admin_users
SELECT 'Step 4: Am I an admin?' as step;
SELECT EXISTS (
    SELECT 1 FROM admin_users WHERE id = auth.uid()
) as is_admin;

-- Step 5: Show all admin users
SELECT 'Step 5: All admin users' as step;
SELECT id, email, name, role FROM admin_users;
