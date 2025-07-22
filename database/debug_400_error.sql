-- Comprehensive bucket and policy analysis for 400 error debugging
-- Since bucket exists and is public but still getting 400 errors

-- 1. Verify bucket details
SELECT 
  id,
  name,
  public,
  created_at,
  updated_at,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets 
WHERE name = 'media';

-- 2. Check if RLS is enabled on storage.objects
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'objects' AND schemaname = 'storage';

-- 3. List all policies on storage.objects for media bucket
SELECT 
  policyname,
  cmd as command,
  qual as condition,
  roles
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage';

-- 4. Check storage configuration settings
SELECT name, setting 
FROM pg_settings 
WHERE name LIKE '%storage%' 
OR name LIKE '%rls%';

-- 5. Test if we can query storage.objects directly
SELECT COUNT(*) as total_files_in_media
FROM storage.objects 
WHERE bucket_id = 'media';

-- 6. Check for any files in the media bucket
SELECT 
  id,
  name,
  bucket_id,
  created_at,
  metadata->'size' as file_size
FROM storage.objects 
WHERE bucket_id = 'media'
LIMIT 5;

-- 7. Check database permissions for current role
SELECT 
  current_user as current_role,
  session_user as session_role,
  current_database() as current_db;

-- 8. Diagnostic recommendations based on results
SELECT 
  CASE 
    WHEN (SELECT COUNT(*) FROM storage.buckets WHERE name = 'media') = 0 
    THEN '❌ ISSUE: Media bucket does not exist - create it in dashboard'
    
    WHEN (SELECT public FROM storage.buckets WHERE name = 'media') = false 
    THEN '❌ ISSUE: Media bucket is not public - enable public access'
    
    WHEN (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage') = 0 
    THEN '⚠️ WARNING: No RLS policies found - may need basic policies'
    
    ELSE '✅ GOOD: Bucket exists, is public, and has policies'
  END as diagnosis,
  
  'Next steps:' as recommendations,
  
  CASE 
    WHEN (SELECT COUNT(*) FROM storage.buckets WHERE name = 'media') = 0 
    THEN 'Go to Supabase Dashboard → Storage → Create "media" bucket'
    
    WHEN (SELECT public FROM storage.buckets WHERE name = 'media') = false 
    THEN 'Edit media bucket → Check "Public bucket" option'
    
    WHEN (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage') = 0 
    THEN 'Run storage_ultra_minimal.sql to create basic policies'
    
    ELSE 'Check application environment variables and API keys'
  END as next_action;
