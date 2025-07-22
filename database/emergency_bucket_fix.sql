-- URGENT: Run this to verify your actual Supabase project and bucket status
-- This will help identify if there's a project mismatch

-- 1. Show current project info
SELECT 
  current_database() as current_db,
  current_user as current_user,
  inet_server_addr() as server_ip;

-- 2. Show ALL storage buckets (not just media)
SELECT 
  id,
  name,
  public,
  created_at,
  owner,
  file_size_limit
FROM storage.buckets 
ORDER BY created_at DESC;

-- 3. Check storage configuration
SELECT 
  schemaname,
  tablename,
  tableowner,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'storage';

-- 4. If media bucket exists, show its exact details
SELECT 
  id,
  name,
  public,
  created_at,
  updated_at,
  owner,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets 
WHERE name = 'media';

-- 5. Show total file count in media bucket
SELECT COUNT(*) as file_count
FROM storage.objects 
WHERE bucket_id = 'media';

-- 6. Emergency: Create bucket if it doesn't exist
-- (This should show "already exists" if bucket is there)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,
  52428800, -- 50MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE SET 
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 7. Verify bucket creation/update
SELECT 
  id,
  name,
  public,
  created_at,
  'Bucket should exist now' as status
FROM storage.buckets 
WHERE name = 'media';
