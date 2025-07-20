-- Quick Diagnostic Script
-- Run this first to understand your admin_users table structure

-- Check admin_users table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'admin_users' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check if your user exists
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'adarshbalmuchu@gmail.com';

-- Check current admin users
SELECT * FROM admin_users LIMIT 5;

-- Check existing data in admin_users
SELECT COUNT(*) as total_admins FROM admin_users;
